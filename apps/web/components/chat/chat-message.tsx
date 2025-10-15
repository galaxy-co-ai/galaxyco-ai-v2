import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/hooks/use-chat';

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={cn('flex gap-3 p-4', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser && 'bg-primary text-white',
          !isUser && 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div className={cn('flex flex-col gap-1', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-lg px-4 py-2 text-sm',
            isUser && 'bg-primary text-white',
            !isUser && !isSystem && 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
            isSystem && 'border border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-200'
          )}
        >
          {message.content}
        </div>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
