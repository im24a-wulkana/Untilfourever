import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, productById } from "@/data/products";
import { MEASUREMENT_LABELS, type Measurements } from "@/data/types";
import { Price } from "@/components/Price";
import { EnquireLinks } from "@/components/EnquireLinks";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = productById.get(id);

  if (!product) return { title: "Not found" };

  return {
    title: `${product.brand} ${product.season} — ${product.name}`,
    description: `${product.brand}, ${product.season}. Size ${product.size}. ${product.conditionNotes}`,
    openGraph: {
      title: `${product.brand} — ${product.name}`,
      description: `${product.season} · Size ${product.size}`,
      images: [{ url: product.images[0].src.src }],
    },
  };
}

function MeasurementList({ measurements }: { measurements: Measurements }) {
  const entries = Object.entries(measurements).filter(
    (entry): entry is [keyof Measurements, number] => entry[1] !== undefined,
  );

  if (entries.length === 0) return null;

  return (
    <div className="border-t border-hairline pt-5">
      <h2 className="text-label uppercase tracking-caps text-meta">
        Measurements — flat, cm
      </h2>

      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
        {entries.map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-hairline py-1">
            <dt className="text-label uppercase tracking-caps text-meta">
              {MEASUREMENT_LABELS[key]}
            </dt>
            <dd className="text-body text-black">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-label uppercase tracking-caps text-meta">
        Taken garment flat. Measure a piece you own to compare.
      </p>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = productById.get(id);

  if (!product) notFound();

  return (
    <article className="md:grid md:grid-cols-[1fr_minmax(20rem,26rem)]">
      {/* Image column — vertical scroll of every shot. */}
      <div className="border-hairline md:border-r">
        <h1 className="sr-only">
          {product.brand} {product.season} — {product.name}
        </h1>

        {product.images.map((image, index) => (
          <div key={image.src.src} className="relative aspect-[3/4] w-full">
            <Image
              src={image.src}
              alt={image.alt}
              placeholder="blur"
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 60vw"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Detail column — off-white ground, sticky on desktop. */}
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
              <div className="flex justify-between border-b border-hairline py-1">
                <dt className="text-label uppercase tracking-caps text-meta">Condition</dt>
                <dd className="text-body capitalize">{product.condition}</dd>
              </div>
              <div className="flex justify-between border-b border-hairline py-1">
                <dt className="text-label uppercase tracking-caps text-meta">Price</dt>
                <dd className="text-body">
                  <Price priceCHF={product.priceCHF} sold={product.sold} />
                </dd>
              </div>
            </dl>

            <div className="border-t border-hairline pt-5">
              <h2 className="text-label uppercase tracking-caps text-meta">
                Condition notes
              </h2>
              <p className="mt-2 text-body text-black">{product.conditionNotes}</p>
            </div>

            <MeasurementList measurements={product.measurements} />

            <EnquireLinks product={product} />

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
