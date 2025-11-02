'use client';

import { useState, useEffect } from 'react';
import { useWorkspace } from '@/contexts/workspace-context';
import { PageShell } from '@/components/templates/page-shell';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function BillingSettingsPage() {
  const { currentWorkspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(true);
  const [billingData, setBillingData] = useState<any>(null);

  useEffect(() => {
    async function fetchBilling() {
      if (!currentWorkspace?.id) return;

      try {
        const res = await fetch(`/api/billing?workspaceId=${currentWorkspace.id}`);
        if (!res.ok) throw new Error('Failed to fetch billing');
        const data = await res.json();
        setBillingData(data);
      } catch (error) {
        toast.error('Failed to load billing information');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBilling();
  }, [currentWorkspace?.id]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Failed to load billing information</p>
      </div>
    );
  }

  const paymentMethod = billingData.paymentMethod;
  const invoices = billingData.invoices;

  return (
    <PageShell
      title="Billing Settings"
      subtitle="Manage your subscription, payment methods, and invoices"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Settings', href: '/settings' },
        { label: 'Billing' },
      ]}
    >
      <div className="space-y-8">
        {/* Current Plan */}
        <Card className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Current Plan</h3>
              <p className="text-sm text-muted-foreground">
                You are currently on the Professional plan
              </p>
            </div>
            <Badge>Active</Badge>
          </div>
          <div className="space-y-4 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Monthly billing</span>
              </div>
              <span className="font-semibold">
                ${(billingData.subscription.price / 100).toFixed(2)}/
                {billingData.subscription.interval}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Next billing date</span>
              </div>
              <span className="font-semibold">
                {new Date(billingData.subscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <Link href="/billing">
              <Button>
                <ExternalLink className="mr-2 h-4 w-4" />
                View Full Billing Details
              </Button>
            </Link>
            <Button variant="outline">Change Plan</Button>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <Button variant="outline" size="sm">
              Add Payment Method
            </Button>
          </div>
          <div className="space-y-3">
            {paymentMethod && (
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                    <CreditCard className="size-5 text-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {paymentMethod.card.brand} •••• {paymentMethod.card.last4}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {paymentMethod.card.expMonth}/{paymentMethod.card.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Billing History */}
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Billing History</h3>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
          <div className="space-y-3">
            {invoices.map((invoice: any) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium">{invoice.number}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(invoice.created).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">${(invoice.amount / 100).toFixed(2)}</p>
                    <Badge
                      variant={invoice.status === 'paid' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Billing Information */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Billing Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Company Name</span>
              <span className="font-medium">GalaxyCo AI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing Email</span>
              <span className="font-medium">billing@galaxyco.ai</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ID</span>
              <span className="font-medium">US-12345678</span>
            </div>
          </div>
          <Button variant="outline" className="mt-4 w-full">
            Update Billing Information
          </Button>
        </Card>
      </div>
    </PageShell>
  );
}
