'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/use-chat';
import { ChatMessageComponent } from './chat-message';
import { Bot, Send, X, Trash2, MessageSquare, Search, ChevronLeft, Pin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string | null;
}

interface Conversation {
  id: string;
  title: string;
  isPinned: boolean;
  lastMessageAt: Date;
  messageCount: number;
}

export function ChatPanel({ isOpen, onClose, conversationId }: ChatPanelProps) {
  const { messages, input, setInput, send, clear, isTyping } = useChat(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && showHistory) {
      loadConversations();
    }
  }, [isOpen, showHistory]);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(
          data.conversations.map((c: any) => ({
            id: c.id,
            title: c.title || 'New conversation',
            isPinned: c.isPinned || false,
            lastMessageAt: new Date(c.lastMessageAt || c.createdAt),
            messageCount: c.messageCount || 0,
          })),
        );
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const handleSelectConversation = (id: string) => {
    window.location.href = `?conversationId=${id}`;
    setShowHistory(false);
  };

  const handleDeleteConversation = async (id: string) => {
    if (!confirm('Delete this conversation?')) return;
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-modal flex items-end justify-end p-4 md:items-center md:p-0">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          'relative z-10 flex h-[600px] w-full flex-col rounded-lg border bg-white shadow-2xl dark:bg-neutral-900 md:m-4 md:h-[700px] transition-all',
          showHistory ? 'md:w-[720px]' : 'md:w-[420px]',
        )}
      >
        <div className="flex h-full">
          {/* Conversation History Sidebar */}
          {showHistory && (
            <div className="w-64 border-r bg-neutral-50 dark:bg-neutral-950 flex flex-col">
              {/* Sidebar Header */}
              <div className="border-b p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Conversations</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-neutral-200 dark:hover:bg-neutral-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-2 py-1.5 text-xs border rounded bg-white dark:bg-neutral-900 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loadingConversations ? (
                  <div className="p-4 text-center text-sm text-neutral-500">Loading...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-500">
                    No conversations yet
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {conversations
                      .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .sort((a, b) => {
                        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
                        return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
                      })
                      .map((conv) => (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv.id)}
                          className={cn(
                            'group relative p-2 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors',
                            conversationId === conv.id && 'bg-primary/10 hover:bg-primary/15',
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {conv.isPinned && (
                              <Pin className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{conv.title}</p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500">
                                <Clock className="h-2.5 w-2.5" />
                                <span>{format(conv.lastMessageAt, 'MMM d, h:mm a')}</span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConversation(conv.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 h-6 w-6 flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-primary/10 to-purple-500/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100">
                    🚀 GalaxyCo AI Assistant
                  </h3>
                  <p className="text-xs font-medium text-primary">Your badass automation expert</p>
                </div>
              </div>
              <div className="flex gap-1">
                {!showHistory && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    title="Conversation history"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                )}
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

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-xl" />
                    <Bot className="relative h-16 w-16 text-primary" />
                  </div>
                  <h4 className="mt-6 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    🔥 Let&apos;s automate your business!
                  </h4>
                  <p className="mt-3 max-w-xs text-sm text-neutral-600 dark:text-neutral-400">
                    I&apos;m your AI automation expert. Ask me about:
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-primary/10 px-3 py-2 text-primary font-medium">
                      🤖 Creating agents
                    </div>
                    <div className="rounded-lg bg-purple-500/10 px-3 py-2 text-purple-600 font-medium">
                      🔄 Building workflows
                    </div>
                    <div className="rounded-lg bg-green-500/10 px-3 py-2 text-green-600 font-medium">
                      📊 Analytics insights
                    </div>
                    <div className="rounded-lg bg-orange-500/10 px-3 py-2 text-orange-600 font-medium">
                      ⚙️ Optimizing performance
                    </div>
                  </div>
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
                  placeholder="💬 Ask your automation expert anything..."
                  className="flex-1 rounded-md border bg-white px-3 py-2 text-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:bg-neutral-950"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white transition-opacity hover:bg-primary/90',
                    (!input.trim() || isTyping) && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
