// Colour maths for the build. WCAG 2.x relative luminance and contrast, plus
// a helper that darkens a colour until it meets a contrast ratio. No dependencies.

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function channel(v) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

export function hslToRgb([h, s, l]) {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

/** Shift lightness by `delta` (negative darkens). Returns hex. */
export function shiftLightness(hex, delta) {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb([h, s, Math.min(1, Math.max(0, l + delta))]));
}

/**
 * Darken `hex` in 1% lightness steps until it reaches `ratio` against `bg`.
 * Returns { hex, adjusted, contrast }. Hue and saturation are preserved so the
 * result still reads as the national colour, only deeper.
 */
export function ensureContrast(hex, bg, ratio = 4.5) {
  let current = hex.toLowerCase();
  let adjusted = false;
  let guard = 0;
  while (contrast(current, bg) < ratio && guard < 100) {
    current = shiftLightness(current, -0.01);
    adjusted = true;
    guard += 1;
  }
  return { hex: current, adjusted, contrast: contrast(current, bg) };
}

/** Pick white or ink, whichever contrasts more with `bg`. */
export function textOn(bg, ink = "#1b1b1b", white = "#ffffff") {
  return contrast(bg, white) >= contrast(bg, ink) ? white : ink;
}

/** A very light tint of `hex` for panel backgrounds. */
export function tint(hex, lightness = 0.94) {
  const [h, s] = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb([h, Math.min(s, 0.6), lightness]));
}
