/**
 * Kibo UI - Code Block Component
 * Syntax-highlighted code block with copy functionality
 */

'use client';

import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import { useState, type HTMLAttributes } from 'react';

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLPreElement>, 'children'> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
  filename?: string;
}

export function CodeBlock({
  code,
  language = 'typescript',
  showLineNumbers = false,
  copyable = true,
  filename,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className={cn('group relative rounded-lg border bg-muted', className)}>
      {(filename || copyable) && (
        <div className="flex items-center justify-between border-b px-4 py-2">
          {filename && (
            <span className="text-sm font-medium text-muted-foreground">{filename}</span>
          )}
          {copyable && (
            <button
              onClick={handleCopy}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          )}
        </div>
      )}
      <pre className={cn('overflow-x-auto p-4 text-sm', className)} {...props}>
        <code className="font-mono">
          {showLineNumbers ? (
            <div className="flex">
              <div className="mr-4 select-none text-right text-muted-foreground">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="flex-1">{code}</div>
            </div>
          ) : (
            code
          )}
        </code>
      </pre>
    </div>
  );
}
