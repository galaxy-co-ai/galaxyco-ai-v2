import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Capture Replay for 10% of all sessions
  // plus 100% of sessions with an error
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      // Mask all text content and block all media by default
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Don't report errors in development
  enabled: process.env.NODE_ENV === "production",

  environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV,
});
