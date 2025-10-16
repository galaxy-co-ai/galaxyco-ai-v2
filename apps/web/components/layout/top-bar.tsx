/**
 * GalaxyCo.ai Top Bar
 * Header with user menu, notifications, and mobile controls
 * October 15, 2025
 */

'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { cn, formatString } from '@/lib/utils'
import useResponsive from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { 
  Search,
  Menu,
} from 'lucide-react'

interface TopBarProps {
  className?: string
}

// Get page title from pathname
const getPageTitle = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  
  if (!lastSegment || lastSegment === 'dashboard') return 'Dashboard'
  
  return formatString.title(lastSegment.replace(/-/g, ' '))
}

// Get breadcrumbs from pathname
const getBreadcrumbs = (pathname: string): string[] => {
  const segments = pathname.split('/').filter(Boolean)
  return segments.map(segment => formatString.title(segment.replace(/-/g, ' ')))
}

export function TopBar({ className }: TopBarProps) {
  const pathname = usePathname()
  const { isMobile, isDesktop } = useResponsive()
  
  const pageTitle = getPageTitle(pathname)
  const breadcrumbs = getBreadcrumbs(pathname)

  return (
    <header
      className={cn(
        // Fixed positioning
        'fixed top-0 right-0 z-50',
        // Responsive width (account for sidebar on desktop)
        'left-0 lg:left-16',
        // Height
        'h-16',
        // Styling
        'bg-white dark:bg-neutral-900',
        'border-b border-neutral-200 dark:border-neutral-700',
        // Backdrop blur
        'backdrop-blur-lg bg-white/90 dark:bg-neutral-900/90',
        className
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Section - Title and Breadcrumbs */}
        <div className="flex items-center min-w-0 flex-1">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          {/* Page Title and Breadcrumbs */}
          <div className="min-w-0">
            {/* Breadcrumbs - Desktop only */}
            {isDesktop && breadcrumbs.length > 1 && (
              <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                {breadcrumbs.slice(0, -1).map((crumb, index) => (
                  <React.Fragment key={crumb}>
                    <span className="truncate">{crumb}</span>
                    <span className="mx-2">/</span>
                  </React.Fragment>
                ))}
              </div>
            )}
            
            {/* Page Title */}
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 truncate">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right Section - Search Only */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
            {isDesktop && <span className="text-sm">Search</span>}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default TopBar