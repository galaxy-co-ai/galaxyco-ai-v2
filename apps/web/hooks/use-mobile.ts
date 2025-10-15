/**
 * GalaxyCo.ai Mobile Detection Hook
 * React hook for responsive breakpoint detection
 * October 15, 2025
 */

'use client'

import { useState, useEffect } from 'react'
import { breakpoints } from '@/lib/design-tokens'

// Convert breakpoint strings to numbers
const breakpointValues = {
  xs: parseInt(breakpoints.xs),      // 475px
  sm: parseInt(breakpoints.sm),      // 640px  
  md: parseInt(breakpoints.md),      // 768px
  lg: parseInt(breakpoints.lg),      // 1024px
  xl: parseInt(breakpoints.xl),      // 1280px
  '2xl': parseInt(breakpoints['2xl']), // 1536px
}

export type Breakpoint = keyof typeof breakpointValues

// Hook to detect current breakpoint
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth

      if (width < breakpointValues.xs) {
        setBreakpoint('xs')
      } else if (width < breakpointValues.sm) {
        setBreakpoint('sm')
      } else if (width < breakpointValues.md) {
        setBreakpoint('md') 
      } else if (width < breakpointValues.lg) {
        setBreakpoint('lg')
      } else if (width < breakpointValues.xl) {
        setBreakpoint('xl')
      } else {
        setBreakpoint('2xl')
      }
    }

    // Set initial value
    updateBreakpoint()

    // Add event listener
    window.addEventListener('resize', updateBreakpoint)

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

// Hook to check if screen is mobile size
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpointValues.md) // Less than 768px
    }

    // Set initial value
    checkMobile()

    // Add event listener
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Hook to check if screen is tablet size
export function useTablet() {
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkTablet = () => {
      const width = window.innerWidth
      setIsTablet(width >= breakpointValues.md && width < breakpointValues.lg) // 768px - 1024px
    }

    // Set initial value
    checkTablet()

    // Add event listener
    window.addEventListener('resize', checkTablet)

    // Cleanup
    return () => window.removeEventListener('resize', checkTablet)
  }, [])

  return isTablet
}

// Hook to check if screen is desktop size
export function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= breakpointValues.lg) // 1024px and up
    }

    // Set initial value
    checkDesktop()

    // Add event listener
    window.addEventListener('resize', checkDesktop)

    // Cleanup
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  return isDesktop
}

// Hook to get screen size category
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth

      if (width < breakpointValues.md) {
        setScreenSize('mobile')
      } else if (width < breakpointValues.lg) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }

    // Set initial value
    updateScreenSize()

    // Add event listener
    window.addEventListener('resize', updateScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return screenSize
}

// Hook for media query matching
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    const handleChange = () => setMatches(mediaQuery.matches)
    
    // Set initial value
    setMatches(mediaQuery.matches)
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange)
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [query])

  return matches
}

// Predefined media query hooks
export function useMinWidth(width: number) {
  return useMediaQuery(`(min-width: ${width}px)`)
}

export function useMaxWidth(width: number) {
  return useMediaQuery(`(max-width: ${width - 1}px)`)
}

// Hook to detect if user prefers reduced motion
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

// Hook to detect if user prefers dark mode
export function usePrefersDarkMode() {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

// Hook to get viewport dimensions
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  })

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', updateViewport)

    // Cleanup
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  return viewport
}

// Helper function to check if touch device
export function useTouch() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouch
}

// Main hook combining all mobile detection features
export default function useResponsive() {
  const isMobile = useMobile()
  const isTablet = useTablet()
  const isDesktop = useDesktop()
  const screenSize = useScreenSize()
  const breakpoint = useBreakpoint()
  const viewport = useViewport()
  const isTouch = useTouch()
  const prefersReducedMotion = useReducedMotion()

  return {
    // Boolean flags
    isMobile,
    isTablet, 
    isDesktop,
    isTouch,
    prefersReducedMotion,

    // Screen size info
    screenSize,
    breakpoint,
    viewport,

    // Helper functions
    isBreakpoint: (bp: Breakpoint) => breakpoint === bp,
    isMinBreakpoint: (bp: Breakpoint) => viewport.width >= breakpointValues[bp],
    isMaxBreakpoint: (bp: Breakpoint) => viewport.width < breakpointValues[bp],
  }
}