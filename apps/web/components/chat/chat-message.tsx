'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Bot, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import type { ChatMessage } from '@/hooks/use-chat';

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (type: 'positive' | 'negative') => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId: message.id,
          feedbackType: type,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit feedback');

      setFeedback(type);
      toast.success('Thank you for your feedback!');
    } catch (err) {
      toast.error('Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('flex gap-3 p-4', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser && 'bg-primary text-white',
          !isUser && 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn('flex flex-col gap-1', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-lg px-4 py-2 text-sm',
            isUser && 'bg-primary text-white',
            !isUser && !isSystem && 'bg-neutral-100 text-foreground dark:bg-neutral-800',
            isSystem &&
              'border border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200',
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
        {/* Feedback buttons - only for assistant messages */}
        {message.role === 'assistant' && (
          <div className="mt-2 flex gap-1">
            <button
              onClick={() => handleFeedback('positive')}
              disabled={isSubmitting}
              className={cn(
                'rounded p-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800',
                feedback === 'positive' &&
                  'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                isSubmitting && 'opacity-50',
              )}
              title="Helpful"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleFeedback('negative')}
              disabled={isSubmitting}
              className={cn(
                'rounded p-1.5 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800',
                feedback === 'negative' &&
                  'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
                isSubmitting && 'opacity-50',
              )}
              title="Not helpful"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
