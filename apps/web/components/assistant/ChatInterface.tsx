/**
 * GalaxyCo.ai ChatInterface
 * Main container component for the AI assistant chat
 * November 2, 2025
 */

'use client';

import React, { useState, useCallback } from 'react';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    files?: File[];
    toolResults?: any;
  };
}

interface ChatInterfaceProps {
  conversationId?: string;
  initialMessages?: Message[];
  onSendMessage?: (message: string, files?: File[]) => Promise<void>;
}

export function ChatInterface({
  conversationId,
  initialMessages = [],
  onSendMessage,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(
    async (content: string, files?: File[]) => {
      if (!content.trim() && !files?.length) return;

      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
        metadata: { files },
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // Call the provided onSendMessage handler or default to a mock
        if (onSendMessage) {
          await onSendMessage(content, files);
        } else {
          // Mock response for now (Hour 3 will implement real streaming)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const assistantMessage: Message = {
            id: `msg-${Date.now()}-assistant`,
            role: 'assistant',
            content: `I received your message: "${content}". Streaming responses will be implemented in Hour 3!`,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [onSendMessage],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto">
          <InputArea onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
