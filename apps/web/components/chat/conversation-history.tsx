"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Search, Trash2, Pin, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  isPinned: boolean;
  lastMessageAt: Date | null;
  messageCount: number;
}

interface ConversationHistoryProps {
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export function ConversationHistory({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const res = await fetch("/api/ai/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;
    
    try {
      const res = await fetch(`/api/ai/conversations/${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        onDeleteConversation(id);
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  }

  async function handlePin(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    
    try {
      const res = await fetch(`/api/ai/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_pin" }),
      });
      
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, isPinned: !c.isPinned } : c
          )
        );
      }
    } catch (error) {
      console.error("Failed to pin conversation:", error);
    }
  }

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConvos = filteredConversations.filter((c) => c.isPinned);
  const unpinnedConvos = filteredConversations.filter((c) => !c.isPinned);

  return (
    <div className="flex h-full flex-col bg-card border-r">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-sm font-semibold">Conversations</h2>
        <button
          onClick={onNewConversation}
          className="p-1.5 hover:bg-muted rounded-md transition-colors"
          aria-label="New conversation"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pinned */}
            {pinnedConvos.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                  Pinned
                </p>
                {pinnedConvos.map((convo) => (
                  <ConversationItem
                    key={convo.id}
                    conversation={convo}
                    isActive={convo.id === currentConversationId}
                    onSelect={onSelectConversation}
                    onDelete={handleDelete}
                    onPin={handlePin}
                  />
                ))}
              </div>
            )}

            {/* Recent */}
            {unpinnedConvos.length > 0 ? (
              <div>
                {pinnedConvos.length > 0 && (
                  <p className="text-xs font-medium text-muted-foreground px-2 py-1">
                    Recent
                  </p>
                )}
                {unpinnedConvos.map((convo) => (
                  <ConversationItem
                    key={convo.id}
                    conversation={convo}
                    isActive={convo.id === currentConversationId}
                    onSelect={onSelectConversation}
                    onDelete={handleDelete}
                    onPin={handlePin}
                  />
                ))}
              </div>
            ) : !loading && conversations.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No conversations yet.
                <br />
                Start chatting to create one!
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
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
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onPin: (id: string, e: React.MouseEvent) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={cn(
        "group relative px-2 py-2 rounded-lg cursor-pointer transition-colors mb-1",
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted text-foreground"
      )}
      onClick={() => onSelect(conversation.id)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{conversation.title}</p>
          <p className="text-xs text-muted-foreground">
            {conversation.messageCount} messages
          </p>
        </div>

        {(showActions || conversation.isPinned) && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => onPin(conversation.id, e)}
              className={cn(
                "p-1 rounded hover:bg-background transition-colors",
                conversation.isPinned ? "text-primary" : "text-muted-foreground"
              )}
              aria-label={conversation.isPinned ? "Unpin" : "Pin"}
            >
              <Pin className="w-3 h-3" />
            </button>
            {showActions && (
              <button
                onClick={(e) => onDelete(conversation.id, e)}
                className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
