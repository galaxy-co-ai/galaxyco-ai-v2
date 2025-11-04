/**
 * API Route Helpers
 *
 * Common utilities for API routes to reduce duplication
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

/**
 * Standard API response format
 */
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
}

/**
 * Get authenticated user
 */
export async function getAuthenticatedUser(): Promise<{ userId: string } | null> {
  const { userId } = await auth();
  return userId ? { userId } : null;
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(): Promise<{ userId: string }> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new APIError('Unauthorized', 401);
  }
  return user;
}

/**
 * API Error class for consistent error handling
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Format error for API response
 */
export function formatAPIError(error: unknown): {
  error: string;
  details?: string;
  statusCode: number;
} {
  if (error instanceof APIError) {
    return {
      error: error.message,
      details: error.details,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof z.ZodError) {
    return {
      error: 'Invalid input',
      details: error.errors[0]?.message || 'Validation failed',
      statusCode: 400,
    };
  }

  if (error instanceof Error) {
    console.error('[API Error]', error);

    // User-friendly error messages
    if (error.message.includes('unique constraint')) {
      return { error: 'A record with that value already exists', statusCode: 409 };
    }
    if (error.message.includes('foreign key')) {
      return { error: 'Referenced record not found', statusCode: 400 };
    }
    if (error.message.includes('not found')) {
      return { error: 'Resource not found', statusCode: 404 };
    }
  }

  return {
    error: 'An unexpected error occurred. Please try again.',
    statusCode: 500,
  };
}

/**
 * Create success response
 */
export function successResponse<T>(data: T, meta?: APIResponse['meta']): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    ...(meta && { meta }),
  });
}

/**
 * Create error response
 */
export function errorResponse(error: unknown): NextResponse {
  const formatted = formatAPIError(error);
  return NextResponse.json(
    {
      success: false,
      error: formatted.error,
      details: formatted.details,
    },
    { status: formatted.statusCode },
  );
}

/**
 * Validate request body with Zod schema
 */
export async function validateRequestBody<T>(req: Request, schema: z.ZodSchema<T>): Promise<T> {
  try {
    const body = await req.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError('Invalid request body', 400, error.errors[0]?.message);
    }
    throw error;
  }
}

/**
 * Parse and validate query parameters
 */
export function parseQueryParams(url: URL, schema: z.ZodSchema): any {
  const params: Record<string, any> = {};

  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return schema.parse(params);
}

/**
 * Pagination helpers
 */
export function getPaginationParams(searchParams: URLSearchParams): {
  limit: number;
  offset: number;
} {
  return {
    limit: parseInt(searchParams.get('limit') || '50'),
    offset: parseInt(searchParams.get('offset') || '0'),
  };
}

/**
 * Create paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  total: number,
  limit: number,
  offset: number,
): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  });
}

/**
 * Async handler wrapper with automatic error handling
 */
export function asyncHandler(handler: (req: Request, ...args: any[]) => Promise<NextResponse>) {
  return async (req: Request, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
