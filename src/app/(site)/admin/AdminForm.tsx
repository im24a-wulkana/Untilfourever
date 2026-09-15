"use client";

import { useActionState, useState } from "react";
import { parseCaption, saveProduct } from "./actions";
import type { ParseState, SaveState } from "./types";
import { CATEGORIES, CONDITIONS, conditionLabel } from "@/lib/extract";

const field =
  "w-full border border-hairline bg-black px-3 py-2 text-body text-bone";
const label = "block text-label uppercase tracking-caps text-meta";
const button =
  "border border-bone px-6 py-3 text-label uppercase tracking-caps text-bone transition-opacity duration-150 hover:opacity-60 disabled:opacity-40";

const MEASUREMENT_KEYS = [
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
] as const;

function Field({
  name,
  label: text,
  defaultValue,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
}) {
  return (
    <p className="space-y-1">
      <label className={label} htmlFor={name}>
        {text}
        {required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={field}
      />
    </p>
  );
}

export function AdminForm() {
  const [parseState, parseAction, parsing] = useActionState<
    ParseState,
    FormData
  >(parseCaption, { status: "idle" });

  const [saveState, saveAction, saving] = useActionState<SaveState, FormData>(
    saveProduct,
    { status: "idle" },
  );

  const [showParser, setShowParser] = useState(false);
  const [chosen, setChosen] = useState<string[]>([]);

  const parsed = parseState.status === "parsed" ? parseState.result : null;

  /**
   * The form is keyed on the parse result: when a caption is parsed, React
   * rebuilds the inputs so defaultValue picks up the extracted values. Without
   * this, an uncontrolled input keeps whatever was typed first.
   */
  const formKey = parsed ? `parsed-${parseState.status}` : "blank";

  return (
    <div className="space-y-10">
      {/* Parsing is optional — the form below works on its own. */}
      <section className="border border-hairline p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className={label}>Paste an Instagram caption (optional)</h2>
          <button
            type="button"
            onClick={() => setShowParser((v) => !v)}
            className="rule-link text-label uppercase tracking-caps text-bone"
          >
            {showParser ? "Hide" : "Show"}
          </button>
        </div>

        {showParser ? (
          <form action={parseAction} className="mt-4 space-y-3">
            <textarea
              id="caption"
              name="caption"
              rows={6}
              required
              defaultValue={
                parseState.status !== "idle" ? parseState.caption : ""
              }
              placeholder={
                "Saint Laurent SS16 Knee Stud denim\n\nSize 31\n\nUnaltered inseam\n\n400$"
              }
              className={`${field} font-mono`}
            />
            <button type="submit" disabled={parsing} className={button}>
              {parsing ? "Parsing…" : "Parse and fill the form"}
            </button>
            <p className="text-body text-meta">
              This only pre-fills the fields below. You can ignore it entirely
              and type everything yourself.
            </p>
          </form>
        ) : null}

        {parseState.status === "error" ? (
          <p className="mt-4 border border-hairline px-4 py-3 text-body text-bone">
            {parseState.message}
          </p>
        ) : null}
      </section>

      {/* The listing form. Always visible. */}
      <form
        key={formKey}
        action={saveAction}
        encType="multipart/form-data"
        className="space-y-6"
      >
        {parsed && !parsed.confident ? (
          <p className="border border-hairline px-4 py-3 text-body text-bone">
            Low confidence — check every field.
            {parsed.notes ? ` ${parsed.notes}` : ""}
          </p>
        ) : parsed?.notes ? (
          <p className="text-body text-meta">{parsed.notes}</p>
        ) : null}

        {parsed?.price != null && parsed.currency && parsed.currency !== "USD" ? (
          <p className="border border-hairline px-4 py-3 text-body text-bone">
            Caption priced this at {parsed.price} {parsed.currency}. The shop
            prices in USD — convert it before saving.
          </p>
        ) : null}

        <input
          type="hidden"
          name="sourceCaption"
          value={parseState.status === "parsed" ? parseState.caption : ""}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field name="brand" label="Brand" defaultValue={parsed?.brand} required />
          <Field name="designer" label="Designer" defaultValue={parsed?.designer} />
          <Field name="season" label="Season" defaultValue={parsed?.season} />
          <Field name="name" label="Name" defaultValue={parsed?.name} required />
          <Field name="size" label="Size" defaultValue={parsed?.size} />

          <p className="space-y-1">
            <label className={label} htmlFor="category">
              Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={parsed?.category ?? ""}
              className={field}
            >
              <option value="">—</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </p>

          <p className="space-y-1">
            <label className={label} htmlFor="condition">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              defaultValue={parsed?.condition ?? ""}
              className={field}
            >
              <option value="">—</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {conditionLabel(c)}
                </option>
              ))}
            </select>
          </p>

          <Field
            name="priceUSD"
            label="Price USD"
            defaultValue={
              parsed?.currency === "USD" && parsed.price != null
                ? String(parsed.price)
                : ""
            }
            required
          />
        </div>

        {/* Photographs */}
        <fieldset className="space-y-2 border-t border-hairline pt-5">
          <legend className={label}>Photographs</legend>
          <input
            type="file"
            id="images"
            name="images"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) =>
              setChosen(Array.from(e.target.files ?? []).map((f) => f.name))
            }
            className={`${field} file:mr-4 file:border file:border-bone file:bg-transparent file:px-3 file:py-1 file:text-label file:uppercase file:tracking-caps file:text-bone`}
          />
          <p className="text-body text-meta">
            The first image is the cover shot shown in the grid. JPEG, PNG,
            WebP or AVIF, up to 8MB each. Shoot 3:4.
          </p>
          {chosen.length > 0 ? (
            <ol className="mt-2 space-y-0.5">
              {chosen.map((n, i) => (
                <li key={n} className="text-label uppercase tracking-caps text-meta">
                  {i === 0 ? "Cover · " : `${i + 1} · `}
                  {n}
                </li>
              ))}
            </ol>
          ) : null}
        </fieldset>

        <p className="space-y-1">
          <label className={label} htmlFor="conditionNotes">
            Condition notes
          </label>
          <textarea
            id="conditionNotes"
            name="conditionNotes"
            rows={3}
            defaultValue={parsed?.conditionNotes ?? ""}
            className={field}
          />
        </p>

        <fieldset className="space-y-3 border-t border-hairline pt-5">
          <legend className={label}>Measurements — flat, cm</legend>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {MEASUREMENT_KEYS.map((key) => (
              <p key={key} className="space-y-1">
                <label className={label} htmlFor={`m_${key}`}>
                  {key}
                </label>
                <input
                  id={`m_${key}`}
                  name={`m_${key}`}
                  inputMode="decimal"
                  defaultValue={
                    parsed?.measurements?.[key] != null
                      ? String(parsed.measurements[key])
                      : ""
                  }
                  className={field}
                />
              </p>
            ))}
          </div>
        </fieldset>

        <button type="submit" disabled={saving} className={button}>
          {saving ? "Saving…" : "Save as draft"}
        </button>

        {saveState.status === "error" ? (
          <p className="border border-hairline px-4 py-3 text-body text-bone">
            {saveState.message}
          </p>
        ) : null}

        {saveState.status === "saved" ? (
          <div className="space-y-1">
            <p className="text-body text-meta">
              Saved as draft with{" "}
              {saveState.imageCount === 0
                ? "no photographs"
                : `${saveState.imageCount} photograph${saveState.imageCount === 1 ? "" : "s"}`}
              . Publish it below to put it in the shop.
            </p>
            {saveState.warning ? (
              <p className="text-body text-bone">{saveState.warning}</p>
            ) : null}
          </div>
        ) : null}
      </form>
    </div>
  );
}
