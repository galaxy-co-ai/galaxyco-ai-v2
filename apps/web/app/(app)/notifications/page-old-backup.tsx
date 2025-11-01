'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Bell,
  AlertCircle,
  AtSign,
  Info,
  CheckCircle,
  Check,
  Trash2,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';

type NotificationType = 'system' | 'mention' | 'update' | 'alert' | 'success';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'mention',
    title: 'Sarah Johnson mentioned you',
    description: 'Sarah mentioned you in a comment on Sales Playbook 2024',
    timestamp: '2025-01-16T11:45:00Z',
    isRead: false,
    actionUrl: '/documents/doc_001',
  },
  {
    id: 'notif_002',
    type: 'success',
    title: 'Workflow completed successfully',
    description: 'Your Lead Nurture Campaign workflow finished processing 45 contacts',
    timestamp: '2025-01-16T11:30:00Z',
    isRead: false,
    actionUrl: '/workflows/wf_001',
  },
  {
    id: 'notif_003',
    type: 'alert',
    title: 'API rate limit warning',
    description: "You're approaching your API rate limit (85% used)",
    timestamp: '2025-01-16T11:15:00Z',
    isRead: false,
    actionUrl: '/settings/billing',
  },
  {
    id: 'notif_004',
    type: 'update',
    title: 'New feature available',
    description: 'Check out the new AI Chat interface for real-time assistance',
    timestamp: '2025-01-16T10:45:00Z',
    isRead: false,
    actionUrl: '/chat',
  },
  {
    id: 'notif_005',
    type: 'system',
    title: 'Scheduled maintenance',
    description: 'System maintenance scheduled for Sunday, January 21 at 2:00 AM EST',
    timestamp: '2025-01-16T10:30:00Z',
    isRead: true,
  },
  {
    id: 'notif_006',
    type: 'mention',
    title: 'Michael Chen mentioned you',
    description: 'Michael mentioned you in a comment on Q4 Sales Report',
    timestamp: '2025-01-16T10:15:00Z',
    isRead: true,
    actionUrl: '/documents/doc_002',
  },
  {
    id: 'notif_007',
    type: 'success',
    title: 'Document uploaded successfully',
    description: 'Your document Sales Playbook 2024.pdf has been uploaded',
    timestamp: '2025-01-16T09:50:00Z',
    isRead: true,
    actionUrl: '/documents/doc_001',
  },
  {
    id: 'notif_008',
    type: 'alert',
    title: 'Agent execution failed',
    description: 'Data Validator agent encountered an error: Invalid schema',
    timestamp: '2025-01-16T09:30:00Z',
    isRead: false,
    actionUrl: '/agents/agent_005',
  },
  {
    id: 'notif_009',
    type: 'update',
    title: 'Settings updated',
    description: 'Your workspace notification preferences have been updated',
    timestamp: '2025-01-16T09:15:00Z',
    isRead: true,
    actionUrl: '/settings/notifications',
  },
  {
    id: 'notif_010',
    type: 'system',
    title: 'New team member joined',
    description: 'David Park has joined your workspace as a DevOps Engineer',
    timestamp: '2025-01-16T09:00:00Z',
    isRead: true,
    actionUrl: '/team',
  },
  {
    id: 'notif_011',
    type: 'mention',
    title: 'Emily Rodriguez mentioned you',
    description: 'Emily mentioned you in a discussion about the Product Roadmap',
    timestamp: '2025-01-16T08:45:00Z',
    isRead: true,
    actionUrl: '/documents/doc_003',
  },
  {
    id: 'notif_012',
    type: 'success',
    title: 'Workflow completed',
    description: 'Customer Onboarding Flow processed 8 new customers successfully',
    timestamp: '2025-01-16T08:30:00Z',
    isRead: true,
    actionUrl: '/workflows/wf_002',
  },
  {
    id: 'notif_013',
    type: 'alert',
    title: 'Storage limit warning',
    description: "You're using 75% of your storage quota (7.5 GB of 10 GB)",
    timestamp: '2025-01-16T08:15:00Z',
    isRead: false,
    actionUrl: '/usage',
  },
  {
    id: 'notif_014',
    type: 'update',
    title: 'Security update applied',
    description: 'A security patch has been applied to your workspace',
    timestamp: '2025-01-16T08:00:00Z',
    isRead: true,
  },
  {
    id: 'notif_015',
    type: 'system',
    title: 'Invoice generated',
    description: 'Your monthly invoice for January 2025 is now available',
    timestamp: '2025-01-16T07:45:00Z',
    isRead: true,
    actionUrl: '/settings/billing',
  },
  {
    id: 'notif_016',
    type: 'mention',
    title: 'Jessica Liu mentioned you',
    description: 'Jessica mentioned you in the Marketing Strategy document',
    timestamp: '2025-01-15T18:30:00Z',
    isRead: true,
    actionUrl: '/documents/doc_004',
  },
  {
    id: 'notif_017',
    type: 'success',
    title: 'Agent execution completed',
    description: 'Content Optimizer processed 23 articles successfully',
    timestamp: '2025-01-15T18:15:00Z',
    isRead: true,
    actionUrl: '/agents/agent_006',
  },
  {
    id: 'notif_018',
    type: 'update',
    title: 'Integration connected',
    description: 'Your Slack integration has been successfully connected',
    timestamp: '2025-01-15T18:00:00Z',
    isRead: true,
    actionUrl: '/settings/integrations',
  },
  {
    id: 'notif_019',
    type: 'alert',
    title: 'Failed login attempt',
    description: 'Unusual login activity detected from a new location',
    timestamp: '2025-01-15T17:45:00Z',
    isRead: false,
    actionUrl: '/settings/security',
  },
  {
    id: 'notif_020',
    type: 'system',
    title: 'Workspace upgraded',
    description: 'Your workspace has been upgraded to the Pro plan',
    timestamp: '2025-01-15T17:30:00Z',
    isRead: true,
    actionUrl: '/settings/billing',
  },
];

