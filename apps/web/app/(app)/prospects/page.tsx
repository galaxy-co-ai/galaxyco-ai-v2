"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ConfidenceBadge } from "@/components/shared/confidence-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { mockProspects } from "@/lib/fixtures";
import { Users, Plus, Building2, Mail, Linkedin } from "lucide-react";

export default function ProspectsPage() {
  const prospects = mockProspects;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prospects"
        description="Manage enriched prospects and leads"
      >
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Add Prospect
        </button>
      </PageHeader>

      {prospects.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No prospects yet"
          description="Add prospects to start enriching and engaging with them"
          action={{
            label: "Add Prospect",
            onClick: () => console.log("Add prospect"),
          }}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-neutral-50 dark:bg-neutral-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {prospects.map((prospect) => (
                  <tr
                    key={prospect.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {prospect.name}
                        </p>
                        <p className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                          <Mail className="h-3 w-3" />
                          {prospect.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {prospect.company}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-900 dark:text-neutral-100">
                        {prospect.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {prospect.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {prospect.enrichmentData && (
                        <ConfidenceBadge
                          score={prospect.enrichmentData.confidenceScore}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={prospect.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-600 hover:text-primary dark:text-neutral-400"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
