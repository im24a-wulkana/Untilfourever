# untilfourever

Static e-commerce site for a secondhand designer archive — Slimane-era Dior
Homme, Saint Laurent Paris and Celine, plus adjacent indie and punk archive.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · deploys to Vercel.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # tsc --noEmit
```

## Before going live

Three things need real values. All of them are in one file, `src/data/site.ts`:

| Field | Current placeholder |
| --- | --- |
| `email` | `archive@untilfourever.ch` |
| `instagramHandle` | `untilfourever` |
| `url` | `https://untilfourever.ch` |

Shipping rates for Switzerland, Europe and the rest of the world are in the
`shipping` object in the same file.

## ⚠ The photography is temporary and must be replaced

The images currently in `src/images/` are **example photographs fetched from
Unsplash**, graded to the house look so the site can be judged with real
imagery instead of abstract placeholders.

**They are not our photographs and not our products.** They are other people's
photographs of other people's clothes. They must be replaced with our own
photography before the site goes live — the garment in the picture frequently
does not match the garment in the caption, which is fine for judging layout and
not fine for selling. Attribution for every image is in
`src/images/CREDITS.md`, as the Unsplash licence requires.

```bash
node scripts/fetch-example-images.mjs --force   # re-fetch the examples
node scripts/generate-placeholders.mjs --force  # back to abstract placeholders
```

Both scripts are dev-only. The fetch script uses `sharp`, which ships with Next
as an optional dependency — it is not a declared dependency of this project and
nothing at runtime imports it. Delete both scripts once real photography is in.

## Replacing the photography

Replace the files in place, keeping the same paths and filenames, and nothing
in the code needs to change:

```
src/images/<product-slug>/01.jpg   ← cover shot, used in the grid
src/images/<product-slug>/02.jpg
src/images/<product-slug>/03.jpg   ← detail crop
src/images/<product-slug>/04.jpg   ← label shot
src/images/lookbook/hero.jpg       ← home page, above the fold
src/images/editorial/01–08.jpg     ← home page scroll (see below)
src/images/archive/*.jpg           ← /archive image pairs
```

Shoot product images at **3:4**, the hero at **8:5**, and editorial images at
**2:3** (tall). They are rendered black and white with heavy contrast, so shoot
for that — hard flash, crushed blacks, no fill.

## The home page

The home page is a **splash**: one darkened image filling the viewport, the
wordmark centred over it, and nothing else. No header, no footer, no scroll.
The whole mark is the link — clicking it goes to `/shop`.

The image is `src/images/lookbook/hero.jpg`. It is graded much darker than the
rest of the set, at the source, by `DARK_PLATE` in
`scripts/fetch-example-images.mjs`. **That grading is load-bearing, not
decoration:** the wordmark sits directly on the photograph with no panel behind
it, so the plate is what keeps the type legible. Measured across every pixel of
the frame, off-white on the current hero reaches 7.97:1 — comfortably past the
4.5:1 WCAG needs for the 11px line.

If you swap in your own hero, re-measure. A CSS scrim alone will not save a
bright image: a flat black overlay on a bright photograph washes it grey rather
than darkening it, which is why the fix lives in the grade.

### Route groups

`src/app/(splash)/` is the home page and has no chrome. `src/app/(site)/` is
everything else and carries the header and footer via its own layout. Route
groups do not appear in URLs — `/shop` is still `/shop`.

### The lookbook sequence

The editorial run that used to sit under the home page now lives at the bottom
of `/archive`. Those images are **runway photography for now**, meant to be
replaced with our own styling shots — which is why the folder is
`src/images/editorial/` and the captions live in `src/data/editorial.ts`
rather than being tied to a season.

Each entry takes an `alt` (required), an optional `credit`, and an optional
`wide: true`.

**Tall shots are never cropped.** A full-length runway walk renders whole,
centred on black, so head and feet stay in frame. Setting `wide: true` opts an
image into a full-bleed landscape plate that *does* crop — use it for backstage
frames and detail crops, not for full looks.

## The wordmark

UNTILFOUREVER is set in **Jost** (next/font/google), a geometric sans in the
Futura lineage — the family the CELINE-style wordmark descends from. Caps,
0.2em tracking, weight 500, via the `wordmark` utility in `globals.css`. It is
the only place a font other than the Helvetica stack is used.

To change it, swap the `Jost` import in `src/app/layout.tsx`; the
`--font-wordmark-loaded` variable name is what `globals.css` expects.

`scripts/generate-placeholders.mjs` regenerates the placeholders if you need
them again (`npm run placeholders -- --force`). It is a dev-only script with no
runtime dependency; delete it once real photography is in.

## Adding a product

Everything lives in `src/data/products.ts`.

1. Drop the photographs into `src/images/<your-slug>/`.
2. Import them at the top of the file alongside the existing imports.
3. Add an entry to the `products` array.

TypeScript enforces the parts that are easy to forget: every image needs `alt`
text, every product needs at least one image, and `condition` must be one of
the five defined grades. A missing image file is a build error, not a blank
space on the live site.

Set `sold: true` to keep a piece visible with its price struck through. Set
`featured: true` to put it in the home page scroll.

## Art direction

The constraints are deliberate and enforced in `src/app/globals.css`:

- **Four colours.** `#000`, `#FAFAFA`, `#8A8A8A` for meta text, `#222` for
  hairlines. Plus `#606060` — the same meta grey corrected for the off-white
  detail column, where `#8A8A8A` would fail WCAG AA contrast.
