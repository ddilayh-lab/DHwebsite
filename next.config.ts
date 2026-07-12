import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // STATIC_EXPORT=1 produces ./out for single-file preview packaging;
  // normal builds (and Vercel) keep the default output.
  ...(process.env.STATIC_EXPORT === "1" ? { output: "export" as const } : {}),
  experimental: {
    // Tree-shake the heavy 3D deps down to what the scene actually imports.
    optimizePackageImports: ["three", "@react-three/drei"],
  },
};

export default nextConfig;
