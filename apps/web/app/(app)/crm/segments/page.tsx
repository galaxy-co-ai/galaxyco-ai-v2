"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Users,
  TrendingUp,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";

interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  count: number;
  growth: number;
  lastUpdated: string;
  color: string;
}

const mockSegments: Segment[] = [
  {
    id: "1",
    name: "Enterprise Customers",
    description: "Companies with 500+ employees",
    criteria: ["Company size: 500+", "Plan: Enterprise", "MRR > $10K"],
    count: 234,
    growth: 12,
    lastUpdated: "2 hours ago",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "High-Value Leads",
    description: "Qualified leads with strong intent",
    criteria: ["Lead score > 80", "Engaged last 7 days", "Budget confirmed"],
    count: 567,
    growth: 24,
    lastUpdated: "1 hour ago",
    color: "bg-green-500",
  },
  {
    id: "3",
    name: "At-Risk Customers",
    description: "Customers showing churn signals",
    criteria: ["Usage < 50%", "No login 30+ days", "Support tickets > 5"],
    count: 89,
    growth: -5,
    lastUpdated: "30 min ago",
    color: "bg-red-500",
  },
  {
    id: "4",
    name: "Trial Users",
    description: "Active trial accounts",
    criteria: ["Status: Trial", "Days remaining < 7", "Usage > 20%"],
    count: 342,
    growth: 8,
    lastUpdated: "15 min ago",
    color: "bg-purple-500",
  },
];

export default function SegmentsPage() {
  const { currentWorkspace } = useWorkspace();
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchSegments() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/segments?workspaceId=${currentWorkspace.id}`,
        );

        if (!res.ok) {
          console.warn("Segments API not available, using mock data");
          setSegments(mockSegments);
          return;
        }

        const data = await res.json();
        setSegments(data.segments || mockSegments);
      } catch (error) {
        console.error("Failed to fetch segments:", error);
        setSegments(mockSegments);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSegments();
  }, [currentWorkspace?.id]);

  const filteredSegments = segments.filter((segment) =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalContacts = segments.reduce((sum, s) => sum + s.count, 0);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <PageShell
      title="Customer Segments"
      subtitle="Organize and target your audience with dynamic segments"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "CRM", href: "/crm" },
        { label: "Segments" },
      ]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Segment
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Segments</p>
          <p className="text-2xl font-bold">{segments.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Contacts</p>
          <p className="text-2xl font-bold">{totalContacts.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Avg Growth</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            +
            {Math.round(
              segments.reduce((sum, s) => sum + s.growth, 0) / segments.length,
            )}
            %
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
          <p className="text-sm font-semibold truncate">
            {segments[0].lastUpdated}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search segments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Segments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSegments.map((segment) => (
          <div
            key={segment.id}
            className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary hover:shadow-md transition-all"
          >
            {/* Color Bar */}
            <div className={`h-2 ${segment.color}`} />

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-1 truncate">
                    {segment.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {segment.description}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Criteria Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {segment.criteria.map((criterion, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {criterion}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    {segment.count.toLocaleString()}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    segment.growth >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  <TrendingUp
                    className={`h-4 w-4 ${segment.growth < 0 ? "rotate-180" : ""}`}
                  />
                  {segment.growth > 0 ? "+" : ""}
                  {segment.growth}%
                </div>
              </div>

              <div className="text-xs text-muted-foreground mb-4">
                Updated {segment.lastUpdated}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Filter className="h-3 w-3 mr-1" />
                  Edit Rules
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Contacts
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSegments.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No segments found</h3>
          <p className="text-muted-foreground mb-4">
            Create segments to organize and target your audience
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Segment
          </Button>
        </div>
      )}
    </PageShell>
  );
}
