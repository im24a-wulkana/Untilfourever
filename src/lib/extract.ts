import Anthropic from "@anthropic-ai/sdk";
import { jsonSchemaOutputFormat } from "@anthropic-ai/sdk/helpers/json-schema";
import { Category, Condition } from "@prisma/client";

/**
 * Caption -> structured product fields.
 *
 * Deliberately knows nothing about Instagram: it takes a string and returns
 * JSON. The /admin form and a future Instagram sync both call this same
 * function, so there is one extractor to fix when the parsing is wrong.
 *
 * Nothing here writes to the database. Extraction proposes; a human confirms
 * in /admin. That is why every field is nullable — a caption that omits the
 * condition should produce `null` and an empty form field, never a guess that
 * reads as fact on a product page.
 */

// Derived from the Prisma enums so the extractor, the form and the database
// can never drift apart. Note "very_good", not "very good" — Prisma enum
// identifiers cannot contain spaces, and a mismatch here would silently drop
// the condition on save.
export const CONDITIONS = Object.values(Condition);
export const CATEGORIES = Object.values(Category);

/** Human-facing label for a condition value. */
export function conditionLabel(value: string): string {
  return value.replace(/_/g, " ");
}

/**
 * Every field is nullable except the flags. The model is instructed to return
 * null rather than infer, and the admin form makes missing fields visible.
 */
const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "brand",
    "designer",
    "season",
    "name",
    "category",
    "size",
    "condition",
    "conditionNotes",
    "price",
    "currency",
    "measurements",
    "confident",
    "notes",
  ],
  properties: {
    brand: {
      type: ["string", "null"],
      description:
        'The fashion house, e.g. "Saint Laurent", "Dior Homme", "Celine". Normalise "SLP" to "Saint Laurent Paris" and "YSL" to "Saint Laurent". Not the designer.',
    },
    designer: {
      type: ["string", "null"],
      description:
        'The designer, only if the caption names one. Do NOT infer a designer from the brand and season, even when you are confident — that is the seller\'s claim to make, not yours. Almost always null.',
    },
    season: {
      type: ["string", "null"],
      description:
        'Season code as written, e.g. "SS16", "AW04". Include the collection name if the caption gives one, e.g. "AW04 Victim of the Crime". Null if absent.',
    },
    name: {
      type: ["string", "null"],
      description:
        'The garment itself, lowercase, without the brand or season. From "Saint Laurent SS16 Knee Stud denim" this is "knee stud denim". Keep the seller\'s own wording.',
    },
    category: {
      type: ["string", "null"],
      enum: [
        "outerwear",
        "tailoring",
        "knitwear",
        "shirting",
        "denim",
        "trousers",
        "footwear",
        "accessories",
        null,
      ],
      description:
        "Best-fit category. Jeans and denim jackets are denim. Suits and blazers are tailoring. Null if genuinely unclear.",
    },
    size: {
      type: ["string", "null"],
      description:
        'Size as written — "31", "46", "M". Strip a leading "size". Null if absent.',
    },
    condition: {
      type: ["string", "null"],
      enum: ["deadstock", "excellent", "very_good", "good", "worn", null],
      description:
        'Only if the caption states a condition. Note the value is "very_good" with an underscore. Most captions do not state one — null is the correct and expected answer. Do not infer a condition from the absence of reported flaws.',
    },
    conditionNotes: {
      type: ["string", "null"],
      description:
        'Any descriptive line that is not brand, season, size or price — e.g. "Unaltered inseam", "small mark on the cuff". Verbatim. Null if none.',
    },
    price: {
      type: ["number", "null"],
      description:
        'The number only, no symbol or separators. "400$" is 400. Null if the caption says DM for price, or gives none.',
    },
    currency: {
      type: ["string", "null"],
      enum: ["CHF", "USD", "EUR", "GBP", null],
      description:
        'The currency actually written. "400$" is USD, "400.-" or "400 CHF" is CHF, "400€" is EUR. Do NOT default to USD — the shop prices in USD, so a wrong guess here silently mis-prices a piece.',
    },
    measurements: {
      // A plain object, not ["object","null"]: the API rejects
      // additionalProperties on a nullable-object union. Absent measurements
      // are expressed as null on each field instead.
      type: "object",
      additionalProperties: false,
      description:
        "Flat measurements in cm. Set a field only where the caption gives an actual number; otherwise null. Do not convert a size into measurements.",
      properties: {
        chest: { type: "number" },
        shoulders: { type: "number" },
        sleeve: { type: "number" },
        length: { type: "number" },
        waist: { type: "number" },
        hips: { type: "number" },
        inseam: { type: "number" },
        rise: { type: "number" },
        hem: { type: "number" },
        insole: { type: "number" },
      },
      // Intentionally no `required`: a measurement the caption does not give is
      // simply absent. Plain numbers rather than ["number","null"] because the
      // API caps a schema at 16 union-typed parameters, and ten nullable
      // measurements alone would blow through it.
      required: [],
    },
    confident: {
      type: "boolean",
      description:
        "False if the caption was ambiguous, unusually formatted, or you had to stretch to fill fields. The admin UI flags this for closer review.",
    },
    notes: {
      type: ["string", "null"],
      description:
        "One short line to the seller about anything ambiguous or missing. Null if the caption was clean.",
    },
  },
} as const;

const SYSTEM = `You extract structured product data from a secondhand designer archive shop's own Instagram captions.

The shop's usual caption order is:
  brand and season and item
  size
  description
  price

For example:
  Saint Laurent SS16 Knee Stud denim
  Size 31
  Unaltered inseam
  400$

That order is a tendency, not a rule. Captions are written quickly, so treat
it as a hint and read what is actually there.

The single most important rule: return null for anything the caption does not
say. These captions are short and routinely omit condition, designer and
measurements. A null leaves the field blank in a form a human is about to fill
in; a guess becomes a factual claim on a product listing about a real garment
being sold for real money. Never infer:
  - a condition from the absence of mentioned flaws
  - a designer from the brand and season, however well known the pairing
  - measurements from a size
  - a currency from the fact that the shop prices in USD

Set confident to false whenever you had to stretch, and say why in notes.`;

export interface ExtractionResult {
  brand: string | null;
  designer: string | null;
  season: string | null;
  name: string | null;
  category: string | null;
  size: string | null;
  condition: string | null;
  conditionNotes: string | null;
  price: number | null;
  currency: string | null;
  measurements: Record<string, number> | null;
  confident: boolean;
  notes: string | null;
}

/**
 * Extract product fields from a caption. Throws if the API key is missing or
 * the call fails — the caller decides how to surface that.
 */
export async function extractFromCaption(
  caption: string,
): Promise<ExtractionResult> {
  const trimmed = caption.trim();
  if (!trimmed) {
    throw new Error("Caption is empty.");
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env — see .env.example.",
    );
  }

  const client = new Anthropic();

  const response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 2000,
    system: SYSTEM,
    output_config: { format: jsonSchemaOutputFormat(schema) },
    messages: [{ role: "user", content: trimmed }],
  });

  if (response.stop_reason === "refusal") {
    throw new Error("The request was declined by the model's safety system.");
  }

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error("Could not parse a product from that caption.");
  }

  return parsed as ExtractionResult;
}

/**
 * Drops the nulls out of a measurements object so it can be stored as the
 * compact Json the schema expects.
 */
export function compactMeasurements(
  measurements: Record<string, number> | null,
): Record<string, number> {
  if (!measurements) return {};
  return Object.fromEntries(
    Object.entries(measurements).filter(
      (entry): entry is [string, number] => typeof entry[1] === "number",
    ),
  );
}
