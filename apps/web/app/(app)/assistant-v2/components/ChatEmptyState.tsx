'use client';

import { Sparkles, Bot, TrendingUp, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatEmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

const prompts = [
  {
    icon: Bot,
    title: 'Create an agent',
    prompt: 'Help me create an AI agent that handles customer support emails',
  },
  {
    icon: TrendingUp,
    title: 'Analyze sales',
    prompt: 'Analyze my sales data for the last 30 days and show trends',
  },
  {
    icon: Search,
    title: 'Find customers',
    prompt: 'Search for all customers in the tech industry',
  },
  {
    icon: Zap,
    title: 'Optimize workflows',
    prompt: 'Review my workflows and suggest performance improvements',
  },
];

export function ChatEmptyState({ onSelectPrompt }: ChatEmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-12">
        {/* Hero */}
        <div className="text-center space-y-6">
          <div className="size-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 mx-auto flex items-center justify-center shadow-lg">
            <Sparkles className="size-12 text-primary" />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              What can I help with?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              I can create agents, analyze workflows, search your CRM, and help you build anything
            </p>
          </div>
        </div>

        {/* Quick prompts */}
        <div className="grid md:grid-cols-2 gap-4">
          {prompts.map((item) => (
            <Button
              key={item.title}
              variant="outline"
              className={cn(
                'h-auto p-6 justify-start text-left',
                'hover:bg-primary/5 hover:border-primary/20',
                'transition-all duration-200 hover:scale-[1.02]',
                'group',
              )}
              onClick={() => onSelectPrompt(item.prompt)}
            >
              <item.icon className="size-6 mr-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.prompt}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
