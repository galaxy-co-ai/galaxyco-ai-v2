/**
 * GalaxyCo.ai Keyboard Shortcuts Hook
 * Global keyboard shortcuts for the assistant
 * November 2, 2025
 */

import { useEffect } from 'react';

interface KeyboardShortcuts {
  'Cmd+K'?: () => void; // New conversation
  'Cmd+/'?: () => void; // Focus input
  Escape?: () => void; // Close modals
  ArrowUp?: () => void; // Edit last message
}

export function useKeyboardShortcuts(shortcuts: Partial<KeyboardShortcuts>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + K: New conversation
      if (modKey && e.key === 'k') {
        e.preventDefault();
        shortcuts['Cmd+K']?.();
      }

      // Cmd/Ctrl + /: Focus input
      if (modKey && e.key === '/') {
        e.preventDefault();
        shortcuts['Cmd+/']?.();
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        shortcuts.Escape?.();
      }

      // Arrow Up: Edit last message (only if input is empty and focused)
      if (e.key === 'ArrowUp') {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'TEXTAREA' &&
          (target as HTMLTextAreaElement).value === ''
        ) {
          e.preventDefault();
          shortcuts.ArrowUp?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
}

