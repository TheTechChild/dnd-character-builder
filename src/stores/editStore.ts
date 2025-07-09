import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Character } from '@/types/character';

export interface ChangeHistoryItem {
  timestamp: Date;
  field: string;
  oldValue: unknown;
  newValue: unknown;
  characterId: string;
}

interface EditStore {
  // Edit mode state
  isEditMode: boolean;
  editingCharacterId: string | null;
  
  // Dirty state tracking
  isDirty: boolean;
  dirtyFields: Set<string>;
  
  // Change history
  changeHistory: ChangeHistoryItem[];
  changeHistoryIndex: number;
  
  // Temporary character data (for preview)
  tempCharacterData: Partial<Character> | null;
  
  // Actions
  setEditMode: (enabled: boolean, characterId?: string) => void;
  setDirty: (dirty: boolean) => void;
  markFieldDirty: (field: string) => void;
  clearDirtyFields: () => void;
  
  // Change history actions
  addChangeToHistory: (change: Omit<ChangeHistoryItem, 'timestamp'>) => void;
  undoChange: () => ChangeHistoryItem | null;
  redoChange: () => ChangeHistoryItem | null;
  clearChangeHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Temp data actions
  updateTempData: (updates: Partial<Character>) => void;
  clearTempData: () => void;
  
  // Reset
  resetEditState: () => void;
}

const MAX_CHANGE_HISTORY = 100;

export const useEditStore = create<EditStore>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      isEditMode: false,
      editingCharacterId: null,
      isDirty: false,
      dirtyFields: new Set(),
      changeHistory: [],
      changeHistoryIndex: -1,
      tempCharacterData: null,
      
      // Actions
      setEditMode: (enabled, characterId) => set((state) => {
        state.isEditMode = enabled;
        state.editingCharacterId = characterId || null;
        if (!enabled) {
          state.isDirty = false;
          state.dirtyFields.clear();
          state.tempCharacterData = null;
        }
      }),
      
      setDirty: (dirty) => set((state) => {
        state.isDirty = dirty;
      }),
      
      markFieldDirty: (field) => set((state) => {
        state.dirtyFields.add(field);
        state.isDirty = true;
      }),
      
      clearDirtyFields: () => set((state) => {
        state.dirtyFields.clear();
        state.isDirty = false;
      }),
      
      // Change history
      addChangeToHistory: (change) => set((state) => {
        const newChange: ChangeHistoryItem = {
          ...change,
          timestamp: new Date()
        };
        
        // Remove any future history if we're not at the end
        if (state.changeHistoryIndex < state.changeHistory.length - 1) {
          state.changeHistory = state.changeHistory.slice(0, state.changeHistoryIndex + 1);
        }
        
        // Add new change
        state.changeHistory.push(newChange);
        
        // Trim history if too long
        if (state.changeHistory.length > MAX_CHANGE_HISTORY) {
          state.changeHistory = state.changeHistory.slice(-MAX_CHANGE_HISTORY);
        }
        
        state.changeHistoryIndex = state.changeHistory.length - 1;
      }),
      
      undoChange: () => {
        const state = get();
        if (state.changeHistoryIndex >= 0) {
          const change = state.changeHistory[state.changeHistoryIndex];
          set((draft) => {
            draft.changeHistoryIndex--;
          });
          return change;
        }
        return null;
      },
      
      redoChange: () => {
        const state = get();
        if (state.changeHistoryIndex < state.changeHistory.length - 1) {
          set((draft) => {
            draft.changeHistoryIndex++;
          });
          return state.changeHistory[state.changeHistoryIndex + 1];
        }
        return null;
      },
      
      clearChangeHistory: () => set((state) => {
        state.changeHistory = [];
        state.changeHistoryIndex = -1;
      }),
      
      canUndo: () => {
        const state = get();
        return state.changeHistoryIndex >= 0;
      },
      
      canRedo: () => {
        const state = get();
        return state.changeHistoryIndex < state.changeHistory.length - 1;
      },
      
      // Temp data
      updateTempData: (updates) => set((state) => {
        if (!state.tempCharacterData) {
          state.tempCharacterData = {};
        }
        Object.assign(state.tempCharacterData, updates);
      }),
      
      clearTempData: () => set((state) => {
        state.tempCharacterData = null;
      }),
      
      // Reset
      resetEditState: () => set((state) => {
        state.isEditMode = false;
        state.editingCharacterId = null;
        state.isDirty = false;
        state.dirtyFields.clear();
        state.changeHistory = [];
        state.changeHistoryIndex = -1;
        state.tempCharacterData = null;
      })
    })),
    {
      name: 'edit-store'
    }
  )
);