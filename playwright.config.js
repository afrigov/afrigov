import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  testMatch: /.*\.a11y\.js/,
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { browserName: "chromium" },
});
