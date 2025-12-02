import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // تعطيل أي إعدادات Webpack غير متوافقة
  webpack: () => ({
    resolve: {
      alias: {
        "firebase-admin": require.resolve("firebase-admin"),
      },
    },
  }),

  // لإلغاء تحذيرات Turbopack
  turbopack: {},
};

export default nextConfig;
