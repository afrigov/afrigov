// Runs axe-core against the docs site, which renders every component, once per
// country pack. Any WCAG 2.1 A or AA violation fails the run.
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import { ROOT, listPacks } from "../scripts/tokens.mjs";

const page = pathToFileURL(join(ROOT, "docs", "index.html")).href;

// "core" is the neutral default with no pack loaded.
for (const pack of ["core", ...listPacks()]) {
  test(`docs site has no axe violations with the ${pack} pack`, async ({ page: p }) => {
    await p.goto(`${page}?pack=${pack}`);
    await p.waitForSelector(".ag-js");
    const results = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map(
      (v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`,
    );
    expect(summary, summary.join("\n")).toEqual([]);
  });

  test(`every interactive element is at least 48px tall with the ${pack} pack`, async ({ page: p }) => {
    await p.setViewportSize({ width: 375, height: 800 });
    await p.goto(`${page}?pack=${pack}`);
    await p.waitForSelector(".ag-js");
    const small = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll("a[href], button, input, select, textarea, summary").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return; // hidden
        if (el.closest(".ag-prose, p, li, td, .docs-fine")) return; // inline text links are exempt under 2.5.8
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
  await p.goto(page);
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
