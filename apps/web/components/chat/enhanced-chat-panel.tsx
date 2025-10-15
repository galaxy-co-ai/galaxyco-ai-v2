'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/use-chat';
import { ChatMessageComponent } from './chat-message';
import { 
  Bot, 
  Send, 
  X, 
  Trash2, 
  Plus, 
  Search, 
  Pin, 
  PinOff,
  MessageSquare,
  ChevronLeft,
  Clock,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Conversation {
  id: string;
  title: string;
  lastMessageAt: string;
  messageCount: number;
  isPinned: boolean;
  tags: string[];
}

interface ContextPill {
  type: 'page' | 'item' | 'document';
  label: string;
  value: string;
}

interface EnhancedChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string | null;
  context?: {
    page?: string;
    selectedItems?: Record<string, string>;
    documentIds?: string[];
  };
}

export function EnhancedChatPanel({ 
  isOpen, 
  onClose, 
  conversationId: initialConversationId,
  context 
}: EnhancedChatPanelProps) {
  const { messages, input, setInput, send, clear, isTyping, conversationId } = useChat(initialConversationId);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  // Load conversations
  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const response = await fetch('/api/ai/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
    setLoadingConversations(false);
  };

  const createNewConversation = () => {
    // Clear current conversation to start fresh
    clear();
  };

  const deleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/ai/conversations/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (conversationId === id) {
          clear();
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const pinConversation = async (id: string, isPinned: boolean) => {
    try {
      const response = await fetch(`/api/ai/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !isPinned }),
      });
      if (response.ok) {
        setConversations(prev => prev.map(c => 
          c.id === id ? { ...c, isPinned: !isPinned } : c
        ));
      }
    } catch (error) {
      console.error('Failed to pin conversation:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send();
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort conversations (pinned first, then by last message)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });

  // Generate context pills
  const contextPills: ContextPill[] = [];
  if (context?.page) {
    contextPills.push({
      type: 'page',
      label: 'Page',
      value: context.page.replace(/^\//, '').replace(/\//g, ' › ') || 'Dashboard'
    });
  }
  if (context?.selectedItems) {
    Object.entries(context.selectedItems).forEach(([key, value]) => {
      contextPills.push({
        type: 'item',
        label: key,
        value: value
      });
    });
  }
  if (context?.documentIds?.length) {
    contextPills.push({
      type: 'document',
      label: 'Documents',
      value: `${context.documentIds.length} selected`
    });
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-end justify-end p-4 md:items-center md:p-0">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 flex h-[600px] w-full rounded-lg border bg-white shadow-2xl dark:bg-neutral-900 md:m-4 md:h-[700px] md:w-[800px]">
        
        {/* Conversation Sidebar */}
        {showSidebar && (
          <div className="w-80 border-r bg-muted/30 flex flex-col">
            {/* Sidebar Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Conversations</h3>
                <Button onClick={createNewConversation} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2">
              {loadingConversations ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : sortedConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
                  <p className="font-medium">No conversations yet</p>
                  <p className="text-sm mt-1">Start a new conversation to get started</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sortedConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={cn(
                        "group relative p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                        conversationId === conversation.id && "bg-muted"
                      )}
                      onClick={() => {
                        // Load this conversation - this would need to be handled by the parent component
                        window.location.hash = `conversation=${conversation.id}`;
                      }}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium truncate text-sm">
                          {conversation.title}
                        </h4>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              pinConversation(conversation.id, conversation.isPinned);
                            }}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {conversation.isPinned ? (
                              <PinOff className="h-3 w-3" />
                            ) : (
                              <Pin className="h-3 w-3" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conversation.id);
                            }}
                            className="p-1 hover:bg-muted rounded text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(conversation.lastMessageAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{conversation.messageCount} messages</span>
                          {conversation.isPinned && (
                            <Pin className="h-3 w-3 fill-current" />
                          )}
                        </div>
                      </div>

                      {conversation.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {conversation.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                              <Hash className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                          {conversation.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              +{conversation.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              {showSidebar ? (
                <button
                  onClick={() => setShowSidebar(false)}
                  className="md:hidden p-1 hover:bg-muted rounded"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              )}
              
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  AI Assistant
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {conversationId ? 'Active conversation' : 'Ready to help'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={clear}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Context Pills */}
          {contextPills.length > 0 && (
            <div className="border-b px-4 py-2">
              <div className="flex flex-wrap gap-2">
                {contextPills.map((pill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {pill.label}: {pill.value}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <Bot className="h-12 w-12 text-neutral-400" />
                <h4 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-100">
                  Start a conversation
                </h4>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  Ask me about agents, workflows, prospects, or anything else!
                </p>
                {contextPills.length > 0 && (
                  <p className="mt-2 text-xs text-neutral-500">
                    I can see you're on {contextPills[0]?.value} - I'll use this context to help you better.
                  </p>
                )}
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessageComponent key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex gap-3 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-neutral-100 px-4 py-2 dark:bg-neutral-800">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-600 [animation-delay:-0.3s] dark:bg-neutral-400" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-600 [animation-delay:-0.15s] dark:bg-neutral-400" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-600 dark:bg-neutral-400" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-md border bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:bg-neutral-950"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white transition-opacity hover:bg-primary/90',
                  (!input.trim() || isTyping) && 'cursor-not-allowed opacity-50'
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}