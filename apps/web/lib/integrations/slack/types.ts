/**
 * Slack Integration Types
 * Type definitions for Slack integration
 */

import { z } from 'zod';

// Slack OAuth credentials
export interface SlackCredentials {
  accessToken: string;
  tokenType: string;
  scope: string;
  botUserId?: string;
  appId?: string;
  teamId?: string;
  teamName?: string;
}

// Slack message send request
export const SlackSendMessageSchema = z.object({
  channel: z.string(),
  text: z.string(),
  threadTs: z.string().optional(), // Reply to thread
  blocks: z.array(z.any()).optional(), // Rich message blocks
  attachments: z.array(z.any()).optional(),
});

export type SlackSendMessageRequest = z.infer<typeof SlackSendMessageSchema>;

// Slack channel messages request
export const SlackReadMessagesSchema = z.object({
  channel: z.string(),
  limit: z.number().min(1).max(100).default(10),
  oldest: z.string().optional(), // Timestamp
  latest: z.string().optional(), // Timestamp
});

export type SlackReadMessagesRequest = z.infer<typeof SlackReadMessagesSchema>;

// Slack message type
export interface SlackMessage {
  type: string;
  user?: string;
  text: string;
  ts: string;
  threadTs?: string;
  channel?: string;
}

// Slack channel type
export interface SlackChannel {
  id: string;
  name: string;
  isChannel: boolean;
  isGroup: boolean;
  isIm: boolean;
  isMember: boolean;
  isPrivate: boolean;
}

// Slack integration config for workflow nodes
export const SlackIntegrationConfigSchema = z.object({
  action: z.enum(['send_message', 'read_messages', 'list_channels', 'create_channel']),
  sendConfig: SlackSendMessageSchema.optional(),
  readConfig: SlackReadMessagesSchema.optional(),
  createChannelName: z.string().optional(),
});

export type SlackIntegrationConfig = z.infer<typeof SlackIntegrationConfigSchema>;
