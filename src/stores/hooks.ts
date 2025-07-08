import { useMemo } from 'react';
import { useCharacterStore, selectCharacters, selectSelectedCharacter, selectCharacterById } from './characterStore';
import { useUIStore, selectFilteredCharacterIds } from './uiStore';
import { Character } from '@/types/character';

// Character hooks
export const useCharacters = () => {
  return useCharacterStore(selectCharacters);
};

export const useCharacter = (id: string) => {
  return useCharacterStore(selectCharacterById(id));
};

export const useSelectedCharacter = () => {
  return useCharacterStore(selectSelectedCharacter);
};

export const useCharacterActions = () => {
  const {
    addCharacter,
    updateCharacter,
    deleteCharacter,
    deleteMultipleCharacters,
    setSelectedCharacter,
    importCharacters,
    exportCharacter,
    exportAllCharacters
  } = useCharacterStore();

  return {
    addCharacter,
    updateCharacter,
    deleteCharacter,
    deleteMultipleCharacters,
    setSelectedCharacter,
    importCharacters,
    exportCharacter,
    exportAllCharacters
  };
};

export const useCharacterHistory = () => {
  const { undo, redo, clearHistory } = useCharacterStore();
  const canUndoValue = useCharacterStore(state => state.canUndo());
  const canRedoValue = useCharacterStore(state => state.canRedo());

  return {
    undo,
    redo,
    canUndo: canUndoValue,
    canRedo: canRedoValue,
    clearHistory
  };
};

// UI hooks
export const useViewMode = () => {
  const viewMode = useUIStore(state => state.viewMode);
  const setViewMode = useUIStore(state => state.setViewMode);
  return [viewMode, setViewMode] as const;
};

export const useTheme = () => {
  const theme = useUIStore(state => state.theme);
  const setTheme = useUIStore(state => state.setTheme);
  return [theme, setTheme] as const;
};

export const useSidebar = () => {
  const isOpen = useUIStore(state => state.sidebarOpen);
  const setSidebarOpen = useUIStore(state => state.setSidebarOpen);
  const toggleSidebar = useUIStore(state => state.toggleSidebar);
  
  return {
    isOpen,
    setSidebarOpen,
    toggleSidebar
  };
};

export const useSearch = () => {
  const searchTerm = useUIStore(state => state.searchTerm);
  const setSearchTerm = useUIStore(state => state.setSearchTerm);
  return [searchTerm, setSearchTerm] as const;
};

export const useFilters = () => {
  const filters = useUIStore(state => state.filters);
  const setFilters = useUIStore(state => state.setFilters);
  const updateFilter = useUIStore(state => state.updateFilter);
  const clearFilters = useUIStore(state => state.clearFilters);
  
  return {
    filters,
    setFilters,
    updateFilter,
    clearFilters
  };
};

export const useSort = () => {
  const sortBy = useUIStore(state => state.sortBy);
  const sortOrder = useUIStore(state => state.sortOrder);
  const setSortBy = useUIStore(state => state.setSortBy);
  const setSortOrder = useUIStore(state => state.setSortOrder);
  const toggleSortOrder = useUIStore(state => state.toggleSortOrder);
  
  return {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    toggleSortOrder
  };
};

export const useModals = () => {
  const modals = useUIStore(state => state.modals);
  const openModal = useUIStore(state => state.openModal);
  const closeModal = useUIStore(state => state.closeModal);
  const closeAllModals = useUIStore(state => state.closeAllModals);
  
  return {
    modals,
    openModal,
    closeModal,
    closeAllModals
  };
};

export const useToasts = () => {
  const toasts = useUIStore(state => state.toasts);
  const addToast = useUIStore(state => state.addToast);
  const removeToast = useUIStore(state => state.removeToast);
  const clearToasts = useUIStore(state => state.clearToasts);
  
  return {
    toasts,
    addToast,
    removeToast,
    clearToasts
  };
};

// Combined hooks
export const useFilteredCharacters = () => {
  const characters = useCharacters();
  
  return useMemo(() => {
    const filteredIds = selectFilteredCharacterIds(characters);
    return filteredIds.map(id => characters.find(c => c.id === id)!);
  }, [characters]);
};

// Utility hooks
export const useCharacterCount = () => {
  const characters = useCharacters();
  const filteredCharacters = useFilteredCharacters();
  
  return {
    total: characters.length,
    filtered: filteredCharacters.length
  };
};

export const useIsLoading = () => {
  const isLoading = useUIStore(state => state.isLoading);
  const setLoading = useUIStore(state => state.setLoading);
  return [isLoading, setLoading] as const;
};

// Quick actions hook
export const useQuickActions = () => {
  const { addCharacter, deleteCharacter, updateCharacter } = useCharacterActions();
  const { addToast } = useToasts();
  const { openModal, closeModal } = useModals();
  
  const createCharacter = (character: Character) => {
    addCharacter(character);
    addToast({
      type: 'success',
      title: 'Character Created',
      message: `${character.name} has been created successfully.`
    });
  };
  
  const deleteCharacterWithConfirm = (id: string) => {
    openModal('deleteConfirm', { characterId: id });
  };
  
  const confirmDelete = (id: string) => {
    const character = useCharacterStore.getState().getCharacter(id);
    if (character) {
      deleteCharacter(id);
      addToast({
        type: 'success',
        title: 'Character Deleted',
        message: `${character.name} has been deleted.`
      });
      closeModal('deleteConfirm');
    }
  };
  
  const saveCharacter = (id: string, updates: Partial<Character>) => {
    updateCharacter(id, updates);
    addToast({
      type: 'success',
      title: 'Character Saved',
      message: 'Changes have been saved successfully.'
    });
  };
  
  return {
    createCharacter,
    deleteCharacterWithConfirm,
    confirmDelete,
    saveCharacter
  };
};

// Selection hooks
export const useSelectedCharacters = () => {
  const selectedIds = useUIStore(state => state.selectedCharacterIds);
  const characters = useCharacters();
  const isAllSelected = selectedIds.length > 0 && selectedIds.length === characters.length;
  
  return {
    selectedIds,
    isAllSelected
  };
};

export const useSelectedActions = () => {
  const toggleCharacterSelection = useUIStore(state => state.toggleCharacterSelection);
  const selectAllCharacters = useUIStore(state => state.selectAllCharacters);
  const clearSelection = useUIStore(state => state.clearSelection);
  const characters = useCharacters();
  
  const toggleSelectAll = () => {
    const characterIds = characters.map(c => c.id);
    selectAllCharacters(characterIds);
  };
  
  const toggleSelect = (id: string) => {
    toggleCharacterSelection(id);
  };
  
  return {
    toggleSelectAll,
    toggleSelect,
    clearSelection
  };
};