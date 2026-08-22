import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    remotePatterns: [
      // Unsplash hero / instrument images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      // Tone.js official CDN — Salamander piano samples
      // (used as audio src, not next/image, but listed for completeness)
      {
        protocol: "https",
        hostname: "tonejs.github.io",
      },
      // nbrosowsky guitar acoustic samples (optional fallback CDN)
      {
        protocol: "https",
        hostname: "nbrosowsky.github.io",
      },
    ],
  },
};

export default nextConfig;
