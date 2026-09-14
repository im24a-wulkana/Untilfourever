import type { Metadata } from "next";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters, type ShopQuery } from "@/components/ShopFilters";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Every piece currently in the archive. Dior Homme, Saint Laurent Paris and Celine under Hedi Slimane, plus adjacent archive.",
};

/**
 * Reading searchParams makes this route render per request, which is the right
 * trade here: every filtered view is real server-rendered HTML at a shareable,
 * crawlable URL, and no part of the catalogue ships as client JS. The render
 * is a filter over a build-time constant array, so it is cheap — the measured
 * response is a couple of milliseconds. Vercel caches the static assets and
 * images regardless.
 */

/** searchParams values can arrive as arrays; take the first usable string. */
function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const query: ShopQuery = {
    brand: one(params.brand),
    size: one(params.size),
    category: one(params.category),
    sold: one(params.sold),
  };

  const filtered = products.filter((product) => {
    if (query.brand && product.brand !== query.brand) return false;
    if (query.size && product.size !== query.size) return false;
    if (query.category && product.category !== query.category) return false;
    if (query.sold === "sold" && !product.sold) return false;
    if (query.sold === "available" && product.sold) return false;
    return true;
  });

  return (
    <>
      <ShopFilters current={query} />

      <div className="flex items-baseline justify-between px-5 py-3 md:px-8">
        <h1 className="text-label uppercase tracking-caps text-meta">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </h1>
      </div>

      {filtered.length === 0 ? (
        <p className="border-t border-hairline px-5 py-16 text-body text-meta md:px-8">
          Nothing in the archive matches that combination. Clear a filter, or
          write to us — pieces move through quickly and some never reach the site.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 border-t border-hairline px-5 py-8 md:grid-cols-4 md:gap-x-6 md:px-8">
          {filtered.map((product, index) => (
            <li key={product.id}>
              {/* First row carries priority so the LCP image isn't lazy. */}
              <ProductCard product={product} priority={index < 4} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
