'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Pin, Trash2, MoreVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  isPinned: boolean;
  lastMessageAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ConversationSidebar({
  conversations,
  currentId,
  onSelect,
  onNew,
  onDelete,
  onPin,
  isOpen,
  onClose,
}: ConversationSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and group conversations
  const { pinned, today, yesterday, thisWeek, older } = useMemo(() => {
    const filtered = conversations.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const pinnedList = filtered.filter((c) => c.isPinned);
    const unpinned = filtered.filter((c) => !c.isPinned);

    return {
      pinned: pinnedList,
      today: unpinned.filter((c) => isToday(c.updatedAt)),
      yesterday: unpinned.filter((c) => isYesterday(c.updatedAt) && !isToday(c.updatedAt)),
      thisWeek: unpinned.filter(
        (c) => isThisWeek(c.updatedAt) && !isYesterday(c.updatedAt) && !isToday(c.updatedAt),
      ),
      older: unpinned.filter((c) => !isThisWeek(c.updatedAt)),
    };
  }, [conversations, searchQuery]);

  const ConversationGroup = ({
    title,
    conversations,
  }: {
    title: string;
    conversations: Conversation[];
  }) => {
    if (conversations.length === 0) return null;

    return (
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wide">
          {title}
        </h3>
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === currentId}
            onSelect={() => onSelect(conv.id)}
            onDelete={() => onDelete(conv.id)}
            onPin={() => onPin(conv.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar - always visible on desktop, toggleable on mobile */}
      <aside
        className={cn(
          'w-80 border-r bg-card flex flex-col h-full',
          'fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto',
          'transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'lg:flex', // Always show on desktop
        )}
      >
        {/* Header */}
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Conversations</h2>
            <div className="flex items-center gap-1">
              <Button size="sm" onClick={onNew} className="h-8">
                <Plus className="size-4 mr-1" /> New
              </Button>
              <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8 lg:hidden">
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No conversations yet</p>
              <Button size="sm" onClick={onNew} className="mt-4">
                <Plus className="size-4 mr-1" /> Start chatting
              </Button>
            </div>
          ) : (
            <div className="py-2 space-y-4">
              <ConversationGroup title="Pinned" conversations={pinned} />
              <ConversationGroup title="Today" conversations={today} />
              <ConversationGroup title="Yesterday" conversations={yesterday} />
              <ConversationGroup title="This Week" conversations={thisWeek} />
              <ConversationGroup title="Older" conversations={older} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onDelete,
  onPin,
}: {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onPin: () => void;
}) {
  return (
    <div
      className={cn(
        'group relative px-3 py-2 rounded-lg mx-2 cursor-pointer transition-all',
        'hover:bg-accent',
        isActive && 'bg-accent border-l-2 border-primary',
      )}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {conversation.isPinned && <Pin className="size-3 text-primary shrink-0" />}
            <h4 className="text-sm font-medium truncate">{conversation.title}</h4>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{conversation.messageCount} messages</span>
            {conversation.lastMessageAt && (
              <>
                <span>•</span>
                <span>{format(conversation.lastMessageAt, 'MMM d')}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onPin();
              }}
            >
              <Pin className="size-3 mr-2" />
              {conversation.isPinned ? 'Unpin' : 'Pin'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive"
            >
              <Trash2 className="size-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
