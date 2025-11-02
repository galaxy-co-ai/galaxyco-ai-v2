/**
 * Agent Card Component (Kibo UI)
 * Uses AgentCardKibo for consistent Kibo UI styling
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AgentCardKibo } from '@/components/galaxy/AgentCardKibo';

interface AgentStats {
  executionsToday: number;
  successRate: number;
  lastRunAt: Date | null;
  avgResponseTime: number;
}

interface Agent {
  id: string;
  name: string;
  icon: string;
  category: string;
  isActive: boolean;
  status: 'active' | 'paused' | 'error';
  stats: AgentStats;
}

interface AgentCardProps {
  agent: Agent;
  onToggle: (agentId: string) => Promise<void>;
}

export default function AgentCard({ agent, onToggle }: AgentCardProps) {
  const [isToggling, setIsToggling] = useState(false);
  const router = useRouter();

  const formatLastRun = (date: Date | null) => {
    if (!date) return 'Never';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Map legacy agent data to AgentCardKibo format
  const kiboAgent = {
    id: agent.id,
    name: agent.name,
    description: `Last run: ${formatLastRun(agent.stats.lastRunAt)}`,
    icon: agent.icon,
    status: agent.status === 'error' ? ('paused' as const) : (agent.status as 'active' | 'paused'),
    type: agent.category,
    stats: {
      successRate: agent.stats.successRate,
      usageCount: agent.stats.executionsToday,
      timeSaved: `${Math.round(agent.stats.avgResponseTime / 1000)}s avg`,
    },
    integrations: [],
  };

  const handleView = () => {
    router.push(`/agents/${agent.id}`);
  };

  const handleConfigure = async () => {
    setIsToggling(true);
    try {
      await onToggle(agent.id);
    } finally {
      setIsToggling(false);
    }
  };

  return <AgentCardKibo agent={kiboAgent} onView={handleView} onConfigure={handleConfigure} />;
}
