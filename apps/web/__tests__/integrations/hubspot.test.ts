/**
 * HubSpot Integration Tests
 * Comprehensive tests for HubSpot CRM functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createHubSpotContact,
  updateHubSpotContact,
  getHubSpotContact,
  createHubSpotDeal,
  updateHubSpotDeal,
  getHubSpotDeal,
  searchHubSpotContactByEmail,
} from '@/lib/integrations/hubspot/hubspot-actions';
import * as nangoServer from '@/lib/integrations/nango-server';

// Mock the Nango server
vi.mock('@/lib/integrations/nango-server', () => ({
  executeIntegrationRequest: vi.fn(),
}));

describe('HubSpot Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createHubSpotContact', () => {
    it('should create contact successfully', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          id: 'contact_123',
          properties: {
            email: 'test@example.com',
            firstname: 'John',
            lastname: 'Doe',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      });

      const result = await createHubSpotContact('user-123', {
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.contactId).toBe('contact_123');
        expect(result.data.properties.email).toBe('test@example.com');
      }
    });

    it('should handle optional fields', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          id: 'contact_123',
          properties: {
            email: 'test@example.com',
            company: 'Acme Corp',
            phone: '+1234567890',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      });

      const result = await createHubSpotContact('user-123', {
        email: 'test@example.com',
        company: 'Acme Corp',
        phone: '+1234567890',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.properties.company).toBe('Acme Corp');
        expect(result.data.properties.phone).toBe('+1234567890');
      }
    });

    it('should handle creation errors', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: false,
        error: 'Contact already exists',
      });

      const result = await createHubSpotContact('user-123', {
        email: 'existing@example.com',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('Contact already exists');
      }
    });
  });

  describe('updateHubSpotContact', () => {
    it('should update contact successfully', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          id: 'contact_123',
          properties: {
            email: 'updated@example.com',
            firstname: 'Jane',
          },
          updatedAt: '2024-01-02T00:00:00Z',
        },
      });

      const result = await updateHubSpotContact('user-123', {
        contactId: 'contact_123',
        properties: {
          email: 'updated@example.com',
          firstname: 'Jane',
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.contactId).toBe('contact_123');
        expect(result.data.updatedAt).toBeDefined();
      }
    });
  });

  describe('getHubSpotContact', () => {
    it('should retrieve contact by ID', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          id: 'contact_123',
          properties: {
            email: 'test@example.com',
            firstname: 'John',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      });

      const result = await getHubSpotContact('user-123', 'contact_123');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.contactId).toBe('contact_123');
      }
    });
  });

  describe('createHubSpotDeal', () => {
    it('should create deal successfully', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          id: 'deal_123',
          properties: {
            dealname: 'Big Sale',
            amount: '50000',
            dealstage: 'closedwon',
          },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      });

      const result = await createHubSpotDeal('user-123', {
        dealname: 'Big Sale',
        amount: 50000,
        dealstage: 'closedwon',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dealId).toBe('deal_123');
        expect(result.data.properties.dealname).toBe('Big Sale');
      }
    });

    it('should handle optional deal fields', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          id: 'deal_123',
          properties: { dealname: 'Simple Deal' },
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      });

      const result = await createHubSpotDeal('user-123', {
        dealname: 'Simple Deal',
      });

      expect(result.success).toBe(true);
    });
  });

  describe('updateHubSpotDeal', () => {
    it('should update deal successfully', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          id: 'deal_123',
          properties: {
            amount: '75000',
            dealstage: 'closedwon',
          },
          updatedAt: '2024-01-02T00:00:00Z',
        },
      });

      const result = await updateHubSpotDeal('user-123', {
        dealId: 'deal_123',
        properties: {
          amount: '75000',
          dealstage: 'closedwon',
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dealId).toBe('deal_123');
      }
    });
  });

  describe('searchHubSpotContactByEmail', () => {
    it('should find contact by email', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          results: [
            {
              id: 'contact_123',
              properties: {
                email: 'search@example.com',
                firstname: 'Search',
              },
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
            },
          ],
        },
      });

      const result = await searchHubSpotContactByEmail('user-123', 'search@example.com');

      expect(result.success).toBe(true);
      if (result.success && result.data) {
        expect(result.data.contactId).toBe('contact_123');
        expect(result.data.properties.email).toBe('search@example.com');
      }
    });

    it('should return null when contact not found', async () => {
      vi.mocked(nangoServer.executeIntegrationRequest).mockResolvedValue({
        success: true,
        data: {
          results: [],
        },
      });

      const result = await searchHubSpotContactByEmail('user-123', 'notfound@example.com');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });
  });
});
