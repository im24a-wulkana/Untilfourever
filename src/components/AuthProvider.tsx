"use client";

import { useRouter } from "next/navigation";
import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth-client";

/**
 * Wraps the app so Neon Auth's prebuilt views can run. Navigation is handed to
 * the Next router so sign-in does not full-page reload.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={({ href, ...props }) => <a href={href} {...props} />}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
