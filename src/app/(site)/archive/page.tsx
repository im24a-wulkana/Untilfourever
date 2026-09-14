import type { Metadata } from "next";
import Image from "next/image";
import { editorialShots } from "@/data/editorial";
import diorA from "@/images/archive/dior-01.jpg";
import diorB from "@/images/archive/dior-02.jpg";
import slpA from "@/images/archive/slp-01.jpg";
import slpB from "@/images/archive/slp-02.jpg";
import celineA from "@/images/archive/celine-01.jpg";
import celineB from "@/images/archive/celine-02.jpg";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "Notes on the three houses Hedi Slimane rebuilt — Dior Homme 2000–2007, Saint Laurent Paris 2012–2016, Celine 2018–2019 — and why the cut still matters.",
};

const eras = [
  {
    id: "dior-homme",
    years: "2000 — 2007",
    house: "Dior Homme",
    body: [
      "Slimane arrived at Dior Homme in 2000 and spent seven years narrowing the male silhouette until the rest of the industry had to follow. The shoulder came in, the sleeve lengthened, the trouser lost its break. Karl Lagerfeld famously lost a considerable amount of weight in order to wear it.",
      "The tailoring from this period is still the reference point. A jacket from AW04 or AW06 is cut closer than almost anything made since, and the wools were chosen to hold that line rather than drape away from it. Pieces survive well when they have been stored properly — the failure points are moth at the tails and shine at the elbow, both of which we photograph closely rather than flatter.",
    ],
    images: [
      { src: diorA, alt: "Dior Homme era tailoring photographed under hard flash against a pale wall" },
      { src: diorB, alt: "Close crop of a Dior Homme jacket sleeve and shoulder seam" },
    ],
  },
  {
    id: "saint-laurent-paris",
    years: "2012 — 2016",
    house: "Saint Laurent Paris",
    body: [
      "The return in 2012 dropped the Yves, moved the studio, and drew an enormous amount of criticism that now reads as noise. What Slimane actually built was a wardrobe drawn from Los Angeles rather than Paris: the teddy jacket, the L01 biker, the skinny jean in coated and glittered finishes, boots with a Cuban heel cut narrow enough to change the whole line of the leg.",
      "The leather from these years was exceptional and has aged accordingly — lambskin that softens rather than cracks. Condition on the coated denim is the thing to read carefully, because the coating wears at the knee long before the denim underneath gives out. That wear is not damage. It is how the piece was designed to age.",
    ],
    images: [
      { src: slpA, alt: "Saint Laurent Paris era leather jacket shot in high contrast black and white" },
      { src: slpB, alt: "Detail of a Saint Laurent Paris zip and lambskin grain" },
    ],
  },
  {
    id: "celine",
    years: "2018 — 2019",
    house: "Celine",
    body: [
      "Two years, and the shortest of the three chapters. Slimane removed the accent from the name, and the first show in September 2018 was met with the same hostility as the Saint Laurent debut. The clothes themselves were quieter than the reaction suggested: fine gauge knitwear, a narrow trouser, the teddy blouson rendered in wool rather than leather.",
      "Because the window was short, the volume is low. AW18 and AW19 pieces surface less often than anything from the Dior or Saint Laurent years, and they tend to arrive in better condition simply because they are younger. This is the part of the archive that will be hardest to find in ten years.",
    ],
    images: [
      { src: celineA, alt: "Celine era knitwear laid flat and lit from one side" },
      { src: celineB, alt: "Close crop of a fine gauge Celine knit collar" },
    ],
  },
];

export default function ArchivePage() {
  return (
    <div>
      <header className="border-b border-hairline px-5 py-12 md:px-8 md:py-20">
        <h1 className="text-label-lg uppercase tracking-caps text-meta">
          The archive
        </h1>
        <p className="mt-6 max-w-[48ch] text-editorial text-bone">
          Three houses across nineteen years, one cut. What follows is context
          for the pieces we sell — what to look for, what ages well, and what
          the condition notes actually mean.
        </p>
      </header>

      {eras.map((era) => (
        <section
          key={era.id}
          aria-labelledby={`${era.id}-heading`}
          className="border-b border-hairline"
        >
          <div className="px-5 py-12 md:px-8 md:py-16">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <h2
                id={`${era.id}-heading`}
                className="text-label-lg uppercase tracking-caps text-bone"
              >
                {era.house}
              </h2>
              <p className="text-label uppercase tracking-caps text-meta">
                {era.years}
              </p>
            </div>

            <div className="mt-6 max-w-[62ch] space-y-4">
              {era.body.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-editorial text-bone">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Image pairs, edge to edge. */}
          <div className="grid grid-cols-2 gap-px border-t border-hairline">
            {era.images.map((image) => (
              <div key={image.src.src} className="relative aspect-[3/4] w-full">
                <Image
                  src={image.src}
                  alt={image.alt}
                  placeholder="blur"
                  sizes="50vw"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Lookbook sequence. Runway for now; to be replaced with our own
          styling shots — see src/data/editorial.ts. */}
      <section aria-labelledby="lookbook-heading">
        <div className="px-5 py-12 md:px-8 md:py-16">
          <h2
            id="lookbook-heading"
            className="text-label-lg uppercase tracking-caps text-bone"
          >
            Lookbook
          </h2>
        </div>

        <ul>
          {editorialShots.map((shot) => (
            <li key={shot.src.src} className="border-t border-hairline">
              <figure>
                {shot.wide ? (
                  <div className="relative aspect-[4/5] w-full md:aspect-[16/9]">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      placeholder="blur"
                      sizes="100vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  // A full look is shown whole — cropping it to a landscape
                  // band defeats the point of the image.
                  <div className="flex justify-center bg-black py-px">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      placeholder="blur"
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="h-auto max-h-[88dvh] w-auto max-w-full object-contain"
                    />
                  </div>
                )}

                {shot.credit ? (
                  <figcaption className="px-5 py-4 text-label uppercase tracking-caps text-meta md:px-8">
                    {shot.credit}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
