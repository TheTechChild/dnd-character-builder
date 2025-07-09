import {
  findConflicts,
  resolveConflict,
  resolveConflicts,
  autoResolveConflicts,
  ConflictResolution,
} from '../import-conflicts';
import { Character } from '@/types/character';

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'new-uuid'),
}));

describe('Import Conflicts', () => {
  const createCharacter = (overrides: Partial<Character> = {}): Character => {
  const base: Character = {
    id: '123',
    name: 'Test Character',
    level: 1,
    class: 'Fighter',
    race: 'Human',
    experiencePoints: 0,
    background: 'Soldier',
    alignment: 'Lawful Good',
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: {
      acrobatics: { proficient: false, expertise: false, modifier: 0 },
      animalHandling: { proficient: false, expertise: false, modifier: 0 },
      arcana: { proficient: false, expertise: false, modifier: 0 },
      athletics: { proficient: false, expertise: false, modifier: 0 },
      deception: { proficient: false, expertise: false, modifier: 0 },
      history: { proficient: false, expertise: false, modifier: 0 },
      insight: { proficient: false, expertise: false, modifier: 0 },
      intimidation: { proficient: false, expertise: false, modifier: 0 },
      investigation: { proficient: false, expertise: false, modifier: 0 },
      medicine: { proficient: false, expertise: false, modifier: 0 },
      nature: { proficient: false, expertise: false, modifier: 0 },
      perception: { proficient: false, expertise: false, modifier: 0 },
      performance: { proficient: false, expertise: false, modifier: 0 },
      persuasion: { proficient: false, expertise: false, modifier: 0 },
      religion: { proficient: false, expertise: false, modifier: 0 },
      sleightOfHand: { proficient: false, expertise: false, modifier: 0 },
      stealth: { proficient: false, expertise: false, modifier: 0 },
      survival: { proficient: false, expertise: false, modifier: 0 },
    },
    savingThrows: {
      strength: { proficient: false, modifier: 0 },
      dexterity: { proficient: false, modifier: 0 },
      constitution: { proficient: false, modifier: 0 },
      intelligence: { proficient: false, modifier: 0 },
      wisdom: { proficient: false, modifier: 0 },
      charisma: { proficient: false, modifier: 0 },
    },
    languages: ['Common'],
    hitPoints: { current: 10, max: 10, temp: 0 },
    hitDice: { total: '1d10', current: 1, size: 10 },
    deathSaves: { successes: 0, failures: 0 },
    armorClass: 10,
    initiative: 0,
    speed: { base: 30 },
    spells: undefined,
    spellSlots: undefined,
    spellcastingAbility: undefined,
    spellSaveDC: undefined,
    spellAttackBonus: undefined,
    features: [],
    attacks: [],
    equipment: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    traits: [],
    otherProficiencies: [],
    abilityModifiers: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    proficiencyBonus: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: '2',
  };
  
  return { ...base, ...overrides };
};

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-07-08T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('findConflicts', () => {
    it('should find conflicts by ID', () => {
      const existing = [createCharacter({ id: '123', name: 'Aragorn' })];
      const imported = [createCharacter({ id: '123', name: 'Strider' })];

      const conflicts = findConflicts(imported, existing);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].existingCharacter.name).toBe('Aragorn');
      expect(conflicts[0].importedCharacter.name).toBe('Strider');
    });

    it('should find conflicts by name (case-insensitive)', () => {
      const existing = [createCharacter({ id: '123', name: 'Aragorn' })];
      const imported = [createCharacter({ id: '456', name: 'ARAGORN' })];

      const conflicts = findConflicts(imported, existing);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].existingCharacter.id).toBe('123');
      expect(conflicts[0].importedCharacter.id).toBe('456');
    });

    it('should prioritize ID conflicts over name conflicts', () => {
      const existing = [
        createCharacter({ id: '123', name: 'Aragorn' }),
        createCharacter({ id: '456', name: 'Strider' }),
      ];
      const imported = [createCharacter({ id: '123', name: 'Strider' })];

      const conflicts = findConflicts(imported, existing);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].existingCharacter.name).toBe('Aragorn');
    });

    it('should return empty array when no conflicts', () => {
      const existing = [createCharacter({ id: '123', name: 'Aragorn' })];
      const imported = [createCharacter({ id: '456', name: 'Legolas' })];

      const conflicts = findConflicts(imported, existing);

      expect(conflicts).toHaveLength(0);
    });
  });

  describe('resolveConflict', () => {
    const conflict = {
      existingCharacter: createCharacter({ id: '123', name: 'Aragorn' }),
      importedCharacter: createCharacter({ id: '456', name: 'Strider', level: 5 }),
    };

    it('should handle replace resolution', () => {
      const result = resolveConflict(conflict, 'replace');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('123'); // Keep existing ID
      expect(result?.name).toBe('Strider'); // Use imported data
      expect(result?.level).toBe(5);
      expect(result?.updatedAt).toBe('2024-07-08T12:00:00.000Z');
    });

    it('should handle duplicate resolution', () => {
      const result = resolveConflict(conflict, 'duplicate');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('new-uuid'); // New ID
      expect(result?.name).toBe('Strider (Imported)'); // Modified name
      expect(result?.level).toBe(5);
      expect(result?.createdAt).toBe('2024-07-08T12:00:00.000Z');
    });

    it('should handle skip resolution', () => {
      const result = resolveConflict(conflict, 'skip');
      expect(result).toBeNull();
    });

    it('should handle merge resolution', () => {
      const conflictWithSkills = {
        existingCharacter: createCharacter({ 
          id: '123', 
          skills: {
            ...createCharacter().skills,
            athletics: { proficient: true, expertise: false, modifier: 3 }
          },
          notes: 'Original notes' 
        }),
        importedCharacter: createCharacter({ 
          id: '456', 
          skills: {
            ...createCharacter().skills,
            stealth: { proficient: true, expertise: false, modifier: 2 }
          },
          notes: 'Imported notes',
          level: 5,
        }),
      };

      const result = resolveConflict(conflictWithSkills, 'merge');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('123'); // Keep existing ID
      expect(result?.level).toBe(5); // Use imported level
      expect(result?.skills.athletics.proficient).toBe(true);
      expect(result?.skills.stealth.proficient).toBe(true);
      expect(result?.notes).toContain('Original notes');
      expect(result?.notes).toContain('Imported notes');
    });
  });

  describe('resolveConflicts', () => {
    it('should resolve multiple conflicts', () => {
      const conflicts = [
        {
          existingCharacter: createCharacter({ id: '123' }),
          importedCharacter: createCharacter({ id: '456' }),
          resolution: 'replace' as ConflictResolution,
        },
        {
          existingCharacter: createCharacter({ id: '789' }),
          importedCharacter: createCharacter({ id: '101' }),
          resolution: 'skip' as ConflictResolution,
        },
      ];

      const results = resolveConflicts(conflicts);

      expect(results).toHaveLength(1); // One skipped
      expect(results[0].id).toBe('123'); // Replaced with existing ID
    });

    it('should use default resolution when not specified', () => {
      const conflicts = [
        {
          existingCharacter: createCharacter({ id: '123' }),
          importedCharacter: createCharacter({ id: '456' }),
        },
      ];

      const results = resolveConflicts(conflicts, { defaultResolution: 'duplicate' });

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('new-uuid');
    });
  });

  describe('autoResolveConflicts', () => {
    it('should return conflicts when autoResolve is false', () => {
      const existing = [createCharacter({ id: '123' })];
      const imported = [createCharacter({ id: '123' })];

      const result = autoResolveConflicts(imported, existing, { autoResolve: false });

      expect(result.resolved).toHaveLength(0);
      expect(result.skipped).toHaveLength(0);
      expect(result.conflicts).toHaveLength(1);
    });

    it('should auto-resolve conflicts when enabled', () => {
      const existing = [createCharacter({ id: '123', name: 'Aragorn' })];
      const imported = [
        createCharacter({ id: '123', name: 'Strider' }),
        createCharacter({ id: '456', name: 'Legolas' }),
      ];

      const result = autoResolveConflicts(imported, existing, {
        autoResolve: true,
        defaultResolution: 'replace',
      });

      expect(result.resolved).toHaveLength(2);
      expect(result.skipped).toHaveLength(0);
      expect(result.conflicts).toHaveLength(0);
      
      // Check that conflict was resolved
      const resolvedConflict = result.resolved.find(c => c.id === '123');
      expect(resolvedConflict?.name).toBe('Strider');
    });

    it('should handle skip resolution in auto-resolve', () => {
      const existing = [createCharacter({ id: '123' })];
      const imported = [createCharacter({ id: '123' })];

      const result = autoResolveConflicts(imported, existing, {
        autoResolve: true,
        defaultResolution: 'skip',
      });

      expect(result.resolved).toHaveLength(0);
      expect(result.skipped).toHaveLength(1);
      expect(result.conflicts).toHaveLength(0);
    });

    it('should include non-conflicting characters', () => {
      const existing = [createCharacter({ id: '123' })];
      const imported = [
        createCharacter({ id: '456', name: 'Legolas' }),
        createCharacter({ id: '789', name: 'Gimli' }),
      ];

      const result = autoResolveConflicts(imported, existing, {
        autoResolve: true,
      });

      expect(result.resolved).toHaveLength(2);
      expect(result.skipped).toHaveLength(0);
      expect(result.conflicts).toHaveLength(0);
    });
  });
});