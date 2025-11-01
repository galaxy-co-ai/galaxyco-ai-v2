/**
 * Marketplace Search Hook
 * Provides debounced search functionality with URL sync
 */

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface SearchableAgent {
  id: string;
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  [key: string]: any;
}

export interface UseMarketplaceSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredAgents: SearchableAgent[];
  hasResults: boolean;
  isSearching: boolean;
  clearSearch: () => void;
}

/**
 * Hook for marketplace search with debouncing and URL sync
 * @param agents - Array of agents to search through
 * @param debounceMs - Debounce delay in milliseconds (default: 300ms)
 */
export function useMarketplaceSearch(
  agents: SearchableAgent[],
  debounceMs: number = 300,
): UseMarketplaceSearchResult {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search query from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search input
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchQuery, debounceMs]);

  // Update URL with search params (without causing full page reload)
  useEffect(() => {
    const currentPath = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (debouncedQuery) {
      params.set('search', debouncedQuery);
    } else {
      params.delete('search');
    }

    const newUrl = params.toString() ? `${currentPath}?${params.toString()}` : currentPath;

    // Only update if URL actually changed
    if (newUrl !== window.location.pathname + window.location.search) {
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedQuery, router]);

  // Filter agents based on search query
  const filteredAgents = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.trim() === '') {
      return agents;
    }

    const query = debouncedQuery.toLowerCase().trim();

    return agents.filter((agent) => {
      // Search in name
      if (agent.name?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in description
      if (agent.description?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in category
      if (agent.category?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in tags
      if (agent.tags && Array.isArray(agent.tags)) {
        const matchesTag = agent.tags.some((tag) => tag.toLowerCase().includes(query));
        if (matchesTag) {
          return true;
        }
      }

      return false;
    });
  }, [agents, debouncedQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    filteredAgents,
    hasResults: filteredAgents.length > 0,
    isSearching,
    clearSearch,
  };
}
