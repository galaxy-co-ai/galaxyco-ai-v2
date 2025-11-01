import { z } from 'zod';

/**
 * Validation Utilities
 * Centralized Zod schemas for input validation across the application
 */

// Common validation patterns
export const idSchema = z.string().uuid('Invalid ID format');
export const emailSchema = z.string().email('Invalid email address');
export const urlSchema = z.string().url('Invalid URL format');
export const dateSchema = z.string().datetime('Invalid date format');

// Agent validation schemas
export const agentNameSchema = z
  .string()
  .min(3, 'Agent name must be at least 3 characters')
  .max(100, 'Agent name cannot exceed 100 characters')
  .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Agent name contains invalid characters');

export const agentDescriptionSchema = z
  .string()
  .max(500, 'Description cannot exceed 500 characters')
  .optional();

export const agentStatusSchema = z.enum(['draft', 'active', 'paused', 'archived']);

export const createAgentSchema = z.object({
  workspaceId: idSchema,
  name: agentNameSchema,
  description: agentDescriptionSchema,
  workflow: z.array(z.any()).optional(), // Workflow steps - can be more specific
  variantType: z.string().optional(),
  originalPrompt: z.string().optional(),
  enhancedPrompt: z.string().optional(),
  integrations: z.array(z.string()).optional(),
});

export const updateAgentSchema = z.object({
  name: agentNameSchema.optional(),
  description: agentDescriptionSchema,
  status: agentStatusSchema.optional(),
  version: z.union([z.string(), z.number()]).optional(),
  workflowSteps: z.array(z.any()).optional(),
});

// Chat validation schemas
export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Message content is required').max(10000, 'Message too long'),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, 'At least one message is required')
    .max(100, 'Too many messages in conversation'),
  conversationId: idSchema.optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
});

// Document validation schemas
export const documentTitleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(255, 'Title cannot exceed 255 characters');

export const documentCategorySchema = z.enum([
  'company_info',
  'case_studies',
  'service_offerings',
  'team_bios',
  'brand_assets',
  'other',
]);

export const uploadDocumentSchema = z.object({
  title: documentTitleSchema,
  category: documentCategorySchema.optional(),
  source: z.enum(['file', 'url', 'text']),
  content: z.string().optional(),
  url: urlSchema.optional(),
});

// File upload validation constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.ms-excel', // XLS
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'text/plain',
  'text/csv',
  'text/markdown',
  'text/x-markdown',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
] as const;

export const ALLOWED_FILE_EXTENSIONS = [
  '.md',
  '.txt',
  '.csv',
  '.json',
  '.pdf',
  '.docx',
  '.doc',
  '.xls',
  '.xlsx',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
] as const;

// File upload FormData validation schema
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, 'File cannot be empty')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    )
    .refine((file) => {
      // Check MIME type
      if (ALLOWED_MIME_TYPES.includes(file.type as any)) return true;
      // Check file extension as fallback
      const fileName = file.name.toLowerCase();
      return ALLOWED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));
    }, 'File type not supported. Supported: PDF, Word, Excel, Text, Markdown, Images'),
  collectionId: idSchema.optional(),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// Test run validation schemas
export const testRunSchema = z.object({
  agentName: agentNameSchema,
  workflowSteps: z.array(z.any()).min(1, 'At least one workflow step is required'),
  companyName: z.string().optional(),
  targetRole: z.string().optional(),
  targetIndustry: z.string().optional(),
});

// Workspace validation schemas
export const workspaceNameSchema = z
  .string()
  .min(2, 'Workspace name must be at least 2 characters')
  .max(50, 'Workspace name cannot exceed 50 characters')
  .regex(/^[a-zA-Z0-9\s\-_&.]+$/, 'Workspace name contains invalid characters');

export const createWorkspaceSchema = z.object({
  name: workspaceNameSchema,
});

// User profile validation schemas
export const userNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name contains invalid characters');

export const updateProfileSchema = z.object({
  firstName: userNameSchema.optional(),
  lastName: userNameSchema.optional(),
  email: emailSchema.optional(),
  timezone: z.string().optional(),
});

/**
 * Helper function to validate request body
 * Returns parsed data if valid, throws ZodError if invalid
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Helper function to safely validate request body
 * Returns success/error result instead of throwing
 */
export function safeValidateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Format Zod error for API response
 */
export function formatValidationError(error: z.ZodError): {
  message: string;
  errors: Array<{ field: string; message: string }>;
} {
  return {
    message: 'Validation failed',
    errors: error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
}
