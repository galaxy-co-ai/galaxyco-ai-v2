import { z } from "zod";
import { idSchema, dateSchema } from "../validation";

/**
 * Business Operations Validation Schemas
 * Zod schemas for invoices, campaigns, segments, exports, imports
 */

// ============================================================================
// INVOICES
// ============================================================================

export const invoiceStatusSchema = z.enum([
  "draft",
  "sent",
  "viewed",
  "paid",
  "overdue",
  "void",
  "cancelled",
]);

export const invoiceLineItemSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().positive("Unit price must be positive"),
  discount: z.number().min(0).max(100).default(0),
  taxRate: z.number().min(0).max(100).default(0),
});

export const createInvoiceSchema = z.object({
  workspaceId: idSchema,
  customerId: idSchema,
  invoiceNumber: z
    .string()
    .regex(/^[A-Z0-9-]+$/, "Invalid invoice number format")
    .optional(),
  status: invoiceStatusSchema.default("draft"),
  issueDate: dateSchema,
  dueDate: dateSchema,
  lineItems: z
    .array(invoiceLineItemSchema)
    .min(1, "At least one line item is required")
    .max(100, "Cannot exceed 100 line items"),
  notes: z.string().max(2000).optional(),
  terms: z.string().max(2000).optional(),
  currency: z.string().length(3).default("USD"),
  metadata: z.record(z.any()).optional(),
});

export const updateInvoiceSchema = createInvoiceSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

// ============================================================================
// CAMPAIGNS
// ============================================================================

export const campaignTypeSchema = z.enum([
  "email",
  "social",
  "paid-ads",
  "content",
  "event",
  "multi-channel",
]);

export const campaignStatusSchema = z.enum([
  "draft",
  "scheduled",
  "active",
  "paused",
  "completed",
  "archived",
]);

export const createCampaignSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, "Campaign name is required")
    .max(255, "Campaign name cannot exceed 255 characters"),
  description: z.string().max(2000).optional(),
  type: campaignTypeSchema,
  status: campaignStatusSchema.default("draft"),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  budget: z.number().positive().optional(),
  targetAudience: z
    .object({
      segmentIds: z.array(idSchema).optional(),
      criteria: z.record(z.any()).optional(),
      estimatedReach: z.number().int().positive().optional(),
    })
    .optional(),
  goals: z
    .object({
      impressions: z.number().int().positive().optional(),
      clicks: z.number().int().positive().optional(),
      conversions: z.number().int().positive().optional(),
      revenue: z.number().positive().optional(),
    })
    .optional(),
  tags: z.array(z.string()).max(20).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateCampaignSchema = createCampaignSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;

// ============================================================================
// SEGMENTS
// ============================================================================

export const segmentTypeSchema = z.enum([
  "dynamic",
  "static",
  "behavioral",
  "demographic",
]);

export const segmentOperatorSchema = z.enum([
  "equals",
  "not-equals",
  "contains",
  "not-contains",
  "greater-than",
  "less-than",
  "in",
  "not-in",
]);

export const segmentRuleSchema = z.object({
  field: z.string().min(1, "Field is required"),
  operator: segmentOperatorSchema,
  value: z.any(),
});

export const createSegmentSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, "Segment name is required")
    .max(255, "Segment name cannot exceed 255 characters"),
  description: z.string().max(2000).optional(),
  type: segmentTypeSchema.default("dynamic"),
  rules: z.array(segmentRuleSchema).min(1, "At least one rule is required"),
  logic: z.enum(["and", "or"]).default("and"),
  tags: z.array(z.string()).max(20).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateSegmentSchema = createSegmentSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateSegmentInput = z.infer<typeof createSegmentSchema>;
export type UpdateSegmentInput = z.infer<typeof updateSegmentSchema>;

// ============================================================================
// EXPORTS
// ============================================================================

export const exportFormatSchema = z.enum(["csv", "json", "xlsx", "pdf"]);

export const exportStatusSchema = z.enum([
  "queued",
  "processing",
  "completed",
  "failed",
  "expired",
]);

export const createExportSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, "Export name is required")
    .max(255, "Export name cannot exceed 255 characters"),
  resource: z.enum([
    "customers",
    "contacts",
    "projects",
    "tasks",
    "invoices",
    "campaigns",
    "analytics",
  ]),
  format: exportFormatSchema.default("csv"),
  filters: z.record(z.any()).optional(),
  fields: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateExportSchema = createExportSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateExportInput = z.infer<typeof createExportSchema>;
export type UpdateExportInput = z.infer<typeof updateExportSchema>;

// ============================================================================
// IMPORTS
// ============================================================================

export const importStatusSchema = z.enum([
  "queued",
  "validating",
  "processing",
  "completed",
  "failed",
  "partial",
]);

export const importSourceSchema = z.enum(["file", "url", "api", "integration"]);

export const createImportSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, "Import name is required")
    .max(255, "Import name cannot exceed 255 characters"),
  resource: z.enum([
    "customers",
    "contacts",
    "projects",
    "tasks",
    "products",
    "invoices",
  ]),
  source: importSourceSchema,
  fileUrl: z.string().url("Invalid file URL").optional(),
  mapping: z
    .record(z.string())
    .describe("Map CSV columns to resource fields")
    .optional(),
  options: z
    .object({
      updateExisting: z.boolean().default(false),
      skipErrors: z.boolean().default(true),
      validateOnly: z.boolean().default(false),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateImportSchema = createImportSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateImportInput = z.infer<typeof createImportSchema>;
export type UpdateImportInput = z.infer<typeof updateImportSchema>;
