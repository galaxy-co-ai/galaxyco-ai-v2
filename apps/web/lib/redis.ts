import { Redis } from '@upstash/redis';

/**
 * Redis client singleton for Upstash KV
 * Uses KV_REST_API_URL and KV_REST_API_TOKEN environment variables
 */
let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      throw new Error(
        'Redis configuration missing. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.'
      );
    }

    redis = new Redis({
      url,
      token,
    });
  }

  return redis;
}

/**
 * Get read-only Redis client
 * Uses KV_REST_API_READ_ONLY_TOKEN for read operations
 */
export function getRedisReadOnlyClient(): Redis {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_READ_ONLY_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Redis read-only configuration missing. Please set KV_REST_API_URL and KV_REST_API_READ_ONLY_TOKEN environment variables.'
    );
  }

  return new Redis({
    url,
    token,
  });
}

export { Redis };
