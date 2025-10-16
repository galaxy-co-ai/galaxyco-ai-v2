import type { Config } from "tailwindcss";

/**
 * GalaxyCo.ai Design System - Tailwind Configuration
 * Complete implementation of design tokens from 01-DESIGN-TOKENS.md
 * Updated: October 16, 2025
 */

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (Primary purple)
        primary: {
          DEFAULT: "hsl(262, 83%, 58%)", // #8b5cf6
          foreground: "hsl(0, 0%, 100%)", // White text on primary buttons
          hover: "hsl(262, 83%, 52%)", // Hover state
          active: "hsl(262, 83%, 46%)", // Active/pressed state
          muted: "hsl(262, 83%, 96%)", // Light backgrounds
          subtle: "hsl(262, 20%, 88%)", // Borders, dividers
        },

        // Secondary (Slate Blue)
        secondary: {
          DEFAULT: "hsl(215, 25%, 27%)", // #344050
          foreground: "hsl(0, 0%, 98%)", // Text on secondary buttons
          hover: "hsl(215, 25%, 32%)",
          active: "hsl(215, 25%, 22%)",
        },

        // Success (Green)
        success: {
          DEFAULT: "hsl(142, 76%, 36%)", // #16a34a
          foreground: "hsl(0, 0%, 100%)",
          light: "hsl(142, 76%, 96%)", // Success message backgrounds
          border: "hsl(142, 76%, 45%)",
        },

        // Warning (Amber)
        warning: {
          DEFAULT: "hsl(38, 92%, 50%)", // #f59e0b
          foreground: "hsl(0, 0%, 0%)", // Dark text for contrast
          light: "hsl(38, 92%, 96%)",
          border: "hsl(38, 92%, 55%)",
        },

        // Error/Destructive (Red)
        destructive: {
          DEFAULT: "hsl(0, 84%, 60%)", // #ef4444
          foreground: "hsl(0, 0%, 100%)",
          light: "hsl(0, 84%, 96%)",
          border: "hsl(0, 84%, 65%)",
        },

        // Dark mode neutrals (default theme)
        background: "hsl(240, 10%, 4%)", // #0a0a0b - Page background
        "background-elevated": "hsl(240, 6%, 10%)", // #18181b - Cards, modals
        "background-subtle": "hsl(240, 4%, 16%)", // #27272a - Hover states

        foreground: "hsl(0, 0%, 98%)", // #fafafa - Primary text
        "foreground-muted": "hsl(240, 5%, 65%)", // #a1a1aa - Secondary text
        "foreground-subtle": "hsl(240, 4%, 46%)", // #71717a - Tertiary text

        border: "hsl(240, 4%, 24%)", // #3f3f46 - Default borders
        "border-hover": "hsl(240, 4%, 32%)", // #52525b - Hover borders
        "border-focus": "hsl(262, 83%, 58%)", // Primary color for focus rings

        hover: "hsl(240, 4%, 16%)", // #27272a - Hover backgrounds
        active: "hsl(240, 4%, 12%)", // #1f1f23 - Active/pressed
        selected: "hsl(262, 60%, 16%)", // #2d1b4e - Selected items

        // Shadcn/ui compatibility (CSS variables)
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "Monaco", "monospace"],
      },

      fontSize: {
        // [fontSize, lineHeight]
        xs: ["0.75rem", "1rem"], // 12px / 16px - Labels, captions
        sm: ["0.875rem", "1.25rem"], // 14px / 20px - Small body, table text
        base: ["1rem", "1.5rem"], // 16px / 24px - Body text (default)
        lg: ["1.125rem", "1.75rem"], // 18px / 28px - Subheadings
        xl: ["1.25rem", "1.75rem"], // 20px / 28px - Card titles
        "2xl": ["1.5rem", "2rem"], // 24px / 32px - Section titles
        "3xl": ["1.875rem", "2.25rem"], // 30px / 36px - Page titles
        "4xl": ["2.25rem", "2.5rem"], // 36px / 40px - Hero headlines
        "5xl": ["3rem", "1"], // 48px / 48px - Display (rare)
      },

      fontWeight: {
        normal: "400", // Body text
        medium: "500", // Emphasized text, table headers
        semibold: "600", // Buttons, section titles
        bold: "700", // Headlines (use sparingly)
      },

      spacing: {
        px: "1px",
        0: "0",
        1: "0.25rem", // 4px  - Tight spacing (badges, chips)
        2: "0.5rem", // 8px  - Small gaps (icon + text)
        3: "0.75rem", // 12px - Medium-tight
        4: "1rem", // 16px - Base spacing (default padding/margin)
        5: "1.25rem", // 20px - Comfortable
        6: "1.5rem", // 24px - Section padding
        8: "2rem", // 32px - Large section spacing
        10: "2.5rem", // 40px - Very large
        12: "3rem", // 48px - Extra large
        16: "4rem", // 64px - Massive (hero sections)
        20: "5rem", // 80px - XXL
        24: "6rem", // 96px - XXXL
      },

      borderRadius: {
        none: "0",
        sm: "0.25rem", // 4px  - Small elements (badges)
        DEFAULT: "0.5rem", // 8px  - Buttons, inputs, cards
        md: "0.75rem", // 12px - Larger cards
        lg: "1rem", // 16px - Modals, dialogs
        xl: "1.5rem", // 24px - Hero sections
        full: "9999px", // Pills, avatars
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        // Small elements (dropdowns, tooltips)

        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        // Cards, buttons

        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        // Elevated cards, popovers

        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        // Modals, drawers

        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        // Floating panels

        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        // Pressed buttons, inset inputs
      },

      screens: {
        sm: "640px", // Tablet portrait
        md: "768px", // Tablet landscape
        lg: "1024px", // Desktop
        xl: "1280px", // Large desktop
        "2xl": "1536px", // Extra large desktop
      },

      zIndex: {
        hide: "-1",
        base: "0",
        dropdown: "1000",
        sticky: "1100",
        overlay: "1200",
        modal: "1300",
        popover: "1400",
        tooltip: "1500",
        toast: "1600",
      },

      transitionDuration: {
        fast: "150ms", // Micro-interactions (hover, focus)
        base: "200ms", // Default transitions
        slow: "300ms", // Larger movements (modals, drawers)
        slower: "500ms", // Complex animations (page transitions)
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)", // Default (ease-in-out)
        snappy: "cubic-bezier(0.4, 0, 1, 1)", // Quick exit (ease-in)
        bounce: "cubic-bezier(0, 0, 0.2, 1)", // Gentle entry (ease-out)
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // Overshoot effect
      },

      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
        "fade-out": "fadeOut 0.15s ease-in",
        "slide-up": "slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-down": "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "scale-in": "scaleIn 0.15s cubic-bezier(0, 0, 0.2, 1)",
        "scale-out": "scaleOut 0.15s cubic-bezier(0, 0, 0.2, 1)",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};

export default config;
