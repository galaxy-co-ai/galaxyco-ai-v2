/**
 * End-to-End Integration Flow Tests
 * Tests the complete integration flow from connection to execution
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { executeIntegrationAction } from '@/lib/integrations/integration-executor';
import * as gmailActions from '@/lib/integrations/gmail/gmail-actions';
import * as slackActions from '@/lib/integrations/slack/slack-actions';
import * as hubspotActions from '@/lib/integrations/hubspot/hubspot-actions';

// Mock all integration actions
vi.mock('@/lib/integrations/gmail/gmail-actions');
vi.mock('@/lib/integrations/slack/slack-actions');
vi.mock('@/lib/integrations/hubspot/hubspot-actions');

describe('End-to-End Integration Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Gmail → Slack Workflow', () => {
    it('should execute workflow: Receive Gmail → Post to Slack', async () => {
      // Step 1: Receive Gmail emails
      vi.mocked(gmailActions.receiveGmailEmails).mockResolvedValue({
        success: true,
        data: {
          emails: [
            {
              id: 'msg_1',
              threadId: 'thread_1',
              from: 'important@example.com',
              to: ['me@example.com'],
              subject: 'Urgent: New Lead',
              snippet: 'We have a new lead...',
              date: '2024-01-01T00:00:00Z',
              labels: ['INBOX', 'UNREAD'],
              isUnread: true,
            },
          ],
          count: 1,
        },
      });

      const gmailResult = await executeIntegrationAction({
        integrationId: 'gmail',
        action: 'receive_email',
        connectionId: 'user-123',
        parameters: {
          query: 'from:important@example.com is:unread',
          maxResults: 1,
        },
      });

      expect(gmailResult.success).toBe(true);

      // Step 2: Extract email info and post to Slack
      if (gmailResult.success && gmailResult.data) {
        const email = gmailResult.data.emails[0];

        vi.mocked(slackActions.postSlackMessage).mockResolvedValue({
          success: true,
          data: {
            messageId: 'msg_slack_123',
            timestamp: '1234567890.123456',
            channel: 'C123',
          },
        });

        const slackResult = await executeIntegrationAction({
          integrationId: 'slack',
          action: 'post_message',
          connectionId: 'user-123',
          parameters: {
            channel: '#leads',
            text: `New email from ${email.from}: ${email.subject}`,
          },
        });

        expect(slackResult.success).toBe(true);
        expect(vi.mocked(slackActions.postSlackMessage)).toHaveBeenCalledWith('user-123', {
          channel: '#leads',
          text: expect.stringContaining('important@example.com'),
        });
      }
    });
  });

  describe('Gmail → HubSpot Workflow', () => {
    it('should execute workflow: Receive Gmail → Create HubSpot Contact', async () => {
      // Step 1: Receive Gmail email
      vi.mocked(gmailActions.receiveGmailEmails).mockResolvedValue({
        success: true,
        data: {
          emails: [
            {
              id: 'msg_1',
              threadId: 'thread_1',
              from: 'newlead@company.com',
              to: ['sales@example.com'],
              subject: 'Inquiry about your product',
              snippet: 'I am interested...',
              date: '2024-01-01T00:00:00Z',
              labels: ['INBOX'],
              isUnread: true,
            },
          ],
          count: 1,
        },
      });

      const gmailResult = await executeIntegrationAction({
        integrationId: 'gmail',
        action: 'receive_email',
        connectionId: 'user-123',
        parameters: {
          query: 'is:unread',
        },
      });

      expect(gmailResult.success).toBe(true);

      // Step 2: Extract sender email and create HubSpot contact
      if (gmailResult.success && gmailResult.data) {
        const email = gmailResult.data.emails[0];

        vi.mocked(hubspotActions.createHubSpotContact).mockResolvedValue({
          success: true,
          data: {
            contactId: 'contact_123',
            createdAt: '2024-01-01T00:00:00Z',
            properties: {},
          },
        });

        const hubspotResult = await executeIntegrationAction({
          integrationId: 'hubspot',
          action: 'create_contact',
          connectionId: 'user-123',
          parameters: {
            email: email.from,
            firstname: 'Unknown',
            lastname: 'Lead',
          },
        });

        expect(hubspotResult.success).toBe(true);
        expect(vi.mocked(hubspotActions.createHubSpotContact)).toHaveBeenCalledWith(
          'user-123',
          expect.objectContaining({
            email: 'newlead@company.com',
          }),
        );
      }
    });
  });

  describe('Multi-Step Complex Workflow', () => {
    it('should execute: Gmail → HubSpot → Slack → Gmail Reply', async () => {
      // Step 1: Receive Gmail
      vi.mocked(gmailActions.receiveGmailEmails).mockResolvedValue({
        success: true,
        data: {
          emails: [
            {
              id: 'msg_1',
              threadId: 'thread_1',
              from: 'prospect@example.com',
              to: ['sales@mycompany.com'],
              subject: 'Product inquiry',
              snippet: 'Interested in pricing',
              date: '2024-01-01T00:00:00Z',
              labels: ['INBOX', 'UNREAD'],
              isUnread: true,
            },
          ],
          count: 1,
        },
      });

      const step1 = await executeIntegrationAction({
        integrationId: 'gmail',
        action: 'receive_email',
        connectionId: 'user-123',
        parameters: { query: 'is:unread' },
      });

      expect(step1.success).toBe(true);

      // Step 2: Create HubSpot contact
      vi.mocked(hubspotActions.createHubSpotContact).mockResolvedValue({
        success: true,
        data: {
          contactId: 'contact_789',
          createdAt: '2024-01-01T00:00:00Z',
          properties: {},
        },
      });

      const step2 = await executeIntegrationAction({
        integrationId: 'hubspot',
        action: 'create_contact',
        connectionId: 'user-123',
        parameters: {
          email: 'prospect@example.com',
        },
      });

      expect(step2.success).toBe(true);

      // Step 3: Notify team via Slack
      vi.mocked(slackActions.postSlackMessage).mockResolvedValue({
        success: true,
        data: {
          messageId: 'slack_msg',
          timestamp: '123456',
          channel: 'C123',
        },
      });

      const step3 = await executeIntegrationAction({
        integrationId: 'slack',
        action: 'post_message',
        connectionId: 'user-123',
        parameters: {
          channel: '#sales',
          text: 'New lead captured: prospect@example.com',
        },
      });

      expect(step3.success).toBe(true);

      // Step 4: Send automated Gmail reply
      vi.mocked(gmailActions.sendGmailEmail).mockResolvedValue({
        success: true,
        data: {
          messageId: 'reply_msg',
          timestamp: '2024-01-01T00:05:00Z',
        },
      });

      const step4 = await executeIntegrationAction({
        integrationId: 'gmail',
        action: 'send_email',
        connectionId: 'user-123',
        parameters: {
          to: 'prospect@example.com',
          subject: 'Re: Product inquiry',
          body: 'Thank you for your interest! Our sales team will contact you shortly.',
        },
      });

      expect(step4.success).toBe(true);

      // Verify all steps completed
      expect(step1.success && step2.success && step3.success && step4.success).toBe(true);
    });
  });

  describe('Error Handling in Workflows', () => {
    it('should handle partial workflow failures gracefully', async () => {
      // Step 1 succeeds
      vi.mocked(gmailActions.receiveGmailEmails).mockResolvedValue({
        success: true,
        data: { emails: [{ id: 'msg_1' } as any], count: 1 },
      });

      const step1 = await executeIntegrationAction({
        integrationId: 'gmail',
        action: 'receive_email',
        connectionId: 'user-123',
        parameters: {},
      });

      expect(step1.success).toBe(true);

      // Step 2 fails
      vi.mocked(slackActions.postSlackMessage).mockResolvedValue({
        success: false,
        error: 'Slack channel not found',
      });

      const step2 = await executeIntegrationAction({
        integrationId: 'slack',
        action: 'post_message',
        connectionId: 'user-123',
        parameters: {
          channel: '#nonexistent',
          text: 'Test',
        },
      });

      expect(step2.success).toBe(false);
      if (!step2.success) {
        expect(step2.error).toBe('Slack channel not found');
      }

      // Workflow should continue or handle error
      // (This is up to workflow executor logic)
    });
  });

  describe('Performance Benchmarks', () => {
    it('should execute actions within reasonable time', async () => {
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
          body: 'Test',
        },
      });

      // Should execute in < 100ms (mocked)
      expect(result.executionTime).toBeLessThan(100);
    });
  });
});
