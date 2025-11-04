/**
 * Slack Integration Tests
 * Comprehensive tests for Slack messaging functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  postSlackMessage,
  readSlackChannels,
  getSlackChannelByName,
  postSlackMessageByChannelName,
} from '@/lib/integrations/slack/slack-actions';
import * as nangoServer from '@/lib/integrations/nango-server';

// Mock the Nango server
vi.mock('@/lib/integrations/nango-server', () => ({
  executeIntegrationRequest: vi.fn(),
}));

describe('Slack Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('postSlackMessage', () => {
    it('should post message successfully', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: true,
          channel: 'C123456',
          ts: '1234567890.123456',
          message: {
            text: 'Test message',
            username: 'Bot',
            bot_id: 'B123',
            type: 'message',
            ts: '1234567890.123456',
          },
        },
      });

      const result = await postSlackMessage('user-123', {
        channel: '#general',
        text: 'Test message',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.channel).toBe('C123456');
        expect(result.data.messageId).toBeDefined();
      }
    });

    it('should handle thread replies', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: true,
          channel: 'C123456',
          ts: '1234567890.123456',
          message: {
            text: 'Thread reply',
            username: 'Bot',
            bot_id: 'B123',
            type: 'message',
            ts: '1234567890.123456',
          },
        },
      });

      const result = await postSlackMessage('user-123', {
        channel: '#general',
        text: 'Thread reply',
        thread_ts: '1234567890.000000',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.threadId).toBe('1234567890.000000');
      }

      const mockCall = vi.mocked(nangoServer.executeIntegrationRequest).mock.calls[0][0];
      expect(mockCall.data.thread_ts).toBe('1234567890.000000');
    });

    it('should handle custom username and emoji', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: true,
          channel: 'C123456',
          ts: '1234567890.123456',
          message: {
            text: 'Custom message',
            username: 'CustomBot',
            bot_id: 'B123',
            type: 'message',
            ts: '1234567890.123456',
          },
        },
      });

      await postSlackMessage('user-123', {
        channel: '#general',
        text: 'Custom message',
        username: 'CustomBot',
        icon_emoji: ':robot_face:',
      });

      const mockCall = vi.mocked(nangoServer.executeIntegrationRequest).mock.calls[0][0];
      expect(mockCall.data.username).toBe('CustomBot');
      expect(mockCall.data.icon_emoji).toBe(':robot_face:');
    });

    it('should handle Slack API errors', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: false,
        },
      });

      const result = await postSlackMessage('user-123', {
        channel: '#general',
        text: 'Test',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Slack API returned an error');
      }
    });
  });

  describe('readSlackChannels', () => {
    it('should read channels successfully', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: true,
          channels: [
            {
              id: 'C123',
              name: 'general',
              is_channel: true,
              is_group: false,
              is_im: false,
              is_member: true,
              is_private: false,
              num_members: 50,
            },
            {
              id: 'C456',
              name: 'random',
              is_channel: true,
              is_group: false,
              is_im: false,
              is_member: false,
              is_private: false,
              num_members: 30,
            },
          ],
        },
      });

      const result = await readSlackChannels('user-123');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.channels).toHaveLength(2);
        expect(result.data.channels[0].name).toBe('general');
        expect(result.data.channels[0].numMembers).toBe(50);
      }
    });

    it('should filter by channel types', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: { ok: true, channels: [] },
      });

      await readSlackChannels('user-123', {
        types: 'public_channel',
        limit: 50,
      });

      const mockCall = vi.mocked(nangoServer.executeIntegrationRequest).mock.calls[0][0];
      expect(mockCall.params?.types).toBe('public_channel');
      expect(mockCall.params?.limit).toBe('50');
    });

    it('should handle pagination with cursor', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: true,
          channels: [],
          response_metadata: {
            next_cursor: 'next_page_cursor',
          },
        },
      });

      const result = await readSlackChannels('user-123', {
        cursor: 'previous_cursor',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.nextCursor).toBe('next_page_cursor');
      }
    });
  });

  describe('getSlackChannelByName', () => {
    it('should find channel by name', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: true,
          channels: [
            {
              id: 'C123',
              name: 'general',
              is_channel: true,
              is_group: false,
              is_im: false,
              is_member: true,
              is_private: false,
            },
          ],
        },
      });

      const result = await getSlackChannelByName('user-123', 'general');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.channelId).toBe('C123');
      }
    });

    it('should handle channel name with # prefix', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: true,
          channels: [
            {
              id: 'C123',
              name: 'general',
              is_channel: true,
              is_group: false,
              is_im: false,
              is_member: true,
              is_private: false,
            },
          ],
        },
      });

      const result = await getSlackChannelByName('user-123', '#general');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.channelId).toBe('C123');
      }
    });

    it('should handle channel not found', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          ok: true,
          channels: [],
        },
      });

      const result = await getSlackChannelByName('user-123', 'nonexistent');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('postSlackMessageByChannelName', () => {
    it('should post message using channel name', async () => {
      // Mock channel lookup
      vi.mocked(nangoServer.executeIntegrationRequest)
        .mockResolvedValueOnce({
          success: true,
          data: {
            ok: true,
            channels: [
              {
                id: 'C123',
                name: 'general',
                is_channel: true,
                is_group: false,
                is_im: false,
                is_member: true,
                is_private: false,
              },
            ],
          },
        })
        // Mock post message
        .mockResolvedValueOnce({
          success: true,
          data: {
            ok: true,
            channel: 'C123',
            ts: '1234567890.123456',
            message: {
              text: 'Test',
              username: 'Bot',
              bot_id: 'B123',
              type: 'message',
              ts: '1234567890.123456',
            },
          },
        });

      const result = await postSlackMessageByChannelName('user-123', '#general', 'Test message');

      expect(result.success).toBe(true);
    });
  });
});
