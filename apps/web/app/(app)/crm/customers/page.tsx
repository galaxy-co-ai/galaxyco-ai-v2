'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { useWorkspace } from '@/contexts/workspace-context';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  Globe,
  TrendingUp,
  Users,
  DollarSign,
  MoreHorizontal,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Customer {
  id: string;
  workspaceId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  website: string | null;
  status: string;
  industry: string | null;
  size: string | null;
  revenue: number | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  },
  lead: {
    label: 'Lead',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  churned: {
    label: 'Churned',
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  prospect: {
    label: 'Prospect',
    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  },
};

export default function CustomersPage() {
  const { currentWorkspace } = useWorkspace();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    async function fetchCustomers() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          workspaceId: currentWorkspace.id,
          limit: '100',
        });

        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const res = await fetch(`/api/customers?${params}`);
        if (!res.ok) throw new Error('Failed to fetch customers');

        const data = await res.json();
        setCustomers(data.customers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        toast.error('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomers();
  }, [currentWorkspace?.id, statusFilter, searchQuery]);

  const filteredCustomers = customers;

  const totalRevenue = customers
    .filter((c) => c.status === 'active' && c.revenue)
    .reduce((sum, c) => sum + (c.revenue || 0), 0);
  const activeCustomers = customers.filter((c) => c.status === 'active').length;
  const leads = customers.filter((c) => c.status === 'lead').length;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <PageShell
      title="Customers"
      subtitle="Manage your customer relationships and accounts"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Customers' }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Active Customers</span>
          </div>
          <p className="text-2xl font-bold">{activeCustomers}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">New Leads</span>
          </div>
          <p className="text-2xl font-bold">{leads}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Total Value</span>
          </div>
          <p className="text-2xl font-bold">${(totalRevenue / 100000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="lead">Lead</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {filteredCustomers.length} customer
          {filteredCustomers.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customer.name)}`}
                    alt={customer.name}
                    fallback={customer.name.substring(0, 2).toUpperCase()}
                    size="default"
                  />
                  <div>
                    <h3 className="font-semibold">{customer.name}</h3>
                    <p className="text-sm text-muted-foreground">{customer.company}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 mb-4">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{customer.phone}</span>
                  </div>
                )}
                {customer.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{customer.website}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Badge className={statusConfig[customer.status].className}>
                  {statusConfig[customer.status].label}
                </Badge>
                {customer.status === 'active' && customer.revenue && (
                  <span className="text-sm font-semibold">
                    ${(customer.revenue / 100000).toFixed(0)}K
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-subtle">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">Customer</th>
                  <th className="text-left p-4 font-medium text-sm">Company</th>
                  <th className="text-left p-4 font-medium text-sm">Status</th>
                  <th className="text-left p-4 font-medium text-sm">Industry</th>
                  <th className="text-left p-4 font-medium text-sm">Value</th>
                  <th className="text-left p-4 font-medium text-sm">Last Contact</th>
                  <th className="text-left p-4 font-medium text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-border hover:bg-background-subtle transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customer.name)}`}
                          alt={customer.name}
                          fallback={customer.name.substring(0, 2).toUpperCase()}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{customer.company}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={statusConfig[customer.status].className}>
                        {statusConfig[customer.status].label}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{customer.industry}</td>
                    <td className="p-4 font-semibold">
                      {customer.status === 'active' && customer.revenue
                        ? `$${(customer.revenue / 100000).toFixed(0)}K`
                        : '-'}
                    </td>
                    <td className="p-4 text-muted-foreground text-sm">
                      {customer.lastContactedAt
                        ? new Date(customer.lastContactedAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No customers found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Customer
          </Button>
        </div>
      )}
    </PageShell>
  );
}
