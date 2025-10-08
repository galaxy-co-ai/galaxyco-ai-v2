/**
 * Error types for retry logic
 */
export class RetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RetryableError';
  }
}

export class NonRetryableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NonRetryableError';
  }
}

export class RateLimitError extends RetryableError {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

/**
 * Retry options
 */
export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Default retry options
 */
const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry on non-retryable errors
      if (error instanceof NonRetryableError) {
        throw error;
      }

      // Don't retry on auth errors (401, 403)
      if (
        error.message.includes('401') ||
        error.message.includes('403') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('Forbidden')
      ) {
        throw new NonRetryableError(error.message);
      }

      // Last attempt - throw the error
      if (attempt === opts.maxAttempts) {
        throw error;
      }

      // Calculate delay with exponential backoff
      let delay = opts.baseDelayMs * Math.pow(2, attempt - 1);

      // Add jitter (±25%)
      const jitter = delay * 0.25;
      delay = delay + (Math.random() * jitter * 2 - jitter);

      // Cap at max delay
      delay = Math.min(delay, opts.maxDelayMs);

      // Special handling for rate limit errors
      if (error instanceof RateLimitError && error.retryAfter) {
        delay = error.retryAfter * 1000;
      }

      // Call retry callback
      opts.onRetry?.(attempt, error);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError!;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof NonRetryableError) {
    return false;
  }

  if (error instanceof RetryableError) {
    return true;
  }

  // Network errors are retryable
  if (
    error.message.includes('ECONNREFUSED') ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('ENOTFOUND') ||
    error.message.includes('network')
  ) {
    return true;
  }

  // 5xx errors are retryable
  if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
    return true;
  }

  // Rate limit errors are retryable
  if (error.message.includes('429') || error.message.includes('rate limit')) {
    return true;
  }

  // Default to non-retryable
  return false;
}
