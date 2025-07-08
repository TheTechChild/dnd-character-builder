import { renderHook, act } from '@testing-library/react';
import { useCharacterStore } from './characterStore';
import { Character } from '@/types/character';

// Mock character data
const mockCharacter: Character = {
  id: '1',
  version: '1.0.0',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  name: 'Test Character',
  race: 'Human',
  class: 'Fighter',
  level: 1,
  experiencePoints: 0,
  background: 'Soldier',
  alignment: 'Lawful Good',
  abilities: {
    strength: 16,
    dexterity: 12,
    constitution: 14,
    intelligence: 10,
    wisdom: 13,
    charisma: 8
  },
  proficiencyBonus: 2,
  savingThrows: {
    strength: { proficient: true, modifier: 5 },
    dexterity: { proficient: false, modifier: 1 },
    constitution: { proficient: true, modifier: 4 },
    intelligence: { proficient: false, modifier: 0 },
    wisdom: { proficient: false, modifier: 1 },
    charisma: { proficient: false, modifier: -1 }
  },
  skills: {
    acrobatics: { proficient: false, expertise: false, modifier: 1 },
    animalHandling: { proficient: false, expertise: false, modifier: 1 },
    arcana: { proficient: false, expertise: false, modifier: 0 },
    athletics: { proficient: true, expertise: false, modifier: 5 },
    deception: { proficient: false, expertise: false, modifier: -1 },
    history: { proficient: false, expertise: false, modifier: 0 },
    insight: { proficient: false, expertise: false, modifier: 1 },
    intimidation: { proficient: true, expertise: false, modifier: 1 },
    investigation: { proficient: false, expertise: false, modifier: 0 },
    medicine: { proficient: false, expertise: false, modifier: 1 },
    nature: { proficient: false, expertise: false, modifier: 0 },
    perception: { proficient: false, expertise: false, modifier: 1 },
    performance: { proficient: false, expertise: false, modifier: -1 },
    persuasion: { proficient: false, expertise: false, modifier: -1 },
    religion: { proficient: false, expertise: false, modifier: 0 },
    sleightOfHand: { proficient: false, expertise: false, modifier: 1 },
    stealth: { proficient: false, expertise: false, modifier: 1 },
    survival: { proficient: true, expertise: false, modifier: 3 }
  },
  armorClass: 16,
  initiative: 1,
  speed: { base: 30 },
  hitPoints: { current: 12, max: 12, temp: 0 },
  hitDice: { total: '1d10', current: 1, size: 10 },
  deathSaves: { successes: 0, failures: 0 },
  attacks: [],
  equipment: [],
  currency: { cp: 0, sp: 0, ep: 0, gp: 15, pp: 0 },
  features: [],
  traits: [],
  otherProficiencies: [],
  languages: ['Common']
};

