import js from "@eslint/js";

export default [
  { ignores: ["dist/", "build/", "docs/", "node_modules/", "test-results/", "playwright-report/"] },
  js.configs.recommended,
  {
    files: ["src/js/**/*.js", "site/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        URL: "readonly",
        localStorage: "readonly",
        Option: "readonly",
        Event: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        __AFRIGOV_VERSION__: "readonly",
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
