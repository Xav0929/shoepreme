import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["limb-overreach-catalyze.ngrok-free.dev"],
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
