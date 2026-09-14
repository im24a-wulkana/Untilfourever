"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Category, Condition } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/products";
import { extractFromCaption } from "@/lib/extract";

import type { ParseState, SaveState } from "./types";

/**
 * Parse only — deliberately does not write to the database. The extractor
 * proposes, the form lets a human correct it, and saving is a separate action.
 */
export async function parseCaption(
  _prev: ParseState,
  formData: FormData,
): Promise<ParseState> {
  await requireAdmin();
  const caption = String(formData.get("caption") ?? "");

  try {
    const result = await extractFromCaption(caption);
    return { status: "parsed", result, caption };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Extraction failed.",
      caption,
    };
  }
}

function optional(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s === "" ? null : s;
}

/**
 * The form submits "" for an unselected dropdown. Postgres enums reject that,
 * which is the point — an unstated condition must be null, not an empty string
 * masquerading as a grade. Anything not in the enum is treated as unset.
 */
function asEnum<T extends Record<string, string>>(
  enumObject: T,
  value: FormDataEntryValue | null,
): T[keyof T] | null {
  const raw = optional(value);
  if (raw === null) return null;
  const match = Object.values(enumObject).find((v) => v === raw);
  return (match as T[keyof T]) ?? null;
}

/**
 * Saves the reviewed form. Everything is taken from the submitted fields, not
 * from the extraction — what the human sees is what gets stored.
 */
export async function saveProduct(
  _prev: SaveState,
  formData: FormData,
): Promise<SaveState> {
  await requireAdmin();

  const brand = optional(formData.get("brand"));
  const name = optional(formData.get("name"));
  const priceRaw = optional(formData.get("priceCHF"));

  if (!brand || !name || !priceRaw) {
    return {
      status: "error",
      message: "Brand, name and price are required before saving.",
    };
  }

  const priceCHF = Number(priceRaw);
  if (!Number.isFinite(priceCHF) || priceCHF < 0) {
    return { status: "error", message: "Price must be a positive number." };
  }

  const measurements: Record<string, number> = {};
  for (const key of [
    "chest",
    "shoulders",
    "sleeve",
    "length",
    "waist",
    "hips",
    "inseam",
    "rise",
    "hem",
    "insole",
  ]) {
    const raw = optional(formData.get(`m_${key}`));
    if (raw !== null) {
      const n = Number(raw);
      if (Number.isFinite(n)) measurements[key] = n;
    }
  }

  try {
    const base = slugify(brand, optional(formData.get("season")) ?? "", name);
    let slug = base || `piece-${Date.now()}`;
    // Slug is unique; on collision append a short suffix rather than failing.
    if (await db.product.findUnique({ where: { slug } })) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const product = await db.product.create({
      data: {
        slug,
        brand,
        name,
        priceCHF: Math.round(priceCHF),
        designer: optional(formData.get("designer")),
        season: optional(formData.get("season")) ?? "",
        category: asEnum(Category, formData.get("category")),
        size: optional(formData.get("size")) ?? "",
        condition: asEnum(Condition, formData.get("condition")),
        conditionNotes: optional(formData.get("conditionNotes")),
        sourceCaption: optional(formData.get("sourceCaption")),
        measurements,
        images: [],
        status: "draft",
      },
    });

    revalidatePath("/admin");
    return { status: "saved", id: product.id };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not save.",
    };
  }
}

/** Publish or unpublish a piece. */
export async function setStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !["draft", "live", "sold"].includes(status)) return;

  await db.product.update({
    where: { id },
    data: { status: status as "draft" | "live" | "sold" },
  });

  revalidatePath("/admin");
  revalidatePath("/shop");
}

/** Delete a piece outright. */
export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await db.product.delete({ where: { id } });

  revalidatePath("/admin");
  revalidatePath("/shop");
}
