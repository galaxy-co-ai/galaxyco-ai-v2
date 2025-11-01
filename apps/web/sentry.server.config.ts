import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust trace sample rate based on environment
  // Production: 20% of transactions (cost optimization)
  // Staging: 100% for full visibility
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === 'production' ? 0.2 : 1.0,

  // Profile 10% of transactions for performance insights
  profilesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === 'development',

  // Don't report errors in development
  enabled: process.env.NODE_ENV === 'production',

  environment: process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV,

  // Release tracking for better debugging
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Ignore common non-critical errors
  ignoreErrors: [
    // Browser extensions
    'top.GLOBALS',
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    "Can't find variable: ZiteReader",
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'atomicFindClose',
    'fb_xd_fragment',
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
    'conduitPage',
    // Network errors that are expected
    'NetworkError',
    'Network request failed',
    'Failed to fetch',
    'Load failed',
    // Clerk-related errors that are handled
    'Clerk:',
  ],

  // Filter out unwanted transactions
  beforeSend(event, hint) {
    // Don't send events if DSN is not configured
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      return null;
    }

    // Filter out specific error types
    if (event.exception) {
      const error = hint.originalException;

      // Don't send expected API errors (4xx client errors)
      if (error instanceof Error && error.message.includes('400')) {
        return null;
      }
    }

    return event;
  },

  // Add context to all events
  beforeSendTransaction(event) {
    // Add custom tags for better filtering
    event.tags = {
      ...event.tags,
      runtime: 'server',
    };

    return event;
  },

  // Integration configuration
  integrations: [
    // HTTP integration for API monitoring
    Sentry.httpIntegration(),
    // PostgreSQL integration
    Sentry.postgresIntegration(),
  ],
});
