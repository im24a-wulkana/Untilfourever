import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  productImages,
  measurementEntries,
  conditionLabel,
} from "@/lib/products";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/components/Price";
import { ProductGallery } from "@/components/ProductGallery";
import { EnquireLinks } from "@/components/EnquireLinks";
import { addToCartAction } from "../../cart/actions";

export const dynamic = "force-dynamic";

const MEASUREMENT_LABELS: Record<string, string> = {
  chest: "Chest",
  shoulders: "Shoulders",
  sleeve: "Sleeve",
  length: "Length",
  waist: "Waist",
  hips: "Hips",
  inseam: "Inseam",
  rise: "Rise",
  hem: "Hem",
  insole: "Insole",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };

  return {
    title: `${product.brand} ${product.season} — ${product.name}`,
    description:
      `${product.brand}, ${product.season}. Size ${product.size}. ${product.conditionNotes ?? ""}`.trim(),
  };
}

/** One spec row. Hairline-ruled, label left, value right. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-hairline py-2.5">
      <dt className="text-label uppercase tracking-caps text-meta">{label}</dt>
      <dd className="text-body text-bone">{children}</dd>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = productImages(product);
  const measurements = measurementEntries(product);
  const sold = product.status === "sold";
  const title = `${product.brand} ${product.season} — ${product.name}`;

  const user = await getUser();
  const inCart = user
    ? !!(await db.cartItem.findFirst({
        where: { productId: product.id, cart: { userId: user.id } },
        select: { id: true },
      }))
    : false;

  return (
    <article data-touch-target className="px-5 py-6 md:px-8 md:py-10">
      <p className="mb-6">
        <Link
          href="/shop"
          className="rule-link text-label uppercase tracking-caps text-meta"
        >
          ← Back to shop
        </Link>
      </p>

      {/* Gallery beside the details on desktop, stacked on a phone with the
          photograph first. The page was previously a vertical stack of every
          shot, which made a four-image piece four screens tall. */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
        <ProductGallery images={images} alt={title} />

        <div className="lg:sticky lg:top-8 lg:self-start">
          <header className="border-b border-hairline pb-5">
            <p className="text-label uppercase tracking-caps text-meta">
              {product.brand}
              {product.designer ? ` · ${product.designer}` : ""}
            </p>
            <h1 className="mt-2 text-editorial text-bone">{product.name}</h1>
            <p className="mt-1 text-label uppercase tracking-caps text-meta">
              {product.season}
            </p>

            <p className="mt-5 flex items-baseline gap-3">
              <span className="text-editorial text-bone">
                {sold ? (
                  <s className="text-meta">{formatPrice(product.priceUSD)}</s>
                ) : (
                  formatPrice(product.priceUSD)
                )}
              </span>
              {sold ? (
                <span className="text-label uppercase tracking-caps text-meta">
                  Sold
                </span>
              ) : null}
            </p>
          </header>

          <dl className="mt-5">
            <Row label="Size">{product.size}</Row>
            {product.condition ? (
              <Row label="Condition">
                <span className="capitalize">
                  {conditionLabel(product.condition)}
                </span>
              </Row>
            ) : null}
            {product.category ? (
              <Row label="Type">
                <span className="capitalize">{product.category}</span>
              </Row>
            ) : null}
          </dl>

          {/* Buying comes before the reference material: someone who has
              already decided should not scroll past measurements to act. */}
          <div className="mt-6">
            {sold ? (
              <p className="border border-hairline px-5 py-3.5 text-center text-label uppercase tracking-caps text-meta">
                Sold
              </p>
            ) : inCart ? (
              <Link
                href="/cart"
                className="block border border-bone px-5 py-4 text-center text-label uppercase tracking-caps text-bone transition-opacity duration-150 hover:opacity-60"
              >
                In your cart — go to cart
              </Link>
            ) : (
              <form action={addToCartAction}>
                <input type="hidden" name="productId" value={product.id} />
                <input type="hidden" name="slug" value={product.slug} />
                <button
                  type="submit"
                  className="w-full border border-bone px-5 py-4 text-label uppercase tracking-caps text-bone transition-opacity duration-150 hover:opacity-60"
                >
                  Add to cart
                </button>
              </form>
            )}
          </div>

          {product.conditionNotes ? (
            <section className="mt-8 border-t border-hairline pt-5">
              <h2 className="text-label uppercase tracking-caps text-meta">
                Condition
              </h2>
              <p className="mt-2 max-w-[56ch] text-body text-bone">
                {product.conditionNotes}
              </p>
            </section>
          ) : null}

          {measurements.length > 0 ? (
            <section className="mt-8 border-t border-hairline pt-5">
              <h2 className="text-label uppercase tracking-caps text-meta">
                Measurements — flat, cm
              </h2>
              <dl className="mt-3 grid grid-cols-2 gap-x-8">
                {measurements.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-baseline justify-between border-b border-hairline py-2"
                  >
                    <dt className="text-label uppercase tracking-caps text-meta">
                      {MEASUREMENT_LABELS[key] ?? key}
                    </dt>
                    <dd className="text-body text-bone">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-label uppercase tracking-caps text-meta">
                Measure a piece you own and compare
              </p>
            </section>
          ) : null}

          <div className="mt-8">
            <EnquireLinks
              product={{
                id: product.id,
                brand: product.brand,
                season: product.season,
                name: product.name,
                size: product.size,
                priceUSD: product.priceUSD,
                sold,
              }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
