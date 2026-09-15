import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Product photography is black & white and grain-heavy; AVIF holds the
    // grain noticeably better than WebP at the same byte weight.
    formats: ["image/avif", "image/webp"],

    // Next 16 defaults qualities to [75] and silently snaps any other value to
    // the nearest allowed one. The splash photograph fills the viewport, so it
    // is served at 90 — listed here or the prop would be quietly ignored.
    qualities: [75, 90],

    // Product photographs live in Vercel Blob. next/image refuses to optimise
    // a remote host that is not listed here, so uploads would render broken
    // without this entry.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
