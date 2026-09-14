import type { Product } from "./types";

/* ---------------------------------------------------------------------------
   Static image imports.

   Explicit imports rather than a glob: a missing or misspelled file becomes a
   build error instead of a runtime blank, and each import carries its own
   width, height and blurDataURL. Replace the files at these paths with real
   photography — nothing below needs to change.
   --------------------------------------------------------------------------- */

import victim01 from "@/images/dior-homme-aw04-victim-jacket/01.jpg";
import victim02 from "@/images/dior-homme-aw04-victim-jacket/02.jpg";
import victim03 from "@/images/dior-homme-aw04-victim-jacket/03.jpg";
import victim04 from "@/images/dior-homme-aw04-victim-jacket/04.jpg";

import luster01 from "@/images/dior-homme-ss05-luster-shirt/01.jpg";
import luster02 from "@/images/dior-homme-ss05-luster-shirt/02.jpg";
import luster03 from "@/images/dior-homme-ss05-luster-shirt/03.jpg";

import navigate01 from "@/images/dior-homme-aw06-navigate-coat/01.jpg";
import navigate02 from "@/images/dior-homme-aw06-navigate-coat/02.jpg";
import navigate03 from "@/images/dior-homme-aw06-navigate-coat/03.jpg";
import navigate04 from "@/images/dior-homme-aw06-navigate-coat/04.jpg";

import nervous01 from "@/images/dior-homme-ss06-nervous-jeans/01.jpg";
import nervous02 from "@/images/dior-homme-ss06-nervous-jeans/02.jpg";
import nervous03 from "@/images/dior-homme-ss06-nervous-jeans/03.jpg";

import tailcoat01 from "@/images/dior-homme-aw03-luster-tailcoat/01.jpg";
import tailcoat02 from "@/images/dior-homme-aw03-luster-tailcoat/02.jpg";
import tailcoat03 from "@/images/dior-homme-aw03-luster-tailcoat/03.jpg";

import teddy01 from "@/images/saint-laurent-aw13-teddy-jacket/01.jpg";
import teddy02 from "@/images/saint-laurent-aw13-teddy-jacket/02.jpg";
import teddy03 from "@/images/saint-laurent-aw13-teddy-jacket/03.jpg";
import teddy04 from "@/images/saint-laurent-aw13-teddy-jacket/04.jpg";

import babycat01 from "@/images/saint-laurent-ss14-babycat-boots/01.jpg";
import babycat02 from "@/images/saint-laurent-ss14-babycat-boots/02.jpg";
import babycat03 from "@/images/saint-laurent-ss14-babycat-boots/03.jpg";

import leather01 from "@/images/saint-laurent-aw14-leather-jacket/01.jpg";
import leather02 from "@/images/saint-laurent-aw14-leather-jacket/02.jpg";
import leather03 from "@/images/saint-laurent-aw14-leather-jacket/03.jpg";
import leather04 from "@/images/saint-laurent-aw14-leather-jacket/04.jpg";

import glitter01 from "@/images/saint-laurent-ss15-glitter-jeans/01.jpg";
import glitter02 from "@/images/saint-laurent-ss15-glitter-jeans/02.jpg";
import glitter03 from "@/images/saint-laurent-ss15-glitter-jeans/03.jpg";

import mohair01 from "@/images/saint-laurent-aw15-mohair-cardigan/01.jpg";
import mohair02 from "@/images/saint-laurent-aw15-mohair-cardigan/02.jpg";
import mohair03 from "@/images/saint-laurent-aw15-mohair-cardigan/03.jpg";

import blouson01 from "@/images/celine-aw19-teddy-blouson/01.jpg";
import blouson02 from "@/images/celine-aw19-teddy-blouson/02.jpg";
import blouson03 from "@/images/celine-aw19-teddy-blouson/03.jpg";
import blouson04 from "@/images/celine-aw19-teddy-blouson/04.jpg";

import trousers01 from "@/images/celine-ss19-slim-trousers/01.jpg";
import trousers02 from "@/images/celine-ss19-slim-trousers/02.jpg";
import trousers03 from "@/images/celine-ss19-slim-trousers/03.jpg";

import polo01 from "@/images/celine-aw18-knit-polo/01.jpg";
import polo02 from "@/images/celine-aw18-knit-polo/02.jpg";
import polo03 from "@/images/celine-aw18-knit-polo/03.jpg";