describe('characterStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { resetStore } = useCharacterStore.getState();
    resetStore();
  });

  describe('CRUD Operations', () => {
    it('should add a character', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
      });

      expect(result.current.characters).toHaveLength(1);
      expect(result.current.characters[0].name).toBe('Test Character');
    });

    it('should update a character', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
        result.current.updateCharacter('1', { name: 'Updated Character' });
      });

      expect(result.current.characters[0].name).toBe('Updated Character');
      expect(result.current.characters[0].updatedAt).not.toBe(mockCharacter.updatedAt);
    });

    it('should delete a character', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
        result.current.deleteCharacter('1');
      });

      expect(result.current.characters).toHaveLength(0);
    });

    it('should delete multiple characters', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
        result.current.addCharacter({ ...mockCharacter, id: '2', name: 'Character 2' });
        result.current.addCharacter({ ...mockCharacter, id: '3', name: 'Character 3' });
        result.current.deleteMultipleCharacters(['1', '2']);
      });

      expect(result.current.characters).toHaveLength(1);
      expect(result.current.characters[0].id).toBe('3');
    });

    it('should get a character by id', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
      });

      const character = result.current.getCharacter('1');
      expect(character?.name).toBe('Test Character');
    });

    it('should handle selected character', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
        result.current.setSelectedCharacter('1');
      });

      expect(result.current.selectedCharacterId).toBe('1');

      act(() => {
        result.current.deleteCharacter('1');
      });

      expect(result.current.selectedCharacterId).toBeNull();
    });
  });

  describe('Import/Export', () => {
    it('should import multiple characters', () => {
      const { result } = renderHook(() => useCharacterStore());

      const characters = [
        mockCharacter,
        { ...mockCharacter, id: '2', name: 'Character 2' },
        { ...mockCharacter, id: '3', name: 'Character 3' }
      ];

      act(() => {
        result.current.importCharacters(characters);
      });

      expect(result.current.characters).toHaveLength(3);
    });

    it('should export a character', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
      });

      const exported = result.current.exportCharacter('1');
      expect(exported).toEqual(result.current.characters[0]);
    });

    it('should export all characters', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
        result.current.addCharacter({ ...mockCharacter, id: '2', name: 'Character 2' });
      });

      const exported = result.current.exportAllCharacters();
      expect(exported).toHaveLength(2);
    });
  });

  describe('History (Undo/Redo)', () => {
    it('should undo character addition', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
      });

      expect(result.current.characters).toHaveLength(1);
      expect(result.current.canUndo()).toBe(true);

      act(() => {
        result.current.undo();
      });

      expect(result.current.characters).toHaveLength(0);
      expect(result.current.canRedo()).toBe(true);
    });

    it('should redo character addition', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
        result.current.undo();
        result.current.redo();
      });

      expect(result.current.characters).toHaveLength(1);
    });

    it('should track history for updates', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
        result.current.updateCharacter('1', { name: 'Updated 1' });
        result.current.updateCharacter('1', { name: 'Updated 2' });
      });

      expect(result.current.characters[0].name).toBe('Updated 2');

      act(() => {
        result.current.undo();
      });

      expect(result.current.characters[0].name).toBe('Updated 1');

      act(() => {
        result.current.undo();
      });

      expect(result.current.characters[0].name).toBe('Test Character');
    });

    it('should clear future history on new action', () => {
      const { result } = renderHook(() => useCharacterStore());

      act(() => {
        result.current.addCharacter(mockCharacter);
        result.current.updateCharacter('1', { name: 'Updated' });
        result.current.undo();
      });

      expect(result.current.canRedo()).toBe(true);

      act(() => {
        result.current.updateCharacter('1', { name: 'New Update' });
      });

      expect(result.current.canRedo()).toBe(false);
    });

    it('should handle history limit', () => {
      const { result } = renderHook(() => useCharacterStore());

      // Add more than MAX_HISTORY_SIZE (50) actions
      act(() => {
        for (let i = 0; i < 55; i++) {
          result.current.addCharacter({ ...mockCharacter, id: `${i}`, name: `Character ${i}` });
        }
      });

      // Should still be able to undo, but only up to MAX_HISTORY_SIZE
      expect(result.current.canUndo()).toBe(true);
      
      // Undo all possible actions
      let undoCount = 0;
      act(() => {
        while (result.current.canUndo() && undoCount < 50) {
          result.current.undo();
          undoCount++;
        }
      });

      expect(undoCount).toBe(50);
    });
  });

  describe('Performance with 100+ characters', () => {
    it('should handle 100+ characters efficiently', () => {
      const { result } = renderHook(() => useCharacterStore());

      const characters = Array.from({ length: 150 }, (_, i) => ({
        ...mockCharacter,
        id: `${i}`,
        name: `Character ${i}`
      }));

      const startTime = performance.now();
      
      act(() => {
        result.current.importCharacters(characters);
      });

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      expect(result.current.characters).toHaveLength(150);
      expect(executionTime).toBeLessThan(100); // Should complete within 100ms
    });

    it('should search through 100+ characters efficiently', () => {
      const { result } = renderHook(() => useCharacterStore());

      const characters = Array.from({ length: 150 }, (_, i) => ({
        ...mockCharacter,
        id: `${i}`,
        name: `Character ${i}`
      }));

      act(() => {
        result.current.importCharacters(characters);
      });

      const startTime = performance.now();
      const character = result.current.getCharacter('75');
      const endTime = performance.now();

      expect(character?.name).toBe('Character 75');
      expect(endTime - startTime).toBeLessThan(10); // Should be very fast
    });
  });
});