- **No border-radius, no box-shadow, no gradients.** Hairline rules are the
  only divider.
- **Type**: real Helvetica Neue where the visitor has it, self-hosted Inter
  otherwise. Nav and labels caps at 11–12px with 0.12em tracking; product names
  lowercase. No serif.
- **Motion**: 150ms opacity fades and hairline underlines only, all of it
  disabled under `prefers-reduced-motion`.

If you add a colour, a soft corner or a shadow, it will be the only one on the
site and it will look like a mistake.

(Tailwind 4 scans every file in the repo for class names, prose included — so
writing a bare utility name like `border-radius` in Markdown is enough to emit
an unused rule. That is why the words above are hyphenated or avoided.)

## Notes on the build

- `/shop` renders per request because it reads filter params from the URL. That
  keeps every filtered view server-rendered at a shareable, crawlable URL with
  no catalogue JS shipped to the browser. The render is a filter over a
  constant array — a couple of milliseconds.
- All 14 product pages are prerendered at build time via `generateStaticParams`.
- TypeScript is pinned to `~5.9.3`. `npm install typescript` now resolves to
  7.x, which Next 16 does not document support for.

## Database (Prisma + Neon Postgres)

Postgres everywhere — local development and production both use Neon, so there
is one provider and one set of migrations with no drift between environments.

### First-time setup

1. Create a project at [neon.tech](https://neon.tech). Create a **dev branch**
   alongside the primary branch — use the dev branch locally.
2. Copy the **pooled** connection string (the host contains `-pooler`) from
   Connection Details. The pooled one matters: serverless functions cannot hold
   a normal connection pool open, and would exhaust Neon's connection limit.
3. Put it in `.env` as `DATABASE_URL` (see `.env.example` for the shape).
4. Create the tables:

```bash
npx prisma migrate dev --name init
```

For Vercel, set `DATABASE_URL` (primary branch) and `ANTHROPIC_API_KEY` in the
project's environment variables, and run `npx prisma migrate deploy` against
production when the schema changes.

### Why the client connects lazily

`src/lib/db.ts` exports a Proxy that builds the PrismaClient on first use, not
at import time. `next build` imports every route module to collect page data,
so an eager connection would make the *build* fail whenever `DATABASE_URL` is
missing or wrong — turning a misconfigured environment variable into a failed
deploy rather than a failed request. The storefront never touches the database
and must keep building without one.

### Schema decisions worth knowing

- **`igMediaId` is nullable and unique.** That is the dedupe key: `null` means
  hand-entered in /admin, non-null means imported from Instagram. NULLs are not
  equal to each other in SQL, so the unique index still allows many
  hand-entered rows while rejecting a re-imported post. Verified: duplicate
  inserts fail with P2002, and `upsert` on `igMediaId` updates in place.
- **`status`, `condition` and `category` are real Postgres enums.** The
  database rejects a value outside the set, so an unselected dropdown cannot be
  stored as an empty-string "condition".
- **`condition` uses `very_good`, not `"very good"`** — Prisma enum identifiers
  cannot contain spaces. `CONDITIONS` in `src/lib/extract.ts` is derived from
  the Prisma enum rather than retyped, so the extractor, the form and the
  database cannot drift; `conditionLabel()` renders it for humans.
- **`images` is a real `String[]`.** Ordered — `images[0]` is the cover shot.
- **`status` defaults to `draft`.** Nothing imported from Instagram goes live
  without review.

### Version pins

`prisma` and `@prisma/client` are pinned to **7.10.0**. `latest` currently
resolves to `8.0.0-rc.15`, a release candidate whose dependency tree npm 10.9
fails to resolve at all. Prisma 7 also has no bundled query engine — the
`@prisma/adapter-neon` driver adapter is required, and the connection URL lives
in `prisma7.config.ts` rather than in `schema.prisma`.

## The caption extractor and /admin

`src/lib/extract.ts` turns a caption into structured fields. It knows nothing
about Instagram — it takes a string and returns validated JSON, so the /admin
form and a future Instagram sync call the same function.

`/admin` is paste caption -> Parse -> correct the pre-filled form -> Save.
Everything saves as a **draft**; nothing is published automatically.

### It refuses to guess

The captions are short and routinely omit condition, designer and
measurements. Extraction proposes, a human confirms — so a field the caption
does not state comes back `null` and the form field stays empty, rather than
becoming a fabricated claim on a listing for a real garment. It will not infer:

- a condition from the absence of mentioned flaws
- a designer from the brand and season, however well known the pairing
- measurements from a size
- **a currency from the fact that the shop prices in CHF**

That last one matters. A caption reading `400$` is extracted as 400 USD, the
Price CHF field is left blank, and the form shows a warning to convert it
first. Defaulting `$` to CHF would silently mis-price a piece.

`confident: false` on an odd caption shows a "check every field" banner.

### Schema constraints learned the hard way

Two API limits on structured output that are not in the docs, both found by
calling it:

- `additionalProperties` is rejected on a **nullable object** (`type:
  ["object","null"]`). `measurements` is therefore a plain object.
- A schema may contain at most **16 union-typed parameters**. Ten nullable
  measurement fields alone blew past it, so measurements are plain numbers
  that are simply absent when not given.

If you add nullable fields, keep the union count under 16 — `grep -c 'type: \['`.

### Cost

One extraction is a few hundred tokens in and out on `claude-opus-5`. A few
hundred captions costs cents.
