import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const uiSource = path.join(repoRoot, "packages/ui/src/index.ts");
const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: repoRoot,
  },
  transpilePackages: ["@opaline/ui"],
  webpack(config) {
    config.resolve.alias["@opaline/ui"] = uiSource;
    return config;
  },
};

export default withMDX(nextConfig);
