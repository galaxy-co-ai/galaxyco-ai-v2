'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Users,
  FileText,
  Mail,
  Bot,
  Clock,
  DollarSign,
  BookOpen,
  FileStack,
  GraduationCap,
  Building2,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

interface DashboardStats {
  agents: {
    total: number;
    active: number;
  };
  customers: {
    total: number;
  };
  projects: {
    total: number;
  };
  revenue: {
    total: string;
  };
}

interface Agent {
  id: string;
  name: string;
  status: string;
}

export default function DashboardPage() {
  const { currentWorkspace } = useWorkspace();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!currentWorkspace?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch agents
        const agentsRes = await fetch(`/api/agents?workspaceId=${currentWorkspace.id}&limit=5`);
        let agentsData = null;
        if (agentsRes.ok) {
          agentsData = await agentsRes.json();
          setAgents(agentsData.agents || []);
        }

        // Fetch sales analytics for revenue
        const salesRes = await fetch(
          `/api/analytics/sales?workspaceId=${currentWorkspace.id}&dateRange=30`,
        );
        let salesData = null;
        if (salesRes.ok) {
          salesData = await salesRes.json();
        }

        // Build stats object
        const dashStats: DashboardStats = {
          agents: {
            total: agentsData?.agents?.length || 0,
            active: agentsData?.agents?.filter((a: Agent) => a.status === 'active').length || 0,
          },
          customers: {
            total: salesData?.analytics?.customers?.total || 0,
          },
          projects: {
            total: salesData?.analytics?.projects?.total || 0,
          },
          revenue: {
            total: salesData?.analytics?.revenue?.total || '0',
          },
        };

        setStats(dashStats);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  // Active agents (up to 3)
  const activeAgentsList = agents.filter((a) => a.status === 'active').slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Hero */}
        <div className="bg-white rounded-2xl border-2 border-gray-300 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">GalaxyCo.ai</h1>
              <p className="text-gray-600">
                Welcome back! Here&apos;s what&apos;s happening today.
              </p>
            </div>
            <div className="flex items-center gap-8">
              {/* Time and Date */}
              <div className="text-right">
                <div className="text-sm text-gray-600">Time | Date</div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentTime} | {currentDate}
                </div>
              </div>

              {/* Active Agents */}
              <div className="flex flex-col items-end">
                <div className="text-sm text-gray-600 mb-2">Active Agents</div>
                <div className="flex gap-2">
                  {activeAgentsList.length > 0 ? (
                    activeAgentsList.map((agent) => (
                      <div
                        key={agent.id}
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-900 text-white text-sm font-medium"
                        title={agent.name}
                      >
                        {agent.name.substring(0, 2).toUpperCase()}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500">No active agents</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            icon={Bot}
            label="Active Agents"
            value={stats?.agents.active || 0}
            total={stats?.agents.total || 0}
            color="blue"
          />
          <MetricCard
            icon={Users}
            label="Customers"
            value={stats?.customers.total || 0}
            color="green"
          />
          <MetricCard
            icon={Activity}
            label="Projects"
            value={stats?.projects.total || 0}
            color="purple"
          />
          <MetricCard
            icon={DollarSign}
            label="Revenue (30d)"
            value={`$${Math.floor(parseInt(stats?.revenue.total || '0') / 100).toLocaleString()}`}
            color="emerald"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border-2 border-gray-300 p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              icon={Bot}
              label="Create Agent"
              href="/agents/new"
              description="Build a new AI agent"
            />
            <ActionCard
              icon={Users}
              label="Add Customer"
              href="/customers"
              description="Create customer record"
            />
            <ActionCard
              icon={FileText}
              label="New Document"
              href="/documents"
              description="Upload or create document"
            />
            <ActionCard
              icon={Mail}
              label="Send Campaign"
              href="/campaigns"
              description="Launch email campaign"
            />
          </div>
        </div>

        {/* Resources Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  total?: number;
  color?: 'blue' | 'green' | 'purple' | 'emerald';
}

function MetricCard({ icon: Icon, label, value, total, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value}
            {total ? <span className="text-sm text-gray-500 font-normal"> / {total}</span> : null}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ActionCardProps {
  icon: React.ElementType;
  label: string;
  href: string;
  description: string;
}

function ActionCard({ icon: Icon, label, href, description }: ActionCardProps) {
  return (
    <Link href={href}>
      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function DashboardFooter() {
  const resourceSections = [
    {
      title: 'Documentation',
      icon: BookOpen,
      description: 'Guides and references',
      links: [
        { label: 'Getting Started', href: '/docs/getting-started' },
        { label: 'API Reference', href: '/docs/api' },
        { label: 'Integration Guides', href: '/docs/integrations' },
        { label: 'Best Practices', href: '/docs/best-practices' },
      ],
    },
    {
      title: 'Templates',
      icon: FileStack,
      description: 'Ready-to-use resources',
      links: [
        { label: 'Workflow Templates', href: '/templates/workflows' },
        { label: 'Document Templates', href: '/templates/documents' },
        { label: 'Agent Blueprints', href: '/templates/agents' },
        { label: 'Email Templates', href: '/templates/emails' },
      ],
    },
    {
      title: 'AI University',
      icon: GraduationCap,
      description: 'Learn and master AI',
      links: [
        { label: 'Platform Courses', href: '/university/courses' },
        { label: 'Certifications', href: '/university/certifications' },
        { label: 'Video Tutorials', href: '/university/tutorials' },
        { label: 'Webinars', href: '/university/webinars' },
      ],
    },
    {
      title: 'Company',
      icon: Building2,
      description: 'About GalaxyCo.ai',
      links: [
        {
          label: 'Blog & Updates',
          href: 'https://galaxyco.ai/blog',
          external: true,
        },
        { label: 'Support Center', href: '/support' },
        {
          label: 'System Status',
          href: 'https://status.galaxyco.ai',
          external: true,
        },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Resources</h2>
        <p className="text-gray-600">Essential tools and guides for power users and executives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {resourceSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="flex flex-col">
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{section.title}</h3>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-3">{section.description}</p>

              {/* Links */}
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-1.5 group"
                    >
                      <span>{link.label}</span>
                      {link.external && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
