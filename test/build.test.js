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
      ".ag-money",
      ".ag-char-count__message",
      ".ag-card",
      ".ag-details",
      ".ag-lang",
      ".ag-back-link",
      ".ag-list",
      ".ag-figure",
      ".ag-gallery",
      ".ag-download",
      ".ag-empty",
      ".ag-hero",
      ".ag-band",
      ".ag-band--accent",
      ".ag-stripe",
      ".ag-header--striped",
      ".ag-feature",
      ".ag-people",
      ".ag-steps",
      ".ag-stats",
      ".ag-card--accent",
      ".ag-main--flush",
      ".ag-statement",
      ".ag-social",
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

  it("uses logical properties, so it mirrors for right-to-left languages", () => {
    const layers = css.split("@layer base")[1];
    expect(layers).not.toMatch(/(margin|padding)-(left|right)\s*:/);
    expect(layers).not.toMatch(/text-align:\s*(left|right)/);
    expect(layers).not.toMatch(/^\s+(left|right)\s*:/m);
    expect(layers).toContain("padding-inline-start");
    expect(layers).toContain('[dir="rtl"] .ag-select');
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

describe("flag SVGs in dist", () => {
  it("Ghana's flag is published next to its stylesheet and referenced from it", () => {
    expect(existsSync(dist("flags/gh.svg"))).toBe(true);
    expect(read("gh.css")).toContain('--ag-flag-image: url("flags/gh.svg")');
    expect(read("sn.css")).not.toContain("--ag-flag-image");
  });

  it("inline flags on the packs page never inherit another pack's image", () => {
    const html = readFileSync(join(ROOT, "docs", "packs", "index.html"), "utf8");
    const nigeria = html.match(/<li class="docs-pack-card">[^]*?Nigeria[^]*?<\/li>/)[0];
    expect(nigeria).toContain("--ag-flag-image: none");
    const kenya = html.match(/<li class="docs-pack-card">[^]*?Kenya[^]*?<\/li>/)[0];
    expect(kenya).toContain("--ag-flag-image: url(../dist/flags/ke.svg)");
  });
});
