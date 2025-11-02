/**
 * Gmail OAuth Tests
 * Testing Gmail OAuth flow and token management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getGmailAuthUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
  validateGmailCredentials,
  getGmailUserEmail,
} from '@/lib/integrations/gmail/oauth';
import type { GmailCredentials } from '@/lib/integrations/gmail/types';

// Mock fetch
global.fetch = vi.fn();

describe('Gmail OAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getGmailAuthUrl', () => {
    it('should generate valid authorization URL', () => {
      const authUrl = getGmailAuthUrl('test-state');

      expect(authUrl).toContain('https://accounts.google.com/o/oauth2/v2/auth');
      expect(authUrl).toContain('state=test-state');
      expect(authUrl).toContain('response_type=code');
      expect(authUrl).toContain('access_type=offline');
    });

    it('should include all required scopes', () => {
      const authUrl = getGmailAuthUrl();

      expect(authUrl).toContain('gmail.send');
      expect(authUrl).toContain('gmail.readonly');
      expect(authUrl).toContain('gmail.modify');
    });
  });

  describe('exchangeCodeForTokens', () => {
    it('should exchange code for tokens successfully', async () => {
      const mockResponse = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await exchangeCodeForTokens('mock_code');

      expect(result).toEqual({
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        expiresAt: expect.any(Number),
        email: '',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://oauth2.googleapis.com/token',
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('should throw error on failed token exchange', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'invalid_grant',
          error_description: 'Invalid authorization code',
        }),
      });

      await expect(exchangeCodeForTokens('invalid_code')).rejects.toThrow(
        'Invalid authorization code',
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token successfully', async () => {
      const mockResponse = {
        access_token: 'new_access_token',
        expires_in: 3600,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await refreshAccessToken('mock_refresh_token');

      expect(result).toEqual({
        accessToken: 'new_access_token',
        refreshToken: 'mock_refresh_token',
        expiresAt: expect.any(Number),
        email: '',
      });
    });

    it('should throw error on failed refresh', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'invalid_grant',
        }),
      });

      await expect(refreshAccessToken('invalid_refresh_token')).rejects.toThrow();
    });
  });

  describe('getGmailUserEmail', () => {
    it('should fetch user email successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          emailAddress: 'user@example.com',
        }),
      });

      const email = await getGmailUserEmail('mock_access_token');

      expect(email).toBe('user@example.com');
    });

    it('should throw error on failed fetch', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getGmailUserEmail('invalid_token')).rejects.toThrow();
    });
  });

  describe('validateGmailCredentials', () => {
    it('should return false for expired credentials', async () => {
      const expiredCredentials: GmailCredentials = {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: Date.now() - 1000,
        email: 'user@example.com',
      };

      const isValid = await validateGmailCredentials(expiredCredentials);

      expect(isValid).toBe(false);
    });

    it('should validate active credentials', async () => {
      const activeCredentials: GmailCredentials = {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresAt: Date.now() + 3600000,
        email: 'user@example.com',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          emailAddress: 'user@example.com',
        }),
      });

      const isValid = await validateGmailCredentials(activeCredentials);

      expect(isValid).toBe(true);
    });
  });
});
