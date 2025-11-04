/**
 * Cache Wrapper Utilities
 *
 * Helper functions to wrap database queries with caching
 */

import { cache } from './redis';

/**
 * Wrap a function with caching
 *
 * @param key Cache key
 * @param ttl Time to live in seconds
 * @param fetcher Function to fetch data if not cached
 * @returns Cached or fresh data
 */
export async function withCache<T>(
  key: string,
  ttl: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  // Try cache first
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Cache result (don't await - fire and forget)
  cache.set(key, data, ttl).catch((err) => {
    console.error('[Cache] Set failed:', err);
  });

  return data;
}

/**
 * Invalidate cache keys
 *
 * Call this after mutations to keep cache fresh
 */
export async function invalidateCache(keys: string | string[]): Promise<void> {
  const keysArray = Array.isArray(keys) ? keys : [keys];

  for (const key of keysArray) {
    await cache.del(key);
  }
}

/**
 * Cache decorator for async functions
 *
 * Usage:
 * const getCachedData = cached('my-key', 300, async () => { ... });
 */
export function cached<T>(
  keyOrKeyFn: string | ((...args: any[]) => string),
  ttl: number,
  fetcher: (...args: any[]) => Promise<T>,
): (...args: any[]) => Promise<T> {
  return async (...args: any[]) => {
    const key = typeof keyOrKeyFn === 'function' ? keyOrKeyFn(...args) : keyOrKeyFn;
    return withCache(key, ttl, () => fetcher(...args));
  };
}
