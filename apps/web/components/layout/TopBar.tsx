"use client";

import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "../ui/theme-toggle";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "../../contexts/SidebarContext";

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
  const { isExpanded } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // For now, return null to hide the TopBar completely as per requirements
  return null;
}
