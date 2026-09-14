import { instagramUrl, site } from "@/data/site";

/**
 * Instagram is the only contact route — there is no email address anywhere on
 * the site.
 *
 * `mt-auto` is what keeps this at the bottom of the viewport on short pages:
 * body is a flex column of min-height 100dvh, so the auto margin absorbs the
 * leftover space instead of letting the footer float up mid-page when the shop
 * has few listings.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-hairline bg-black">
      <div className="flex flex-col gap-4 px-5 py-6 text-label uppercase tracking-caps md:flex-row md:items-baseline md:justify-between md:px-8">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rule-link text-bone"
        >
          Instagram
        </a>

        <p className="text-meta">Shipped worldwide from {site.shipsFrom}</p>

        <p className="text-meta">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
