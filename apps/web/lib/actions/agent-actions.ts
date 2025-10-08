/**
 * Agent API Client Actions
 * Handles all API calls to the agents endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface CreateAgentPayload {
  name: string;
  description: string;
  type: 'scope' | 'call' | 'email' | 'note' | 'task' | 'roadmap' | 'content' | 'custom';
  trigger: 'webhook' | 'schedule' | 'manual' | 'event';
  aiProvider?: 'openai' | 'anthropic' | 'custom';
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  settings?: Record<string, any>;
  sourcePackId?: string;
}

interface UpdateAgentPayload extends Partial<CreateAgentPayload> {
  status?: 'draft' | 'active' | 'paused' | 'archived';
}

interface TestAgentPayload {
  inputs: Record<string, any>;
  mode?: 'mock' | 'live';
}

/**
 * Get auth headers (Clerk token + workspace ID)
 */
async function getAuthHeaders(workspaceId: string): Promise<HeadersInit> {
  // In a real app, get Clerk token from useAuth() hook
  // For now, we'll add placeholder
  const token = 'CLERK_TOKEN_HERE'; // TODO: Get from Clerk
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-workspace-id': workspaceId,
  };
}

/**
 * Create a new agent
 */
export async function createAgent(
  payload: CreateAgentPayload,
  workspaceId: string,
): Promise<any> {
  const headers = await getAuthHeaders(workspaceId);
  
  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create agent');
  }

  return response.json();
}

/**
 * List agents with optional filters
 */
export async function listAgents(
  workspaceId: string,
  filters?: {
    status?: 'draft' | 'active' | 'paused' | 'archived';
    search?: string;
    limit?: number;
    offset?: number;
  },
): Promise<any> {
  const headers = await getAuthHeaders(workspaceId);
  
  const queryParams = new URLSearchParams();
  if (filters?.status) queryParams.set('status', filters.status);
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.limit) queryParams.set('limit', filters.limit.toString());
  if (filters?.offset) queryParams.set('offset', filters.offset.toString());

  const url = `${API_BASE_URL}/agents${queryParams.toString() ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }

  return response.json();
}

/**
 * Get single agent by ID
 */
export async function getAgent(
  agentId: string,
  workspaceId: string,
): Promise<any> {
  const headers = await getAuthHeaders(workspaceId);
  
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to fetch agent');
  }

  return response.json();
}

/**
 * Update an existing agent
 */
export async function updateAgent(
  agentId: string,
  payload: UpdateAgentPayload,
  workspaceId: string,
): Promise<any> {
  const headers = await getAuthHeaders(workspaceId);
  
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update agent');
  }

  return response.json();
}

/**
 * Delete (archive) an agent
 */
export async function deleteAgent(
  agentId: string,
  workspaceId: string,
): Promise<any> {
  const headers = await getAuthHeaders(workspaceId);
  
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error('Failed to delete agent');
  }

  return response.json();
}

/**
 * Test agent execution (mock mode)
 */
export async function testAgent(
  agentId: string,
  payload: TestAgentPayload,
  workspaceId: string,
): Promise<any> {
  const headers = await getAuthHeaders(workspaceId);
  
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}/test`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to test agent');
  }

  return response.json();
}
