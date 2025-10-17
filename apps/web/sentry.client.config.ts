import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust trace sample rate based on environment
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.2 : 1.0,

  // Profile 5% of transactions on client (less than server)
  profilesSampleRate: 0.05,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",

  // Capture Replay for 10% of all sessions
  // plus 100% of sessions with an error
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // Don't report errors in development
  enabled: process.env.NODE_ENV === "production",

  environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Ignore common browser errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "http://tt.epicplay.com",
    "Can't find variable: ZiteReader",
    "jigsaw is not defined",
    "ComboSearch is not defined",
    "atomicFindClose",
    "fb_xd_fragment",
    "bmi_SafeAddOnload",
    "EBCallBackMessageReceived",
    "conduitPage",
    // Random plugins/extensions
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    // Network errors
    "NetworkError",
    "Network request failed",
    "Failed to fetch",
    "Load failed",
    // Clerk errors (handled gracefully)
    "Clerk:",
  ],

  // Filter out unwanted events
  beforeSend(event, hint) {
    // Don't send if DSN not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Filter out expected errors
    if (event.exception) {
      const error = hint.originalException;

      // Don't send expected validation errors
      if (error instanceof Error && error.message.includes("Validation")) {
        return null;
      }
    }

    return event;
  },

  // Add context to all events
  beforeSendTransaction(event) {
    event.tags = {
      ...event.tags,
      runtime: "browser",
    };

    return event;
  },

  integrations: [
    // Session replay with privacy protection
    Sentry.replayIntegration({
      // Mask all text content and block all media by default
      maskAllText: true,
      blockAllMedia: true,
      // Don't capture network requests with sensitive data
      networkDetailAllowUrls: [window.location.origin],
      networkCaptureBodies: false,
    }),
    // Browser profiling
    Sentry.browserProfilingIntegration(),
    // Browser tracing (tracks navigation and route changes)
    Sentry.browserTracingIntegration(),
  ],
});
