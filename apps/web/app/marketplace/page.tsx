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
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar - Top Left Positioning */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">
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

      {/* Hero Section */}
      <div className="px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <MarketplaceHero />
        </div>
      </div>

      {/* Tabs Navigation */}
      <section className="border-b-2 border-border sticky top-16 bg-background z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("agents")}
              className={`pb-4 px-2 border-b-3 font-semibold text-lg transition-all ${
                activeTab === "agents"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Individual Agents
            </button>
            <button
              onClick={() => setActiveTab("packs")}
              className={`pb-4 px-2 border-b-3 font-semibold text-lg transition-all relative ${
                activeTab === "packs"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Agent Packs
              <Badge variant="secondary" className="ml-2">
                5
              </Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Content based on active tab */}
      {activeTab === "agents" ? (
        <>
          {/* Categories */}
          <section className="px-6 py-8">
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

          {/* Featured Agents */}
          {!searchQuery && (
            <section className="px-6 py-8">
              <div className="max-w-7xl mx-auto">
                <MarketplaceFeatured />
              </div>
            </section>
          )}

          {/* Agent Grid */}
          <section className="px-6 pb-12">
            <div className="max-w-7xl mx-auto">
              <MarketplaceGrid
                agents={searchQuery ? filteredAgents : agents}
                isSearchResult={!!searchQuery}
              />
            </div>
          </section>
        </>
      ) : (
        /* Agent Packs */
        <section className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <MarketplacePacks />
          </div>
        </section>
      )}
    </div>
  );
}