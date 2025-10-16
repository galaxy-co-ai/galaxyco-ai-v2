# Tailwind Configuration - Production Ready

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Tailwind Version:** 3.4+  
**Plugins:** Typography, Forms, Container Queries  
**Status:** Ready to Copy/Paste

---

## Complete tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  
  darkMode: 'class', // or 'media'
  
  theme: {
    extend: {
      colors: {
        // Base colors
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        
        // Background variants
        'background-subtle': 'rgb(var(--background-subtle) / <alpha-value>)',
        'background-elevated': 'rgb(var(--background-elevated) / <alpha-value>)',
        
        // UI elements
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        
        popover: 'rgb(var(--popover) / <alpha-value>)',
        'popover-foreground': 'rgb(var(--popover-foreground) / <alpha-value>)',
        
        // Primary brand
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          hover: 'rgb(var(--primary-hover) / <alpha-value>)',
          active: 'rgb(var(--primary-active) / <alpha-value>)',
        },
        
        // Secondary
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
          hover: 'rgb(var(--secondary-hover) / <alpha-value>)',
          active: 'rgb(var(--secondary-active) / <alpha-value>)',
        },
        
        // Muted (subtle backgrounds)
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        
        // Accent (hover states)
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        
        // Semantic colors
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
          hover: 'rgb(var(--destructive-hover) / <alpha-value>)',
          active: 'rgb(var(--destructive-active) / <alpha-value>)',
        },
        
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
        },
        
        warning: {
          DEFAULT: 'rgb(var(--warning) / <alpha-value>)',
          foreground: 'rgb(var(--warning-foreground) / <alpha-value>)',
        },
        
        info: {
          DEFAULT: 'rgb(var(--info) / <alpha-value>)',
          foreground: 'rgb(var(--info-foreground) / <alpha-value>)',
        },
        
        // Borders
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-hover': 'rgb(var(--border-hover) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },
      
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.01em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      
      spacing: {
        18: '4.5rem',
        112: '28rem',
        128: '32rem',
      },
      
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none',
      },
      
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      
      transitionDuration: {
        DEFAULT: '200ms',
      },
      
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
```

---

## CSS Variables (src/styles/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Base colors (light mode) */
    --background: 255 255 255; /* White */
    --foreground: 15 23 42; /* Slate-900 */
    
    /* Background variants */
    --background-subtle: 248 250 252; /* Slate-50 */
    --background-elevated: 255 255 255; /* White */
    
    /* UI elements */
    --card: 255 255 255;
    --card-foreground: 15 23 42;
    
    --popover: 255 255 255;
    --popover-foreground: 15 23 42;
    
    /* Primary brand */
    --primary: 59 130 246; /* Blue-500 */
    --primary-foreground: 255 255 255;
    --primary-hover: 37 99 235; /* Blue-600 */
    --primary-active: 29 78 216; /* Blue-700 */
    
    /* Secondary */
    --secondary: 100 116 139; /* Slate-500 */
    --secondary-foreground: 255 255 255;
    --secondary-hover: 71 85 105; /* Slate-600 */
    --secondary-active: 51 65 85; /* Slate-700 */
    
    /* Muted */
    --muted: 241 245 249; /* Slate-100 */
    --muted-foreground: 100 116 139; /* Slate-500 */
    
    /* Accent */
    --accent: 240 249 255; /* Sky-50 */
    --accent-foreground: 15 23 42; /* Slate-900 */
    
    /* Semantic */
    --destructive: 239 68 68; /* Red-500 */
    --destructive-foreground: 255 255 255;
    --destructive-hover: 220 38 38; /* Red-600 */
    --destructive-active: 185 28 28; /* Red-700 */
    
    --success: 34 197 94; /* Green-500 */
    --success-foreground: 255 255 255;
    
    --warning: 251 191 36; /* Amber-400 */
    --warning-foreground: 15 23 42;
    
    --info: 59 130 246; /* Blue-500 */
    --info-foreground: 255 255 255;
    
    /* Borders */
    --border: 226 232 240; /* Slate-200 */
    --border-hover: 203 213 225; /* Slate-300 */
    --input: 226 232 240; /* Slate-200 */
    --ring: 59 130 246; /* Blue-500 */
    
    /* Radius */
    --radius: 0.5rem;
  }
  
  .dark {
    /* Base colors (dark mode) */
    --background: 15 23 42; /* Slate-900 */
    --foreground: 248 250 252; /* Slate-50 */
    
    /* Background variants */
    --background-subtle: 30 41 59; /* Slate-800 */
    --background-elevated: 51 65 85; /* Slate-700 */
    
    /* UI elements */
    --card: 30 41 59; /* Slate-800 */
    --card-foreground: 248 250 252;
    
    --popover: 30 41 59;
    --popover-foreground: 248 250 252;
    
    /* Primary (slightly brighter in dark mode) */
    --primary: 96 165 250; /* Blue-400 */
    --primary-foreground: 15 23 42;
    --primary-hover: 59 130 246; /* Blue-500 */
    --primary-active: 37 99 235; /* Blue-600 */
    
    /* Secondary */
    --secondary: 71 85 105; /* Slate-600 */
    --secondary-foreground: 248 250 252;
    --secondary-hover: 51 65 85; /* Slate-700 */
    --secondary-active: 30 41 59; /* Slate-800 */
    
    /* Muted */
    --muted: 51 65 85; /* Slate-700 */
    --muted-foreground: 148 163 184; /* Slate-400 */
    
    /* Accent */
    --accent: 30 41 59; /* Slate-800 */
    --accent-foreground: 248 250 252;
    
    /* Semantic */
    --destructive: 248 113 113; /* Red-400 */
    --destructive-foreground: 15 23 42;
    --destructive-hover: 239 68 68; /* Red-500 */
    --destructive-active: 220 38 38; /* Red-600 */
    
    --success: 74 222 128; /* Green-400 */
    --success-foreground: 15 23 42;
    
    --warning: 251 191 36; /* Amber-400 */
    --warning-foreground: 15 23 42;
    
    --info: 96 165 250; /* Blue-400 */
    --info-foreground: 15 23 42;
    
    /* Borders */
    --border: 51 65 85; /* Slate-700 */
    --border-hover: 71 85 105; /* Slate-600 */
    --input: 51 65 85;
    --ring: 96 165 250;
  }
  
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  /* Scrollbar styling */
  .scrollbar-thin {
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--muted)) transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgb(var(--muted));
    border-radius: 9999px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgb(var(--muted-foreground));
  }
}
```

