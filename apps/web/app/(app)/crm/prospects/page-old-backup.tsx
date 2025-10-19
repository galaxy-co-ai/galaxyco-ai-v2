"use client";

import { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { mockProspects } from "@/lib/fixtures";
import { Plus, Building2, Mail, Linkedin, User } from "lucide-react";

export default function ProspectsPage() {
  const prospects = mockProspects;
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  // Filter prospects
  const filteredProspects = prospects.filter((prospect) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prospect.title?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const statusFilter = activeFilters.status || [];
    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(prospect.status);

    return matchesSearch && matchesStatus;
  });

  const handleFilterChange = (filterId: string, values: string[]) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterId]: values,
    }));
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  return (
    <ListPage
      title="Prospects"
      subtitle="Manage enriched prospects and leads"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Prospects" }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search prospects by name, email, or company..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      filters={[
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "new", label: "New" },
            { value: "contacted", label: "Contacted" },
            { value: "qualified", label: "Qualified" },
            { value: "nurturing", label: "Nurturing" },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Prospect
        </Button>
      }
      isEmpty={prospects.length === 0}
      emptyMessage="No prospects yet. Add prospects to start enriching and engaging with them."
      emptyAction={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Prospect
        </Button>
      }
    >
      {filteredProspects.length === 0 && prospects.length > 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No prospects match your search or filters
          </p>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProspects.map((prospect) => (
            <div
              key={prospect.id}
              className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src=""
                    alt={prospect.name}
                    fallback={<User className="h-4 w-4" />}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold">{prospect.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {prospect.title}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{prospect.status}</Badge>
              </div>

              {/* Company */}
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{prospect.company}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">
                  {prospect.email}
                </span>
              </div>

              {/* Confidence Score */}
              {prospect.enrichmentData && (
                <div className="mb-4">
                  <ConfidenceBadge
                    score={prospect.enrichmentData.confidenceScore}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={prospect.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ListPage>
  );
}
