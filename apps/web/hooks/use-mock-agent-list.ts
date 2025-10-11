/**
 * Mock Agent List Hook
 *
 * This hook provides the same interface as useAgentList but uses
 * the mock agent service instead of external APIs, providing a
 * much better UX for testing.
 */

import { useState, useEffect, useCallback } from "react";
import { mockAgents, type MockAgent } from "@/lib/mock-agents";

interface UseAgentListState {
  agents: MockAgent[];
  isLoading: boolean;
  error: string | null;
  search: string;
  statusFilter: "all" | "draft" | "active" | "paused";
  page: number;
  totalPages: number;
  totalCount: number;
}

const ITEMS_PER_PAGE = 12;

export const useMockAgentList = () => {
  const [state, setState] = useState<UseAgentListState>({
    agents: [],
    isLoading: true,
    error: null,
    search: "",
    statusFilter: "all",
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const fetchAgents = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate async operation for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 200));

      const filters = {
        limit: ITEMS_PER_PAGE,
        offset: (state.page - 1) * ITEMS_PER_PAGE,
        status: state.statusFilter,
        search: state.search || undefined,
      };

      const result = mockAgents.list(filters);

      setState((prev) => ({
        ...prev,
        agents: result.agents,
        totalCount: result.total,
        totalPages: Math.ceil(result.total / ITEMS_PER_PAGE),
        isLoading: false,
      }));
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        error: err.message || "Failed to fetch agents",
        isLoading: false,
      }));
    }
  }, [state.page, state.statusFilter, state.search]);

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setStatusFilter = useCallback(
    (statusFilter: UseAgentListState["statusFilter"]) => {
      setState((prev) => ({ ...prev, statusFilter, page: 1 }));
    },
    [],
  );

  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Reset to defaults for testing
  const resetToDefaults = useCallback(() => {
    mockAgents.resetToDefaults();
    refresh();
  }, [refresh]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    ...state,
    setSearch,
    setStatusFilter,
    setPage,
    refresh,
    resetToDefaults,
  };
};
