"use client";

import { PageShell } from "@/components/templates/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  type: "card";
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      type: "card",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2027,
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "card",
      brand: "Mastercard",
      last4: "5555",
      expMonth: 8,
      expYear: 2026,
      isDefault: false,
    },
  ]);

  const removeMethod = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id));
    toast.success("Payment method removed");
  };

  const setDefault = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
    toast.success("Default payment method updated");
  };

  return (
    <PageShell
      title="Payment Methods"
      subtitle="Manage your payment methods and billing details"
      breadcrumbs={[
        { label: "Settings", href: "/settings" },
        { label: "Billing", href: "/billing" },
        { label: "Payment Methods" },
      ]}
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      }
    >
      <div className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className="rounded-lg border bg-card p-6 flex items-start gap-4"
          >
            <CreditCard className="h-6 w-6 text-muted-foreground mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">
                  {method.brand} •••• {method.last4}
                </h3>
                {method.isDefault && <Badge variant="secondary">Default</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                Expires {method.expMonth}/{method.expYear}
              </p>
            </div>
            <div className="flex gap-2">
              {!method.isDefault && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDefault(method.id)}
                >
                  Set Default
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeMethod(method.id)}
                disabled={method.isDefault}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950 p-4">
        <h3 className="font-semibold mb-2">Secure Payments</h3>
        <p className="text-sm text-muted-foreground">
          All payment information is encrypted and securely stored. We never see
          or store your full credit card number.
        </p>
      </div>
    </PageShell>
  );
}
