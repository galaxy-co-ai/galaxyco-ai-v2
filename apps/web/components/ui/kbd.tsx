import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Kbd component using GalaxyCo.ai Design System tokens
 * Displays keyboard shortcuts with platform detection
 *
 * @example
 * <Kbd keys={["cmd", "k"]} />
 * <Kbd keys={["ctrl", "shift", "p"]} variant="outline" />
 * <Kbd keys={["enter"]} />
 */
const kbdVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5',
    'font-mono text-xs font-medium leading-none',
    'border',
  ],
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground border-border',
        outline: 'bg-background text-foreground border-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// Map of key names to symbols
const KEY_SYMBOLS: Record<string, string> = {
  // Modifiers
  cmd: '⌘',
  command: '⌘',
  ctrl: '⌃',
  control: '⌃',
  shift: '⇧',
  alt: '⌥',
  option: '⌥',
  // Special keys
  enter: '↵',
  return: '↵',
  backspace: '⌫',
  delete: '⌦',
  escape: '⎋',
  esc: '⎋',
  tab: '⇥',
  space: '␣',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

export interface KbdProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'variant'>,
    VariantProps<typeof kbdVariants> {
  /**
   * Array of key names to display
   * Supports special keys (cmd, ctrl, shift, etc.) and regular keys
   */
  keys: string[];

  /**
   * Separator between keys
   * @default "+"
   */
  separator?: string;
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, keys, separator = '+', ...props }, ref) => {
    // Detect platform for cmd/ctrl swap
    const isMac =
      typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const formatKey = (key: string): string => {
      const lowerKey = key.toLowerCase();

      // Platform-specific replacements
      if (lowerKey === 'cmd' || lowerKey === 'command') {
        return isMac ? KEY_SYMBOLS.cmd : KEY_SYMBOLS.ctrl;
      }

      // Return symbol if exists, otherwise capitalize
      return KEY_SYMBOLS[lowerKey] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
      <kbd ref={ref as any} className={cn(kbdVariants({ variant }), className)} {...props}>
        {keys.map((key, index) => (
          <React.Fragment key={`${key}-${index}`}>
            {index > 0 && <span className="text-muted-foreground">{separator}</span>}
            <span>{formatKey(key)}</span>
          </React.Fragment>
        ))}
      </kbd>
    );
  },
);

Kbd.displayName = 'Kbd';

export { Kbd, kbdVariants, KEY_SYMBOLS };
