import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        basePath: "/erp-prototype",
        images: { unoptimized: true },
      }
    : {
        /* Vercel 배포 — SSR 활성화 */
      }),
};

export default nextConfig;
