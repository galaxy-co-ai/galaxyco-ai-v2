import { z } from "zod";
import { idSchema, emailSchema, dateSchema } from "../validation";

/**
 * CRM Validation Schemas
 * Zod schemas for customers, projects, contacts, tasks, calendar, prospects
 */

// ============================================================================
// CUSTOMERS
// ============================================================================

export const customerStatusSchema = z.enum([
  "active",
  "inactive",
  "churned",
  "prospect",
]);

export const createCustomerSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, "Customer name is required")
    .max(255, "Customer name cannot exceed 255 characters"),
  email: emailSchema.optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]+$/, "Invalid phone number")
    .optional(),
  website: z.string().url("Invalid website URL").optional(),
  industry: z.string().max(100).optional(),
  size: z.enum(["1-10", "11-50", "51-200", "201-500", "501+"]).optional(),
  status: customerStatusSchema.default("prospect"),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateCustomerSchema = createCustomerSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

// ============================================================================
// PROJECTS
// ============================================================================

export const projectStatusSchema = z.enum([
  "planning",
  "active",
  "on-hold",
  "completed",
  "archived",
]);

export const projectPrioritySchema = z.enum([
  "low",
  "medium",
  "high",
  "urgent",
]);

export const createProjectSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, "Project name is required")
    .max(255, "Project name cannot exceed 255 characters"),
  description: z.string().max(2000).optional(),
  customerId: idSchema.optional(),
  status: projectStatusSchema.default("planning"),
  priority: projectPrioritySchema.default("medium"),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  budget: z.number().positive().optional(),
  tags: z.array(z.string()).max(20).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// ============================================================================
// CONTACTS
// ============================================================================

export const contactRoleSchema = z.enum([
  "decision-maker",
  "influencer",
  "champion",
  "gatekeeper",
  "user",
  "other",
]);

export const createContactSchema = z.object({
  workspaceId: idSchema,
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name cannot exceed 100 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name cannot exceed 100 characters"),
  email: emailSchema,
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]+$/, "Invalid phone number")
    .optional(),
  title: z.string().max(100).optional(),
  role: contactRoleSchema.optional(),
  customerId: idSchema.optional(),
  projectId: idSchema.optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).max(20).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateContactSchema = createContactSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateContactInput = z.infer<typeof createContactSchema>;
export type UpdateContactInput = z.infer<typeof updateContactSchema>;

// ============================================================================
// TASKS
// ============================================================================

export const taskStatusSchema = z.enum([
  "todo",
  "in-progress",
  "review",
  "completed",
  "cancelled",
]);

export const taskPrioritySchema = z.enum(["low", "medium", "high", "urgent"]);

export const createTaskSchema = z.object({
  workspaceId: idSchema,
  title: z
    .string()
    .min(1, "Task title is required")
    .max(255, "Task title cannot exceed 255 characters"),
  description: z.string().max(2000).optional(),
  status: taskStatusSchema.default("todo"),
  priority: taskPrioritySchema.default("medium"),
  assigneeId: idSchema.optional(),
  projectId: idSchema.optional(),
  customerId: idSchema.optional(),
  dueDate: dateSchema.optional(),
  estimatedHours: z.number().positive().max(1000).optional(),
  tags: z.array(z.string()).max(20).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateTaskSchema = createTaskSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// ============================================================================
// CALENDAR
// ============================================================================

export const eventTypeSchema = z.enum([
  "meeting",
  "call",
  "deadline",
  "reminder",
  "other",
]);

export const createCalendarEventSchema = z.object({
  workspaceId: idSchema,
  title: z
    .string()
    .min(1, "Event title is required")
    .max(255, "Event title cannot exceed 255 characters"),
  description: z.string().max(2000).optional(),
  type: eventTypeSchema.default("meeting"),
  startTime: dateSchema,
  endTime: dateSchema,
  location: z.string().max(255).optional(),
  isAllDay: z.boolean().default(false),
  attendees: z
    .array(
      z.object({
        userId: idSchema.optional(),
        contactId: idSchema.optional(),
        email: emailSchema.optional(),
        status: z.enum(["pending", "accepted", "declined"]).default("pending"),
      }),
    )
    .max(100)
    .optional(),
  projectId: idSchema.optional(),
  taskId: idSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateCalendarEventSchema = createCalendarEventSchema
  .partial()
  .omit({ workspaceId: true })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
      }
      return true;
    },
    { message: "End time must be after start time" },
  );

export type CreateCalendarEventInput = z.infer<
  typeof createCalendarEventSchema
>;
export type UpdateCalendarEventInput = z.infer<
  typeof updateCalendarEventSchema
>;

// ============================================================================
// PROSPECTS
// ============================================================================

export const prospectStageSchema = z.enum([
  "lead",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
]);

export const prospectSourceSchema = z.enum([
  "website",
  "referral",
  "cold-outreach",
  "event",
  "social-media",
  "paid-ads",
  "other",
]);

export const createProspectSchema = z.object({
  workspaceId: idSchema,
  name: z
    .string()
    .min(1, "Prospect name is required")
    .max(255, "Prospect name cannot exceed 255 characters"),
  email: emailSchema.optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]+$/, "Invalid phone number")
    .optional(),
  company: z.string().max(255).optional(),
  title: z.string().max(100).optional(),
  stage: prospectStageSchema.default("lead"),
  source: prospectSourceSchema.default("other"),
  score: z.number().int().min(0).max(100).optional(),
  expectedValue: z.number().positive().optional(),
  expectedCloseDate: dateSchema.optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).max(20).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateProspectSchema = createProspectSchema
  .partial()
  .omit({ workspaceId: true });

export type CreateProspectInput = z.infer<typeof createProspectSchema>;
export type UpdateProspectInput = z.infer<typeof updateProspectSchema>;
