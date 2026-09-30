import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.js"],
    globalSetup: ["./test/setup.js"],
  },
});
