'use client';

import React, { useState } from 'react';
import { ListPage } from '@/components/templates/list-page';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Bug, Zap, Shield, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

type ChangeType = 'new' | 'improved' | 'fixed' | 'security' | 'deprecated';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: Array<{
    type: ChangeType;
    title: string;
    description: string;
  }>;
}

const changeTypeConfig: Record<
  ChangeType,
  { icon: typeof Sparkles; label: string; className: string }
> = {
  new: {
    icon: Sparkles,
    label: 'New',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  improved: {
    icon: Zap,
    label: 'Improved',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
  fixed: {
    icon: Bug,
    label: 'Fixed',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  security: {
    icon: Shield,
    label: 'Security',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  deprecated: {
    icon: Package,
    label: 'Deprecated',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  },
};

const changelog: ChangelogEntry[] = [
  {
    version: '2.4.0',
    date: '2025-10-15',
    changes: [
      {
        type: 'new',
        title: 'Agent Templates Marketplace',
        description:
          'Browse and deploy pre-built agent templates from our community marketplace. Save hours on configuration with battle-tested agent blueprints.',
      },
      {
        type: 'new',
        title: 'Multi-Agent Workflows',
        description:
          'Chain multiple agents together to create complex automation workflows. Agents can now hand off tasks to specialized agents automatically.',
      },
      {
        type: 'improved',
        title: 'Performance Optimization',
        description:
          "Agent execution is now 40% faster on average. We've optimized the runtime engine for better throughput and lower latency.",
      },
      {
        type: 'fixed',
        title: 'Document Upload Reliability',
        description:
          'Fixed an issue where large documents (>50MB) would fail to upload in certain network conditions.',
      },
    ],
  },
  {
    version: '2.3.0',
    date: '2025-10-01',
    changes: [
      {
        type: 'new',
        title: 'API Playground',
        description:
          'Test API endpoints directly in the browser with our new interactive playground. No Postman required!',
      },
      {
        type: 'improved',
        title: 'Dashboard Analytics',
        description:
          'Enhanced dashboard with more detailed metrics, custom date ranges, and exportable reports.',
      },
      {
        type: 'security',
        title: 'Two-Factor Authentication',
        description:
          'Added support for 2FA using authenticator apps. Protect your account with an extra layer of security.',
      },
      {
        type: 'fixed',
        title: 'Mobile Navigation',
        description:
          'Fixed sidebar navigation on mobile devices (< 768px) not responding correctly to touch gestures.',
      },
    ],
  },
  {
    version: '2.2.0',
    date: '2025-09-15',
    changes: [
      {
        type: 'new',
        title: 'Workspace Collaboration',
        description:
          'Invite team members to your workspace with role-based permissions (Admin, Member, Viewer).',
      },
      {
        type: 'improved',
        title: 'Agent Execution Logs',
        description:
          'Redesigned execution logs with better filtering, search, and real-time updates. Debug faster.',
      },
      {
        type: 'deprecated',
        title: 'Legacy API v1 Endpoints',
        description:
          'API v1 endpoints are now deprecated and will be removed in version 3.0. Please migrate to v2.',
      },
    ],
  },
  {
    version: '2.1.0',
    date: '2025-09-01',
    changes: [
      {
        type: 'new',
        title: 'Dark Mode Support',
        description:
          'Added full dark mode support across the entire platform. Toggle between light/dark themes in settings.',
      },
      {
        type: 'improved',
        title: 'Search Performance',
        description:
          'Global search is now 10x faster with our new indexing system. Results appear instantly as you type.',
      },
      {
        type: 'fixed',
        title: 'Timezone Display',
        description:
          "Fixed an issue where timestamps weren't converting correctly to user's local timezone.",
      },
    ],
  },
];

export default function ChangelogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Filter changelog entries
  const filteredChangelog = changelog.filter((entry) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesVersion = entry.version.toLowerCase().includes(query);
      const matchesChanges = entry.changes.some(
        (change) =>
          change.title.toLowerCase().includes(query) ||
          change.description.toLowerCase().includes(query),
      );
      if (!matchesVersion && !matchesChanges) return false;
    }

    // Type filter
    const typeFilter = activeFilters.type || [];
    if (typeFilter.length > 0) {
      const hasMatchingType = entry.changes.some((change) => typeFilter.includes(change.type));
      if (!hasMatchingType) return false;
    }

    return true;
  });

  return (
    <ListPage
      title="Changelog"
      subtitle="Track new features, improvements, and fixes"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Changelog' }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search releases..."
      onSearchChange={setSearchQuery}
      showViewToggle={false}
      filters={[
        {
          id: 'type',
          label: 'Change Type',
          type: 'checkbox',
          options: [
            { value: 'new', label: 'New Features' },
            { value: 'improved', label: 'Improvements' },
            { value: 'fixed', label: 'Bug Fixes' },
            { value: 'security', label: 'Security' },
            { value: 'deprecated', label: 'Deprecations' },
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
    >
      <div className="space-y-8">
        {filteredChangelog.map((entry) => (
          <div key={entry.version} className="rounded-lg border border-border bg-card p-6">
            {/* Version Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-base px-3 py-1">
                  v{entry.version}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Changes List */}
            <div className="space-y-4">
              {entry.changes.map((change, index) => {
                const config = changeTypeConfig[change.type];
                const Icon = config.icon;

                return (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0',
                        config.className,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{change.title}</h4>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            config.className,
                          )}
                        >
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{change.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredChangelog.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No releases found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </ListPage>
  );
}
