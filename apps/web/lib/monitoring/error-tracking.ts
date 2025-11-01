/**
 * Error Tracking and Monitoring Utilities
 *
 * Provides enhanced error tracking with Sentry integration,
 * custom context, and performance monitoring.
 */

import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/utils/logger';

export interface ErrorContext {
  userId?: string;
  workspaceId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Capture an exception with enhanced context
 */
export function captureException(
  error: Error,
  context?: ErrorContext,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
): string | undefined {
  try {
    // Log to console for development visibility
    logger.error('Exception captured', {
      error: error.message,
      stack: error.stack,
      context,
    });

    // Set user context if available
    if (context?.userId) {
      Sentry.setUser({
        id: context.userId,
        workspaceId: context.workspaceId,
      });
    }

    // Set additional context
    Sentry.setContext('error_context', {
      component: context?.component,
      action: context?.action,
      ...context?.metadata,
    });

    // Set tags for filtering
    if (context?.component) {
      Sentry.setTag('component', context.component);
    }
    if (context?.workspaceId) {
      Sentry.setTag('workspace_id', context.workspaceId);
    }

    // Capture with severity
    return Sentry.captureException(error, {
      level: severity,
    });
  } catch (captureError) {
    // Failsafe: log to console if Sentry fails
    console.error('Failed to capture exception in Sentry:', captureError);
    return undefined;
  }
}

/**
 * Capture a message with context
 */
export function captureMessage(
  message: string,
  context?: ErrorContext,
  severity: ErrorSeverity = ErrorSeverity.INFO,
): string | undefined {
  try {
    // Set user context
    if (context?.userId) {
      Sentry.setUser({
        id: context.userId,
        workspaceId: context.workspaceId,
      });
    }

    // Set additional context
    if (context?.component || context?.action || context?.metadata) {
      Sentry.setContext('message_context', {
        component: context?.component,
        action: context?.action,
        ...context?.metadata,
      });
    }

    return Sentry.captureMessage(message, severity);
  } catch (captureError) {
    console.error('Failed to capture message in Sentry:', captureError);
    return undefined;
  }
}

/**
 * Add breadcrumb for debugging context
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, any>,
  level: Sentry.SeverityLevel = 'info',
): void {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Set user context for all future events
 */
export function setUserContext(userId: string, workspaceId?: string, email?: string): void {
  Sentry.setUser({
    id: userId,
    email,
    workspaceId,
  });
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}

/**
 * Start a performance span with OpenTelemetry
 * Uses the newer Sentry startSpan API
 */
export function startPerformanceSpan<T>(
  name: string,
  operation: () => T,
  op: string = 'function',
): T {
  return Sentry.startSpan({ name, op }, operation);
}

/**
 * Measure performance of an async operation
 */
export async function measurePerformance<T>(
  name: string,
  operation: () => Promise<T>,
  context?: ErrorContext,
): Promise<T> {
  const startTime = Date.now();

  try {
    const result = await Sentry.startSpan({ name, op: 'function' }, async () => {
      return await operation();
    });
    return result;
  } catch (error) {
    captureException(error as Error, context, ErrorSeverity.ERROR);
    throw error;
  } finally {
    const duration = Date.now() - startTime;
    trackMetric(name, duration, 'milliseconds');
  }
}

/**
 * Track API performance
 */
export function trackApiCall(
  endpoint: string,
  method: string,
  statusCode: number,
  duration: number,
  context?: ErrorContext,
): void {
  // Add breadcrumb for API call
  addBreadcrumb(
    `API ${method} ${endpoint}`,
    'http',
    {
      method,
      endpoint,
      status_code: statusCode,
      duration_ms: duration,
      ...context?.metadata,
    },
    statusCode >= 400 ? 'error' : 'info',
  );

  // Capture as message if it's an error
  if (statusCode >= 500) {
    captureMessage(
      `API Error: ${method} ${endpoint} returned ${statusCode}`,
      context,
      ErrorSeverity.ERROR,
    );
  }
}

/**
 * Track database query performance
 */
export function trackDatabaseQuery(
  query: string,
  duration: number,
  success: boolean,
  context?: ErrorContext,
): void {
  addBreadcrumb(
    `Database Query: ${query.substring(0, 100)}...`,
    'query',
    {
      duration_ms: duration,
      success,
      workspace_id: context?.workspaceId,
    },
    success ? 'info' : 'error',
  );

  // Alert on slow queries (>1s)
  if (duration > 1000 && success) {
    captureMessage(`Slow database query detected: ${duration}ms`, context, ErrorSeverity.WARNING);
  }
}

/**
 * Track custom metric
 */
export function trackMetric(
  name: string,
  value: number,
  unit: string = 'milliseconds',
  tags?: Record<string, string>,
): void {
  try {
    // Use Sentry metrics if available
    if (Sentry.metrics && Sentry.metrics.distribution) {
      Sentry.metrics.distribution(name, value, { unit });
    }
    // Log as breadcrumb as fallback
    addBreadcrumb(`Metric: ${name}`, 'metric', { value, unit, ...tags }, 'info');
  } catch (error) {
    console.error('Failed to track metric:', error);
  }
}

/**
 * Check if monitoring is enabled
 */
export function isMonitoringEnabled(): boolean {
  return process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN;
}

/**
 * Flush pending events (useful before process exit)
 */
export async function flushMonitoring(timeout: number = 2000): Promise<boolean> {
  try {
    return await Sentry.flush(timeout);
  } catch (error) {
    console.error('Failed to flush Sentry events:', error);
    return false;
  }
}

/**
 * Higher-order function to wrap async functions with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext,
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(
        error as Error,
        {
          ...context,
          metadata: {
            ...context?.metadata,
            arguments: args.map((arg) =>
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg),
            ),
          },
        },
        ErrorSeverity.ERROR,
      );
      throw error;
    }
  }) as T;
}

/**
 * Initialize monitoring for the current page/component
 */
export function initializeMonitoring(
  pageName: string,
  userId?: string,
  workspaceId?: string,
): void {
  // Set page context
  Sentry.setContext('page', {
    name: pageName,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  });

  // Set user if available
  if (userId) {
    setUserContext(userId, workspaceId);
  }

  // Add breadcrumb for page load
  addBreadcrumb(`Page loaded: ${pageName}`, 'navigation', {
    workspace_id: workspaceId,
  });
}
