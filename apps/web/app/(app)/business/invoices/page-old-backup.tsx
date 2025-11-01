'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Search,
  Download,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Calendar,
  MoreHorizontal,
} from 'lucide-react';
import { useState } from 'react';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string;
  issueDate: string;
}

const invoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2025-001',
    customer: 'TechCorp Industries',
    amount: 12500,
    status: 'paid',
    dueDate: '2025-10-15',
    issueDate: '2025-09-15',
  },
  {
    id: '2',
    number: 'INV-2025-002',
    customer: 'Global Solutions Inc',
    amount: 8500,
    status: 'pending',
    dueDate: '2025-10-25',
    issueDate: '2025-09-25',
  },
  {
    id: '3',
    number: 'INV-2025-003',
    customer: 'Startup Labs',
    amount: 3200,
    status: 'overdue',
    dueDate: '2025-10-01',
    issueDate: '2025-09-01',
  },
  {
    id: '4',
    number: 'INV-2025-004',
    customer: 'Enterprise Systems',
    amount: 21000,
    status: 'draft',
    dueDate: '2025-11-10',
    issueDate: '2025-10-10',
  },
];

const statusConfig = {
  paid: {
    label: 'Paid',
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  },
  overdue: {
    label: 'Overdue',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  draft: {
    label: 'Draft',
    icon: Calendar,
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  },
};

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    pending: invoices
      .filter((inv) => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0),
    overdue: invoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0),
  };

  return (
    <PageShell
      title="Invoices"
      subtitle="Manage your invoices and billing"
      breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Invoices' }]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">${(stats.total / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${(stats.paid / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            ${(stats.pending / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${(stats.overdue / 1000).toFixed(1)}K
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
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
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-subtle">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Invoice</th>
                <th className="text-left p-4 font-medium text-sm">Customer</th>
                <th className="text-left p-4 font-medium text-sm">Amount</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-left p-4 font-medium text-sm">Due Date</th>
                <th className="text-left p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const StatusIcon = statusConfig[invoice.status].icon;
                return (
                  <tr
                    key={invoice.id}
                    className="border-t border-border hover:bg-background-subtle transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium">{invoice.number}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">{invoice.customer}</td>
                    <td className="p-4 font-semibold">${invoice.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge className={statusConfig[invoice.status].className}>
                        {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                        {statusConfig[invoice.status].label}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      )}
    </PageShell>
  );
}
