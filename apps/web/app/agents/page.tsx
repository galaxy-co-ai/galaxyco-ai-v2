'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAgentList } from '../../hooks/use-agent-list';
import { AgentListCard } from '../../components/agents/AgentListCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, typography, radius } from '../../lib/constants/design-system';

export default function AgentsPage() {
  const {
    agents,
    isLoading,
    error,
    search,
    statusFilter,
    page,
    totalPages,
    totalCount,
    setSearch,
    setStatusFilter,
    setPage,
    refresh,
  } = useAgentList();

  const [searchInput, setSearchInput] = useState('');
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(() => {
      setSearch(searchInput);
    }, 300);

    setSearchDebounce(timeout);

    return () => {
      if (searchDebounce) {
        clearTimeout(searchDebounce);
      }
    };
  }, [searchInput]);

  const statusTabs = [
    { value: 'all' as const, label: 'All', count: totalCount },
    { value: 'active' as const, label: 'Active' },
    { value: 'draft' as const, label: 'Draft' },
    { value: 'paused' as const, label: 'Paused' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background.tertiary }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: colors.background.primary,
          borderBottom: `1px solid ${colors.border.default}`,
          padding: `${spacing.xl} ${spacing['2xl']}`,
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
            <div>
              <h1
                style={{
                  fontSize: typography.sizes['3xl'],
                  fontWeight: typography.weights.bold,
                  color: colors.text.primary,
                  margin: 0,
                  marginBottom: spacing.xs,
                }}
              >
                Agents
              </h1>
              <p
                style={{
                  fontSize: typography.sizes.base,
                  color: colors.text.secondary,
                  margin: 0,
                }}
              >
                {totalCount} agent{totalCount !== 1 ? 's' : ''} total
              </p>
            </div>
            <Link href="/agents/new" style={{ textDecoration: 'none' }}>
              <button
                type="button"
                style={{
                  padding: `${spacing.md} ${spacing.xl}`,
                  fontSize: typography.sizes.base,
                  fontWeight: typography.weights.semibold,
                  color: colors.background.primary,
                  backgroundColor: colors.primary,
                  border: 'none',
                  borderRadius: radius.md,
                  cursor: 'pointer',
                  transition: 'opacity 200ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                + New Agent
              </button>
            </Link>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search agents..."
            style={{
              width: '100%',
              maxWidth: '500px',
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.sizes.base,
              fontFamily: typography.fontFamily,
              color: colors.text.primary,
              backgroundColor: colors.background.tertiary,
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border.default;
            }}
          />

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: spacing.sm, marginTop: spacing.lg }}>
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  fontSize: typography.sizes.sm,
                  fontWeight: typography.weights.medium,
                  color: statusFilter === tab.value ? colors.primary : colors.text.secondary,
                  backgroundColor: statusFilter === tab.value ? colors.background.tertiary : 'transparent',
                  border: `1px solid ${statusFilter === tab.value ? colors.primary : colors.border.default}`,
                  borderRadius: radius.md,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
                onMouseEnter={(e) => {
                  if (statusFilter !== tab.value) {
                    e.currentTarget.style.backgroundColor = colors.background.tertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (statusFilter !== tab.value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {tab.label}
                {tab.count !== undefined && ` (${tab.count})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: `${spacing['2xl']}` }}>
        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: spacing['4xl'] }}>
            <p style={{ fontSize: typography.sizes.lg, color: colors.text.tertiary }}>Loading agents...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            style={{
              padding: spacing.xl,
              backgroundColor: colors.danger,
              color: colors.background.primary,
              borderRadius: radius.lg,
              marginBottom: spacing.xl,
            }}
          >
            <p style={{ margin: 0, fontSize: typography.sizes.base, fontWeight: typography.weights.medium }}>
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && agents.length === 0 && (
          <EmptyState
            icon="🤖"
            title="No agents yet"
            description={
              search
                ? `No agents match "${search}". Try a different search.`
                : "Get started by creating your first agent"
            }
            action={{
              label: '+ Create Agent',
              onClick: () => (window.location.href = '/agents/new'),
            }}
          />
        )}

        {/* Grid */}
        {!isLoading && agents.length > 0 && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: spacing.lg,
                marginBottom: spacing.xl,
              }}
            >
              {agents.map((agent: any) => (
                <AgentListCard key={agent.id} agent={agent} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: spacing.sm }}>
                <button
                  type="button"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.medium,
                    color: page === 1 ? colors.text.tertiary : colors.text.primary,
                    backgroundColor: 'transparent',
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: radius.md,
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    opacity: page === 1 ? 0.5 : 1,
                  }}
                >
                  ← Previous
                </button>
                <span
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    fontSize: typography.sizes.sm,
                    color: colors.text.secondary,
                  }}
                >
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  style={{
                    padding: `${spacing.sm} ${spacing.lg}`,
                    fontSize: typography.sizes.sm,
                    fontWeight: typography.weights.medium,
                    color: page === totalPages ? colors.text.tertiary : colors.text.primary,
                    backgroundColor: 'transparent',
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: radius.md,
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    opacity: page === totalPages ? 0.5 : 1,
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
