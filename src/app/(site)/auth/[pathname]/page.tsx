import type { Metadata } from "next";
import { AuthClientView } from "./AuthClientView";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** The component's own heading covers sign-in; these add the house voice. */
const COPY: Record<string, { title: string; note: string }> = {
  "sign-in": {
    title: "Sign in",
    note: "An account keeps your cart and your order history. Nothing else.",
  },
  "sign-up": {
    title: "Create an account",
    note: "So your cart is still there next time, and so you can see what you have ordered.",
  },
  "forgot-password": {
    title: "Reset your password",
    note: "We will email you a link.",
  },
};

/**
 * Catch-all for every Neon Auth view: sign-in, sign-up, forgot-password,
 * reset-password, sign-out and the OAuth callback.
 *
 * AuthView links between these views by pathname, so mounting only /sign-in
 * meant "Sign Up" navigated to a 404.
 */
export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ pathname: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { pathname } = await params;
  const { next } = await searchParams;

  // Relative paths only — an absolute URL would make this an open redirect.
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : "/shop";

  const copy = COPY[pathname];

  return (
    <div className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-sm">
        {copy ? (
          <header className="mb-8 border-b border-hairline pb-5">
            <h1 className="text-label-lg uppercase tracking-caps text-meta">
              {copy.title}
            </h1>
            <p className="mt-4 text-body text-bone">{copy.note}</p>
          </header>
        ) : null}

        <div className="auth-surface">
          <AuthClientView pathname={pathname} redirectTo={safeNext} />
        </div>
      </div>
    </div>
  );
}
