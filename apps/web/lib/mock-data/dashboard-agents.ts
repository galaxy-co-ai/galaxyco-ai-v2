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
  status: 'active' | 'paused' | 'error';
  stats: AgentStats;
}

// Empty by default - will be populated from database/API
export const mockAgents: Agent[] = [];

// Empty stats - will be populated from database/API
export const mockDashboardStats = {
  totalAgents: 0,
  activeAgents: 0,
  totalExecutions: 0,
  successRate: 0,
  avgResponseTime: 0,
};

export interface ActivityItem {
  id: string;
  agentName: string;
  action: string;
  status: 'success' | 'warning' | 'error';
  timestamp: Date;
}

// Empty by default - will be populated from database/API
export const mockRecentActivity: ActivityItem[] = [];
