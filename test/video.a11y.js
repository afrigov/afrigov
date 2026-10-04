// Video loads only when pressed. Before that, nothing from the video host is on the page.
import { test, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const page = "file://" + join(dirname(fileURLToPath(import.meta.url)), "..", "docs", "components", "video.html");

test("the video player loads only when the poster is pressed", async ({ page: tab }) => {
  await tab.route(/youtube/, (route) => route.fulfill({ status: 200, body: "<html></html>" }));
  await tab.goto(page);
  const poster = tab.locator("a[data-ag-video]").first();
  await expect(tab.locator("iframe.ag-video__frame")).toHaveCount(0);
  await expect(poster).toHaveAttribute("href", /youtube\.com\/watch/);
  await poster.click();
  const frame = tab.locator("iframe.ag-video__frame").first();
  await expect(frame).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/.+autoplay=1/);
  await expect(frame).toHaveAttribute("title", "How to report a leak");
  await expect(frame).toBeFocused();
});
