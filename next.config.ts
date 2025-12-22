import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows ALL external domains
      },
    ],
  },
};

export default nextConfig;
