import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Prisma 7 has no bundled query engine — a driver adapter is required. This is
 * the one place the database provider is named.
 *
 * Neon's serverless driver is what makes this work on Vercel: serverless
 * functions cannot hold a normal Postgres connection pool open between
 * invocations, and would exhaust Neon's connection limit if they tried.
 *
 * The client is memoised on globalThis because Next's dev server re-evaluates
 * modules on every hot reload, and a fresh PrismaClient per reload leaks
 * connections until the process is restarted.
 */

function createClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy the Neon connection string into .env — see .env.example.",
    );
  }

  // Checked up front because the driver's own failure for a bad URL surfaces as
  // "[object ErrorEvent]", which tells you nothing about what to fix.
  if (!/^postgres(ql)?:\/\//.test(connectionString)) {
    throw new Error(
      `DATABASE_URL must be a Postgres connection string starting with "postgresql://". ` +
        `Got "${connectionString.split(":")[0]}:...". If this is still the old SQLite ` +
        `value ("file:./dev.db"), replace it with the Neon string — see .env.example.`,
    );
  }

  if (!connectionString.includes("-pooler")) {
    console.warn(
      "[db] DATABASE_URL does not look like Neon's pooled connection string " +
        "(no '-pooler' in the host). Serverless functions can exhaust the " +
        "connection limit without it.",
    );
  }

  return new PrismaClient({ adapter: new PrismaNeon({ connectionString }) });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Connects lazily, on first property access rather than at import time.
 *
 * This matters for deployment: `next build` imports every route module to
 * collect page data, so connecting eagerly would make the build itself fail
 * whenever DATABASE_URL is absent or wrong — turning a misconfigured env var
 * into a failed deploy instead of a failed request. The storefront does not
 * touch the database at all, and must keep building without one.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    return Reflect.get(getClient(), property, receiver);
  },
});
