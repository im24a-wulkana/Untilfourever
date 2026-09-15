import type { Metadata } from "next";
import Link from "next/link";
import { getShopProducts, getFacets, productImages } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters, type ShopQuery } from "@/components/ShopFilters";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Every piece currently in the archive. Dior Homme, Saint Laurent Paris and Celine under Hedi Slimane, plus adjacent archive.",
};

// Reads live catalogue data, so it renders per request.
export const dynamic = "force-dynamic";

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

  const [products, facets] = await Promise.all([
    getShopProducts(query),
    getFacets(),
  ]);

  return (
    <>
      <ShopFilters current={query} facets={facets} />

      <div className="flex items-baseline justify-between px-5 py-3 md:px-8">
        <h1 className="text-label uppercase tracking-caps text-meta">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="border-t border-hairline px-5 py-16 md:px-8">
          <p className="max-w-[62ch] text-body text-meta">
            Nothing in the archive matches that combination. Clear a filter, or
            write to us — pieces move through quickly and some never reach the
            site.
          </p>
          <p className="mt-4">
            <Link
              href="/shop"
              className="rule-link text-label uppercase tracking-caps text-bone"
            >
              Clear filters
            </Link>
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 border-t border-hairline px-5 py-8 md:grid-cols-4 md:gap-x-6 md:px-8">
          {products.map((product, index) => (
            <li key={product.id}>
              <ProductCard
                id={product.id}
                slug={product.slug}
                brand={product.brand}
                season={product.season}
                name={product.name}
                size={product.size}
                priceUSD={product.priceUSD}
                sold={product.status === "sold"}
                image={productImages(product)[0] ?? null}
                priority={index < 4}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
