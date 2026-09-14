/**
 * Fetches example photography from Unsplash and grades it to the house look,
 * so the site can be viewed with real images instead of abstract placeholders.
 *
 *   node scripts/fetch-example-images.mjs [--force]
 *
 * ---------------------------------------------------------------------------
 * THESE ARE NOT OUR PHOTOGRAPHS AND NOT OUR PRODUCTS.
 *
 * They are other people's photographs of other people's clothes, used here
 * purely so the layout can be judged with real imagery. They must be replaced
 * with our own photography before the site goes live. Attribution for every
 * image used is written to src/images/CREDITS.md.
 *
 * To go back to the generated placeholders:
 *   node scripts/generate-placeholders.mjs --force
 * ---------------------------------------------------------------------------
 *
 * Uses sharp, which ships with Next as an optional dependency — it is not a
 * declared dependency of this project, and nothing at runtime imports it.
 */

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = join(ROOT, "src", "images");
const force = process.argv.includes("--force");

const PORTRAIT = { w: 1000, h: 1333 }; // 3:4 product shots
const LOOKBOOK = { w: 1600, h: 1000 }; // 8:5 full-bleed
const RUNWAY = { w: 1000, h: 1500 }; // 2:3 editorial

/**
 * Curated Unsplash photo ids. Chosen for a dark, high-contrast, indie register
 * — figures against black grounds, tailoring, leather, knitwear. Deliberately
 * not bright commercial stock, which fights the art direction.
 */
const A = {
  // Figures on dark grounds — the core of the look.
  denimPortrait: "photo-1516756587022-7891ad56a8cd", // denim jacket, black ground
  moodyFigure: "photo-1534030347209-467a5b0ad3e6", // figure, low key
  darkPortrait: "photo-1499996860823-5214fcc65f8f", // dark portrait
  knitShawl: "photo-1506794778202-cad84cf45f1d", // heavy knit, shawl collar, black
  leatherSeated: "photo-1519085360753-af0119f7cbe7", // leather, seated
  bareShoulder: "photo-1524504388940-b1c1722653e1", // low-key portrait, dark
  darkTee: "photo-1517070208541-6ddc4d3efbcb", // dark tee, seated, stone
  turtleneck: "photo-1544022613-e87ca75a784a", // dark turtleneck
  streetFigure: "photo-1508341591423-4347099e1f19", // tee, plain ground

  // Garment and still-life shots.
  boots: "photo-1479064555552-3ef4979f8908", // boots flat-lay with belt
  denimFlat: "photo-1475178626620-a4d074967452", // denim, close
  rail: "photo-1441984904996-e0b6ba687e04", // clothing rail
  hangingKnit: "photo-1483985988355-763728e1935b", // garments hanging
  jacketDetail: "photo-1507003211169-0a1dd7228f2d", // fabric/jacket detail
};

/** Attribution, for CREDITS.md. */
const CREDIT = {
  [A.denimPortrait]: "Aral Tasher",
  [A.moodyFigure]: "Kyle Loftus",
  [A.darkPortrait]: "Ethan Haddox",
  [A.knitShawl]: "Ospan Ali",
  [A.leatherSeated]: "Andrew Robles",
  [A.bareShoulder]: "Alexandru Zdrobău",
  [A.darkTee]: "Sacha Styles",
  [A.turtleneck]: "Nathan Dumlao",
  [A.streetFigure]: "Clarke Sanders",
  [A.boots]: "Irene Kredenets",
  [A.denimFlat]: "Alexi Romano",
  [A.rail]: "Hannah Morgan",
  [A.hangingKnit]: "Alyssa Strohmann",
  [A.jacketDetail]: "Jessica Weiller",
};

/**
 * Each product gets shots that suit the garment: a figure or full shot first
 * (the grid cover), then alternates, a detail crop, and a label-ish close.
 */
const PRODUCT_SHOTS = {
  // Tailoring and outerwear lead on a figure; the cover shot has to look like
  // the garment in the caption, or the page reads as broken.
  "dior-homme-aw04-victim-jacket": [A.moodyFigure, A.darkPortrait, A.jacketDetail, A.rail],
  "dior-homme-ss05-luster-shirt": [A.streetFigure, A.darkTee, A.hangingKnit],
  "dior-homme-aw06-navigate-coat": [A.darkPortrait, A.moodyFigure, A.jacketDetail, A.rail],
  "dior-homme-ss06-nervous-jeans": [A.denimFlat, A.denimPortrait, A.jacketDetail],
  "dior-homme-aw03-luster-tailcoat": [A.turtleneck, A.darkPortrait, A.rail],
  "saint-laurent-aw13-teddy-jacket": [A.leatherSeated, A.moodyFigure, A.jacketDetail, A.rail],
  "saint-laurent-ss14-babycat-boots": [A.boots, A.jacketDetail, A.rail],
  "saint-laurent-aw14-leather-jacket": [A.leatherSeated, A.bareShoulder, A.jacketDetail, A.rail],
  "saint-laurent-ss15-glitter-jeans": [A.denimFlat, A.denimPortrait, A.jacketDetail],
  "saint-laurent-aw15-mohair-cardigan": [A.knitShawl, A.hangingKnit, A.jacketDetail],
  "celine-aw19-teddy-blouson": [A.knitShawl, A.moodyFigure, A.jacketDetail, A.rail],
  "celine-ss19-slim-trousers": [A.turtleneck, A.streetFigure, A.jacketDetail],
  "celine-aw18-knit-polo": [A.knitShawl, A.turtleneck, A.hangingKnit],
  "hedi-era-band-tee-archive": [A.darkTee, A.denimPortrait, A.jacketDetail],
};

