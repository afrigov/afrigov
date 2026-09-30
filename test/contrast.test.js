import { describe, expect, it } from "vitest";
import { contrast, ensureContrast, luminance, rgbToHsl, hexToRgb, textOn, tint } from "../scripts/color.mjs";
import { CONTRAST_PAIRS, listPacks, loadCore, loadPack, mergedColors } from "../scripts/tokens.mjs";

describe("WCAG maths", () => {
  it("matches known reference values", () => {
    expect(luminance("#ffffff")).toBeCloseTo(1, 5);
    expect(luminance("#000000")).toBeCloseTo(0, 5);
    expect(contrast("#000000", "#ffffff")).toBeCloseTo(21, 2);
    expect(contrast("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
  });

  it("is symmetric", () => {
    expect(contrast("#1f4e79", "#ffffff")).toBe(contrast("#ffffff", "#1f4e79"));
  });
});

describe("ensureContrast", () => {
  it("leaves a passing colour untouched", () => {
    const r = ensureContrast("#006600", "#ffffff");
    expect(r.adjusted).toBe(false);
    expect(r.hex).toBe("#006600");
  });

  it("darkens Ghana flag yellow until it passes AA and keeps its hue", () => {
    const official = "#fcd116";
    const r = ensureContrast(official, "#ffffff", 4.5);
    expect(r.adjusted).toBe(true);
    expect(r.contrast).toBeGreaterThanOrEqual(4.5);
    const [h1] = rgbToHsl(hexToRgb(official));
    const [h2] = rgbToHsl(hexToRgb(r.hex));
    expect(Math.abs(h1 - h2)).toBeLessThan(0.02);
  });

  it("darkens Nigeria green just enough for the grey panel background", () => {
    const r = ensureContrast("#008751", "#f3f3f3", 4.5);
    expect(r.adjusted).toBe(true);
    expect(r.contrast).toBeGreaterThanOrEqual(4.5);
    expect(contrast(r.hex, "#ffffff")).toBeGreaterThanOrEqual(4.5);
  });
});

describe("helpers", () => {
  it("picks white text on dark and ink text on light backgrounds", () => {
    expect(textOn("#006600")).toBe("#ffffff");
    expect(textOn("#fcd116")).toBe("#1b1b1b");
  });

  it("tints to a light background that body text can sit on", () => {
    expect(contrast("#1b1b1b", tint("#006600"))).toBeGreaterThanOrEqual(7);
  });
});

describe("every colour pair passes in the core and in every pack", () => {
  const core = loadCore();
  const sets = [
    ["core", mergedColors(core)],
    ...listPacks().map((c) => [`pack ${c}`, mergedColors(core, loadPack(c, core))]),
  ];

  for (const [label, colors] of sets) {
    it.each(CONTRAST_PAIRS)(`${label}: %s on %s is at least %s:1 (%s)`, (fg, bg, min) => {
      expect(colors[fg], fg).toBeDefined();
      expect(colors[bg], bg).toBeDefined();
      expect(contrast(colors[fg], colors[bg])).toBeGreaterThanOrEqual(min);
    });
  }
});
