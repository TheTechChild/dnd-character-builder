import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type ViewMode = 'grid' | 'list';
export type Theme = 'light' | 'dark' | 'system';
export type SortBy = 'name' | 'level' | 'lastModified' | 'created' | 'class' | 'race';
export type SortOrder = 'asc' | 'desc';

interface FilterState {
  class?: string[];
  level?: number[];
  race?: string[];
  background?: string[];
  minLevel?: number;
  maxLevel?: number;
}

interface ModalState {
  deleteConfirm: {
    isOpen: boolean;
    characterId?: string;
    characterIds?: string[];
  };
  importExport: {
    isOpen: boolean;
    mode?: 'import' | 'export';
  };
  characterForm: {
    isOpen: boolean;
    mode?: 'create' | 'edit';
    characterId?: string;
  };
}

interface UIStore {
  // View preferences
  viewMode: ViewMode;
  theme: Theme;
  
  // Filters & Search
  searchTerm: string;
  filters: FilterState;
  sortBy: SortBy;
  sortOrder: SortOrder;
  
  // UI State
  sidebarOpen: boolean;
  isLoading: boolean;
  modals: ModalState;
  
  // Selection State
  selectedCharacterIds: string[];
  
  // Toast notifications
  toasts: Toast[];
  
  // Actions - View
  setViewMode: (mode: ViewMode) => void;
  setTheme: (theme: Theme) => void;
  
  // Actions - Search & Filter
  setSearchTerm: (term: string) => void;
  setFilters: (filters: FilterState) => void;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilters: () => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  
  // Actions - UI State
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  
  // Actions - Modals
  openModal: (modal: keyof ModalState, data?: Record<string, unknown>) => void;
  closeModal: (modal: keyof ModalState) => void;
  closeAllModals: () => void;
  
  // Actions - Toasts
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Actions - Selection
  setSelectedCharacterIds: (ids: string[]) => void;
  toggleCharacterSelection: (id: string) => void;
  selectAllCharacters: (ids: string[]) => void;
  clearSelection: () => void;
  
