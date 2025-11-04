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

      <div className="grid gap-8 md:grid-cols-2">
        {settingsPages.map((page) => (
          <Link key={page.href} href={page.href}>
            <Card className="p-8 rounded-xl bg-muted/30 hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md cursor-pointer h-full group">
              <div className="flex items-start gap-5">
                <div className="size-14 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-all duration-300">
                  <page.icon className="size-7 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground">{page.name}</h3>
                  <p className="mt-2 text-sm lg:text-base text-muted-foreground">
                    {page.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
