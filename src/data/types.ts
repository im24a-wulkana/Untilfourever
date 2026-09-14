import type { StaticImageData } from "next/image";

/**
 * Images are objects rather than bare static imports so that alt text is a
 * required field. A bare StaticImageData[] has nowhere to put alt text, which
 * makes it easy to ship a gallery of unlabelled images; this shape makes
 * TypeScript reject that.
 */
export interface ProductImage {
  src: StaticImageData;
  alt: string;
}

export type Condition =
  | "deadstock"
  | "excellent"
  | "very good"
  | "good"
  | "worn";

export type Category =
  | "outerwear"
  | "tailoring"
  | "knitwear"
  | "shirting"
  | "denim"
  | "trousers"
  | "footwear"
  | "accessories";

/** Flat measurements, taken garment-flat, in centimetres. */
export interface Measurements {
  chest?: number;
  shoulders?: number;
  sleeve?: number;
  length?: number;
  waist?: number;
  hips?: number;
  inseam?: number;
  rise?: number;
  hem?: number;
  insole?: number;
}

export interface Product {
  /** URL slug — becomes /shop/<id>. */
  id: string;
  brand: string;
  /** e.g. "AW04 Victim of the Crime" */
  season: string;
  /** Lowercase by house style. */
  name: string;
  size: string;
  category: Category;
  condition: Condition;
  /** Honest notes on flaws. Empty string is not acceptable — write the truth. */
  conditionNotes: string;
  priceCHF: number;
  measurements: Measurements;
  /** Non-empty by construction, so images[0] needs no null check. */
  images: readonly [ProductImage, ...ProductImage[]];
  sold?: boolean;
}

export const MEASUREMENT_LABELS: Record<keyof Measurements, string> = {
  chest: "Chest",
  shoulders: "Shoulders",
  sleeve: "Sleeve",
  length: "Length",
  waist: "Waist",
  hips: "Hips",
  inseam: "Inseam",
  rise: "Rise",
  hem: "Hem",
  insole: "Insole",
};
