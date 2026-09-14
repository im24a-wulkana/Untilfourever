import { createNeonAuth } from "@neondatabase/auth/next/server";

type NeonAuth = ReturnType<typeof createNeonAuth>;

let cached: NeonAuth | undefined;

function client(): NeonAuth {
  if (!cached) {
    const baseUrl = process.env.NEON_AUTH_BASE_URL;
    const secret = process.env.NEON_AUTH_COOKIE_SECRET;

    if (!baseUrl || !secret) {
      throw new Error(
        "Neon Auth is not configured. Set NEON_AUTH_BASE_URL and " +
          "NEON_AUTH_COOKIE_SECRET — see .env.example.",
      );
    }

    cached = createNeonAuth({ baseUrl, cookies: { secret } });
  }
  return cached;
}

/**
 * Built lazily, on first use rather than at import time.
 *
 * `next build` imports every route module to collect page data, so
 * constructing this eagerly makes a missing environment variable fail the
 * *build* instead of a request — turning a config mistake into a failed
 * deploy. The storefront does not need auth and must keep building without it.
 */
export const auth = new Proxy({} as NeonAuth, {
  get(_t, property, receiver) {
    return Reflect.get(client(), property, receiver);
  },
});

/**
 * Admin is decided here, in code, not by a database column.
 *
 * A role stored in a row can be changed by anything with write access to the
 * database — an SQL injection, a leaked connection string, a bug in an admin
 * form. Keeping the list in source means escalating to admin requires a commit
 * and a deploy, which is a much harder thing to do by accident or attack.
 */
const ADMIN_EMAILS = ["aaron.wulkan@icloud.com"] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(
    email.trim().toLowerCase() as (typeof ADMIN_EMAILS)[number],
  );
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

/**
 * The signed-in user, or null.
 *
 * Returns null rather than throwing when auth is not configured: this is
 * called by the header on every page, and an unconfigured install should show
 * a signed-out storefront rather than a 500 on every route. Actions that
 * actually need a user call requireUser/requireAdmin, which do throw.
 */
export async function getUser(): Promise<SessionUser | null> {
  try {
    const { data } = await auth.getSession();
    return (data?.user as SessionUser | undefined) ?? null;
  } catch {
    return null;
  }
}

/** The signed-in user if they are an admin, otherwise null. */
export async function getAdmin(): Promise<SessionUser | null> {
  const user = await getUser();
  return user && isAdminEmail(user.email) ? user : null;
}

/**
 * Throws unless the caller is an admin. Every admin server action calls this
 * first — the /admin page being hidden is not access control, since server
 * actions are callable directly by anyone who knows the endpoint.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const admin = await getAdmin();
  if (!admin) throw new Error("Not authorised.");
  return admin;
}

/** Throws unless someone is signed in. Used by cart actions. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getUser();
  if (!user) throw new Error("You need to be signed in.");
  return user;
}
