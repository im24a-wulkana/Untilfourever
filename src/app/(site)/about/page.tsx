import type { Metadata } from "next";
import { instagramUrl, shipping } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "How untilfourever sources, measures and grades. Sizing, shipping to Switzerland and Europe, and the returns policy.",
};

const conditionGrades = [
  ["Deadstock", "Unworn, with tags or in original packaging where stated."],
  ["Excellent", "Worn a handful of times. No visible flaws under normal light."],
  ["Very good", "Light wear consistent with age. Any flaw is minor and noted."],
  ["Good", "Visible wear or a specific flaw, always photographed and described."],
  ["Worn", "Sold as a worn piece. Read the notes and look at the images closely."],
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-hairline px-5 py-10 md:px-8 md:py-14">
      <h2 className="text-label uppercase tracking-caps text-meta">{title}</h2>
      <div className="mt-5 max-w-[62ch] space-y-4">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div>
      <header className="border-b border-hairline px-5 py-12 md:px-8 md:py-20">
        <h1 className="text-label-lg uppercase tracking-caps text-meta">About</h1>
        <p className="mt-6 max-w-[48ch] text-editorial text-bone">
          A small archive dealing almost entirely in
          Slimane-era Dior Homme, Saint Laurent Paris and Celine, plus the
          indie and punk pieces that sat alongside them.
        </p>
      </header>

      <Section title="Condition grading">
        <dl className="space-y-3">
          {conditionGrades.map(([grade, meaning]) => (
            <div key={grade} className="border-b border-hairline pb-3">
              <dt className="text-label uppercase tracking-caps text-bone">
                {grade}
              </dt>
              <dd className="mt-1 text-body text-meta">{meaning}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Sizing">
        <p className="text-editorial text-bone">
          Slimane-era sizing runs small and narrow, and it is not consistent
          between houses or even between seasons. A Dior Homme 48 from AW06 will
          not fit like a Saint Laurent 48 from AW14. Ignore the label and use the
          measurements.
        </p>
        <p className="text-editorial text-bone">
          Every listing carries flat measurements in centimetres. Lay a piece you
          already own flat, measure it the same way, and compare. If you are
          between two pieces, write to us — we will measure again and tell you
          honestly which one to take.
        </p>
      </Section>

      <Section title="Shipping">
        <dl className="space-y-3">
          {Object.values(shipping).map((zone) => (
            <div key={zone.label} className="border-b border-hairline pb-3">
              <dt className="flex items-baseline justify-between">
                <span className="text-label uppercase tracking-caps text-bone">
                  {zone.label}
                </span>
                <span className="text-label uppercase tracking-caps text-meta">
                  {zone.price}
                </span>
              </dt>
              <dd className="mt-1 text-body text-meta">{zone.detail}</dd>
            </div>
          ))}
        </dl>
        <p className="text-body text-meta">
          Everything ships tracked and insured. Orders leave within two working
          days of payment clearing.
        </p>
      </Section>

      <section data-touch-target className="px-5 py-10 md:px-8 md:py-14">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rule-link text-label-lg uppercase tracking-caps text-bone"
        >
          Get in touch on Instagram
        </a>
      </section>
    </div>
  );
}
