'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, AlertCircle, AtSign, Info, CheckCircle, Check, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  workspaceId: string;
  userId: string;
  type:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'task_assigned'
    | 'task_completed'
    | 'project_update'
    | 'customer_update'
    | 'invoice_paid'
    | 'mention'
    | 'system';
  title: string;
  message: string;
  actionUrl: string | null;
  actionLabel: string | null;
  metadata: any;
  isRead: boolean;
  isDismissed: boolean;
  readAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

const notificationTypeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  info: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-blue-500',
    label: 'Info',
  },
  success: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-500',
    label: 'Success',
  },
  warning: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-yellow-500',
    label: 'Warning',
  },
  error: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-red-500',
    label: 'Error',
  },
  mention: {
    icon: <AtSign className="h-4 w-4" />,
    color: 'text-purple-500',
    label: 'Mention',
  },
  system: {
    icon: <Bell className="h-4 w-4" />,
    color: 'text-gray-500',
    label: 'System',
  },
  task_assigned: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-blue-500',
    label: 'Task',
  },
  task_completed: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-500',
    label: 'Completed',
  },
  project_update: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-indigo-500',
    label: 'Project',
  },
  customer_update: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-teal-500',
    label: 'Customer',
  },
  invoice_paid: {
    icon: <CheckCircle className="h-4 w-4" />,
    color: 'text-green-500',
    label: 'Invoice',
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
  const config = notificationTypeConfig[notification.type] || notificationTypeConfig.info;

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
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {config.label}
                </Badge>
                <span>{formatTimestamp(notification.createdAt)}</span>
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
          {notification.actionUrl && notification.actionLabel && (
            <div className="mt-2">
              <Button variant="outline" size="sm" asChild>
                <a href={notification.actionUrl}>{notification.actionLabel}</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function NotificationsPage() {
  const { currentWorkspace } = useWorkspace();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchNotifications() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/notifications?workspaceId=${currentWorkspace.id}&limit=100`);
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, [currentWorkspace?.id]);

  const filteredNotifications =
    typeFilter === 'all' ? notifications : notifications.filter((n) => n.type === typeFilter);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageShell
      title="Notifications"
      subtitle={`${unreadCount} unread notifications`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
    >
      {/* Header Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="mention">Mention</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <>
              <Button variant="outline" onClick={handleDeleteSelected}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete ({selectedIds.length})
              </Button>
            </>
          )}
          <Button onClick={handleMarkAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isSelected={selectedIds.includes(notification.id)}
              onToggleSelect={handleToggleSelect}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up! No notifications to show.
              </p>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
