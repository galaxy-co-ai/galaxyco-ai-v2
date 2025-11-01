/**
 * Mobile Dashboard Page
 * Template 12: Mobile Companion Views
 * Simplified dashboard for mobile with key metrics and quick actions
 */

import { TrendingUp, Bot, Zap, Clock, ChevronRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';

const metrics = [
  { label: 'Active Agents', value: '8', change: '+2', icon: Bot },
  { label: "Today's Runs", value: '24', change: '+15%', icon: PlayCircle },
];

const recentActivity = [
  {
    id: 1,
    agent: 'Sales Outreach',
    status: 'completed',
    time: '2m ago',
    result: '12 leads found',
  },
  {
    id: 2,
    agent: 'Email Campaign',
    status: 'running',
    time: '5m ago',
    result: 'Processing...',
  },
  {
    id: 3,
    agent: 'Data Sync',
    status: 'completed',
    time: '15m ago',
    result: '128 records synced',
  },
];

const quickActions = [
  { label: 'Run Agent', href: '/agents', icon: PlayCircle },
  { label: 'View Reports', href: '/reports', icon: TrendingUp },
  { label: 'Workflows', href: '/workflows', icon: Zap },
  { label: 'Schedule', href: '/calendar', icon: Clock },
];

export default function MobileDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Good morning!</h1>
        <p className="text-sm text-foreground-muted">Here&apos;s what&apos;s happening today</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="p-4 rounded-lg border border-border bg-background-elevated"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-foreground-muted" />
                <span className="text-xs text-success font-medium">{metric.change}</span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="text-xs text-foreground-muted">{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="p-4 rounded-lg border border-border bg-background-elevated hover:border-border-hover active:bg-hover transition-colors"
              >
                <Icon className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm font-medium text-foreground">{action.label}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          <Link href="/activity" className="text-xs text-primary hover:text-primary-hover">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <Link
              key={activity.id}
              href={`/agents/${activity.id}`}
              className="block p-4 rounded-lg border border-border bg-background-elevated hover:border-border-hover active:bg-hover transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="font-medium text-foreground">{activity.agent}</div>
                <ChevronRight className="w-4 h-4 text-foreground-muted flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'completed'
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-primary/10 text-primary border border-primary/20'
                  }`}
                >
                  {activity.status}
                </span>
                <span className="text-xs text-foreground-muted">{activity.time}</span>
              </div>
              <div className="text-sm text-foreground-muted mt-2">{activity.result}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
