// Runs axe-core against every generated page of the docs site, once per
// country pack and once with the neutral core. Any WCAG 2.1 A or AA violation
// fails the run. Also checks touch targets at phone width and the nav toggle.
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readdirSync, statSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join, relative } from "node:path";
import { ROOT, listPacks } from "../scripts/tokens.mjs";

const DOCS = join(ROOT, "docs");

function pages(dir = DOCS, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name !== "dist") pages(full, out);
    } else if (name.endsWith(".html")) out.push(relative(DOCS, full));
  }
  return out.sort();
}

const urlFor = (page, pack) => `${pathToFileURL(join(DOCS, page)).href}?pack=${pack}`;
const modes = ["core", ...listPacks()];
const all = pages();

for (const page of all) {
  for (const pack of modes) {
    test(`${page} has no axe violations with the ${pack} pack`, async ({ page: p }) => {
      await p.goto(urlFor(page, pack));
      await p.waitForSelector(".ag-js");
      const results = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
      );
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }

  test(`${page}: every interactive element is at least 44px tall at phone width`, async ({ page: p }) => {
    await p.setViewportSize({ width: 375, height: 800 });
    await p.goto(urlFor(page, "core"));
    await p.waitForSelector(".ag-js");
    const small = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll("a[href], button, input, select, textarea, summary").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return; // hidden
        if (el.closest(".ag-prose, p, li, td, th, dd, .docs-fine, .docs-content > ul, .docs-content > ol")) return; // inline links exempt under 2.5.8
        // A radio or checkbox inherits its target from the wrapping label.
        const label = el.matches("input[type=radio], input[type=checkbox]") ? el.closest("label") : null;
        const height = label ? label.getBoundingClientRect().height : r.height;
        if (height < 44) out.push(`${el.tagName.toLowerCase()}.${el.className} ${Math.round(height)}px`);
      });
      return out;
    });
    expect(small, small.join("\n")).toEqual([]);
  });
}

test("header navigation collapses on small screens and toggles with the menu button", async ({ page: p }) => {
  await p.setViewportSize({ width: 375, height: 800 });
  await p.goto(urlFor("index.html", "core"));
  await p.waitForSelector(".ag-js");
  const nav = p.locator("#site-nav");
  const button = p.locator("[data-ag-toggle]");
  await expect(nav).toBeHidden();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.click();
  await expect(nav).toBeVisible();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await p.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(button).toBeFocused();
});

test("the country choice is remembered across pages", async ({ page: p }) => {
  await p.goto(urlFor("index.html", "ke"));
  await p.waitForSelector(".ag-js");
  await p.goto(pathToFileURL(join(DOCS, "components", "button.html")).href);
  await p.waitForSelector(".ag-js");
  await expect(p.locator("html")).toHaveAttribute("data-ag-pack", "ke");
});

test("region selector narrows the sub-region list to the chosen region", async ({ page: p }) => {
  await p.goto(`${pathToFileURL(join(DOCS, "components", "region.html")).href}?pack=ng`);
  await p.waitForSelector(".ag-js");
  const first = p.locator("#rg-region");
  const second = p.locator("#rg-sub");
  await expect(second.locator("optgroup")).toHaveCount(6);
  await first.selectOption("Lagos");
  const visible = await second.locator("optgroup:not([hidden])").evaluateAll((gs) => gs.map((g) => g.label));
  expect(visible).toEqual(["Lagos"]);
  await second.selectOption("Ikeja");
  await first.selectOption("Kano");
  await expect(second).toHaveValue("");
});

test("character count reports remaining characters and flags going over", async ({ page: p }) => {
  await p.goto(`${pathToFileURL(join(DOCS, "components", "character-count.html")).href}?pack=core`);
  await p.waitForSelector(".ag-js");
  const field = p.locator("#cc-notes");
  const message = p.locator("#cc-notes-count");
  await expect(message).toHaveText("You have 200 characters remaining");
  await field.fill("x".repeat(205));
  await expect(message).toHaveText("You are 5 characters over the limit");
  await expect(message).toHaveClass(/ag-char-count__message--over/);
});

test("a right-to-left pack mirrors the examples", async ({ page: p }) => {
  await p.setViewportSize({ width: 375, height: 800 });
  await p.goto(`${pathToFileURL(join(DOCS, "components", "header.html")).href}?pack=ma`);
  await p.waitForSelector(".ag-js");
  const preview = p.locator(".docs-example__preview").first();
  await expect(preview).toHaveAttribute("dir", "rtl");
  await expect(preview).toHaveAttribute("lang", "ar");
  const borders = await preview
    .locator('.ag-nav__link[aria-current="page"]')
    .evaluate((el) => [getComputedStyle(el).borderRightWidth, getComputedStyle(el).borderLeftWidth]);
  expect(borders).toEqual(["4px", "0px"]);
});
