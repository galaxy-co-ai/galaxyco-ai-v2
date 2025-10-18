"use client";

import React, { useState } from "react";
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

const exportHistory = [
  {
    id: "1",
    type: "Agents",
    format: "CSV",
    status: "completed",
    createdAt: "2025-10-18 14:30",
    size: "2.4 MB",
  },
  {
    id: "2",
    type: "Executions",
    format: "JSON",
    status: "completed",
    createdAt: "2025-10-17 09:15",
    size: "8.1 MB",
  },
  {
    id: "3",
    type: "Users",
    format: "Excel",
    status: "processing",
    createdAt: "2025-10-18 15:45",
    size: "-",
  },
];

export default function ExportsPage() {
  const [exportConfig, setExportConfig] = useState({
    entity: "agents",
    format: "csv",
    dateRange: "last-30-days",
  });

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

            <Button className="w-full mt-4">
              <Download className="mr-2 h-4 w-4" />
              Create Export
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
                    <span className="font-medium">{item.type}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.format}
                    </Badge>
                    {item.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.createdAt} • {item.size}
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
      </div>
    </PageShell>
  );
}
