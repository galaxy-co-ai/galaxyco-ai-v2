/**
 * Mock Agent System for UX Testing
 *
 * This provides a simple in-memory agent system that doesn't require
 * the external NestJS API, making the UX much smoother for testing.
 */

export interface MockAgent {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "draft" | "active" | "paused" | "archived";
  type:
    | "scope"
    | "email"
    | "call"
    | "note"
    | "task"
    | "roadmap"
    | "content"
    | "custom";
  trigger: "webhook" | "schedule" | "manual" | "event";
  aiProvider: "openai" | "anthropic" | "custom";
  model: string;
  createdAt: string;
  updatedAt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

// Default mock agents for immediate testing
const defaultMockAgents: MockAgent[] = [
  {
    id: "agent-1",
    name: "Email Analyzer",
    description:
      "Parse emails and extract action items, priorities, and key information",
    icon: "📧",
    status: "active",
    type: "scope",
    trigger: "manual",
    aiProvider: "openai",
    model: "gpt-4o-mini",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    systemPrompt:
      "You are an email analysis expert. Extract action items, priorities, and sentiment from emails.",
    temperature: 0.7,
    maxTokens: 500,
  },
  {
    id: "agent-2",
    name: "Meeting Summary",
    description: "Summarize meeting notes and generate actionable next steps",
    icon: "📝",
    status: "active",
    type: "note",
    trigger: "manual",
    aiProvider: "openai",
    model: "gpt-4o-mini",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    systemPrompt:
      "You are a meeting summary specialist. Create clear summaries and extract action items.",
    temperature: 0.5,
    maxTokens: 750,
  },
  {
    id: "agent-3",
    name: "Content Creator",
    description: "Generate marketing content and social media posts",
    icon: "✨",
    status: "draft",
    type: "content",
    trigger: "manual",
    aiProvider: "openai",
    model: "gpt-4o-mini",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    systemPrompt:
      "You are a creative content writer. Generate engaging marketing content.",
    temperature: 0.8,
    maxTokens: 1000,
  },
];

class MockAgentService {
  private agents: MockAgent[] = [];
  private initialized = false;

  constructor() {
    // Don't initialize in constructor - wait for client-side call
  }

  private initialize() {
    if (this.initialized) return;

    // Only initialize on client side
    if (typeof window === "undefined") {
      this.agents = defaultMockAgents;
      this.initialized = true;
      return;
    }

    try {
      const stored = localStorage.getItem("mockAgents");
      if (stored) {
        this.agents = JSON.parse(stored);
      } else {
        this.agents = defaultMockAgents;
        this.persist();
      }
    } catch (error) {
      console.error("Failed to load mock agents from localStorage:", error);
      this.agents = defaultMockAgents;
    }

    this.initialized = true;
  }

  private persist() {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("mockAgents", JSON.stringify(this.agents));
    } catch (error) {
      console.error("Failed to persist mock agents to localStorage:", error);
    }
  }

  /**
   * List all agents with optional filtering
   */
  listAgents(filters?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    this.initialize();
    let filtered = [...this.agents];

    // Status filter
    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((agent) => agent.status === filters.status);
    }

    // Search filter
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (agent) =>
          agent.name.toLowerCase().includes(search) ||
          agent.description.toLowerCase().includes(search),
      );
    }

    // Pagination
    const limit = filters?.limit || filtered.length;
    const offset = filters?.offset || 0;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      agents: paginated,
      total: filtered.length,
      limit,
      offset,
    };
  }

  /**
   * Get single agent by ID
   */
  getAgent(id: string): MockAgent | null {
    this.initialize();
    return this.agents.find((agent) => agent.id === id) || null;
  }

  /**
   * Create a new agent
   */
  createAgent(data: Partial<MockAgent>): MockAgent {
    this.initialize();
    const newAgent: MockAgent = {
      id: `agent-${Date.now()}`,
      name: data.name || "Unnamed Agent",
      description: data.description || "",
      icon: data.icon || "🤖",
      status: "draft",
      type: data.type || "custom",
      trigger: data.trigger || "manual",
      aiProvider: data.aiProvider || "openai",
      model: data.model || "gpt-4o-mini",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      systemPrompt: data.systemPrompt,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
    };

    this.agents.unshift(newAgent);
    this.persist();
    return newAgent;
  }

  /**
   * Update existing agent
   */
  updateAgent(id: string, data: Partial<MockAgent>): MockAgent | null {
    this.initialize();
    const index = this.agents.findIndex((agent) => agent.id === id);
    if (index === -1) return null;

    this.agents[index] = {
      ...this.agents[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.persist();
    return this.agents[index];
  }

  /**
   * Delete (archive) agent
   */
  deleteAgent(id: string): boolean {
    this.initialize();
    const index = this.agents.findIndex((agent) => agent.id === id);
    if (index === -1) return false;

    this.agents[index].status = "archived";
    this.agents[index].updatedAt = new Date().toISOString();

    this.persist();
    return true;
  }

  /**
   * Reset to default agents (for testing)
   */
  resetToDefaults() {
    this.initialized = false; // Force re-initialization
    this.agents = [...defaultMockAgents]; // Create new array
    this.initialized = true;
    this.persist();
  }
}

// Singleton instance
let mockAgentService: MockAgentService | null = null;

export function getMockAgentService(): MockAgentService {
  if (!mockAgentService) {
    mockAgentService = new MockAgentService();
  }
  return mockAgentService;
}

// Export for easy access
export const mockAgents = {
  list: (filters?: any) => getMockAgentService().listAgents(filters),
  get: (id: string) => getMockAgentService().getAgent(id),
  create: (data: Partial<MockAgent>) => getMockAgentService().createAgent(data),
  update: (id: string, data: Partial<MockAgent>) =>
    getMockAgentService().updateAgent(id, data),
  delete: (id: string) => getMockAgentService().deleteAgent(id),
  resetToDefaults: () => getMockAgentService().resetToDefaults(),
};
