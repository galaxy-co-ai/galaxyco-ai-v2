"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { ListPage } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Webhook, Plus, Play, MoreHorizontal, Loader2 } from "lucide-react";
import { useWorkspace } from "@/contexts/workspace-context";
import { toast } from "sonner";

interface WebhookType {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  workspaceId: string;
}

interface WebhooksResponse {
  webhooks: WebhookType[];
  total: number;
  limit: number;
  offset: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Failed to fetch" }));
    throw new Error(error.error || "Failed to fetch webhooks");
  }
  return res.json();
};

export default function WebhooksPage() {
  const { currentWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const { data, error, isLoading } = useSWR<WebhooksResponse>(
    currentWorkspace
      ? `/api/webhooks?workspaceId=${currentWorkspace.id}&limit=100`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err: Error) => {
        toast.error(err.message || "Failed to load webhooks");
      },
    },
  );

  const webhooks = data?.webhooks || [];

  const filteredWebhooks = webhooks.filter((webhook: WebhookType) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !webhook.name.toLowerCase().includes(query) &&
        !webhook.url.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <ListPage
      title="Webhooks"
      subtitle="Manage webhook integrations"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Webhooks" }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search webhooks..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[]}
      activeFilters={activeFilters}
      onFilterChange={(filterId, values) =>
        setActiveFilters({ ...activeFilters, [filterId]: values })
      }
      onClearFilters={() => {
        setActiveFilters({});
        setSearchQuery("");
      }}
      actions={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      }
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-red-600 dark:text-red-400">
            Failed to load webhooks. Please try again.
          </div>
        )}

        {!isLoading && !error && filteredWebhooks.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">
            No webhooks found. Create your first webhook to get started.
          </div>
        )}

        {!isLoading && !error && filteredWebhooks.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    URL
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Events
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredWebhooks.map((webhook: WebhookType) => (
                  <tr
                    key={webhook.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Webhook className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{webhook.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs text-muted-foreground">
                        {webhook.url.length > 40
                          ? webhook.url.substring(0, 40) + "..."
                          : webhook.url}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {webhook.events
                          .slice(0, 2)
                          .map((event: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {event}
                            </Badge>
                          ))}
                        {webhook.events.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{webhook.events.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(webhook.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ListPage>
  );
}
