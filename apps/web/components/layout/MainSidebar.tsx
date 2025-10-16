"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Rocket, Satellite, Globe, Users, Pin } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "../../contexts/SidebarContext";

// Main navigation items with space-themed icons
const MAIN_NAV_ITEMS = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: Rocket,
    path: "/dashboard",
  },
  {
    id: "knowledge",
    name: "Knowledge",
    icon: Satellite,
    path: "/knowledge",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    icon: Globe,
    path: "/marketplace",
  },
  {
    id: "agents",
    name: "Agents",
    icon: Users,
    path: "/agents",
  },
];

export default function MainSidebar() {
  const pathname = usePathname();
  const { isExpanded, isPinned, setIsExpanded, togglePin } = useSidebar();

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const isActive = (path: string) => {
    // Check if current path starts with the nav item path
    if (path === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Sidebar Container */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "fixed left-0 top-0 bottom-0 bg-background border-r border-border z-40 transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto hidden md:block",
          isExpanded ? "w-60" : "w-16",
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between min-h-16">
          {/* Logo/Icon */}
          <Link
            href="/dashboard"
            className="text-xl font-bold text-primary whitespace-nowrap no-underline flex items-center gap-2 hover:text-primary/90 transition-colors"
          >
            {isExpanded ? "GalaxyCo.ai" : <Globe size={24} strokeWidth={2.5} />}
          </Link>

          {/* Pin Button */}
          {isExpanded && (
            <Button
              onClick={togglePin}
              variant={isPinned ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              <Pin className={cn("h-4 w-4", isPinned && "fill-current")} />
            </Button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="py-4">
          {MAIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 border-l-3 transition-all duration-200 no-underline text-sm font-medium",
                isActive(item.path)
                  ? "bg-primary/10 border-l-primary text-primary"
                  : "border-l-transparent text-foreground hover:bg-secondary",
                !isExpanded && "justify-center",
              )}
              title={isExpanded ? undefined : item.name}
            >
              <item.icon size={20} strokeWidth={2} className="flex-shrink-0" />
              {isExpanded && (
                <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer Hint */}
        {!isPinned && isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 p-4 text-xs text-muted-foreground text-center border-t border-border bg-secondary/50">
            💡 Pin to keep open
          </div>
        )}
      </div>
    </>
  );
}
