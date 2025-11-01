'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import { Plus, Search, Mail, Users, TrendingUp } from 'lucide-react';

interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'archived';
  type: 'email' | 'social' | 'ads' | 'content';
  segmentId: string | null;
  targetAudience: any;
  startDate: string | null;
  endDate: string | null;
  scheduledFor: string | null;
  content: any;
  sentCount: number;
  openCount: number;
  clickCount: number;
  conversionCount: number;
  budget: number | null;
  spent: number | null;
  createdBy: string;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  paused: {
    label: 'Paused',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  },
  scheduled: {
    label: 'Scheduled',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  archived: {
    label: 'Archived',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  },
};

const typeConfig: Record<string, { label: string; icon: typeof Mail }> = {
  email: { label: 'Email', icon: Mail },
  social: { label: 'Social', icon: Users },
  ads: { label: 'Ads', icon: TrendingUp },
  content: { label: 'Content', icon: Mail },
};

export default function CampaignsPage() {
  const { currentWorkspace } = useWorkspace();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchCampaigns() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/campaigns?workspaceId=${currentWorkspace.id}&limit=100`);
        if (!res.ok) throw new Error('Failed to fetch campaigns');
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        toast.error('Failed to load campaigns');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCampaigns();
  }, [currentWorkspace?.id]);

  const filteredCampaigns = campaigns.filter((campaign) =>
    searchQuery === '' ? true : campaign.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversionCount || 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageShell
      title="Marketing Campaigns"
      subtitle="Manage your marketing campaigns and track performance"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Campaigns' }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Campaigns</p>
          <p className="text-2xl font-bold">{campaigns.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCampaigns}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Conversions</p>
          <p className="text-2xl font-bold">{totalConversions}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Conv. Rate</p>
          <p className="text-2xl font-bold">
            {campaigns.length > 0
              ? (
                  (totalConversions /
                    campaigns.reduce((sum, c) => sum + (c.sentCount || c.clickCount || 1), 0)) *
                  100
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Campaigns Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign) => {
            const TypeIcon = typeConfig[campaign.type]?.icon || Mail;
            const openRate = campaign.sentCount
              ? ((campaign.openCount / campaign.sentCount) * 100).toFixed(1)
              : 0;
            const clickRate = campaign.openCount
              ? ((campaign.clickCount / campaign.openCount) * 100).toFixed(1)
              : campaign.clickCount > 0
                ? 'N/A'
                : 0;

            return (
              <div
                key={campaign.id}
                className="rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate">{campaign.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={statusConfig[campaign.status]?.className}>
                        {statusConfig[campaign.status]?.label}
                      </Badge>
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {campaign.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Sent</p>
                    <p className="text-lg font-semibold">{campaign.sentCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Opens</p>
                    <p className="text-lg font-semibold">{campaign.openCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="text-lg font-semibold">{campaign.clickCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                    <p className="text-lg font-semibold">{campaign.conversionCount || 0}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 p-12 text-center border border-border rounded-lg">
            <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No campaigns</h3>
            <p className="text-sm text-muted-foreground">
              Create your first campaign to get started
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
