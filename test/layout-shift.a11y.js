// The header must not move the page when the script arrives late on a phone.
/* global window, PerformanceObserver, setTimeout */
import { test, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const docs = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");

test("the home template does not shift when the script arrives late", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 700 } });
  const page = await context.newPage();
  await page.route("**/afrigov.iife.js*", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    await route.continue();
  });
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("file://" + join(docs, "templates", "home.html"), { waitUntil: "load" });
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => window.__cls)).toBeLessThan(0.02);
  // and the menu still opens
  await page.click(".ag-header__toggle");
  await expect(page.locator(".ag-header__nav")).toBeVisible();
  await context.close();
});

test("the menu comes back in full if the script never arrives", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 700 } });
  const page = await context.newPage();
  await page.route("**/afrigov.iife.js*", (route) => route.abort());
  await page.goto("file://" + join(docs, "templates", "home.html"), { waitUntil: "load" });
  await expect(page.locator(".ag-header__nav")).toBeVisible();
  await expect(page.locator(".ag-header__toggle")).toBeHidden();
  await context.close();
});