---

## Font Loading (index.html)

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GalaxyCo.ai</title>
    
    <!-- Preload fonts -->
    <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/jetbrains-mono.woff2" as="font" type="font/woff2" crossorigin>
    
    <!-- Font face declarations in inline style to prevent FOUT -->
    <style>
      @font-face {
        font-family: 'Inter var';
        font-weight: 100 900;
        font-display: swap;
        font-style: normal;
        font-named-instance: 'Regular';
        src: url('/fonts/inter-var.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'JetBrains Mono';
        font-weight: 400 700;
        font-display: swap;
        src: url('/fonts/jetbrains-mono.woff2') format('woff2');
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Dark Mode Toggle Hook

```typescript
// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
    }
    return 'dark';
  });
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return { theme, setTheme, toggleTheme };
};
```

---

## Utility Classes

```css
@layer utilities {
  /* Focus visible ring */
  .focus-ring {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background;
  }
  
  /* Truncate text */
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Hide scrollbar */
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
}
```

---

## Performance Optimizations

### PurgeCSS Configuration
```javascript
// Already handled by Tailwind's JIT mode
// Ensure content paths are correct in tailwind.config.js
```

### Critical CSS Extraction
```javascript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    devSourcemap: true,
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'tailwind': ['tailwindcss'],
        },
      },
    },
  },
});
```

---

**Status:** Complete ✅  
**Next:** QA & testing checklist
