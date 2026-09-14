"use client";

import { AccountView } from "@neondatabase/auth/react/ui";

/**
 * Neon Auth's account management: change password, change email, active
 * sessions, delete account. Same reasoning as AuthView — reimplementing
 * session revocation by hand is a good way to get it subtly wrong.
 */
export function AccountClientView({ pathname }: { pathname: string }) {
  return <AccountView pathname={pathname} />;
}
