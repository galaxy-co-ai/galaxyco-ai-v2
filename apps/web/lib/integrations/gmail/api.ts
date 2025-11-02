/**
 * Gmail API Service
 * Core Gmail API functionality (send/receive emails)
 */

import {
  GmailCredentials,
  GmailSendMessageRequest,
  GmailReceiveMessagesRequest,
  GmailMessage,
} from './types';
import { refreshAccessToken, validateGmailCredentials } from './oauth';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

/**
 * Ensure credentials are valid and refresh if necessary
 */
async function ensureValidCredentials(credentials: GmailCredentials): Promise<GmailCredentials> {
  const isValid = await validateGmailCredentials(credentials);

  if (!isValid && credentials.refreshToken) {
    // Refresh the access token
    return await refreshAccessToken(credentials.refreshToken);
  }

  if (!isValid) {
    throw new Error('Invalid credentials and no refresh token available');
  }

  return credentials;
}

/**
 * Send an email via Gmail API
 */
export async function sendGmailMessage(
  credentials: GmailCredentials,
  message: GmailSendMessageRequest,
): Promise<{ id: string; threadId: string }> {
  // Ensure credentials are valid
  const validCredentials = await ensureValidCredentials(credentials);

  // Create RFC 2822 formatted email
  const emailLines = [
    `To: ${message.to}`,
    ...(message.cc && message.cc.length > 0 ? [`Cc: ${message.cc.join(', ')}`] : []),
    ...(message.bcc && message.bcc.length > 0 ? [`Bcc: ${message.bcc.join(', ')}`] : []),
    `Subject: ${message.subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    message.body,
  ];

  const email = emailLines.join('\r\n');

  // Base64 encode the email
  const encodedEmail = Buffer.from(email)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // Send via Gmail API
  const response = await fetch(`${GMAIL_API_BASE}/users/me/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${validCredentials.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send email: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    threadId: data.threadId,
  };
}

/**
 * Receive/fetch emails from Gmail
 */
export async function receiveGmailMessages(
  credentials: GmailCredentials,
  request: GmailReceiveMessagesRequest,
): Promise<GmailMessage[]> {
  // Ensure credentials are valid
  const validCredentials = await ensureValidCredentials(credentials);

  // Build query parameters
  const params = new URLSearchParams({
    maxResults: request.maxResults.toString(),
    ...(request.query && { q: request.query }),
    ...(request.labelIds && { labelIds: request.labelIds.join(',') }),
  });

  // Fetch message list
  const listResponse = await fetch(`${GMAIL_API_BASE}/users/me/messages?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${validCredentials.accessToken}`,
    },
  });

  if (!listResponse.ok) {
    const error = await listResponse.json();
    throw new Error(`Failed to fetch messages: ${error.error?.message || 'Unknown error'}`);
  }

  const listData = await listResponse.json();

  if (!listData.messages || listData.messages.length === 0) {
    return [];
  }

  // Fetch full message details for each message
  const messages: GmailMessage[] = await Promise.all(
    listData.messages.map(async (msg: { id: string }) => {
      const messageResponse = await fetch(`${GMAIL_API_BASE}/users/me/messages/${msg.id}`, {
        headers: {
          Authorization: `Bearer ${validCredentials.accessToken}`,
        },
      });

      if (!messageResponse.ok) {
        throw new Error(`Failed to fetch message ${msg.id}`);
      }

      const messageData = await messageResponse.json();

      // Extract headers
      const headers = messageData.payload.headers;
      const getHeader = (name: string) =>
        headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

      // Extract body
      let body = '';
      if (messageData.payload.body?.data) {
        body = Buffer.from(messageData.payload.body.data, 'base64').toString('utf-8');
      } else if (messageData.payload.parts) {
        // Handle multipart messages
        const textPart = messageData.payload.parts.find((p: any) => p.mimeType === 'text/plain');
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      }

      return {
        id: messageData.id,
        threadId: messageData.threadId,
        from: getHeader('From'),
        to: getHeader('To')
          .split(',')
          .map((email: string) => email.trim()),
        subject: getHeader('Subject'),
        body,
        receivedAt: new Date(parseInt(messageData.internalDate)).toISOString(),
        labels: messageData.labelIds || [],
      };
    }),
  );

  return messages;
}

/**
 * Search emails with a query
 */
export async function searchGmailMessages(
  credentials: GmailCredentials,
  query: string,
  maxResults = 10,
): Promise<GmailMessage[]> {
  return receiveGmailMessages(credentials, {
    query,
    maxResults,
  });
}
