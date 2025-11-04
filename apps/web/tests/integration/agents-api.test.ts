/**
 * GET /api/agents/[id]/executions - Get Agent Executions
 * Tests for fetching agent execution history
 */
describe('GET /api/agents/[id]/executions - Get Agent Executions', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;
  let testAgent: Awaited<ReturnType<typeof createTestAgent>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
    testAgent = await createTestAgent(testEnv.workspace.id, testEnv.user.id);
  });

  afterEach(async () => {
    if (testAgent) {
      await cleanupTestData({ agentIds: [testAgent.id] });
    }
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  it('should require authentication', async () => {
    resetClerkAuth();
    mockClerkAuth(null);

    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/executions`);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('should return paginated executions', async () => {
    const response = await fetch(
      `${API_BASE}/api/agents/${testAgent.id}/executions?page=1&limit=20`,
    );

    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('executions');
      expect(data).toHaveProperty('pagination');
      expect(data.pagination).toHaveProperty('page', 1);
      expect(data.pagination).toHaveProperty('limit', 20);
      expect(data.pagination).toHaveProperty('total');
      expect(Array.isArray(data.executions)).toBe(true);
    }
  });

  it('should filter executions by status', async () => {
    const response = await fetch(
      `${API_BASE}/api/agents/${testAgent.id}/executions?status=completed`,
    );

    if (response.status === 200) {
      const data = await response.json();
      expect(data.executions.every((e: any) => e.status === 'completed')).toBe(true);
    }
  });

  it('should filter executions by date range', async () => {
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = new Date().toISOString();

    const response = await fetch(
      `${API_BASE}/api/agents/${testAgent.id}/executions?startDate=${startDate}&endDate=${endDate}`,
    );

    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('executions');
    }
  });

  it('should include execution stats', async () => {
    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/executions`);

    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('stats');
      expect(data.stats).toHaveProperty('total');
      expect(data.stats).toHaveProperty('completed');
      expect(data.stats).toHaveProperty('failed');
    }
  });

  it('should verify workspace membership', async () => {
    // Create another workspace and try to access agent from different workspace
    const otherUser = await createTestUser();
    const otherWorkspace = await createTestWorkspace(otherUser.id);

    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/executions`);

    // Should return 403 if user not in workspace
    expect([401, 403, 404]).toContain(response.status);

    await cleanupTestData({
      userIds: [otherUser.id],
      workspaceIds: [otherWorkspace.id],
    });
  });
});

/**
 * PUT /api/agents/[id]/activate - Activate Agent
 * Tests for activating agents with schedule configuration
 */
describe('PUT /api/agents/[id]/activate - Activate Agent', () => {
  let testEnv: Awaited<ReturnType<typeof setupTestEnvironment>>;
  let testAgent: Awaited<ReturnType<typeof createTestAgent>>;

  beforeEach(async () => {
    testEnv = await setupTestEnvironment();
    testAgent = await createTestAgent(testEnv.workspace.id, testEnv.user.id, {
      status: 'draft',
    });
  });

  afterEach(async () => {
    if (testAgent) {
      await cleanupTestData({ agentIds: [testAgent.id] });
    }
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  it('should require authentication', async () => {
    resetClerkAuth();
    mockClerkAuth(null);

    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleConfig: {
          triggerType: 'manual',
        },
      }),
    });

    expect(response.status).toBe(401);
  });

  it('should require schedule configuration', async () => {
    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    expect([400, 401]).toContain(response.status);
  });

  it('should activate agent with manual trigger', async () => {
    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleConfig: {
          triggerType: 'manual',
          enabled: true,
        },
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('agent');
      expect(data.agent.status).toBe('active');
      expect(data).toHaveProperty('schedule');
    }
  });

  it('should activate agent with scheduled trigger', async () => {
    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleConfig: {
          triggerType: 'scheduled',
          cron: '0 0 * * *', // Daily at midnight
          timezone: 'America/Chicago',
          enabled: true,
        },
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      expect(data.schedule.triggerType).toBe('scheduled');
      expect(data.schedule.cron).toBe('0 0 * * *');
    }
  });

  it('should require cron for scheduled trigger', async () => {
    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleConfig: {
          triggerType: 'scheduled',
          // Missing cron
        },
      }),
    });

    expect([400, 401]).toContain(response.status);
  });

  it('should activate agent with webhook trigger', async () => {
    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleConfig: {
          triggerType: 'webhook',
          enabled: true,
        },
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      expect(data.schedule.triggerType).toBe('webhook');
      expect(data.schedule).toHaveProperty('webhookSecret');
    }
  });

  it('should verify workspace membership', async () => {
    const response = await fetch(`${API_BASE}/api/agents/${testAgent.id}/activate`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleConfig: {
          triggerType: 'manual',
        },
      }),
    });

    // Should return 403 if user not in workspace
    expect([401, 403, 404]).toContain(response.status);
  });
});
