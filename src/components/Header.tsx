import Link from "next/link";
import { nav, site } from "@/data/site";
import { getUser } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";

/**
 * Wordmark left, nav right, hairline underneath. No logo mark.
 * Sits above the grain overlay so the type stays crisp.
 */
export async function Header() {
  const user = await getUser();
  const cartCount = user ? await getCartCount() : 0;

  return (
    <header data-touch-target className="relative z-10 border-b border-hairline bg-black">
      {/* Four caps items at 0.12em tracking do not fit beside the wordmark on a
          narrow phone. The nav wraps to its own row rather than shrinking the
          type or hiding links behind a menu. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3 px-5 py-4 md:px-8">
        <Link href="/" className="fade-link wordmark text-[0.8125rem] text-bone">
          {site.name}
        </Link>

        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-2 md:gap-x-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rule-link text-label uppercase tracking-caps text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/cart"
                className="rule-link text-label uppercase tracking-caps text-bone"
              >
                Cart{cartCount > 0 ? ` (${cartCount})` : ""}
              </Link>
            </li>

            <li>
              <Link
                href={user ? "/account" : "/auth/sign-in"}
                className="rule-link text-label uppercase tracking-caps text-bone"
              >
                {user ? "Account" : "Sign in"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
