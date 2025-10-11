"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { colors, radius } from "@/lib/constants/design-system";

// Main navigation items
const MAIN_NAV_ITEMS = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: "🏠",
    path: "/dashboard",
  },
  {
    id: "knowledge",
    name: "Knowledge",
    icon: "📚",
    path: "/knowledge",
  },
  {
    id: "marketplace",
    name: "Marketplace",
    icon: "🏪",
    path: "/marketplace",
  },
  {
    id: "agents",
    name: "Agents",
    icon: "🤖",
    path: "/agents",
  },
];

export default function MainSidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Load pinned state from localStorage on mount
  useEffect(() => {
    const pinned = localStorage.getItem("main-sidebar-pinned") === "true";
    setIsPinned(pinned);
    setIsExpanded(pinned);
  }, []);

  // Save pinned state to localStorage
  const togglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem("main-sidebar-pinned", String(newPinned));
    if (newPinned) {
      setIsExpanded(true);
    }
  };

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
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: isExpanded ? "240px" : "64px",
          background: colors.background.primary,
          borderRight: `1px solid ${colors.border.default}`,
          transition: "width 0.3s ease",
          zIndex: 100,
          overflowX: "hidden",
          overflowY: "auto",
        }}
        className="hidden md:block"
      >
        {/* Header */}
        <div
          style={{
            padding: "1rem",
            borderBottom: `1px solid ${colors.border.default}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "64px",
          }}
        >
          {/* Logo/Icon */}
          <Link
            href="/dashboard"
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: colors.primary[500],
              whiteSpace: "nowrap",
              textDecoration: "none",
            }}
          >
            {isExpanded ? "GalaxyCo.ai" : "🌌"}
          </Link>

          {/* Pin Button */}
          {isExpanded && (
            <button
              onClick={togglePin}
              style={{
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isPinned ? colors.primary[100] : "transparent",
                border: `1px solid ${isPinned ? colors.primary[300] : colors.border.default}`,
                borderRadius: radius.md,
                cursor: "pointer",
                color: isPinned ? colors.primary[600] : colors.text.tertiary,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isPinned) {
                  e.currentTarget.style.background =
                    colors.background.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isPinned) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              {isPinned ? "📌" : "📍"}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{ padding: "1rem 0" }}>
          {MAIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                background: isActive(item.path)
                  ? colors.primary[50]
                  : "transparent",
                border: "none",
                borderLeft: `3px solid ${isActive(item.path) ? colors.primary[500] : "transparent"}`,
                color: isActive(item.path)
                  ? colors.primary[600]
                  : colors.text.primary,
                fontSize: "0.9375rem",
                fontWeight: isActive(item.path) ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background =
                    colors.background.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
              title={isExpanded ? undefined : item.name}
            >
              <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>
                {item.icon}
              </span>
              {isExpanded && (
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Footer Hint */}
        {!isPinned && isExpanded && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "1rem",
              fontSize: "0.75rem",
              color: colors.text.tertiary,
              textAlign: "center",
              borderTop: `1px solid ${colors.border.default}`,
              background: colors.background.secondary,
            }}
          >
            💡 Pin to keep open
          </div>
        )}
      </div>

      {/* Mobile Overlay (when needed) */}
      <style jsx>{`
        @media (max-width: 768px) {
          .sidebar-container {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
