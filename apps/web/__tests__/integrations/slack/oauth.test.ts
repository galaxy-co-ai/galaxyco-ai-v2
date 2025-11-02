/**
 * Slack OAuth Tests
 * Testing Slack OAuth flow and token management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSlackAuthUrl,
  exchangeCodeForTokens,
  validateSlackCredentials,
  getWorkspaceInfo,
} from '@/lib/integrations/slack/oauth';
import type { SlackCredentials } from '@/lib/integrations/slack/types';

// Mock fetch
global.fetch = vi.fn();

describe('Slack OAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSlackAuthUrl', () => {
    it('should generate valid authorization URL', () => {
      const authUrl = getSlackAuthUrl('test-state');

      expect(authUrl).toContain('https://slack.com/oauth/v2/authorize');
      expect(authUrl).toContain('state=test-state');
      expect(authUrl).toContain('client_id=');
    });

    it('should include all required scopes', () => {
      const authUrl = getSlackAuthUrl();

      expect(authUrl).toContain('channels:read');
      expect(authUrl).toContain('chat:write');
      expect(authUrl).toContain('channels:history');
    });
  });

  describe('exchangeCodeForTokens', () => {
    it('should exchange code for tokens successfully', async () => {
      const mockResponse = {
        ok: true,
        access_token: 'xoxb-mock-token',
        token_type: 'Bearer',
        scope: 'channels:read,chat:write',
        bot_user_id: 'U12345',
        app_id: 'A12345',
        team: {
          id: 'T12345',
          name: 'Test Workspace',
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await exchangeCodeForTokens('mock_code');

      expect(result).toEqual({
        accessToken: 'xoxb-mock-token',
        tokenType: 'Bearer',
        scope: 'channels:read,chat:write',
        botUserId: 'U12345',
        appId: 'A12345',
        teamId: 'T12345',
        teamName: 'Test Workspace',
      });
    });

    it('should throw error on failed token exchange', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: false,
          error: 'invalid_code',
        }),
      });

      await expect(exchangeCodeForTokens('invalid_code')).rejects.toThrow('invalid_code');
    });
  });

  describe('validateSlackCredentials', () => {
    it('should validate active credentials', async () => {
      const credentials: SlackCredentials = {
        accessToken: 'xoxb-valid-token',
        tokenType: 'Bearer',
        scope: 'chat:write',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true }),
      });

      const isValid = await validateSlackCredentials(credentials);

      expect(isValid).toBe(true);
    });

    it('should return false for invalid credentials', async () => {
      const credentials: SlackCredentials = {
        accessToken: 'xoxb-invalid-token',
        tokenType: 'Bearer',
        scope: 'chat:write',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      const isValid = await validateSlackCredentials(credentials);

      expect(isValid).toBe(false);
    });
  });

  describe('getWorkspaceInfo', () => {
    it('should fetch workspace information', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          team: 'Test Workspace',
          user: 'U12345',
        }),
      });

      const info = await getWorkspaceInfo('xoxb-token');

      expect(info).toEqual({
        team: 'Test Workspace',
        user: 'U12345',
      });
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: false,
          error: 'invalid_auth',
        }),
      });

      await expect(getWorkspaceInfo('invalid_token')).rejects.toThrow('invalid_auth');
    });
  });
});