const EDITORIAL_SHOTS = [
  ["lookbook/hero", A.moodyFigure, LOOKBOOK],
  ["lookbook/featured-01", A.leatherSeated, LOOKBOOK],
  ["lookbook/featured-02", A.knitShawl, LOOKBOOK],
  ["lookbook/featured-03", A.darkPortrait, LOOKBOOK],

  ["editorial/01", A.denimPortrait, RUNWAY],
  ["editorial/02", A.darkPortrait, RUNWAY],
  ["editorial/03", A.streetFigure, RUNWAY],
  ["editorial/04", A.leatherSeated, RUNWAY],
  ["editorial/05", A.moodyFigure, RUNWAY],
  ["editorial/06", A.turtleneck, RUNWAY],
  ["editorial/07", A.knitShawl, RUNWAY],
  ["editorial/08", A.bareShoulder, RUNWAY],

  ["archive/dior-01", A.darkPortrait, PORTRAIT],
  ["archive/dior-02", A.jacketDetail, PORTRAIT],
  ["archive/slp-01", A.leatherSeated, PORTRAIT],
  ["archive/slp-02", A.boots, PORTRAIT],
  ["archive/celine-01", A.knitShawl, PORTRAIT],
  ["archive/celine-02", A.hangingKnit, PORTRAIT],
];

const cache = new Map();

async function download(id) {
  if (cache.has(id)) return cache.get(id);
  const url = `https://images.unsplash.com/${id}?w=1600&q=80`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} for ${id}`);
  const buf = Buffer.from(await res.arrayBuffer());
  cache.set(id, buf);
  return buf;
}

/**
 * The house grade. Desaturate, push contrast hard so blacks crush and
 * highlights blow, then lay grain over the top. This is what makes a set of
 * unrelated stock photographs read as one body of work.
 */
async function grade(buf, w, h, seed, opts = {}) {
  // The splash image carries type over it, so it is graded down at the source.
  // A CSS scrim alone cannot do this: a flat black overlay on a bright picture
  // washes it grey instead of darkening it.
  const { contrast = 1.42, offset = -38, brightness = 0.96, gamma = 1.06 } = opts;

  const base = await sharp(buf)
    .resize(w, h, { fit: "cover", position: "attention" })
    .grayscale()
    .linear(contrast, offset)
    .gamma(gamma)
    .modulate({ brightness })
    .toBuffer();

  // Deterministic grain, so re-running produces identical files.
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const noise = Buffer.alloc(w * h);
  for (let i = 0; i < noise.length; i++) {
    noise[i] = Math.max(0, Math.min(255, 128 + (rand() - 0.5) * 48));
  }
  const grain = await sharp(noise, { raw: { width: w, height: h, channels: 1 } })
    .png()
    .toBuffer();

  return sharp(base)
    .composite([{ input: grain, blend: "overlay" }])
    .jpeg({ quality: 84, progressive: true })
    .toBuffer();
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const used = new Set();
let written = 0;
let skipped = 0;

/** The splash plate is graded well down — the wordmark sits on top of it. */
const DARK_PLATE = { contrast: 1.34, offset: -150, brightness: 0.62, gamma: 1.35 };

async function emit(relPath, id, dims) {
  const abs = join(IMAGES, `${relPath}.jpg`);
  used.add(id);
  if (existsSync(abs) && !force) {
    skipped++;
    return;
  }
  mkdirSync(dirname(abs), { recursive: true });
  const src = await download(id);
  const opts = relPath === "lookbook/hero" ? DARK_PLATE : {};
  const out = await grade(src, dims.w, dims.h, hash(relPath), opts);
  writeFileSync(abs, out);
  written++;
  process.stdout.write(`\r  ${written} written…`);
}

for (const [slug, ids] of Object.entries(PRODUCT_SHOTS)) {
  for (let i = 0; i < ids.length; i++) {
    await emit(`${slug}/${String(i + 1).padStart(2, "0")}`, ids[i], PORTRAIT);
  }
}

for (const [path, id, dims] of EDITORIAL_SHOTS) {
  await emit(path, id, dims);
}

// Attribution file — required by the Unsplash licence and a standing reminder
// that this imagery is temporary.
const lines = [...used]
  .sort()
  .map((id) => `- [${CREDIT[id] ?? "Unsplash contributor"}](https://unsplash.com/photos/${id.replace(/^photo-/, "")}) — \`${id}\``);

writeFileSync(
  join(IMAGES, "CREDITS.md"),
  `# Example imagery — TEMPORARY

The photographs currently in this folder are examples fetched from Unsplash and
graded to the house look, so the site can be judged with real images. **They are
not our photographs and not our products, and must be replaced with our own
photography before the site goes live.**

Regenerate: \`node scripts/fetch-example-images.mjs --force\`
Revert to abstract placeholders: \`node scripts/generate-placeholders.mjs --force\`

Photographs via [Unsplash](https://unsplash.com/license):

${lines.join("\n")}
`,
  "utf8",
);

process.stdout.write("\r");
console.log(`example images: ${written} written, ${skipped} skipped${force ? "" : " (pass --force to overwrite)"}`);
console.log(`credits written to src/images/CREDITS.md`);
