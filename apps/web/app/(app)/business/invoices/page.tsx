'use client';

import { useState, useEffect } from 'react';
import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Plus, Search, Download, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

interface Invoice {
  id: string;
  workspaceId: string;
  invoiceNumber: string;
  status: 'draft' | 'pending' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  customerId: string;
  projectId: string | null;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  currency: string;
  items: any;
  issueDate: string;
  dueDate: string;
  paidAt: string | null;
  notes: string | null;
  terms: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<
  string,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
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
  sent: {
    label: 'Sent',
    icon: FileText,
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  },
  overdue: {
    label: 'Overdue',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
  draft: {
    label: 'Draft',
    icon: FileText,
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  },
};

export default function InvoicesPage() {
  const { currentWorkspace } = useWorkspace();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchInvoices() {
      if (!currentWorkspace?.id) return;

      try {
        setIsLoading(true);
        const res = await fetch(`/api/invoices?workspaceId=${currentWorkspace.id}&limit=100`);
        if (!res.ok) throw new Error('Failed to fetch invoices');
        const data = await res.json();
        setInvoices(data.invoices || []);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
        toast.error('Failed to load invoices');
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvoices();
  }, [currentWorkspace?.id]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      searchQuery === '' || invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    paid: invoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + (inv.total || 0), 0),
    pending: invoices
      .filter((inv) => inv.status === 'pending' || inv.status === 'sent')
      .reduce((sum, inv) => sum + (inv.total || 0), 0),
    overdue: invoices
      .filter((inv) => inv.status === 'overdue')
      .reduce((sum, inv) => sum + (inv.total || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
          <p className="text-2xl font-bold">${(stats.total / 100 / 1000).toFixed(1)}K</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            ${(stats.paid / 100 / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            ${(stats.pending / 100 / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            ${(stats.overdue / 100 / 1000).toFixed(1)}K
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
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Invoice</th>
                <th className="text-left p-4 font-medium text-sm">Amount</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-left p-4 font-medium text-sm">Due Date</th>
                <th className="text-left p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => {
                  const StatusIcon = statusConfig[invoice.status]?.icon || FileText;
                  return (
                    <tr key={invoice.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div className="font-medium">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">${(invoice.total / 100).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.currency.toUpperCase()}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={statusConfig[invoice.status]?.className}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[invoice.status]?.label || invoice.status}
                        </Badge>
                      </td>
                      <td className="p-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No invoices found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
