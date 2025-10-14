"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";

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
    <div className="flex flex-col gap-4">
      {/* Search Bar and Create Button Row */}
      <div className="flex gap-4 flex-wrap items-center">
        {/* Search Bar */}
        <div className="flex-1 min-w-[250px] relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11"
          />
        </div>

        {/* Create Agent Button */}
        <Link
          href="/agents/create"
          className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold whitespace-nowrap no-underline"
          role="button"
        >
          <Plus size={18} />
          Create Agent
        </Link>
      </div>

      {/* Filter Chips Row */}
      <div className="flex gap-2 flex-wrap">
        {/* Status Filters */}
        {statusFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onStatusFilterChange(filter.id)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              statusFilter === filter.id
                ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter.label}
          </button>
        ))}

        {/* Divider */}
        <div className="w-px bg-gray-200 my-1" />

        {/* Category Filters */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryFilterChange(category.id)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
              categoryFilter === category.id
                ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
