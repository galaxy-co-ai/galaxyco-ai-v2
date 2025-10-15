/**
 * GalaxyCo.ai Utility Functions
 * Common utilities and helpers
 * October 15, 2025
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind CSS class name utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export const formatDate = {
  /**
   * Format date as relative time (e.g., "2 hours ago", "3 days ago")
   */
  relative: (date: string | Date): string => {
    const now = new Date()
    const target = new Date(date)
    const diff = now.getTime() - target.getTime()

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (seconds < 60) return 'just now'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
    return `${years} year${years > 1 ? 's' : ''} ago`
  },

  /**
   * Format date as short string (e.g., "Oct 15, 2025")
   */
  short: (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  },

  /**
   * Format date as time only (e.g., "5:30 PM")
   */
  time: (date: string | Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  },
}

// Number formatting utilities
export const formatNumber = {
  /**
   * Format number with commas (e.g., "1,234")
   */
  comma: (num: number): string => {
    return num.toLocaleString('en-US')
  },

  /**
   * Format number as percentage (e.g., "85.5%")
   */
  percent: (num: number, decimals: number = 1): string => {
    return `${num.toFixed(decimals)}%`
  },

  /**
   * Format large numbers with suffixes (e.g., "1.2K", "3.4M")
   */
  compact: (num: number): string => {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    })
    return formatter.format(num)
  },
}

// String utilities
export const formatString = {
  /**
   * Capitalize first letter of each word
   */
  title: (str: string): string => {
    return str.replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    )
  },

  /**
   * Truncate string with ellipsis
   */
  truncate: (str: string, length: number): string => {
    if (str.length <= length) return str
    return str.substring(0, length).trim() + '...'
  },

  /**
   * Extract initials from name
   */
  initials: (name: string): string => {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2)
  },
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Confidence score utilities
export const getConfidenceColor = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 0.8) return 'high'
  if (score >= 0.5) return 'medium'
  return 'low'
}

export const getConfidenceLabel = (score: number): string => {
  if (score >= 0.8) return 'High'
  if (score >= 0.5) return 'Medium'
  return 'Low'
}

export const getConfidenceBadgeColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100 text-green-800'
  if (score >= 50) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

// Agent status utilities
export const getAgentStatusColor = (status: string): string => {
  switch (status) {
    case 'running': return 'text-green-600'
    case 'idle': return 'text-blue-600'
    case 'paused': return 'text-orange-500'
    case 'error': return 'text-red-500'
    case 'disabled': return 'text-gray-500'
    default: return 'text-gray-500'
  }
}

export const getAgentStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'running': return 'bg-green-100 text-green-800'
    case 'idle': return 'bg-blue-100 text-blue-800'
    case 'paused': return 'bg-orange-100 text-orange-800'
    case 'error': return 'bg-red-100 text-red-800'
    case 'disabled': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Prospect status utilities
export const getProspectStatusColor = (status: string): string => {
  switch (status) {
    case 'new': return 'text-blue-600'
    case 'researching': return 'text-purple-600'
    case 'enriched': return 'text-indigo-600'
    case 'email_sent': return 'text-orange-500'
    case 'replied': return 'text-green-600'
    case 'meeting_booked': return 'text-emerald-600'
    case 'qualified': return 'text-green-700'
    case 'lost': return 'text-red-500'
    case 'archived': return 'text-gray-500'
    default: return 'text-gray-500'
  }
}

export const getProspectStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'new': return 'bg-blue-100 text-blue-800'
    case 'researching': return 'bg-purple-100 text-purple-800'
    case 'enriched': return 'bg-indigo-100 text-indigo-800'
    case 'email_sent': return 'bg-orange-100 text-orange-800'
    case 'replied': return 'bg-green-100 text-green-800'
    case 'meeting_booked': return 'bg-emerald-100 text-emerald-800'
    case 'qualified': return 'bg-green-100 text-green-900'
    case 'lost': return 'bg-red-100 text-red-800'
    case 'archived': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// Generate avatar URL from name
export const getAvatarUrl = (name: string, size: number = 64): string => {
  const initials = formatString.initials(name)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=3b82f6&color=fff&format=svg`
}

// Direct function exports for convenience
export const formatRelativeTime = formatDate.relative
export const formatShortDate = formatDate.short
export const formatTime = formatDate.time
export const formatComma = formatNumber.comma
export const formatPercent = formatNumber.percent
export const formatCompact = formatNumber.compact
