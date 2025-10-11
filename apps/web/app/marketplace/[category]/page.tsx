"use client";

import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import MarketplaceHero from "@/components/marketplace/MarketplaceHero";
import MarketplaceCategories from "@/components/marketplace/MarketplaceCategories";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import SearchBar from "@/components/marketplace/SearchBar";
import CategoryChips from "@/components/marketplace/CategoryChips";
import { useMarketplaceSearch } from "@/hooks/use-marketplace-search";
import {
  getCategoryBySlug,
  isValidCategorySlug,
} from "@/lib/constants/marketplace-categories";
import { AGENT_TEMPLATES } from "@/lib/constants/agent-templates";
import { colors } from "@/lib/constants/design-system";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = params;

  // Validate category
  if (!isValidCategorySlug(categorySlug)) {
    notFound();
  }

  const category = getCategoryBySlug(categorySlug);
  if (!category) {
    notFound();
  }

  // Filter agents by category
  const allAgents = Object.values(AGENT_TEMPLATES);
  const categoryAgents = allAgents.filter(
    (agent) => agent.category === category.id,
  );

  // Search hook (scoped to category agents)
  const {
    searchQuery,
    setSearchQuery,
    filteredAgents,
    hasResults,
    isSearching,
    clearSearch,
  } = useMarketplaceSearch(categoryAgents);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background.primary,
      }}
    >
      <div>
        {/* Search Bar */}
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
              placeholder={`Search ${category.name.toLowerCase()}...`}
            />

            {/* Category Chips below search bar */}
            <div style={{ marginTop: "0.75rem" }}>
              <CategoryChips activeCategory={categorySlug} />
            </div>
          </div>
        </section>

        {/* Category-Themed Hero with rounded corners */}
        <div style={{ marginTop: "1rem", padding: "0 1.5rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <MarketplaceHero category={category} />
          </div>
        </div>

        {/* Category-Themed Hero */}
        <div style={{ marginTop: "1rem" }}>
          <MarketplaceHero category={category} />
        </div>

        {/* Breadcrumb */}
        <section style={{ padding: "1.5rem 1.5rem 0" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                color: colors.text.secondary,
              }}
            >
              <Link
                href="/marketplace"
                style={{
                  color: colors.primary[500],
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Marketplace
              </Link>
              <span>›</span>
              <span style={{ color: colors.text.primary, fontWeight: "500" }}>
                {category.name}
              </span>
            </div>
          </div>
        </section>

        {/* Categories Navigation */}
        <section style={{ padding: "1.5rem 1.5rem" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <MarketplaceCategories activeCategory={categorySlug} />
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
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
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
                Try adjusting your search or explore other categories.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
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
                <Link
                  href="/marketplace"
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: colors.background.secondary,
                    color: colors.text.primary,
                    border: `1px solid ${colors.border.default}`,
                    borderRadius: "8px",
                    fontSize: "0.9375rem",
                    fontWeight: "600",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  View All Categories
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Featured Agents in Category */}
        {hasResults && filteredAgents.length > 0 && (
          <section style={{ padding: "0 1.5rem 3rem" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "600",
                    color: colors.text.primary,
                  }}
                >
                  {category.icon} {category.name}
                  <span
                    style={{
                      marginLeft: "0.75rem",
                      fontSize: "1rem",
                      fontWeight: "400",
                      color: colors.text.tertiary,
                    }}
                  >
                    ({filteredAgents.length}{" "}
                    {filteredAgents.length === 1 ? "agent" : "agents"})
                  </span>
                </h2>
              </div>

              {/* Agent Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
                className="sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    style={{
                      background: colors.background.primary,
                      border: `1px solid ${colors.border.default}`,
                      borderRadius: "12px",
                      padding: "1.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.border.focus;
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.border.default;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {agent.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        marginBottom: "0.5rem",
                        color: colors.text.primary,
                      }}
                    >
                      {agent.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: colors.text.secondary,
                        lineHeight: "1.5",
                        marginBottom: "1rem",
                      }}
                    >
                      {agent.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {agent.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: "0.25rem 0.5rem",
                            background: colors.background.secondary,
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            color: colors.text.tertiary,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty Category State */}
        {!searchQuery && categoryAgents.length === 0 && (
          <section style={{ padding: "3rem 1.5rem" }}>
            <div
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                {category.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "0.75rem",
                  color: colors.text.primary,
                }}
              >
                Coming Soon
              </h3>
              <p
                style={{
                  fontSize: "1rem",
                  color: colors.text.secondary,
                  marginBottom: "1.5rem",
                }}
              >
                We're building amazing {category.name.toLowerCase()} agents.
                Check back soon!
              </p>
              <Link
                href="/marketplace"
                style={{
                  padding: "0.75rem 1.5rem",
                  background: colors.primary[500],
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.9375rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Explore Other Categories
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
