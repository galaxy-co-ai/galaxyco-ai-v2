/**
 * Next.js Instrumentation Hook
 * Registers Sentry for server-side and edge runtime error tracking
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = async (
  err: Error,
  request: Request,
  context: { routeType: 'app' | 'pages' },
) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.captureException(err, {
      contexts: {
        request: {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers),
        },
        nextjs: {
          routeType: context.routeType,
        },
      },
    });
  }
};
