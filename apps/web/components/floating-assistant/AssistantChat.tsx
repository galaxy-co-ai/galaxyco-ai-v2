/**
 * Assistant Chat Component
 *
 * The main chat interface for the AI Assistant.
 * Features:
 * - Streaming responses
 * - Action visualization (show what AI is doing)
 * - Suggested follow-ups
 * - Message history
 * - Loading states
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export interface AssistantChatProps {
  userId: string;
  onNewMessage?: () => void;
  onMessageRead?: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: Action[];
  toolCalls?: ToolCall[];
  isStreaming?: boolean;
}

interface Action {
  type: 'navigate' | 'create' | 'update' | 'delete' | 'notify';
  target?: string;
  label?: string;
  status: 'pending' | 'completed' | 'failed';
}

interface ToolCall {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
}

export function AssistantChat({ userId, onNewMessage, onMessageRead }: AssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your AI assistant. I can help you with anything on the platform. Try asking me to:

• "Create an email triage agent"
• "Show me my agent analytics"
• "Connect my Gmail account"
• "Create a workflow for lead enrichment"

What would you like me to do?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call API to process message
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        actions: data.actions || [],
        toolCalls: data.toolCalls || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestedFollowUps(data.suggestedFollowUps || []);

      // Execute any actions (navigation, UI updates, etc.)
      if (data.actions) {
        executeActions(data.actions);
      }

      onNewMessage?.();
    } catch (error: any) {
      toast.error('Failed to send message. Please try again.');

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Could you try again?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Execute actions from AI
  const executeActions = (actions: Action[]) => {
    actions.forEach((action) => {
      switch (action.type) {
        case 'navigate':
          if (action.target) {
            toast.info(`Navigating to ${action.label || action.target}`);
            setTimeout(() => router.push(action.target!), 1000);
          }
          break;

        case 'create':
          toast.success(`Created ${action.label}`);
          break;

        case 'update':
          toast.success(`Updated ${action.label}`);
          break;

        case 'delete':
          toast.success(`Deleted ${action.label}`);
          break;

        case 'notify':
          toast.info(action.label || 'Action completed');
          break;
      }
    });
  };

  // Handle suggested follow-up click
  const handleFollowUpClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn('flex gap-3', message.role === 'user' && 'flex-row-reverse')}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600'
                    : 'bg-muted',
                )}
              >
                {message.role === 'assistant' ? (
                  <Sparkles className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-sm font-medium">{userId?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>

              {/* Message Content */}
              <div className={cn('flex-1 space-y-2', message.role === 'user' && 'items-end')}>
                {/* Message Bubble */}
                <div
                  className={cn(
                    'rounded-lg p-3 max-w-[85%]',
                    message.role === 'assistant'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground ml-auto',
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Actions (only for assistant messages) */}
                {message.role === 'assistant' && message.actions && (
                  <div className="space-y-1">
                    {message.actions.map((action, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        {action.status === 'completed' && (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        )}
                        {action.status === 'failed' && (
                          <AlertCircle className="h-3 w-3 text-red-600" />
                        )}
                        {action.status === 'pending' && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        <span>{action.label || action.type}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tool Calls */}
                {message.role === 'assistant' && message.toolCalls && (
                  <div className="flex flex-wrap gap-1">
                    {message.toolCalls.map((tool, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tool.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested Follow-ups */}
      {suggestedFollowUps.length > 0 && !isLoading && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {suggestedFollowUps.map((suggestion, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleFollowUpClick(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to do anything..."
            rows={2}
            className="resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
