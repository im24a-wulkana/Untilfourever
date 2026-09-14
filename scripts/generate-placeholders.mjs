/**
 * Generates high-contrast black & white placeholder JPEGs.
 *
 * Dev-only utility, deliberately dependency-free: a minimal baseline JPEG
 * encoder plus a procedural image function. Real photographs replace these
 * file-for-file at the same paths — nothing in the app references this script.
 *
 *   node scripts/generate-placeholders.mjs [--force]
 */

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = join(ROOT, "src", "images");

/* -------------------------------------------------------------------------
   Deterministic noise
   ------------------------------------------------------------------------- */

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Value noise with smooth interpolation, for the soft falloff of a flash. */
function makeValueNoise(seed) {
  const rand = mulberry32(seed);
  const size = 256;
  const table = new Float32Array(size * size);
  for (let i = 0; i < table.length; i++) table[i] = rand();

  const at = (x, y) => table[(y & (size - 1)) * size + (x & (size - 1))];
  const smooth = (t) => t * t * (3 - 2 * t);

  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = smooth(x - xi);
    const yf = smooth(y - yi);
    const a = at(xi, yi);
    const b = at(xi + 1, yi);
    const c = at(xi, yi + 1);
    const d = at(xi + 1, yi + 1);
    return a * (1 - xf) * (1 - yf) + b * xf * (1 - yf) + c * (1 - xf) * yf + d * xf * yf;
  };
}

/* -------------------------------------------------------------------------
   Image synthesis — a subject silhouette under hard flash, heavy grain
   ------------------------------------------------------------------------- */

