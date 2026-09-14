import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { site } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/shop", "/about", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Only published pieces belong in a sitemap.
  const products = await db.product.findMany({
    where: { status: { in: ["live", "sold"] } },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: `${site.url}/shop/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
