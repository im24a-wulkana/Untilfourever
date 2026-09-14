import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/types";
import { Price } from "./Price";

/**
 * Grid cell: image, then caption underneath. Nothing else — no hover card, no
 * quick-add, no badge. Sold pieces stay in the grid rather than disappearing.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const cover = product.images[0];

  return (
    <article>
      <Link href={`/shop/${product.id}`} className="group block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
          <Image
            src={cover.src}
            alt={cover.alt}
            placeholder="blur"
            priority={priority}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="h-full w-full object-cover transition-opacity duration-150 ease-out group-hover:opacity-70"
          />
        </div>

        <div className="mt-2 space-y-0.5 text-label uppercase tracking-caps">
          <p className="text-meta">{product.brand}</p>
          <p className="text-meta">{product.season}</p>
          <p className="normal-case tracking-normal text-bone">{product.name}</p>
          <p className="text-meta">
            {product.size} · <Price priceCHF={product.priceCHF} sold={product.sold} />
          </p>
        </div>
      </Link>
    </article>
  );
}
