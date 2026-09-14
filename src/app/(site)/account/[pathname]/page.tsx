import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { AccountClientView } from "./AccountClientView";

export const metadata: Metadata = {
  title: "Account settings",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * Catch-all for Neon Auth's account views (settings, security, sessions).
 * AccountView navigates between these by pathname, so they all need to exist.
 */
export default async function AccountSettingsPage({
  params,
}: {
  params: Promise<{ pathname: string }>;
}) {
  const { pathname } = await params;
  const user = await getUser();
  if (!user) redirect(`/auth/sign-in?next=/account/${pathname}`);

  return (
    <div className="px-5 py-10 md:px-8 md:py-14">
      <p className="mb-8">
        <Link
          href="/account"
          className="rule-link text-label uppercase tracking-caps text-meta"
        >
          Back to account
        </Link>
      </p>
      <div className="auth-surface max-w-xl">
        <AccountClientView pathname={pathname} />
      </div>
    </div>
  );
}
