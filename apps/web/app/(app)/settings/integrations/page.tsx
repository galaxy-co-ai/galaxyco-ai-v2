"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { PageHeader } from "@/components/layout/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, X, Settings, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function IntegrationsPage() {
  const { currentWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for OAuth callback messages
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      const integrationName = success.replace("_connected", "");
      toast.success(
        `${integrationName.charAt(0).toUpperCase() + integrationName.slice(1)} connected successfully!`,
      );
      // Clear query params
      window.history.replaceState({}, "", "/settings/integrations");
    }

    if (error) {
      toast.error(`Failed to connect: ${error.replace(/_/g, " ")}`);
      window.history.replaceState({}, "", "/settings/integrations");
    }
  }, [searchParams]);

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

  const handleConnect = async (integrationType: string) => {
    if (!currentWorkspace?.id) return;

    try {
      setConnectingId(integrationType);

      // Get OAuth URL from backend
      const res = await fetch("/api/integrations/google/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          integrationType,
        }),
      });

      if (!res.ok) throw new Error("Failed to initiate OAuth");

      const { authUrl } = await res.json();

      // Redirect to OAuth URL
      window.location.href = authUrl;
    } catch (error) {
      console.error("Connect error:", error);
      toast.error("Failed to connect integration");
      setConnectingId(null);
    }
  };

  const handleDisconnect = async (integrationId: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect ${name}?`)) {
      return;
    }

    try {
      setConnectingId(integrationId);

      const res = await fetch(`/api/integrations/${integrationId}/disconnect`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to disconnect");

      toast.success(`${name} disconnected successfully`);

      // Refresh integrations list
      const refreshRes = await fetch(
        `/api/integrations?workspaceId=${currentWorkspace?.id}`,
      );
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setIntegrations(data.integrations);
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Failed to disconnect integration");
    } finally {
      setConnectingId(null);
    }
  };

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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      handleDisconnect(integration.id, integration.name)
                    }
                    disabled={connectingId === integration.id}
                  >
                    {connectingId === integration.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Disconnect"
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleConnect(integration.type)}
                  disabled={connectingId === integration.type}
                >
                  {connectingId === integration.type ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
