// A header that wraps by accident makes the page taller on some screens and not others.
// The docs site and every page template must keep the brand and navigation on one row at desktop widths.
import { test, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readdirSync } from "node:fs";

const docs = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");
const templates = readdirSync(join(docs, "templates")).filter((f) => f.endsWith(".html"));
const pages = ["index.html", "use-cases.html", "components/header.html", ...templates.map((t) => `templates/${t}`)];

for (const width of [1024, 1280]) {
  for (const page of pages) {
    test(`${page}: the header is one row at ${width}px`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 700 } });
      const tab = await context.newPage();
      await tab.goto("file://" + join(docs, page));
      const rows = await tab.evaluate(() => {
        // The page's own header: the first one that is not inside a documentation example.
        const header = [...document.querySelectorAll(".ag-header")].find((h) => !h.closest(".docs-example"));
        // The unpublished Accessibility check item only exists on a maintainer's machine.
        header.querySelectorAll(".ag-nav > li").forEach((li) => {
          if (li.textContent.includes("Accessibility check")) li.remove();
        });
        const brand = header.querySelector(".ag-header__brand").getBoundingClientRect();
        const nav = header.querySelector(".ag-header__nav").getBoundingClientRect();
        return {
          stacked: header.classList.contains("ag-header--stacked"),
          sameRow: nav.top < brand.bottom && nav.bottom > brand.top,
        };
      });
      expect(rows.stacked || rows.sameRow, "navigation wrapped under the brand").toBe(true);
      await context.close();
    });
  }
}
