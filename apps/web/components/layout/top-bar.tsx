'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, HelpCircle, Settings, Zap } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useSidebar } from '../../contexts/SidebarContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { AISetupWizard } from '@/components/onboarding/AISetupWizard';

interface TopBarProps {
  className?: string;
}

/**
 * TopBar Component
 *
 * Global navigation bar with:
 * - Centered search functionality
 * - Right-aligned user actions (Settings, Help, Notifications, User profile)
 */
export function TopBar({ className }: TopBarProps) {
  const { isExpanded } = useSidebar();
  const { user } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get user display info
  const userDisplayName = user?.fullName || user?.firstName || 'User';
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'user@example.com';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 h-16 w-full',
        'bg-card border-b border-border',
        'transition-all duration-200 ease-in-out',
        className,
      )}
    >
      <div className="h-full px-6 flex items-center gap-4">
        {/* Logo/Brand Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 relative flex items-center justify-center">
            <Image
              src="/brand/logo.png"
              alt="GalaxyCo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-lg font-bold text-foreground whitespace-nowrap hidden sm:inline">
            GalaxyCo
          </span>
        </div>

        {/* Centered Search Bar */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-background border-border"
            />
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="flex items-center gap-2">
          {/* Settings */}
          <Link href="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 hover:bg-hover text-muted-foreground"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </Link>

          {/* Complete Setup */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSetupWizard(true)}
            className={cn(
              'h-9 w-9 hover:bg-hover relative',
              'bg-gradient-to-r from-primary/10 to-purple-500/10',
              'border border-primary/20',
            )}
          >
            <Zap className="w-5 h-5 text-primary" />
            {/* Pulse indicator */}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </Button>

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-hover text-muted-foreground"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-hover text-muted-foreground relative"
              >
                <Bell className="w-5 h-5" />
                {/* Notification dot */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80" sideOffset={8}>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Notification Items */}
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium">New reply from Lisa Wang</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Lisa replied to your outreach email about AI solutions
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">15 min ago</div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium">Research Agent completed</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Successfully enriched 5 new prospects
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">45 min ago</div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="flex flex-col items-start p-3">
                  <div className="font-medium">Workflow completed</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Lead Qualification Pipeline finished processing 12 prospects
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile with Clerk */}
          <div className="flex items-center gap-2 pl-2 border-l border-border">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-foreground">{userDisplayName}</span>
              <span className="text-xs text-muted-foreground">{userEmail}</span>
            </div>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Setup Wizard Dialog */}
      <AISetupWizard open={showSetupWizard} onClose={() => setShowSetupWizard(false)} />
    </header>
  );
}
