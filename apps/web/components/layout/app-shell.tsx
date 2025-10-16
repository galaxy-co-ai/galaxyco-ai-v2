/**
 * GalaxyCo.ai App Shell
 * Main layout wrapper with responsive sidebar and content area
 * October 15, 2025
 */

'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import useResponsive from '@/hooks/use-mobile'
import { MainSidebar } from './main-sidebar'
import { BottomNav } from './bottom-nav'
import { TopBar } from './top-bar'

interface AppShellProps {
  children: React.ReactNode
  className?: string
}

export function AppShell({ children, className }: AppShellProps) {
  const { isMobile, isDesktop } = useResponsive()
  const [isSidebarPinned, setIsSidebarPinned] = useState(false)

  // Listen for sidebar pin state changes
  useEffect(() => {
    // Check initial state
    const savedPinState = localStorage.getItem('sidebar-pinned')
    setIsSidebarPinned(savedPinState === 'true')

    // Listen for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebar-pinned') {
        setIsSidebarPinned(e.newValue === 'true')
      }
    }

    // Listen for custom event (for same-tab updates)
    const handleSidebarToggle = (e: CustomEvent) => {
      setIsSidebarPinned(e.detail.isPinned)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('sidebar-toggle' as any, handleSidebarToggle as any)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-toggle' as any, handleSidebarToggle as any)
    }
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Desktop Sidebar */}
      {isDesktop && <MainSidebar />}
      
      {/* Top Bar */}
      <TopBar />
      
      {/* Main Content Area */}
      <main
        className={cn(
          // Desktop: account for sidebar width (64px collapsed, 240px expanded)
          'transition-all duration-200 ease-in-out',
          isSidebarPinned ? 'lg:ml-60' : 'lg:ml-16',
          // Mobile: full width, account for bottom nav
          'min-h-screen',
          'pb-16 lg:pb-0', // Bottom padding for mobile nav
          'pt-16', // Top padding for header
          className
        )}
      >
        {/* Page Content Container */}
        <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <BottomNav />}
    </div>
  )
}

export default AppShell