import hero from "@/images/lookbook/hero.jpg";

/**
 * The splash image. The only static image left in the project — every product
 * photograph now comes from the database, uploaded through /admin.
 *
 * Shoot or choose a PORTRAIT frame (roughly 2:3). The splash fills the whole
 * viewport, so a landscape image has to be cropped savagely on a phone, where
 * most people will see it. The crop is anchored to the top of the frame, so
 * put the garment in the upper two thirds.
 */
export const openingShot = {
  src: hero,
  alt: "Backstage photograph from behind: a crystal-panelled denim jacket with a shredded shoulder, worn over a palm-print shirt, guitar strap across the back",
} as const;
