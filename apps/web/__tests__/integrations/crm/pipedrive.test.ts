/**
 * Pipedrive CRM Tests
 * Testing Pipedrive OAuth and API functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPipedriveAuthUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
} from '@/lib/integrations/crm/pipedrive/oauth';
import {
  createPipedrivePerson,
  updatePipedrivePerson,
  getPipedrivePerson,
  createPipedriveDeal,
  searchPipedrivePersons,
} from '@/lib/integrations/crm/pipedrive/api';
import type { CRMCredentials, Contact, Deal } from '@/lib/integrations/crm/types';

// Mock fetch
global.fetch = vi.fn();

const mockCredentials: CRMCredentials = {
  accessToken: 'mock_pipedrive_token',
  refreshToken: 'mock_refresh_token',
  expiresAt: Date.now() + 3600000,
};

describe('Pipedrive Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OAuth', () => {
    it('should generate valid authorization URL', () => {
      const authUrl = getPipedriveAuthUrl('test-state');

      expect(authUrl).toContain('https://oauth.pipedrive.com/oauth/authorize');
      expect(authUrl).toContain('state=test-state');
    });

    it('should exchange code for tokens', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'new_token',
          refresh_token: 'new_refresh',
          expires_in: 3600,
          api_domain: 'mycompany.pipedrive.com',
        }),
      });

      const result = await exchangeCodeForTokens('code');

      expect(result.accessToken).toBe('new_token');
      expect(result.apiKey).toBe('mycompany.pipedrive.com');
    });

    it('should refresh access token', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'refreshed_token',
          expires_in: 3600,
        }),
      });

      const result = await refreshAccessToken('refresh_token');

      expect(result.accessToken).toBe('refreshed_token');
    });
  });

  describe('Person Management', () => {
    it('should create person', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 123,
            name: 'John Doe',
            email: [{ value: 'john@example.com', primary: true }],
            add_time: '2025-11-02 00:00:00',
          },
        }),
      });

      const contact: Contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = await createPipedrivePerson(mockCredentials, contact);

      expect(result.id).toBe('123');
      expect(result.email).toBe('john@example.com');
    });

    it('should update person', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 123,
            name: 'John Updated',
            add_time: '2025-11-02 00:00:00',
          },
        }),
      });

      const result = await updatePipedrivePerson(mockCredentials, '123', {
        lastName: 'Updated',
      });

      expect(result.id).toBe('123');
    });

    it('should get person', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 123,
            name: 'John Doe',
            email: [{ value: 'john@example.com' }],
            add_time: '2025-11-02 00:00:00',
          },
        }),
      });

      const result = await getPipedrivePerson(mockCredentials, '123');

      expect(result.id).toBe('123');
      expect(result.firstName).toBe('John');
    });

    it('should search persons', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            items: [
              {
                item: {
                  id: 123,
                  name: 'John Doe',
                  emails: ['john@example.com'],
                  add_time: '2025-11-02 00:00:00',
                },
              },
            ],
          },
        }),
      });

      const results = await searchPipedrivePersons(mockCredentials, 'john');

      expect(results).toHaveLength(1);
      expect(results[0].email).toBe('john@example.com');
    });
  });

  describe('Deal Management', () => {
    it('should create deal', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 456,
            title: 'New Deal',
            value: '5000',
            currency: 'USD',
            add_time: '2025-11-02 00:00:00',
          },
        }),
      });

      const deal: Deal = {
        title: 'New Deal',
        value: 5000,
        currency: 'USD',
      };

      const result = await createPipedriveDeal(mockCredentials, deal);

      expect(result.id).toBe('456');
      expect(result.value).toBe(5000);
    });
  });
});
