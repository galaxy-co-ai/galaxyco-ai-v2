/**
 * Business Operations Hub - GalaxyCo.ai 2.0
 * Invoices, Campaigns, Email Management
 * October 19, 2025
 */

'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Receipt, Megaphone, Mail, ChevronRight, TrendingUp } from 'lucide-react';

export default function BusinessHub() {
  const businessSections = [
    {
      title: 'Invoices',
      href: '/business/invoices',
      icon: Receipt,
      description: 'Invoice management and billing',
    },
    {
      title: 'Campaigns',
      href: '/business/campaigns',
      icon: Megaphone,
      description: 'Marketing campaigns and tracking',
    },
    {
      title: 'Emails',
      href: '/business/emails',
      icon: Mail,
      description: 'Email threads and communications',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Page Header - Linear Style */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Business Operations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage invoices, campaigns, and communications
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {businessSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <Card className="p-6 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-12 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="size-6 text-foreground" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
