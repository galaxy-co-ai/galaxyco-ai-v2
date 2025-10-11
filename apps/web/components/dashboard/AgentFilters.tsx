"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { colors, radius } from "@/lib/constants/design-system";

interface AgentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | "active" | "paused" | "error";
  onStatusFilterChange: (status: "all" | "active" | "paused" | "error") => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
}

export default function AgentFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
}: AgentFiltersProps) {
  const statusFilters: Array<{
    id: "all" | "active" | "paused" | "error";
    label: string;
  }> = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "paused", label: "Paused" },
    { id: "error", label: "Error" },
  ];

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "sales", label: "Sales" },
    { id: "marketing", label: "Marketing" },
    { id: "operations", label: "Operations" },
    { id: "support", label: "Support" },
    { id: "engineering", label: "Engineering" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Search Bar and Create Button Row */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search Bar */}
        <div style={{ flex: 1, minWidth: "250px", position: "relative" }}>
          <Search
            size={18}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: colors.text.tertiary,
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.75rem",
              border: `1px solid ${colors.border.default}`,
              borderRadius: radius.md,
              fontSize: "0.9375rem",
              color: colors.text.primary,
              background: colors.background.primary,
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.primary[500];
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.primary[100]}`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border.default;
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Create Agent Button */}
        <Link
          href="/agents/create"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            background: colors.primary[500],
            color: "white",
            border: "none",
            borderRadius: radius.md,
            fontSize: "0.9375rem",
            fontWeight: "600",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primary[600];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.primary[500];
          }}
        >
          <Plus size={18} />
          Create Agent
        </Link>
      </div>

      {/* Filter Chips Row */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {/* Status Filters */}
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onStatusFilterChange(filter.id)}
            style={{
              padding: "0.5rem 1rem",
              background:
                statusFilter === filter.id
                  ? colors.primary[100]
                  : colors.background.secondary,
              border: `1px solid ${statusFilter === filter.id ? colors.primary[300] : colors.border.default}`,
              borderRadius: radius.md,
              color:
                statusFilter === filter.id
                  ? colors.primary[700]
                  : colors.text.secondary,
              fontSize: "0.875rem",
              fontWeight: statusFilter === filter.id ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (statusFilter !== filter.id) {
                e.currentTarget.style.background = colors.background.tertiary;
              }
            }}
            onMouseLeave={(e) => {
              if (statusFilter !== filter.id) {
                e.currentTarget.style.background = colors.background.secondary;
              }
            }}
          >
            {filter.label}
          </button>
        ))}

        {/* Divider */}
        <div
          style={{
            width: "1px",
            background: colors.border.default,
            margin: "0.25rem 0",
          }}
        />

        {/* Category Filters */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryFilterChange(category.id)}
            style={{
              padding: "0.5rem 1rem",
              background:
                categoryFilter === category.id
                  ? colors.primary[100]
                  : colors.background.secondary,
              border: `1px solid ${categoryFilter === category.id ? colors.primary[300] : colors.border.default}`,
              borderRadius: radius.md,
              color:
                categoryFilter === category.id
                  ? colors.primary[700]
                  : colors.text.secondary,
              fontSize: "0.875rem",
              fontWeight: categoryFilter === category.id ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (categoryFilter !== category.id) {
                e.currentTarget.style.background = colors.background.tertiary;
              }
            }}
            onMouseLeave={(e) => {
              if (categoryFilter !== category.id) {
                e.currentTarget.style.background = colors.background.secondary;
              }
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
