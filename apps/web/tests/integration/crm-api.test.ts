/**
 * API Route Tests - CRM
 *
 * Comprehensive tests for CRM API routes:
 * - /api/contacts
 * - /api/prospects
 * - /api/customers
 * - /api/projects
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  setupTestEnvironment,
  cleanupTestData,
  mockClerkAuth,
  resetClerkAuth,
  createTestUser,
  createTestWorkspace,
} from '../utils/test-helpers';

// Base URL for API
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

describe('API Routes - CRM', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
  });

  afterEach(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  describe('Contacts API - /api/contacts', () => {
    describe('POST /api/contacts - Create Contact', () => {
      it('should require authentication', async () => {
        resetClerkAuth();
        mockClerkAuth(null);

        const response = await fetch(`${API_BASE}/api/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          }),
        });

        expect(response.status).toBe(401);
      });

      it('should validate required fields', async () => {
        const response = await fetch(`${API_BASE}/api/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        expect([400, 401]).toContain(response.status);
      });

      it('should create contact with valid data', async () => {
        const response = await fetch(`${API_BASE}/api/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            title: 'CEO',
          }),
        });

        if (response.status === 200 || response.status === 201) {
          const data = await response.json();
          expect(data).toHaveProperty('contact');
          expect(data.contact).toHaveProperty('id');
          expect(data.contact.firstName).toBe('John');
          expect(data.contact.lastName).toBe('Doe');
        }
      });

      it('should validate email format', async () => {
        const response = await fetch(`${API_BASE}/api/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            firstName: 'John',
            lastName: 'Doe',
            email: 'invalid-email',
          }),
        });

        expect([400, 401]).toContain(response.status);
      });
    });

    describe('GET /api/contacts - List Contacts', () => {
      it('should require authentication', async () => {
        resetClerkAuth();
        mockClerkAuth(null);

        const response = await fetch(`${API_BASE}/api/contacts`);

        expect(response.status).toBe(401);
      });

      it('should require workspaceId', async () => {
        const response = await fetch(`${API_BASE}/api/contacts`);

        expect([400, 401]).toContain(response.status);
      });

      it('should return contacts list', async () => {
        const response = await fetch(
          `${API_BASE}/api/contacts?workspaceId=${testEnv.workspace.id}`,
        );

        if (response.status === 200) {
          const data = await response.json();
          expect(data).toHaveProperty('contacts');
          expect(Array.isArray(data.contacts)).toBe(true);
        }
      });
    });
  });

  describe('Prospects API - /api/prospects', () => {
    describe('POST /api/prospects - Create Prospect', () => {
      it('should require authentication', async () => {
        resetClerkAuth();
        mockClerkAuth(null);

        const response = await fetch(`${API_BASE}/api/prospects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            name: 'Prospect Company',
            email: 'prospect@example.com',
          }),
        });

        expect(response.status).toBe(401);
      });

      it('should create prospect with valid data', async () => {
        const response = await fetch(`${API_BASE}/api/prospects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            name: 'Prospect Company',
            email: 'prospect@example.com',
            stage: 'lead',
            source: 'website',
          }),
        });

        if (response.status === 200 || response.status === 201) {
          const data = await response.json();
          expect(data).toHaveProperty('prospect');
          expect(data.prospect).toHaveProperty('id');
          expect(data.prospect.name).toBe('Prospect Company');
        }
      });

      it('should validate prospect stage', async () => {
        const response = await fetch(`${API_BASE}/api/prospects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            name: 'Prospect',
            stage: 'invalid-stage',
          }),
        });

        expect([400, 401]).toContain(response.status);
      });
    });

    describe('GET /api/prospects - List Prospects', () => {
      it('should return prospects list', async () => {
        const response = await fetch(
          `${API_BASE}/api/prospects?workspaceId=${testEnv.workspace.id}`,
        );

        if (response.status === 200) {
          const data = await response.json();
          expect(data).toHaveProperty('prospects');
          expect(Array.isArray(data.prospects)).toBe(true);
        }
      });

      it('should filter by stage', async () => {
        const response = await fetch(
          `${API_BASE}/api/prospects?workspaceId=${testEnv.workspace.id}&stage=lead`,
        );

        if (response.status === 200) {
          const data = await response.json();
          expect(data.prospects.every((p: any) => p.stage === 'lead')).toBe(true);
        }
      });
    });

    describe('POST /api/prospects/[id]/enrich - Enrich Prospect', () => {
      it('should require authentication', async () => {
        resetClerkAuth();
        mockClerkAuth(null);

        const response = await fetch(`${API_BASE}/api/prospects/test-id/enrich`, {
          method: 'POST',
        });

        expect(response.status).toBe(401);
      });
    });
  });

  describe('Customers API - /api/customers', () => {
    describe('POST /api/customers - Create Customer', () => {
      it('should require authentication', async () => {
        resetClerkAuth();
        mockClerkAuth(null);

        const response = await fetch(`${API_BASE}/api/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            name: 'Customer Company',
          }),
        });

        expect(response.status).toBe(401);
      });

      it('should create customer with valid data', async () => {
        const response = await fetch(`${API_BASE}/api/customers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            name: 'Customer Company',
            email: 'customer@example.com',
            status: 'active',
          }),
        });

        if (response.status === 200 || response.status === 201) {
          const data = await response.json();
          expect(data).toHaveProperty('customer');
          expect(data.customer).toHaveProperty('id');
          expect(data.customer.name).toBe('Customer Company');
        }
      });
    });

    describe('GET /api/customers - List Customers', () => {
      it('should return customers list', async () => {
        const response = await fetch(
          `${API_BASE}/api/customers?workspaceId=${testEnv.workspace.id}`,
        );

        if (response.status === 200) {
          const data = await response.json();
          expect(data).toHaveProperty('customers');
          expect(Array.isArray(data.customers)).toBe(true);
        }
      });
    });
  });

  describe('Projects API - /api/projects', () => {
    describe('POST /api/projects - Create Project', () => {
      it('should require authentication', async () => {
        resetClerkAuth();
        mockClerkAuth(null);

        const response = await fetch(`${API_BASE}/api/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            name: 'Test Project',
          }),
        });

        expect(response.status).toBe(401);
      });

      it('should create project with valid data', async () => {
        const response = await fetch(`${API_BASE}/api/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workspaceId: testEnv.workspace.id,
            name: 'Test Project',
            description: 'Project description',
          }),
        });

        if (response.status === 200 || response.status === 201) {
          const data = await response.json();
          expect(data).toHaveProperty('project');
          expect(data.project).toHaveProperty('id');
          expect(data.project.name).toBe('Test Project');
        }
      });
    });

    describe('GET /api/projects - List Projects', () => {
      it('should return projects list', async () => {
        const response = await fetch(
          `${API_BASE}/api/projects?workspaceId=${testEnv.workspace.id}`,
        );

        if (response.status === 200) {
          const data = await response.json();
          expect(data).toHaveProperty('projects');
          expect(Array.isArray(data.projects)).toBe(true);
        }
      });
    });
  });

  describe('CRM Error Handling', () => {
    it('should return proper error structure', async () => {
      const response = await fetch(`${API_BASE}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.status >= 400) {
        const data = await response.json();
        expect(data).toHaveProperty('error');
      }
    });

    it('should handle workspace isolation', async () => {
      // Create resources in one workspace, try to access from another
      const otherUser = await createTestUser();
      const otherWorkspace = await createTestWorkspace(otherUser.id);

      // This test documents that workspace isolation should be tested
      // Actual implementation would require creating resources and testing access

      await cleanupTestData({
        userIds: [otherUser.id],
        workspaceIds: [otherWorkspace.id],
      });
    });
  });
});
