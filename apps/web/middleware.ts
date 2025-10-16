import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@galaxyco/database';
import { sql } from 'drizzle-orm';
import { getCurrentTenantContext } from './lib/db/tenant-filter';
import { trackApiAccess } from './lib/monitoring/security-logger';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/api/workspace/current',
  '/api/workspace/list',
  '/api/webhooks/clerk',
  '/api/marketplace/templates(.*)',
  '/api/marketplace/categories',
  '/api/marketplace/stats',
  '/marketplace(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const response = NextResponse.next();
  
  // Protect non-public routes
  if (!isPublicRoute(request)) {
    auth().protect();
  }
  
  // Set tenant context for authenticated routes
  const { userId } = auth();
  
  if (userId && !isPublicRoute(request)) {
    try {
      // Get tenant context and set in database session
      const context = await getCurrentTenantContext();
      
      // Enable Row-Level Security policies
      await db.execute(
        sql`SELECT set_tenant_context(${context.tenantId}::uuid)`
      );
      
      // Track API access for security monitoring
      trackApiAccess(
        request.nextUrl.pathname,
        request.method,
        context.userId,
        context.tenantId,
        200
      );
      
      // Add tenant context to response headers for debugging
      response.headers.set('x-tenant-id', context.tenantId);
      response.headers.set('x-user-id', context.userId);
      
    } catch (error) {
      console.error('Failed to set tenant context:', error);
      
      // Log security incident
      trackApiAccess(
        request.nextUrl.pathname,
        request.method,
        userId,
        undefined,
        403
      );
      
      // For API routes, return 403
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Forbidden: Unable to determine tenant context' },
          { status: 403 }
        );
      }
    }
  }
  
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