  // Utility
  resetUIState: () => void;
}

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const initialState = {
  viewMode: 'grid' as ViewMode,
  theme: 'system' as Theme,
  searchTerm: '',
  filters: {},
  sortBy: 'lastModified' as SortBy,
  sortOrder: 'desc' as SortOrder,
  sidebarOpen: true,
  isLoading: false,
  modals: {
    deleteConfirm: { isOpen: false },
    importExport: { isOpen: false },
    characterForm: { isOpen: false }
  },
  selectedCharacterIds: [],
  toasts: []
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        ...initialState,

        // View actions
        setViewMode: (mode) => {
          set((state) => {
            state.viewMode = mode;
          });
        },

        setTheme: (theme) => {
          set((state) => {
            state.theme = theme;
            // Apply theme to document
            if (typeof window !== 'undefined') {
              const root = window.document.documentElement;
              root.classList.remove('light', 'dark');
              
              if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'dark'
                  : 'light';
                root.classList.add(systemTheme);
              } else {
                root.classList.add(theme);
              }
            }
          });
        },

        // Search & Filter actions
        setSearchTerm: (term) => {
          set((state) => {
            state.searchTerm = term;
          });
        },

        setFilters: (filters) => {
          set((state) => {
            state.filters = filters;
          });
        },

        updateFilter: (key, value) => {
          set((state) => {
            if (value === undefined || (Array.isArray(value) && value.length === 0)) {
              delete state.filters[key];
            } else {
              state.filters[key] = value;
            }
          });
        },

        clearFilters: () => {
          set((state) => {
            state.filters = {};
            state.searchTerm = '';
          });
        },

        setSortBy: (sortBy) => {
          set((state) => {
            state.sortBy = sortBy;
          });
        },

        setSortOrder: (order) => {
          set((state) => {
            state.sortOrder = order;
          });
        },

        toggleSortOrder: () => {
          set((state) => {
            state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
          });
        },

        // UI State actions
        setSidebarOpen: (open) => {
          set((state) => {
            state.sidebarOpen = open;
          });
        },

        toggleSidebar: () => {
          set((state) => {
            state.sidebarOpen = !state.sidebarOpen;
          });
        },

        setLoading: (loading) => {
          set((state) => {
            state.isLoading = loading;
          });
        },

        // Modal actions
        openModal: (modal, data) => {
          set((state) => {
            state.modals[modal] = {
              isOpen: true,
              ...data
            };
          });
        },

        closeModal: (modal) => {
          set((state) => {
            state.modals[modal].isOpen = false;
          });
        },

        closeAllModals: () => {
          set((state) => {
            Object.keys(state.modals).forEach(key => {
              state.modals[key as keyof ModalState].isOpen = false;
            });
          });
        },

        // Toast actions
        addToast: (toast) => {
          const id = Date.now().toString();
          const newToast = {
            ...toast,
            id,
            duration: toast.duration ?? 5000
          };

          set((state) => {
            state.toasts.push(newToast);
          });

          // Auto-remove toast after duration
          if (newToast.duration > 0) {
            setTimeout(() => {
              get().removeToast(id);
            }, newToast.duration);
          }
        },

        removeToast: (id) => {
          set((state) => {
            state.toasts = state.toasts.filter(t => t.id !== id);
          });
        },

        clearToasts: () => {
          set((state) => {
            state.toasts = [];
          });
        },

        // Selection actions
        setSelectedCharacterIds: (ids) => {
          set((state) => {
            state.selectedCharacterIds = ids;
          });
        },

        toggleCharacterSelection: (id) => {
          set((state) => {
            const index = state.selectedCharacterIds.indexOf(id);
            if (index === -1) {
              state.selectedCharacterIds.push(id);
            } else {
              state.selectedCharacterIds.splice(index, 1);
            }
          });
        },

        selectAllCharacters: (ids) => {
          set((state) => {
            state.selectedCharacterIds = ids;
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selectedCharacterIds = [];
          });
        },

        // Utility
        resetUIState: () => {
          set((state) => {
            // Preserve theme preference
            const currentTheme = state.theme;
            Object.assign(state, {
              ...initialState,
              theme: currentTheme
            });
          });
        }
      })),
      {
        name: 'dnd-ui-store',
        version: 1,
        // Only persist user preferences, not temporary UI state
        partialize: (state) => ({
          viewMode: state.viewMode,
          theme: state.theme,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
          sidebarOpen: state.sidebarOpen
        })
      }
    ),
    {
      name: 'UIStore'
    }
  )
);

// Selectors
export const selectFilteredCharacterIds = (characterList: Array<{
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  background?: string;
  createdAt: string;
  updatedAt: string;
}>) => {
  const { searchTerm, filters, sortBy, sortOrder } = useUIStore.getState();
  
  let filtered = [...characterList];

  // Apply search filter
  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    filtered = filtered.filter(char => 
      char.name.toLowerCase().includes(search) ||
      char.class.toLowerCase().includes(search) ||
      char.race.toLowerCase().includes(search) ||
      char.background?.toLowerCase().includes(search)
    );
  }

  // Apply filters
  if (filters.class?.length) {
    filtered = filtered.filter(char => filters.class!.includes(char.class));
  }
  if (filters.race?.length) {
    filtered = filtered.filter(char => filters.race!.includes(char.race));
  }
  if (filters.background?.length) {
    filtered = filtered.filter(char => char.background && filters.background!.includes(char.background));
  }
  if (filters.level?.length) {
    filtered = filtered.filter(char => filters.level!.includes(char.level));
  }
  if (filters.minLevel !== undefined) {
    filtered = filtered.filter(char => char.level >= filters.minLevel!);
  }
  if (filters.maxLevel !== undefined) {
    filtered = filtered.filter(char => char.level <= filters.maxLevel!);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'level':
        comparison = a.level - b.level;
        break;
      case 'class':
        comparison = a.class.localeCompare(b.class);
        break;
      case 'race':
        comparison = a.race.localeCompare(b.race);
        break;
      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'lastModified':
      default:
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered.map(char => char.id);
};

// Initialize theme on app start
if (typeof window !== 'undefined') {
  const { theme } = useUIStore.getState();
  useUIStore.getState().setTheme(theme);
}