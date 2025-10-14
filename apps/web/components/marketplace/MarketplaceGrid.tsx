"use client";

import AgentTemplateCardCompact from "./AgentTemplateCardCompact";

interface MarketplaceGridProps {
  agents?: any[];
  isSearchResult?: boolean;
}

export default function MarketplaceGrid({ agents, isSearchResult = false }: MarketplaceGridProps) {
  // Use passed agents or empty array if none provided
  const allTemplates = agents && agents.length > 0 ? agents : [];

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
