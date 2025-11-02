/**
 * GalaxyCo.ai Bottom Navigation
 * Mobile-first navigation bar for touch devices
 * October 15, 2025
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Command, Users, Bot, Mail, Settings, FolderOpen, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  className?: string;
}

// Mobile navigation items (reduced set)
const mobileNavItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Command,
  },
  {
    title: 'Assistant',
    href: '/assistant',
    icon: MessageSquare,
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Bot,
    badge: '3',
  },
  {
    title: 'Library',
    href: '/library',
    icon: FolderOpen,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        // Fixed positioning at bottom
        'fixed bottom-0 left-0 right-0 z-50',
        // Height and safe area
        'h-16 safe-bottom',
        // Styling
        'bg-white dark:bg-neutral-900',
        'border-t border-neutral-200 dark:border-neutral-700',
        // Backdrop blur effect
        'backdrop-blur-lg bg-white/90 dark:bg-neutral-900/90',
        className,
      )}
    >
      {/* Navigation Items Container */}
      <div className="grid grid-cols-5 h-full">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                // Base layout
                'flex flex-col items-center justify-center',
                'px-1 py-2 relative',
                // Touch target size (minimum 44px)
                'min-h-[44px]',
                // Transition
                'transition-colors duration-200',
                // Color states
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-600 dark:text-neutral-400',
                // Hover states
                'hover:text-primary-600 dark:hover:text-primary-400',
                // Focus states
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset',
                'rounded-lg focus:ring-offset-2',
              )}
            >
              {/* Icon with badge */}
              <div className="relative">
                <Icon
                  className={cn(
                    'w-5 h-5 mb-1',
                    // Scale slightly when active
                    isActive && 'scale-110',
                  )}
                />

                {/* Badge indicator */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium leading-none">
                      {item.badge}
                    </span>
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-xs font-medium leading-tight',
                  // Truncate long labels
                  'max-w-full truncate',
                )}
              >
                {item.title}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
