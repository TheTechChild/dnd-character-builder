import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { DiceRollResult, rollDiceNotation } from '@/utils/diceRoller';

interface DiceState {
  // Roll history
  history: DiceRollResult[];
  maxHistorySize: number;
  
  // User preferences
  soundEnabled: boolean;
  animationsEnabled: boolean;
  showFloatingWidget: boolean;
  
  // Actions
  roll: (notation: string, label?: string) => DiceRollResult;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  
  // Preferences
  setSoundEnabled: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setShowFloatingWidget: (show: boolean) => void;
}

export const useDiceStore = create<DiceState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial state
        history: [],
        maxHistorySize: 100,
        
        // Default preferences
        soundEnabled: false,
        animationsEnabled: true,
        showFloatingWidget: false,
        
        // Actions
        roll: (notation: string, label?: string) => {
          const result = rollDiceNotation(notation, label);
          
          set((state) => {
            // Add to history
            state.history.unshift(result);
            
            // Trim history if needed
            if (state.history.length > state.maxHistorySize) {
              state.history = state.history.slice(0, state.maxHistorySize);
            }
          });
          
          return result;
        },
        
        clearHistory: () => {
          set((state) => {
            state.history = [];
          });
        },
        
        removeFromHistory: (id: string) => {
          set((state) => {
            state.history = state.history.filter(roll => roll.id !== id);
          });
        },
        
        // Preferences
        setSoundEnabled: (enabled: boolean) => {
          set((state) => {
            state.soundEnabled = enabled;
          });
        },
        
        setAnimationsEnabled: (enabled: boolean) => {
          set((state) => {
            state.animationsEnabled = enabled;
          });
        },
        
        setShowFloatingWidget: (show: boolean) => {
          set((state) => {
            state.showFloatingWidget = show;
          });
        }
      })),
      {
        name: 'dice-store',
        partialize: (state) => ({
          history: state.history.slice(0, 20), // Only persist last 20 rolls
          soundEnabled: state.soundEnabled,
          animationsEnabled: state.animationsEnabled,
          showFloatingWidget: state.showFloatingWidget
        })
      }
    ),
    { name: 'DiceStore' }
  )
);

// Selector hooks
export const useDiceHistory = () => useDiceStore((state) => state.history);
export const useDicePreferences = () => useDiceStore((state) => ({
  soundEnabled: state.soundEnabled,
  animationsEnabled: state.animationsEnabled,
  showFloatingWidget: state.showFloatingWidget
}));

// Quick roll hooks
export const useQuickRoll = () => {
  const roll = useDiceStore((state) => state.roll);
  
  return {
    rollD20: (label?: string) => roll('1d20', label),
    rollD12: (label?: string) => roll('1d12', label),
    rollD10: (label?: string) => roll('1d10', label),
    rollD8: (label?: string) => roll('1d8', label),
    rollD6: (label?: string) => roll('1d6', label),
    rollD4: (label?: string) => roll('1d4', label),
    rollD100: (label?: string) => roll('1d100', label),
    rollAdvantage: (modifier: number = 0, label?: string) => {
      const notation = modifier !== 0 
        ? `2d20kh1${modifier >= 0 ? '+' : ''}${modifier}`
        : '2d20kh1';
      return roll(notation, label || 'Advantage');
    },
    rollDisadvantage: (modifier: number = 0, label?: string) => {
      const notation = modifier !== 0
        ? `2d20kl1${modifier >= 0 ? '+' : ''}${modifier}`
        : '2d20kl1';
      return roll(notation, label || 'Disadvantage');
    }
  };
};