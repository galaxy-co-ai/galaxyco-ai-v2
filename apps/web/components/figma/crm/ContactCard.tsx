/**
 * Contact Card - Figma CRM Component
 * Individual contact card in the list
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ContactCardProps {
  id: string;
  name: string;
  company: string;
  initials: string;
  score: number;
  aiInsight: string;
  status: 'hot' | 'warm' | 'cold';
  dealValue: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  hot: { label: 'Hot', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  warm: { label: 'Warm', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  cold: { label: 'Cold', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
};

export function ContactCard({
  name,
  company,
  initials,
  score,
  aiInsight,
  status,
  dealValue,
  isSelected = false,
  onClick,
  className,
}: ContactCardProps) {
  const config = statusConfig[status];

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all border',
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-transparent hover:border-border hover:shadow-sm',
        className,
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header: Avatar, Name, Score */}
        <div className="flex items-start gap-3">
          <Avatar
            className="h-10 w-10 bg-blue-500/10 text-blue-600 font-semibold"
            fallback={initials}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm truncate">{name}</h4>
              {status === 'hot' && (
                <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs h-5">
                  {config.label}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{company}</p>
          </div>
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 h-6 px-2">
            <Star className="h-3 w-3 mr-1 fill-current" />
            <span className="text-xs font-semibold">{score}</span>
          </Badge>
        </div>

        {/* AI Insight */}
        <div className="flex items-start gap-2 text-sm">
          <Zap className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
          <p className="text-muted-foreground line-clamp-2">{aiInsight}</p>
        </div>

        {/* Status and Deal Value */}
        <div className="flex items-center justify-between">
          <Badge className={config.color}>{config.label}</Badge>
          <span className="text-sm font-semibold">{dealValue}</span>
        </div>
      </div>
    </Card>
  );
}
