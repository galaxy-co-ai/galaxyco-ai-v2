"use client";

import { useState } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AgentFilters from "@/components/dashboard/AgentFilters";
import AgentGrid from "@/components/dashboard/AgentGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { mockDashboardStats } from "@/lib/mock-data/dashboard-agents";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "paused" | "error"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="border-b border-border" style={{ padding: "var(--spacing-relaxed) var(--spacing-relaxed)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 style={{ fontSize: "var(--text-heading-lg)", fontWeight: "700", marginBottom: "4px" }}>
                Mission Control
              </h1>
              <p style={{ fontSize: "var(--text-body)", color: "#6B7280" }}>
                Monitor and manage your AI agents in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stats Bar */}
      <section style={{ padding: "var(--spacing-relaxed) var(--spacing-relaxed)" }}>
        <div className="max-w-7xl mx-auto">
          <DashboardStats {...mockDashboardStats} />
        </div>
      </section>

      {/* Filters & Search */}
      <section style={{ padding: "0 var(--spacing-relaxed) var(--spacing-default) var(--spacing-relaxed)" }}>
        <div className="max-w-7xl mx-auto">
          <AgentFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
          />
        </div>
      </section>

      {/* Agent Grid */}
      <section style={{ padding: "0 var(--spacing-relaxed) var(--spacing-relaxed) var(--spacing-relaxed)" }}>
        <div className="max-w-7xl mx-auto">
          <AgentGrid
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            categoryFilter={categoryFilter}
          />
        </div>
      </section>

      {/* Recent Activity */}
      <section style={{ padding: "0 var(--spacing-relaxed) var(--spacing-relaxed) var(--spacing-relaxed)" }}>
        <div className="max-w-7xl mx-auto">
          <RecentActivity />
        </div>
      </section>
    </div>
  );
}
