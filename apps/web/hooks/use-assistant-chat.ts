/**
 * Custom useChat hook for Assistant Page
 * Works with our streaming API endpoint
 */
'use client';

import { useState, useCallback, useRef } from 'react';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

export interface UseAssistantChatOptions {
  api?: string;
  conversationId?: string;
  body?: Record<string, any>;
  onFinish?: (message: AssistantMessage) => Promise<void>;
  onError?: (error: Error) => void;
}

export function useAssistantChat(options: UseAssistantChatOptions = {}) {
  const { api = '/api/assistant/chat', conversationId, body = {}, onFinish, onError } = options;

  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const append = useCallback(
    async (message: { role: string; content: string }) => {
      const userMessage: AssistantMessage = {
        id: crypto.randomUUID(),
        role: message.role as 'user' | 'assistant' | 'system',
        content: message.content,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            conversationId,
            ...body,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';
        let assistantMessageId = crypto.randomUUID();

        // Add placeholder assistant message
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            createdAt: new Date(),
          },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Parse SSE format: "data: text\n\n"
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  // Try to parse as JSON first (for structured data)
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    assistantContent += parsed.content;
                  } else if (typeof parsed === 'string') {
                    assistantContent += parsed;
                  }
                } catch {
                  // If not JSON, treat as plain text
                  assistantContent += data;
                }

                // Update message in real-time
                setMessages((prev) => {
                  const index = prev.findIndex((m) => m.id === assistantMessageId);
                  if (index >= 0) {
                    const updated = [...prev];
                    updated[index] = {
                      ...updated[index],
                      content: assistantContent,
                    };
                    return updated;
                  }
                  return prev;
                });
              } else if (line.trim() && !line.startsWith(':')) {
                // Plain text chunk
                assistantContent += line;
                setMessages((prev) => {
                  const index = prev.findIndex((m) => m.id === assistantMessageId);
                  if (index >= 0) {
                    const updated = [...prev];
                    updated[index] = {
                      ...updated[index],
                      content: assistantContent,
                    };
                    return updated;
                  }
                  return prev;
                });
              }
            }
          }
        }

        const assistantMessage: AssistantMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: assistantContent,
          createdAt: new Date(),
        };

        if (onFinish) {
          await onFinish(assistantMessage);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          if (onError) {
            onError(error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [api, conversationId, body, messages, onFinish, onError],
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

      await append({ role: 'user', content: input });
    },
    [input, isLoading, append],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    append,
    stop,
  };
}
