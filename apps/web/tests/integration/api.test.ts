/**
 * API Integration Tests
 *
 * Tests all API routes for the Visual Flow Builder
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// Base URL for API
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('API Integration Tests', () => {
  describe('POST /api/ai/parse-workflow', () => {
    it('should parse simple workflow successfully', async () => {
      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 'Email new leads every Monday',
          workspaceId: 'test-workspace',
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.flow).toBeDefined();
      expect(data.flow.nodes).toBeInstanceOf(Array);
      expect(data.flow.edges).toBeInstanceOf(Array);
      expect(data.flow.nodes.length).toBeGreaterThanOrEqual(3); // start, action, end
    });

    it('should parse complex workflow with conditions', async () => {
      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input:
            'When a lead submits form, check if premium. If yes, notify sales. Otherwise, send welcome email.',
          workspaceId: 'test-workspace',
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.flow.nodes).toBeInstanceOf(Array);

      // Should have condition node
      const hasCondition = data.flow.nodes.some((node: any) => node.type === 'condition');
      expect(hasCondition).toBe(true);
    });

    it('should detect integrations in workflow', async () => {
      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 'Check Gmail for new messages and post summary to Slack',
          workspaceId: 'test-workspace',
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();

      // Should have integration nodes
      const integrationNodes = data.flow.nodes.filter((node: any) => node.type === 'integration');
      expect(integrationNodes.length).toBeGreaterThan(0);
    });

    it('should reject empty input', async () => {
      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: '',
          workspaceId: 'test-workspace',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should reject missing workspaceId', async () => {
      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 'Test workflow',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return proper error structure on failure', async () => {
      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: '', // Invalid
          workspaceId: 'test',
        }),
      });

      const data = await response.json();
      expect(data.error).toBeDefined();
    });
  });

  describe('POST /api/workflows/execute-action', () => {
    it('should execute action successfully', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          action: 'Send Email',
          config: { to: 'test@example.com' },
          workspaceId: 'test-workspace',
          variables: {},
          previousResults: {},
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.nodeId).toBe('test-node');
      expect(data.executedAt).toBeDefined();
    });

    it('should validate required fields', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-node',
          // Missing required fields
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/workflows/execute-integration', () => {
    it('should execute integration successfully', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'test-integration',
          integration: 'gmail',
          config: { action: 'send_email' },
          workspaceId: 'test-workspace',
          variables: {},
          previousResults: {},
        }),
      });

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.integration).toBe('gmail');
    });

    it('should validate required fields', async () => {
      const response = await fetch(`${API_BASE}/api/workflows/execute-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Missing required fields
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('API Performance', () => {
    it('should parse workflow in under 10 seconds', async () => {
      const startTime = Date.now();

      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 'Email new leads every Monday',
          workspaceId: 'test-workspace',
        }),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(10000); // 10 seconds
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        fetch(`${API_BASE}/api/ai/parse-workflow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: `Test workflow ${i}`,
            workspaceId: 'test-workspace',
          }),
        }),
      );

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('API Security', () => {
    it('should require authentication for protected routes', async () => {
      // Test without auth headers
      const response = await fetch(`${API_BASE}/api/workflows`, {
        method: 'GET',
      });

      // Should redirect to auth or return 401
      expect([401, 302, 307]).toContain(response.status);
    });

    it('should validate input with Zod schemas', async () => {
      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: 123, // Invalid type
          workspaceId: 'test',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should sanitize user input', async () => {
      const maliciousInput = '<script>alert("xss")</script>';

      const response = await fetch(`${API_BASE}/api/ai/parse-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: maliciousInput,
          workspaceId: 'test-workspace',
        }),
      });

      // Should handle gracefully without executing script
      expect([200, 400]).toContain(response.status);
    });
  });
});
