import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getUser();

  // Only allow relative paths back — an absolute URL here would make this an
  // open redirect that could bounce someone to another site after sign-in.
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/shop";

  if (user) redirect(safeNext);

  return (
    <div className="px-5 py-16 md:px-8 md:py-24">
      <h1 className="text-label-lg uppercase tracking-caps text-meta">Sign in</h1>
      <p className="mt-6 max-w-[48ch] text-editorial text-bone">
        An account keeps your cart and your order history. Nothing else.
      </p>
      <SignInForm next={safeNext} />
    </div>
  );
}
