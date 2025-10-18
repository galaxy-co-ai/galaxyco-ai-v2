"use client";

import React, { useState } from "react";
import { ListPage } from "@/components/templates/list-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Download } from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: "success" | "failed";
  ipAddress: string;
}

const mockAuditLog: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2025-10-18 15:45:23",
    user: "sarah@company.com",
    action: "agent.create",
    resource: "Lead Generator",
    status: "success",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    timestamp: "2025-10-18 15:42:15",
    user: "john@startup.io",
    action: "user.login",
    resource: "-",
    status: "success",
    ipAddress: "10.0.0.50",
  },
  {
    id: "3",
    timestamp: "2025-10-18 15:38:47",
    user: "admin@enterprise.com",
    action: "workspace.update",
    resource: "Enterprise LLC",
    status: "success",
    ipAddress: "172.16.0.10",
  },
  {
    id: "4",
    timestamp: "2025-10-18 15:30:12",
    user: "hacker@malicious.com",
    action: "user.login",
    resource: "-",
    status: "failed",
    ipAddress: "203.0.113.42",
  },
  {
    id: "5",
    timestamp: "2025-10-18 15:22:58",
    user: "lisa@agency.co",
    action: "document.delete",
    resource: "report-2024.pdf",
    status: "success",
    ipAddress: "192.168.2.75",
  },
];

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {},
  );

  const filteredAuditLog = mockAuditLog.filter((entry) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !entry.user.toLowerCase().includes(query) &&
        !entry.action.toLowerCase().includes(query) &&
        !entry.resource.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    const actionFilter = activeFilters.action || [];
    if (actionFilter.length > 0 && !actionFilter.includes(entry.action)) {
      return false;
    }

    const statusFilter = activeFilters.status || [];
    if (statusFilter.length > 0 && !statusFilter.includes(entry.status)) {
      return false;
    }

    return true;
  });

  return (
    <ListPage
      title="Audit Log"
      subtitle="Track all platform activity and changes"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Audit Log" }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search by user, action, or resource..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[
        {
          id: "action",
          label: "Action Type",
          type: "checkbox",
          options: [
            { value: "user.login", label: "User Login" },
            { value: "agent.create", label: "Agent Created" },
            { value: "workspace.update", label: "Workspace Updated" },
            { value: "document.delete", label: "Document Deleted" },
          ],
        },
        {
          id: "status",
          label: "Status",
          type: "checkbox",
          options: [
            { value: "success", label: "Success" },
            { value: "failed", label: "Failed" },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={(filterId, values) =>
        setActiveFilters({ ...activeFilters, [filterId]: values })
      }
      onClearFilters={() => {
        setActiveFilters({});
        setSearchQuery("");
      }}
      actions={
        <Button size="sm" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      }
    >
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAuditLog.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {entry.timestamp}
                  </td>
                  <td className="px-4 py-3 text-sm">{entry.user}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <code className="text-xs">{entry.action}</code>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {entry.resource}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        entry.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {entry.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                    {entry.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ListPage>
  );
}
