import { useState, useEffect, useCallback } from 'react';
import { listAgents } from '@/lib/actions/agent-actions';
import { useWorkspaceId } from './useWorkspace';
import { useWorkspaceAuth } from '@/hooks/use-workspace-auth';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'draft' | 'active' | 'paused' | 'archived';
  type: string;
  trigger: string;
  aiProvider: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

interface UseAgentListState {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  search: string;
  statusFilter: 'all' | 'draft' | 'active' | 'paused';
  page: number;
  totalPages: number;
  totalCount: number;
}

const ITEMS_PER_PAGE = 12;

export const useAgentList = () => {
  const workspaceId = useWorkspaceId();
  const { getAuthHeaders } = useWorkspaceAuth();
  
  const [state, setState] = useState<UseAgentListState>({
    agents: [],
    isLoading: true,
    error: null,
    search: '',
    statusFilter: 'all',
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchAgents = useCallback(async () => {
    // Don't fetch if workspace is not loaded yet
    if (!workspaceId) {
      return;
    }
    
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const filters: any = {
        limit: ITEMS_PER_PAGE,
        offset: (state.page - 1) * ITEMS_PER_PAGE,
      };

      if (state.statusFilter !== 'all') {
        filters.status = state.statusFilter;
      }

      if (state.search) {
        filters.search = state.search;
      }

      const headers = await getAuthHeaders();
      const result = await listAgents(headers, filters);
      
      setState((prev) => ({
        ...prev,
        agents: result.agents || [],
        totalCount: result.total || 0,
        totalPages: Math.ceil((result.total || 0) / ITEMS_PER_PAGE),
        isLoading: false,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.message || 'Failed to fetch agents',
        isLoading: false,
      }));
    }
  }, [workspaceId, state.page, state.statusFilter, state.search]);

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setStatusFilter = useCallback((statusFilter: UseAgentListState['statusFilter']) => {
    setState((prev) => ({ ...prev, statusFilter, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    ...state,
    setSearch,
    setStatusFilter,
    setPage,
    refresh,
  };
};
