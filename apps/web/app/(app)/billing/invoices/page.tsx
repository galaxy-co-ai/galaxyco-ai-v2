'use client';

import { PageShell } from '@/components/templates/page-shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink } from 'lucide-react';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl: string;
}

const invoices: Invoice[] = [
  {
    id: 'INV-2025-10',
    date: 'Oct 1, 2025',
    amount: 99.0,
    status: 'paid',
    pdfUrl: '#',
  },
  {
    id: 'INV-2025-09',
    date: 'Sep 1, 2025',
    amount: 99.0,
    status: 'paid',
    pdfUrl: '#',
  },
  {
    id: 'INV-2025-08',
    date: 'Aug 1, 2025',
    amount: 99.0,
    status: 'paid',
    pdfUrl: '#',
  },
  {
    id: 'INV-2025-07',
    date: 'Jul 1, 2025',
    amount: 49.0,
    status: 'paid',
    pdfUrl: '#',
  },
];

export default function BillingInvoicesPage() {
  return (
    <PageShell
      title="Invoices"
      subtitle="View and download your billing invoices"
      breadcrumbs={[
        { label: 'Settings', href: '/settings' },
        { label: 'Billing', href: '/billing' },
        { label: 'Invoices' },
      ]}
    >
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-subtle">
              <tr>
                <th className="text-left p-4 font-medium text-sm">Invoice ID</th>
                <th className="text-left p-4 font-medium text-sm">Date</th>
                <th className="text-left p-4 font-medium text-sm">Amount</th>
                <th className="text-left p-4 font-medium text-sm">Status</th>
                <th className="text-left p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-t border-border hover:bg-background-subtle transition-colors"
                >
                  <td className="p-4 font-mono text-sm">{invoice.id}</td>
                  <td className="p-4 text-sm">{invoice.date}</td>
                  <td className="p-4 font-semibold">${invoice.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge
                      variant={
                        invoice.status === 'paid'
                          ? 'secondary'
                          : invoice.status === 'pending'
                            ? 'outline'
                            : 'destructive'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-card p-6">
        <h3 className="font-semibold mb-2">Need help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you have questions about your invoices or need a copy sent to a different email,
          contact our billing team.
        </p>
        <Button variant="outline">Contact Billing Support</Button>
      </div>
    </PageShell>
  );
}
