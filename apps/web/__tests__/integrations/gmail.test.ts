/**
 * Gmail Integration Tests
 * Comprehensive tests for Gmail send/receive functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sendGmailEmail,
  receiveGmailEmails,
  markGmailEmailAsRead,
} from '@/lib/integrations/gmail/gmail-actions';
import * as nangoServer from '@/lib/integrations/nango-server';

// Mock the Nango server
vi.mock('@/lib/integrations/nango-server', () => ({
  executeIntegrationRequest: vi.fn(),
}));

describe('Gmail Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendGmailEmail', () => {
    it('should send email successfully', async () => {
      // Mock successful response
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          id: 'msg_123',
          threadId: 'thread_456',
        },
      });

      const result = await sendGmailEmail('user-123', {
        to: 'test@example.com',
        subject: 'Test Email',
        body: 'This is a test email',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.messageId).toBe('msg_123');
        expect(result.data.timestamp).toBeDefined();
      }
    });

    it('should handle send email errors', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: false,
        error: 'Gmail API error',
      });

      const result = await sendGmailEmail('user-123', {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Gmail API error');
      }
    });

    it('should include CC and BCC recipients', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: { id: 'msg_123', threadId: 'thread_456' },
      });

      await sendGmailEmail('user-123', {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test',
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
      });

      const mockCall = vi.mocked(nangoServer.executeIntegrationRequest).mock.calls[0][0];
      const rawEmail = Buffer.from(mockCall.data.raw, 'base64').toString('utf-8');

      expect(rawEmail).toContain('Cc: cc@example.com');
      expect(rawEmail).toContain('Bcc: bcc@example.com');
    });

    it('should encode email in base64url format', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: { id: 'msg_123', threadId: 'thread_456' },
      });

      await sendGmailEmail('user-123', {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test',
      });

      const mockCall = vi.mocked(nangoServer.executeIntegrationRequest).mock.calls[0][0];
      const raw = mockCall.data.raw;

      // Check base64url encoding (no + or / or =)
      expect(raw).not.toContain('+');
      expect(raw).not.toContain('/');
      expect(raw).not.toContain('=');
    });
  });

  describe('receiveGmailEmails', () => {
    it('should receive emails successfully', async () => {
      // Mock list messages response
      vi.mocked(nangoServer.executeIntegrationRequest)
        .mockResolvedValueOnce({
          success: true,
          data: {
            messages: [{ id: 'msg_1', threadId: 'thread_1' }],
            resultSizeEstimate: 1,
          },
        })
        // Mock message detail response
        .mockResolvedValueOnce({
          success: true,
          data: {
            id: 'msg_1',
            threadId: 'thread_1',
            snippet: 'Test email preview',
            internalDate: '1704067200000',
            labelIds: ['INBOX', 'UNREAD'],
            payload: {
              headers: [
                { name: 'From', value: 'sender@example.com' },
                { name: 'To', value: 'recipient@example.com' },
                { name: 'Subject', value: 'Test Subject' },
              ],
              body: {
                data: Buffer.from('Test email body').toString('base64'),
              },
            },
          },
        });

      const result = await receiveGmailEmails('user-123', {
        query: 'is:unread',
        maxResults: 10,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.emails).toHaveLength(1);
        expect(result.data.emails[0].subject).toBe('Test Subject');
        expect(result.data.emails[0].isUnread).toBe(true);
      }
    });

    it('should handle empty inbox', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          messages: [],
          resultSizeEstimate: 0,
        },
      });

      const result = await receiveGmailEmails('user-123');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.emails).toHaveLength(0);
        expect(result.data.count).toBe(0);
      }
    });

    it('should use custom search query', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: { messages: [], resultSizeEstimate: 0 },
      });

      await receiveGmailEmails('user-123', {
        query: 'from:important@example.com',
        maxResults: 5,
      });

      const mockCall = vi.mocked(nangoServer.executeIntegrationRequest).mock.calls[0][0];
      expect(mockCall.params?.q).toBe('from:important@example.com');
      expect(mockCall.params?.maxResults).toBe('5');
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: false,
        error: 'Gmail API rate limit exceeded',
      });

      const result = await receiveGmailEmails('user-123');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Gmail API rate limit exceeded');
      }
    });
  });

  describe('markGmailEmailAsRead', () => {
    it('should mark email as read', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {},
      });

      const result = await markGmailEmailAsRead('user-123', 'msg_123');

      expect(result.success).toBe(true);

      const mockCall = vi.mocked(nangoServer.executeIntegrationRequest).mock.calls[0][0];
      expect(mockCall.endpoint).toContain('msg_123/modify');
      expect(mockCall.data.removeLabelIds).toContain('UNREAD');
    });

    it('should handle errors when marking as read', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: false,
        error: 'Message not found',
      });

      const result = await markGmailEmailAsRead('user-123', 'invalid_id');

      expect(result.success).toBe(false);
    });
  });
});
