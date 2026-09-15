import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/auth";
import { AdminForm } from "./AdminForm";
import { setStatusAction, deleteProductAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Always reflects the current database.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // 404 rather than redirect: a redirect to sign-in tells an anonymous visitor
  // that /admin exists. Non-admins should not learn that.
  const admin = await getAdmin();
  if (!admin) notFound();

  const recent = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
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
                  ${p.priceUSD}
                </span>
                {p.igMediaId ? (
                  <span className="text-label uppercase tracking-caps text-meta">
                    from instagram
                  </span>
                ) : null}

                <span className="ml-auto flex items-baseline gap-3">
                  {p.status !== "live" ? (
                    <form action={setStatusAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="live" />
                      <button className="rule-link text-label uppercase tracking-caps text-bone">
                        Publish
                      </button>
                    </form>
                  ) : (
                    <form action={setStatusAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="draft" />
                      <button className="rule-link text-label uppercase tracking-caps text-meta">
                        Unpublish
                      </button>
                    </form>
                  )}

                  <form action={deleteProductAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rule-link text-label uppercase tracking-caps text-meta">
                      Delete
                    </button>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
