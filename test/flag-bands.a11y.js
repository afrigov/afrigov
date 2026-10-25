// A pack declaring six bands must draw six. The bands are a gradient divided by
// --ag-flag-count, so this samples the painted pixels along a flag and counts the
// colour runs, rather than trusting the stylesheet to mean what it says.
import { test, expect } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { inflateSync } from "node:zlib";
import { Buffer } from "node:buffer";

const docs = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");

// code, bands, direction: the packs that are not plain tricolours, and one that is.
const packs = [
  ["ug", 6, "column"],
  ["tz", 5, "column"],
  ["ng", 3, "row"],
];

/* A PNG screenshot is 8-bit RGBA and never interlaced, so decoding it needs only
   the IHDR size, the inflated IDAT bytes and the five scanline filters. Doing it here
   keeps a pixel test from costing the project an image dependency. */
function decode(png) {
  let pos = 8; // past the signature
  let width = 0;
  let height = 0;
  let channels = 4;
  const idat = [];
  while (pos < png.length) {
    const len = png.readUInt32BE(pos);
    const type = png.toString("ascii", pos + 4, pos + 8);
    const body = png.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      if (body[8] !== 8 || (body[9] !== 6 && body[9] !== 2)) {
        throw new Error(`unexpected PNG format: depth ${body[8]}, colour type ${body[9]}`);
      }
      channels = body[9] === 6 ? 4 : 3; // RGBA or RGB
    } else if (type === "IDAT") idat.push(body);
    else if (type === "IEND") break;
    pos += 12 + len; // length, type, body, CRC
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    for (let x = 0; x < stride; x += 1) {
      const a = x >= channels ? out[y * stride + x - channels] : 0; // left
      const b = y > 0 ? out[(y - 1) * stride + x] : 0; // above
      const c = x >= channels && y > 0 ? out[(y - 1) * stride + x - channels] : 0; // above left
      let value = line[x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        value += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      out[y * stride + x] = value & 0xff;
    }
  }
  return { width, height, channels, data: out };
}

/** The colours along the middle of an element, in order, with runs collapsed. */
async function bandsOf(page, selector, direction) {
  const box = await page.locator(selector).first().boundingBox();
  // Inside the 1px border, and off the ends, where antialiasing lives.
  const inset = 3;
  const shot = await page.screenshot({
    clip: {
      x: box.x + inset,
      y: box.y + inset,
      width: box.width - inset * 2,
      height: box.height - inset * 2,
    },
  });
  const png = decode(shot);
  const along = direction === "column" ? png.height : png.width;
  const line = [];
  for (let s = 0; s < 60; s += 1) {
    const t = Math.round((s / 59) * (along - 1));
    const x = direction === "column" ? Math.floor(png.width / 2) : t;
    const y = direction === "column" ? t : Math.floor(png.height / 2);
    const i = (png.width * y + x) * png.channels;
    line.push(`${png.data[i]},${png.data[i + 1]},${png.data[i + 2]}`);
  }
  return line.filter((c, i) => i === 0 || c !== line[i - 1]);
}

for (const [code, bands, direction] of packs) {
  test(`${code} declares ${bands} bands and the matching gradient angle`, async ({ page }) => {
    await page.goto(`file://${join(docs, "packs", `${code}.html`)}`);
    const flag = page.locator(".ag-flag--lg").first();
    await expect(flag).toBeVisible();

    const vars = await flag.evaluate((el) => ({
      count: getComputedStyle(el).getPropertyValue("--ag-flag-count").trim(),
      angle: getComputedStyle(el).getPropertyValue("--ag-flag-angle").trim(),
    }));
    expect(vars.count, "band count from the pack").toBe(String(bands));
    expect(vars.angle, "horizontal bands run down the flag").toBe(direction === "column" ? "180deg" : "90deg");
  });
}

test("Uganda paints six bands, not three", async ({ page }) => {
  await page.goto(`file://${join(docs, "packs", "ug.html")}`);
  const seen = await bandsOf(page, ".ag-flag--lg", "column");
  // Black, yellow, red, black, yellow, red: six runs over three distinct colours.
  expect(seen.length, `runs found: ${seen.join(" | ")}`).toBe(6);
  expect(new Set(seen).size).toBe(3);
  expect(seen[0]).toBe(seen[3]);
  expect(seen[1]).toBe(seen[4]);
  expect(seen[2]).toBe(seen[5]);
});

// Nigeria, not Morocco: a pack with an accurate SVG paints it over the bands, so there
// would be artwork under the sampler rather than the fallback stripes.
test("a three-band pack still paints exactly three", async ({ page }) => {
  await page.goto(`file://${join(docs, "packs", "ng.html")}`);
  const seen = await bandsOf(page, ".ag-flag--lg", "row");
  expect(seen.length, `runs found: ${seen.join(" | ")}`).toBe(3);
});
