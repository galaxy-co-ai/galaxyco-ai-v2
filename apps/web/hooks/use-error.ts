'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { logError as logErrorUtil, getErrorMessage, isRetryableError } from '@/lib/errors';

interface UseErrorOptions {
  showToast?: boolean;
  logError?: boolean;
  onError?: (error: unknown) => void;
}

/**
 * Custom hook for error handling and state management
 *
 * Provides utilities for handling errors consistently across components
 * with optional toast notifications and error logging.
 */
export function useError(options: UseErrorOptions = {}) {
  const { showToast = true, logError: shouldLogError = true, onError } = options;

  const [error, setError] = useState<unknown>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback(
    (error: unknown, context?: Record<string, any>) => {
      setError(error);

      // Log error if enabled
      if (shouldLogError) {
        logErrorUtil(error, context);
      }

      // Show toast notification if enabled
      if (showToast) {
        toast.error(getErrorMessage(error), {
          duration: 5000,
        });
      }

      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }
    },
    [shouldLogError, showToast, onError],
  );

  // Overload for backward compatibility
  const handleErrorSingle = useCallback(
    (error: unknown) => {
      handleError(error, {});
    },
    [handleError],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(
    async (operation: () => Promise<void> | void) => {
      if (!isRetryableError(error)) {
        return;
      }

      setIsRetrying(true);
      clearError();

      try {
        await operation();
      } catch (newError) {
        handleError(newError);
      } finally {
        setIsRetrying(false);
      }
    },
    [error, handleError, clearError],
  );

  return {
    error,
    hasError: !!error,
    isRetrying,
    errorMessage: error ? getErrorMessage(error) : null,
    isRetryable: isRetryableError(error),
    handleError: handleErrorSingle,
    clearError,
    retry,
  };
}

/**
 * Hook for handling async operations with error management
 */
export function useAsyncOperation<T = any>(options: UseErrorOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { error, hasError, isRetrying, handleError, clearError, retry } = useError(options);

  const execute = useCallback(
    async (operation: () => Promise<T>) => {
      setIsLoading(true);
      clearError();

      try {
        const result = await operation();
        setData(result);
        return result;
      } catch (error) {
        handleError(error);
        throw error; // Re-throw so caller can handle if needed
      } finally {
        setIsLoading(false);
      }
    },
    [handleError, clearError],
  );

  const retryOperation = useCallback(
    async (operation: () => Promise<T>) => {
      return retry(async () => {
        const result = await operation();
        setData(result);
      });
    },
    [retry],
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    clearError();
  }, [clearError]);

  return {
    data,
    isLoading: isLoading || isRetrying,
    error,
    hasError,
    isRetrying,
    execute,
    retry: retryOperation,
    reset,
  };
}

/**
 * Hook for handling form operations with error management
 */
export function useFormError() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { error, hasError, handleError, clearError } = useError({
    showToast: false, // Don't show toast for form errors
  });

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const handleFormError = useCallback(
    (error: unknown) => {
      // Handle validation errors with field-specific messages
      if (error && typeof error === 'object' && 'details' in error) {
        const details = (error as any).details;

        if (details && typeof details === 'object') {
          // Clear existing field errors
          clearFieldErrors();

          // Set new field errors
          Object.entries(details).forEach(([field, message]) => {
            if (typeof message === 'string') {
              setFieldError(field, message);
            }
          });

          return;
        }
      }

      // Handle general form error
      handleError(error);
    },
    [handleError, setFieldError, clearFieldErrors],
  );

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return {
    error,
    hasError,
    fieldErrors,
    hasFieldErrors,
    setFieldError,
    clearFieldError,
    clearFieldErrors,
    handleError: handleFormError,
    clearError: () => {
      clearError();
      clearFieldErrors();
    },
  };
}
