"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SettingsNavProps {
  groups: Array<{
    title: string
    items: Array<{ label: string; href: string; description?: string }>
  }>
  activeHref?: string
  className?: string
}

export function SettingsNav({ groups, activeHref, className }: SettingsNavProps) {
  return (
    <aside className={cn("w-full md:w-60 shrink-0", className)}>
      <div className="rounded-lg border border-border bg-card shadow-sm p-2">
        {groups.map((group, idx) => (
          <div key={group.title}>
            {idx > 0 && <div className="h-px bg-border my-2" />}
            <h3 className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group.title}
            </h3>
            <nav className="mt-1 space-y-1">
              {group.items.map((item) => {
                const isActive = activeHref?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-md px-2 py-2 text-sm",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-hover hover:text-foreground"
                    )}
                  >
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground/80">{item.description}</div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}
