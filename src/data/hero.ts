import hero from "@/images/lookbook/hero.jpg";

/**
 * The splash image. The only static image left in the project — every product
 * photograph now comes from the database, uploaded through /admin.
 */
export const openingShot = {
  src: hero,
  alt: "Backstage flash photograph, a figure in dark tailoring against a blown-out white wall",
} as const;
