/**
 * API Error Handling Utilities
 * 
 * Custom error classes and utilities for handling different types of errors
 * throughout the application with proper user messaging and logging.
 */

export class APIError extends Error {
  public status: number;
  public code: string;
  public details?: any;
  public retryable: boolean;

  constructor(
    message: string,
    status: number = 500,
    code: string = "INTERNAL_ERROR",
    details?: any,
    retryable: boolean = false
  ) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.retryable = retryable;
  }
}

export class NetworkError extends APIError {
  constructor(message: string = "Network connection failed") {
    super(message, 0, "NETWORK_ERROR", null, true);
    this.name = "NetworkError";
  }
}

export class ValidationError extends APIError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details, false);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTH_ERROR", null, false);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "PERMISSION_ERROR", null, false);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND", null, false);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends APIError {
  constructor(message: string = "Resource conflict") {
    super(message, 409, "CONFLICT_ERROR", null, false);
    this.name = "ConflictError";
  }
}

export class RateLimitError extends APIError {
  constructor(message: string = "Rate limit exceeded") {
    super(message, 429, "RATE_LIMIT", null, true);
    this.name = "RateLimitError";
  }
}

export class ServerError extends APIError {
  constructor(message: string = "Internal server error") {
    super(message, 500, "SERVER_ERROR", null, true);
    this.name = "ServerError";
  }
}

/**
 * Parse API response and throw appropriate error
 */
export async function handleApiResponse(response: Response) {
  if (!response.ok) {
    let errorData: any = {};
    
    try {
      errorData = await response.json();
    } catch {
      // Fallback if response is not JSON
      errorData = { error: response.statusText };
    }

    const message = errorData.error || errorData.message || "An error occurred";
    const details = errorData.details || errorData;

    switch (response.status) {
      case 400:
        throw new ValidationError(message, details);
      case 401:
        throw new AuthenticationError(message);
      case 403:
        throw new AuthorizationError(message);
      case 404:
        throw new NotFoundError(message);
      case 409:
        throw new ConflictError(message);
      case 429:
        throw new RateLimitError(message);
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ServerError(message);
      default:
        throw new APIError(message, response.status, "API_ERROR", details);
    }
  }

  return response;
}

/**
 * Enhanced fetch with automatic error handling
 */
export async function apiRequest(
  url: string,
  options: RequestInit = {},
  workspaceId?: string
): Promise<Response> {
  try {
    // Add workspace header if provided
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      ...(workspaceId && { "x-workspace-id": workspaceId }),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return handleApiResponse(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError("Network connection failed. Please check your internet connection.");
    }
    throw error;
  }
}

/**
 * Retry utility for failed requests
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
  backoff: number = 2
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // Don't retry non-retryable errors
      if (error instanceof APIError && !error.retryable) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxAttempts) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= backoff;

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error);
    }
  }

  throw lastError;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Handle common browser errors
    if (error.message.includes("fetch")) {
      return "Network connection failed. Please check your internet connection and try again.";
    }
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Get error type for UI handling
 */
export function getErrorType(error: unknown): string {
  if (error instanceof NetworkError) return "network";
  if (error instanceof AuthenticationError) return "auth";
  if (error instanceof AuthorizationError) return "permission";
  if (error instanceof ValidationError) return "validation";
  if (error instanceof NotFoundError) return "notFound";
  if (error instanceof ConflictError) return "conflict";
  if (error instanceof RateLimitError) return "rateLimit";
  if (error instanceof ServerError) return "server";
  if (error instanceof APIError) return "api";
  return "unknown";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof APIError) {
    return error.retryable;
  }
  
  if (error instanceof Error && error.message.includes("fetch")) {
    return true; // Network errors are retryable
  }

  return false;
}

/**
 * Log error for monitoring/debugging
 */
export function logError(error: unknown, context?: Record<string, any>) {
  const errorInfo = {
    message: getErrorMessage(error),
    type: getErrorType(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
    url: typeof window !== "undefined" ? window.location.href : undefined,
  };

  // Log to console
  console.error("Application error:", errorInfo);

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === "production") {
    // Send to Sentry, LogRocket, or other monitoring service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }
}