"use client";

import AgentTemplateCardCompact from "./AgentTemplateCardCompact";
import { spacing } from "@/lib/constants/design-system";

export default function MarketplaceGrid() {
  // Mock all agent templates - will be loaded from database
  const allTemplates = [
    {
      id: "5",
      name: "Cross-App Do-It-For-Me",
      shortDescription:
        "Executes multi-app requests in one prompt (calendar, email, docs)",
      category: "Productivity",
      type: "cross-app",
      rating: 475,
      reviewCount: 89,
      installCount: 1234,
      installs24h: 45,
      kpis: {
        successRate: 90,
        avgTimeSaved: "1.5 hrs/day",
      },
      tags: ["productivity", "automation", "multi-app"],
    },
    {
      id: "6",
      name: "Research & Web Summary",
      shortDescription:
        "Synthesizes web + internal sources; produces brief with citations",
      category: "Knowledge",
      type: "research",
      rating: 465,
      reviewCount: 76,
      installCount: 892,
      installs24h: 28,
      kpis: {
        successRate: 87,
        avgTimeSaved: "45 min/query",
      },
      tags: ["research", "knowledge", "web"],
    },
    {
      id: "7",
      name: "Code & Data Assistant",
      shortDescription:
        "Refactors code, writes tests, reviews PRs; SQL/Notebooks",
      category: "Development",
      type: "code",
      rating: 480,
      reviewCount: 134,
      installCount: 1678,
      installs24h: 52,
      kpis: {
        successRate: 93,
        avgTimeSaved: "3 hrs/day",
      },
      tags: ["code", "development", "testing"],
    },
    {
      id: "8",
      name: "Data Extraction Agent",
      shortDescription:
        "Monitors pages, extracts structured data, pushes to Sheets/DB",
      category: "Data",
      type: "data",
      rating: 470,
      reviewCount: 98,
      installCount: 1123,
      installs24h: 34,
      kpis: {
        successRate: 94,
        avgTimeSaved: "5 hrs/week",
      },
      tags: ["data", "extraction", "automation"],
    },
    {
      id: "9",
      name: "Trust & Security Checker",
      shortDescription:
        "Runs static checks on agents; shows grade and remediation",
      category: "Security",
      type: "security",
      badgeText: "NEW",
      rating: 455,
      reviewCount: 42,
      installCount: 567,
      installs24h: 23,
      kpis: {
        successRate: 96,
        avgTimeSaved: "30 min/agent",
      },
      tags: ["security", "trust", "compliance"],
    },
    {
      id: "10",
      name: "Trending Ranking Agent",
      shortDescription: "Computes Trending/Top leaderboards for Agents/Packs",
      category: "Analytics",
      type: "trending",
      rating: 460,
      reviewCount: 54,
      installCount: 734,
      installs24h: 19,
      kpis: {
        successRate: 99,
        avgTimeSaved: "2 hrs/week",
      },
      tags: ["analytics", "ranking", "marketplace"],
    },
  ];

  return (
    <div>
      {/* OpenSea-style: Featured Section - Larger cards (3-column on desktop) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: spacing.lg,
          marginBottom: spacing["2xl"],
        }}
      >
        {allTemplates.slice(0, 3).map((template) => (
          <AgentTemplateCardCompact
            key={template.id}
            template={template}
            isFeatured={true}
          />
        ))}
      </div>

      {/* OpenSea-style: Main Grid - Smaller cards (4-5 column on desktop, tighter spacing) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: spacing.md,
        }}
      >
        {allTemplates.slice(3).map((template) => (
          <AgentTemplateCardCompact
            key={template.id}
            template={template}
            isFeatured={false}
          />
        ))}
      </div>
    </div>
  );
}
