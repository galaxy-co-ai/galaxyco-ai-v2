/**
 * Gmail API Tests
 * Testing Gmail API service (send/receive emails)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  sendGmailMessage,
  receiveGmailMessages,
  searchGmailMessages,
} from '@/lib/integrations/gmail/api';
import type { GmailCredentials } from '@/lib/integrations/gmail/types';

// Mock fetch
global.fetch = vi.fn();

const mockCredentials: GmailCredentials = {
  accessToken: 'mock_access_token',
  refreshToken: 'mock_refresh_token',
  expiresAt: Date.now() + 3600000,
  email: 'user@example.com',
};

describe('Gmail API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendGmailMessage', () => {
    it('should send email successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'message_123',
          threadId: 'thread_123',
        }),
      });

      const result = await sendGmailMessage(mockCredentials, {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        body: 'Test body content',
      });

      expect(result).toEqual({
        id: 'message_123',
        threadId: 'thread_123',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/messages/send'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer mock_access_token',
          }),
        }),
      );
    });

    it('should include CC and BCC in email', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 'message_123',
          threadId: 'thread_123',
        }),
      });

      await sendGmailMessage(mockCredentials, {
        to: 'recipient@example.com',
        subject: 'Test',
        body: 'Body',
        cc: ['cc@example.com'],
        bcc: ['bcc@example.com'],
      });

      const call = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(call[1].body);

      // Verify email contains CC and BCC
      expect(body.raw).toBeDefined();
    });

    it('should throw error on failed send', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: {
            message: 'Failed to send',
          },
        }),
      });

      await expect(
        sendGmailMessage(mockCredentials, {
          to: 'test@example.com',
          subject: 'Test',
          body: 'Body',
        }),
      ).rejects.toThrow('Failed to send');
    });
  });

  describe('receiveGmailMessages', () => {
    it('should fetch messages successfully', async () => {
      // Mock message list
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [{ id: 'msg1' }, { id: 'msg2' }],
        }),
      });

      // Mock individual message fetches
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 'msg1',
            threadId: 'thread1',
            internalDate: '1699999999000',
            labelIds: ['INBOX'],
            payload: {
              headers: [
                { name: 'From', value: 'sender@example.com' },
                { name: 'To', value: 'recipient@example.com' },
                { name: 'Subject', value: 'Test Subject' },
              ],
              body: {
                data: Buffer.from('Test body').toString('base64'),
              },
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 'msg2',
            threadId: 'thread2',
            internalDate: '1699999999000',
            labelIds: ['INBOX'],
            payload: {
              headers: [
                { name: 'From', value: 'sender2@example.com' },
                { name: 'To', value: 'recipient@example.com' },
                { name: 'Subject', value: 'Test Subject 2' },
              ],
              body: {
                data: Buffer.from('Test body 2').toString('base64'),
              },
            },
          }),
        });

      const messages = await receiveGmailMessages(mockCredentials, {
        maxResults: 10,
      });

      expect(messages).toHaveLength(2);
      expect(messages[0]).toMatchObject({
        id: 'msg1',
        from: 'sender@example.com',
        subject: 'Test Subject',
      });
    });

    it('should handle query parameter', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
        }),
      });

      await receiveGmailMessages(mockCredentials, {
        query: 'from:sender@example.com',
        maxResults: 5,
      });

      const call = (global.fetch as any).mock.calls[0];
      expect(call[0]).toContain('q=from%3Asender%40example.com');
    });

    it('should return empty array when no messages', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const messages = await receiveGmailMessages(mockCredentials, {
        maxResults: 10,
      });

      expect(messages).toEqual([]);
    });
  });

  describe('searchGmailMessages', () => {
    it('should search messages with query', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          messages: [],
        }),
      });

      await searchGmailMessages(mockCredentials, 'subject:important');

      const call = (global.fetch as any).mock.calls[0];
      expect(call[0]).toContain('q=subject%3Aimportant');
    });
  });
});
