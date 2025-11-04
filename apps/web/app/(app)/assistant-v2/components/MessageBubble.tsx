'use client';

import { motion } from 'framer-motion';
import { Copy, RotateCw, Check } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { ToolCallCard } from './ToolCallCard';
import { AssistantMessage } from '@/hooks/use-assistant-chat';

interface MessageBubbleProps {
  message: AssistantMessage & { toolInvocations?: any[] };
  onCopy?: () => void;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, onCopy, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  // Format timestamp
  const timestamp = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn('flex gap-4 px-6 py-4 group', isUser ? 'justify-end' : 'justify-start')}
    >
      {/* AI Avatar */}
      {!isUser && (
        <Avatar
          src="/ai-avatar.png"
          alt="AI Assistant"
          fallback="AI"
          className="size-10 shrink-0 bg-primary/10 text-primary font-bold"
        />
      )}

      {/* Message content */}
      <div className={cn('flex-1 max-w-3xl space-y-1.5', isUser && 'flex flex-col items-end')}>
        {/* Timestamp */}
        {timestamp && (
          <p className="text-xs text-muted-foreground px-1">
            {isUser ? 'You' : 'GalaxyCo AI'} • {timestamp}
          </p>
        )}

        {/* Message bubble */}
        <Card
          className={cn(
            'p-5 rounded-2xl transition-all duration-200',
            isUser
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-card hover:shadow-md border',
          )}
        >
          <div
            className={cn(
              'prose prose-sm max-w-none',
              isUser ? 'prose-invert' : 'dark:prose-invert',
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap m-0 text-primary-foreground">{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Code blocks
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const code = String(children).replace(/\n$/, '');
                    // Inline code doesn't have language class
                    const inline = !match;

                    return !inline && match ? (
                      <CodeBlock language={match[1]} code={code} />
                    ) : (
                      <code
                        className={cn(
                          'bg-muted px-1.5 py-0.5 rounded font-mono text-sm',
                          isUser && 'bg-primary-foreground/20',
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // Lists
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                  ),
                  // Paragraphs
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          {/* Tool invocations */}
          {message.toolInvocations && message.toolInvocations.length > 0 && (
            <div className="space-y-2">
              {message.toolInvocations.map((tool: any) => (
                <ToolCallCard key={tool.toolCallId} tool={tool} />
              ))}
            </div>
          )}
        </Card>

        {/* Message actions (hover to show) */}
        <div
          className={cn(
            'flex items-center gap-2 transition-opacity',
            'opacity-0 group-hover:opacity-100',
          )}
        >
          <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 text-xs">
            {copied ? (
              <>
                <Check className="size-3 mr-1" /> Copied!
              </>
            ) : (
              <>
                <Copy className="size-3 mr-1" /> Copy
              </>
            )}
          </Button>

          {!isUser && onRegenerate && (
            <Button size="sm" variant="ghost" onClick={onRegenerate} className="h-7 text-xs">
              <RotateCw className="size-3 mr-1" /> Regenerate
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
