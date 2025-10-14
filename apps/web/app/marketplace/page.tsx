"use client";

import { Suspense, useState } from "react";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import MarketplaceFeatured from "@/components/marketplace/MarketplaceFeatured";
import MarketplaceCategories from "@/components/marketplace/MarketplaceCategories";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import MarketplacePacks from "@/components/marketplace/MarketplacePacks";
import SearchBar from "@/components/marketplace/SearchBar";
import CategoryChips from "@/components/marketplace/CategoryChips";
import { useMarketplaceSearch } from "@/hooks/use-marketplace-search";
import { AGENT_TEMPLATES } from "@/lib/constants/agent-templates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Grid3X3,
  TrendingUp,
  Star,
} from "lucide-react";

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<"agents" | "packs">("agents");

  // Convert templates to searchable format
  const agents = Object.values(AGENT_TEMPLATES);

  // Search hook
  const {
    searchQuery,
    setSearchQuery,
    filteredAgents,
    hasResults,
    isSearching,
    clearSearch,
  } = useMarketplaceSearch(agents);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Search */}
      <section 
        style={{
          padding: "var(--container-padding-y) var(--container-padding-x)", /* 20px 24px - compact */
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Search Bar - Top Left Positioning */}
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "var(--space-4)", /* 16px - tighter spacing */
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
              <h1 
                style={{
                  fontSize: "var(--text-xl)", /* 18px - compact page title */
                  fontWeight: "var(--font-bold)",
                  lineHeight: "var(--leading-tight)",
                  color: "var(--text-primary)",
                }}
              >
                Agent Marketplace
              </h1>
              <Badge variant="default">2.0</Badge>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Grid3X3 size={16} className="mr-2" />
                Grid
              </Button>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Search Bar - Moderate Size, Top-Left */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={clearSearch}
                isSearching={isSearching}
              />
            </div>
          </div>

          {/* Category Chips - Below Search */}
          <div>
            <CategoryChips />
          </div>
        </div>
      </section>

      {/* Hero Section - Compact */}
      <div 
        style={{
          padding: "0 var(--container-padding-x)",
          marginBottom: "var(--space-4)", // 16px - tighter
        }}
      >
        <div className="max-w-7xl mx-auto">
          <MarketplaceHero />
        </div>
      </div>

      {/* Tabs Navigation - Compact */}
      <section 
        style={{
          borderBottom: "1px solid var(--border-default)",
          position: "sticky",
          top: "64px",
          background: "var(--bg-primary)",
          zIndex: "var(--z-sticky)",
          padding: "0 var(--container-padding-x)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div style={{ display: "flex", gap: "var(--space-6)" }}>
            <button
              onClick={() => setActiveTab("agents")}
              style={{
                padding: "var(--space-3) var(--space-2)", // 12px 8px
                borderBottom: `2px solid ${activeTab === "agents" ? "var(--primary-500)" : "transparent"}`,
                fontSize: "var(--text-base)", // 14px
                fontWeight: "var(--weight-semibold)",
                color: activeTab === "agents" ? "var(--primary-500)" : "var(--text-secondary)",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${activeTab === "agents" ? "var(--primary-500)" : "transparent"}`,
                cursor: "pointer",
                transition: "var(--transition-base)",
              }}
            >
              Individual Agents
            </button>
            <button
              onClick={() => setActiveTab("packs")}
              style={{
                padding: "var(--space-3) var(--space-2)",
                borderBottom: `2px solid ${activeTab === "packs" ? "var(--primary-500)" : "transparent"}`,
                fontSize: "var(--text-base)",
                fontWeight: "var(--weight-semibold)",
                color: activeTab === "packs" ? "var(--primary-500)" : "var(--text-secondary)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                transition: "var(--transition-base)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
              }}
            >
              <span>Agent Packs</span>
              <Badge variant="secondary" style={{ fontSize: "var(--text-xs)" }}>
                5
              </Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Content based on active tab */}
      {activeTab === "agents" ? (
        <>
          {/* Categories - Compact */}
          <section 
            style={{
              padding: "var(--space-4) var(--container-padding-x)", // 16px vertical
            }}
          >
            <div className="max-w-7xl mx-auto">
              <MarketplaceCategories />
            </div>
          </section>

          {/* No Results State */}
          {searchQuery && !hasResults && (
            <section className="px-6 py-12">
              <div className="max-w-2xl mx-auto text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold mb-3 text-foreground">
                  No agents found for "{searchQuery}"
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse our categories
                  instead.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Button onClick={clearSearch}>Clear Search</Button>
                  <Button variant="outline">Browse All</Button>
                </div>
              </div>
            </section>
          )}

          {/* Featured Agents - Compact */}
          {!searchQuery && (
            <section 
              style={{
                padding: "var(--space-4) var(--container-padding-x)",
              }}
            >
              <div className="max-w-7xl mx-auto">
                <MarketplaceFeatured />
              </div>
            </section>
          )}

          {/* Agent Grid - Compact */}
          <section 
            style={{
              padding: "0 var(--container-padding-x) var(--space-8)", // 32px bottom
            }}
          >
            <div className="max-w-7xl mx-auto">
              <MarketplaceGrid
                agents={searchQuery ? filteredAgents : agents}
                isSearchResult={!!searchQuery}
              />
            </div>
          </section>
        </>
      ) : (
        /* Agent Packs - Compact */
        <section 
          style={{
            padding: "var(--space-4) var(--container-padding-x)",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <MarketplacePacks />
          </div>
        </section>
      )}
    </div>
  );
}