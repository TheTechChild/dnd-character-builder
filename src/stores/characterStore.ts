import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Character } from '@/types/character';
import { v4 as uuidv4 } from 'uuid';

interface HistoryState {
  past: Character[][];
  future: Character[][];
}

interface CharacterStore {
  // State
  characters: Character[];
  selectedCharacterId: string | null;
  
  // History state
  history: HistoryState;
  
  // Actions
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  deleteMultipleCharacters: (ids: string[]) => void;
  getCharacter: (id: string) => Character | undefined;
  setSelectedCharacter: (id: string | null) => void;
  
  // Bulk operations
  importCharacters: (characters: Character[]) => void;
  exportCharacter: (id: string) => Character | undefined;
  exportAllCharacters: () => Character[];
  
  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Utility
  clearHistory: () => void;
  resetStore: () => void;
}

const MAX_HISTORY_SIZE = 50;

const initialState = {
  characters: [],
  selectedCharacterId: null,
  history: {
    past: [],
    future: []
  }
};

export const useCharacterStore = create<CharacterStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        ...initialState,

        // Add a new character
        addCharacter: (character) => {
          set((state) => {
            // Save current state to history (deep clone)
            if (state.history.past.length >= MAX_HISTORY_SIZE) {
              state.history.past.shift();
            }
            state.history.past.push(JSON.parse(JSON.stringify(state.characters)));
            state.history.future = [];

            // Add the character with metadata
            const newCharacter = {
              ...character,
              id: character.id || uuidv4(),
              createdAt: character.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              version: character.version || '1.0.0'
            };
            
            state.characters.push(newCharacter);
          });
        },

        // Update an existing character
        updateCharacter: (id, updates) => {
          set((state) => {
            const index = state.characters.findIndex(c => c.id === id);
            if (index === -1) return;

            // Save current state to history (deep clone)
            if (state.history.past.length >= MAX_HISTORY_SIZE) {
              state.history.past.shift();
            }
            state.history.past.push(JSON.parse(JSON.stringify(state.characters)));
            state.history.future = [];

            // Update the character
            state.characters[index] = {
              ...state.characters[index],
              ...updates,
              updatedAt: new Date().toISOString()
            };
          });
        },

        // Delete a character
        deleteCharacter: (id) => {
          set((state) => {
            // Save current state to history (deep clone)
            if (state.history.past.length >= MAX_HISTORY_SIZE) {
              state.history.past.shift();
            }
            state.history.past.push(JSON.parse(JSON.stringify(state.characters)));
            state.history.future = [];

            // Remove the character
            state.characters = state.characters.filter(c => c.id !== id);
            
            // Clear selection if deleted character was selected
            if (state.selectedCharacterId === id) {
              state.selectedCharacterId = null;
            }
          });
        },

        // Delete multiple characters
        deleteMultipleCharacters: (ids) => {
          set((state) => {
            // Save current state to history (deep clone)
            if (state.history.past.length >= MAX_HISTORY_SIZE) {
              state.history.past.shift();
            }
            state.history.past.push(JSON.parse(JSON.stringify(state.characters)));
            state.history.future = [];

            // Remove the characters
            state.characters = state.characters.filter(c => !ids.includes(c.id));
            
            // Clear selection if deleted
            if (state.selectedCharacterId && ids.includes(state.selectedCharacterId)) {
              state.selectedCharacterId = null;
            }
          });
        },

        // Get a specific character
        getCharacter: (id) => {
          return get().characters.find(c => c.id === id);
        },

        // Set selected character
        setSelectedCharacter: (id) => {
          set((state) => {
            state.selectedCharacterId = id;
          });
        },

        // Import multiple characters
        importCharacters: (characters) => {
          set((state) => {
            // Save current state to history (deep clone)
            if (state.history.past.length >= MAX_HISTORY_SIZE) {
              state.history.past.shift();
            }
            state.history.past.push(JSON.parse(JSON.stringify(state.characters)));
            state.history.future = [];

            // Add all characters with proper metadata
            const newCharacters = characters.map(char => ({
              ...char,
              id: char.id || uuidv4(),
              createdAt: char.createdAt || new Date().toISOString(),
              updatedAt: char.updatedAt || new Date().toISOString(),
              version: char.version || '1.0.0'
            }));

            state.characters.push(...newCharacters);
          });
        },

        // Export a character
        exportCharacter: (id) => {
          const character = get().characters.find(c => c.id === id);
          return character ? { ...character } : undefined;
        },

        // Export all characters
        exportAllCharacters: () => {
          return [...get().characters];
        },

        // Undo last action
        undo: () => {
          set((state) => {
            if (state.history.past.length === 0) return;

            const previous = state.history.past[state.history.past.length - 1];
            state.history.past.pop();

            // Save current state to future (deep clone)
            state.history.future.push(JSON.parse(JSON.stringify(state.characters)));

            // Restore previous state
            state.characters = previous;
          });
        },

        // Redo last undone action
        redo: () => {
          set((state) => {
            if (state.history.future.length === 0) return;

            const next = state.history.future[state.history.future.length - 1];
            state.history.future.pop();

            // Save current state to past (deep clone)
            state.history.past.push(JSON.parse(JSON.stringify(state.characters)));

            // Restore next state
            state.characters = next;
          });
        },

        // Check if can undo
        canUndo: () => {
          return get().history.past.length > 0;
        },

        // Check if can redo
        canRedo: () => {
          return get().history.future.length > 0;
        },

        // Clear history
        clearHistory: () => {
          set((state) => {
            state.history = {
              past: [],
              future: []
            };
          });
        },

        // Reset entire store
        resetStore: () => {
          set(initialState);
        }
      })),
      {
        name: 'dnd-character-store',
        version: 1,
        // Only persist characters and selectedCharacterId, not history
        partialize: (state) => ({
          characters: state.characters,
          selectedCharacterId: state.selectedCharacterId
        })
      }
    ),
    {
      name: 'CharacterStore'
    }
  )
);

// Selectors
export const selectCharacters = (state: CharacterStore) => state.characters;
export const selectSelectedCharacter = (state: CharacterStore) => {
  if (!state.selectedCharacterId) return null;
  return state.characters.find(c => c.id === state.selectedCharacterId);
};
export const selectCharacterById = (id: string) => (state: CharacterStore) =>
  state.characters.find(c => c.id === id);
export const selectCharacterCount = (state: CharacterStore) => state.characters.length;
export const selectCanUndo = (state: CharacterStore) => state.canUndo();
export const selectCanRedo = (state: CharacterStore) => state.canRedo();