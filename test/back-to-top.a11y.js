// Back to top goes to the top, and the next Tab starts again from the skip link.
/* global window */
import { test, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const page = "file://" + join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "components", "back-to-top.html");

test("back to top scrolls up and keyboard focus starts again at the skip link", async ({ page: tab }) => {
  await tab.emulateMedia({ reducedMotion: "reduce" });
  await tab.setViewportSize({ width: 390, height: 700 });
  await tab.goto(page);
  const link = tab.locator(".ag-back-to-top--sticky .ag-back-to-top__link");
  await tab.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await link.focus();
  await tab.keyboard.press("Enter");
  await expect.poll(() => tab.evaluate(() => window.scrollY)).toBe(0);
  await tab.keyboard.press("Tab");
  await expect(tab.locator(".ag-skip-link")).toBeFocused();
});

test("the sticky link rides the bottom of the screen mid-page", async ({ page: tab }) => {
  await tab.setViewportSize({ width: 390, height: 700 });
  await tab.goto(page);
  const box = await tab.locator(".ag-back-to-top--sticky").boundingBox();
  expect(Math.round(box.y + box.height)).toBe(700);
});
