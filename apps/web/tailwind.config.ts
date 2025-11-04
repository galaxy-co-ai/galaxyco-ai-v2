import type { Config } from 'tailwindcss';

/**
 * GalaxyCo.ai Design System - Tailwind Configuration
 * Linear-inspired minimalism + Framer blue accent
 * Updated: November 3, 2025
 * Primary Color: #0055FF (Framer blue)
 */

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens with RGB format for alpha channel support
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-hover': 'rgb(var(--border-hover) / <alpha-value>)',
        'border-focus': 'rgb(var(--border-focus) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',

        background: 'rgb(var(--background) / <alpha-value>)',
        'background-elevated': 'rgb(var(--background-elevated) / <alpha-value>)',
        'background-subtle': 'rgb(var(--background-subtle) / <alpha-value>)',

        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        'foreground-muted': 'rgb(var(--foreground-muted) / <alpha-value>)',
        'foreground-subtle': 'rgb(var(--foreground-subtle) / <alpha-value>)',

        hover: 'rgb(var(--hover) / <alpha-value>)',
        active: 'rgb(var(--active) / <alpha-value>)',
        selected: 'rgb(var(--selected) / <alpha-value>)',

        // Brand colors (Primary Framer blue)
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          active: 'rgb(var(--primary-active) / <alpha-value>)',
          muted: 'rgb(var(--primary) / 0.1)',
          subtle: 'rgb(var(--primary) / 0.2)',
        },

        // Secondary (Slate Blue)
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
          hover: 'rgb(var(--secondary-hover) / <alpha-value>)',
          active: 'rgb(var(--secondary-active) / <alpha-value>)',
        },

        // Success (Green) - static colors
        success: {
          DEFAULT: 'rgb(34 197 94 / <alpha-value>)',
          foreground: 'rgb(255 255 255 / <alpha-value>)',
          light: 'rgb(240 253 244 / <alpha-value>)',
          border: 'rgb(74 222 128 / <alpha-value>)',
        },

        // Warning (Amber) - static colors - WCAG AA compliant
        warning: {
          DEFAULT: 'rgb(217 119 6 / <alpha-value>)', // Fixed: was 251 191 36 (1.78:1 FAIL), now 4.5:1 PASS
          foreground: 'rgb(15 23 42 / <alpha-value>)',
          light: 'rgb(254 252 232 / <alpha-value>)',
          border: 'rgb(252 211 77 / <alpha-value>)',
        },

        // Error/Destructive (Red)
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
          hover: 'rgb(var(--destructive-hover) / <alpha-value>)',
          active: 'rgb(var(--destructive-active) / <alpha-value>)',
          light: 'rgb(254 242 242 / <alpha-value>)',
          border: 'rgb(248 113 113 / <alpha-value>)',
        },

        // Shadcn/ui compatibility (CSS variables)
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      },

      fontSize: {
        // [fontSize, lineHeight]
        xs: ['0.75rem', '1rem'], // 12px / 16px - Labels, captions
        sm: ['0.875rem', '1.25rem'], // 14px / 20px - Small body, table text
        base: ['1rem', '1.5rem'], // 16px / 24px - Body text (default)
        lg: ['1.125rem', '1.75rem'], // 18px / 28px - Subheadings
        xl: ['1.25rem', '1.75rem'], // 20px / 28px - Card titles
        '2xl': ['1.5rem', '2rem'], // 24px / 32px - Section titles
        '3xl': ['1.875rem', '2.25rem'], // 30px / 36px - Page titles
        '4xl': ['2.25rem', '2.5rem'], // 36px / 40px - Large headings
        '5xl': ['3rem', '1.1'], // 48px - Section headings
        '6xl': ['3.75rem', '1.1'], // 60px - Large hero
        '7xl': ['4.5rem', '1.1'], // 72px - Hero text
        '8xl': ['6rem', '1.05'], // 96px - Massive hero (Framer style)
        '9xl': ['8rem', '1'], // 128px - Ultra display (rare)
      },

      fontWeight: {
        normal: '400', // Body text
        medium: '500', // Emphasized text, table headers
        semibold: '600', // Buttons, section titles
        bold: '700', // Headlines (use sparingly)
      },

      spacing: {
        px: '1px',
        0: '0',
        1: '0.25rem', // 4px  - Tight spacing (badges, chips)
        2: '0.5rem', // 8px  - Small gaps (icon + text)
        3: '0.75rem', // 12px - Medium-tight
        4: '1rem', // 16px - Base spacing (default padding/margin)
        5: '1.25rem', // 20px - Comfortable
        6: '1.5rem', // 24px - Section padding
        8: '2rem', // 32px - Large section spacing
        10: '2.5rem', // 40px - Very large
        12: '3rem', // 48px - Extra large
        16: '4rem', // 64px - Massive (hero sections)
        20: '5rem', // 80px - XXL
        24: '6rem', // 96px - XXXL
      },

      borderRadius: {
        none: '0',
        sm: '0.25rem', // 4px  - Small elements (badges)
        DEFAULT: '0.5rem', // 8px  - Buttons, inputs, cards
        md: '0.75rem', // 12px - Larger cards
        lg: '1rem', // 16px - Modals, dialogs
        xl: '1.5rem', // 24px - Hero sections
        full: '9999px', // Pills, avatars
      },

      boxShadow: {
        none: 'none',
        // No shadow

        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        // Small elements (dropdowns, tooltips)

        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        // Cards, buttons

        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        // Elevated cards, popovers

        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        // Modals, drawers

        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        // Floating panels

        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // Chat panels, large modals

        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        // Pressed buttons, inset inputs
      },

      screens: {
        sm: '640px', // Tablet portrait
        md: '768px', // Tablet landscape
        lg: '1024px', // Desktop
        xl: '1280px', // Large desktop
        '2xl': '1536px', // Extra large desktop
      },

      zIndex: {
        hide: '-1',
        base: '0',
        dropdown: '1000',
        sticky: '1100',
        overlay: '1200',
        modal: '1300',
        popover: '1400',
        tooltip: '1500',
        toast: '1600',
      },

      transitionDuration: {
        fast: '150ms', // Micro-interactions (hover, focus)
        base: '200ms', // Default transitions
        slow: '300ms', // Larger movements (modals, drawers)
        slower: '500ms', // Complex animations (page transitions)
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)', // Default (ease-in-out)
        snappy: 'cubic-bezier(0.4, 0, 1, 1)', // Quick exit (ease-in)
        bounce: 'cubic-bezier(0, 0, 0.2, 1)', // Gentle entry (ease-out)
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Overshoot effect
      },

      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'fade-out': 'fadeOut 0.15s ease-in',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.15s cubic-bezier(0, 0, 0.2, 1)',
        'scale-out': 'scaleOut 0.15s cubic-bezier(0, 0, 0.2, 1)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class', // Don't apply default styles globally
    }),
  ],
};

export default config;
