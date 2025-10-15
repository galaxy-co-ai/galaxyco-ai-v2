/**
 * GalaxyCo.ai Dashboard Page
 * User engagement metrics with agent performance ticker
 * October 15, 2025
 */

'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, TrendingDown, ArrowRight, Brain, Library, MessageCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

// User engagement stats
const userEngagementStats = [
  {
    title: 'Documents Uploaded',
    value: '47',
    change: '+12',
    changeType: 'positive' as const,
    icon: Library,
    description: 'This week',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'AI Conversations',
    value: '234',
    change: '+28%',
    changeType: 'positive' as const,
    icon: MessageCircle,
    description: 'vs last week',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Knowledge Items',
    value: '892',
    change: '+156',
    changeType: 'positive' as const,
    icon: Brain,
    description: 'Total in library',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Agent Actions',
    value: '1.2k',
    change: '+15%',
    changeType: 'positive' as const,
    icon: Zap,
    description: 'This month',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
]

// Agent performance data for ticker
const agentPerformanceData = [
  {
    id: 'agent_1',
    name: 'Research Agent',
    performance: 95.3,
    trend: 'up' as const,
    change: '+2.1%',
    status: 'running' as const,
    lastAction: '5m ago',
  },
  {
    id: 'agent_2',
    name: 'Email Agent',
    performance: 87.5,
    trend: 'down' as const,
    change: '-1.2%',
    status: 'idle' as const,
    lastAction: '2h ago',
  },
  {
    id: 'agent_3',
    name: 'CRM Sync',
    performance: 92.8,
    trend: 'up' as const,
    change: '+0.5%',
    status: 'paused' as const,
    lastAction: '1d ago',
  },
  {
    id: 'agent_4',
    name: 'Lead Scorer',
    performance: 78.2,
    trend: 'down' as const,
    change: '-3.7%',
    status: 'attention' as const,
    lastAction: '30m ago',
  },
]

// Agent ticker item component
function AgentTickerItem({ agent }: { agent: typeof agentPerformanceData[0] }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white border border-gray-200 min-w-fit">
      {/* Status indicator */}
      <div className={cn(
        "w-2 h-2 rounded-full",
        agent.status === 'running' && "bg-green-500",
        agent.status === 'idle' && "bg-blue-500",
        agent.status === 'paused' && "bg-orange-500",
        agent.status === 'attention' && "bg-red-500 animate-pulse"
      )} />
      
      {/* Agent name */}
      <span className="font-medium text-sm">{agent.name}</span>
      
      {/* Mini chart placeholder */}
      <div className="flex items-end gap-0.5 h-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full",
              agent.trend === 'up' ? "bg-green-400" : "bg-red-400"
            )}
            style={{
              height: `${Math.random() * 100}%`,
              minHeight: '20%'
            }}
          />
        ))}
      </div>
      
      {/* Performance & change */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{agent.performance}%</span>
        <span className={cn(
          "text-xs flex items-center",
          agent.trend === 'up' ? "text-green-600" : "text-red-600"
        )}>
          {agent.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {agent.change}
        </span>
      </div>
      
      {/* Last action */}
      <span className="text-xs text-gray-500">{agent.lastAction}</span>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* User Engagement KPIs */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Welcome back!</h2>
            <p className="text-gray-600 mt-1">Here's how your AI assistant is performing</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Agent
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userEngagementStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                    <Icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    stat.changeType === 'positive' ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Agent Performance Ticker */}
      <div className="mt-6 border-t border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-gray-700 whitespace-nowrap">Agent Performance</h3>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-3 animate-scroll">
              {/* Duplicate items for seamless scrolling */}
              {[...agentPerformanceData, ...agentPerformanceData].map((agent, index) => (
                <AgentTickerItem key={`${agent.id}-${index}`} agent={agent} />
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="whitespace-nowrap">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="grid lg:grid-cols-3 gap-6 h-full">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="p-6">
              {/* Activity content would go here */}
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">Your recent AI assistant interactions will appear here</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Library className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Conversation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Brain className="w-4 h-4 mr-2" />
                Train Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}