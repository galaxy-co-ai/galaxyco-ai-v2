"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { colors, radius } from "@/lib/constants/design-system";
import { MARKETPLACE_CATEGORIES } from "@/lib/constants/marketplace-categories";

interface MarketplaceSidebarProps {
  activeCategory?: string;
}

export default function MarketplaceSidebar({
  activeCategory,
}: MarketplaceSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Load pinned state from localStorage on mount
  useEffect(() => {
    const pinned =
      localStorage.getItem("marketplace-sidebar-pinned") === "true";
    setIsPinned(pinned);
    setIsExpanded(pinned);
  }, []);

  // Save pinned state to localStorage
  const togglePin = () => {
    const newPinned = !isPinned;
    setIsPinned(newPinned);
    localStorage.setItem("marketplace-sidebar-pinned", String(newPinned));
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

  const handleCategoryClick = (slug: string | null) => {
    if (slug === null) {
      router.push("/marketplace");
    } else {
      router.push(`/marketplace/${slug}`);
    }
  };

  const isActive = (slug: string | null) => {
    if (slug === null) {
      return pathname === "/marketplace";
    }
    return activeCategory === slug || pathname === `/marketplace/${slug}`;
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
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: colors.primary[500],
              whiteSpace: "nowrap",
            }}
          >
            {isExpanded ? "🏪 Marketplace" : "🏪"}
          </div>

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
          {/* All Categories */}
          <button
            onClick={() => handleCategoryClick(null)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              background: isActive(null) ? colors.primary[50] : "transparent",
              border: "none",
              borderLeft: `3px solid ${isActive(null) ? colors.primary[500] : "transparent"}`,
              color: isActive(null) ? colors.primary[600] : colors.text.primary,
              fontSize: "0.9375rem",
              fontWeight: isActive(null) ? "600" : "500",
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              if (!isActive(null)) {
                e.currentTarget.style.background = colors.background.secondary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(null)) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>🌟</span>
            {isExpanded && (
              <span style={{ whiteSpace: "nowrap" }}>All Categories</span>
            )}
          </button>

          {/* Divider */}
          <div
            style={{
              height: "1px",
              background: colors.border.default,
              margin: "0.5rem 1rem",
            }}
          />

          {/* Category Navigation */}
          {MARKETPLACE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                background: isActive(category.slug)
                  ? colors.primary[50]
                  : "transparent",
                border: "none",
                borderLeft: `3px solid ${isActive(category.slug) ? colors.primary[500] : "transparent"}`,
                color: isActive(category.slug)
                  ? colors.primary[600]
                  : colors.text.primary,
                fontSize: "0.9375rem",
                fontWeight: isActive(category.slug) ? "600" : "500",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (!isActive(category.slug)) {
                  e.currentTarget.style.background =
                    colors.background.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(category.slug)) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
              title={isExpanded ? undefined : category.name}
            >
              <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>
                {category.icon}
              </span>
              {isExpanded && (
                <span
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {category.name}
                </span>
              )}
            </button>
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
