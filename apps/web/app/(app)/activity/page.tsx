'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity as ActivityIcon,
  Zap,
  Upload,
  Play,
  UserPlus,
  Settings,
  CheckCircle,
  FileText,
  Workflow,
  AlertCircle,
  Filter,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';

type ActivityType =
  | 'agent_run'
  | 'document_upload'
  | 'workflow_complete'
  | 'member_joined'
  | 'settings_changed';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  metadata?: Record<string, string>;
}

// Mock activity data
const activities: Activity[] = [
  {
    id: 'act_001',
    type: 'agent_run',
    title: 'Agent execution completed',
    description: 'Sales Lead Qualifier completed successfully',
    timestamp: '2025-01-16T11:45:00Z',
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
    },
    metadata: {
      duration: '2.3s',
      status: 'success',
    },
  },
  {
    id: 'act_002',
    type: 'document_upload',
    title: 'Document uploaded',
    description: 'Sales Playbook 2024.pdf added to Documents',
    timestamp: '2025-01-16T11:30:00Z',
    user: {
      name: 'Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MC',
    },
    metadata: {
      size: '2.4 MB',
      type: 'PDF',
    },
  },
  {
    id: 'act_003',
    type: 'workflow_complete',
    title: 'Workflow completed',
    description: 'Lead Nurture Campaign finished with 45 contacts processed',
    timestamp: '2025-01-16T11:15:00Z',
    user: {
      name: 'Emily Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ER',
    },
    metadata: {
      processed: '45',
      duration: '12m',
    },
  },
  {
    id: 'act_004',
    type: 'member_joined',
    title: 'New team member joined',
    description: 'David Park joined the Engineering team',
    timestamp: '2025-01-16T10:45:00Z',
    user: {
      name: 'David Park',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DP',
    },
    metadata: {
      role: 'DevOps Engineer',
      department: 'Engineering',
    },
  },
  {
    id: 'act_005',
    type: 'settings_changed',
    title: 'Settings updated',
    description: 'Workspace notification preferences changed',
    timestamp: '2025-01-16T10:30:00Z',
    user: {
      name: 'Jessica Liu',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JL',
    },
  },
  {
    id: 'act_006',
    type: 'agent_run',
    title: 'Agent execution started',
    description: 'Email Generator agent processing 12 templates',
    timestamp: '2025-01-16T10:15:00Z',
    user: {
      name: 'Alex Thompson',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AT',
    },
    metadata: {
      status: 'running',
    },
  },
  {
    id: 'act_007',
    type: 'workflow_complete',
    title: 'Workflow completed',
    description: 'Data Sync Pipeline processed 1,234 records',
    timestamp: '2025-01-16T09:50:00Z',
    user: {
      name: 'Maria Santos',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MS',
    },
    metadata: {
      processed: '1234',
      duration: '8m',
    },
  },
  {
    id: 'act_008',
    type: 'document_upload',
    title: 'Document uploaded',
    description: 'Q4 Sales Report.xlsx added to Documents',
    timestamp: '2025-01-16T09:30:00Z',
    user: {
      name: 'Ryan Foster',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RF',
    },
    metadata: {
      size: '1.2 MB',
      type: 'Excel',
    },
  },
  {
    id: 'act_009',
    type: 'agent_run',
    title: 'Agent execution failed',
    description: 'Data Validator encountered an error',
    timestamp: '2025-01-16T09:15:00Z',
    user: {
      name: 'Hannah Kim',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HK',
    },
    metadata: {
      status: 'failed',
      error: 'Invalid schema',
    },
  },
  {
    id: 'act_010',
    type: 'settings_changed',
    title: 'Settings updated',
    description: 'API rate limits increased for production environment',
    timestamp: '2025-01-16T09:00:00Z',
    user: {
      name: 'James Wilson',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JW',
    },
  },
  {
    id: 'act_011',
    type: 'workflow_complete',
    title: 'Workflow completed',
    description: 'Customer Onboarding Flow completed for 8 new customers',
    timestamp: '2025-01-16T08:45:00Z',
    user: {
      name: 'Linda Zhang',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LZ',
    },
    metadata: {
      processed: '8',
      duration: '15m',
    },
  },
  {
    id: 'act_012',
    type: 'document_upload',
    title: 'Multiple documents uploaded',
    description: '5 files added to Marketing folder',
    timestamp: '2025-01-16T08:30:00Z',
    user: {
      name: 'Robert Taylor',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RT',
    },
    metadata: {
      count: '5',
      folder: 'Marketing',
    },
  },
  {
    id: 'act_013',
    type: 'agent_run',
    title: 'Agent execution completed',
    description: 'Content Optimizer processed 23 articles',
    timestamp: '2025-01-16T08:15:00Z',
    user: {
      name: 'Sophie Martinez',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SM',
    },
    metadata: {
      duration: '5.7s',
      status: 'success',
    },
  },
  {
    id: 'act_014',
    type: 'member_joined',
    title: 'New team member joined',
    description: 'Kevin Brown joined the Security team',
    timestamp: '2025-01-16T08:00:00Z',
    user: {
      name: 'Kevin Brown',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KB',
    },
    metadata: {
      role: 'Security Engineer',
      department: 'Engineering',
    },
  },
  {
    id: 'act_015',
    type: 'workflow_complete',
    title: 'Workflow completed',
    description: 'Weekly Report Generator created 12 reports',
    timestamp: '2025-01-16T07:45:00Z',
    user: {
      name: 'Amanda Davis',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AD',
    },
    metadata: {
      processed: '12',
      duration: '6m',
    },
  },
  {
    id: 'act_016',
    type: 'document_upload',
    title: 'Document uploaded',
    description: 'Product Roadmap Q1 2024.pdf added to Documents',
    timestamp: '2025-01-15T18:30:00Z',
    user: {
      name: 'Thomas Anderson',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=TA',
    },
    metadata: {
      size: '3.1 MB',
      type: 'PDF',
    },
  },
  {
    id: 'act_017',
    type: 'agent_run',
    title: 'Agent execution completed',
    description: 'Sentiment Analyzer processed 156 reviews',
    timestamp: '2025-01-15T18:15:00Z',
    user: {
      name: 'Rachel Green',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RG',
    },
    metadata: {
      duration: '8.2s',
      status: 'success',
    },
  },
  {
    id: 'act_018',
    type: 'settings_changed',
    title: 'Settings updated',
    description: 'Email notification frequency changed to daily digest',
    timestamp: '2025-01-15T18:00:00Z',
    user: {
      name: 'Carlos Mendez',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CM',
    },
  },
  {
    id: 'act_019',
    type: 'workflow_complete',
    title: 'Workflow completed',
    description: 'Invoice Generation processed 34 invoices',
    timestamp: '2025-01-15T17:45:00Z',
    user: {
      name: 'Jennifer Lee',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JLee',
    },
    metadata: {
      processed: '34',
      duration: '4m',
    },
  },
  {
    id: 'act_020',
    type: 'document_upload',
    title: 'Document uploaded',
    description: 'Meeting Notes 2024-01-15.docx added to Documents',
    timestamp: '2025-01-15T17:30:00Z',
    user: {
      name: 'Mark Johnson',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MJ',
    },
    metadata: {
      size: '0.8 MB',
      type: 'Word',
    },
  },
];

