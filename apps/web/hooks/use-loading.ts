'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseLoadingOptions {
  initialLoading?: boolean;
  minLoadingTime?: number; // Minimum time to show loading (for better UX)
}

/**
 * Custom hook for managing loading states
 *
 * Provides utilities for handling loading states with optional
 * minimum loading time to prevent flashing.
 */
export function useLoading(options: UseLoadingOptions = {}) {
  const { initialLoading = false, minLoadingTime = 0 } = options;

  const [isLoading, setIsLoading] = useState(initialLoading);
  const loadingStartTime = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    loadingStartTime.current = Date.now();
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    if (minLoadingTime > 0 && loadingStartTime.current) {
      const elapsed = Date.now() - loadingStartTime.current;
      const remaining = minLoadingTime - elapsed;

      if (remaining > 0) {
        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
          loadingStartTime.current = null;
        }, remaining);
        return;
      }
    }

    setIsLoading(false);
    loadingStartTime.current = null;
  }, [minLoadingTime]);

  const withLoading = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      startLoading();
      try {
        const result = await operation();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}

/**
 * Hook for managing multiple loading states
 */
export function useLoadingStates<T extends string>(
  initialStates: Record<T, boolean> = {} as Record<T, boolean>,
) {
  const [loadingStates, setLoadingStates] = useState<Record<T, boolean>>(initialStates);

  const setLoading = useCallback((key: T, loading: boolean) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  const startLoading = useCallback(
    (key: T) => {
      setLoading(key, true);
    },
    [setLoading],
  );

  const stopLoading = useCallback(
    (key: T) => {
      setLoading(key, false);
    },
    [setLoading],
  );

  const withLoading = useCallback(
    async <R>(key: T, operation: () => Promise<R>): Promise<R> => {
      startLoading(key);
      try {
        const result = await operation();
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading],
  );

  const isLoading = useCallback(
    (key: T): boolean => {
      return loadingStates[key] || false;
    },
    [loadingStates],
  );

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const clearAllLoading = useCallback(() => {
    setLoadingStates({} as Record<T, boolean>);
  }, []);

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    isLoading,
    isAnyLoading,
    clearAllLoading,
  };
}

/**
 * Hook for managing async operations with loading and progress
 */
export function useAsyncWithProgress<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (operation: (updateProgress: (progress: number) => void) => Promise<T>) => {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      try {
        const result = await operation((newProgress) => {
          setProgress(Math.max(0, Math.min(100, newProgress)));
        });
        setData(result);
        setProgress(100);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setProgress(0);
    setData(null);
    setError(null);
  }, []);

  return {
    isLoading,
    progress,
    data,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for debounced loading states
 */
export function useDebouncedLoading(delay: number = 300) {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);

    // Debounce showing loading state to prevent flashing
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setShowLoading(true);
    }, delay);
  }, [delay]);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setShowLoading(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const withLoading = useCallback(
    async <R>(operation: () => Promise<R>): Promise<R> => {
      startLoading();
      try {
        const result = await operation();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    showLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}

/**
 * Hook for optimistic updates with loading states
 */
export function useOptimisticUpdate<T>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const updateOptimistically = useCallback(
    async (optimisticValue: T, operation: () => Promise<T>): Promise<T> => {
      // Apply optimistic update
      const previousData = data;
      setData(optimisticValue);
      setIsOptimistic(true);
      setIsLoading(true);

      try {
        // Perform actual operation
        const result = await operation();
        setData(result);
        return result;
      } catch (error) {
        // Revert to previous data on error
        setData(previousData);
        throw error;
      } finally {
        setIsOptimistic(false);
        setIsLoading(false);
      }
    },
    [data],
  );

  const setDataDirectly = useCallback((newData: T) => {
    setData(newData);
    setIsOptimistic(false);
  }, []);

  return {
    data,
    isLoading,
    isOptimistic,
    updateOptimistically,
    setData: setDataDirectly,
  };
}
