import Image from "next/image";
import Link from "next/link";
import { openingShot } from "@/data/editorial";
import { site } from "@/data/site";

/**
 * The splash. One image, darkened, with the wordmark over it — the whole mark
 * is the way in. No header, no scroll, no second call to action.
 */
export default function HomePage() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      <Image
        src={openingShot.src}
        alt={openingShot.alt}
        placeholder="blur"
        priority
        sizes="100vw"
        className="h-full w-full object-cover"
      />

      {/* Scrim. The image is the ground for the type, so it sits well back.
          A flat black wash, not a gradient — the house rules forbid gradients,
          and a flat scrim is what a darkened plate actually looks like. */}
      <div aria-hidden className="absolute inset-0 bg-black/40" />

      <Link
        href="/shop"
        aria-label={`${site.name} — enter the archive`}
        className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-[18vh] text-bone transition-opacity duration-150 ease-out hover:opacity-75 focus-visible:opacity-75"
      >
        {/* No panel behind the type — a box reads as UI, not as a wordmark.
            The image is graded down hard at the source instead (DARK_PLATE in
            scripts/fetch-example-images.mjs), so 11px off-white clears 4.5:1
            against the worst pixel in the frame. Verified by sampling the
            rendered page, not by eye. */}
        <span className="wordmark text-[clamp(1.5rem,6vw,3.25rem)] leading-none">
          {site.name}
        </span>
        <span className="mt-3 text-label uppercase tracking-caps text-bone">
          Enter the archive
        </span>
      </Link>
    </div>
  );
}
