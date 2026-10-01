import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  testMatch: /.*\.a11y\.js/,
  globalSetup: "./test/setup.js",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? "github" : "dot",
  use: { browserName: "chromium" },
});
