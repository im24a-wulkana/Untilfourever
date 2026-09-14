"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { Category, Condition } from "@prisma/client";
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
    const product = await db.product.create({
      data: {
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
