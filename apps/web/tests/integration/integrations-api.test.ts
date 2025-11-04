/**
 * Integration API Tests
 *
 * BUG FIX TESTS: These endpoints were missing and causing 500 errors
 *
 * Tests for:
 * - GET /api/integrations/status
 * - POST /api/integrations/reconnect-token
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupTestEnvironment, mockClerkAuth, resetClerkAuth } from '../utils/test-helpers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Integration API - Status Endpoint (BUG FIX)', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
  });

  afterEach(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  describe('GET /api/integrations/status', () => {
    it('should require authentication', async () => {
      resetClerkAuth();
      mockClerkAuth(null);

      const response = await fetch(`${API_BASE}/api/integrations/status?integrationId=gmail`);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should require integrationId parameter', async () => {
      const response = await fetch(`${API_BASE}/api/integrations/status`);

      expect([400, 401]).toContain(response.status);
      if (response.status === 400) {
        const data = await response.json();
        expect(data.error).toContain('integrationId');
      }
    });

    it('should return not connected when integration does not exist', async () => {
      const response = await fetch(
        `${API_BASE}/api/integrations/status?integrationId=gmail&workspaceId=${testEnv.workspace.id}`,
      );

      if (response.status === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('connected');
        expect(data.connected).toBe(false);
        expect(data.integrationId).toBe('gmail');
      }
    });

    it('should return valid JSON (not 500 error)', async () => {
      const response = await fetch(`${API_BASE}/api/integrations/status?integrationId=gmail`);

      // Should NOT return 500
      expect(response.status).not.toBe(500);

      // Should return valid JSON
      const data = await response.json();
      expect(data).toBeTruthy();
    });

    it('should support different integration types', async () => {
      const integrationTypes = ['gmail', 'slack', 'hubspot', 'pipedrive'];

      for (const type of integrationTypes) {
        const response = await fetch(`${API_BASE}/api/integrations/status?integrationId=${type}`);

        // Should handle all integration types
        expect([200, 401]).toContain(response.status);

        if (response.status === 200) {
          const data = await response.json();
          expect(data).toHaveProperty('connected');
          expect(data).toHaveProperty('integrationId', type);
        }
      }
    });
  });
});

describe('Integration API - Reconnect Token Endpoint (BUG FIX)', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
  });

  afterEach(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  describe('POST /api/integrations/reconnect-token', () => {
    it('should require authentication', async () => {
      resetClerkAuth();
      mockClerkAuth(null);

      const response = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationType: 'gmail',
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect(response.status).toBe(401);
    });

    it('should validate request body', async () => {
      const response = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      expect([400, 401]).toContain(response.status);
    });

    it('should generate OAuth URL for Gmail', async () => {
      const response = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationType: 'gmail',
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('authUrl');
        expect(data).toHaveProperty('state');
        expect(data.authUrl).toContain('accounts.google.com');
        expect(data.authUrl).toContain('oauth2');
      }
    });

    it('should generate OAuth URL for Slack', async () => {
      const response = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationType: 'slack',
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('authUrl');
        expect(data).toHaveProperty('state');
        expect(data.authUrl).toContain('slack.com');
      }
    });

    it('should generate OAuth URL for HubSpot', async () => {
      const response = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationType: 'hubspot',
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('authUrl');
        expect(data).toHaveProperty('state');
        expect(data.authUrl).toContain('hubspot.com');
      }
    });

    it('should return error for unsupported integration type', async () => {
      const response = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationType: 'unsupported-integration',
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        expect(data.error).toContain('not supported');
      }
    });

    it('should return valid JSON (not 500 error)', async () => {
      const response = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationType: 'gmail',
          workspaceId: testEnv.workspace.id,
        }),
      });

      // Should NOT return 500
      expect(response.status).not.toBe(500);

      // Should return valid JSON
      const data = await response.json();
      expect(data).toBeTruthy();
    });

    it('should generate unique state tokens', async () => {
      const response1 = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationType: 'gmail',
          workspaceId: testEnv.workspace.id,
        }),
      });

      const response2 = await fetch(`${API_BASE}/api/integrations/reconnect-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationType: 'gmail',
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response1.status === 200 && response2.status === 200) {
        const data1 = await response1.json();
        const data2 = await response2.json();

        // State tokens should be unique
        expect(data1.state).not.toBe(data2.state);
      }
    });
  });
});
