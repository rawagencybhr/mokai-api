import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        // إصلاح firebase-admin داخل Vercel
        "firebase-admin": require.resolve("firebase-admin"),
      },
    },
  },
};

export default nextConfig;
// https://github.com/firebase/firebase-admin-node/issues/897#issuecomment-898879744