const notificationTypeConfig: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; label: string }
> = {
  system: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-blue-500',
    label: 'System',
  },
  mention: {
    icon: <AtSign className="h-4 w-4" />,
    color: 'text-purple-500',
    label: 'Mention',
  },
  update: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-500',
    label: 'Update',
  },
  alert: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-red-500',
    label: 'Alert',
  },
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-500',
    label: 'Success',
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

function NotificationItem({
  notification,
  isSelected,
  onToggleSelect,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const config = notificationTypeConfig[notification.type];

  return (
    <Card
      className={`p-4 transition-all hover:shadow-md ${
        !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
      }`}
    >
      <div className="flex gap-4">
        <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(notification.id)} />
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-muted ${config.color}`}
        >
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{notification.title}</h4>
                {!notification.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{notification.description}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {config.label}
                </Badge>
                <span>{formatTimestamp(notification.timestamp)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onDelete(notification.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const readCount = notifications.filter((n) => n.isRead).length;

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const filterByReadStatus = (notifications: Notification[], status: 'all' | 'unread' | 'read') => {
    if (status === 'unread') return notifications.filter((n) => !n.isRead);
    if (status === 'read') return notifications.filter((n) => n.isRead);
    return notifications;
  };

  const filterByType = (notifications: Notification[]) => {
    if (typeFilter === 'all') return notifications;
    return notifications.filter((n) => n.type === typeFilter);
  };

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');

  const displayedNotifications =
    activeTab === 'unread'
      ? filterByReadStatus(filterByType(notifications), 'unread')
      : activeTab === 'read'
        ? filterByReadStatus(filterByType(notifications), 'read')
        : filterByType(notifications);

  return (
    <PageShell
      title="Notifications"
      subtitle={`${unreadCount} unread`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
      actions={
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={handleDeleteSelected}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </>
          )}
          <Button size="sm" onClick={handleMarkAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by type</span>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Notification Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(notificationTypeConfig).map(([type, config]) => (
                  <SelectItem key={type} value={type}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tabs */}
        <Card className="p-1">
          <div className="grid w-full grid-cols-3 gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
              <Badge variant="secondary" className="ml-2">
                {notifications.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'unread'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Unread
              <Badge variant="secondary" className="ml-2">
                {unreadCount}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab('read')}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === 'read'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Read
              <Badge variant="secondary" className="ml-2">
                {readCount}
              </Badge>
            </button>
          </div>
        </Card>

        {/* Notification List */}
        <div className="space-y-3">
          {displayedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isSelected={selectedIds.includes(notification.id)}
              onToggleSelect={handleToggleSelect}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {notifications.length === 0 && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Bell className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up! Check back later for updates.
              </p>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
