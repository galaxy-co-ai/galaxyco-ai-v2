'use client';

import { Sparkles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ChatHeaderProps {
  model: string;
  onModelChange: (model: string) => void;
  leftAction?: React.ReactNode;
}

const models = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Best for general tasks, fast responses',
    icon: '⚡',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    description: 'Most capable model, deeper reasoning',
    icon: '🧠',
  },
  {
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Best for complex analysis and coding',
    icon: '🎯',
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most powerful, excellent for reasoning',
    icon: '💎',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: 'Great for multimodal tasks, 1M token context',
    icon: '✨',
  },
];

export function ChatHeader({ model, onModelChange, leftAction }: ChatHeaderProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          {leftAction}
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">
              Powered by {models.find((m) => m.id === model)?.name}
            </p>
          </div>
        </div>

        {/* Model selector */}
        <Select value={model} onValueChange={onModelChange}>
          <SelectTrigger className="w-52">
            <div className="flex items-center gap-2">
              <span className="text-lg">{models.find((m) => m.id === model)?.icon}</span>
              <SelectValue />
            </div>
          </SelectTrigger>

          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                <div className="flex items-start gap-3 py-1">
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.provider} • {m.description}
                    </div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
