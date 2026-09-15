"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Product slideshow: one large image, arrows, thumbnails, keyboard and swipe.
 *
 * The previous page stacked every photograph vertically, so a piece with four
 * shots made the page four screens tall and buried the details. One frame at a
 * time keeps the page a fixed height and treats the photographs as a sequence
 * rather than a list.
 */
export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const count = images.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      // Wrap around, so the sequence never dead-ends.
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Arrow keys, but only while the gallery has focus — hijacking them
  // page-wide would break normal scrolling.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      }
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (count === 0) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center border border-hairline">
        <span className="text-label uppercase tracking-caps text-meta">
          No photographs yet
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        ref={frameRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`${alt} — photograph ${index + 1} of ${count}`}
        className="relative mx-auto aspect-[3/4] max-h-[calc(100dvh-14rem)] w-full select-none bg-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-bone"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          const end = e.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (start == null || end == null) return;
          // 40px threshold so a tap or a vertical scroll is not read as a swipe.
          if (Math.abs(end - start) < 40) return;
          go(end < start ? index + 1 : index - 1);
        }}
      >
        {/* Every frame is rendered and toggled with opacity rather than
            unmounted, so moving between shots never shows a loading flash. */}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} — photograph ${i + 1} of ${count}`}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 55vw"
            aria-hidden={i !== index}
            className={`object-cover transition-opacity duration-150 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous photograph"
              className="absolute inset-y-0 left-0 flex w-16 items-center justify-start px-4 text-label uppercase tracking-caps text-bone opacity-0 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100"
            >
              <span aria-hidden className="text-lg leading-none">
                ←
              </span>
            </button>

            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next photograph"
              className="absolute inset-y-0 right-0 flex w-16 items-center justify-end px-4 text-label uppercase tracking-caps text-bone opacity-0 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100"
            >
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </button>

            {/* Counter, so the sequence length is obvious even before the
                thumbnails are noticed. */}
            <p className="absolute bottom-3 right-4 text-label uppercase tracking-caps text-bone">
              {index + 1} / {count}
            </p>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <ul className="flex gap-2" data-touch-target>
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photograph ${i + 1}`}
                aria-current={i === index}
                className={`relative block aspect-[3/4] w-14 overflow-hidden border transition-opacity duration-150 ${
                  i === index
                    ? "border-bone opacity-100"
                    : "border-hairline opacity-55 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
