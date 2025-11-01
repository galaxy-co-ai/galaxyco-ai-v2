'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
import { MessageSquare, Search, Mail, Phone, Globe, Plus } from 'lucide-react';

interface InboxMessage {
  id: string;
  workspaceId: string;
  channel: 'email' | 'sms' | 'web' | 'api' | 'form';
  subject: string;
  body: string;
  status: 'unread' | 'read' | 'archived' | 'spam' | 'flagged';
  senderId: string | null;
  senderEmail: string | null;
  senderName: string | null;
  recipientIds: any;
  threadId: string | null;
  replyToId: string | null;
  metadata: any;
  attachments: any;
  readAt: string | null;
  archivedAt: string | null;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  unread: {
    label: 'Unread',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  read: {
    label: 'Read',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  },
  archived: {
    label: 'Archived',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  spam: {
    label: 'Spam',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  flagged: {
    label: 'Flagged',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  },
};

const channelIcons: Record<string, typeof MessageSquare> = {
  email: Mail,
  sms: Phone,
  web: Globe,
  api: MessageSquare,
  form: MessageSquare,
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
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return diffInDays === 1 ? 'Yesterday' : `${diffInDays}d ago`;
  }
}

export default function InboxPage() {
  const { currentWorkspace } = useWorkspace();
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);

  useEffect(() => {
    async function fetchMessages() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/inbox?workspaceId=${currentWorkspace.id}&limit=100`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.messages && data.messages.length > 0) {
          setSelectedMessage(data.messages[0]);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast.error('Failed to load inbox messages');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [currentWorkspace?.id]);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      searchQuery === '' ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.senderName?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter((msg) => msg.status === 'unread').length;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageShell
      title="Inbox"
      subtitle={`${unreadCount} unread messages`}
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Inbox' }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Message List */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="border-b border-border p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">
                    Unread ({messages.filter((m) => m.status === 'unread').length})
                  </SelectItem>
                  <SelectItem value="flagged">
                    Flagged ({messages.filter((m) => m.status === 'flagged').length})
                  </SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => {
                const Icon = channelIcons[message.channel] || MessageSquare;
                return (
                  <button
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`w-full border-b border-border p-4 text-left transition-colors hover:bg-muted/50 ${
                      selectedMessage?.id === message.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${message.senderName || message.senderEmail}`}
                        alt={message.senderName || message.senderEmail || 'Unknown'}
                        fallback={(message.senderName || message.senderEmail || '?')
                          .slice(0, 2)
                          .toUpperCase()}
                        size="default"
                      />
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground truncate">
                            {message.senderName || message.senderEmail || 'Unknown Sender'}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatTimestamp(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm font-medium truncate mb-1">{message.subject}</p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={statusConfig[message.status].className}
                          >
                            {statusConfig[message.status].label}
                          </Badge>
                          <Icon className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filteredMessages.length === 0 && (
                <div className="p-8 text-center">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No messages found</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <Card className="p-6">
              {/* Message Header */}
              <div className="border-b border-border pb-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedMessage.senderName || selectedMessage.senderEmail}`}
                      alt={selectedMessage.senderName || selectedMessage.senderEmail || 'Unknown'}
                      fallback={(selectedMessage.senderName || selectedMessage.senderEmail || '?')
                        .slice(0, 2)
                        .toUpperCase()}
                      size="default"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {selectedMessage.senderName ||
                          selectedMessage.senderEmail ||
                          'Unknown Sender'}
                      </h3>
                      {selectedMessage.senderEmail && (
                        <p className="text-xs text-muted-foreground">
                          {selectedMessage.senderEmail}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={statusConfig[selectedMessage.status].className}
                    >
                      {statusConfig[selectedMessage.status].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(selectedMessage.createdAt)}
                    </span>
                  </div>
                </div>
                <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
              </div>

              {/* Message Body */}
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{selectedMessage.body}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-border">
                <Button variant="outline">Reply</Button>
                <Button variant="outline">Forward</Button>
                <Button variant="outline">Archive</Button>
              </div>
            </Card>
          ) : (
            <Card className="flex h-[600px] items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No message selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select a message to view its contents
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
}
