'use client';

import { useState } from 'react';
import { ListPage } from '@/components/templates';
import { CardGrid } from '@/components/organisms/card-grid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Zap, TrendingUp, Users, Mail, MessageSquare } from 'lucide-react';

// Mock template data
const agentTemplates = [
  {
    id: '1',
    name: 'Sales Outreach Agent',
    description: 'Automated sales outreach with personalized messaging and follow-ups',
    category: 'sales',
    provider: 'GalaxyCo',
    installs: 1234,
    rating: 4.8,
    icon: <TrendingUp className="h-6 w-6" />,
    tags: ['Sales', 'Outreach', 'Automation'],
    featured: true,
  },
  {
    id: '2',
    name: 'Customer Support Bot',
    description: 'AI-powered customer support with knowledge base integration',
    category: 'support',
    provider: 'GalaxyCo',
    installs: 892,
    rating: 4.9,
    icon: <MessageSquare className="h-6 w-6" />,
    tags: ['Support', 'AI', 'Chatbot'],
    featured: true,
  },
  {
    id: '3',
    name: 'Marketing Campaign Manager',
    description: 'Create and manage multi-channel marketing campaigns automatically',
    category: 'marketing',
    provider: 'GalaxyCo',
    installs: 567,
    rating: 4.7,
    icon: <Mail className="h-6 w-6" />,
    tags: ['Marketing', 'Campaigns', 'Email'],
    featured: false,
  },
  {
    id: '4',
    name: 'Lead Qualification Agent',
    description: 'Automatically qualify and score leads based on custom criteria',
    category: 'sales',
    provider: 'GalaxyCo',
    installs: 445,
    rating: 4.6,
    icon: <Users className="h-6 w-6" />,
    tags: ['Sales', 'Leads', 'Qualification'],
    featured: false,
  },
  {
    id: '5',
    name: 'Content Generation Agent',
    description: 'Generate blog posts, social media content, and marketing copy',
    category: 'content',
    provider: 'GalaxyCo',
    installs: 789,
    rating: 4.8,
    icon: <Zap className="h-6 w-6" />,
    tags: ['Content', 'AI', 'Writing'],
    featured: true,
  },
  {
    id: '6',
    name: 'Email Response Agent',
    description: 'Automatically respond to common customer emails with AI',
    category: 'support',
    provider: 'GalaxyCo',
    installs: 334,
    rating: 4.5,
    icon: <Mail className="h-6 w-6" />,
    tags: ['Support', 'Email', 'AI'],
    featured: false,
  },
];

/**
 * Marketplace Page
 *
 * Template marketplace showing pre-built agent templates
 * users can install and customize.
 */
export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Filter templates
  const filteredTemplates = agentTemplates.filter((template) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    const categoryFilter = activeFilters.category || [];
    const matchesCategory =
      categoryFilter.length === 0 || categoryFilter.includes(template.category);

    // Provider filter
    const providerFilter = activeFilters.provider || [];
    const matchesProvider =
      providerFilter.length === 0 || providerFilter.includes(template.provider);

    // Featured filter
    const featuredFilter = activeFilters.featured || [];
    const matchesFeatured =
      featuredFilter.length === 0 || (featuredFilter.includes('true') && template.featured);

    return matchesSearch && matchesCategory && matchesProvider && matchesFeatured;
  });

  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
  };

  return (
    <ListPage
      title="Template Marketplace"
      subtitle="Pre-built agent templates ready to install and customize"
      breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Marketplace' }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      }
      searchQuery={searchQuery}
      searchPlaceholder="Search templates..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      filters={[
        {
          id: 'category',
          label: 'Category',
          type: 'checkbox',
          options: [
            { value: 'sales', label: 'Sales', count: 2 },
            { value: 'support', label: 'Support', count: 2 },
            { value: 'marketing', label: 'Marketing', count: 1 },
            { value: 'content', label: 'Content', count: 1 },
          ],
        },
        {
          id: 'featured',
          label: 'Featured',
          type: 'checkbox',
          options: [{ value: 'true', label: 'Featured Only', count: 3 }],
        },
        {
          id: 'provider',
          label: 'Provider',
          type: 'checkbox',
          options: [{ value: 'GalaxyCo', label: 'GalaxyCo', count: 6 }],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      isEmpty={filteredTemplates.length === 0}
      emptyMessage={
        searchQuery || Object.keys(activeFilters).length > 0
          ? 'No templates match your search or filters'
          : 'No templates available'
      }
      emptyAction={
        <Button variant="outline" onClick={handleClearFilters}>
          Clear Filters
        </Button>
      }
    >
      <CardGrid
        items={filteredTemplates}
        viewMode={viewMode}
        renderCard={(template) => (
          <div className="group relative">
            {template.featured && (
              <div className="absolute right-4 top-4 z-10">
                <Badge variant="default" className="bg-warning text-white">
                  Featured
                </Badge>
              </div>
            )}

            <div className="space-y-4">
              {/* Template Icon & Info */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="text-warning">★</span>
                  <span>{template.rating}</span>
                </div>
                <div>{template.installs.toLocaleString()} installs</div>
                <div className="text-xs">{template.provider}</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1">
                  Install Template
                </Button>
                <Button size="sm" variant="outline">
                  Preview
                </Button>
              </div>
            </div>
          </div>
        )}
        emptyState={
          <div className="text-center">
            <p className="text-muted-foreground">No templates found</p>
          </div>
        }
      />
    </ListPage>
  );
}
