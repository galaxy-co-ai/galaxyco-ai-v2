/**
 * Mobile Companion Layout
 * Template 12: Mobile Companion Views
 * Bottom navigation, minimal chrome, mobile-optimized
 */

'use client';

import { Home, Bot, Plus, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/m/dashboard', label: 'Home', icon: Home },
  { href: '/m/agents', label: 'Agents', icon: Bot },
  { href: '/agents/new', label: 'Create', icon: Plus },
  { href: '/m/notifications', label: 'Alerts', icon: Bell },
  { href: '/settings/profile', label: 'Profile', icon: User },
];

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="text-lg font-semibold text-foreground">GalaxyCo.ai</div>
          <Link
            href="/notifications"
            className="relative p-2 hover:bg-hover rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-foreground-muted" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background-elevated border-t border-border safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href.startsWith('/m/') && pathname?.startsWith(item.href));
            const isCreate = item.label === 'Create';

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                  isCreate
                    ? 'relative'
                    : isActive
                      ? 'text-primary'
                      : 'text-foreground-muted hover:text-foreground',
                )}
              >
                {isCreate ? (
                  <div className="absolute -top-6 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                ) : (
                  <>
                    <Icon className={cn('w-6 h-6', isActive && 'fill-current')} />
                    <span className="text-xs font-medium">{item.label}</span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
