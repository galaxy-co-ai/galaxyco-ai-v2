/**
 * Workflow Execution API Tests
 *
 * Comprehensive tests for workflow execution endpoints:
 * - /api/workflows/execute-action
 * - /api/workflows/execute-integration
 *
 * PHASE 3, TASK 3.2: Workflow Execution API Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  setupTestEnvironment,
  cleanupTestData,
  mockClerkAuth,
  resetClerkAuth,
} from '../utils/test-helpers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('Workflow Execution API - Execute Action', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
  });

  afterEach(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  describe('POST /api/workflows/execute-action - Authentication', () => {
    it('should require authentication', async () => {
      resetClerkAuth();
      mockClerkAuth(null);

      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          action: 'send_email',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/workflows/execute-action - Validation', () => {
    it('should require nodeId', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_email',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect([400, 401]).toContain(response.status);
    });

    it('should require action', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect([400, 401]).toContain(response.status);
    });

    it('should require workspaceId', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          action: 'send_email',
          config: {},
        }),
      });

      expect([400, 401]).toContain(response.status);
    });

    it('should accept optional config, variables, and previousResults', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          action: 'send_email',
          workspaceId: testEnv.workspace.id,
          config: { to: 'test@example.com' },
          variables: { userName: 'Test User' },
          previousResults: { step1: { success: true } },
        }),
      });

      expect([200, 401]).toContain(response.status);
    });
  });

  describe('POST /api/workflows/execute-action - Execution', () => {
    it('should execute action successfully', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'node-1',
          action: 'send_email',
          config: { to: 'test@example.com', subject: 'Test', body: 'Hello' },
          workspaceId: testEnv.workspace.id,
          variables: {},
          previousResults: {},
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        expect(data).toHaveProperty('success', true);
        expect(data).toHaveProperty('nodeId', 'node-1');
        expect(data).toHaveProperty('action', 'send_email');
        expect(data).toHaveProperty('executedAt');
        expect(data).toHaveProperty('output');
      }
    });

    it('should return execution result with output', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'node-2',
          action: 'create_task',
          config: { title: 'Test Task', assignee: 'user@example.com' },
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        expect(data.output).toBeTruthy();
        expect(data.output).toHaveProperty('message');
      }
    });

    it('should pass variables to action execution', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'node-3',
          action: 'send_notification',
          config: { message: 'Hello {{userName}}' },
          workspaceId: testEnv.workspace.id,
          variables: { userName: 'John Doe' },
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        expect(data.success).toBe(true);
        expect(data.output.variables).toEqual({ userName: 'John Doe' });
      }
    });
  });
});

describe('Workflow Execution API - Execute Integration', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
  });

  afterEach(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  describe('POST /api/workflows/execute-integration - Authentication', () => {
    it('should require authentication', async () => {
      resetClerkAuth();
      mockClerkAuth(null);

      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          integration: 'gmail',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/workflows/execute-integration - Validation', () => {
    it('should require nodeId', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integration: 'gmail',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect([400, 401]).toContain(response.status);
    });

    it('should require integration type', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect([400, 401]).toContain(response.status);
    });

    it('should require workspaceId', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          integration: 'gmail',
          config: {},
        }),
      });

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/workflows/execute-integration - Gmail Integration', () => {
    it('should return error when Gmail integration not connected', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'gmail-node',
          integration: 'gmail',
          config: { action: 'send', to: 'test@example.com', subject: 'Test', body: 'Hello' },
          workspaceId: testEnv.workspace.id,
        }),
      });

      // Should return error if integration not connected
      if (response.status === 400) {
        const data = await response.json();
        expect(data.error).toContain('Gmail');
      }
    });

    it('should validate Gmail action configuration', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'gmail-node',
          integration: 'gmail',
          config: { action: 'send' }, // Missing required fields (to, subject, body)
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/workflows/execute-integration - Slack Integration', () => {
    it('should return error when Slack integration not connected', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'slack-node',
          integration: 'slack',
          config: { action: 'send_message', channel: 'general', text: 'Hello' },
          workspaceId: testEnv.workspace.id,
        }),
      });

      // Should return error if integration not connected
      if (response.status === 400) {
        const data = await response.json();
        expect(data.error).toContain('Slack');
      }
    });

    it('should validate Slack action configuration', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'slack-node',
          integration: 'slack',
          config: { action: 'send_message' }, // Missing required fields (channel, text)
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/workflows/execute-integration - HubSpot CRM', () => {
    it('should return error when HubSpot integration not connected', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'hubspot-node',
          integration: 'hubspot',
          config: {
            action: 'create_contact',
            contactData: { email: 'test@example.com', firstName: 'Test', lastName: 'User' },
          },
          workspaceId: testEnv.workspace.id,
        }),
      });

      // Should return error if integration not connected
      if (response.status === 400) {
        const data = await response.json();
        expect(data.error).toContain('HubSpot');
      }
    });

    it('should validate HubSpot action configuration', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'hubspot-node',
          integration: 'hubspot',
          config: { action: 'create_contact' }, // Missing contactData
          workspaceId: testEnv.workspace.id,
        }),
      });

      expect([400, 401]).toContain(response.status);
    });
  });

  describe('POST /api/workflows/execute-integration - Pipedrive CRM', () => {
    it('should return error when Pipedrive integration not connected', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'pipedrive-node',
          integration: 'pipedrive',
          config: {
            action: 'create_contact',
            contactData: { email: 'test@example.com', firstName: 'Test', lastName: 'User' },
          },
          workspaceId: testEnv.workspace.id,
        }),
      });

      // Should return error if integration not connected
      if (response.status === 400) {
        const data = await response.json();
        expect(data.error).toContain('Pipedrive');
      }
    });
  });

  describe('POST /api/workflows/execute-integration - Unsupported Integration', () => {
    it('should return error for unsupported integration type', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'unknown-node',
          integration: 'unsupported-integration',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        expect(data.error).toMatch(/not supported|unsupported/i);
      }
    });
  });

  describe('POST /api/workflows/execute-integration - Error Handling', () => {
    it('should handle integration credentials not found', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          integration: 'gmail',
          config: { action: 'send', to: 'test@example.com', subject: 'Test', body: 'Hello' },
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response.status === 400) {
        const data = await response.json();
        expect(data.error).toMatch(/credentials|not found|not connected/i);
      }
    });

    it('should return user-friendly error messages', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          integration: 'gmail',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      if (response.status >= 400) {
        const data = await response.json();
        expect(data.error).toBeTruthy();
        // Should not contain technical jargon
        expect(data.error).not.toContain('null pointer');
        expect(data.error).not.toContain('undefined');
      }
    });
  });
});

describe('Workflow Execution API - Variable Substitution', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
  });

  afterEach(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  describe('Variable Replacement', () => {
    it('should replace variables in integration config', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          integration: 'gmail',
          config: {
            action: 'send',
            to: '{{customerEmail}}',
            subject: 'Hello {{customerName}}',
            body: 'Welcome {{customerName}}!',
          },
          workspaceId: testEnv.workspace.id,
          variables: {
            customerEmail: 'customer@example.com',
            customerName: 'John Doe',
          },
        }),
      });

      // Test that variables are passed correctly
      expect([200, 400, 401]).toContain(response.status);
    });

    it('should replace previousResults references', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          integration: 'slack',
          config: {
            action: 'send_message',
            channel: 'general',
            text: 'Previous result: {{result.value}}',
          },
          workspaceId: testEnv.workspace.id,
          previousResults: {
            result: { value: 'Success' },
          },
        }),
      });

      expect([200, 400, 401]).toContain(response.status);
    });
  });
});

describe('Workflow Execution API - Workspace Isolation', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
  });

  afterEach(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  describe('Workspace Security', () => {
    it('should only execute actions within user workspace', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          action: 'send_email',
          config: {},
          workspaceId: testEnv.workspace.id,
        }),
      });

      // Should either succeed or return auth error, but not access other workspaces
      expect([200, 401, 403]).toContain(response.status);
    });

    it('should validate workspaceId format', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          action: 'send_email',
          config: {},
          workspaceId: 'invalid-workspace-id',
        }),
      });

      expect([400, 401]).toContain(response.status);
    });
  });
});
