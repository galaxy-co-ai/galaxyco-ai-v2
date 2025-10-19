"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { PageHeader } from "@/components/layout/page-header";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Check, X, Settings } from "lucide-react";

export default function IntegrationsPage() {
  const { currentWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchIntegrations() {
      if (!currentWorkspace?.id) return;

      try {
        const res = await fetch(
          `/api/integrations?workspaceId=${currentWorkspace.id}`,
        );
        if (!res.ok) throw new Error("Failed to fetch integrations");
        const data = await res.json();
        setIntegrations(data.integrations);
      } catch (error) {
        toast.error("Failed to load integrations");
      } finally {
        setIsLoading(false);
      }
    }

    fetchIntegrations();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect and manage third-party services"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <div key={integration.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {integration.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {integration.type}
                </p>
              </div>
              {integration.status === "active" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <Check className="h-3 w-3" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <X className="h-3 w-3" />
                  {integration.status}
                </span>
              )}
            </div>

            {integration.status === "active" && integration.connectedAt && (
              <p className="mt-4 text-xs text-neutral-600 dark:text-neutral-400">
                Connected:{" "}
                {new Date(integration.connectedAt).toLocaleDateString()}
              </p>
            )}

            <div className="mt-4 flex gap-2">
              {integration.status === "active" ? (
                <>
                  <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-md border text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <Settings className="h-4 w-4" />
                    Configure
                  </button>
                  <button className="flex h-9 flex-1 items-center justify-center gap-2 rounded-md border border-red-300 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/10">
                    Disconnect
                  </button>
                </>
              ) : (
                <button className="flex h-9 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-white hover:bg-primary/90">
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