const activityTypeConfig: Record<
  ActivityType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  agent_run: {
    icon: <Zap className="h-4 w-4" />,
    color: 'text-yellow-500',
    label: 'Agent Run',
  },
  document_upload: {
    icon: <Upload className="h-4 w-4" />,
    color: 'text-blue-500',
    label: 'Document Upload',
  },
  workflow_complete: {
    icon: <Play className="h-4 w-4" />,
    color: 'text-green-500',
    label: 'Workflow Complete',
  },
  member_joined: {
    icon: <UserPlus className="h-4 w-4" />,
    color: 'text-purple-500',
    label: 'Member Joined',
  },
  settings_changed: {
    icon: <Settings className="h-4 w-4" />,
    color: 'text-gray-500',
    label: 'Settings Changed',
  },
};

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
}

function ActivityItem({ activity }: { activity: Activity }) {
  const config = activityTypeConfig[activity.type];

  return (
    <Card className="p-4 transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${config.color}`}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{activity.title}</h4>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
            </div>
            <span className="ml-4 text-xs text-muted-foreground whitespace-nowrap">
              {formatTimestamp(activity.timestamp)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar
                src={activity.user.avatar}
                alt={activity.user.name}
                fallback={activity.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">{activity.user.name}</span>
            </div>
            {activity.metadata && (
              <div className="flex gap-2">
                {Object.entries(activity.metadata).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ActivityPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('today');

  // Filter activities
  const filteredActivities = activities.filter((activity) => {
    const matchesType = selectedType === 'all' || activity.type === selectedType;

    // Simple date range filtering
    const activityDate = new Date(activity.timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60);

    let matchesDateRange = true;
    if (dateRange === 'today') {
      matchesDateRange = diffInHours < 24;
    } else if (dateRange === 'week') {
      matchesDateRange = diffInHours < 168; // 7 days
    } else if (dateRange === 'month') {
      matchesDateRange = diffInHours < 720; // 30 days
    }

    return matchesType && matchesDateRange;
  });

  return (
    <PageShell
      title="Activity Feed"
      subtitle={`${filteredActivities.length} activities`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Activity' }]}
      actions={
        <Badge variant="default" className="gap-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          Live
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  {Object.entries(activityTypeConfig).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Activity List */}
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <ActivityIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No activities found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters to see more activities.
              </p>
            </div>
          </Card>
        )}

        {/* Load More */}
        {filteredActivities.length > 0 && (
          <div className="flex justify-center">
            <Button variant="outline">Load More Activities</Button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
