"use client";

import { AuthView } from "@neondatabase/auth/react/ui";

/**
 * Neon Auth's prebuilt view. It handles sign-in, sign-up, password reset and
 * OAuth, including token handling and error states — all of which would be
 * easy to get subtly wrong by hand.
 */
export function AuthClientView({
  pathname,
  redirectTo,
}: {
  pathname: string;
  redirectTo: string;
}) {
  return <AuthView pathname={pathname} redirectTo={redirectTo} />;
}
