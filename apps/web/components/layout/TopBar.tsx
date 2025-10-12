"use client";

import { Search, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "../ui/theme-toggle";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TopBarProps {
  className?: string;
}

/**
 * TopBar Component
 * 
 * Global navigation bar with:
 * - Search functionality
 * - Notifications
 * - Theme toggle
 * - User profile menu
 */
export function TopBar({ className }: TopBarProps) {
  return (
    <div
      className={cn(
        "fixed top-0 right-0 left-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "border-b border-border z-50",
        className
      )}
      style={{ marginLeft: "64px" }} // Offset for sidebar
    >
      <div className="flex h-full items-center justify-between px-6 gap-4">
        {/* Left: Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search agents, knowledge..."
              className="pl-10 h-10 bg-secondary/50"
            />
          </div>
        </div>

        {/* Right: Utilities */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile */}
          <div className="pl-2 border-l border-border">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
