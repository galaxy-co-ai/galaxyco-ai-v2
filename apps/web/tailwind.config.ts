import type { Config } from 'tailwindcss'

/**
 * GalaxyCo.ai Simplified Tailwind Configuration
 * Using Tailwind for layout utilities ONLY
 * Pico CSS handles all visual styling
 * Updated: October 14, 2025
 */

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    // Use Tailwind default theme
    // No custom colors, spacing, shadows, etc.
    // Pico CSS handles all of that
  },
  plugins: [],
}

export default config
