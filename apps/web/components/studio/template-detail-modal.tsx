'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TemplatePreviewCanvas } from './template-preview-canvas';
import { Star, Users, Clock, Sparkles, Loader2, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useWorkspace } from '@/contexts/workspace-context';
import type { GridTemplate } from '@/lib/studio/types';

interface TemplateDetailModalProps {
  template: GridTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TemplateDetailModal({ template, open, onOpenChange }: TemplateDetailModalProps) {
  const router = useRouter();
  const { currentWorkspace } = useWorkspace();

  // Use Template mutation
  const useTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch('/api/studio/grids/from-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          workspaceId: currentWorkspace?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create grid from template');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Created "${template.name}" successfully!`);
      onOpenChange(false);
      router.push(`/studio/lab/${data.gridId}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to use template');
    },
  });

  const handleUseTemplate = () => {
    useTemplateMutation.mutate(template.id);
  };

  const complexity = template.complexity || 'beginner';
  const complexityColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl mb-1">{template.name}</DialogTitle>
                <DialogDescription className="text-base">
                  {template.category.replace(/-/g, ' ')}
                </DialogDescription>
              </div>
            </div>
            {template.featured && (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
          </div>
        </DialogHeader>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Uses</p>
              <p className="text-sm font-semibold">{template.uses.toLocaleString()}</p>
            </div>
          </div>
          {template.rating !== null && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="text-sm font-semibold">{template.rating.toFixed(1)} / 5.0</p>
              </div>
            </div>
          )}
          {template.estimated_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Est. Time</p>
                <p className="text-sm font-semibold">{template.estimated_time} min</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${complexityColors[complexity]}`}
            >
              {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="py-4">
          <h3 className="text-sm font-semibold mb-2">Description</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {template.description || 'No description available'}
          </p>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="py-4">
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Preview Canvas */}
        <div className="py-4">
          <h3 className="text-sm font-semibold mb-3">Workflow Preview</h3>
          <TemplatePreviewCanvas previewData={template.preview_data} className="h-[400px] w-full" />
        </div>

        <Separator />

        {/* Author & Metadata */}
        <div className="py-4 space-y-2">
          {template.author_name && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created by:</span>
              <span className="font-medium">{template.author_name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium">
              {new Date(template.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleUseTemplate}
            disabled={useTemplateMutation.isPending}
            className="flex-1"
            size="lg"
          >
            {useTemplateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Grid...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Use This Template
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} size="lg">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
