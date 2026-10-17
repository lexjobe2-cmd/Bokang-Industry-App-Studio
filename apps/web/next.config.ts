import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bokang/app-config", "@bokang/ui", "@bokang/domain-data", "@bokang/integrations", "@bokang/persistence", "@bokang/coordination", "@bokang/prospects"]
};

export default nextConfig;
