/**
 * Document Card - Figma Knowledge Base Component
 * Individual document card in grid view
 * Matches Figma design exactly
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Eye,
  Star,
  Sparkles,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'mp4' | 'image' | 'other';
  tags: string[];
  views: number;
  size: string;
  timeAgo: string;
  isStarred?: boolean;
  isAIGenerated?: boolean;
  onClick?: () => void;
  className?: string;
}

const fileTypeConfig = {
  pdf: { icon: FileText, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  docx: { icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  xlsx: { icon: FileText, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  mp4: { icon: Video, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  image: { icon: ImageIcon, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  other: { icon: File, color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
};

export function DocumentCard({
  title,
  description,
  type,
  tags,
  views,
  size,
  timeAgo,
  isStarred = false,
  isAIGenerated = false,
  onClick,
  className,
}: DocumentCardProps) {
  const config = fileTypeConfig[type];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        'figma-card p-6 cursor-pointer hover:scale-[1.02] transition-transform',
        className,
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Icon and Actions */}
        <div className="flex items-start justify-between">
          <div
            className={cn('h-12 w-12 rounded-xl flex items-center justify-center', config.bgColor)}
          >
            <Icon className={cn('h-6 w-6', config.color)} />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-8 w-8 p-0', isStarred && 'text-yellow-500')}
            >
              <Star className={cn('h-4 w-4', isStarred && 'fill-current')} />
            </Button>
            {isAIGenerated && (
              <div className="h-8 w-8 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-purple-500" />
              </div>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-muted/50 text-xs rounded-full">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="bg-muted/50 text-xs rounded-full">
              +{tags.length - 2}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{views}</span>
          </div>
          <span>{size}</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Card>
  );
}
