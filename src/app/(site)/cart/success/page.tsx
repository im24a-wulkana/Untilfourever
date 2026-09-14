import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const user = await getUser();

  // The order is looked up but never marked paid here — only the Stripe
  // webhook does that. Reaching this page proves nothing about payment.
  const order =
    session_id && user
      ? await db.order.findFirst({
          where: { stripeSessionId: session_id, userId: user.id },
          include: { items: true },
        })
      : null;

  return (
    <div className="px-5 py-16 md:px-8 md:py-24">
      <h1 className="text-label-lg uppercase tracking-caps text-meta">
        Order received
      </h1>

      <p className="mt-6 max-w-[56ch] text-editorial text-bone">
        Thank you. You will get an email confirmation shortly. Pieces are packed
        and posted from Zürich within two working days.
      </p>

      {order ? (
        <div className="mt-8 border-t border-hairline pt-6">
          <p className="text-label uppercase tracking-caps text-meta">
            Order {order.id.slice(0, 8)}
          </p>
          <ul className="mt-3 space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="text-body text-bone">
                {item.brand} — {item.name}{" "}
                <span className="text-meta">(size {item.size})</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-10">
        <Link href="/shop" className="rule-link text-label uppercase tracking-caps text-bone">
          Back to the archive
        </Link>
      </p>
    </div>
  );
}
