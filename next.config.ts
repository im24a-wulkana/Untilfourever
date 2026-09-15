import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Product photography is black & white and grain-heavy; AVIF holds the
    // grain noticeably better than WebP at the same byte weight.
    formats: ["image/avif", "image/webp"],

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
