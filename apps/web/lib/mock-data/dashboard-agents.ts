export interface AgentStats {
  executionsToday: number;
  successRate: number;
  lastRunAt: Date | null;
  avgResponseTime: number;
}

export interface Agent {
  id: string;
  name: string;
  icon: string;
  category: string;
  isActive: boolean;
  status: "active" | "paused" | "error";
  stats: AgentStats;
}

export const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Sales Qualifier",
    icon: "💼",
    category: "sales",
    isActive: true,
    status: "active",
    stats: {
      executionsToday: 142,
      successRate: 97,
      lastRunAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      avgResponseTime: 1.2,
    },
  },
  {
    id: "2",
    name: "Email Drafter",
    icon: "✉️",
    category: "marketing",
    isActive: true,
    status: "active",
    stats: {
      executionsToday: 89,
      successRate: 94,
      lastRunAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      avgResponseTime: 2.1,
    },
  },
  {
    id: "3",
    name: "Support Triager",
    icon: "🎧",
    category: "support",
    isActive: false,
    status: "paused",
    stats: {
      executionsToday: 0,
      successRate: 92,
      lastRunAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      avgResponseTime: 0.8,
    },
  },
  {
    id: "4",
    name: "Lead Scorer",
    icon: "🎯",
    category: "sales",
    isActive: true,
    status: "active",
    stats: {
      executionsToday: 67,
      successRate: 89,
      lastRunAt: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      avgResponseTime: 1.8,
    },
  },
  {
    id: "5",
    name: "Data Processor",
    icon: "⚙️",
    category: "operations",
    isActive: true,
    status: "error",
    stats: {
      executionsToday: 23,
      successRate: 76,
      lastRunAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      avgResponseTime: 3.2,
    },
  },
  {
    id: "6",
    name: "Content Generator",
    icon: "✨",
    category: "marketing",
    isActive: true,
    status: "active",
    stats: {
      executionsToday: 34,
      successRate: 91,
      lastRunAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      avgResponseTime: 4.1,
    },
  },
  {
    id: "7",
    name: "Code Reviewer",
    icon: "🔍",
    category: "engineering",
    isActive: false,
    status: "paused",
    stats: {
      executionsToday: 0,
      successRate: 88,
      lastRunAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      avgResponseTime: 5.3,
    },
  },
  {
    id: "8",
    name: "Invoice Processor",
    icon: "💰",
    category: "operations",
    isActive: true,
    status: "active",
    stats: {
      executionsToday: 156,
      successRate: 99,
      lastRunAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      avgResponseTime: 0.9,
    },
  },
];

export const mockDashboardStats = {
  totalAgents: mockAgents.length,
  activeAgents: mockAgents.filter((a) => a.isActive).length,
  totalExecutions: mockAgents.reduce(
    (sum, a) => sum + a.stats.executionsToday,
    0,
  ),
  successRate: Math.round(
    mockAgents.reduce((sum, a) => sum + a.stats.successRate, 0) /
      mockAgents.length,
  ),
  avgResponseTime:
    Math.round(
      (mockAgents.reduce((sum, a) => sum + a.stats.avgResponseTime, 0) /
        mockAgents.length) *
        10,
    ) / 10,
};

export interface ActivityItem {
  id: string;
  agentName: string;
  action: string;
  status: "success" | "warning" | "error";
  timestamp: Date;
}

export const mockRecentActivity: ActivityItem[] = [
  {
    id: "1",
    agentName: "Sales Qualifier",
    action: "Qualified lead from contact form",
    status: "success",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    agentName: "Email Drafter",
    action: "Sent follow-up to 5 prospects",
    status: "success",
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: "3",
    agentName: "Invoice Processor",
    action: "Processed 12 invoices",
    status: "success",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    id: "4",
    agentName: "Data Processor",
    action: "Rate limit exceeded",
    status: "warning",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "5",
    agentName: "Lead Scorer",
    action: "Scored 15 new leads",
    status: "success",
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
  },
];
