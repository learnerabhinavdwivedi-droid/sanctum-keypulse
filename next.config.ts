import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  // Static export — disable image optimization (not compatible with static output)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
