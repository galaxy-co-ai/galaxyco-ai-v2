'use client';

import { DetailPage } from '@/components/templates/detail-page';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Users,
  TrendingUp,
  MousePointer,
  Calendar,
  BarChart3,
  Send,
  Eye,
  Target,
  Zap,
} from 'lucide-react';

// Mock data for marketing dashboard
const marketingMetrics = [
  {
    label: 'Campaign Reach',
    value: '24,587',
    change: '+18% this month',
    trend: 'up' as const,
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: 'Email Opens',
    value: '68.4%',
    change: '+2.3% vs last campaign',
    trend: 'up' as const,
    icon: <Mail className="h-5 w-5" />,
  },
  {
    label: 'Click Rate',
    value: '4.7%',
    change: '+0.8% improvement',
    trend: 'up' as const,
    icon: <MousePointer className="h-5 w-5" />,
  },
  {
    label: 'Conversion Rate',
    value: '12.3%',
    change: '+1.2% this week',
    trend: 'up' as const,
    icon: <TrendingUp className="h-5 w-5" />,
  },
];

const activeCampaigns = [
  {
    id: '1',
    name: 'Q4 Product Launch',
    type: 'Email Campaign',
    status: 'running',
    reach: 15420,
    openRate: 72,
    clickRate: 5.2,
    budget: '$8,500',
    spent: '$6,240',
    endDate: '2025-11-15',
  },
  {
    id: '2',
    name: 'Holiday Promotion',
    type: 'Social Media',
    status: 'scheduled',
    reach: 28000,
    openRate: 0,
    clickRate: 0,
    budget: '$12,000',
    spent: '$0',
    endDate: '2025-12-01',
  },
  {
    id: '3',
    name: 'Customer Retention',
    type: 'Automation',
    status: 'running',
    reach: 8750,
    openRate: 64,
    clickRate: 3.8,
    budget: '$5,200',
    spent: '$4,100',
    endDate: '2025-10-30',
  },
  {
    id: '4',
    name: 'Webinar Series',
    type: 'Event Marketing',
    status: 'completed',
    reach: 5600,
    openRate: 89,
    clickRate: 12.4,
    budget: '$3,800',
    spent: '$3,650',
    endDate: '2025-10-15',
  },
];

const audienceSegments = [
  {
    name: 'New Subscribers',
    count: 3240,
    percentage: 22,
    growth: '+15%',
    color: 'bg-blue-500',
  },
  {
    name: 'Active Users',
    count: 8950,
    percentage: 45,
    growth: '+8%',
    color: 'bg-green-500',
  },
  {
    name: 'Premium Customers',
    count: 1680,
    percentage: 12,
    growth: '+25%',
    color: 'bg-purple-500',
  },
  {
    name: 'Churned Users',
    count: 2130,
    percentage: 14,
    growth: '-12%',
    color: 'bg-orange-500',
  },
  {
    name: 'Prospects',
    count: 980,
    percentage: 7,
    growth: '+45%',
    color: 'bg-yellow-500',
  },
];

const recentActivity = [
  {
    id: '1',
    type: 'campaign_sent',
    title: 'Q4 Product Launch campaign sent',
    description: 'Sent to 15,420 subscribers',
    time: '2 hours ago',
    user: 'Marketing Team',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MT',
  },
  {
    id: '2',
    type: 'automation_triggered',
    title: 'Welcome sequence activated',
    description: '47 new subscribers entered funnel',
    time: '4 hours ago',
    user: 'System',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SY',
  },
  {
    id: '3',
    type: 'segment_updated',
    title: 'Premium Customers segment updated',
    description: 'Added 23 new customers',
    time: '6 hours ago',
    user: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
  },
  {
    id: '4',
    type: 'campaign_completed',
    title: 'Webinar Series campaign completed',
    description: 'Final email sent to 5,600 attendees',
    time: '1 day ago',
    user: 'Marketing Team',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MT',
  },
];

