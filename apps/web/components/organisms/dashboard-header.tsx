"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  className?: string
  breadcrumb?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}

export function DashboardHeader({ title, subtitle, className, breadcrumb, actions }: DashboardHeaderProps) {
  return (
    <div className={cn("mb-6 md:mb-8", className)}>
      {breadcrumb && breadcrumb.length > 0 && (
        <nav className="text-sm text-muted-foreground mb-2" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            {breadcrumb.map((item, idx) => (
              <li key={idx} className="inline-flex items-center gap-2">
                {idx > 0 && <span className="text-border">/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
