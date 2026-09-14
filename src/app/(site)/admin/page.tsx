import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminForm } from "./AdminForm";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always reflects the current database.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const recent = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="px-5 py-10 md:px-8 md:py-14">
      <header className="mb-8">
        <h1 className="text-label-lg uppercase tracking-caps text-meta">
          Admin — add a piece
        </h1>
        <p className="mt-4 max-w-[62ch] text-body text-meta">
          Paste a caption, parse it, correct anything wrong, then save. Nothing
          is published automatically: every piece is saved as a draft.
        </p>
      </header>

      <AdminForm />

      <section className="mt-14 border-t border-hairline pt-8">
        <h2 className="text-label uppercase tracking-caps text-meta">
          Recent ({recent.length})
        </h2>

        {recent.length === 0 ? (
          <p className="mt-4 text-body text-meta">Nothing saved yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-hairline">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-baseline gap-x-5 gap-y-1 py-2"
              >
                <span className="text-label uppercase tracking-caps text-meta">
                  {p.status}
                </span>
                <span className="text-label uppercase tracking-caps text-meta">
                  {p.brand}
                </span>
                <span className="text-body text-bone">{p.name}</span>
                <span className="text-label uppercase tracking-caps text-meta">
                  {p.size}
                </span>
                <span className="text-label uppercase tracking-caps text-meta">
                  CHF {p.priceCHF}
                </span>
                {p.igMediaId ? (
                  <span className="text-label uppercase tracking-caps text-meta">
                    from instagram
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
