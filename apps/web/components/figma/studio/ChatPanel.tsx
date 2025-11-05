/**
 * Chat Panel - Figma Studio Component
 * Left panel with AI assistant chat interface
 * Matches Figma design exactly
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChatPanelProps {
  className?: string;
}

export function ChatPanel({ className }: ChatPanelProps) {
  const [message, setMessage] = useState(
    'I want an agent that monitors my inbox for invoice emails, extracts the important details, and adds them to my accounting software...',
  );

  return (
    <Card className={cn('figma-card flex flex-col h-[calc(100vh-16rem)]', className)}>
      {/* Header */}
      <div className="p-6 border-b">
        <h3 className="font-semibold text-base">Chat</h3>
        <p className="text-sm text-muted-foreground">Describe what you want</p>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {/* AI Assistant Message */}
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm">
                  Hi! I&apos;m your AI assistant. Tell me what kind of agent you&apos;d like to
                  create, and I&apos;ll help you build it step by step.
                </p>
                <p className="text-sm mt-3 font-medium">I can help with:</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Email automation and triage</li>
                  <li>• CRM data management</li>
                  <li>• Document processing</li>
                  <li>• Meeting transcription and notes</li>
                  <li>• Custom workflows</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 border-t">
        <div className="space-y-3">
          <Textarea
            placeholder="Describe what you want your agent to do..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setMessage('')}>
              Clear
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary-hover">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
