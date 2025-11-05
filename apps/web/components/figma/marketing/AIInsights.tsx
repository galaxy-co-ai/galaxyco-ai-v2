/**
 * AI Insights - Figma Marketing Component
 * Purple AI recommendation card
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AIInsightsProps {
  recommendation: string;
  onApply?: () => void;
  onLearnMore?: () => void;
  className?: string;
}

export function AIInsights({ recommendation, onApply, onLearnMore, className }: AIInsightsProps) {
  return (
    <Card className={cn('p-6 bg-purple-500/5 border-purple-500/20', className)}>
      <div className="flex gap-4">
        {/* Icon */}
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-6 w-6 text-purple-600" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-base mb-2">AI Campaign Insights</h3>
            <p className="text-sm text-muted-foreground">{recommendation}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="bg-primary hover:bg-primary-hover" onClick={onApply}>
              Apply Recommendations
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-500/20 hover:bg-purple-500/5"
              onClick={onLearnMore}
            >
              Tell Me More
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
