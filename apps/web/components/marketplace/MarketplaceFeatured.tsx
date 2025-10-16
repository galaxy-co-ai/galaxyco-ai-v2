"use client";

import { colors, shadows } from "@/lib/constants/design-system";
import AgentTemplateCard from "./AgentTemplateCard";

export default function MarketplaceFeatured() {
  // Mock featured agents - will be loaded from database
  const featuredAgents = [
    {
      id: "1",
      name: "Browser Automation Agent",
      shortDescription:
        "Operates web apps via UI to file forms, reconcile data, QA flows",
      category: "Automation",
      type: "browser",
      badgeText: "TRENDING #1",
      rating: 490, // 4.9 stars
      reviewCount: 142,
      installCount: 2543,
      installs24h: 89,
      kpis: {
        successRate: 95,
        avgTimeSaved: "2 hrs/task",
        accuracy: 98,
      },
      tags: ["automation", "browser", "rpa"],
    },
    {
      id: "2",
      name: "Knowledge RAG Agent",
      shortDescription:
        "Answers with citations from connected sources with source tiles",
      category: "Knowledge",
      type: "knowledge",
      badgeText: "POPULAR",
      rating: 480,
      reviewCount: 98,
      installCount: 1847,
      installs24h: 45,
      kpis: {
        successRate: 92,
        avgTimeSaved: "30 min/query",
        accuracy: 96,
      },
      tags: ["knowledge", "rag", "search"],
    },
    {
      id: "3",
      name: "Sales GTM Copilot",
      shortDescription:
        "Prospecting, enrichment, CRM updates, sequence personalization",
      category: "Sales",
      type: "sales",
      badgeText: "NEW",
      rating: 470,
      reviewCount: 67,
      installCount: 923,
      installs24h: 67,
      kpis: {
        successRate: 88,
        avgTimeSaved: "3 hrs/day",
        accuracy: 94,
      },
      tags: ["sales", "gtm", "crm"],
    },
    {
      id: "4",
      name: "Meeting Notes Orchestrator",
      shortDescription:
        "Transcribes, assigns tasks, schedules follow-ups automatically",
      category: "Productivity",
      type: "meeting",
      rating: 485,
      reviewCount: 124,
      installCount: 1567,
      installs24h: 34,
      kpis: {
        successRate: 91,
        avgTimeSaved: "45 min/meeting",
        accuracy: 97,
      },
      tags: ["meetings", "notes", "tasks"],
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // Slightly tighter min width
        gap: "var(--space-4)", // 16px - compact grid gap
      }}
    >
      {featuredAgents.map((agent) => (
        <AgentTemplateCard key={agent.id} template={agent} isFeatured={true} />
      ))}
    </div>
  );
}
