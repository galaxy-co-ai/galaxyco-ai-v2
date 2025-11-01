'use client';

import { useState, useEffect } from 'react';
import { ListPage } from '@/components/templates/list-page';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Plus, Building2, Mail, Linkedin, User } from 'lucide-react';
import { useWorkspace } from '@/contexts/workspace-context';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

interface Prospect {
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  title: string | null;
  stage: string;
  score: number | null;
  estimatedValue: number | null;
  assignedTo: string | null;
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  linkedinUrl: string | null;
  tags: string[] | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProspectsPage() {
  const { currentWorkspace } = useWorkspace();
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    async function fetchProspects() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/prospects?workspaceId=${currentWorkspace.id}&limit=100`);
        if (!res.ok) throw new Error('Failed to fetch prospects');
        const data = await res.json();
        setProspects(data.prospects || []);
      } catch (error) {
        console.error('Failed to fetch prospects:', error);
        toast.error('Failed to load prospects');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProspects();
  }, [currentWorkspace?.id]);

  // Filter prospects
  const filteredProspects = prospects.filter((prospect) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prospect.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (prospect.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (prospect.title?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    // Status filter
    const statusFilter = activeFilters.status || [];
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(prospect.stage);

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
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ListPage
      title="Prospects"
      subtitle="Manage enriched prospects and leads"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Prospects' }]}
      searchQuery={searchQuery}
      searchPlaceholder="Search prospects by name, email, or company..."
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      filters={[
        {
          id: 'status',
          label: 'Status',
          type: 'checkbox',
          options: [
            { value: 'new', label: 'New' },
            { value: 'contacted', label: 'Contacted' },
            { value: 'qualified', label: 'Qualified' },
            { value: 'nurturing', label: 'Nurturing' },
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
          <p className="text-muted-foreground mb-4">No prospects match your search or filters</p>
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
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      prospect.name,
                    )}`}
                    alt={prospect.name}
                    fallback={<User className="h-4 w-4" />}
                    size="lg"
                  />
                  <div>
                    <h3 className="font-semibold">{prospect.name}</h3>
                    <p className="text-sm text-muted-foreground">{prospect.title || 'No title'}</p>
                  </div>
                </div>
                <Badge variant="secondary">{prospect.stage}</Badge>
              </div>

              {/* Company */}
              {prospect.company && (
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{prospect.company}</span>
                </div>
              )}

              {/* Email */}
              {prospect.email && (
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground truncate">{prospect.email}</span>
                </div>
              )}

              {/* Score Badge */}
              {prospect.score !== null && prospect.score > 0 && (
                <div className="mb-4">
                  <Badge
                    className={
                      prospect.score >= 80
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : prospect.score >= 50
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                    }
                  >
                    Score: {prospect.score}/100
                  </Badge>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border">
                <Button size="sm" variant="outline" className="flex-1">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
                {prospect.linkedinUrl && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={prospect.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ListPage>
  );
}
