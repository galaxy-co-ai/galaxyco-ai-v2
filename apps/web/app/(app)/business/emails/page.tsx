'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import { Plus, Search, Inbox, Send, FilePlus, Trash2, Star, Mail, MailOpen } from 'lucide-react';

interface EmailThread {
  id: string;
  workspaceId: string;
  subject: string;
  snippet: string;
  messageCount: number;
  participants: any;
  isStarred: boolean;
  isRead: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  labels: string[] | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

const folderConfig: Record<string, { label: string; icon: typeof Inbox; color: string }> = {
  inbox: {
    label: 'Inbox',
    icon: Inbox,
    color: 'text-blue-600 dark:text-blue-400',
  },
  sent: {
    label: 'Sent',
    icon: Send,
    color: 'text-green-600 dark:text-green-400',
  },
  drafts: {
    label: 'Drafts',
    icon: FilePlus,
    color: 'text-yellow-600 dark:text-yellow-400',
  },
  trash: {
    label: 'Trash',
    icon: Trash2,
    color: 'text-red-600 dark:text-red-400',
  },
};

export default function EmailsPage() {
  const { currentWorkspace } = useWorkspace();
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('inbox');

  useEffect(() => {
    async function fetchThreads() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/emails?workspaceId=${currentWorkspace.id}&limit=100`);
        if (!res.ok) throw new Error('Failed to fetch email threads');
        const data = await res.json();
        setThreads(data.threads || []);
      } catch (error) {
        console.error('Failed to fetch email threads:', error);
        toast.error('Failed to load emails');
      } finally {
        setIsLoading(false);
      }
    }

    fetchThreads();
  }, [currentWorkspace?.id]);

  const filteredThreads = threads.filter(
    (thread) =>
      (selectedFolder === 'all' || thread.folder === selectedFolder) &&
      (searchQuery === ''
        ? true
        : thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          thread.snippet.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const folderCounts = {
    inbox: threads.filter((t) => t.folder === 'inbox').length,
    sent: threads.filter((t) => t.folder === 'sent').length,
    drafts: threads.filter((t) => t.folder === 'drafts').length,
    trash: threads.filter((t) => t.folder === 'trash').length,
  };

  const unreadCount = threads.filter((t) => !t.isRead).length;
  const starredCount = threads.filter((t) => t.isStarred).length;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageShell
      title="Email"
      subtitle="Manage your email threads and messages"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Email' }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Compose
        </Button>
      }
    >
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFolder('inbox')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedFolder === 'inbox'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <Inbox className="h-4 w-4" />
                <span className="flex-1 text-left">Inbox</span>
                <span className="text-xs">{folderCounts.inbox}</span>
              </button>

              <button
                onClick={() => setSelectedFolder('sent')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedFolder === 'sent'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <Send className="h-4 w-4" />
                <span className="flex-1 text-left">Sent</span>
                <span className="text-xs">{folderCounts.sent}</span>
              </button>

              <button
                onClick={() => setSelectedFolder('drafts')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedFolder === 'drafts'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <FilePlus className="h-4 w-4" />
                <span className="flex-1 text-left">Drafts</span>
                <span className="text-xs">{folderCounts.drafts}</span>
              </button>

              <button
                onClick={() => setSelectedFolder('trash')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedFolder === 'trash'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <Trash2 className="h-4 w-4" />
                <span className="flex-1 text-left">Trash</span>
                <span className="text-xs">{folderCounts.trash}</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Unread</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{unreadCount}</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Starred</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{starredCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Threads */}
          <div className="space-y-2">
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread) => {
                const FolderIcon = folderConfig[thread.folder]?.icon || Inbox;

                return (
                  <div
                    key={thread.id}
                    className={`rounded-lg border border-border bg-card p-4 hover:border-primary hover:shadow-sm transition-all cursor-pointer ${
                      !thread.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {thread.isRead ? (
                          <MailOpen className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                            className={`font-semibold text-sm truncate ${
                              !thread.isRead ? 'font-bold' : ''
                            }`}
                          >
                            {thread.subject || '(No subject)'}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(thread.lastMessageAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {thread.snippet}
                        </p>

                        <div className="flex items-center gap-2">
                          {thread.isStarred && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                          <Badge variant="outline" className="text-xs h-5 px-2">
                            <FolderIcon className="h-3 w-3 mr-1" />
                            {folderConfig[thread.folder]?.label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {thread.messageCount}{' '}
                            {thread.messageCount === 1 ? 'message' : 'messages'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center border border-border rounded-lg">
                <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No emails in {folderConfig[selectedFolder]?.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your {folderConfig[selectedFolder]?.label.toLowerCase()} is empty
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
