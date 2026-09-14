import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Product photography is black & white and grain-heavy; AVIF holds the
    // grain noticeably better than WebP at the same byte weight.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
