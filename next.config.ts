import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["ransack-patience-crepe.ngrok-free.dev"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

export default nextConfig;
