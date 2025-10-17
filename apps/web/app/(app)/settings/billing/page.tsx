"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  ExternalLink,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const paymentMethods = [
  {
    id: "1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    brand: "Mastercard",
    last4: "8888",
    expiryMonth: 6,
    expiryYear: 2026,
    isDefault: false,
  },
];

const invoices = [
  {
    id: "INV-2025-001",
    date: "2025-10-01",
    amount: "$99.00",
    status: "paid",
    period: "Oct 2025",
  },
  {
    id: "INV-2025-002",
    date: "2025-09-01",
    amount: "$99.00",
    status: "paid",
    period: "Sep 2025",
  },
  {
    id: "INV-2025-003",
    date: "2025-08-01",
    amount: "$99.00",
    status: "paid",
    period: "Aug 2025",
  },
];

export default function BillingSettingsPage() {
  return (
    <PageShell
      title="Billing Settings"
      subtitle="Manage your subscription, payment methods, and invoices"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Settings", href: "/settings" },
        { label: "Billing" },
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
              <span className="font-semibold">$99.00/month</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Next billing date</span>
              </div>
              <span className="font-semibold">November 1, 2025</span>
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
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      Set Default
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
            ))}
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
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.period} • {invoice.date}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{invoice.amount}</p>
                    <Badge
                      variant={
                        invoice.status === "paid" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
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
