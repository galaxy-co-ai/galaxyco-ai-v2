/**
 * Integration Executor Tests
 * Tests for the unified integration action executor
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  executeIntegrationAction,
  validateIntegrationParameters,
} from '@/lib/integrations/integration-executor';
import * as gmailActions from '@/lib/integrations/gmail/gmail-actions';
import * as slackActions from '@/lib/integrations/slack/slack-actions';
import * as hubspotActions from '@/lib/integrations/hubspot/hubspot-actions';

// Mock integration action modules
vi.mock('@/lib/integrations/gmail/gmail-actions');
vi.mock('@/lib/integrations/slack/slack-actions');
vi.mock('@/lib/integrations/hubspot/hubspot-actions');

describe('Integration Executor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('executeIntegrationAction', () => {
    it('should execute Gmail send email action', async () => {
      vi.mocked(gmailActions.sendGmailEmail).mockResolvedValue({
        success: true,
        data: {
          messageId: 'msg_123',
          timestamp: '2024-01-01T00:00:00Z',
        },
      });

      const result = await executeIntegrationAction({
        integrationId: 'gmail',
        action: 'send_email',
        connectionId: 'user-123',
        parameters: {
          to: 'test@example.com',
          subject: 'Test',
          body: 'Test email',
        },
      });

      expect(result.success).toBe(true);
      expect(result.executionTime).toBeDefined();
      expect(vi.mocked(gmailActions.sendGmailEmail)).toHaveBeenCalledWith('user-123', {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test email',
        cc: undefined,
        bcc: undefined,
      });
    });

    it('should execute Slack post message action', async () => {
      vi.mocked(slackActions.postSlackMessage).mockResolvedValue({
        success: true,
        data: {
          messageId: 'msg_123',
          timestamp: '1234567890.123456',
          channel: 'C123',
        },
      });

      const result = await executeIntegrationAction({
        integrationId: 'slack',
        action: 'post_message',
        connectionId: 'user-123',
        parameters: {
          channel: '#general',
          text: 'Hello Slack!',
        },
      });

      expect(result.success).toBe(true);
      expect(vi.mocked(slackActions.postSlackMessage)).toHaveBeenCalled();
    });

    it('should execute HubSpot create contact action', async () => {
      vi.mocked(hubspotActions.createHubSpotContact).mockResolvedValue({
        success: true,
        data: {
          contactId: 'contact_123',
          createdAt: '2024-01-01T00:00:00Z',
          properties: {},
        },
      });

      const result = await executeIntegrationAction({
        integrationId: 'hubspot',
        action: 'create_contact',
        connectionId: 'user-123',
        parameters: {
          email: 'contact@example.com',
          firstname: 'Jane',
          lastname: 'Smith',
        },
      });

      expect(result.success).toBe(true);
      expect(vi.mocked(hubspotActions.createHubSpotContact)).toHaveBeenCalled();
    });

    it('should handle unknown integration', async () => {
      const result = await executeIntegrationAction({
        integrationId: 'unknown' as any,
        action: 'test' as any,
        connectionId: 'user-123',
        parameters: {},
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Unknown integration');
      }
    });

    it('should measure execution time', async () => {
      vi.mocked(gmailActions.sendGmailEmail).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  success: true,
                  data: { messageId: 'msg_123', timestamp: '2024-01-01T00:00:00Z' },
                }),
              100,
            );
          }),
      );

      const result = await executeIntegrationAction({
        integrationId: 'gmail',
        action: 'send_email',
        connectionId: 'user-123',
        parameters: {
          to: 'test@example.com',
          subject: 'Test',
          body: 'Test',
        },
      });

      expect(result.executionTime).toBeGreaterThanOrEqual(100);
    });

    it('should handle action errors gracefully', async () => {
      vi.mocked(gmailActions.sendGmailEmail).mockResolvedValue({
        success: false,
        error: 'Gmail API error',
      });

      const result = await executeIntegrationAction({
        integrationId: 'gmail',
        action: 'send_email',
        connectionId: 'user-123',
        parameters: {
          to: 'test@example.com',
          subject: 'Test',
          body: 'Test',
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Gmail API error');
      }
    });
  });

  describe('validateIntegrationParameters', () => {
    it('should validate required fields for send_email', () => {
      const validation = validateIntegrationParameters('gmail', 'send_email', {
        to: 'test@example.com',
        subject: 'Test',
        body: 'Test email',
      });

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const validation = validateIntegrationParameters('gmail', 'send_email', {
        to: 'test@example.com',
        // Missing subject and body
      });

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Missing required field: subject');
      expect(validation.errors).toContain('Missing required field: body');
    });

    it('should validate Slack post_message parameters', () => {
      const validation = validateIntegrationParameters('slack', 'post_message', {
        channel: '#general',
        text: 'Hello!',
      });

      expect(validation.valid).toBe(true);
    });

    it('should validate HubSpot create_contact parameters', () => {
      const validation = validateIntegrationParameters('hubspot', 'create_contact', {
        email: 'test@example.com',
      });

      expect(validation.valid).toBe(true);
    });

    it('should validate HubSpot create_deal parameters', () => {
      const validation = validateIntegrationParameters('hubspot', 'create_deal', {
        dealname: 'Big Sale',
      });

      expect(validation.valid).toBe(true);
    });

    it('should handle unknown actions gracefully', () => {
      const validation = validateIntegrationParameters('gmail', 'unknown_action' as any, {});

      // Unknown actions should pass validation (no required fields)
      expect(validation.valid).toBe(true);
    });
  });
});
