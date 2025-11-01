import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from './redis';
import { logger } from './utils/logger';

/**
 * Rate Limit Configuration
 */
export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed
   */
  limit: number;
  /**
   * Time window in seconds
   */
  window: number;
  /**
   * Identifier for the rate limit (e.g., 'chat', 'upload', 'agents')
   */
  name: string;
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number; // Unix timestamp when limit resets
  limit: number;
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
  // AI Chat: 50 requests per minute per user
  CHAT: {
    limit: 50,
    window: 60,
    name: 'chat',
  } as RateLimitConfig,

  // Document upload: 20 requests per 5 minutes per user
  UPLOAD: {
    limit: 20,
    window: 300,
    name: 'upload',
  } as RateLimitConfig,

  // Agent creation: 30 requests per 5 minutes per user
  AGENT_CREATE: {
    limit: 30,
    window: 300,
    name: 'agent_create',
  } as RateLimitConfig,

  // Agent operations (get, update): 100 requests per minute per user
  AGENT_OPS: {
    limit: 100,
    window: 60,
    name: 'agent_ops',
  } as RateLimitConfig,

  // General API: 200 requests per minute per user
  GENERAL: {
    limit: 200,
    window: 60,
    name: 'general',
  } as RateLimitConfig,

  // CRM Routes
  CRM_CREATE: {
    limit: 100,
    window: 60,
    name: 'crm_create',
  } as RateLimitConfig,

  CRM_READ: {
    limit: 1000,
    window: 60,
    name: 'crm_read',
  } as RateLimitConfig,

  // Business Operations
  INVOICE_CREATE: {
    limit: 50,
    window: 60,
    name: 'invoice_create',
  } as RateLimitConfig,

  CAMPAIGN_OPS: {
    limit: 100,
    window: 60,
    name: 'campaign_ops',
  } as RateLimitConfig,

  EXPORT_CREATE: {
    limit: 10,
    window: 300, // 10 per 5 minutes
    name: 'export_create',
  } as RateLimitConfig,

  IMPORT_CREATE: {
    limit: 10,
    window: 300, // 10 per 5 minutes
    name: 'import_create',
  } as RateLimitConfig,

  // Communication
  EMAIL_SEND: {
    limit: 100,
    window: 3600, // 100 per hour
    name: 'email_send',
  } as RateLimitConfig,

  CHAT_MESSAGE: {
    limit: 200,
    window: 60,
    name: 'chat_message',
  } as RateLimitConfig,

  // Analytics
  ANALYTICS_QUERY: {
    limit: 100,
    window: 60,
    name: 'analytics_query',
  } as RateLimitConfig,

  REPORT_GENERATE: {
    limit: 20,
    window: 300, // 20 per 5 minutes
    name: 'report_generate',
  } as RateLimitConfig,

  // Developer Tools
  WEBHOOK_OPS: {
    limit: 50,
    window: 60,
    name: 'webhook_ops',
  } as RateLimitConfig,

  PLAYGROUND: {
    limit: 50,
    window: 60,
    name: 'playground',
  } as RateLimitConfig,

  // Admin (stricter limits)
  ADMIN_OPS: {
    limit: 30,
    window: 60,
    name: 'admin_ops',
  } as RateLimitConfig,
} as const;

/**
 * Check rate limit for a user/IP using sliding window algorithm
 *
 * @param identifier - User ID, IP address, or other unique identifier
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  try {
    const redis = getRedisClient();
    const key = `ratelimit:${config.name}:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.window * 1000;

    // Use Redis sorted set with timestamps as scores
    // Remove old entries outside the window
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    const currentCount = await redis.zcard(key);

    if (currentCount >= config.limit) {
      // Rate limit exceeded
      const oldestEntry = await redis.zrange(key, 0, 0, { withScores: true });
      const reset = oldestEntry[0]
        ? Math.ceil((Number(oldestEntry[1]) + config.window * 1000) / 1000)
        : Math.ceil((now + config.window * 1000) / 1000);

      return {
        success: false,
        remaining: 0,
        reset,
        limit: config.limit,
      };
    }

    // Add current request
    await redis.zadd(key, { score: now, member: `${now}-${Math.random()}` });

    // Set expiry on the key (window + 1 minute buffer)
    await redis.expire(key, config.window + 60);

    return {
      success: true,
      remaining: config.limit - currentCount - 1,
      reset: Math.ceil((now + config.window * 1000) / 1000),
      limit: config.limit,
    };
  } catch (error) {
    // If Redis fails, allow the request but log the error
    logger.error('Rate limit check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      identifier,
      config: config.name,
    });

    // Fail open - allow request if rate limiting service is down
    return {
      success: true,
      remaining: config.limit,
      reset: Math.ceil((Date.now() + config.window * 1000) / 1000),
      limit: config.limit,
    };
  }
}

/**
 * Rate limit middleware for API routes
 *
 * @param config - Rate limit configuration
 * @param getIdentifier - Function to extract identifier from request (defaults to userId or IP)
 * @returns Middleware function
 */
export function withRateLimit(
  config: RateLimitConfig,
  getIdentifier?: (req: NextRequest) => Promise<string | null>,
) {
  return async (req: NextRequest): Promise<NextResponse | null> => {
    try {
      let identifier: string | null = null;

      if (getIdentifier) {
        identifier = await getIdentifier(req);
      }

      // Default: use IP address as identifier
      if (!identifier) {
        identifier =
          req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
          req.headers.get('x-real-ip') ||
          'unknown';
      }

      if (!identifier || identifier === 'unknown') {
        logger.warn('Rate limit: unable to identify request', {
          headers: Object.fromEntries(req.headers.entries()),
        });
        // Allow request if we can't identify the user
        return null;
      }

      const result = await checkRateLimit(identifier, config);

      if (!result.success) {
        logger.warn('Rate limit exceeded', {
          identifier,
          config: config.name,
          limit: config.limit,
          window: config.window,
        });

        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: `Too many requests. Please try again in ${Math.ceil((result.reset - Date.now() / 1000) / 60)} minutes.`,
            retryAfter: result.reset,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': String(result.limit),
              'X-RateLimit-Remaining': String(result.remaining),
              'X-RateLimit-Reset': String(result.reset),
              'Retry-After': String(result.reset - Math.floor(Date.now() / 1000)),
            },
          },
        );
      }

      // Add rate limit headers to successful responses
      return null; // Continue to handler, but headers will be added in response
    } catch (error) {
      logger.error('Rate limit middleware error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      // Fail open - allow request if middleware fails
      return null;
    }
  };
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(response: NextResponse, result: RateLimitResult): NextResponse {
  response.headers.set('X-RateLimit-Limit', String(result.limit));
  response.headers.set('X-RateLimit-Remaining', String(result.remaining));
  response.headers.set('X-RateLimit-Reset', String(result.reset));
  return response;
}
