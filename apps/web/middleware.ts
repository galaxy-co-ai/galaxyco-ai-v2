import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Route redirects for IA refactor (Week 2)
const ROUTE_REDIRECTS: Record<string, string> = {
  // CRM Consolidation
  "/customers": "/crm/customers",
  "/contacts": "/crm/contacts",
  "/projects": "/crm/projects",
  "/prospects": "/crm/prospects",
  "/segments": "/crm/segments",

  // Analytics Consolidation
  "/sales": "/analytics/sales",
  "/marketing": "/analytics/marketing",
  "/outreach": "/analytics/outreach",
  "/time-usage": "/analytics/time-usage",
  "/usage": "/analytics/usage",

  // Library Consolidation
  "/knowledge": "/library",
  "/documents": "/library/documents",
  "/templates": "/library/templates",
  "/resources": "/library/resources",

  // Business Consolidation
  "/invoices": "/business/invoices",
  "/campaigns": "/business/campaigns",
  "/emails": "/business/emails",

  // Developer Consolidation
  "/api-explorer": "/developer/api",
  "/webhooks": "/developer/webhooks",
  "/playground": "/developer/playground",

  // Automations Consolidation
  "/integrations": "/automations/integrations",

  // Data Management
  "/exports": "/data/exports",
  "/imports": "/data/imports",
  "/audit-log": "/data/audit-log",

  // Settings Consolidation
  "/api-keys": "/settings/api-keys",

  // Mobile Deprecation (use responsive design)
  "/m/dashboard": "/dashboard",
  "/m/agents": "/agents",
  "/m/calendar": "/calendar",
  "/m/chat": "/chat",
  "/m/contacts": "/crm/contacts",
  "/m/documents": "/library/documents",
  "/m/notifications": "/notifications",
  "/m/prospects": "/crm/prospects",
  "/m/search": "/search",
  "/m/settings": "/settings",
  "/m/tasks": "/tasks",
  "/m/workflows": "/workflows",
};

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
  "/api/workspace/current",
  "/api/workspace/list",
  "/api/webhooks/clerk",
  "/api/marketplace/templates(.*)",
  "/api/marketplace/categories",
  "/api/marketplace/stats",
  "/marketplace(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname, search } = request.nextUrl;

  // Handle route redirects for IA refactor
  if (ROUTE_REDIRECTS[pathname]) {
    const redirectUrl = new URL(
      ROUTE_REDIRECTS[pathname] + search,
      request.url,
    );
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  // Handle dynamic route redirects (with IDs)
  if (pathname.startsWith("/documents/") && !pathname.startsWith("/library/")) {
    const redirectUrl = new URL(
      pathname.replace("/documents/", "/library/documents/") + search,
      request.url,
    );
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  if (pathname.startsWith("/files/") && !pathname.startsWith("/library/")) {
    const redirectUrl = new URL(
      pathname.replace("/files/", "/library/files/") + search,
      request.url,
    );
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  if (
    pathname.startsWith("/integrations/") &&
    !pathname.startsWith("/automations/")
  ) {
    const redirectUrl = new URL(
      pathname.replace("/integrations/", "/automations/integrations/") + search,
      request.url,
    );
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  if (
    pathname.startsWith("/webhooks/") &&
    !pathname.startsWith("/developer/")
  ) {
    const redirectUrl = new URL(
      pathname.replace("/webhooks/", "/developer/webhooks/") + search,
      request.url,
    );
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  if (pathname.startsWith("/exports/") && !pathname.startsWith("/data/")) {
    const redirectUrl = new URL(
      pathname.replace("/exports/", "/data/exports/") + search,
      request.url,
    );
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
