import { Metadata } from 'next';
import { Search, Phone, Video, MoreVertical, Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';

export const metadata: Metadata = {
  title: 'Chat | GalaxyCo.ai',
  description: 'Mobile messaging',
};

// Mock conversations
const conversations = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'Thanks for the update!',
    timestamp: '2m ago',
    unread: 2,
    avatar: 'SJ',
    online: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    lastMessage: 'Can we schedule a call?',
    timestamp: '15m ago',
    unread: 0,
    avatar: 'MC',
    online: true,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    lastMessage: 'Sent you the files',
    timestamp: '1h ago',
    unread: 1,
    avatar: 'ER',
    online: false,
  },
  {
    id: '4',
    name: 'Team - Marketing',
    lastMessage: "David: Let's review tomorrow",
    timestamp: '2h ago',
    unread: 5,
    avatar: 'TM',
    online: false,
  },
];

export default function MobileChatPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <h1 className="text-xl font-semibold mb-3">Messages</h1>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 h-10"
            aria-label="Search conversations"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="border-b border-border px-4 py-4 active:bg-background-subtle transition-colors"
          >
            <div className="flex items-start gap-3">
              {/* Avatar with Online Indicator */}
              <div className="relative">
                <Avatar fallback={conversation.avatar} size="lg" />
                {conversation.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-success rounded-full border-2 border-background" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-base truncate">{conversation.name}</h3>
                  <span className="text-xs text-foreground-muted ml-2 shrink-0">
                    {conversation.timestamp}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-foreground-muted truncate flex-1">
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <div className="ml-2 h-5 min-w-5 px-1.5 bg-primary text-primary-foreground rounded-full text-xs font-medium flex items-center justify-center shrink-0">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {conversations.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-background-subtle flex items-center justify-center mb-4">
            <Send className="h-8 w-8 text-foreground-muted" />
          </div>
          <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
          <p className="text-sm text-foreground-muted">Start a conversation with your team</p>
        </div>
      )}
    </div>
  );
}
