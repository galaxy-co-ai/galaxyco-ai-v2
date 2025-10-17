"use client";

import { DetailPage } from "@/components/templates/detail-page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Users,
  Zap,
  Database,
  Check,
  Calendar,
  Download,
  ExternalLink,
  Plus,
} from "lucide-react";

// Mock data for billing
const billingMetrics = [
  {
    label: "Monthly Spend",
    value: "$149",
    change: "Pro Plan",
    trend: "neutral" as const,
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    label: "Team Members",
    value: "8/10",
    change: "2 seats available",
    trend: "neutral" as const,
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "AI Credits Used",
    value: "7,240",
    change: "2,760 remaining",
    trend: "neutral" as const,
    icon: <Zap className="h-5 w-5" />,
  },
  {
    label: "Storage Used",
    value: "24.3 GB",
    change: "75.7 GB available",
    trend: "neutral" as const,
    icon: <Database className="h-5 w-5" />,
  },
];

const currentPlan = {
  name: "Pro",
  price: 149,
  period: "month",
  renewalDate: "November 17, 2025",
  features: [
    "10 team members",
    "10,000 AI credits/month",
    "100 GB storage",
    "Priority support",
    "Advanced analytics",
    "Custom integrations",
    "API access",
    "SSO authentication",
  ],
};

const plans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    features: [
      "3 team members",
      "1,000 AI credits/month",
      "10 GB storage",
      "Email support",
      "Basic analytics",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: 149,
    period: "month",
    features: [
      "10 team members",
      "10,000 AI credits/month",
      "100 GB storage",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
      "API access",
    ],
    popular: true,
    current: true,
  },
  {
    name: "Enterprise",
    price: 499,
    period: "month",
    features: [
      "Unlimited team members",
      "Unlimited AI credits",
      "1 TB storage",
      "24/7 dedicated support",
      "Enterprise analytics",
      "Custom integrations",
      "API access",
      "SSO authentication",
      "SLA guarantee",
    ],
    popular: false,
  },
];

const paymentMethods = [
  {
    id: "1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    brand: "Mastercard",
    last4: "8888",
    expiry: "06/26",
    isDefault: false,
  },
];

const recentInvoices = [
  {
    id: "INV-001",
    date: "October 17, 2025",
    amount: "$149.00",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-002",
    date: "September 17, 2025",
    amount: "$149.00",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-003",
    date: "August 17, 2025",
    amount: "$149.00",
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-004",
    date: "July 17, 2025",
    amount: "$149.00",
    status: "paid",
    downloadUrl: "#",
  },
];

function PlanOverview() {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              Current Plan: {currentPlan.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              ${currentPlan.price}/{currentPlan.period} • Renews on{" "}
              {currentPlan.renewalDate}
            </p>
          </div>
          <Badge variant="default">Active</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex gap-3">
            <Button variant="outline">Cancel Plan</Button>
            <Button variant="outline">View All Features</Button>
          </div>
        </div>
      </Card>

      {/* Usage */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Usage This Month</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Team Members</span>
              <span className="text-muted-foreground">8 / 10</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>AI Credits</span>
              <span className="text-muted-foreground">7,240 / 10,000</span>
            </div>
            <Progress value={72.4} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Storage</span>
              <span className="text-muted-foreground">24.3 GB / 100 GB</span>
            </div>
            <Progress value={24.3} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function Plans() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg border p-6 ${
                plan.current
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              } ${plan.popular ? "ring-2 ring-primary" : ""}`}
            >
              {plan.popular && (
                <Badge className="mb-2" variant="default">
                  Most Popular
                </Badge>
              )}
              <h4 className="text-xl font-semibold mb-2">{plan.name}</h4>
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button variant="outline" disabled className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button className="w-full">
                  {plan.price > currentPlan.price ? "Upgrade" : "Downgrade"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Billing() {
  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Payment Methods</h3>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        </div>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {method.brand} •••• {method.last4}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expires {method.expiry}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.isDefault && <Badge variant="secondary">Default</Badge>}
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Invoices */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
        <div className="space-y-3">
          {recentInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{invoice.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold">{invoice.amount}</p>
                  <Badge variant="secondary" className="text-xs">
                    {invoice.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function BillingPage() {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: <PlanOverview />,
    },
    {
      id: "plans",
      label: "Plans",
      content: <Plans />,
    },
    {
      id: "billing",
      label: "Billing",
      content: <Billing />,
    },
  ];

  return (
    <DetailPage
      title="Billing & Subscription"
      subtitle="Manage your plan, payment methods, and invoices"
      breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Billing" }]}
      actions={
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Customer Portal
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Update Payment
          </Button>
        </div>
      }
      metrics={billingMetrics}
      tabs={tabs}
      defaultTab="overview"
    />
  );
}
