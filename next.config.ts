import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: "/sample-memo", destination: "/ai-action-plan", permanent: true },
      { source: "/sample-memo.pdf", destination: "/ai-action-plan.pdf", permanent: true },
      { source: "/read-your-business", destination: "/ai-action-plan-lite", permanent: true },
    ];
  },
};

export default nextConfig;
