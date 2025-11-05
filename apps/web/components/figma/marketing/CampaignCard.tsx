/**
 * Campaign Card - Figma Marketing Component
 * Individual campaign card with metrics and progress
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CampaignCardProps {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  budget: string;
  spent: string;
  impressions: string;
  roi: string;
  tags: string[];
  onViewDetails?: () => void;
  className?: string;
}

const statusConfig = {
  active: 'bg-green-500/10 text-green-600 border-green-500/20',
  paused: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  completed: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export function CampaignCard({
  name,
  type,
  status,
  progress,
  budget,
  spent,
  impressions,
  roi,
  tags,
  onViewDetails,
  className,
}: CampaignCardProps) {
  return (
    <Card className={cn('figma-card p-6', className)}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base">{name}</h3>
              <Badge className={statusConfig[status]}>{status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{type}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="text-base font-semibold">{budget}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-base font-semibold">{spent}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Impressions</p>
            <p className="text-base font-semibold">{impressions}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">ROI</p>
            <p className="text-base font-semibold text-green-600">{roi}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50 text-xs rounded-full">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="bg-muted/50 text-xs rounded-full">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <Button variant="outline" size="sm" className="w-full" onClick={onViewDetails}>
          View Details
        </Button>
      </div>
    </Card>
  );
}