function CampaignOverview() {
  return (
    <div className="space-y-6">
      {/* Active Campaigns */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Campaigns</h3>
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
        <div className="space-y-4">
          {activeCampaigns.map((campaign) => (
            <div key={campaign.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {campaign.type}
                      </Badge>
                      <Badge
                        variant={
                          campaign.status === 'running'
                            ? 'default'
                            : campaign.status === 'completed'
                              ? 'outline'
                              : 'secondary'
                        }
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {campaign.spent} / {campaign.budget}
                  </p>
                  <p className="text-xs text-muted-foreground">Ends: {campaign.endDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold">{campaign.reach.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Reach</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {campaign.openRate > 0 ? `${campaign.openRate}%` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {campaign.clickRate > 0 ? `${campaign.clickRate}%` : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground">Click Rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Audience Segments */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Audience Segments</h3>
        <div className="space-y-4">
          {audienceSegments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`h-3 w-3 rounded-full ${segment.color}`} />
                <span className="text-sm font-medium">{segment.name}</span>
                <Badge
                  variant={segment.growth.startsWith('+') ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {segment.growth}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{segment.count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{segment.percentage}%</p>
                </div>
                <div className="w-20">
                  <Progress value={segment.percentage} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Analytics() {
  const channelPerformance = [
    { channel: 'Email', opens: 15420, clicks: 892, conversions: 178 },
    { channel: 'Social Media', opens: 28900, clicks: 1240, conversions: 245 },
    { channel: 'Google Ads', opens: 8750, clicks: 650, conversions: 89 },
    { channel: 'Content Marketing', opens: 5600, clicks: 420, conversions: 67 },
  ];

  const topPerformingContent = [
    {
      title: 'AI Platform Demo Video',
      type: 'Video',
      views: 12500,
      engagement: 8.4,
      conversions: 89,
    },
    {
      title: 'Product Update Newsletter',
      type: 'Email',
      views: 8920,
      engagement: 6.7,
      conversions: 156,
    },
    {
      title: 'Customer Success Story',
      type: 'Blog Post',
      views: 5680,
      engagement: 12.3,
      conversions: 42,
    },
    {
      title: 'Feature Announcement',
      type: 'Social Post',
      views: 15600,
      engagement: 4.2,
      conversions: 78,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Channel Performance */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Channel Performance</h3>
        <div className="space-y-4">
          {channelPerformance.map((channel, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex-1">
                <p className="font-medium mb-2">{channel.channel}</p>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span>{channel.opens.toLocaleString()} opens</span>
                  <span>{channel.clicks} clicks</span>
                  <span>{channel.conversions} conversions</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {((channel.conversions / channel.opens) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">conversion rate</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Performing Content */}
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Top Performing Content</h3>
        <div className="space-y-4">
          {topPerformingContent.map((content, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{content.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {content.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {content.views.toLocaleString()} views
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{content.engagement}%</p>
                  <p className="text-xs text-muted-foreground">engagement</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{content.conversions}</p>
                  <p className="text-xs text-muted-foreground">conversions</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Activity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'campaign_sent':
        return <Send className="h-4 w-4" />;
      case 'automation_triggered':
        return <Zap className="h-4 w-4" />;
      case 'segment_updated':
        return <Users className="h-4 w-4" />;
      case 'campaign_completed':
        return <Target className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Avatar
                  src={activity.avatar}
                  alt={activity.user}
                  fallback={activity.user
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                  size="xs"
                  className="h-4 w-4"
                />
                <span className="text-xs text-muted-foreground">{activity.user}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function MarketingPage() {
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: <CampaignOverview />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      content: <Analytics />,
    },
    {
      id: 'activity',
      label: 'Activity',
      content: <Activity />,
    },
  ];

  return (
    <DetailPage
      title="Marketing Campaigns"
      subtitle="Manage campaigns and track marketing performance"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Marketing' }]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      }
      metrics={marketingMetrics}
      tabs={tabs}
      defaultTab="overview"
    />
  );
}
