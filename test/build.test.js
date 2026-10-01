import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { ROOT, listPacks } from "../scripts/tokens.mjs";

const dist = (f) => join(ROOT, "dist", f);
const read = (f) => readFileSync(dist(f), "utf8");

describe("dist/core.css", () => {
  const css = read("core.css");

  it("declares the cascade layers in order", () => {
    expect(css).toContain("@layer reset, tokens, base, components, utilities;");
  });

  it("includes every component", () => {
    for (const cls of [
      ".ag-skip-link",
      ".ag-banner",
      ".ag-flag",
      ".ag-header",
      ".ag-nav__link",
      ".ag-footer",
      ".ag-button",
      ".ag-breadcrumb",
      ".ag-pagination",
      ".ag-field",
      ".ag-input",
      ".ag-checkbox",
      ".ag-radio",
      ".ag-error-summary",
      ".ag-date-input",
      ".ag-phone",
      ".ag-id-input",
      ".ag-alert",
      ".ag-accordion",
      ".ag-table",
      ".ag-badge",
      ".ag-panel",
      ".ag-summary",
      ".ag-visually-hidden",
    ]) {
      expect(css, cls).toContain(cls);
    }
  });

  it("never hard-codes a brand colour outside the tokens layer", () => {
    const afterTokens = css.split("@layer base")[1];
    // White on solid status badges and the select chevron are the only literal colours allowed.
    const literals = afterTokens.match(/#[0-9a-f]{3,6}\b/gi) ?? [];
    const allowed = new Set(["#fff", "#1b1b1b"]);
    for (const hex of literals) expect(allowed.has(hex.toLowerCase()), hex).toBe(true);
  });

  it("uses no CSS nesting, so it works in browsers from 2019", () => {
    expect(css).not.toMatch(/^\s+&/m);
  });
});

describe("dist/core.min.css", () => {
  it("gzips to 20 KB or less", () => {
    const gz = gzipSync(readFileSync(dist("core.min.css"))).length;
    expect(gz).toBeLessThanOrEqual(20 * 1024);
  });
});

describe("country packs in dist", () => {
  it.each(listPacks())("dist/%s.css overrides primary and sets the flag stripes", (code) => {
    const css = read(`${code}.css`);
    expect(css).toContain("--ag-color-primary:");
    expect(css).toContain("--ag-color-on-primary:");
    expect(css).toContain("--ag-flag-1:");
    expect(css).toContain(`[data-ag-pack="${code}"]`);
    expect(existsSync(dist(`${code}.min.css`))).toBe(true);
    expect(existsSync(dist(`${code}.json`))).toBe(true);
  });
});

describe("JavaScript", () => {
  it("ships ESM and a script-tag build under 3 KB", () => {
    expect(read("afrigov.js")).toContain("export {");
    const iife = read("afrigov.iife.js");
    expect(iife).toContain("AfriGov");
    expect(statSync(dist("afrigov.iife.js")).size).toBeLessThan(3072);
  });
});
