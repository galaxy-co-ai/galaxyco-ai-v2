import { z } from 'zod';
import { idSchema, emailSchema } from '../validation';

/**
 * Communication Validation Schemas
 * Zod schemas for inbox, emails, chat, notifications
 */

// ============================================================================
// INBOX
// ============================================================================

export const inboxChannelSchema = z.enum(['email', 'chat', 'notification', 'comment', 'mention']);

export const inboxStatusSchema = z.enum(['unread', 'read', 'archived']);

export const createInboxMessageSchema = z.object({
  workspaceId: idSchema,
  channel: inboxChannelSchema,
  subject: z.string().max(500).optional(),
  body: z.string().min(1, 'Message body is required').max(10000),
  recipientIds: z.array(idSchema).min(1, 'At least one recipient is required'),
  metadata: z.record(z.any()).optional(),
});

export const updateInboxMessageSchema = z.object({
  status: inboxStatusSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateInboxMessageInput = z.infer<typeof createInboxMessageSchema>;
export type UpdateInboxMessageInput = z.infer<typeof updateInboxMessageSchema>;

// ============================================================================
// EMAILS
// ============================================================================

export const emailPrioritySchema = z.enum(['low', 'normal', 'high']);

export const emailAttachmentSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  contentType: z.string().min(1, 'Content type is required'),
  size: z.number().positive(),
  url: z.string().url().optional(),
  content: z.string().optional(),
});

export const createEmailSchema = z.object({
  workspaceId: idSchema,
  to: z
    .array(emailSchema)
    .min(1, 'At least one recipient is required')
    .max(50, 'Cannot exceed 50 recipients'),
  cc: z.array(emailSchema).max(50).optional(),
  bcc: z.array(emailSchema).max(50).optional(),
  subject: z
    .string()
    .min(1, 'Subject is required')
    .max(500, 'Subject cannot exceed 500 characters'),
  body: z.string().min(1, 'Email body is required').max(50000),
  isHtml: z.boolean().default(true),
  priority: emailPrioritySchema.default('normal'),
  threadId: idSchema.optional(),
  attachments: z.array(emailAttachmentSchema).max(10).optional(),
  scheduledFor: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateEmailSchema = z.object({
  labels: z.array(z.string()).max(20).optional(),
  isRead: z.boolean().optional(),
  isStarred: z.boolean().optional(),
  folder: z.enum(['inbox', 'sent', 'drafts', 'trash', 'archive']).optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateEmailInput = z.infer<typeof createEmailSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;

// ============================================================================
// CHAT
// ============================================================================

export const chatMessageTypeSchema = z.enum(['text', 'image', 'file', 'system']);

export const createChatMessageSchema = z.object({
  workspaceId: idSchema,
  conversationId: idSchema.optional(),
  recipientId: idSchema.optional(),
  groupId: idSchema.optional(),
  type: chatMessageTypeSchema.default('text'),
  content: z.string().min(1, 'Message content is required').max(10000),
  attachments: z
    .array(
      z.object({
        type: z.enum(['image', 'file', 'link']),
        url: z.string().url(),
        filename: z.string().optional(),
        size: z.number().positive().optional(),
      }),
    )
    .max(5)
    .optional(),
  replyTo: idSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateChatMessageSchema = z.object({
  content: z.string().min(1).max(10000).optional(),
  isEdited: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateChatMessageInput = z.infer<typeof createChatMessageSchema>;
export type UpdateChatMessageInput = z.infer<typeof updateChatMessageSchema>;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notificationTypeSchema = z.enum([
  'info',
  'success',
  'warning',
  'error',
  'mention',
  'assignment',
  'reminder',
  'system',
]);

export const notificationChannelSchema = z.enum(['in-app', 'email', 'push', 'sms']);

export const createNotificationSchema = z.object({
  workspaceId: idSchema,
  userId: idSchema,
  type: notificationTypeSchema,
  title: z.string().min(1, 'Title is required').max(255, 'Title cannot exceed 255 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message cannot exceed 1000 characters'),
  actionUrl: z.string().optional(),
  actionLabel: z.string().max(50).optional(),
  channels: z.array(notificationChannelSchema).default(['in-app']),
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean().optional(),
  readAt: z.string().datetime().optional(),
  isDismissed: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
