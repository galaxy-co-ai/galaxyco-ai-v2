"use client";

import React, { useState, useEffect } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface ExportRecord {
  id: string;
  resourceType: string;
  format: string;
  status: string;
  createdAt: string;
  fileSize?: number | null;
}

export default function ExportsPage() {
  const { currentWorkspace } = useWorkspace();
  const [exportHistory, setExportHistory] = useState<ExportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    entity: "agents",
    format: "csv",
    dateRange: "last-30-days",
  });

  useEffect(() => {
    async function fetchExports() {
      if (!currentWorkspace?.id) return;
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/exports?workspaceId=${currentWorkspace.id}&limit=20`,
        );
        if (!res.ok) throw new Error("Failed to fetch exports");
        const json = await res.json();
        setExportHistory(json.exports || []);
      } catch (e) {
        console.error("Failed to load exports", e);
        toast.error("Failed to load export history");
      } finally {
        setIsLoading(false);
      }
    }
    fetchExports();
  }, [currentWorkspace?.id]);

  const handleCreateExport = async () => {
    if (!currentWorkspace?.id) return;
    try {
      setIsCreating(true);
      const res = await fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          name: `${exportConfig.entity}-export`,
          resource: exportConfig.entity,
          format: exportConfig.format,
          filters: { dateRange: exportConfig.dateRange },
        }),
      });
      if (!res.ok) throw new Error("Failed to create export");
      const json = await res.json();
      toast.success(
        "Export created! Processing in background. Check back soon.",
      );
      // Refresh list
      const listRes = await fetch(
        `/api/exports?workspaceId=${currentWorkspace.id}&limit=20`,
      );
      if (listRes.ok) {
        const listJson = await listRes.json();
        setExportHistory(listJson.exports || []);
      }
    } catch (e) {
      toast.error("Failed to create export");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <PageShell
      title="Data Exports"
      subtitle="Export your data in multiple formats"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Exports" }]}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Export Configuration */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Export</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entity">Data Type</Label>
              <Select
                value={exportConfig.entity}
                onValueChange={(value) =>
                  setExportConfig({ ...exportConfig, entity: value })
                }
              >
                <SelectTrigger id="entity">
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agents">Agents</SelectItem>
                  <SelectItem value="executions">Executions</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="workspaces">Workspaces</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Export Format</Label>
              <Select
                value={exportConfig.format}
                onValueChange={(value) =>
                  setExportConfig({ ...exportConfig, format: value })
                }
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="excel">Excel (XLSX)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select
                value={exportConfig.dateRange}
                onValueChange={(value) =>
                  setExportConfig({ ...exportConfig, dateRange: value })
                }
              >
                <SelectTrigger id="dateRange">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 days</SelectItem>
                  <SelectItem value="all-time">All time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full mt-4"
              onClick={handleCreateExport}
              disabled={isCreating || !currentWorkspace?.id}
            >
              <Download className="mr-2 h-4 w-4" />
              {isCreating ? "Creating..." : "Create Export"}
            </Button>
          </div>
        </div>

        {/* Export Info */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Export Information</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Available Formats</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • CSV - Spreadsheet compatible, best for Excel/Google Sheets
                </li>
                <li>• JSON - Structured data, best for APIs and imports</li>
                <li>• Excel - Native Microsoft Excel format with formatting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Processing Time</h4>
              <p className="text-sm text-muted-foreground">
                Exports are processed in the background. You&apos;ll receive a
                download link once ready (usually under 5 minutes).
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Data Retention</h4>
              <p className="text-sm text-muted-foreground">
                Export files are stored for 7 days before automatic deletion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Export History</h3>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading...
          </div>
        ) : exportHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No exports yet. Create your first export above.
          </div>
        ) : (
          <div className="space-y-3">
            {exportHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">
                        {item.resourceType || "Export"}
                      </span>
                      <Badge variant="secondary" className="text-xs uppercase">
                        {item.format}
                      </Badge>
                      {item.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : item.status === "processing" ? (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()} •{" "}
                      {item.fileSize
                        ? `${(item.fileSize / 1024 / 1024).toFixed(2)} MB`
                        : "—"}
                    </div>
                  </div>
                </div>
                {item.status === "completed" && (
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
