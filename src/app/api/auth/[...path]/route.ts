import { auth } from "@/lib/auth";

/**
 * Neon Auth mounts sign-in, sign-up and OAuth callbacks here.
 *
 * The handler is built per request rather than destructured at module scope:
 * `next build` imports this file to collect route data, and constructing the
 * auth client there fails the build when the environment variables are absent
 * (as on a first Vercel deploy, before they are set).
 *
 * Both arguments are forwarded untouched — the second is Next's route context.
 */
type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, context: Ctx) {
  return auth.handler().GET(request, context);
}

export async function POST(request: Request, context: Ctx) {
  return auth.handler().POST(request, context);
}
