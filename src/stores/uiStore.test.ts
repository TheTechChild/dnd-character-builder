import { renderHook, act } from '@testing-library/react';
import { useUIStore, selectFilteredCharacterIds } from './uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { resetUIState } = useUIStore.getState();
    resetUIState();
  });

  describe('View preferences', () => {
    it('should toggle view mode', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.viewMode).toBe('grid');

      act(() => {
        result.current.setViewMode('list');
      });

      expect(result.current.viewMode).toBe('list');
    });

    it('should set theme', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('Search and filters', () => {
    it('should set search term', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSearchTerm('wizard');
      });

      expect(result.current.searchTerm).toBe('wizard');
    });

    it('should set filters', () => {
      const { result } = renderHook(() => useUIStore());

      const filters = {
        class: ['Fighter', 'Wizard'],
        level: [5, 10],
        race: ['Human', 'Elf']
      };

      act(() => {
        result.current.setFilters(filters);
      });

      expect(result.current.filters).toEqual(filters);
    });

    it('should update individual filter', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.updateFilter('class', ['Rogue']);
        result.current.updateFilter('minLevel', 3);
      });

      expect(result.current.filters.class).toEqual(['Rogue']);
      expect(result.current.filters.minLevel).toBe(3);
    });

    it('should clear filters', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setFilters({ class: ['Fighter'], level: [5] });
        result.current.setSearchTerm('test');
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({});
      expect(result.current.searchTerm).toBe('');
    });
  });

  describe('Sorting', () => {
    it('should set sort by', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSortBy('name');
      });

      expect(result.current.sortBy).toBe('name');
    });

    it('should toggle sort order', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.sortOrder).toBe('desc');

      act(() => {
        result.current.toggleSortOrder();
      });

      expect(result.current.sortOrder).toBe('asc');

      act(() => {
        result.current.toggleSortOrder();
      });

      expect(result.current.sortOrder).toBe('desc');
    });
  });

  describe('UI State', () => {
    it('should toggle sidebar', () => {
      const { result } = renderHook(() => useUIStore());

      expect(result.current.sidebarOpen).toBe(true);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.sidebarOpen).toBe(false);
    });

    it('should set loading state', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Modals', () => {
    it('should open and close modals', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openModal('deleteConfirm', { characterId: '123' });
      });

      expect(result.current.modals.deleteConfirm.isOpen).toBe(true);
      expect(result.current.modals.deleteConfirm.characterId).toBe('123');

      act(() => {
        result.current.closeModal('deleteConfirm');
      });

      expect(result.current.modals.deleteConfirm.isOpen).toBe(false);
    });

    it('should close all modals', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.openModal('deleteConfirm');
        result.current.openModal('importExport');
        result.current.openModal('characterForm');
        result.current.closeAllModals();
      });

      expect(result.current.modals.deleteConfirm.isOpen).toBe(false);
      expect(result.current.modals.importExport.isOpen).toBe(false);
      expect(result.current.modals.characterForm.isOpen).toBe(false);
    });
  });

  describe('Toasts', () => {
    it('should add and remove toasts', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addToast({
          variant: 'success',
          title: 'Test Toast',
          description: 'This is a test'
        });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].title).toBe('Test Toast');

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should clear all toasts', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addToast({ variant: 'success', title: 'Toast 1' });
        result.current.addToast({ variant: 'error', title: 'Toast 2' });
        result.current.addToast({ variant: 'info', title: 'Toast 3' });
        result.current.clearToasts();
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should auto-remove toast after duration', async () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.addToast({
          variant: 'success',
          title: 'Auto Remove',
          duration: 1000
        });
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.toasts).toHaveLength(0);

      jest.useRealTimers();
    });
  });

  describe('Character filtering', () => {
    const mockCharacters = [
      {
        id: '1',
        name: 'Aragorn',
        class: 'Ranger',
        race: 'Human',
        level: 10,
        background: 'Noble',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-05T00:00:00Z'
      },
      {
        id: '2',
        name: 'Gandalf',
        class: 'Wizard',
        race: 'Human',
        level: 20,
        background: 'Sage',
        createdAt: '2025-01-02T00:00:00Z',
        updatedAt: '2025-01-03T00:00:00Z'
      },
      {
        id: '3',
        name: 'Legolas',
        class: 'Ranger',
        race: 'Elf',
        level: 15,
        background: 'Outlander',
        createdAt: '2025-01-03T00:00:00Z',
        updatedAt: '2025-01-04T00:00:00Z'
      }
    ];

    it('should filter by search term', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSearchTerm('gandalf');
      });

      const filtered = selectFilteredCharacterIds(mockCharacters);
      expect(filtered).toEqual(['2']);
    });

    it('should filter by class', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.updateFilter('class', ['Ranger']);
      });

      const filtered = selectFilteredCharacterIds(mockCharacters);
      expect(filtered).toEqual(['1', '3']);
    });

    it('should filter by level range', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.updateFilter('minLevel', 10);
        result.current.updateFilter('maxLevel', 15);
      });

      const filtered = selectFilteredCharacterIds(mockCharacters);
      expect(filtered).toEqual(['1', '3']);
    });

    it('should combine multiple filters', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.updateFilter('race', ['Human']);
        result.current.updateFilter('minLevel', 15);
      });

      const filtered = selectFilteredCharacterIds(mockCharacters);
      expect(filtered).toEqual(['2']);
    });

    it('should sort by name', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSortBy('name');
        result.current.setSortOrder('asc');
      });

      const filtered = selectFilteredCharacterIds(mockCharacters);
      expect(filtered).toEqual(['1', '2', '3']);
    });

    it('should sort by level descending', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSortBy('level');
        result.current.setSortOrder('desc');
      });

      const filtered = selectFilteredCharacterIds(mockCharacters);
      expect(filtered).toEqual(['2', '3', '1']);
    });

    it('should sort by last modified', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setSortBy('lastModified');
        result.current.setSortOrder('desc');
      });

      const filtered = selectFilteredCharacterIds(mockCharacters);
      expect(filtered).toEqual(['1', '3', '2']);
    });
  });

  describe('Store reset', () => {
    it('should reset UI state while preserving theme', () => {
      const { result } = renderHook(() => useUIStore());

      act(() => {
        result.current.setTheme('dark');
        result.current.setViewMode('list');
        result.current.setSearchTerm('test');
        result.current.setSidebarOpen(false);
        result.current.resetUIState();
      });

      expect(result.current.theme).toBe('dark'); // Theme preserved
      expect(result.current.viewMode).toBe('grid'); // Reset to default
      expect(result.current.searchTerm).toBe(''); // Reset to default
      expect(result.current.sidebarOpen).toBe(true); // Reset to default
    });
  });
});