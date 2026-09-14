import type { StaticImageData } from "next/image";

import hero from "@/images/lookbook/hero.jpg";
import ed01 from "@/images/editorial/01.jpg";
import ed02 from "@/images/editorial/02.jpg";
import ed03 from "@/images/editorial/03.jpg";
import ed04 from "@/images/editorial/04.jpg";
import ed05 from "@/images/editorial/05.jpg";
import ed06 from "@/images/editorial/06.jpg";
import ed07 from "@/images/editorial/07.jpg";
import ed08 from "@/images/editorial/08.jpg";

/**
 * The home page sequence. Runway photography for now — these will be replaced
 * with our own styling shots, which is why the fields describe the image's
 * role rather than assuming a runway subject. Nothing here links to a product:
 * the home page is a lookbook, and the shop is one click away in the nav.
 */
export interface EditorialShot {
  src: StaticImageData;
  alt: string;
  /** Shown under the image, caps. Leave undefined for an uncaptioned plate. */
  credit?: string;
  /** Wider plates break the rhythm of the column. */
  wide?: boolean;
}

export const openingShot = {
  src: hero,
  alt: "Backstage flash photograph, a figure in dark tailoring against a blown-out white wall",
} as const;

export const editorialShots: readonly EditorialShot[] = [
  {
    src: ed01,
    alt: "Runway look in a narrow dark jacket, photographed head-on under hard show lighting",
    credit: "Dior Homme — AW04 Victim of the Crime",
  },
  {
    src: ed02,
    alt: "Full-length runway walk, slim trousers cropped at the ankle",
    credit: "Dior Homme — SS06 Nervous Breakdown",
  },
  {
    src: ed03,
    alt: "Backstage frame, shoulders and collar caught in flash",
    credit: "Dior Homme — AW06 Navigate",
    wide: true,
  },
  {
    src: ed04,
    alt: "Runway look in a leather biker jacket, arms at the sides",
    credit: "Saint Laurent Paris — AW14",
  },
  {
    src: ed05,
    alt: "Full-length walk in a teddy jacket and narrow jean",
    credit: "Saint Laurent Paris — AW13",
  },
  {
    src: ed06,
    alt: "Close runway frame, mohair knit under blown-out light",
    credit: "Saint Laurent Paris — AW15",
    wide: true,
  },
  {
    src: ed07,
    alt: "Runway look in a wool blouson over a fine gauge knit",
    credit: "Celine — AW19",
  },
  {
    src: ed08,
    alt: "Final walk, full length, high contrast against a dark ground",
    credit: "Celine — AW18",
  },
];
