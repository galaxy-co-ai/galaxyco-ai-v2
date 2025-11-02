/**
 * Kibo UI - Theme Switcher Component
 * Toggle between light/dark themes
 */

'use client';

import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface ThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
};

export function ThemeSwitcher({ className, size = 'md' }: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = root.classList.contains('dark') ? 'dark' : 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = theme === 'light' ? 'dark' : 'light';

    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center justify-center rounded-lg border bg-background hover:bg-accent transition-colors',
        sizeStyles[size],
        className,
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}
    </button>
  );
}
