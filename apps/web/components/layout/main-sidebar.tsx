/**
 * GalaxyCo.ai Main Sidebar
 * Desktop navigation with collapsible layout
 * October 15, 2025
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useClerk } from "@clerk/nextjs";
import { AISetupWizard } from "@/components/onboarding/AISetupWizard";

interface SidebarProps {
  className?: string;
}

// Navigation items - New IA structure (Week 2 refactor)
const navigationItems = [
  {
    title: "My Work",
    href: "/my-work",
    icon: Command,
    description: "Your daily workflow hub",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: TrendingUp,
    description: "Platform overview",
  },
  {
    title: "Agents",
    href: "/agents",
    icon: Bot,
    badge: "3",
    description: "AI agent management",
  },
  {
    title: "CRM",
    href: "/crm/customers",
    icon: User,
    description: "Customer management",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: Clock,
    description: "Performance insights",
  },
  {
    title: "Library",
    href: "/library",
    icon: FolderOpen,
    description: "Documents & resources",
  },
  {
    title: "Automations",
    href: "/automations",
    icon: Megaphone,
    description: "Workflows & integrations",
  },
];

export function MainSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const isExpanded = isHovered || isPinned;

  // Get user display info
  const userDisplayName = user?.fullName || user?.firstName || "User";
  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "user@example.com";
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  // Load pinned state from localStorage on mount
  useEffect(() => {
    const savedPinState = localStorage.getItem("sidebar-pinned");
    if (savedPinState === "true") {
      setIsPinned(true);
    }
  }, []);

  // Save pinned state to localStorage
  const togglePin = () => {
    const newPinState = !isPinned;
    setIsPinned(newPinState);
    localStorage.setItem("sidebar-pinned", String(newPinState));

    // Emit custom event for same-tab updates
    window.dispatchEvent(
      new CustomEvent("sidebar-toggle", {
        detail: { isPinned: newPinState },
      }),
    );
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        // Fixed positioning for desktop sidebar
        "fixed left-0 top-0 z-40 h-full",
        // Responsive width with smooth transition
        "transition-all duration-200 ease-in-out",
        isExpanded ? "w-60" : "w-16",
        // Surface styling using design tokens
        "bg-card border-r border-border",
        "flex flex-col shadow-sm",
        className,
      )}
    >
      {/* Logo/Brand Section */}
      <div className="flex items-center h-16 px-4 border-b border-border gap-3">
        {/* Logo */}
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">G</span>
        </div>
        {/* Brand Name - visible when expanded */}
        {isExpanded && (
          <span className="text-lg font-bold text-foreground whitespace-nowrap">
            GalaxyCo
          </span>
        )}
      </div>

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
                  "w-full h-12 rounded-lg",
                  "hover:bg-hover",
                  "transition-colors duration-200",
                  // Active state
                  isActive && "bg-primary/10 text-primary",
                  // Default text color
                  !isActive && "text-muted-foreground",
                  // Layout
                  "flex items-center gap-3",
                  isExpanded ? "justify-start px-3" : "justify-center p-0",
                  "font-normal relative",
                )}
              >
                {/* Icon */}
                <Icon className="w-5 h-5 flex-shrink-0" />

                {/* Label - visible when expanded */}
                {isExpanded && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.title}
                  </span>
                )}

                {/* Badge */}
                {item.badge && (
                  <span
                    className={cn(
                      "bg-primary text-primary-foreground text-[10px] px-1 h-4 min-w-[16px] flex items-center justify-center rounded-full shadow-sm",
                      isExpanded ? "ml-auto" : "absolute -top-1 -right-1",
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
        <div className="px-2 py-2">
          <Button
            variant="ghost"
            onClick={togglePin}
            className={cn(
              "w-full h-10 rounded-lg",
              "hover:bg-hover",
              "flex items-center gap-3 justify-start px-3",
              "text-muted-foreground",
              isPinned && "bg-hover text-primary",
            )}
          >
            <Pin
              className={cn(
                "w-4 h-4 flex-shrink-0",
                isPinned && "fill-current",
              )}
            />
            <span className="text-sm font-medium">Pin Sidebar</span>
          </Button>
        </div>
      )}

      {/* Bottom Section - Settings, Help, Notifications, User */}
      <div className="p-2 border-t border-border space-y-1">
        {/* Settings */}
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full h-12 rounded-lg hover:bg-hover text-muted-foreground",
              "flex items-center gap-3",
              isExpanded ? "justify-start px-3" : "justify-center p-0",
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isExpanded && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </Button>
        </Link>

        {/* AI Setup Wizard */}
        <Button
          variant="ghost"
          onClick={() => setShowSetupWizard(true)}
          className={cn(
            "w-full h-12 rounded-lg hover:bg-hover relative",
            "flex items-center gap-3",
            "bg-gradient-to-r from-primary/10 to-purple-500/10",
            "border border-primary/20",
            isExpanded ? "justify-start px-3" : "justify-center p-0",
          )}
        >
          <Zap className="w-5 h-5 flex-shrink-0 text-primary" />
          {isExpanded && (
            <span className="text-sm font-medium text-primary">
              Complete Setup
            </span>
          )}
          {/* Pulse indicator */}
          <span className="absolute top-2 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </Button>

        {/* Help */}
        <Button
          variant="ghost"
          className={cn(
            "w-full h-12 rounded-lg hover:bg-hover text-muted-foreground",
            "flex items-center gap-3",
            isExpanded ? "justify-start px-3" : "justify-center p-0",
          )}
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium">Help</span>}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-12 rounded-lg hover:bg-hover text-muted-foreground relative",
                "flex items-center gap-3",
                isExpanded ? "justify-start px-3" : "justify-center p-0",
              )}
            >
              <Bell className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <span className="text-sm font-medium">Notifications</span>
              )}
              {/* Notification dot */}
              <div
                className={cn(
                  "w-2 h-2 bg-destructive rounded-full",
                  isExpanded ? "ml-auto" : "absolute top-2 right-2",
                )}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="right" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Notification Items */}
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="font-medium">New reply from Lisa Wang</div>
                <div className="text-sm text-gray-500 mt-1">
                  Lisa replied to your outreach email about AI solutions
                </div>
                <div className="text-xs text-gray-400 mt-1">15 min ago</div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="font-medium">Research Agent completed</div>
                <div className="text-sm text-gray-500 mt-1">
                  Successfully enriched 5 new prospects
                </div>
                <div className="text-xs text-gray-400 mt-1">45 min ago</div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex flex-col items-start p-3">
                <div className="font-medium">Workflow completed</div>
                <div className="text-sm text-gray-500 mt-1">
                  Lead Qualification Pipeline finished processing 12 prospects
                </div>
                <div className="text-xs text-gray-400 mt-1">2 hours ago</div>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-primary-600">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full h-12 rounded-lg hover:bg-hover",
                "flex items-center gap-3",
                isExpanded ? "justify-start px-3" : "justify-center p-0",
              )}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-sm font-medium">
                  {userInitial}
                </span>
              </div>
              {isExpanded && (
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {userDisplayName}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    {userEmail}
                  </span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            side="right"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userDisplayName}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* AI Setup Wizard Dialog */}
      <AISetupWizard
        open={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
      />
    </div>
  );
}

export default MainSidebar;
