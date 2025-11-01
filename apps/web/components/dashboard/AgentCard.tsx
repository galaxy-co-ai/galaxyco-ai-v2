'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Edit, Copy, Trash2 } from 'lucide-react';

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
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsToggling(true);
    try {
      await onToggle(agent.id);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return '#10B981'; // green
      case 'paused':
        return '#9CA3AF'; // gray
      case 'error':
        return '#EF4444'; // red
      default:
        return '#9CA3AF';
    }
  };

  const getStatusLabel = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'Paused';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

  const getAvatarGradient = (category: string) => {
    const gradients: Record<string, string> = {
      sales: `linear-gradient(135deg, #60A5FA, #2563EB)`, // blue
      marketing: `linear-gradient(135deg, #EC4899, #BE185D)`, // pink
      operations: `linear-gradient(135deg, #8B5CF6, #6D28D9)`, // purple
      support: `linear-gradient(135deg, #10B981, #059669)`, // green
      engineering: `linear-gradient(135deg, #F59E0B, #D97706)`, // orange
    };
    return gradients[category] || `linear-gradient(135deg, #60A5FA, #2563EB)`;
  };

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

  return (
    <Link href={`/agents/${agent.id}`} className="block no-underline text-inherit">
      <article className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:border-blue-500 hover:shadow-md relative">
        {/* Header with Avatar and Toggle */}
        <div className="flex items-start justify-between mb-4">
          {/* Circular Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md shrink-0"
            style={{ background: getAvatarGradient(agent.category) }}
          >
            {agent.name.substring(0, 2).toUpperCase()}
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            disabled={isToggling}
            className="relative w-11 h-6 rounded-full border-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: agent.isActive ? '#10B981' : '#F3F4F6',
            }}
          >
            <div
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all"
              style={{ left: agent.isActive ? '22px' : '2px' }}
            />
          </button>
        </div>

        {/* Agent Name */}
        <h3 className="text-lg font-semibold mb-2 text-gray-900">{agent.name}</h3>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: getStatusColor(agent.status) }}
          />
          <span className="text-sm text-gray-600 font-medium">{getStatusLabel(agent.status)}</span>
        </div>

        {/* Stats */}
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Today:</span>
            <span className="text-gray-900 font-semibold">{agent.stats.executionsToday} runs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Success:</span>
            <span
              className="font-semibold"
              style={{
                color: agent.stats.successRate >= 90 ? '#10B981' : '#F59E0B',
              }}
            >
              {agent.stats.successRate}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last run:</span>
            <span className="text-gray-900 font-medium">
              {formatLastRun(agent.stats.lastRunAt)}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button className="w-full mt-4 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm font-semibold transition-colors hover:bg-gray-100 hover:border-gray-300">
          View Details →
        </button>
      </article>
    </Link>
  );
}
