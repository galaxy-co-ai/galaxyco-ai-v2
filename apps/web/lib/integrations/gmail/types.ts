/**
 * Gmail Integration Types
 * Type definitions for Gmail integration
 */

import { z } from 'zod';

// Gmail OAuth credentials
export interface GmailCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
}

// Gmail message send request
export const GmailSendMessageSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  attachments: z.array(z.any()).optional(),
});

export type GmailSendMessageRequest = z.infer<typeof GmailSendMessageSchema>;

// Gmail message receive request
export const GmailReceiveMessagesSchema = z.object({
  maxResults: z.number().min(1).max(100).default(10),
  query: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
});

export type GmailReceiveMessagesRequest = z.infer<typeof GmailReceiveMessagesSchema>;

// Gmail message type
export interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  receivedAt: string;
  labels: string[];
}

// Gmail integration config for workflow nodes
export const GmailIntegrationConfigSchema = z.object({
  action: z.enum(['send', 'receive', 'search']),
  sendConfig: GmailSendMessageSchema.optional(),
  receiveConfig: GmailReceiveMessagesSchema.optional(),
});

export type GmailIntegrationConfig = z.infer<typeof GmailIntegrationConfigSchema>;
