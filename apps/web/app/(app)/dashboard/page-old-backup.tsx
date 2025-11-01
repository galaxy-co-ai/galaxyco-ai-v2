'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Mail,
  Briefcase,
  Bot,
  Clock,
  DollarSign,
  User as UserIcon,
  Megaphone,
  BookOpen,
  FileStack,
  GraduationCap,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import './dashboard.css';

// Category-specific chart data
const categoryChartData: Record<string, any[]> = {
  'lead-gen': [
    { month: "Jan '25", leads: 45, qualified: 28, converted: 12 },
    { month: "Feb '25", leads: 62, qualified: 38, converted: 18 },
    { month: "Mar '25", leads: 78, qualified: 52, converted: 28 },
    { month: "Apr '25", leads: 95, qualified: 68, converted: 38 },
    { month: "May '25", leads: 112, qualified: 82, converted: 48 },
  ],
  revenue: [
    { month: "Jan '25", mrr: 12000, arr: 144000, growth: 8 },
    { month: "Feb '25", mrr: 15500, arr: 186000, growth: 12 },
    { month: "Mar '25", mrr: 19200, arr: 230400, growth: 18 },
    { month: "Apr '25", mrr: 24800, arr: 297600, growth: 22 },
    { month: "May '25", mrr: 31500, arr: 378000, growth: 28 },
  ],
  'user-time': [
    { month: "Jan '25", userHours: 35, leadsGenerated: 12, clientsCreated: 5 },
    { month: "Feb '25", userHours: 28, leadsGenerated: 18, clientsCreated: 8 },
    { month: "Mar '25", userHours: 22, leadsGenerated: 42, clientsCreated: 22 },
    { month: "Apr '25", userHours: 16, leadsGenerated: 48, clientsCreated: 29 },
    { month: "May '25", userHours: 12, leadsGenerated: 55, clientsCreated: 36 },
  ],
  documents: [
    { month: "Jan '25", created: 145, edited: 89, shared: 56 },
    { month: "Feb '25", created: 198, edited: 122, shared: 78 },
    { month: "Mar '25", created: 256, edited: 165, shared: 102 },
    { month: "Apr '25", created: 312, edited: 198, shared: 134 },
    { month: "May '25", created: 389, edited: 245, shared: 168 },
  ],
  marketing: [
    { month: "Jan '25", campaigns: 8, clicks: 2400, conversions: 180 },
    { month: "Feb '25", campaigns: 12, clicks: 3600, conversions: 285 },
    { month: "Mar '25", campaigns: 15, clicks: 4800, conversions: 398 },
    { month: "Apr '25", campaigns: 18, clicks: 6200, conversions: 512 },
    { month: "May '25", campaigns: 22, clicks: 7800, conversions: 648 },
  ],
  outreach: [
    { month: "Jan '25", sent: 1200, opened: 680, replied: 156 },
    { month: "Feb '25", sent: 1850, opened: 1080, replied: 245 },
    { month: "Mar '25", sent: 2400, opened: 1520, replied: 368 },
    { month: "Apr '25", sent: 3100, opened: 2050, replied: 498 },
    { month: "May '25", sent: 3850, opened: 2680, replied: 645 },
  ],
};

// Chart line configurations for each category
const categoryChartConfig: Record<string, any> = {
  'lead-gen': {
    lines: [
      { dataKey: 'leads', stroke: '#22d3ee', name: 'Leads' },
      { dataKey: 'qualified', stroke: '#3b82f6', name: 'Qualified' },
      { dataKey: 'converted', stroke: '#1e40af', name: 'Converted' },
    ],
  },
  revenue: {
    lines: [
      { dataKey: 'mrr', stroke: '#10b981', name: 'MRR' },
      { dataKey: 'arr', stroke: '#059669', name: 'ARR' },
      { dataKey: 'growth', stroke: '#047857', name: 'Growth %' },
    ],
  },
  'user-time': {
    lines: [
      { dataKey: 'userHours', stroke: '#22d3ee', name: 'User Hours' },
      { dataKey: 'leadsGenerated', stroke: '#3b82f6', name: 'Leads Generated' },
      { dataKey: 'clientsCreated', stroke: '#1e40af', name: 'Clients Created' },
    ],
  },
  documents: {
    lines: [
      { dataKey: 'created', stroke: '#8b5cf6', name: 'Created' },
      { dataKey: 'edited', stroke: '#7c3aed', name: 'Edited' },
      { dataKey: 'shared', stroke: '#6d28d9', name: 'Shared' },
    ],
  },
  marketing: {
    lines: [
      { dataKey: 'campaigns', stroke: '#f59e0b', name: 'Campaigns' },
      { dataKey: 'clicks', stroke: '#d97706', name: 'Clicks' },
      { dataKey: 'conversions', stroke: '#b45309', name: 'Conversions' },
    ],
  },
  outreach: {
    lines: [
      { dataKey: 'sent', stroke: '#ec4899', name: 'Sent' },
      { dataKey: 'opened', stroke: '#db2777', name: 'Opened' },
      { dataKey: 'replied', stroke: '#be185d', name: 'Replied' },
    ],
  },
};

