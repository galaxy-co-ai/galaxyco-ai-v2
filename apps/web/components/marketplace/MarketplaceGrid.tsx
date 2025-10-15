"use client";

import AgentTemplateCardCompact from "./AgentTemplateCardCompact";

interface MarketplaceGridProps {
  agents?: any[];
  isSearchResult?: boolean;
}

export default function MarketplaceGrid({ agents, isSearchResult = false }: MarketplaceGridProps) {
  // Use passed agents or empty array if none provided
  const allTemplates = agents && agents.length > 0 ? agents : [];

  // Empty state - no agents in marketplace
  if (allTemplates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-7xl mb-6">🚀</div>
        <h3 
          className="text-2xl font-semibold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          No agents in the marketplace yet
        </h3>
        <p 
          className="text-base mb-8 max-w-md mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Be the first to create and share an agent with the community.
          Build custom agents for your workflows and publish them here.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="/agents/create"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-colors"
            style={{
              backgroundColor: "var(--primary-500)",
              textDecoration: "none",
            }}
          >
            Create Your First Agent
          </a>
          <a
            href="/agents"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold border transition-colors"
            style={{
              color: "var(--text-primary)",
              borderColor: "var(--border-default)",
              textDecoration: "none",
            }}
          >
            View My Agents
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Section - Larger cards (3-column on desktop) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2
            style={{
              fontSize: "var(--text-lg)", /* 16px - compact section headers */
              fontWeight: "var(--font-semibold)",
              lineHeight: "var(--leading-tight)",
              color: "var(--text-primary)",
            }}
          >
            🔥 Featured Agents
          </h2>
          <div className="badge badge-success">Top Rated</div>
        </div>
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", /* 4 cards per row for density */
            gap: "var(--grid-gap)", /* 18px - compact spacing */
          }}
          className="grid-compact" /* Apply responsive grid from design tokens */
        >
          {allTemplates.slice(0, 4).map((template) => ( /* Show 4 featured instead of 3 */
            <AgentTemplateCardCompact
              key={template.id}
              template={template}
              isFeatured={true}
            />
          ))}
        </div>
      </div>

      {/* Main Grid - Compact OpenSea-style cards (4 columns on desktop) */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2
            style={{
              fontSize: "var(--text-lg)", /* 16px - compact section headers */
              fontWeight: "var(--font-semibold)",
              lineHeight: "var(--leading-tight)",
              color: "var(--text-primary)",
            }}
          >
            All Agent Templates
          </h2>
          <div 
            style={{
              fontSize: "var(--text-xs)", /* 11px - compact meta text */
              color: "var(--text-secondary)",
            }}
          >
            {allTemplates.length} agents available
          </div>
        </div>
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)", /* 5 cards per row for maximum density */
            gap: "var(--grid-gap)", /* 18px - compact spacing */
          }}
          className="grid-compact" /* Apply responsive grid from design tokens */
        >
          {allTemplates.slice(4).map((template) => ( /* Start from 4 since featured shows 4 */
            <AgentTemplateCardCompact
              key={template.id}
              template={template}
              isFeatured={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
