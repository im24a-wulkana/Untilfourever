import { instagramUrl, site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-hairline bg-black">
      <div className="flex flex-col gap-4 px-5 py-6 text-label uppercase tracking-caps md:flex-row md:items-baseline md:justify-between md:px-8">
        <ul className="flex flex-wrap items-baseline gap-5 md:gap-8">
          <li>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rule-link text-bone"
            >
              Instagram
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="rule-link text-bone">
              {site.email}
            </a>
          </li>
        </ul>

        <p className="text-meta">
          Shipped worldwide from {site.city}
        </p>

        <p className="text-meta">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
