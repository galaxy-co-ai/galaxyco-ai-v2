"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Send,
  Search,
  Star,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  sender: {
    name: string;
    avatar: string;
    isCurrentUser: boolean;
  };
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  participants: Array<{
    name: string;
    avatar: string;
  }>;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isStarred: boolean;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "conv_001",
    participants: [
      {
        name: "Sarah Johnson",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
      },
    ],
    lastMessage: "Can you review the sales playbook updates?",
    timestamp: "2025-01-16T11:45:00Z",
    unreadCount: 2,
    isStarred: true,
    messages: [
      {
        id: "msg_001",
        sender: {
          name: "Sarah Johnson",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
          isCurrentUser: false,
        },
        content:
          "Hey! I've updated the sales playbook with the new pricing guidelines.",
        timestamp: "2025-01-16T11:30:00Z",
      },
      {
        id: "msg_002",
        sender: {
          name: "You",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=YOU",
          isCurrentUser: true,
        },
        content: "Thanks! I'll take a look this afternoon.",
        timestamp: "2025-01-16T11:35:00Z",
      },
      {
        id: "msg_003",
        sender: {
          name: "Sarah Johnson",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SJ",
          isCurrentUser: false,
        },
        content: "Can you review the sales playbook updates?",
        timestamp: "2025-01-16T11:45:00Z",
      },
    ],
  },
  {
    id: "conv_002",
    participants: [
      {
        name: "Michael Chen",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MC",
      },
    ],
    lastMessage: "The deployment went smoothly!",
    timestamp: "2025-01-16T10:30:00Z",
    unreadCount: 0,
    isStarred: false,
    messages: [
      {
        id: "msg_004",
        sender: {
          name: "You",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=YOU",
          isCurrentUser: true,
        },
        content: "How did the production deployment go?",
        timestamp: "2025-01-16T10:15:00Z",
      },
      {
        id: "msg_005",
        sender: {
          name: "Michael Chen",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MC",
          isCurrentUser: false,
        },
        content: "The deployment went smoothly!",
        timestamp: "2025-01-16T10:30:00Z",
      },
    ],
  },
  {
    id: "conv_003",
    participants: [
      {
        name: "Emily Rodriguez",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ER",
      },
    ],
    lastMessage: "I'll send over the designs by EOD",
    timestamp: "2025-01-16T09:15:00Z",
    unreadCount: 1,
    isStarred: true,
    messages: [
      {
        id: "msg_006",
        sender: {
          name: "You",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=YOU",
          isCurrentUser: true,
        },
        content: "Do you have the new dashboard designs ready?",
        timestamp: "2025-01-16T09:00:00Z",
      },
      {
        id: "msg_007",
        sender: {
          name: "Emily Rodriguez",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=ER",
          isCurrentUser: false,
        },
        content: "I'll send over the designs by EOD",
        timestamp: "2025-01-16T09:15:00Z",
      },
    ],
  },
  {
    id: "conv_004",
    participants: [
      {
        name: "David Park",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DP",
      },
    ],
    lastMessage: "All systems are running normally",
    timestamp: "2025-01-15T18:45:00Z",
    unreadCount: 0,
    isStarred: false,
    messages: [
      {
        id: "msg_008",
        sender: {
          name: "David Park",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DP",
          isCurrentUser: false,
        },
        content: "All systems are running normally",
        timestamp: "2025-01-15T18:45:00Z",
      },
    ],
  },
  {
    id: "conv_005",
    participants: [
      {
        name: "Jessica Liu",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JL",
      },
    ],
    lastMessage: "The campaign results look great!",
    timestamp: "2025-01-15T16:20:00Z",
    unreadCount: 0,
    isStarred: false,
    messages: [
      {
        id: "msg_009",
        sender: {
          name: "Jessica Liu",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JL",
          isCurrentUser: false,
        },
        content: "The campaign results look great!",
        timestamp: "2025-01-15T16:20:00Z",
      },
    ],
  },
  {
    id: "conv_006",
    participants: [
      {
        name: "Alex Thompson",
        avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AT",
      },
    ],
    lastMessage: "Found a bug in the authentication flow",
    timestamp: "2025-01-15T14:10:00Z",
    unreadCount: 3,
    isStarred: false,
    messages: [
      {
        id: "msg_010",
        sender: {
          name: "Alex Thompson",
          avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AT",
          isCurrentUser: false,
        },
        content: "Found a bug in the authentication flow",
        timestamp: "2025-01-15T14:10:00Z",
      },
    ],
  },
];

function formatTimestamp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    const diffInDays = Math.floor(diffInMinutes / 1440);
    return diffInDays === 1 ? "Yesterday" : `${diffInDays}d ago`;
  }
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full border-b border-border p-4 text-left transition-colors hover:bg-muted/50 ${
        isActive ? "bg-muted" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar
            src={conversation.participants[0].avatar}
            alt={conversation.participants[0].name}
            fallback={conversation.participants[0].name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            size="default"
          />
          {conversation.unreadCount > 0 && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {conversation.unreadCount}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground">
              {conversation.participants[0].name}
            </h4>
            <div className="flex items-center gap-2">
              {conversation.isStarred && (
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              )}
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(conversation.timestamp)}
              </span>
            </div>
          </div>
          <p
            className={`mt-1 truncate text-sm ${
              conversation.unreadCount > 0
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {conversation.lastMessage}
          </p>
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div
      className={`flex gap-3 ${message.sender.isCurrentUser ? "flex-row-reverse" : ""}`}
    >
      <Avatar
        src={message.sender.avatar}
        alt={message.sender.name}
        fallback={message.sender.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
        size="sm"
      />
      <div
        className={`flex-1 ${message.sender.isCurrentUser ? "flex justify-end" : ""}`}
      >
        <div
          className={`inline-block max-w-md rounded-lg p-3 ${
            message.sender.isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(mockConversations[0]);
  const [messageInput, setMessageInput] = useState("");

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch = conv.participants.some((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.unreadCount > 0) ||
      (filter === "starred" && conv.isStarred);

    return matchesSearch && matchesFilter;
  });

  const unreadCount = mockConversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0,
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    // In a real app, this would send the message to the backend
    setMessageInput("");
  };

  return (
    <PageShell
      title="Inbox"
      subtitle={`${unreadCount} unread messages`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Inbox" },
      ]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversation List */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="border-b border-border p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Messages</SelectItem>
                  <SelectItem value="unread">
                    Unread (
                    {mockConversations.filter((c) => c.unreadCount > 0).length})
                  </SelectItem>
                  <SelectItem value="starred">
                    Starred (
                    {mockConversations.filter((c) => c.isStarred).length})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                />
              ))}
              {filteredConversations.length === 0 && (
                <div className="p-8 text-center">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No conversations found
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="flex h-[700px] flex-col">
              {/* Thread Header */}
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={selectedConversation.participants[0].avatar}
                    alt={selectedConversation.participants[0].name}
                    fallback={selectedConversation.participants[0].name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                    size="default"
                  />
                  <div>
                    <h3 className="font-semibold">
                      {selectedConversation.participants[0].name}
                    </h3>
                    <p className="text-xs text-muted-foreground">Active now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Star
                      className={`h-4 w-4 ${
                        selectedConversation.isStarred
                          ? "fill-yellow-500 text-yellow-500"
                          : ""
                      }`}
                    />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {selectedConversation.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex h-[700px] items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  No conversation selected
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a conversation to start messaging
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
}
