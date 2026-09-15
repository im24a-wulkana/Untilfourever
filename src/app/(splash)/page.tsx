import Image from "next/image";
import Link from "next/link";
import { openingShot } from "@/data/hero";
import { site } from "@/data/site";

/**
 * The splash. One image, darkened, with the wordmark over it — the whole mark
 * is the way in. No header, no scroll, no second call to action.
 */
export default function HomePage() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      {/* A portrait photograph on a wide screen gets cropped hard by
          object-cover. Anchoring to the top sounded right but put the head at
          the centre of the frame and pushed the garment off the bottom — so
          the crop stays centred, where the clothes are. */}
      <Image
        src={openingShot.src}
        alt={openingShot.alt}
        placeholder="blur"
        priority
        quality={90}
        sizes="100vw"
        className="h-full w-full object-cover object-center"
      />

      {/* Scrim. The image is the ground for the type, so it sits well back.
          A flat black wash, not a gradient — the house rules forbid gradients,
          and a flat scrim is what a darkened plate actually looks like. */}
      <div aria-hidden className="absolute inset-0 bg-black/40" />

      {/* No hover fade on this link: it covers the whole viewport (inset-0),
          so the pointer is always inside it. A hover state would be
          permanently on, dimming the wordmark to grey rather than white. */}
      <Link
        href="/shop"
        aria-label={`${site.name} — store`}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-bone focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-4 focus-visible:outline-bone"
      >
        {/* The two lines are one group, nudged so the PAIR is optically
            centred rather than the wordmark alone sitting on the centre line
            with the sub-line hanging below it. The 6px is measured, not
            guessed: leading-none collapses the wordmark's line box, so flex
            centring cannot see the space the type actually occupies.

            No panel behind the type — a box reads as UI, not as a wordmark.
            The image is graded down hard at the source instead (DARK_PLATE in
            scripts/fetch-example-images.mjs), so 11px off-white clears 4.5:1
            against the worst pixel in the frame. Verified by sampling the
            rendered page, not by eye. */}
        <span className="flex translate-y-[6px] flex-col items-center">
          <span className="wordmark text-[clamp(1.5rem,6vw,3.25rem)] leading-none">
            {site.name}
          </span>
          <span className="mt-3 text-label uppercase tracking-caps text-bone">
            Store
          </span>
        </span>
      </Link>
    </div>
  );
}
