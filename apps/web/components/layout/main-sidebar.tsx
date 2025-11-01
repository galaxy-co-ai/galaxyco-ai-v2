/**
 * GalaxyCo.ai Main Sidebar
 * Desktop navigation with collapsible layout
 * October 15, 2025
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  Mail,
  Settings,
  Bot,
  Clock,
  Bell,
  FolderOpen,
  TrendingUp,
  User,
  Megaphone,
  Pin,
  HelpCircle,
  LogOut,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

// Navigation items - New IA structure (Week 2 refactor)
const navigationItems = [
  {
    title: 'My Work',
    href: '/my-work',
    icon: Command,
    description: 'Your daily workflow hub',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: TrendingUp,
    description: 'Platform overview',
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Bot,
    badge: '3',
    description: 'AI agent management',
  },
  {
    title: 'CRM',
    href: '/crm/customers',
    icon: User,
    description: 'Customer management',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: Clock,
    description: 'Performance insights',
  },
  {
    title: 'Library',
    href: '/library',
    icon: FolderOpen,
    description: 'Documents & resources',
  },
  {
    title: 'Automations',
    href: '/automations',
    icon: Megaphone,
    description: 'Workflows & integrations',
  },
];

export function MainSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const isExpanded = isHovered || isPinned;

  // Load pinned state from localStorage on mount
  useEffect(() => {
    const savedPinState = localStorage.getItem('sidebar-pinned');
    if (savedPinState === 'true') {
      setIsPinned(true);
    }
  }, []);

  // Save pinned state to localStorage
  const togglePin = () => {
    const newPinState = !isPinned;
    setIsPinned(newPinState);
    localStorage.setItem('sidebar-pinned', String(newPinState));

    // Emit custom event for same-tab updates
    window.dispatchEvent(
      new CustomEvent('sidebar-toggle', {
        detail: { isPinned: newPinState },
      }),
    );
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        // Fixed positioning for desktop sidebar - below top bar
        'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)]',
        // Responsive width with smooth transition
        'transition-all duration-200 ease-in-out',
        isExpanded ? 'w-60' : 'w-16',
        // Surface styling using design tokens
        'bg-card border-r border-border',
        'flex flex-col shadow-sm',
        className,
      )}
    >
      {/* Navigation Section */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  // Base styles
                  'w-full h-12 rounded-lg',
                  'hover:bg-hover',
                  'transition-colors duration-200',
                  // Active state
                  isActive && 'bg-primary/10 text-primary',
                  // Default text color
                  !isActive && 'text-muted-foreground',
                  // Layout
                  'flex items-center gap-3',
                  isExpanded ? 'justify-start px-3' : 'justify-center p-0',
                  'font-normal relative',
                )}
              >
                {/* Icon */}
                <Icon className="w-5 h-5 flex-shrink-0" />

                {/* Label - visible when expanded */}
                {isExpanded && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.title}</span>
                )}

                {/* Badge */}
                {item.badge && (
                  <span
                    className={cn(
                      'bg-primary text-primary-foreground text-[10px] px-1 h-4 min-w-[16px] flex items-center justify-center rounded-full shadow-sm',
                      isExpanded ? 'ml-auto' : 'absolute -top-1 -right-1',
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-500 rounded-r-full" />
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Pin Toggle Button - visible when expanded */}
      {isExpanded && (
        <div className="px-2 py-2 border-t border-border">
          <Button
            variant="ghost"
            onClick={togglePin}
            className={cn(
              'w-full h-10 rounded-lg',
              'hover:bg-hover',
              'flex items-center gap-3 justify-start px-3',
              'text-muted-foreground',
              isPinned && 'bg-hover text-primary',
            )}
          >
            <Pin className={cn('w-4 h-4 flex-shrink-0', isPinned && 'fill-current')} />
            <span className="text-sm font-medium">Pin Sidebar</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default MainSidebar;
