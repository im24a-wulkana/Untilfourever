import type { Metadata } from "next";
import Image from "next/image";
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
import { Price } from "@/components/Price";
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
    description: `${product.brand}, ${product.season}. Size ${product.size}. ${product.conditionNotes ?? ""}`.trim(),
  };
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

  const user = await getUser();
  const inCart = user
    ? !!(await db.cartItem.findFirst({
        where: { productId: product.id, cart: { userId: user.id } },
        select: { id: true },
      }))
    : false;

  return (
    <article className="md:grid md:grid-cols-[1fr_minmax(20rem,26rem)]">
      <div className="border-hairline md:border-r">
        <h1 className="sr-only">
          {product.brand} {product.season} — {product.name}
        </h1>

        {images.length === 0 ? (
          <div className="flex aspect-[3/4] w-full items-center justify-center border-b border-hairline">
            <span className="text-label uppercase tracking-caps text-meta">
              No photographs yet
            </span>
          </div>
        ) : (
          images.map((src, index) => (
            <div key={src} className="relative aspect-[3/4] w-full">
              <Image
                src={src}
                alt={`${product.brand} ${product.season} — ${product.name}, image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          ))
        )}
      </div>

      <div className="on-bone bg-bone text-black">
        <div className="md:sticky md:top-0 md:max-h-dvh md:overflow-y-auto">
          <div className="space-y-5 px-5 py-8 md:px-7">
            <header className="space-y-1">
              <p className="text-label uppercase tracking-caps text-meta">
                {product.brand}
              </p>
              <p className="text-label uppercase tracking-caps text-meta">
                {product.season}
              </p>
              <p className="text-editorial text-black">{product.name}</p>
            </header>

            <dl className="border-t border-hairline pt-5">
              <div className="flex justify-between border-b border-hairline py-1">
                <dt className="text-label uppercase tracking-caps text-meta">Size</dt>
                <dd className="text-body">{product.size}</dd>
              </div>
              {product.condition ? (
                <div className="flex justify-between border-b border-hairline py-1">
                  <dt className="text-label uppercase tracking-caps text-meta">
                    Condition
                  </dt>
                  <dd className="text-body capitalize">
                    {conditionLabel(product.condition)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between border-b border-hairline py-1">
                <dt className="text-label uppercase tracking-caps text-meta">Price</dt>
                <dd className="text-body">
                  <Price priceCHF={product.priceCHF} sold={sold} />
                </dd>
              </div>
            </dl>

            {product.conditionNotes ? (
              <div className="border-t border-hairline pt-5">
                <h2 className="text-label uppercase tracking-caps text-meta">
                  Condition notes
                </h2>
                <p className="mt-2 text-body text-black">
                  {product.conditionNotes}
                </p>
              </div>
            ) : null}

            {measurements.length > 0 ? (
              <div className="border-t border-hairline pt-5">
                <h2 className="text-label uppercase tracking-caps text-meta">
                  Measurements — flat, cm
                </h2>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
                  {measurements.map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b border-hairline py-1"
                    >
                      <dt className="text-label uppercase tracking-caps text-meta">
                        {MEASUREMENT_LABELS[key] ?? key}
                      </dt>
                      <dd className="text-body text-black">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {/* Add to cart, unless it has sold or is already in there. */}
            {!sold ? (
              inCart ? (
                <div className="border-t border-hairline pt-5">
                  <p className="text-label uppercase tracking-caps text-meta">
                    In your cart
                  </p>
                  <p className="mt-2">
                    <Link href="/cart" className="rule-link text-body text-black">
                      Go to cart
                    </Link>
                  </p>
                </div>
              ) : (
                <form action={addToCartAction} className="border-t border-hairline pt-5">
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="slug" value={product.slug} />
                  <button
                    type="submit"
                    className="inline-block border border-black px-6 py-3 text-label uppercase tracking-caps text-black transition-opacity duration-150 ease-out hover:opacity-55"
                  >
                    Add to cart
                  </button>
                </form>
              )
            ) : null}

            <EnquireLinks
              product={{
                id: product.id,
                brand: product.brand,
                season: product.season,
                name: product.name,
                size: product.size,
                priceCHF: product.priceCHF,
                sold,
              }}
            />

            <p className="border-t border-hairline pt-5 text-label uppercase tracking-caps text-meta">
              <Link href="/shop" className="rule-link text-black">
                Back to shop
              </Link>
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
