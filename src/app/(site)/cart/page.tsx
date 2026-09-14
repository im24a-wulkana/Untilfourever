import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { getCart } from "@/lib/cart";
import { productImages } from "@/lib/products";
import { formatPrice } from "@/components/Price";
import { removeFromCartAction } from "./actions";
import { checkoutAction } from "./checkout";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="px-5 py-16 md:px-8 md:py-24">
        <h1 className="text-label-lg uppercase tracking-caps text-meta">Cart</h1>
        <p className="mt-6 max-w-[48ch] text-editorial text-bone">
          Sign in to keep a cart. It is saved to your account, so it is still
          there next time.
        </p>
        <p className="mt-8">
          <Link
            href="/auth/sign-in?next=/cart"
            className="inline-block border border-bone px-6 py-3 text-label uppercase tracking-caps text-bone transition-opacity duration-150 hover:opacity-60"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  const cart = await getCart();
  const items = cart?.items ?? [];
  const total = cart?.totalCHF ?? 0;
  const hasAvailable = items.some((i) => !i.unavailable);

  return (
    <div className="px-5 py-10 md:px-8 md:py-14">
      <h1 className="text-label-lg uppercase tracking-caps text-meta">Cart</h1>

      {items.length === 0 ? (
        <>
          <p className="mt-6 max-w-[48ch] text-editorial text-bone">
            Nothing in the cart yet.
          </p>
          <p className="mt-8">
            <Link
              href="/shop"
              className="rule-link text-label uppercase tracking-caps text-bone"
            >
              Browse the archive
            </Link>
          </p>
        </>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
            {items.map((item) => {
              const cover = productImages(item.product)[0] ?? null;
              return (
                <li key={item.id} className="flex gap-4 py-4">
                  <div className="relative aspect-[3/4] w-20 shrink-0 bg-black">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={`${item.product.brand} — ${item.product.name}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-label uppercase tracking-caps text-meta">
                        {item.product.brand} · {item.product.season}
                      </p>
                      <p className="text-body text-bone">{item.product.name}</p>
                      <p className="text-label uppercase tracking-caps text-meta">
                        Size {item.product.size}
                      </p>
                      {item.unavailable ? (
                        <p className="text-label uppercase tracking-caps text-bone">
                          No longer available — it will not be charged
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-body text-bone">
                        {formatPrice(item.product.priceCHF)}
                      </span>
                      <form action={removeFromCartAction}>
                        <input
                          type="hidden"
                          name="productId"
                          value={item.product.id}
                        />
                        <button
                          type="submit"
                          className="rule-link text-label uppercase tracking-caps text-meta"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex items-baseline justify-between">
            <span className="text-label uppercase tracking-caps text-meta">
              Total
            </span>
            <span className="text-editorial text-bone">{formatPrice(total)}</span>
          </div>

          <p className="mt-2 text-label uppercase tracking-caps text-meta">
            Shipping calculated at checkout
          </p>

          {hasAvailable ? (
            <form action={checkoutAction} className="mt-8">
              <button
                type="submit"
                className="inline-block border border-bone px-6 py-3 text-label uppercase tracking-caps text-bone transition-opacity duration-150 hover:opacity-60"
              >
                Checkout
              </button>
            </form>
          ) : (
            <p className="mt-8 text-body text-meta">
              Nothing in the cart is still available.
            </p>
          )}
        </>
      )}
    </div>
  );
}