import tee01 from "@/images/hedi-era-band-tee-archive/01.jpg";
import tee02 from "@/images/hedi-era-band-tee-archive/02.jpg";
import tee03 from "@/images/hedi-era-band-tee-archive/03.jpg";

export const products: readonly Product[] = [
  {
    id: "dior-homme-aw04-victim-jacket",
    brand: "Dior Homme",
    season: "AW04 Victim of the Crime",
    name: "wool gabardine three-button jacket",
    size: "46",
    category: "tailoring",
    condition: "excellent",
    conditionNotes:
      "Worn a handful of times. No moth, no shine at the elbows or seat. Lining intact, all buttons original. One faint press mark on the left forearm that releases with steam.",
    priceCHF: 1850,
    measurements: { chest: 47, shoulders: 40, sleeve: 66, length: 70 },
    images: [
      { src: victim01, alt: "Dior Homme AW04 wool gabardine jacket photographed front-on under hard flash" },
      { src: victim02, alt: "Back of the AW04 jacket showing the centre vent and shoulder line" },
      { src: victim03, alt: "Close crop of the gabardine weave and the lapel roll" },
      { src: victim04, alt: "Interior Dior Homme label with the size 46 stamp" },
    ],
  },
  {
    id: "dior-homme-ss05-luster-shirt",
    brand: "Dior Homme",
    season: "SS05 Luster",
    name: "sheer poplin snap shirt",
    size: "38",
    category: "shirting",
    condition: "very good",
    conditionNotes:
      "Light overall wear consistent with age. Poplin remains crisp. Two snaps show minor plating loss on the reverse, not visible when worn. No stains, no repairs.",
    priceCHF: 620,
    measurements: { chest: 44, shoulders: 38, sleeve: 65, length: 72 },
    images: [
      { src: luster01, alt: "Dior Homme SS05 sheer poplin shirt laid flat, front view" },
      { src: luster02, alt: "Sleeve and cuff detail of the SS05 poplin shirt" },
      { src: luster03, alt: "Dior Homme neck label showing size 38" },
    ],
  },
  {
    id: "dior-homme-aw06-navigate-coat",
    brand: "Dior Homme",
    season: "AW06 Navigate",
    name: "long wool overcoat",
    size: "48",
    category: "outerwear",
    condition: "excellent",
    conditionNotes:
      "Exceptional for the season. Wool is full with no thinning at the cuffs or collar. Horn buttons all present. Interior pocket bag has one small factory repair from new.",
    priceCHF: 2400,
    measurements: { chest: 50, shoulders: 42, sleeve: 68, length: 104 },
    images: [
      { src: navigate01, alt: "Dior Homme AW06 long wool overcoat shown full length" },
      { src: navigate02, alt: "Back of the AW06 overcoat showing the full drape" },
      { src: navigate03, alt: "Detail of the horn buttons and buttonhole stitching" },
      { src: navigate04, alt: "Dior Homme interior label with size 48 marking" },
    ],
  },
  {
    id: "dior-homme-ss06-nervous-jeans",
    brand: "Dior Homme",
    season: "SS06 Nervous Breakdown",
    name: "waxed slim jean",
    size: "29",
    category: "denim",
    condition: "very good",
    conditionNotes:
      "Wax coating largely intact with natural cracking at the knee and seat — correct for the model and not a flaw. Hems unaltered. Zip runs smoothly.",
    priceCHF: 980,
    measurements: { waist: 38, hips: 47, inseam: 82, rise: 19, hem: 15 },
    images: [
      { src: nervous01, alt: "Dior Homme SS06 waxed slim jeans laid flat, front" },
      { src: nervous02, alt: "Knee and hem detail showing natural cracking in the wax coating" },
      { src: nervous03, alt: "Dior Homme jean waistband label and size stamp" },
    ],
  },
  {
    id: "dior-homme-aw03-luster-tailcoat",
    brand: "Dior Homme",
    season: "AW03 Luster",
    name: "cropped tailcoat",
    size: "44",
    category: "tailoring",
    condition: "good",
    conditionNotes:
      "An early piece that has been worn. Two small moth nips on the reverse of the left tail, photographed closely in the third image. Lining shows age at the armhole. Priced accordingly.",
    priceCHF: 1450,
    measurements: { chest: 45, shoulders: 39, sleeve: 65, length: 78 },
    images: [
      { src: tailcoat01, alt: "Dior Homme AW03 cropped tailcoat, front view" },
      { src: tailcoat02, alt: "Rear view of the tailcoat showing the tails and waist seam" },
      { src: tailcoat03, alt: "Close crop of two small moth nips on the reverse of the left tail" },
    ],
    sold: true,
  },
  {
    id: "saint-laurent-aw13-teddy-jacket",
    brand: "Saint Laurent Paris",
    season: "AW13",
    name: "wool and leather teddy jacket",
    size: "46",
    category: "outerwear",
    condition: "excellent",
    conditionNotes:
      "Leather sleeves supple with no cracking at the elbow. Ribbing retains full stretch at cuff and hem. Snaps function correctly. Very little wear overall.",
    priceCHF: 2200,
    measurements: { chest: 50, shoulders: 43, sleeve: 65, length: 66 },
    images: [
      { src: teddy01, alt: "Saint Laurent AW13 teddy jacket with leather sleeves, front" },
      { src: teddy02, alt: "Back of the AW13 teddy jacket" },
      { src: teddy03, alt: "Detail of the ribbed cuff meeting the leather sleeve" },
      { src: teddy04, alt: "Saint Laurent Paris interior label, size 46" },
    ],
  },
  {
    id: "saint-laurent-ss14-babycat-boots",
    brand: "Saint Laurent Paris",
    season: "SS14",
    name: "babycat calf chelsea boot",
    size: "42",
    category: "footwear",
    condition: "very good",
    conditionNotes:
      "Hair-on calf intact across both boots with no bald patches. Soles show even wear, no replacement needed yet. Elastic gussets firm. Heel stacks clean.",
    priceCHF: 890,
    measurements: { insole: 28 },
    images: [
      { src: babycat01, alt: "Saint Laurent SS14 babycat calf chelsea boots, pair side on" },
      { src: babycat02, alt: "Sole of the chelsea boot showing even wear" },
      { src: babycat03, alt: "Interior size stamp reading 42" },
    ],
  },
  {
    id: "saint-laurent-aw14-leather-jacket",
    brand: "Saint Laurent Paris",
    season: "AW14",
    name: "L01 lambskin biker jacket",
    size: "48",
    category: "outerwear",
    condition: "excellent",
    conditionNotes:
      "Lambskin has softened beautifully with no cracking or colour loss. All hardware original and running smoothly. Lining free of tears. Collar snap intact.",
    priceCHF: 3200,
    measurements: { chest: 49, shoulders: 42, sleeve: 67, length: 60 },
    images: [
      { src: leather01, alt: "Saint Laurent AW14 L01 lambskin biker jacket, front with zips closed" },
      { src: leather02, alt: "Back panel of the L01 biker jacket" },
      { src: leather03, alt: "Close crop of the zip pull and lambskin grain" },
      { src: leather04, alt: "Saint Laurent Paris label inside the jacket, size 48" },
    ],
  },
  {
    id: "saint-laurent-ss15-glitter-jeans",
    brand: "Saint Laurent Paris",
    season: "SS15",
    name: "glitter skinny jean",
    size: "30",
    category: "denim",
    condition: "good",
    conditionNotes:
      "Glitter coating shows loss at the knee and rear pocket edges from wear. Denim itself is sound with no thinning or holes. An honest piece, priced for the coating wear.",
    priceCHF: 740,
    measurements: { waist: 40, hips: 48, inseam: 80, rise: 20, hem: 14 },
    images: [
      { src: glitter01, alt: "Saint Laurent SS15 glitter skinny jeans laid flat" },
      { src: glitter02, alt: "Knee detail showing loss of glitter coating from wear" },
      { src: glitter03, alt: "Waistband label and size stamp reading 30" },
    ],
    sold: true,
  },
  {
    id: "saint-laurent-aw15-mohair-cardigan",
    brand: "Saint Laurent Paris",
    season: "AW15",
    name: "brushed mohair cardigan",
    size: "M",
    category: "knitwear",
    condition: "very good",
    conditionNotes:
      "Mohair halo still full and brushed. Light pilling under the arms only, easily removed. No holes, no moth. Buttons all original.",
    priceCHF: 860,
    measurements: { chest: 52, shoulders: 44, sleeve: 64, length: 66 },
    images: [
      { src: mohair01, alt: "Saint Laurent AW15 brushed mohair cardigan laid flat" },
      { src: mohair02, alt: "Close crop of the brushed mohair surface" },
      { src: mohair03, alt: "Saint Laurent Paris knitwear label, size M" },
    ],
  },
  {
    id: "celine-aw19-teddy-blouson",
    brand: "Celine",
    season: "AW19",
    name: "wool teddy blouson",
    size: "48",
    category: "outerwear",
    condition: "excellent",
    conditionNotes:
      "Barely worn. Wool body clean throughout with no pilling. Zip runs true. Interior pockets unused. Retains its original shape at the shoulder.",
    priceCHF: 1950,
    measurements: { chest: 52, shoulders: 44, sleeve: 66, length: 64 },
    images: [
      { src: blouson01, alt: "Celine AW19 wool teddy blouson, front view" },
      { src: blouson02, alt: "Back of the AW19 blouson" },
      { src: blouson03, alt: "Detail of the zip and ribbed hem" },
      { src: blouson04, alt: "Celine interior label showing size 48" },
    ],
  },
  {
    id: "celine-ss19-slim-trousers",
    brand: "Celine",
    season: "SS19",
    name: "wool slim trouser",
    size: "46",
    category: "trousers",
    condition: "excellent",
    conditionNotes:
      "Sharp throughout. No seat shine, no hem fraying. Original unaltered length with the factory finish intact. Waistband clean.",
    priceCHF: 680,
    measurements: { waist: 39, hips: 49, inseam: 84, rise: 21, hem: 16 },
    images: [
      { src: trousers01, alt: "Celine SS19 wool slim trousers laid flat" },
      { src: trousers02, alt: "Hem detail showing the original unaltered finish" },
      { src: trousers03, alt: "Celine trouser label with size 46" },
    ],
  },
  {
    id: "celine-aw18-knit-polo",
    brand: "Celine",
    season: "AW18",
    name: "fine gauge knit polo",
    size: "S",
    category: "knitwear",
    condition: "very good",
    conditionNotes:
      "From the first Slimane collection for the house. Fine gauge intact with no snags or pulls. Collar holds its shape. Light softening at the cuffs from wear.",
    priceCHF: 540,
    measurements: { chest: 46, shoulders: 40, sleeve: 62, length: 64 },
    images: [
      { src: polo01, alt: "Celine AW18 fine gauge knit polo laid flat, front" },
      { src: polo02, alt: "Collar and placket detail of the knit polo" },
      { src: polo03, alt: "Celine knitwear label showing size S" },
    ],
  },
  {
    id: "hedi-era-band-tee-archive",
    brand: "Archive",
    season: "Early 2000s",
    name: "faded tour tee",
    size: "S",
    category: "shirting",
    condition: "worn",
    conditionNotes:
      "A genuinely worn tour shirt, sold as such. Print cracked throughout, collar relaxed, one pinhole at the left shoulder seam. Single stitch. Cotton is soft and thin with no holes beyond the one noted.",
    priceCHF: 280,
    measurements: { chest: 44, shoulders: 39, sleeve: 19, length: 66 },
    images: [
      { src: tee01, alt: "Faded early 2000s tour t-shirt laid flat, front print visible" },
      { src: tee02, alt: "Close crop of the cracked screen print" },
      { src: tee03, alt: "Single stitch hem and interior neck tag" },
    ],
  },
];

/** Lookup for the detail route. Built once at module scope. */
export const productById = new Map(products.map((p) => [p.id, p]));

/** Sorted, de-duplicated facet values for the shop filters. */
function facet<K extends keyof typeof products[number]>(key: K): string[] {
  return [...new Set(products.map((p) => String(p[key])))].sort();
}

export const brands = facet("brand");
export const sizes = [...new Set(products.map((p) => p.size))].sort((a, b) => {
  // Numeric sizes ascending first, then lettered sizes in wearing order.
  const letters = ["XS", "S", "M", "L", "XL"];
  const an = Number(a);
  const bn = Number(b);
  if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
  if (!Number.isNaN(an)) return -1;
  if (!Number.isNaN(bn)) return 1;
  return letters.indexOf(a) - letters.indexOf(b);
});
export const categories = facet("category");
