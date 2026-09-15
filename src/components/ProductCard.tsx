import Image from "next/image";
import Link from "next/link";
import { Price } from "./Price";

/**
 * Grid cell: image, then caption underneath. Nothing else — no hover card, no
 * quick-add, no badge. Sold pieces stay in the grid rather than disappearing.
 *
 * Images are URLs from the database now, not static imports, so width/height
 * are given explicitly and `sizes` keeps the srcset sensible.
 */
export function ProductCard({
  slug,
  brand,
  season,
  name,
  size,
  priceUSD,
  sold,
  image,
  priority = false,
}: {
  id: string;
  slug: string;
  brand: string;
  season: string;
  name: string;
  size: string;
  priceUSD: number;
  sold?: boolean;
  image: string | null;
  priority?: boolean;
}) {
  return (
    <article>
      <Link href={`/shop/${slug}`} className="group block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
          {image ? (
            <Image
              src={image}
              alt={`${brand} ${season} — ${name}`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-opacity duration-150 ease-out group-hover:opacity-70"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center border border-hairline">
              <span className="text-label uppercase tracking-caps text-meta">
                No image
              </span>
            </div>
          )}
        </div>

        <div className="mt-2 space-y-0.5 text-label uppercase tracking-caps">
          <p className="text-meta">{brand}</p>
          <p className="text-meta">{season}</p>
          <p className="normal-case tracking-normal text-bone">{name}</p>
          <p className="text-meta">
            {size} · <Price priceUSD={priceUSD} sold={sold} />
          </p>
        </div>
      </Link>
    </article>
  );
}
