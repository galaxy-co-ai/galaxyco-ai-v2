/**
 * GalaxyCo.ai Main Sidebar
 * Desktop navigation with collapsible layout
 * October 15, 2025
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Command,
  Users,
  Mail,
  Settings,
  Bot,
  Workflow,
  Database,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Bell,
  FolderOpen
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

// Navigation items with space-themed icons
const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Command,
    description: 'Overview and metrics'
  },
  {
    title: 'Agents',
    href: '/agents',
    icon: Bot,
    description: 'AI agent management',
    badge: '3'
  },
  {
    title: 'Workflows',
    href: '/workflows', 
    icon: Workflow,
    description: 'Automation pipelines'
  },
  {
    title: 'Prospects',
    href: '/prospects',
    icon: Users,
    description: 'Contact database'
  },
  {
    title: 'Emails',
    href: '/emails',
    icon: Mail,
    description: 'Email campaigns'
  },
  {
    title: 'Collections',
    href: '/collections',
    icon: FolderOpen,
    description: 'Knowledge & documents'
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Performance insights'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configuration'
  }
]

export function MainSidebar({ className }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const pathname = usePathname()

  const handleMouseEnter = () => {
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    setIsExpanded(false)
  }

  return (
    <div
      className={cn(
        // Fixed positioning for desktop sidebar
        'fixed left-0 top-0 z-40 h-full',
        // Width transitions
        'w-16 hover:w-60 transition-all duration-300 ease-in-out',
        // Dark theme styling
        'bg-neutral-800 border-r border-neutral-700',
        'flex flex-col',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo/Brand Section */}
      <div className="flex items-center h-16 px-4 border-b border-neutral-700">
        <div className="flex items-center min-w-0">
          {/* Logo */}
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          
          {/* Brand Text - Only visible when expanded */}
          <div
            className={cn(
              'ml-3 transition-opacity duration-200',
              isExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="text-white font-semibold text-lg whitespace-nowrap">
              GalaxyCo.ai
            </div>
            <div className="text-neutral-400 text-xs whitespace-nowrap">
              AI Automation Platform
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  // Base styles
                  'w-full justify-start px-3 py-2 h-12',
                  'hover:bg-neutral-700 hover:text-white',
                  'focus:bg-neutral-700 focus:text-white',
                  'transition-colors duration-200',
                  // Active state
                  isActive && 'bg-neutral-700 text-white',
                  // Default text color
                  !isActive && 'text-neutral-300',
                  // Remove default button styles
                  'font-normal'
                )}
              >
                {/* Icon */}
                <Icon className="w-5 h-5 flex-shrink-0" />
                
                {/* Text and Badge - Only visible when expanded */}
                <div
                  className={cn(
                    'flex items-center justify-between ml-3 min-w-0 flex-1',
                    'transition-opacity duration-200',
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium whitespace-nowrap">
                      {item.title}
                    </div>
                    <div className="text-xs text-neutral-400 whitespace-nowrap">
                      {item.description}
                    </div>
                  </div>
                  
                  {/* Badge */}
                  {item.badge && (
                    <span className="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">
                      {item.badge}
                    </span>
                  )}
                </div>
                
                {/* Expand indicator when collapsed */}
                {!isExpanded && isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-500 rounded-full" />
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Notifications Section */}
      <div className="p-2 border-t border-neutral-700">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start px-3 py-2 h-12',
            'hover:bg-neutral-700 hover:text-white',
            'text-neutral-300 font-normal'
          )}
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          
          {/* Notification text and count */}
          <div
            className={cn(
              'flex items-center justify-between ml-3 min-w-0 flex-1',
              'transition-opacity duration-200',
              isExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium whitespace-nowrap">
                Notifications
              </div>
              <div className="text-xs text-neutral-400 whitespace-nowrap">
                Stay updated
              </div>
            </div>
            
            {/* Notification count */}
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">
              3
            </span>
          </div>
          
          {/* Notification dot when collapsed */}
          {!isExpanded && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </div>

      {/* User Section */}
      <div className="p-2 border-t border-neutral-700">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start px-3 py-2 h-12',
            'hover:bg-neutral-700 hover:text-white',
            'text-neutral-300 font-normal'
          )}
        >
          {/* User Avatar */}
          <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-medium">D</span>
          </div>
          
          {/* User info */}
          <div
            className={cn(
              'flex items-center justify-between ml-3 min-w-0 flex-1',
              'transition-opacity duration-200',
              isExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="min-w-0">
              <div className="text-sm font-medium whitespace-nowrap">
                Demo User
              </div>
              <div className="text-xs text-neutral-400 whitespace-nowrap">
                demo@galaxyco.ai
              </div>
            </div>
            
            <ChevronRight className="w-4 h-4 text-neutral-400 ml-2" />
          </div>
        </Button>
      </div>
    </div>
  )
}

export default MainSidebar