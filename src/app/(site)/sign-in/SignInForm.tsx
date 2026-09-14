"use client";

import { AuthView } from "@neondatabase/auth/react/ui";

/**
 * Neon Auth's prebuilt view handles sign-in, sign-up, password reset and
 * OAuth. Hand-rolling these forms would mean reimplementing token handling and
 * error states that the package already gets right.
 */
export function SignInForm({ next }: { next: string }) {
  return (
    <div className="mt-8 max-w-sm">
      <AuthView pathname="sign-in" redirectTo={next} />
    </div>
  );
}
