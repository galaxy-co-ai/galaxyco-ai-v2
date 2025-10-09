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
  // Suppress dynamic server usage warnings during build
  // These are expected for API routes that use headers/cookies
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Log level to reduce noise from expected dynamic route warnings
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
