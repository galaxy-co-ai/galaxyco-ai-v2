/**
 * Gmail Integration Types
 * Type-safe definitions for Gmail API interactions
 */

export interface GmailSendEmailParams {
  to: string;
  subject: string;
  body: string;
  cc?: string;
  bcc?: string;
  from?: string;
}

export interface GmailSendEmailResult {
  messageId: string;
  timestamp: string;
  threadId?: string;
}

export interface GmailReceiveEmailsParams {
  query?: string;
  maxResults?: number;
  labelIds?: string[];
}

export interface GmailEmail {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  snippet: string;
  body?: string;
  date: string;
  labels: string[];
  isUnread: boolean;
}

export interface GmailReceiveEmailsResult {
  emails: GmailEmail[];
  count: number;
  nextPageToken?: string;
}

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body: { data?: string };
    parts?: Array<{ body: { data?: string }; mimeType: string }>;
  };
  internalDate: string;
}

export interface GmailListMessagesResponse {
  messages: Array<{ id: string; threadId: string }>;
  nextPageToken?: string;
  resultSizeEstimate: number;
}
