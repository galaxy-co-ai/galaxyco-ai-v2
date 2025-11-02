/**
 * HubSpot CRM Tests
 * Testing HubSpot OAuth and API functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getHubSpotAuthUrl,
  exchangeCodeForTokens,
  refreshAccessToken,
} from '@/lib/integrations/crm/hubspot/oauth';
import {
  createHubSpotContact,
  updateHubSpotContact,
  getHubSpotContact,
  createHubSpotDeal,
  searchHubSpotContacts,
} from '@/lib/integrations/crm/hubspot/api';
import type { CRMCredentials, Contact, Deal } from '@/lib/integrations/crm/types';

// Mock fetch
global.fetch = vi.fn();

const mockCredentials: CRMCredentials = {
  accessToken: 'mock_hubspot_token',
  refreshToken: 'mock_refresh_token',
  expiresAt: Date.now() + 3600000,
};

describe('HubSpot Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OAuth', () => {
    it('should generate valid authorization URL', () => {
      const authUrl = getHubSpotAuthUrl('test-state');

      expect(authUrl).toContain('https://app.hubspot.com/oauth/authorize');
      expect(authUrl).toContain('state=test-state');
      expect(authUrl).toContain('crm.objects.contacts');
    });

    it('should exchange code for tokens', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'new_token',
          refresh_token: 'new_refresh',
          expires_in: 3600,
          hub_id: '12345',
        }),
      });

      const result = await exchangeCodeForTokens('code');

      expect(result.accessToken).toBe('new_token');
      expect(result.hubId).toBe('12345');
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

  describe('Contact Management', () => {
    it('should create contact', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '123',
          properties: {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
          },
          createdAt: '2025-11-02T00:00:00Z',
        }),
      });

      const contact: Contact = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      const result = await createHubSpotContact(mockCredentials, contact);

      expect(result.id).toBe('123');
      expect(result.email).toBe('john@example.com');
    });

    it('should update contact', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '123',
          properties: {
            firstname: 'John',
            lastname: 'Updated',
            email: 'john@example.com',
          },
          createdAt: '2025-11-02T00:00:00Z',
        }),
      });

      const result = await updateHubSpotContact(mockCredentials, '123', {
        lastName: 'Updated',
      });

      expect(result.lastName).toBe('Updated');
    });

    it('should get contact', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '123',
          properties: {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john@example.com',
          },
          createdAt: '2025-11-02T00:00:00Z',
        }),
      });

      const result = await getHubSpotContact(mockCredentials, '123');

      expect(result.id).toBe('123');
    });

    it('should search contacts', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [
            {
              id: '123',
              properties: {
                firstname: 'John',
                lastname: 'Doe',
                email: 'john@example.com',
              },
              createdAt: '2025-11-02T00:00:00Z',
            },
          ],
        }),
      });

      const results = await searchHubSpotContacts(mockCredentials, 'john@example.com');

      expect(results).toHaveLength(1);
      expect(results[0].email).toBe('john@example.com');
    });
  });

  describe('Deal Management', () => {
    it('should create deal', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '456',
          properties: {
            dealname: 'New Deal',
            amount: '5000',
            dealstage: 'prospecting',
          },
          createdAt: '2025-11-02T00:00:00Z',
        }),
      });

      const deal: Deal = {
        title: 'New Deal',
        value: 5000,
        currency: 'USD',
      };

      const result = await createHubSpotDeal(mockCredentials, deal);

      expect(result.id).toBe('456');
      expect(result.value).toBe(5000);
    });
  });
});
