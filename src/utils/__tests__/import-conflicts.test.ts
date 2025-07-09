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
  const createCharacter = (overrides: Partial<Character> = {}): Character => ({
    id: '123',
    name: 'Test Character',
    level: 1,
    class: 'Fighter',
    race: 'Human',
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: [],
    savingThrows: [],
    languages: ['Common'],
    maxHitPoints: 10,
    currentHitPoints: 10,
    temporaryHitPoints: 0,
    hitDice: '1d10',
    deathSaves: { successes: 0, failures: 0 },
    armorClass: 10,
    initiative: 0,
    speed: 30,
    equipment: [],
    spells: [],
    spellSlots: [],
    features: [],
    proficiencyBonus: 2,
    inspiration: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: 1,
    ...overrides,
  });

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
          skills: ['Athletics'], 
          notes: 'Original notes' 
        }),
        importedCharacter: createCharacter({ 
          id: '456', 
          skills: ['Stealth'], 
          notes: 'Imported notes',
          level: 5,
        }),
      };

      const result = resolveConflict(conflictWithSkills, 'merge');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('123'); // Keep existing ID
      expect(result?.level).toBe(5); // Use imported level
      expect(result?.skills).toContain('Athletics');
      expect(result?.skills).toContain('Stealth');
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