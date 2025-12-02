import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // إيقاف Turbopack وإجبار Next.js على استخدام Webpack
  turbopack: false,

  webpack: (config) => {
    // إصلاح firebase-admin في Vercel
    config.resolve.alias["firebase-admin"] = require.resolve("firebase-admin");
    return config;
  },
};

export default nextConfig;
