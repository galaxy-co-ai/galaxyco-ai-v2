"use client";

import React, { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Bug, Package } from "lucide-react";
import Link from "next/link";

const releases = [
  {
    version: "2.4.0",
    date: "2025-10-15",
    type: "major",
    features: [
      { type: "new", text: "Agent Templates Marketplace" },
      { type: "new", text: "Multi-Agent Workflows" },
      { type: "improved", text: "40% faster agent execution" },
      { type: "fixed", text: "Large document upload reliability" },
    ],
    breaking: false,
  },
  {
    version: "2.3.0",
    date: "2025-10-01",
    type: "minor",
    features: [
      { type: "new", text: "API Playground" },
      { type: "improved", text: "Enhanced dashboard analytics" },
      { type: "security", text: "Two-factor authentication support" },
    ],
    breaking: false,
  },
  {
    version: "2.2.0",
    date: "2025-09-15",
    type: "minor",
    features: [
      { type: "new", text: "Workspace Collaboration" },
      { type: "improved", text: "Redesigned execution logs" },
      { type: "deprecated", text: "API v1 endpoints (migrate to v2)" },
    ],
    breaking: true,
  },
  {
    version: "2.1.0",
    date: "2025-09-01",
    type: "minor",
    features: [
      { type: "new", text: "Dark mode support" },
      { type: "improved", text: "10x faster search performance" },
      { type: "fixed", text: "Timezone display issues" },
    ],
    breaking: false,
  },
];

const typeIcons = {
  new: Sparkles,
  improved: Zap,
  fixed: Bug,
  security: Package,
  deprecated: Package,
};

const typeColors = {
  new: "text-blue-600",
  improved: "text-purple-600",
  fixed: "text-green-600",
  security: "text-red-600",
  deprecated: "text-orange-600",
};

export default function ReleasesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReleases = releases.filter((release) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !release.version.toLowerCase().includes(query) &&
        !release.features.some((f) => f.text.toLowerCase().includes(query))
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <ListPage
      title="Release Notes"
      subtitle="Latest features and improvements"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Releases" }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search releases..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      actions={
        <Link href="/changelog">
          <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
            View Full Changelog →
          </Badge>
        </Link>
      }
    >
      <div className="space-y-6">
        {filteredReleases.map((release) => (
          <div
            key={release.version}
            className="rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">v{release.version}</h3>
                  <Badge
                    variant="secondary"
                    className={
                      release.type === "major"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }
                  >
                    {release.type}
                  </Badge>
                  {release.breaking && (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    >
                      Breaking Changes
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Released on{" "}
                  {new Date(release.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {release.features.map((feature, index) => {
                const Icon = typeIcons[feature.type as keyof typeof typeIcons];
                const color =
                  typeColors[feature.type as keyof typeof typeColors];

                return (
                  <div key={index} className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="capitalize text-xs font-medium text-muted-foreground">
                          {feature.type}:
                        </span>
                        <span>{feature.text}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {release.breaking && (
              <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-950 p-4 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                  ⚠️ Breaking Changes
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  This release includes breaking changes. Please review the
                  changelog before upgrading.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </ListPage>
  );
}
