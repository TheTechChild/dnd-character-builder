import { useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export interface ShortcutHandler {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  handler: () => void;
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  // Define shortcuts
  const shortcuts = useMemo<ShortcutHandler[]>(() => [
    {
      key: 'n',
      ctrl: true,
      description: 'Create new character',
      handler: () => navigate('/character/new')
    },
    {
      key: '/',
      description: 'Focus search',
      handler: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    },
    {
      key: 'g',
      description: 'Switch to grid view',
      handler: () => {
        const gridButton = document.querySelector('[data-view-mode="grid"]') as HTMLButtonElement;
        gridButton?.click();
      }
    },
    {
      key: 'l',
      description: 'Switch to list view',
      handler: () => {
        const listButton = document.querySelector('[data-view-mode="list"]') as HTMLButtonElement;
        listButton?.click();
      }
    },
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      handler: () => {
        // TODO: Implement shortcuts modal
        console.log('Show keyboard shortcuts');
      }
    },
    {
      key: 'Escape',
      description: 'Close modals/Clear selection',
      handler: () => {
        // Close any open modals
        const closeButton = document.querySelector('[data-modal-close]') as HTMLButtonElement;
        if (closeButton) {
          closeButton.click();
        } else {
          // Clear selection
          const clearButton = document.querySelector('[data-clear-selection]') as HTMLButtonElement;
          clearButton?.click();
        }
      }
    }
  ], [navigate]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Skip if user is typing in an input
    if (event.target instanceof HTMLInputElement || 
        event.target instanceof HTMLTextAreaElement) {
      // Allow escape key even in inputs
      if (event.key !== 'Escape') return;
    }

    // Find matching shortcut
    const shortcut = shortcuts.find(s => {
      const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !s.ctrl || event.ctrlKey || event.metaKey;
      const altMatch = !s.alt || event.altKey;
      const shiftMatch = !s.shift || event.shiftKey;
      
      return keyMatch && ctrlMatch && altMatch && shiftMatch;
    });

    if (shortcut) {
      event.preventDefault();
      shortcut.handler();
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts };
}