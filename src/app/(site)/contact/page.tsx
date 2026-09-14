import type { Metadata } from "next";
import { instagramUrl, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Enquiries, sizing questions and sourcing requests — ${site.email} or Instagram.`,
};

export default function ContactPage() {
  return (
    <div>
      <header className="border-b border-hairline px-5 py-12 md:px-8 md:py-20">
        <h1 className="text-label-lg uppercase tracking-caps text-meta">
          Contact
        </h1>
        <p className="mt-6 max-w-[48ch] text-editorial text-bone">
          There is no checkout. Every piece is sold by enquiry, which keeps the
          conversation about fit and condition where it belongs — before the
          money moves.
        </p>
      </header>

      <section className="border-b border-hairline px-5 py-10 md:px-8 md:py-14">
        <h2 className="text-label uppercase tracking-caps text-meta">Email</h2>
        <p className="mt-4">
          <a
            href={`mailto:${site.email}`}
            className="rule-link text-editorial text-bone"
          >
            {site.email}
          </a>
        </p>
        <p className="mt-4 max-w-[62ch] text-body text-meta">
          Quote the reference from the listing if you are asking about a specific
          piece. Replies usually within a day, always within three.
        </p>
      </section>

      <section className="border-b border-hairline px-5 py-10 md:px-8 md:py-14">
        <h2 className="text-label uppercase tracking-caps text-meta">Instagram</h2>
        <p className="mt-4">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rule-link text-editorial text-bone"
          >
            @{site.instagramHandle}
          </a>
        </p>
        <p className="mt-4 max-w-[62ch] text-body text-meta">
          New arrivals go up here first. Direct messages are fine for quick
          questions, but anything involving measurements or payment is better by
          email.
        </p>
      </section>

      <section className="border-b border-hairline px-5 py-10 md:px-8 md:py-14">
        <h2 className="text-label uppercase tracking-caps text-meta">Selling</h2>
        <div className="mt-4 max-w-[62ch] space-y-4">
          <p className="text-editorial text-bone">
            We buy Slimane-era pieces outright. Send clear photographs of the
            front, back, any flaw, and the interior label, along with flat
            measurements if you have them.
          </p>
          <p className="text-body text-meta">
            We do not take consignment, and we do not make offers without seeing
            the label.
          </p>
        </div>
      </section>

      <section className="px-5 py-10 md:px-8 md:py-14">
        <h2 className="text-label uppercase tracking-caps text-meta">Located</h2>
        <p className="mt-4 text-editorial text-bone">
          {site.city}, {site.country}
        </p>
        <p className="mt-2 text-body text-meta">
          Viewings by appointment only.
        </p>
      </section>
    </div>
  );
}
