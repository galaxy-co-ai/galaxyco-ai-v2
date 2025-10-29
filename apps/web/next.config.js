const { withSentryConfig } = require("@sentry/nextjs");

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
    instrumentationHook: true,
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Log level to reduce noise from expected dynamic route warnings
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

// Only wrap with Sentry if DSN is configured
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      silent: true, // Suppresses all logs

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload source maps during build
      widenClientFileUpload: true,

      // Automatically annotate React components for easier debugging
      reactComponentAnnotation: {
        enabled: true,
      },

      // Automatically instrument Sentry for Next.js
      autoInstrumentServerFunctions: true,

      // Don't hide source maps in prod
      hideSourceMaps: false,
    })
  : nextConfig;
