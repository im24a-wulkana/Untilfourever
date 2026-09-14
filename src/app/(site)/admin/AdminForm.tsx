"use client";

import { useActionState } from "react";
import { parseCaption, saveProduct } from "./actions";
import type { ParseState, SaveState } from "./types";
import { CATEGORIES, CONDITIONS, conditionLabel } from "@/lib/extract";

const field =
  "w-full border border-hairline bg-black px-3 py-2 text-body text-bone";
const label = "block text-label uppercase tracking-caps text-meta";

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

  const parsed = parseState.status === "parsed" ? parseState.result : null;

  return (
    <div className="space-y-10">
      <form action={parseAction} className="space-y-3">
        <label className={label} htmlFor="caption">
          Instagram caption
        </label>
        <textarea
          id="caption"
          name="caption"
          rows={7}
          required
          defaultValue={
            parseState.status !== "idle" ? parseState.caption : ""
          }
          placeholder={"Saint Laurent SS16 Knee Stud denim\n\nSize 31\n\nUnaltered inseam\n\n400$"}
          className={`${field} font-mono`}
        />
        <button
          type="submit"
          disabled={parsing}
          className="border border-bone px-6 py-3 text-label uppercase tracking-caps text-bone transition-opacity duration-150 hover:opacity-60 disabled:opacity-40"
        >
          {parsing ? "Parsing…" : "Parse"}
        </button>
      </form>

      {parseState.status === "error" ? (
        <p className="border border-hairline px-4 py-3 text-body text-bone">
          {parseState.message}
        </p>
      ) : null}

      {parsed ? (
        <form action={saveAction} className="space-y-6 border-t border-hairline pt-8">
          {/* Everything below is editable. The extraction is a first draft. */}
          {!parsed.confident ? (
            <p className="border border-hairline px-4 py-3 text-body text-bone">
              Low confidence — check every field.
              {parsed.notes ? ` ${parsed.notes}` : ""}
            </p>
          ) : parsed.notes ? (
            <p className="text-body text-meta">{parsed.notes}</p>
          ) : null}

          {parsed.price !== null && parsed.currency && parsed.currency !== "CHF" ? (
            <p className="border border-hairline px-4 py-3 text-body text-bone">
              Caption priced this at {parsed.price} {parsed.currency}. The shop
              prices in CHF — convert it before saving.
            </p>
          ) : null}

          <input
            type="hidden"
            name="sourceCaption"
            value={parseState.status === "parsed" ? parseState.caption : ""}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Field name="brand" label="Brand" defaultValue={parsed.brand} required />
            <Field name="designer" label="Designer" defaultValue={parsed.designer} />
            <Field name="season" label="Season" defaultValue={parsed.season} />
            <Field name="name" label="Name" defaultValue={parsed.name} required />
            <Field name="size" label="Size" defaultValue={parsed.size} />

            <p className="space-y-1">
              <label className={label} htmlFor="category">Category</label>
              <select id="category" name="category" defaultValue={parsed.category ?? ""} className={field}>
                <option value="">—</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </p>

            <p className="space-y-1">
              <label className={label} htmlFor="condition">Condition</label>
              <select id="condition" name="condition" defaultValue={parsed.condition ?? ""} className={field}>
                <option value="">—</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{conditionLabel(c)}</option>
                ))}
              </select>
            </p>

            <Field
              name="priceCHF"
              label="Price CHF"
              defaultValue={
                parsed.currency === "CHF" && parsed.price !== null
                  ? String(parsed.price)
                  : ""
              }
              required
            />
          </div>

          <p className="space-y-1">
            <label className={label} htmlFor="conditionNotes">Condition notes</label>
            <textarea
              id="conditionNotes"
              name="conditionNotes"
              rows={3}
              defaultValue={parsed.conditionNotes ?? ""}
              className={field}
            />
          </p>

          <fieldset className="space-y-3 border-t border-hairline pt-5">
            <legend className={label}>Measurements — flat, cm</legend>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {MEASUREMENT_KEYS.map((key) => (
                <p key={key} className="space-y-1">
                  <label className={label} htmlFor={`m_${key}`}>{key}</label>
                  <input
                    id={`m_${key}`}
                    name={`m_${key}`}
                    inputMode="decimal"
                    defaultValue={
                      parsed.measurements?.[key] != null
                        ? String(parsed.measurements[key])
                        : ""
                    }
                    className={field}
                  />
                </p>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={saving}
            className="border border-bone px-6 py-3 text-label uppercase tracking-caps text-bone transition-opacity duration-150 hover:opacity-60 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save as draft"}
          </button>

          {saveState.status === "error" ? (
            <p className="text-body text-bone">{saveState.message}</p>
          ) : null}
          {saveState.status === "saved" ? (
            <p className="text-body text-meta">Saved as draft ({saveState.id}).</p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
