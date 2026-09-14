import { instagramDmUrl, site } from "@/data/site";
import type { Product } from "@/data/types";
import { formatPrice } from "./Price";

/**
 * No cart and no form. A prefilled mailto carrying everything needed to
 * identify the piece, plus an Instagram DM as the secondary route.
 */
export function EnquireLinks({ product }: { product: Product }) {
  const subject = `Enquiry — ${product.brand} ${product.season} ${product.name} (${product.id})`;

  const body = [
    `Piece: ${product.brand} ${product.season} — ${product.name}`,
    `Size: ${product.size}`,
    `Price: ${formatPrice(product.priceCHF)}`,
    `Reference: ${product.id}`,
    "",
    "",
  ].join("\n");

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (product.sold) {
    return (
      <div className="border-t border-hairline pt-5">
        <p className="text-label uppercase tracking-caps text-meta">
          This piece has sold
        </p>
        <p className="mt-2 text-body text-meta">
          Email to be told when something comparable comes in.{" "}
          <a href={`mailto:${site.email}`} className="rule-link text-black">
            {site.email}
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-hairline pt-5">
      <a
        href={mailto}
        className="inline-block border border-black px-6 py-3 text-label uppercase tracking-caps text-black transition-opacity duration-150 ease-out hover:opacity-55"
      >
        Enquire
      </a>

      <p className="mt-3 text-label uppercase tracking-caps text-meta">
        or{" "}
        <a
          href={instagramDmUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rule-link text-black"
        >
          message on Instagram
        </a>
      </p>
    </div>
  );
}
