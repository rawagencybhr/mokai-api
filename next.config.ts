import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias["firebase-admin"] = require.resolve("firebase-admin");
    return config;
  },
};

export default nextConfig;
