import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust trace sample rate for edge runtime
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.2 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",

  // Don't report errors in development
  enabled: process.env.NODE_ENV === "production",

  environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Ignore common errors
  ignoreErrors: [
    "NetworkError",
    "Network request failed",
    "Failed to fetch",
    "Load failed",
  ],

  // Add context to edge runtime events
  beforeSendTransaction(event) {
    event.tags = {
      ...event.tags,
      runtime: "edge",
    };

    return event;
  },
});
