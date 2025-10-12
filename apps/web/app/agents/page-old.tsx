"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAgentList } from "../../hooks/use-agent-list";
import { AgentListCard } from "../../components/agents/AgentListCard";
import { Button } from "../../components/ui/button";
import { FormInput as Input } from "../../components/ui/form-input";
import { Card } from "../../components/ui/card";
import { Plus, Search, Users, Zap, RefreshCw, Filter } from "lucide-react";

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

  const [searchInput, setSearchInput] = useState("");
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(
    null,
  );

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
    { value: "all" as const, label: "All", count: totalCount },
    { value: "active" as const, label: "Active" },
    { value: "draft" as const, label: "Draft" },
    { value: "paused" as const, label: "Paused" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="border-b border-border py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--primary-50)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={24} strokeWidth={2} color="var(--primary-500)" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  My Agents
                </h1>
                <p className="text-secondary">
                  {totalCount} agent{totalCount !== 1 ? "s" : ""} • AI
                  automation at your fingertips
                </p>
              </div>
            </div>

            <Link href="/agents/new">
              <Button leftIcon={<Plus size={18} />}>Create Agent</Button>
            </Link>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 max-w-md">
              <Input
                variant="search"
                placeholder="Search agents..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                leftIcon={<Search size={16} />}
              />
            </div>
            <Button variant="ghost" leftIcon={<Filter size={16} />}>
              Filters
            </Button>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`btn btn-sm ${
                  statusFilter === tab.value ? "btn-primary" : "btn-secondary"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="badge badge-primary ml-2">{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div
                className="animate-spin mb-4"
                style={{ margin: "0 auto", width: "32px", height: "32px" }}
              >
                <Zap size={32} color="var(--primary-500)" />
              </div>
              <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
                Loading your agents...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="mb-6">
              <div className="flex items-start gap-4">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--error-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <RefreshCw size={20} color="var(--error)" />
                </div>
                <div className="flex-1">
                  <p
                    className="text-base font-medium mb-3"
                    style={{ color: "var(--error)" }}
                  >
                    Failed to load agents
                  </p>
                  <p
                    className="text-sm mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {error}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<RefreshCw size={16} />}
                    onClick={refresh}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && agents.length === 0 && (
            <div className="text-center py-16">
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "var(--bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto var(--space-6)",
                }}
              >
                <Users size={40} color="var(--text-tertiary)" />
              </div>
              <h2
                className="text-2xl font-bold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {search
                  ? "No agents found"
                  : "Ready to build your first agent?"}
              </h2>
              <p
                className="text-base mb-8"
                style={{
                  color: "var(--text-secondary)",
                  maxWidth: "500px",
                  margin: "0 auto var(--space-8)",
                }}
              >
                {search
                  ? `No agents match "${search}". Try adjusting your search or create a new agent.`
                  : "Create intelligent AI agents that automate your workflows and boost productivity."}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/agents/new">
                  <Button leftIcon={<Plus size={18} />}>
                    Create Your First Agent
                  </Button>
                </Link>
                {search && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchInput("");
                      setSearch("");
                    }}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Agent Grid */}
          {!isLoading && agents.length > 0 && (
            <>
              <div className="grid grid-auto-fit gap-6 mb-8">
                {agents.map((agent: any) => (
                  <AgentListCard key={agent.id} agent={agent} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    ← Previous
                  </Button>
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next →
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
