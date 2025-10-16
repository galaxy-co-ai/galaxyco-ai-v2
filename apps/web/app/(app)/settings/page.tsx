"use client";

import { PageHeader } from "@/components/layout/page-header";
import { User, Link2, Bell, Shield, CreditCard } from "lucide-react";
import Link from "next/link";

const settingsPages = [
  {
    name: "Profile",
    description: "Manage your personal information and preferences",
    icon: User,
    href: "/settings/profile",
  },
  {
    name: "Integrations",
    description: "Connect and manage third-party services",
    icon: Link2,
    href: "/settings/integrations",
  },
  {
    name: "Notifications",
    description: "Configure email and in-app notifications",
    icon: Bell,
    href: "/settings/notifications",
  },
  {
    name: "Security",
    description: "Manage your account security settings",
    icon: Shield,
    href: "/settings/security",
  },
  {
    name: "Billing",
    description: "View and manage your subscription and billing",
    icon: CreditCard,
    href: "/settings/billing",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {settingsPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <page.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {page.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {page.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
