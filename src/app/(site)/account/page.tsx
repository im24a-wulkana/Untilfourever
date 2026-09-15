import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser, isAdminEmail, hasAdminRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/components/Price";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/auth/sign-in?next=/account");

  const orders = await db.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  // Same rule as getAdmin(): the email allowlist or a Neon Auth admin role.
  const admin = isAdminEmail(user.email) || hasAdminRole(user.role);

  return (
    <div className="px-5 py-10 md:px-8 md:py-14">
      <h1 className="text-label-lg uppercase tracking-caps text-meta">Account</h1>
      <p className="mt-4 text-body text-bone">{user.email}</p>

      <p className="mt-3">
        <Link
          href="/account/settings"
          className="rule-link text-label uppercase tracking-caps text-meta"
        >
          Settings — password, email, sessions
        </Link>
      </p>

      {admin ? (
        <p className="mt-4">
          <Link href="/admin" className="rule-link text-label uppercase tracking-caps text-bone">
            Admin — manage listings
          </Link>
        </p>
      ) : null}

      <section className="mt-12 border-t border-hairline pt-8">
        <h2 className="text-label uppercase tracking-caps text-meta">
          Orders ({orders.length})
        </h2>

        {orders.length === 0 ? (
          <p className="mt-4 text-body text-meta">No orders yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
            {orders.map((order) => (
              <li key={order.id} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-label uppercase tracking-caps text-meta">
                    {order.createdAt.toLocaleDateString("en-US")} · {order.status}
                  </span>
                  <span className="text-body text-bone">
                    {formatPrice(order.totalUSD)}
                  </span>
                </div>
                <ul className="mt-2 space-y-0.5">
                  {order.items.map((item) => (
                    <li key={item.id} className="text-body text-meta">
                      {item.brand} — {item.name} (size {item.size})
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
