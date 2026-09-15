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
 * Admin is granted two ways, and both are checked.
 *
 * 1. An email in ADMIN_EMAILS below. This is the root account: changing it
 *    needs a commit and a deploy, so it cannot be granted by anything with
 *    database access alone, and it is the way back in if a role is ever
 *    cleared by mistake.
 *
 * 2. role = "admin" on the Neon Auth user. This is the convenient way to add
 *    someone: set it in the Neon console, no deploy needed.
 *
 * The tradeoff of (2) is worth stating plainly: anything that can write to the
 * neon_auth.user table can grant itself admin. That is an acceptable risk here
 * because the same database access could edit listings directly anyway — but
 * it does mean a leaked DATABASE_URL is now also a path to the admin UI.
 */
const ADMIN_EMAILS = ["aaron.wulkan@icloud.com"] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(
    email.trim().toLowerCase() as (typeof ADMIN_EMAILS)[number],
  );
}

/** True when the Neon Auth session carries role = "admin". */
export function hasAdminRole(role: string | null | undefined): boolean {
  return role?.trim().toLowerCase() === "admin";
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  /** From Neon Auth. "admin" grants access to /admin. */
  role?: string | null;
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
  if (!user) return null;
  return isAdminEmail(user.email) || hasAdminRole(user.role) ? user : null;
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
