/**
 * Floating AI Assistant
 *
 * Always-visible AI assistant that floats in bottom-right corner.
 * Expands to full chat interface when clicked.
 *
 * Features:
 * - Sticky positioning (always visible)
 * - Expandable/collapsible
 * - Minimizable
 * - Mobile responsive
 * - Keyboard accessible
 */

'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AssistantChat } from './AssistantChat';
import { useAuth } from '@clerk/nextjs';

export interface FloatingAssistantProps {
  /** Initial state - open or closed */
  defaultOpen?: boolean;
  /** Auto-open on first visit */
  autoOpenOnFirstVisit?: boolean;
}

export function FloatingAssistant({
  defaultOpen = false,
  autoOpenOnFirstVisit = true,
}: FloatingAssistantProps) {
  const { isSignedIn, userId } = useAuth();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Auto-open on first visit
  useEffect(() => {
    if (!isSignedIn) return;

    const hasVisited = localStorage.getItem('assistant-visited');
    if (!hasVisited && autoOpenOnFirstVisit) {
      setIsOpen(true);
      localStorage.setItem('assistant-visited', 'true');
    }
  }, [isSignedIn, autoOpenOnFirstVisit]);

  // Don't show if user not signed in
  if (!isSignedIn) return null;

  return (
    <>
      {/* Floating Bubble (When Closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'h-14 w-14 rounded-full',
            'bg-gradient-to-br from-purple-600 to-blue-600',
            'text-white shadow-lg hover:shadow-xl',
            'transition-all duration-200',
            'flex items-center justify-center',
            'hover:scale-110',
            'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
          )}
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="h-6 w-6" />

          {/* Notification Dot */}
          {hasNewMessage && (
            <span
              className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white animate-pulse"
              aria-label="New message"
            />
          )}

          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-full bg-purple-600 opacity-75 animate-ping" />
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50',
            'bg-background border rounded-lg shadow-2xl',
            'transition-all duration-300 ease-in-out',
            // Desktop sizing
            'hidden md:flex flex-col',
            isMinimized ? 'h-16 w-96' : 'h-[600px] w-[400px]',
            // Mobile full-screen
            'md:block',
            'max-md:fixed max-md:inset-0 max-md:rounded-none max-md:h-full max-md:w-full',
          )}
          role="dialog"
          aria-label="AI Assistant Chat"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="flex items-center gap-3">
              {/* AI Avatar */}
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              {/* Title */}
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  {isMinimized ? 'Minimized' : 'I can do anything you ask'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Minimize/Maximize */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
                aria-label={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>

              {/* Close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Interface */}
          {!isMinimized && (
            <div className="flex-1 flex flex-col min-h-0">
              <AssistantChat
                userId={userId!}
                onNewMessage={() => setHasNewMessage(true)}
                onMessageRead={() => setHasNewMessage(false)}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}
