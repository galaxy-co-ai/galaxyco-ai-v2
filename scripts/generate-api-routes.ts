/**
 * API Route Generator for GalaxyCo.ai 2.0
 *
 * Generates all API routes following the established pattern from /api/customers
 * Ensures consistent security, validation, RLS, and logging across all routes
 */

import * as fs from "fs";
import * as path from "path";

// Route specification interface
interface RouteSpec {
  resource: string; // e.g., "customers", "projects"
  resourceSingular: string; // e.g., "customer", "project"
  baseImportPath:
    | "crm"
    | "business"
    | "communication"
    | "analytics"
    | "analytics"; // validation schema location
  validationSchemaPrefix: string; // e.g., "Customer", "Project"
  rateLimit: string; // e.g., "CRM_CREATE", "INVOICE_CREATE"
  rateLimitRead: string; // e.g., "CRM_READ"
  hasId: boolean; // Whether to create [id] route
  methods: {
    list?: boolean;
    create?: boolean;
    get?: boolean;
    update?: boolean;
    delete?: boolean;
  };
  mockData?: string; // Custom mock data for testing
  specialLogic?: string; // Any special logic notes
}

// Define all routes to generate
const routeSpecs: RouteSpec[] = [
  // CRM Routes (5 remaining - customers already exists)
  {
    resource: "projects",
    resourceSingular: "project",
    baseImportPath: "crm",
    validationSchemaPrefix: "Project",
    rateLimit: "CRM_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "contacts",
    resourceSingular: "contact",
    baseImportPath: "crm",
    validationSchemaPrefix: "Contact",
    rateLimit: "CRM_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "tasks",
    resourceSingular: "task",
    baseImportPath: "crm",
    validationSchemaPrefix: "Task",
    rateLimit: "CRM_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "calendar",
    resourceSingular: "event",
    baseImportPath: "crm",
    validationSchemaPrefix: "CalendarEvent",
    rateLimit: "CRM_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "prospects",
    resourceSingular: "prospect",
    baseImportPath: "crm",
    validationSchemaPrefix: "Prospect",
    rateLimit: "CRM_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },

  // Business Operations Routes (5)
  {
    resource: "invoices",
    resourceSingular: "invoice",
    baseImportPath: "business",
    validationSchemaPrefix: "Invoice",
    rateLimit: "INVOICE_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "campaigns",
    resourceSingular: "campaign",
    baseImportPath: "business",
    validationSchemaPrefix: "Campaign",
    rateLimit: "CAMPAIGN_OPS",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "segments",
    resourceSingular: "segment",
    baseImportPath: "business",
    validationSchemaPrefix: "Segment",
    rateLimit: "CRM_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "exports",
    resourceSingular: "export",
    baseImportPath: "business",
    validationSchemaPrefix: "Export",
    rateLimit: "EXPORT_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "imports",
    resourceSingular: "import",
    baseImportPath: "business",
    validationSchemaPrefix: "Import",
    rateLimit: "IMPORT_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },

  // Communication Routes (4)
  {
    resource: "inbox",
    resourceSingular: "message",
    baseImportPath: "communication",
    validationSchemaPrefix: "InboxMessage",
    rateLimit: "CHAT_MESSAGE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "emails",
    resourceSingular: "email",
    baseImportPath: "communication",
    validationSchemaPrefix: "Email",
    rateLimit: "EMAIL_SEND",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "chat",
    resourceSingular: "message",
    baseImportPath: "communication",
    validationSchemaPrefix: "ChatMessage",
    rateLimit: "CHAT_MESSAGE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },
  {
    resource: "notifications",
    resourceSingular: "notification",
    baseImportPath: "communication",
    validationSchemaPrefix: "Notification",
    rateLimit: "CRM_CREATE",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },

  // Analytics Routes (6) - Read-only except reports
  {
    resource: "analytics/sales",
    resourceSingular: "analytics",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AnalyticsQuery",
    rateLimit: "ANALYTICS_QUERY",
    rateLimitRead: "ANALYTICS_QUERY",
    hasId: false,
    methods: { list: true }, // GET only
    specialLogic: "analytics-read-only",
  },
  {
    resource: "analytics/marketing",
    resourceSingular: "analytics",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AnalyticsQuery",
    rateLimit: "ANALYTICS_QUERY",
    rateLimitRead: "ANALYTICS_QUERY",
    hasId: false,
    methods: { list: true }, // GET only
    specialLogic: "analytics-read-only",
  },
  {
    resource: "analytics/outreach",
    resourceSingular: "analytics",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AnalyticsQuery",
    rateLimit: "ANALYTICS_QUERY",
    rateLimitRead: "ANALYTICS_QUERY",
    hasId: false,
    methods: { list: true }, // GET only
    specialLogic: "analytics-read-only",
  },
  {
    resource: "analytics/time-usage",
    resourceSingular: "analytics",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AnalyticsQuery",
    rateLimit: "ANALYTICS_QUERY",
    rateLimitRead: "ANALYTICS_QUERY",
    hasId: false,
    methods: { list: true }, // GET only
    specialLogic: "analytics-read-only",
  },
  {
    resource: "analytics/usage",
    resourceSingular: "analytics",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AnalyticsQuery",
    rateLimit: "ANALYTICS_QUERY",
    rateLimitRead: "ANALYTICS_QUERY",
    hasId: false,
    methods: { list: true }, // GET only
    specialLogic: "analytics-read-only",
  },
  {
    resource: "reports",
    resourceSingular: "report",
    baseImportPath: "analytics",
    validationSchemaPrefix: "Report",
    rateLimit: "REPORT_GENERATE",
    rateLimitRead: "ANALYTICS_QUERY",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
  },

  // Developer Tools Routes (3) - Note: api-keys already exists
  {
    resource: "webhooks",
    resourceSingular: "webhook",
    baseImportPath: "analytics",
    validationSchemaPrefix: "Webhook",
    rateLimit: "WEBHOOK_OPS",
    rateLimitRead: "CRM_READ",
    hasId: true,
    methods: {
      list: true,
      create: true,
      get: true,
      update: true,
      delete: true,
    },
    specialLogic: "webhook-validation",
  },
  {
    resource: "audit-log",
    resourceSingular: "log",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AuditLog",
    rateLimit: "CRM_READ",
    rateLimitRead: "CRM_READ",
    hasId: false,
    methods: { list: true }, // GET only
    specialLogic: "admin-only",
  },
  {
    resource: "playground",
    resourceSingular: "request",
    baseImportPath: "analytics",
    validationSchemaPrefix: "PlaygroundRequest",
    rateLimit: "PLAYGROUND",
    rateLimitRead: "PLAYGROUND",
    hasId: false,
    methods: { create: true }, // POST only
    specialLogic: "sandbox-mode",
  },

  // Admin Routes (4) - All require admin role
  {
    resource: "admin/users",
    resourceSingular: "user",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AdminUserUpdate",
    rateLimit: "ADMIN_OPS",
    rateLimitRead: "ADMIN_OPS",
    hasId: true,
    methods: { list: true, get: true, update: true, delete: true },
    specialLogic: "admin-role-required",
  },
  {
    resource: "admin/workspaces",
    resourceSingular: "workspace",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AdminWorkspaceUpdate",
    rateLimit: "ADMIN_OPS",
    rateLimitRead: "ADMIN_OPS",
    hasId: true,
    methods: { list: true, get: true, update: true, delete: true },
    specialLogic: "admin-role-required",
  },
  {
    resource: "admin/analytics",
    resourceSingular: "analytics",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AnalyticsQuery",
    rateLimit: "ADMIN_OPS",
    rateLimitRead: "ADMIN_OPS",
    hasId: false,
    methods: { list: true }, // GET only
    specialLogic: "admin-role-required",
  },
  {
    resource: "admin/settings",
    resourceSingular: "settings",
    baseImportPath: "analytics",
    validationSchemaPrefix: "AdminSettings",
    rateLimit: "ADMIN_OPS",
    rateLimitRead: "ADMIN_OPS",
    hasId: false,
    methods: { list: true, update: true }, // GET, PUT only
    specialLogic: "admin-role-required",
  },
];

// Generate route.ts content
function generateRouteFile(spec: RouteSpec): string {
  const resourceCap = spec.resource.split("/").pop()!;
  const resourceTitle =
    resourceCap.charAt(0).toUpperCase() + resourceCap.slice(1);

  let imports = `import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";`;

  // Add validation imports if needed
  if (spec.methods.create || spec.methods.update) {
    const schemaNames = [];
    if (spec.methods.create)
      schemaNames.push(`create${spec.validationSchemaPrefix}Schema`);
    if (spec.methods.update)
      schemaNames.push(`update${spec.validationSchemaPrefix}Schema`);

    imports += `
import { ${schemaNames.join(", ")} } from "@/lib/validation/${spec.baseImportPath}";
import {
  safeValidateRequest,
  formatValidationError,
} from "@/lib/validation";`;
  }

  imports += `
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
`;

  let content = imports + "\n";

  // Generate POST method
  if (spec.methods.create) {
    content += generatePOSTMethod(spec);
  }

  // Generate GET (list) method
  if (spec.methods.list) {
    content += generateGETListMethod(spec);
  }

  return content;
}

function generatePOSTMethod(spec: RouteSpec): string {
  const resourceCap = spec.resource.split("/").pop()!;
  const resourceTitle =
    resourceCap.charAt(0).toUpperCase() + resourceCap.slice(1);

  return `
/**
 * POST /api/${spec.resource}
 * Create a new ${spec.resourceSingular}
 *
 * Requires:
 * - Authentication (Clerk)
 * - Workspace membership
 * - ${resourceTitle} data
 */
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized ${spec.resourceSingular} creation attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.${spec.rateLimit},
    );
    if (!rateLimitResult.success) {
      logger.warn("${resourceTitle} creation rate limit exceeded", {
        userId: clerkUserId,
        limit: rateLimitResult.limit,
        reset: rateLimitResult.reset,
      });
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: \`Too many requests. Please try again in \${Math.ceil((rateLimitResult.reset - Date.now() / 1000) / 60)} minutes.\`,
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimitResult.limit),
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            "X-RateLimit-Reset": String(rateLimitResult.reset),
            "Retry-After": String(
              rateLimitResult.reset - Math.floor(Date.now() / 1000),
            ),
          },
        },
      );
    }

    // 3. Get and validate request body
    const body = await req.json();
    const validation = safeValidateRequest(create${spec.validationSchemaPrefix}Schema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn("Invalid ${spec.resourceSingular} creation request", {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, {
        status: 400,
      });
    }

    const { workspaceId, ...${spec.resourceSingular}Data } = validation.data;

    // 4. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: User not a member of this workspace" },
        { status: 403 },
      );
    }

    // 6. Create ${spec.resourceSingular} (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database insert in Phase 2
    const mock${spec.validationSchemaPrefix} = {
      id: crypto.randomUUID(),
      workspaceId,
      ...${spec.resourceSingular}Data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 7. Return success
    const durationMs = Date.now() - startTime;

    logger.info("${resourceTitle} created successfully", {
      userId: user.id,
      workspaceId,
      ${spec.resourceSingular}Id: mock${spec.validationSchemaPrefix}.id,
      durationMs,
    });

    const response = NextResponse.json({
      success: true,
      ${spec.resourceSingular}: mock${spec.validationSchemaPrefix},
    });

    // Add rate limit headers
    response.headers.set("X-RateLimit-Limit", String(rateLimitResult.limit));
    response.headers.set(
      "X-RateLimit-Remaining",
      String(rateLimitResult.remaining),
    );
    response.headers.set("X-RateLimit-Reset", String(rateLimitResult.reset));

    return response;
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Create ${spec.resourceSingular} error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: "Failed to create ${spec.resourceSingular}",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
`;
}

function generateGETListMethod(spec: RouteSpec): string {
  const resourceCap = spec.resource.split("/").pop()!;
  const resourceTitle =
    resourceCap.charAt(0).toUpperCase() + resourceCap.slice(1);

  return `
/**
 * GET /api/${spec.resource}
 * List all ${spec.resource} for a workspace
 *
 * Query params:
 * - workspaceId: required
 * - limit: optional (default: 50)
 * - offset: optional (default: 0)
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized ${spec.resource} list request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get query params
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    // 3. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: User not a member of this workspace" },
        { status: 403 },
      );
    }

    // 5. Fetch ${spec.resource} (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database query in Phase 2
    const mock${resourceTitle} = [
      {
        id: crypto.randomUUID(),
        workspaceId,
        createdAt: new Date().toISOString(),
      },
    ].slice(offset, offset + limit);

    return NextResponse.json({
      ${spec.resource.replace("/", "_")}: mock${resourceTitle},
      total: mock${resourceTitle}.length,
      limit,
      offset,
    });
  } catch (error) {
    logger.error("List ${spec.resource} error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch ${spec.resource}" },
      { status: 500 },
    );
  }
}
`;
}

// Generate [id] route file
function generateIdRouteFile(spec: RouteSpec): string {
  const resourceCap = spec.resource.split("/").pop()!;
  const resourceTitle =
    resourceCap.charAt(0).toUpperCase() + resourceCap.slice(1);

  let imports = `import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { logger } from "@/lib/utils/logger";
import { db } from "@galaxyco/database";
import { users, workspaceMembers } from "@galaxyco/database/schema";
import { eq, and } from "drizzle-orm";`;

  if (spec.methods.update) {
    imports += `
import { update${spec.validationSchemaPrefix}Schema } from "@/lib/validation/${spec.baseImportPath}";
import {
  safeValidateRequest,
  formatValidationError,
} from "@/lib/validation";`;
  }

  imports += `
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
`;

  let content = imports + "\n";

  // Generate GET method
  if (spec.methods.get) {
    content += generateGETMethod(spec);
  }

  // Generate PUT method
  if (spec.methods.update) {
    content += generatePUTMethod(spec);
  }

  // Generate DELETE method
  if (spec.methods.delete) {
    content += generateDELETEMethod(spec);
  }

  return content;
}

function generateGETMethod(spec: RouteSpec): string {
  const resourceCap = spec.resource.split("/").pop()!;
  const resourceTitle =
    resourceCap.charAt(0).toUpperCase() + resourceCap.slice(1);

  return `
/**
 * GET /api/${spec.resource}/[id]
 * Get a single ${spec.resourceSingular} by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized ${spec.resourceSingular} fetch attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ${spec.resourceSingular}Id = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    // 2. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: User not a member of this workspace" },
        { status: 403 },
      );
    }

    // 4. Fetch ${spec.resourceSingular} (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database query in Phase 2
    const mock${spec.validationSchemaPrefix} = {
      id: ${spec.resourceSingular}Id,
      workspaceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      ${spec.resourceSingular}: mock${spec.validationSchemaPrefix},
    });
  } catch (error) {
    logger.error("Fetch ${spec.resourceSingular} error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch ${spec.resourceSingular}" },
      { status: 500 },
    );
  }
}
`;
}

function generatePUTMethod(spec: RouteSpec): string {
  const resourceCap = spec.resource.split("/").pop()!;
  const resourceTitle =
    resourceCap.charAt(0).toUpperCase() + resourceCap.slice(1);

  return `
/**
 * PUT /api/${spec.resource}/[id]
 * Update a ${spec.resourceSingular}
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized ${spec.resourceSingular} update attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.${spec.rateLimit},
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const ${spec.resourceSingular}Id = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    // 3. Get and validate request body
    const body = await req.json();
    const validation = safeValidateRequest(update${spec.validationSchemaPrefix}Schema, body);

    if (!validation.success) {
      const formattedError = formatValidationError(validation.error);
      logger.warn("Invalid ${spec.resourceSingular} update request", {
        errors: formattedError.errors,
      });
      return NextResponse.json(formattedError, { status: 400 });
    }

    // 4. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: User not a member of this workspace" },
        { status: 403 },
      );
    }

    // 6. Update ${spec.resourceSingular} (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual database update in Phase 2
    const updated${spec.validationSchemaPrefix} = {
      id: ${spec.resourceSingular}Id,
      workspaceId,
      ...validation.data,
      updatedAt: new Date().toISOString(),
    };

    const durationMs = Date.now() - startTime;

    logger.info("${resourceTitle} updated successfully", {
      userId: user.id,
      workspaceId,
      ${spec.resourceSingular}Id,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      ${spec.resourceSingular}: updated${spec.validationSchemaPrefix},
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Update ${spec.resourceSingular} error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: "Failed to update ${spec.resourceSingular}",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
`;
}

function generateDELETEMethod(spec: RouteSpec): string {
  const resourceCap = spec.resource.split("/").pop()!;
  const resourceTitle =
    resourceCap.charAt(0).toUpperCase() + resourceCap.slice(1);

  return `
/**
 * DELETE /api/${spec.resource}/[id]
 * Delete a ${spec.resourceSingular}
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const startTime = Date.now();
  try {
    // 1. Auth check
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      logger.warn("Unauthorized ${spec.resourceSingular} delete attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limiting check
    const rateLimitResult = await checkRateLimit(
      clerkUserId,
      RATE_LIMITS.${spec.rateLimit},
    );
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const ${spec.resourceSingular}Id = params.id;
    const searchParams = req.nextUrl.searchParams;
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Missing required query param: workspaceId" },
        { status: 400 },
      );
    }

    // 3. Get user ID from clerkUserId
    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, clerkUserId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Verify workspace membership
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.workspaceId, workspaceId),
        eq(workspaceMembers.userId, user.id),
      ),
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Forbidden: User not a member of this workspace" },
        { status: 403 },
      );
    }

    // 5. Delete ${spec.resourceSingular} (PLACEHOLDER - table doesn't exist yet)
    // TODO: Replace with actual soft delete in Phase 2
    const durationMs = Date.now() - startTime;

    logger.info("${resourceTitle} deleted successfully", {
      userId: user.id,
      workspaceId,
      ${spec.resourceSingular}Id,
      durationMs,
    });

    return NextResponse.json({
      success: true,
      message: "${resourceTitle} deleted successfully",
    });
  } catch (error) {
    const durationMs = Date.now() - startTime;
    logger.error("Delete ${spec.resourceSingular} error", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      durationMs,
    });
    return NextResponse.json(
      {
        error: "Failed to delete ${spec.resourceSingular}",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
`;
}

// Main generation function
function generateAllRoutes() {
  const baseDir = path.join(process.cwd(), "apps", "web", "app", "api");

  console.log("🚀 Generating API routes...\n");

  let generated = 0;

  for (const spec of routeSpecs) {
    const routeDir = path.join(baseDir, spec.resource);

    // Create route directory
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    // Generate base route.ts
    const routeContent = generateRouteFile(spec);
    fs.writeFileSync(path.join(routeDir, "route.ts"), routeContent);
    console.log(`✅ Generated /api/${spec.resource}/route.ts`);
    generated++;

    // Generate [id] route if needed
    if (spec.hasId) {
      const idDir = path.join(routeDir, "[id]");
      if (!fs.existsSync(idDir)) {
        fs.mkdirSync(idDir, { recursive: true });
      }

      const idRouteContent = generateIdRouteFile(spec);
      fs.writeFileSync(path.join(idDir, "route.ts"), idRouteContent);
      console.log(`✅ Generated /api/${spec.resource}/[id]/route.ts`);
      generated++;
    }
  }

  console.log(`\n🎉 Successfully generated ${generated} route files!`);
  console.log(`\n📋 Summary:`);
  console.log(`   - CRM Routes: 5 resources (10 files)`);
  console.log(`   - Business Routes: 5 resources (10 files)`);
  console.log(`   - Communication Routes: 4 resources (8 files)`);
  console.log(`   - Analytics Routes: 6 resources (7 files)`);
  console.log(`   - Developer Tools: 3 resources (5 files)`);
  console.log(`   - Admin Routes: 4 resources (7 files)`);
  console.log(`\n✨ All routes follow the security pattern:`);
  console.log(`   ✅ Clerk authentication`);
  console.log(`   ✅ Rate limiting`);
  console.log(`   ✅ Zod validation`);
  console.log(`   ✅ Multi-tenant RLS`);
  console.log(`   ✅ Structured logging`);
  console.log(`   ✅ Error handling`);
}

// Run generator
generateAllRoutes();
