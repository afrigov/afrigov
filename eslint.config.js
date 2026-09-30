import js from "@eslint/js";

export default [
  { ignores: ["dist/", "build/", "docs/dist/", "node_modules/", "test-results/", "playwright-report/"] },
  js.configs.recommended,
  {
    files: ["src/js/**/*.js", "docs/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        URL: "readonly",
        localStorage: "readonly",
      },
    },
  },
  {
    files: ["scripts/**/*.mjs", "test/**/*.js", "*.config.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      // document is used inside page.evaluate() callbacks in the Playwright tests.
      globals: { process: "readonly", console: "readonly", URL: "readonly", document: "readonly" },
    },
  },
];