// User engagement stats
const userEngagementStats = [
  {
    title: 'Docs',
    value: '+47',
    trend: 'up' as const,
    description: 'This week',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'Emails',
    value: '+234',
    trend: 'up' as const,
    description: 'This week',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'Agents',
    value: '+12',
    trend: 'up' as const,
    description: 'This week',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
  {
    title: 'Assets',
    value: '+89',
    trend: 'up' as const,
    description: 'This week',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
];

// Active agents data
const activeAgents = [
  { id: 1, name: 'Research Agent', avatar: 'RA', status: 'active' },
  { id: 2, name: 'Email Agent', avatar: 'EA', status: 'active' },
  { id: 3, name: 'CRM Agent', avatar: 'CA', status: 'idle' },
];

// Left sidebar categories
const sidebarCategories = [
  {
    id: 'lead-gen',
    title: 'Lead Gen',
    icon: Users,
    description: 'Lead generation metrics',
    isActive: false,
  },
  {
    id: 'revenue',
    title: 'Revenue',
    icon: DollarSign,
    description: 'Revenue analytics',
    isActive: false,
  },
  {
    id: 'user-time',
    title: 'User Time',
    icon: Clock,
    description: 'Time tracking',
    isActive: true,
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: FileText,
    description: 'Document management',
    isActive: false,
  },
  {
    id: 'marketing',
    title: 'Marketing',
    icon: Megaphone,
    description: 'Marketing campaigns',
    isActive: false,
  },
  {
    id: 'outreach',
    title: 'Outreach',
    icon: Mail,
    description: 'Email outreach',
    isActive: false,
  },
];

// Custom chart tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function DashboardHero() {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GalaxyCo.ai</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
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
              {activeAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium',
                    agent.status === 'active' ? 'bg-gray-900' : 'bg-gray-400',
                  )}
                  title={agent.name}
                >
                  {agent.avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StockTicker() {
  // Duplicate stats for seamless infinite scroll
  const duplicatedStats = [...userEngagementStats, ...userEngagementStats];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50 border-y border-gray-200 py-4 my-6">
      <div className="flex animate-scroll">
        {duplicatedStats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 px-8 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <span className={cn('text-lg font-bold', stat.color)}>{stat.value}</span>
              <span className="text-sm text-gray-700 font-medium">{stat.title}</span>
              <TrendingUp className={cn('w-4 h-4', stat.color)} />
            </div>
            <div className="w-px h-6 bg-gray-300" />
          </div>
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-cyan-50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
    </div>
  );
}

function CategorySidebar({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string | null;
  onCategoryChange: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 h-full flex flex-col">
      <div className="space-y-2">
        {sidebarCategories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id || category.isActive;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors group',
                isSelected ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50 text-gray-700',
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-lg',
                  isSelected
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300',
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-medium">{category.title}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MainChart({ selectedCategory }: { selectedCategory: string | null }) {
  const chartData =
    categoryChartData[selectedCategory || 'user-time'] || categoryChartData['user-time'];
  const chartConfig =
    categoryChartConfig[selectedCategory || 'user-time'] || categoryChartConfig['user-time'];

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-6 flex-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {sidebarCategories.find((c) => c.id === selectedCategory)?.title || 'User Time'} Analytics
        </h3>
        <div className="flex items-center gap-6 mb-4">
          {chartConfig.lines.map((line: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: line.stroke }}></div>
              <span className="text-sm text-gray-600">{line.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
            <Tooltip content={<CustomTooltip />} />
            {chartConfig.lines.map((line: any, index: number) => (
              <Line
                key={index}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke}
                strokeWidth={3}
                dot={{ fill: line.stroke, strokeWidth: 0, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: line.stroke,
                  strokeWidth: 2,
                  fill: 'white',
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
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
    <div className="bg-white rounded-2xl border-2 border-gray-300 p-8 mt-6">
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

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('user-time');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Hero */}
        <DashboardHero />

        {/* Stock Ticker */}
        <StockTicker />

        {/* Main Content */}
        <div className="flex gap-6 mb-6 h-[550px]">
          {/* Left Sidebar Categories */}
          <div className="w-56">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Main Chart */}
          <MainChart selectedCategory={selectedCategory} />
        </div>

        {/* Dashboard Footer */}
        <DashboardFooter />
      </div>
    </div>
  );
}
