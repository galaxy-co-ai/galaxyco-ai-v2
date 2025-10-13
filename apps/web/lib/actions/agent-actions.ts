/**
 * Agent API Client Actions
 * Handles all API calls to the agents endpoints
 * 
 * Now using Next.js API routes (/api/agents) instead of external NestJS backend
 */

const API_BASE_URL = "/api"; // Use Next.js API routes

interface CreateAgentPayload {
  name: string;
  description: string;
  type:
    | "scope"
    | "call"
    | "email"
    | "note"
    | "task"
    | "roadmap"
    | "content"
    | "custom";
  trigger: "webhook" | "schedule" | "manual" | "event";
  aiProvider?: "openai" | "anthropic" | "custom";
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  knowledgeBase?: {
    enabled: boolean;
    scope?: "all" | "collections";
    collectionIds?: string[];
    maxResults?: number;
  };
  inputs?: Record<string, any>;
  outputs?: Record<string, any>;
  settings?: Record<string, any>;
  sourcePackId?: string;
}

interface UpdateAgentPayload extends Partial<CreateAgentPayload> {
  status?: "draft" | "active" | "paused" | "archived";
}

interface TestAgentPayload {
  inputs: Record<string, any>;
  mode?: "mock" | "live";
}

/**
 * Get auth headers (Clerk token + workspace ID)
 * Note: These functions are called from client components with useWorkspaceAuth hook
 * 
 * For Next.js API routes, we don't need to pass Authorization header (Clerk handles it)
 * Just pass workspace ID for tenant isolation
 */
function buildHeaders(token: string, workspaceId: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-workspace-id": workspaceId,
  };
}

/**
 * Create a new agent
 */
export async function createAgent(
  payload: CreateAgentPayload,
  headers: HeadersInit,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/agents`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create agent");
  }

  return response.json();
}

/**
 * List agents with optional filters
 */
export async function listAgents(
  headers: HeadersInit,
  filters?: {
    status?: "draft" | "active" | "paused" | "archived";
    search?: string;
    limit?: number;
    offset?: number;
  },
): Promise<any> {
  const queryParams = new URLSearchParams();
  
  // Extract workspace ID from headers
  const workspaceId = (headers as Record<string, string>)["x-workspace-id"];
  if (workspaceId) {
    queryParams.set("workspaceId", workspaceId);
  }
  
  if (filters?.status) queryParams.set("status", filters.status);
  if (filters?.search) queryParams.set("search", filters.search);
  if (filters?.limit) queryParams.set("limit", filters.limit.toString());
  if (filters?.offset) queryParams.set("offset", filters.offset.toString());

  const url = `${API_BASE_URL}/agents${queryParams.toString() ? `?${queryParams}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include", // Include cookies for Clerk auth
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch agents");
  }

  return response.json();
}

/**
 * Get single agent by ID
 */
export async function getAgent(
  agentId: string,
  headers: HeadersInit,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: "GET",
    credentials: "include", // Include cookies for Clerk auth
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch agent");
  }

  return response.json();
}

/**
 * Update an existing agent
 */
export async function updateAgent(
  agentId: string,
  payload: UpdateAgentPayload,
  headers: HeadersInit,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for Clerk auth
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Failed to update agent");
  }

  return response.json();
}

/**
 * Delete (archive) an agent
 */
export async function deleteAgent(
  agentId: string,
  headers: HeadersInit,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
    method: "DELETE",
    credentials: "include", // Include cookies for Clerk auth
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete agent");
  }

  return response.json();
}

/**
 * Test agent execution (mock mode)
 */
export async function testAgent(
  agentId: string,
  payload: TestAgentPayload,
  headers: HeadersInit,
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/agents/${agentId}/test`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to test agent");
  }

  return response.json();
}

/**
 * Execute agent with live AI (Phase 9)
 * Uses Next.js API route with access to AI providers
 */
export async function executeAgentLive(
  agentId: string,
  inputs: Record<string, any>,
): Promise<any> {
  const response = await fetch(`/api/agents/${agentId}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs, mode: "live" }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Failed to execute agent");
  }

  return response.json();
}

/**
 * Execute agent with mock responses
 * Uses Next.js API route without calling AI providers
 */
export async function executeAgentMock(
  agentId: string,
  inputs: Record<string, any>,
): Promise<any> {
  const response = await fetch(`/api/agents/${agentId}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs, mode: "mock" }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || error.message || "Failed to execute agent (mock)",
    );
  }

  return response.json();
}

/**
 * Unified execute agent function that handles both mock and live modes
 * Preferred method for TestPanel and other components
 */
export async function executeAgent(
  agentId: string,
  inputs: Record<string, any>,
  mode: "mock" | "live" = "live",
): Promise<any> {
  const response = await fetch(`/api/agents/${agentId}/execute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs, mode }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error || error.message || `Failed to execute agent (${mode})`,
    );
  }

  return response.json();
}
