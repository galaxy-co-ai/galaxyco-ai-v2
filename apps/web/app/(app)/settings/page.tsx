'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { User, Link2, Bell, Shield, CreditCard } from 'lucide-react';
import Link from 'next/link';

const settingsPages = [
  {
    name: 'Profile',
    description: 'Manage your personal information and preferences',
    icon: User,
    href: '/settings/profile',
  },
  {
    name: 'Integrations',
    description: 'Connect and manage third-party services',
    icon: Link2,
    href: '/settings/integrations',
  },
  {
    name: 'Notifications',
    description: 'Configure email and in-app notifications',
    icon: Bell,
    href: '/settings/notifications',
  },
  {
    name: 'Security',
    description: 'Manage your account security settings',
    icon: Shield,
    href: '/settings/security',
  },
  {
    name: 'Billing',
    description: 'View and manage your subscription and billing',
    icon: CreditCard,
    href: '/settings/billing',
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account settings and preferences" />

      <div className="grid gap-6 md:grid-cols-2">
        {settingsPages.map((page) => (
          <Link key={page.href} href={page.href}>
            <Card className="p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <div className="flex items-start gap-4">
                <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                  <page.icon className="size-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{page.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{page.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
