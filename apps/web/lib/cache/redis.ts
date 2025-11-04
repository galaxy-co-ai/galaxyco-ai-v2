/**
 * Redis Client for Caching
 *
 * Uses Upstash Redis for serverless-friendly caching
 * Falls back to in-memory cache if Redis unavailable
 */

import { Redis } from '@upstash/redis';

// Initialize Redis client
let redis: Redis | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('[Redis] Connected to Upstash Redis');
  } else {
    console.warn('[Redis] Upstash credentials not configured, using in-memory cache');
  }
} catch (error) {
  console.error('[Redis] Failed to initialize:', error);
}

// In-memory fallback cache
const memoryCache = new Map<string, { value: any; expires: number }>();

// Clean up expired entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of memoryCache.entries()) {
      if (entry.expires < now) {
        memoryCache.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

/**
 * Cache interface
 */
export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (redis) {
        const value = await redis.get(key);
        return value as T | null;
      }

      // Fallback to memory cache
      const entry = memoryCache.get(key);
      if (entry && entry.expires > Date.now()) {
        return entry.value as T;
      }

      return null;
    } catch (error) {
      console.error('[Cache] Get error:', error);
      return null;
    }
  },

  /**
   * Set value in cache with TTL (seconds)
   */
  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      if (redis) {
        await redis.set(key, value, { ex: ttl });
        return;
      }

      // Fallback to memory cache
      memoryCache.set(key, {
        value,
        expires: Date.now() + ttl * 1000,
      });
    } catch (error) {
      console.error('[Cache] Set error:', error);
    }
  },

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      if (redis) {
        await redis.del(key);
        return;
      }

      memoryCache.delete(key);
    } catch (error) {
      console.error('[Cache] Delete error:', error);
    }
  },

  /**
   * Delete all keys matching pattern
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      if (redis) {
        // Upstash Redis doesn't support SCAN, so we track keys
        // For now, use specific key deletion
        console.warn('[Cache] Pattern deletion not supported in Upstash, use specific keys');
        return;
      }

      // Memory cache pattern deletion
      const regex = new RegExp(pattern.replace('*', '.*'));
      for (const key of memoryCache.keys()) {
        if (regex.test(key)) {
          memoryCache.delete(key);
        }
      }
    } catch (error) {
      console.error('[Cache] Delete pattern error:', error);
    }
  },

  /**
   * Check if Redis is available
   */
  isRedisAvailable(): boolean {
    return redis !== null;
  },
};

/**
 * Cache key builders (ensure consistent naming)
 */
export const cacheKeys = {
  // Agents
  agents: (workspaceId: string) => `workspace:${workspaceId}:agents`,
  agent: (workspaceId: string, agentId: string) => `workspace:${workspaceId}:agent:${agentId}`,

  // Workflows
  workflows: (workspaceId: string) => `workspace:${workspaceId}:workflows`,
  workflow: (workspaceId: string, workflowId: string) =>
    `workspace:${workspaceId}:workflow:${workflowId}`,

  // Customers
  customers: (workspaceId: string) => `workspace:${workspaceId}:customers`,
  customer: (workspaceId: string, customerId: string) =>
    `workspace:${workspaceId}:customer:${customerId}`,

  // Projects
  projects: (workspaceId: string) => `workspace:${workspaceId}:projects`,
  project: (workspaceId: string, projectId: string) =>
    `workspace:${workspaceId}:project:${projectId}`,

  // Analytics (cache longer - expensive queries)
  analyticsSales: (workspaceId: string) => `workspace:${workspaceId}:analytics:sales`,
  analyticsMarketing: (workspaceId: string) => `workspace:${workspaceId}:analytics:marketing`,
  analyticsOutreach: (workspaceId: string) => `workspace:${workspaceId}:analytics:outreach`,
  analyticsUsage: (workspaceId: string) => `workspace:${workspaceId}:analytics:usage`,

  // Templates (global, not workspace-scoped)
  templates: () => `global:templates`,
  template: (templateId: string) => `global:template:${templateId}`,

  // Search (short TTL)
  search: (workspaceId: string, query: string) => `workspace:${workspaceId}:search:${query}`,
};

/**
 * Cache TTLs (in seconds)
 */
export const cacheTTL = {
  short: 60, // 1 minute - frequently changing data
  medium: 300, // 5 minutes - standard cache
  long: 1800, // 30 minutes - expensive queries (analytics)
  veryLong: 3600, // 1 hour - rarely changing (templates)
};
