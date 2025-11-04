/**
 * Template Selector Modal
 * Browse and select workflow templates for Flow Builder
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, Star, Download, Loader2, X, CheckCircle } from 'lucide-react';

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  type: string;
  iconUrl?: string;
  badgeText?: string;
  rating?: number;
  reviewCount?: number;
  installCount: number;
  kpis?: {
    successRate?: number;
    avgTimeSaved?: string;
    accuracy?: number;
  };
  tags: string[];
  isFeatured?: boolean;
}

interface MarketplaceResponse {
  templates: AgentTemplate[];
  total: number;
}

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: AgentTemplate) => void;
}

/**
 * Template Selector Modal Component
 */
export function TemplateSelector({ open, onOpenChange, onSelectTemplate }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch marketplace templates
  const { data, isLoading, error } = useQuery<MarketplaceResponse>({
    queryKey: ['marketplace-templates', searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('query', searchQuery);
      params.set('sortBy', 'trending');
      params.set('limit', '20');

      const res = await fetch(`/api/marketplace?${params}`);
      if (!res.ok) {
        throw new Error('Failed to fetch templates');
      }
      return res.json();
    },
    enabled: open, // Only fetch when modal is open
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSelectTemplate = (template: AgentTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
    toast({
      title: 'Template selected!',
      description: `Loading ${template.name} into Flow Builder...`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Start from Template</DialogTitle>
          <DialogDescription>
            Choose a pre-built agent template to get started quickly
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search templates"
          />
        </div>

        {/* Templates Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-muted/50 animate-pulse rounded-lg"
                  role="status"
                  aria-label="Loading templates"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">Failed to load templates.</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          )}

          {/* Templates Grid */}
          {data?.templates && data.templates.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              {data.templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => handleSelectTemplate(template)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {data?.templates && data.templates.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Try adjusting your search' : 'No templates available yet'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Template Card Component
 */
interface TemplateCardProps {
  template: AgentTemplate;
  onSelect: () => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const rating = template.rating ? (template.rating / 100).toFixed(1) : null;

  return (
    <div
      className="group relative bg-background-elevated border border-border rounded-lg p-4 hover:border-border-hover hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={`Select ${template.name} template`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Badge */}
      {template.badgeText && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs font-semibold">
          {template.badgeText}
        </Badge>
      )}

      {/* Header */}
      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-3">
          {template.iconUrl && (
            <img
              src={template.iconUrl}
              alt={`${template.name} icon`}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {template.name}
            </h3>
            <p className="text-xs text-muted-foreground">{template.category}</p>
          </div>
        </div>

        <p className="text-sm text-foreground-muted line-clamp-2">
          {template.shortDescription || template.description}
        </p>
      </div>

      {/* KPIs */}
      {template.kpis && (
        <div className="grid grid-cols-2 gap-2 mb-3 p-2 bg-muted/50 rounded-md text-xs">
          {template.kpis.avgTimeSaved && (
            <div>
              <p className="text-muted-foreground">Time Saved</p>
              <p className="font-semibold text-foreground">⏱️ {template.kpis.avgTimeSaved}</p>
            </div>
          )}
          {template.kpis.successRate && (
            <div>
              <p className="text-muted-foreground">Success</p>
              <p className="font-semibold text-foreground">✓ {template.kpis.successRate}%</p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{rating}</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          <span>{template.installCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
