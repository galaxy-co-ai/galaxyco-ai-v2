'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Star, Download, Search, Loader2, Store, Filter, CheckCircle } from 'lucide-react';

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

/**
 * Marketplace Page - Phase 2
 *
 * Browse and install pre-built agent templates from the marketplace.
 * Connected to real backend API with React Query.
 */
export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'trending' | 'popular' | 'newest' | 'rating'>('trending');
  const queryClient = useQueryClient();
  const { workspaceId, isLoading: workspaceLoading } = useWorkspace();

  // Fetch marketplace agents
  const { data, isLoading, error } = useQuery<MarketplaceResponse>({
    queryKey: ['marketplace-agents', searchQuery, selectedCategory, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('query', searchQuery);
      if (selectedCategory) params.set('category', selectedCategory);
      params.set('sortBy', sortBy);
      params.set('limit', '50');

      const res = await fetch(`/api/marketplace?${params}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch agents');
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Install agent mutation
  const installMutation = useMutation({
    mutationFn: async (templateId: string) => {
      if (!workspaceId) {
        throw new Error('No workspace selected');
      }

      const res = await fetch(`/api/marketplace/agents/${templateId}/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to install agent');
      }

      return res.json();
    },
    onSuccess: (data, templateId) => {
      toast({
        title: 'Agent installed! ✅',
        description: 'The agent has been added to your workspace.',
      });

      // Invalidate marketplace query to update install counts
      queryClient.invalidateQueries({ queryKey: ['marketplace-agents'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Installation failed',
        description: error.message || 'Could not install agent. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const categories = [
    'All',
    'Productivity',
    'Research',
    'Marketing',
    'Sales',
    'Support',
    'Content',
    'Analytics',
    'Development',
  ];

  return (
    <div className="container mx-auto py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Agent Marketplace</h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Install pre-built agents in 10 seconds. Browse {data?.total || 10}+ production-ready
          templates.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 sm:h-11"
            aria-label="Search marketplace agents"
          />
        </div>

        {/* Category Filter - Responsive horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
                variant={
                  (category === 'All' && !selectedCategory) || selectedCategory === category
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                className="shrink-0 text-xs sm:text-sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          {(['trending', 'popular', 'newest', 'rating'] as const).map((sort) => (
            <Button
              key={sort}
              onClick={() => setSortBy(sort)}
              variant={sortBy === sort ? 'default' : 'ghost'}
              size="sm"
              className="text-xs sm:text-sm capitalize"
            >
              {sort}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-muted/50 animate-pulse rounded-lg"
              role="status"
              aria-label="Loading agent cards"
            />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load marketplace agents.</p>
          <Button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['marketplace-agents'] })}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Agent Grid */}
      {data?.templates && data.templates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {data.templates.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onInstall={() => installMutation.mutate(agent.id)}
              isInstalling={installMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {data?.templates && data.templates.length === 0 && (
        <div className="text-center py-12">
          <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No agents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory
              ? 'Try adjusting your search or filters'
              : 'No agents available yet'}
          </p>
          {(searchQuery || selectedCategory) && (
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * AgentCard Component
 * Displays individual agent template with install button
 */
interface AgentCardProps {
  agent: AgentTemplate;
  onInstall: () => void;
  isInstalling?: boolean;
}

function AgentCard({ agent, onInstall, isInstalling }: AgentCardProps) {
  const rating = agent.rating ? (agent.rating / 100).toFixed(1) : null;

  return (
    <div
      className="group relative h-full bg-background-elevated border border-border rounded-lg p-4 sm:p-6 hover:border-border-hover hover:shadow-lg transition-all duration-200"
      role="article"
      aria-label={`${agent.name} agent template`}
    >
      {/* Badge */}
      {agent.badgeText && (
        <Badge variant="secondary" className="absolute top-3 right-3 text-xs font-semibold">
          {agent.badgeText}
        </Badge>
      )}

      {/* Header */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start gap-3">
          {agent.iconUrl && (
            <img
              src={agent.iconUrl}
              alt={`${agent.name} icon`}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {agent.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{agent.category}</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-foreground-muted line-clamp-2">
          {agent.shortDescription || agent.description}
        </p>
      </div>

      {/* KPIs */}
      {agent.kpis && (
        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-muted/50 rounded-md">
          {agent.kpis.avgTimeSaved && (
            <div>
              <p className="text-xs text-muted-foreground">Time Saved</p>
              <p className="text-sm font-semibold text-foreground">⏱️ {agent.kpis.avgTimeSaved}</p>
            </div>
          )}
          {agent.kpis.successRate && (
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-sm font-semibold text-foreground">✓ {agent.kpis.successRate}%</p>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm text-muted-foreground">
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{rating}</span>
            {agent.reviewCount && <span>({agent.reviewCount})</span>}
          </div>
        )}

        <div className="flex items-center gap-1">
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>{agent.installCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Tags */}
      {agent.tags && agent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {agent.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Install Button */}
      <Button
        onClick={onInstall}
        disabled={isInstalling}
        className="w-full"
        size="sm"
        aria-label={`Install ${agent.name} agent`}
      >
        {isInstalling ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Installing...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Install Agent
          </>
        )}
      </Button>
    </div>
  );
}
