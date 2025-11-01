import { useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/utils/logger';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  lastMessageAt: string;
  messageCount: number;
}

export function useChat(conversationId?: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    conversationId ?? null,
  );
  const abortRef = useRef<AbortController | null>(null);

  // Load conversation messages when conversationId changes
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setCurrentConversationId(null);
      return;
    }

    const loadConversation = async () => {
      try {
        const res = await fetch(`/api/ai/conversations/${conversationId}`);
        if (!res.ok) throw new Error('Failed to load conversation');
        const data = await res.json();
        const loadedMessages: ChatMessage[] = (data.messages || []).map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: new Date(m.createdAt).getTime(),
        }));
        setMessages(loadedMessages);
        setCurrentConversationId(conversationId);
      } catch (error) {
        logger.error('Failed to load conversation', {
          conversationId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    loadConversation();
  }, [conversationId]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: text },
          ],
          conversationId: currentConversationId,
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error('AI request failed');

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: data.messageId ?? crypto.randomUUID(),
        role: 'assistant',
        content: data.reply ?? 'No response',
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Update current conversation ID if this was a new conversation
      if (data.conversationId && !currentConversationId) {
        setCurrentConversationId(data.conversationId);
      }
    } catch (e) {
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'system',
        content: 'There was an issue contacting the AI. Please try again.',
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clear = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const stop = () => abortRef.current?.abort();

  return {
    messages,
    input,
    setInput,
    send,
    clear,
    stop,
    isTyping,
    conversationId: currentConversationId,
  };
}
