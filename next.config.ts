import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['fakestoreapi.com'], // ✅ allow remote images from fakestoreapi.com
  },
};

export default nextConfig;
