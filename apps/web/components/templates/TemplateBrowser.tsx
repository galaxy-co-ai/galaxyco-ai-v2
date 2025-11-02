/**
 * Template Browser Component
 * Browse and select workflow templates
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, TrendingUp, Zap, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { WorkflowTemplate, TemplateCategory } from '@/lib/templates/types';

interface TemplateBrowserProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
  category?: TemplateCategory;
}

export function TemplateBrowser({ onSelectTemplate, category }: TemplateBrowserProps) {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);

  const categories = [
    { value: 'sales', label: 'Sales', icon: TrendingUp },
    { value: 'marketing', label: 'Marketing', icon: Zap },
    { value: 'support', label: 'Support', icon: Clock },
    { value: 'operations', label: 'Operations', icon: Clock },
    { value: 'hr', label: 'HR', icon: Clock },
    { value: 'finance', label: 'Finance', icon: TrendingUp },
  ];

  useEffect(() => {
    fetchTemplates();
  }, [selectedCategory, searchQuery]);

  async function fetchTemplates() {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/templates?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSelectTemplate(template: WorkflowTemplate) {
    try {
      // Increment usage count
      await fetch(`/api/templates/${template.id}/use`, {
        method: 'POST',
      });

      onSelectTemplate(template);
    } catch (error) {
      console.error('Error selecting template:', error);
      toast.error('Failed to load template');
    }
  }

  const getComplexityColor = (complexity: string | null) => {
    switch (complexity) {
      case 'beginner':
        return 'default';
      case 'intermediate':
        return 'secondary';
      case 'advanced':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Templates
          </Button>

          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-3" />
              <div className="h-3 bg-muted rounded w-full mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No templates found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try a different search term or category
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-6 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground">{template.name}</h3>
                  {template.featured && (
                    <Star className="size-4 text-primary fill-primary flex-shrink-0" />
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {template.complexity && (
                    <Badge variant={getComplexityColor(template.complexity)} className="text-xs">
                      {template.complexity}
                    </Badge>
                  )}

                  {template.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" />
                      <span>{template.estimatedTime}m</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    <span>{template.uses} uses</span>
                  </div>
                </div>

                {/* Action */}
                <Button size="sm" className="w-full" onClick={() => handleSelectTemplate(template)}>
                  Use Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
