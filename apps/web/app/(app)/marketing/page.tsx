/**
 * Marketing Page - Figma Design
 * Complete rebuild to match Figma design exactly
 * Updated: November 5, 2025
 */

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Target,
  DollarSign,
  Eye,
  TrendingUp,
  Plus,
  Megaphone,
} from 'lucide-react';
import {
  MetricsGrid,
  AIInsights,
  CampaignCard,
} from '@/components/figma/marketing';
import type { MarketingMetric } from '@/components/figma/marketing/MetricsGrid';
import type { CampaignCardProps } from '@/components/figma/marketing/CampaignCard';

export default function MarketingPage() {
  // Top Metrics (from Figma)
  const metrics: MarketingMetric[] = [
    {
      icon: Target,
      iconColor: 'text-purple-600',
      iconBgGradient: 'bg-gradient-to-br from-purple-500/10 to-purple-500/20',
      label: 'Active Campaigns',
      value: 4,
      trend: '+2 from last month',
      trendType: 'positive',
    },
    {
      icon: DollarSign,
      iconColor: 'text-green-600',
      iconBgGradient: 'bg-gradient-to-br from-green-500/10 to-green-500/20',
      label: 'Total Budget',
      value: '$180K',
      subtitle: '$88K spent (49%)',
    },
    {
      icon: Eye,
      iconColor: 'text-blue-600',
      iconBgGradient: 'bg-gradient-to-br from-blue-500/10 to-blue-500/20',
      label: 'Total Impressions',
      value: '10.6M',
      trend: '+23% vs last month',
      trendType: 'positive',
    },
    {
      icon: TrendingUp,
      iconColor: 'text-orange-600',
      iconBgGradient: 'bg-gradient-to-br from-orange-500/10 to-orange-500/20',
      label: 'Avg. ROI',
      value: '256%',
      trend: '+18% vs target',
      trendType: 'positive',
    },
  ];

  // Campaigns Data (from Figma)
  const campaigns: Omit<CampaignCardProps, 'className'>[] = [
    {
      id: '1',
      name: 'Q4 Product Launch Campaign',
      type: 'Multi-Channel Launch',
      status: 'active',
      progress: 65,
      budget: '$50.0K',
      spent: '$32.4K',
      impressions: '2.5M',
      roi: '340%',
      tags: ['Email', 'Social Media', 'Paid Ads', 'Content'],
      onViewDetails: () => {},
    },
    {
      id: '2',
      name: 'Holiday Season Email Series',
      type: 'Email Marketing',
      status: 'active',
      progress: 55,
      budget: '$15.0K',
      spent: '$8.2K',
      impressions: '450.0K',
      roi: '285%',
      tags: ['Email', 'Marketing Automation'],
      onViewDetails: () => {},
    },
    {
      id: '3',
      name: 'Brand Awareness Social Campaign',
      type: 'Social Media',
      status: 'active',
      progress: 42,
      budget: '$25.0K',
      spent: '$12.8K',
      impressions: '5.2M',
      roi: '125%',
      tags: ['LinkedIn', 'Twitter', 'Instagram', 'Facebook'],
      onViewDetails: () => {},
    },
  ];

  const aiRecommendation =
    "Based on your recent campaigns, I recommend increasing budget allocation to the Q4 Product Launch Campaign by 15% and creating a retargeting campaign for visitors who engaged with holiday content. Would you like me to create these optimizations?";

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Megaphone className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Marketing Campaigns</h1>
          </div>
          <p className="text-muted-foreground">AI-powered marketing campaign management</p>
        </div>
        <Button className="bg-black hover:bg-black/90">
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Top Metrics */}
      <MetricsGrid metrics={metrics} />

      {/* AI Insights */}
      <AIInsights
        recommendation={aiRecommendation}
        onApply={() => {}}
        onLearnMore={() => {}}
      />

      {/* Campaign Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} {...campaign} />
          ))}
        </div>
      </div>
    </div>
  );
}
