/**
 * GalaxyCo.ai Dashboard Page
 * Main dashboard with metrics, agents, and activity
 * October 15, 2025
 */

import React from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { AgentsList } from '@/components/dashboard/agents-list'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { mockDashboardStats, mockAgents, mockNotifications } from '@/lib/fixtures'

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Overview of your AI automation platform"
      >
        <Button size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Agent
        </Button>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockDashboardStats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Agents List - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <AgentsList agents={mockAgents} />
        </div>

        {/* Activity Feed - Takes up 1 column */}
        <div className="lg:col-span-1">
          <ActivityFeed activities={mockNotifications} />
        </div>
      </div>
    </div>
  )
}