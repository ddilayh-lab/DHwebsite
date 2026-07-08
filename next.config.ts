import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Tree-shake the heavy 3D deps down to what the scene actually imports.
    optimizePackageImports: ["three", "@react-three/drei"],
  },
};

export default nextConfig;
