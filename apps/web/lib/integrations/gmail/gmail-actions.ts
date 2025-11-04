/**
 * Gmail Integration Actions
 * Server-side Gmail operations using Nango
 */

import { executeIntegrationRequest } from '../nango-server';
import type {
  GmailSendEmailParams,
  GmailSendEmailResult,
  GmailReceiveEmailsParams,
  GmailReceiveEmailsResult,
  GmailMessage,
  GmailListMessagesResponse,
} from './gmail-types';

/**
 * Send an email via Gmail
 */
export async function sendGmailEmail(
  connectionId: string,
  params: GmailSendEmailParams,
): Promise<{ success: true; data: GmailSendEmailResult } | { success: false; error: string }> {
  try {
    // Build email in RFC 2822 format
    const emailLines = [];

    if (params.from) {
      emailLines.push(`From: ${params.from}`);
    }
    emailLines.push(`To: ${params.to}`);
    if (params.cc) {
      emailLines.push(`Cc: ${params.cc}`);
    }
    if (params.bcc) {
      emailLines.push(`Bcc: ${params.bcc}`);
    }
    emailLines.push(`Subject: ${params.subject}`);
    emailLines.push(`Content-Type: text/html; charset=utf-8`);
    emailLines.push('');
    emailLines.push(params.body);

    const email = emailLines.join('\r\n');

    // Base64url encode the email
    const encodedEmail = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send via Gmail API
    const result = await executeIntegrationRequest<{ id: string; threadId: string }>({
      integrationId: 'gmail',
      connectionId,
      endpoint: '/gmail/v1/users/me/messages/send',
      method: 'POST',
      data: {
        raw: encodedEmail,
      },
    });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: {
        messageId: result.data.id,
        threadId: result.data.threadId,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    console.error('Failed to send Gmail email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Receive/fetch emails from Gmail
 */
export async function receiveGmailEmails(
  connectionId: string,
  params: GmailReceiveEmailsParams = {},
): Promise<{ success: true; data: GmailReceiveEmailsResult } | { success: false; error: string }> {
  try {
    const { query = 'is:unread', maxResults = 10, labelIds } = params;

    // List messages
    const listParams: Record<string, string> = {
      q: query,
      maxResults: maxResults.toString(),
    };

    if (labelIds && labelIds.length > 0) {
      listParams.labelIds = labelIds.join(',');
    }

    const listResult = await executeIntegrationRequest<GmailListMessagesResponse>({
      integrationId: 'gmail',
      connectionId,
      endpoint: '/gmail/v1/users/me/messages',
      method: 'GET',
      params: listParams,
    });

    if (!listResult.success) {
      return listResult;
    }

    if (!listResult.data.messages || listResult.data.messages.length === 0) {
      return {
        success: true,
        data: {
          emails: [],
          count: 0,
        },
      };
    }

    // Fetch full message details for each email
    const emails = await Promise.all(
      listResult.data.messages.map(async (msg) => {
        const detailResult = await executeIntegrationRequest<GmailMessage>({
          integrationId: 'gmail',
          connectionId,
          endpoint: `/gmail/v1/users/me/messages/${msg.id}`,
          method: 'GET',
        });

        if (!detailResult.success) {
          return null;
        }

        const message = detailResult.data;

        // Parse headers
        const headers = message.payload.headers.reduce(
          (acc, header) => {
            acc[header.name.toLowerCase()] = header.value;
            return acc;
          },
          {} as Record<string, string>,
        );

        // Get body (simplified - may need enhancement for multipart emails)
        let body = '';
        if (message.payload.body.data) {
          body = Buffer.from(message.payload.body.data, 'base64').toString('utf-8');
        } else if (message.payload.parts) {
          const textPart = message.payload.parts.find(
            (part) => part.mimeType === 'text/plain' || part.mimeType === 'text/html',
          );
          if (textPart?.body.data) {
            body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
          }
        }

        return {
          id: message.id,
          threadId: message.threadId,
          from: headers.from || '',
          to: headers.to?.split(',').map((e) => e.trim()) || [],
          subject: headers.subject || '(No subject)',
          snippet: message.snippet,
          body,
          date: new Date(parseInt(message.internalDate)).toISOString(),
          labels: message.labelIds || [],
          isUnread: message.labelIds?.includes('UNREAD') || false,
        };
      }),
    );

    // Filter out any failed fetches
    const validEmails = emails.filter((email) => email !== null);

    return {
      success: true,
      data: {
        emails: validEmails,
        count: validEmails.length,
        nextPageToken: listResult.data.nextPageToken,
      },
    };
  } catch (error) {
    console.error('Failed to receive Gmail emails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to receive emails',
    };
  }
}

/**
 * Mark email as read
 */
export async function markGmailEmailAsRead(
  connectionId: string,
  messageId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await executeIntegrationRequest({
      integrationId: 'gmail',
      connectionId,
      endpoint: `/gmail/v1/users/me/messages/${messageId}/modify`,
      method: 'POST',
      data: {
        removeLabelIds: ['UNREAD'],
      },
    });

    return result;
  } catch (error) {
    console.error('Failed to mark email as read:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark as read',
    };
  }
}
