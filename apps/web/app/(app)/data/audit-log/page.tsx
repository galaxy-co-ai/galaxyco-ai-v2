'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { ListPage } from '@/components/templates/list-page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Download, Loader2 } from 'lucide-react';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  workspaceId: string;
}

interface AuditLogResponse {
  audit_log: AuditEntry[];
  total: number;
  limit: number;
  offset: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to fetch' }));
    throw new Error(error.error || 'Failed to fetch audit log');
  }
  return res.json();
};

export default function AuditLogPage() {
  const { currentWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const { data, error, isLoading } = useSWR<AuditLogResponse>(
    currentWorkspace ? `/api/audit-log?workspaceId=${currentWorkspace.id}&limit=100` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err: Error) => {
        toast.error(err.message || 'Failed to load audit log');
      },
    },
  );

  const auditLog = data?.audit_log || [];

  const filteredAuditLog = auditLog.filter((entry: AuditEntry) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !entry.userId.toLowerCase().includes(query) &&
        !entry.action.toLowerCase().includes(query) &&
        !entry.resourceType.toLowerCase().includes(query) &&
        !entry.resourceId.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    const actionFilter = activeFilters.action || [];
    if (actionFilter.length > 0 && !actionFilter.includes(entry.action)) {
      return false;
    }

    return true;
  });

  return (
    <ListPage
      title="Audit Log"
      subtitle="Track all platform activity and changes"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Audit Log' }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search by user, action, or resource..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[
        {
          id: 'action',
          label: 'Action Type',
          type: 'checkbox',
          options: [
            { value: 'create', label: 'Create' },
            { value: 'update', label: 'Update' },
            { value: 'delete', label: 'Delete' },
            { value: 'login', label: 'Login' },
            { value: 'execute', label: 'Execute' },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={(filterId, values) =>
        setActiveFilters({ ...activeFilters, [filterId]: values })
      }
      onClearFilters={() => {
        setActiveFilters({});
        setSearchQuery('');
      }}
      actions={
        <Button size="sm" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
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
            Failed to load audit log. Please try again.
          </div>
        )}

        {!isLoading && !error && filteredAuditLog.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">No audit log entries found.</div>
        )}

        {!isLoading && !error && filteredAuditLog.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Timestamp</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Action</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Resource</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAuditLog.map((entry: AuditEntry) => (
                  <tr key={entry.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{entry.userId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <code className="text-xs">{entry.action}</code>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <div>
                        <div className="font-medium">{entry.resourceType}</div>
                        <div className="text-xs">{entry.resourceId}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                      {entry.ipAddress || 'N/A'}
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
