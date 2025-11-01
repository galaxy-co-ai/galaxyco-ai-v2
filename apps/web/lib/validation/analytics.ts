import { z } from 'zod';
import { idSchema, dateSchema } from '../validation';

/**
 * Analytics & Admin Validation Schemas
 * Zod schemas for analytics queries, reports, and admin operations
 */

// ============================================================================
// ANALYTICS
// ============================================================================

export const analyticsMetricSchema = z.enum([
  'revenue',
  'deals',
  'conversions',
  'roi',
  'engagement',
  'response-rate',
  'time-saved',
  'active-users',
  'session-duration',
]);

export const analyticsPeriodSchema = z.enum([
  'today',
  'yesterday',
  'last-7-days',
  'last-30-days',
  'last-90-days',
  'this-month',
  'last-month',
  'this-quarter',
  'last-quarter',
  'this-year',
  'last-year',
  'custom',
]);

export const analyticsGranularitySchema = z.enum([
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
]);

export const analyticsQuerySchema = z.object({
  workspaceId: idSchema,
  metrics: z
    .array(analyticsMetricSchema)
    .min(1, 'At least one metric is required')
    .max(10, 'Cannot exceed 10 metrics'),
  period: analyticsPeriodSchema.default('last-30-days'),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  granularity: analyticsGranularitySchema.default('day'),
  filters: z.record(z.any()).optional(),
  groupBy: z.array(z.string()).max(5).optional(),
  limit: z.number().int().positive().max(1000).default(100),
});

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;

// ============================================================================
// REPORTS
// ============================================================================

export const reportTypeSchema = z.enum([
  'sales',
  'marketing',
  'outreach',
  'time-usage',
  'usage',
  'custom',
]);

export const reportFormatSchema = z.enum(['table', 'chart', 'dashboard', 'export']);

export const createReportSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, 'Report name is required')
    .max(255, 'Report name cannot exceed 255 characters'),
  description: z.string().max(2000).optional(),
  type: reportTypeSchema,
  format: reportFormatSchema.default('table'),
  query: analyticsQuerySchema.omit({ workspaceId: true }),
  schedule: z
    .object({
      frequency: z.enum(['daily', 'weekly', 'monthly']),
      time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM
      recipients: z.array(z.string().email()).max(20),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateReportSchema = createReportSchema.partial().omit({ workspaceId: true });

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;

// ============================================================================
// ADMIN OPERATIONS
// ============================================================================

export const adminUserUpdateSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export const adminWorkspaceUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  subscriptionTier: z.enum(['free', 'starter', 'professional', 'enterprise']).optional(),
  subscriptionStatus: z.enum(['active', 'paused', 'cancelled']).optional(),
  isActive: z.boolean().optional(),
  settings: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const adminSettingsSchema = z.object({
  maintenanceMode: z.boolean().optional(),
  allowSignups: z.boolean().optional(),
  maxWorkspacesPerUser: z.number().int().positive().max(100).optional(),
  featureFlags: z.record(z.boolean()).optional(),
  rateLimit: z
    .object({
      requestsPerMinute: z.number().int().positive(),
      burstSize: z.number().int().positive(),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
});

export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
export type AdminWorkspaceUpdateInput = z.infer<typeof adminWorkspaceUpdateSchema>;
export type AdminSettingsInput = z.infer<typeof adminSettingsSchema>;

// ============================================================================
// WEBHOOKS
// ============================================================================

export const webhookEventSchema = z.enum([
  'agent.created',
  'agent.updated',
  'agent.deleted',
  'agent.executed',
  'customer.created',
  'customer.updated',
  'project.created',
  'project.updated',
  'invoice.created',
  'invoice.paid',
  'task.created',
  'task.completed',
]);

export const createWebhookSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, 'Webhook name is required')
    .max(255, 'Webhook name cannot exceed 255 characters'),
  url: z
    .string()
    .url('Invalid webhook URL')
    .refine((url) => url.startsWith('https://'), {
      message: 'Webhook URL must use HTTPS',
    }),
  events: z
    .array(webhookEventSchema)
    .min(1, 'At least one event is required')
    .max(20, 'Cannot exceed 20 events'),
  secret: z.string().min(16, 'Secret must be at least 16 characters').optional(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

export const updateWebhookSchema = createWebhookSchema
  .partial()
  .omit({ workspaceId: true, secret: true });

export type CreateWebhookInput = z.infer<typeof createWebhookSchema>;
export type UpdateWebhookInput = z.infer<typeof updateWebhookSchema>;

// ============================================================================
// PLAYGROUND
// ============================================================================

export const playgroundRequestSchema = z.object({
  workspaceId: idSchema,
  resource: z.enum(['customers', 'projects', 'contacts', 'tasks', 'agents', 'workflows']),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']),
  body: z.record(z.any()).optional(),
  params: z.record(z.string()).optional(),
  validateOnly: z.boolean().default(false),
});

export type PlaygroundRequestInput = z.infer<typeof playgroundRequestSchema>;
