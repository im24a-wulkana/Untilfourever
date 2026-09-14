import type { Category, Condition, Product, ProductStatus } from "@prisma/client";
import { db } from "./db";

/**
 * Every read of the catalogue goes through here, so "what the public can see"
 * is defined once. A draft must never leak into the shop, and the only way to
 * be sure of that is to have one function that adds the filter.
 */

export type { Product };

/** Only live and sold pieces are public. Drafts are invisible. */
const PUBLIC = {
  status: { in: ["live", "sold"] as ProductStatus[] },
};

export interface ShopFilters {
  brand?: string;
  size?: string;
  category?: string;
  sold?: string;
}

export async function getShopProducts(filters: ShopFilters = {}) {
  const category = isCategory(filters.category) ? filters.category : undefined;

  return db.product.findMany({
    where: {
      ...PUBLIC,
      ...(filters.brand ? { brand: filters.brand } : {}),
      ...(filters.size ? { size: filters.size } : {}),
      ...(category ? { category } : {}),
      ...(filters.sold === "sold"
        ? { status: "sold" as const }
        : filters.sold === "available"
          ? { status: "live" as const }
          : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return db.product.findFirst({ where: { slug, ...PUBLIC } });
}

/** Facet values, built from what is actually in the shop right now. */
export async function getFacets() {
  const rows = await db.product.findMany({
    where: PUBLIC,
    select: { brand: true, size: true, category: true },
  });

  const brands = [...new Set(rows.map((r) => r.brand))].sort();
  const categories = [
    ...new Set(rows.map((r) => r.category).filter(Boolean)),
  ].sort() as Category[];

  const sizes = [...new Set(rows.map((r) => r.size))].sort((a, b) => {
    const letters = ["XS", "S", "M", "L", "XL"];
    const an = Number(a);
    const bn = Number(b);
    if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
    if (!Number.isNaN(an)) return -1;
    if (!Number.isNaN(bn)) return 1;
    return letters.indexOf(a) - letters.indexOf(b);
  });

  return { brands, sizes, categories };
}

const CATEGORY_VALUES: Category[] = [
  "outerwear",
  "tailoring",
  "knitwear",
  "shirting",
  "denim",
  "trousers",
  "footwear",
  "accessories",
];

function isCategory(value: string | undefined): value is Category {
  return !!value && (CATEGORY_VALUES as string[]).includes(value);
}

/** Human-facing label for an enum value. */
export function conditionLabel(value: Condition | null): string {
  return value ? value.replace(/_/g, " ") : "";
}

/**
 * URL slug from the piece itself. Uniqueness is enforced by the database; the
 * caller retries with a suffix on collision.
 */
export function slugify(brand: string, season: string, name: string): string {
  return [brand, season, name]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Images are stored as a Json array of paths; narrow it for the UI. */
export function productImages(product: Product): string[] {
  return Array.isArray(product.images) ? (product.images as string[]) : [];
}

export function measurementEntries(
  product: Product,
): [string, number][] {
  const m = product.measurements;
  if (!m || typeof m !== "object" || Array.isArray(m)) return [];
  return Object.entries(m as Record<string, unknown>).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number",
  );
}