function renderGrayscale(width, height, seed, variant) {
  const broad = makeValueNoise(seed);
  const mid = makeValueNoise(seed ^ 0x9e3779b9);
  const fine = makeValueNoise(seed ^ 0x85ebca6b);
  const rand = mulberry32(seed ^ 0xc2b2ae35);
  const px = new Uint8Array(width * height);

  // These are placeholders, not illustrations. Depicting a figure produces
  // something that reads as a bad render; abstract photographic texture at the
  // right tonal register reads as an unfinished scan and sits correctly in the
  // layout without ever being mistaken for final art.

  // Off-centre light source — backstage flash, not studio lighting.
  const lightX = 0.5 + (rand() - 0.5) * 0.5;
  const lightY = 0.3 + (rand() - 0.5) * 0.3;
  const aspect = width / height;

  // Per-image tonal key. Weighted dark: these stand in for high-contrast flash
  // photography on black, so a grid of them should read moody rather than grey.
  const key = 0.3 + rand() * 0.22;
  const contrast = variant === "label" ? 2.1 : 1.7 + rand() * 0.45;

  // Grain coarseness in pixels, independent of image dimensions.
  const grainScale = 0.55;

  for (let y = 0; y < height; y++) {
    const v = y / height;
    for (let x = 0; x < width; x++) {
      const u = x / width;

      // Soft directional falloff. Gentle enough to keep midtones alive.
      const dx = (u - lightX) * aspect;
      const dy = v - lightY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const falloff = 1 - Math.min(1, dist * 0.78) ** 1.7;

      // Layered noise, centred on zero so it modulates the key rather than
      // adding to it. Weights sum to 1 before scaling. The higher octaves
      // matter: the grid renders these at ~384px wide, and low-frequency-only
      // noise turns to mush when downscaled.
      const structure =
        (broad(u * 3.5, v * 3.5) - 0.5) * 0.4 +
        (mid(u * 14, v * 14) - 0.5) * 0.3 +
        (fine(u * 38, v * 38) - 0.5) * 0.19 +
        (fine(u * 95, v * 95) - 0.5) * 0.11;

      let lum;
      if (variant === "detail") {
        // Macro crop: tighter weave, flatter light, fills the frame.
        lum =
          key +
          (mid(u * 26, v * 26) - 0.5) * 0.4 +
          (fine(u * 64, v * 64) - 0.5) * 0.22 +
          (falloff - 0.5) * 0.2;
      } else if (variant === "label") {
        // Bright woven tape on a dark ground, softly bounded and rotated
        // slightly so it never reads as a UI rectangle.
        const cx = u - 0.5;
        const cy = v - 0.5;
        const angle = (rand() - 0.5) * 0.14;
        const rx = cx * Math.cos(angle) - cy * Math.sin(angle);
        const ry = cx * Math.sin(angle) + cy * Math.cos(angle);
        const edgeNoise = (broad(u * 9, v * 9) - 0.5) * 0.045;
        // Smooth falloff at the tape edges rather than a hard cut.
        const inX = 1 - smoothstep(0.17, 0.25, Math.abs(rx) + edgeNoise);
        const inY = 1 - smoothstep(0.055, 0.1, Math.abs(ry) + edgeNoise);
        const tape = inX * inY;
        const ground = 0.14 + structure * 0.5 + falloff * 0.14;
        const cloth = 0.68 + (fine(u * 70, v * 70) - 0.5) * 0.26 + (mid(u * 30, v * 30) - 0.5) * 0.14;
        lum = ground * (1 - tape) + cloth * tape;
      } else {
        // Full frame: drapery-like tonal masses under raking light. The key is
        // the base tone; structure and falloff modulate around it.
        lum = key + structure * 1.15 * (0.5 + falloff * 0.7) + (falloff - 0.5) * 0.34;
        // A couple of soft folds, phase-shifted per image.
        lum += Math.sin(v * 5.5 + broad(u * 3, v * 3) * 6.0 + seed) * 0.045;
      }

      // Contrast around the image's own key — crushed blacks, blown highlights.
      lum = (lum - key) * contrast + key;

      // Film grain, scaled in pixel space so it stays sharp at any size.
      lum += (fine(x * grainScale, y * grainScale) - 0.5) * 0.17;
      lum += (rand() - 0.5) * 0.06;

      px[y * width + x] = Math.max(0, Math.min(255, Math.round(lum * 255)));
    }
  }
  return px;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* -------------------------------------------------------------------------
   Baseline JPEG encoder (greyscale, single component, no subsampling)
   ------------------------------------------------------------------------- */

const ZIGZAG = [
  0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5,
  12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51,
  58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63,
];

const STD_LUM_QUANT = [
  16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55,
  14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92,
  49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99,
];

const DC_BITS = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
const DC_VALS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const AC_BITS = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
const AC_VALS = [
  0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
  0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
  0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
  0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
  0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
  0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
  0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
  0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
  0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
  0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
  0xf9, 0xfa,
];

/** Builds a { code, length } lookup from a JPEG BITS/HUFFVAL pair. */
function buildHuffTable(bits, vals) {
  const table = [];
  let code = 0;
  let k = 0;
  for (let len = 1; len <= 16; len++) {
    for (let i = 0; i < bits[len]; i++) {
      table[vals[k]] = { code, length: len };
      code++;
      k++;
    }
    code <<= 1;
  }
  return table;
}

function scaleQuantTable(base, quality) {
  const q = quality < 50 ? Math.floor(5000 / quality) : 200 - quality * 2;
  return base.map((v) => Math.max(1, Math.min(255, Math.floor((v * q + 50) / 100))));
}

const COS_TABLE = (() => {
  const t = new Float32Array(64);
  for (let x = 0; x < 8; x++) {
    for (let u = 0; u < 8; u++) {
      t[x * 8 + u] = Math.cos(((2 * x + 1) * u * Math.PI) / 16);
    }
  }
  return t;
})();

const ALPHA = (() => {
  const a = new Float32Array(8);
  for (let i = 0; i < 8; i++) a[i] = i === 0 ? Math.SQRT1_2 : 1;
  return a;
})();

/** Separable float DCT-II. Clarity over speed; this runs once, offline. */
function fdct(block) {
  const tmp = new Float32Array(64);
  const out = new Float32Array(64);

  for (let y = 0; y < 8; y++) {
    for (let u = 0; u < 8; u++) {
      let s = 0;
      for (let x = 0; x < 8; x++) s += block[y * 8 + x] * COS_TABLE[x * 8 + u];
      tmp[y * 8 + u] = 0.5 * ALPHA[u] * s;
    }
  }
  for (let u = 0; u < 8; u++) {
    for (let v = 0; v < 8; v++) {
      let s = 0;
      for (let y = 0; y < 8; y++) s += tmp[y * 8 + u] * COS_TABLE[y * 8 + v];
      out[v * 8 + u] = 0.5 * ALPHA[v] * s;
    }
  }
  return out;
}

class BitWriter {
  constructor() {
    this.bytes = [];
    this.acc = 0;
    this.accBits = 0;
  }
  writeBits(code, length) {
    for (let i = length - 1; i >= 0; i--) {
      this.acc = (this.acc << 1) | ((code >> i) & 1);
      this.accBits++;
      if (this.accBits === 8) {
        const byte = this.acc & 0xff;
        this.bytes.push(byte);
        // Byte stuffing: a literal 0xFF in entropy data is followed by 0x00.
        if (byte === 0xff) this.bytes.push(0x00);
        this.acc = 0;
        this.accBits = 0;
      }
    }
  }
  flush() {
    while (this.accBits > 0) this.writeBits(1, 1);
  }
}

/** Magnitude category and the value's bit representation, per JPEG spec. */
function categorize(value) {
  const abs = Math.abs(value);
  let size = 0;
  while (abs >= 1 << size) size++;
  const bits = value < 0 ? value + (1 << size) - 1 : value;
  return { size, bits };
}

function encodeJPEG(pixels, width, height, quality = 82) {
  const quant = scaleQuantTable(STD_LUM_QUANT, quality);
  const dcTable = buildHuffTable(DC_BITS, DC_VALS);
  const acTable = buildHuffTable(AC_BITS, AC_VALS);

  const out = [];
  const u8 = (v) => out.push(v & 0xff);
  const u16 = (v) => {
    out.push((v >> 8) & 0xff);
    out.push(v & 0xff);
  };
  const marker = (m) => {
    u8(0xff);
    u8(m);
  };

  marker(0xd8); // SOI

  // JFIF APP0
  marker(0xe0);
  u16(16);
  [0x4a, 0x46, 0x49, 0x46, 0x00].forEach(u8);
  u16(0x0101);
  u8(0);
  u16(1);
  u16(1);
  u8(0);
  u8(0);

  // DQT
  marker(0xdb);
  u16(67);
  u8(0);
  for (let i = 0; i < 64; i++) u8(quant[ZIGZAG[i]]);

  // SOF0 — baseline, one greyscale component
  marker(0xc0);
  u16(11);
  u8(8);
  u16(height);
  u16(width);
  u8(1);
  u8(1);
  u8(0x11);
  u8(0);

  // DHT — DC then AC
  marker(0xc4);
  u16(2 + 1 + 16 + DC_VALS.length);
  u8(0x00);
  for (let i = 1; i <= 16; i++) u8(DC_BITS[i]);
  DC_VALS.forEach(u8);

  marker(0xc4);
  u16(2 + 1 + 16 + AC_VALS.length);
  u8(0x10);
  for (let i = 1; i <= 16; i++) u8(AC_BITS[i]);
  AC_VALS.forEach(u8);

  // SOS
  marker(0xda);
  u16(8);
  u8(1);
  u8(1);
  u8(0x00);
  u8(0);
  u8(63);
  u8(0);

  const writer = new BitWriter();
  const block = new Float32Array(64);
  const q = new Int16Array(64);
  let prevDC = 0;

  for (let by = 0; by < height; by += 8) {
    for (let bx = 0; bx < width; bx += 8) {
      for (let y = 0; y < 8; y++) {
        // Clamp at the edges so non-multiple-of-8 dimensions still encode.
        const sy = Math.min(by + y, height - 1);
        for (let x = 0; x < 8; x++) {
          const sx = Math.min(bx + x, width - 1);
          block[y * 8 + x] = pixels[sy * width + sx] - 128;
        }
      }

      const coeffs = fdct(block);
      for (let i = 0; i < 64; i++) q[i] = Math.round(coeffs[i] / quant[i]);

      // DC — differential against the previous block
      const diff = q[0] - prevDC;
      prevDC = q[0];
      if (diff === 0) {
        writer.writeBits(dcTable[0].code, dcTable[0].length);
      } else {
        const { size, bits } = categorize(diff);
        writer.writeBits(dcTable[size].code, dcTable[size].length);
        writer.writeBits(bits, size);
      }

      // AC — zigzag order, run-length encoded zeros
      let runLength = 0;
      for (let i = 1; i < 64; i++) {
        const value = q[ZIGZAG[i]];
        if (value === 0) {
          runLength++;
          continue;
        }
        // ZRL (16 zeros) for runs longer than 15.
        while (runLength > 15) {
          writer.writeBits(acTable[0xf0].code, acTable[0xf0].length);
          runLength -= 16;
        }
        const { size, bits } = categorize(value);
        const symbol = (runLength << 4) | size;
        writer.writeBits(acTable[symbol].code, acTable[symbol].length);
        writer.writeBits(bits, size);
        runLength = 0;
      }
      if (runLength > 0) {
        writer.writeBits(acTable[0x00].code, acTable[0x00].length); // EOB
      }
    }
  }

  writer.flush();
  writer.bytes.forEach(u8);
  marker(0xd9); // EOI

  return Buffer.from(out);
}

/* -------------------------------------------------------------------------
   Manifest — must stay in step with src/data/products.ts
   ------------------------------------------------------------------------- */

const PORTRAIT = { w: 1000, h: 1333 }; // 3:4 product shots
const LOOKBOOK = { w: 1600, h: 1000 }; // 8:5 full-bleed editorial
const RUNWAY = { w: 1000, h: 1500 }; // 2:3 — a full-length walk, shot tall

const PRODUCTS = [
  ["dior-homme-aw04-victim-jacket", 4],
  ["dior-homme-ss05-luster-shirt", 3],
  ["dior-homme-aw06-navigate-coat", 4],
  ["dior-homme-ss06-nervous-jeans", 3],
  ["dior-homme-aw03-luster-tailcoat", 3],
  ["saint-laurent-aw13-teddy-jacket", 4],
  ["saint-laurent-ss14-babycat-boots", 3],
  ["saint-laurent-aw14-leather-jacket", 4],
  ["saint-laurent-ss15-glitter-jeans", 3],
  ["saint-laurent-aw15-mohair-cardigan", 3],
  ["celine-aw19-teddy-blouson", 4],
  ["celine-ss19-slim-trousers", 3],
  ["celine-aw18-knit-polo", 3],
  ["hedi-era-band-tee-archive", 3],
];

const EDITORIAL = [
  ["lookbook/hero", LOOKBOOK],
  ["lookbook/featured-01", LOOKBOOK],
  ["lookbook/featured-02", LOOKBOOK],
  ["lookbook/featured-03", LOOKBOOK],

  // Home page editorial sequence. Runway for now; these paths are named for
  // their role rather than their subject, so replacing them later with our own
  // styling shots needs no rename and no code change.
  ["editorial/01", RUNWAY],
  ["editorial/02", RUNWAY],
  ["editorial/03", RUNWAY],
  ["editorial/04", RUNWAY],
  ["editorial/05", RUNWAY],
  ["editorial/06", RUNWAY],
  ["editorial/07", RUNWAY],
  ["editorial/08", RUNWAY],

  ["archive/dior-01", PORTRAIT],
  ["archive/dior-02", PORTRAIT],
  ["archive/slp-01", PORTRAIT],
  ["archive/slp-02", PORTRAIT],
  ["archive/celine-01", PORTRAIT],
  ["archive/celine-02", PORTRAIT],
];

/** Last shot is always a label; the third, where present, is a macro detail. */
function variantFor(index, total) {
  if (index === total - 1) return "label";
  if (index === 2) return "detail";
  return "full";
}

const force = process.argv.includes("--force");
let written = 0;
let skipped = 0;

function write(relPath, width, height, seed, variant) {
  const abs = join(IMAGES, `${relPath}.jpg`);
  mkdirSync(dirname(abs), { recursive: true });
  if (existsSync(abs) && !force) {
    skipped++;
    return;
  }
  writeFileSync(abs, encodeJPEG(renderGrayscale(width, height, seed, variant), width, height));
  written++;
}

for (const [slug, count] of PRODUCTS) {
  for (let i = 0; i < count; i++) {
    const name = String(i + 1).padStart(2, "0");
    write(`${slug}/${name}`, PORTRAIT.w, PORTRAIT.h, hashString(`${slug}-${i}`), variantFor(i, count));
  }
}

for (const [path, dims] of EDITORIAL) {
  write(path, dims.w, dims.h, hashString(path), "full");
}

console.log(`placeholders: ${written} written, ${skipped} skipped${force ? "" : " (pass --force to overwrite)"}`);
