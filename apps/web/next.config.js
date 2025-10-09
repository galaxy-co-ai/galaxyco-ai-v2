/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip output optimization to avoid static generation issues
  output: undefined,
  // Skip static generation for pages that use dynamic APIs
  experimental: {
    isrMemoryCacheSize: 0,
  },
};

module.exports = nextConfig;
