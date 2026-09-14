/**
 * Every owner-editable value lives here. Replace the placeholders below and
 * nothing else in the codebase needs to change.
 */

export const site = {
  name: "untilfourever",
  title: "untilfourever — archive",
  description:
    "Secondhand designer archive. Dior Homme 2000–07, Saint Laurent Paris 2012–16, Celine 2018–19, and adjacent indie and punk archive. Shipped from Zürich.",
  url: "https://untilfourever.ch",

  // --- REPLACE THESE -------------------------------------------------------
  email: "archive@untilfourever.ch",
  instagramHandle: "untilfourever",
  // -------------------------------------------------------------------------

  city: "Zürich",
  country: "Switzerland",
} as const;

export const instagramUrl = `https://instagram.com/${site.instagramHandle}`;

/** Instagram's direct-message deep link. */
export const instagramDmUrl = `https://ig.me/m/${site.instagramHandle}`;

export const shipping = {
  ch: { label: "Switzerland", price: "CHF 9", detail: "Swiss Post, 2–3 working days, tracked." },
  eu: { label: "Europe", price: "CHF 25", detail: "DHL, 3–6 working days, tracked and signed for." },
  world: { label: "Rest of world", price: "CHF 45", detail: "DHL, 5–10 working days. Duties payable on arrival." },
} as const;

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
