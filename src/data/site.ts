/**
 * Every owner-editable value lives here. Replace the placeholders below and
 * nothing else in the codebase needs to change.
 */

export const site = {
  name: "untilfourever",
  title: "untilfourever — archive",
  description:
    "Secondhand designer archive. Dior Homme 2000–07, Saint Laurent Paris 2012–16, Celine 2018–19, and adjacent indie and punk archive. Shipped worldwide from Europe.",
  url: "https://untilfourever.ch",

  // --- REPLACE THIS --------------------------------------------------------
  // Instagram is the only contact route: there is no email address anywhere on
  // the site, and no /contact page.
  instagramHandle: "untilfourever",
  // -------------------------------------------------------------------------

  shipsFrom: "Europe",
} as const;

export const instagramUrl = `https://instagram.com/${site.instagramHandle}`;

/** Instagram's direct-message deep link. */
export const instagramDmUrl = `https://ig.me/m/${site.instagramHandle}`;

export const shipping = {
  eu: {
    label: "Europe",
    price: "CHF 15",
    detail: "Tracked and signed for, 2–5 working days.",
  },
  world: {
    label: "Rest of world",
    price: "CHF 45",
    detail: "DHL, 5–10 working days. Duties payable on arrival.",
  },
} as const;

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
] as const;
