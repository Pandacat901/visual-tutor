import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGitHubPages ? "export" : undefined,
  basePath: isGitHubPages ? "/visual-tutor" : "",
  images: { unoptimized: true },
};

export default nextConfig;
