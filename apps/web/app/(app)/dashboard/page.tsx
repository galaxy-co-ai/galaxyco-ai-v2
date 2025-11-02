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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header - Linear Style */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Key Metrics - Linear Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            icon={Bot}
            label="Active Agents"
            value={stats?.agents.active || 0}
            total={stats?.agents.total || 0}
          />
          <MetricCard
            icon={Users}
            label="Customers"
            value={stats?.customers.total || 0}
          />
          <MetricCard
            icon={Activity}
            label="Projects"
            value={stats?.projects.total || 0}
          />
          <MetricCard
            icon={DollarSign}
            label="Revenue (30d)"
            value={`$${Math.floor(parseInt(stats?.revenue.total || '0') / 100).toLocaleString()}`}
          />
        </div>

        {/* Quick Actions - Linear Style */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Quick Actions</h2>
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
}

function MetricCard({ icon: Icon, label, value, total }: MetricCardProps) {
  return (
    <div className="p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className="text-3xl font-semibold">
        {value}
        {total ? <span className="text-sm text-muted-foreground font-normal"> / {total}</span> : null}
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
      <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-background rounded-md">
            <Icon className="w-5 h-5 text-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">{label}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
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
    <div className="space-y-6 pt-8 border-t">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Resources</h2>
        <p className="text-muted-foreground">Essential tools and guides for power users and executives</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {resourceSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="flex flex-col space-y-3">
              {/* Section Header */}
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-foreground" />
                <h3 className="font-semibold text-base">{section.title}</h3>
              </div>

              <p className="text-sm text-muted-foreground">{section.description}</p>

              {/* Links */}
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
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
