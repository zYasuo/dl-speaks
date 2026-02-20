import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["shared"],
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.symlinks = true;
    return config;
  },
};

export default nextConfig;
