"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  colors,
  typography,
  spacing,
  radius,
  shadows,
} from "@/lib/constants/design-system";
// import WorkspaceSelector from '@/components/workspace-selector';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "🏠" },
    { href: "/marketplace", label: "Marketplace", icon: "🏪" },
    { href: "/agents", label: "Agents", icon: "🤖" },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div style={{ minHeight: "100vh", background: colors.background.tertiary }}>
      {/* Header */}
      <header
        style={{
          background: colors.background.primary,
          borderBottom: `1px solid ${colors.border.default}`,
          padding: `${spacing.lg} ${spacing["2xl"]}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: shadows.sm,
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: spacing["2xl"] }}
        >
          <Link
            href="/dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: typography.sizes["2xl"],
                fontWeight: typography.weights.bold,
                cursor: "pointer",
                color: colors.text.primary,
                display: "flex",
                alignItems: "center",
                gap: spacing.sm,
              }}
            >
              🚀 GalaxyCo.ai
            </h1>
          </Link>

          {/* <WorkspaceSelector /> */}

          <nav style={{ display: "flex", gap: spacing.xs }}>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    textDecoration: "none",
                    padding: `${spacing.sm} ${spacing.lg}`,
                    borderRadius: radius.md,
                    background: active ? colors.primary[50] : "transparent",
                    color: active ? colors.primary[600] : colors.text.secondary,
                    fontWeight: active
                      ? typography.weights.semibold
                      : typography.weights.medium,
                    fontSize: typography.sizes.sm,
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.xs,
                    borderBottom: active
                      ? `2px solid ${colors.primary[500]}`
                      : "2px solid transparent",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = colors.neutral[100];
                      e.currentTarget.style.color = colors.text.primary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = colors.text.secondary;
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: spacing.lg }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: spacing.sm,
              borderRadius: radius.full,
              border: `1px solid ${colors.border.default}`,
              background: colors.background.primary,
              boxShadow: shadows.sm,
            }}
          >
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: {
                    width: "32px",
                    height: "32px",
                  },
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}
