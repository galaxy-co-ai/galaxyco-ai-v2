/* eslint-disable no-console */
/**
 * Production-grade logging utility
 *
 * Replaces console.log statements with structured logging that:
 * - Only logs in development
 * - Sends errors to Sentry in production
 * - Provides consistent formatting
 * - Supports log levels
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private isTest = process.env.NODE_ENV === "test";

  /**
   * Debug level - verbose logging for development
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.log(`[DEBUG] ${message}`, context || "");
    }
  }

  /**
   * Info level - general informational messages
   */
  info(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.info(`[INFO] ${message}`, context || "");
    }
  }

  /**
   * Warning level - something unexpected but not breaking
   */
  warn(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.warn(`[WARN] ${message}`, context || "");
    }
    // In production, could send to monitoring service
  }

  /**
   * Error level - something went wrong
   * Always logs to console in dev, sends to Sentry in production
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.isDevelopment && !this.isTest) {
      console.error(`[ERROR] ${message}`, error, context || "");
    }

    // In production, send to Sentry
    if (!this.isDevelopment && !this.isTest) {
      // Sentry integration handled by error boundaries and API error handlers
      // This is a fallback for uncaught errors
      if (typeof window !== "undefined" && (window as any).Sentry) {
        (window as any).Sentry.captureException(error || new Error(message), {
          extra: context,
        });
      }
    }
  }

  /**
   * Test-specific logging (only appears in test files)
   */
  test(message: string, context?: LogContext): void {
    if (this.isTest) {
      console.log(`[TEST] ${message}`, context || "");
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Development-only logger for debugging
 * Use this when you need verbose logging that should never reach production
 */
export function devLog(message: string, ...args: any[]): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`🔧 [DEV] ${message}`, ...args);
  }
}

/**
 * API request logger for development
 */
export function apiLog(
  method: string,
  endpoint: string,
  status: number,
  duration?: number,
): void {
  if (process.env.NODE_ENV === "development") {
    const statusEmoji = status >= 200 && status < 300 ? "✅" : "❌";
    const durationStr = duration ? ` (${duration}ms)` : "";
    console.log(
      `${statusEmoji} [API] ${method} ${endpoint} - ${status}${durationStr}`,
    );
  }
}
