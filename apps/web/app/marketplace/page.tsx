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
import { colors } from "@/lib/constants/design-system";

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
    <div
      style={{
        minHeight: "100vh",
        background: colors.background.primary,
      }}
    >
      <div>
        {/* Search Bar - Compact OpenSea style */}
        <section
          style={{
            padding: "1.5rem 1.5rem 0",
            background: colors.background.primary,
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={clearSearch}
              isSearching={isSearching}
            />

            {/* Category Chips below search bar */}
            <div style={{ marginTop: "0.75rem" }}>
              <CategoryChips />
            </div>
          </div>
        </section>

        {/* OpenSea-style Hero Section - Reduced to 300px with rounded corners */}
        <div style={{ marginTop: "1rem", padding: "0 1.5rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <MarketplaceHero />
          </div>
        </div>

        {/* Tabs Navigation */}
        <section
          style={{
            padding: "2rem 1.5rem 1rem",
            borderBottom: `2px solid ${colors.border.default}`,
            position: "sticky",
            top: 0,
            background: colors.background.primary,
            zIndex: 10,
          }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div style={{ display: "flex", gap: "2rem" }}>
              <button
                onClick={() => setActiveTab("agents")}
                style={{
                  padding: "1rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    activeTab === "agents"
                      ? `3px solid ${colors.primary[500]}`
                      : "3px solid transparent",
                  color:
                    activeTab === "agents"
                      ? colors.primary[500]
                      : colors.text.secondary,
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "-2px",
                }}
              >
                Individual Agents
              </button>
              <button
                onClick={() => setActiveTab("packs")}
                style={{
                  padding: "1rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  borderBottom:
                    activeTab === "packs"
                      ? `3px solid ${colors.primary[500]}`
                      : "3px solid transparent",
                  color:
                    activeTab === "packs"
                      ? colors.primary[500]
                      : colors.text.secondary,
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  marginBottom: "-2px",
                }}
              >
                Agent Packs
                <span
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.125rem 0.5rem",
                    background: colors.primary[100],
                    color: colors.primary[600],
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                  }}
                >
                  5
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Content based on active tab */}
        {activeTab === "agents" ? (
          <>
            {/* Categories */}
            <section style={{ padding: "2rem 1.5rem 1.5rem" }}>
              <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <MarketplaceCategories />
              </div>
            </section>

            {/* No Results State */}
            {searchQuery && !hasResults && (
              <section style={{ padding: "3rem 1.5rem" }}>
                <div
                  style={{
                    maxWidth: "600px",
                    margin: "0 auto",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    🔍
                  </div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      marginBottom: "0.75rem",
                      color: colors.text.primary,
                    }}
                  >
                    No agents found for "{searchQuery}"
                  </h3>
                  <p
                    style={{
                      fontSize: "1rem",
                      color: colors.text.secondary,
                      marginBottom: "1.5rem",
                    }}
                  >
                    Try adjusting your search or browse our categories to
                    discover more agents.
                  </p>
                  <button
                    onClick={clearSearch}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: colors.primary[500],
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.9375rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Clear Search
                  </button>
                </div>
              </section>
            )}

            {/* Trending Agents - OpenSea style compact cards */}
            <section style={{ padding: "0 1.5rem 3rem" }}>
              <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "600",
                    marginBottom: "1.5rem",
                    color: colors.text.primary,
                  }}
                >
                  🔥 Trending Agents
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {/* Compact trending agent cards */}
                  {[
                    {
                      id: "t1",
                      name: "Browser Automation",
                      category: "Productivity",
                      installs: "+234 today",
                      change: 45.2,
                    },
                    {
                      id: "t2",
                      name: "Email Assistant",
                      category: "Communication",
                      installs: "+189 today",
                      change: 32.8,
                    },
                    {
                      id: "t3",
                      name: "Data Scraper",
                      category: "Data",
                      installs: "+156 today",
                      change: 28.5,
                    },
                    {
                      id: "t4",
                      name: "Code Reviewer",
                      category: "Development",
                      installs: "+143 today",
                      change: 24.1,
                    },
                  ].map((agent) => (
                    <div
                      key={agent.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        background: colors.background.primary,
                        border: `1px solid ${colors.border.default}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.border.focus;
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px rgba(0,0,0,0.07)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          colors.border.default;
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          background: colors.background.secondary,
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.5rem",
                          flexShrink: 0,
                        }}
                      >
                        🤖
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: colors.text.primary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {agent.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: colors.text.tertiary,
                          }}
                        >
                          {agent.installs}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          color: colors.success.DEFAULT,
                          flexShrink: 0,
                        }}
                      >
                        +{agent.change}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Agents Carousel */}
            <section style={{ padding: "0 1.5rem 3rem" }}>
              <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <h2
                  style={{
                    fontSize: "2rem",
                    fontWeight: "700",
                    marginBottom: "2rem",
                    color: colors.text.primary,
                  }}
                >
                  🔥 Featured Agents
                </h2>
                <Suspense fallback={<div>Loading featured...</div>}>
                  <MarketplaceFeatured />
                </Suspense>
              </div>
            </section>

            {/* Main Grid */}
            <section
              style={{
                padding: "0 1.5rem 4rem",
                background: colors.background.secondary,
              }}
            >
              <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2rem",
                    paddingTop: "3rem",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: "600",
                      color: colors.text.primary,
                    }}
                  >
                    All Agent Templates
                  </h2>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <select
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: `1px solid ${colors.border.default}`,
                        background: colors.background.primary,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                    >
                      <option>Most Popular</option>
                      <option>Trending</option>
                      <option>Newest First</option>
                      <option>Best Rated</option>
                    </select>
                    <button
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "8px",
                        border: `1px solid ${colors.border.default}`,
                        background: colors.background.primary,
                        fontSize: "0.875rem",
                        cursor: "pointer",
                      }}
                    >
                      Filters
                    </button>
                  </div>
                </div>

                <Suspense fallback={<div>Loading templates...</div>}>
                  <MarketplaceGrid />
                </Suspense>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Packs Grid */}
            <Suspense fallback={<div>Loading packs...</div>}>
              <MarketplacePacks
                onInstallPack={(packId) => {
                  console.log("Install pack:", packId);
                  // TODO: Open install modal
                }}
                onPreviewPack={(packId) => {
                  console.log("Preview pack:", packId);
                  // TODO: Open preview modal
                }}
              />
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
