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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { 
  Command,
  Users,
  Mail,
  Settings,
  Bot,
  Clock,
  Database,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Bell,
  FolderOpen,
  TrendingUp,
  User,
  Megaphone
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

// Navigation items to match wireframe
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
    title: 'Sales',
    href: '/sales',
    icon: TrendingUp,
    description: 'Sales analytics & CRM'
  },
  {
    title: 'Time Usage',
    href: '/time-usage',
    icon: Clock,
    description: 'Time tracking & productivity'
  },
  {
    title: 'Library',
    href: '/knowledge',
    icon: FolderOpen,
    description: 'Knowledge & documents'
  },
  {
    title: 'Marketing',
    href: '/marketing',
    icon: Megaphone,
    description: 'Marketing campaigns'
  },
  {
    title: 'Outreach',
    href: '/emails',
    icon: Mail,
    description: 'Email outreach & campaigns'
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configuration'
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
    description: 'User profile & preferences'
  }
]

export function MainSidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <div
        className={cn(
          // Fixed positioning for desktop sidebar
          'fixed left-0 top-0 z-40 h-full',
          // Fixed width for icon-only sidebar
          'w-16',
          // Light theme styling
          'bg-white border-r border-gray-200',
          'flex flex-col',
          className
        )}
      >
        {/* Logo/Brand Section */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          {/* Logo */}
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        // Base styles
                        'w-12 h-12 p-0 rounded-lg',
                        'hover:bg-gray-100',
                        'transition-colors duration-200',
                        // Active state
                        isActive && 'bg-primary-50 text-primary-600',
                        // Default text color
                        !isActive && 'text-gray-600',
                        // Remove default button styles
                        'font-normal relative'
                      )}
                    >
                      {/* Icon */}
                      <Icon className="w-5 h-5" />
                      
                      {/* Badge */}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] px-1 h-4 min-w-[16px] flex items-center justify-center rounded-full">
                          {item.badge}
                        </span>
                      )}
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-500 rounded-r-full" />
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex flex-col">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </nav>

        {/* Bottom Section - Notifications & User */}
        <div className="p-2 border-t border-gray-200 space-y-1">
          {/* Notifications */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-12 h-12 p-0 rounded-lg hover:bg-gray-100 text-gray-600 relative"
              >
                <Bell className="w-5 h-5" />
                {/* Notification dot */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="font-medium">Notifications</div>
              <div className="text-xs text-gray-500">3 new updates</div>
            </TooltipContent>
          </Tooltip>

          {/* User Profile */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="w-12 h-12 p-0 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">D</span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="font-medium">Demo User</div>
              <div className="text-xs text-gray-500">demo@galaxyco.ai</div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default MainSidebar