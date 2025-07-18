import { parseImportFile, validateCharacter, importCharacterFromFile, sanitizeCharacterData } from '../import';
import { CharacterSchemaV2 } from '@/schemas/characterSchemaV2';
import { CharacterExport } from '../export';
import { Character } from '@/types/character';

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: jest.fn((text) => text.replace(/<[^>]*>/g, '')),
}));

// Mock File
class MockFile {
  content: string;
  name: string;
  type: string;
  size: number;

  constructor(content: string[], name: string, options?: { type?: string }) {
    this.content = content.join('');
    this.name = name;
    this.type = options?.type || '';
    this.size = this.content.length;
  }

  async text() {
    return this.content;
  }
}

global.File = MockFile as unknown as typeof File;

// Mock characterSchemaV2
jest.mock('@/schemas/characterSchemaV2', () => ({
  CharacterSchemaV2: {
    safeParse: jest.fn(),
  },
}));

describe('Import Utilities', () => {
  const mockCharacter: Character = {
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
    abilityModifiers: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
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
    equipment: [],
    attacks: [],
    spells: undefined,
    spellSlots: undefined,
    spellcastingAbility: undefined,
    spellSaveDC: undefined,
    spellAttackBonus: undefined,
    features: [],
    traits: [],
    otherProficiencies: [],
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    proficiencyBonus: 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    version: '1',
  };

  const mockExportData = {
    metadata: {
      version: '1.0.0',
      exportDate: '2024-01-01T00:00:00Z',
      application: 'dnd-character-builder',
      exportFormat: 'json',
    },
    character: mockCharacter,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sanitizeCharacterData', () => {
    it('should sanitize string fields', () => {
      const character = {
        ...mockCharacter,
        name: 'Test <script>alert("xss")</script>',
        notes: 'Some <b>bold</b> text',
      };

      const sanitized = sanitizeCharacterData(character);
      
      expect((sanitized as Character).name).toBe('Test alert("xss")');
      expect((sanitized as Character).notes).toBe('Some bold text');
    });

    it('should sanitize equipment names and descriptions', () => {
      const character = {
        ...mockCharacter,
        equipment: [
          {
            id: '1',
            name: 'Sword <script>alert("xss")</script>',
            description: 'A <b>sharp</b> sword',
            quantity: 1,
          },
        ],
      };

      const sanitized = sanitizeCharacterData(character);
      
      expect((sanitized as Character).equipment[0].name).toBe('Sword alert("xss")');
      expect((sanitized as Character).equipment[0].description).toBe('A sharp sword');
    });

    it('should handle non-object input', () => {
      expect(sanitizeCharacterData(null)).toBe(null);
      expect(sanitizeCharacterData('string')).toBe('string');
      expect(sanitizeCharacterData(123)).toBe(123);
    });
  });

  describe('parseImportFile', () => {
    it('should parse valid JSON file', async () => {
      const file = new File([JSON.stringify(mockExportData)], 'test.json', {
        type: 'application/json',
      });

      const result = await parseImportFile(file);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExportData);
      expect(result.errors).toBeUndefined();
    });

    it('should reject files exceeding size limit', async () => {
      const largeContent = 'x'.repeat(6 * 1024 * 1024); // 6MB
      const file = new File([largeContent], 'large.json', {
        type: 'application/json',
      });

      const result = await parseImportFile(file, { maxFileSize: 5 * 1024 * 1024 });

      expect(result.success).toBe(false);
      expect(result.errors?.[0].type).toBe('validation');
      expect(result.errors?.[0].message).toContain('File size exceeds');
    });

    it('should handle invalid JSON', async () => {
      const file = new File(['invalid json'], 'test.json', {
        type: 'application/json',
      });

      const result = await parseImportFile(file);

      expect(result.success).toBe(false);
      expect(result.errors?.[0].type).toBe('parsing');
      expect(result.errors?.[0].message).toBe('Invalid JSON format');
    });

    it('should reject invalid file format', async () => {
      const file = new File([JSON.stringify({ invalid: 'data' })], 'test.json', {
        type: 'application/json',
      });

      const result = await parseImportFile(file);

      expect(result.success).toBe(false);
      expect(result.errors?.[0].type).toBe('validation');
      expect(result.errors?.[0].message).toContain('Invalid file format');
    });

    it('should warn about incompatible versions', async () => {
      const incompatibleData = {
        ...mockExportData,
        metadata: { ...mockExportData.metadata, version: '2.0.0' },
      };
      const file = new File([JSON.stringify(incompatibleData)], 'test.json', {
        type: 'application/json',
      });

      const result = await parseImportFile(file);

      expect(result.success).toBe(true);
      expect(result.errors?.[0].type).toBe('version');
      expect(result.errors?.[0].message).toContain('Incompatible version');
    });

    it('should sanitize data when requested', async () => {
      const unsafeData = {
        ...mockExportData,
        character: {
          ...mockCharacter,
          name: 'Test <script>alert("xss")</script>',
        },
      };
      const file = new File([JSON.stringify(unsafeData)], 'test.json', {
        type: 'application/json',
      });

      const result = await parseImportFile(file, { sanitize: true });

      expect(result.success).toBe(true);
      expect((result.data as CharacterExport)?.character.name).toBe('Test alert("xss")');
    });
  });

  describe('validateCharacter', () => {
    it('should validate valid character data', () => {
      (CharacterSchemaV2.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockCharacter,
      });

      const result = validateCharacter(mockCharacter);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCharacter);
      expect(CharacterSchemaV2.safeParse).toHaveBeenCalledWith(mockCharacter);
    });

    it('should return validation errors', () => {
      (CharacterSchemaV2.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: {
          errors: [
            { path: ['name'], message: 'Name is required' },
            { path: ['level'], message: 'Level must be between 1 and 20' },
          ],
        },
      });

      const result = validateCharacter({});

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors?.[0]).toEqual({
        type: 'validation',
        field: 'name',
        message: 'Name is required',
      });
      expect(result.errors?.[1]).toEqual({
        type: 'validation',
        field: 'level',
        message: 'Level must be between 1 and 20',
      });
    });

    it('should handle validation exceptions', () => {
      (CharacterSchemaV2.safeParse as jest.Mock).mockImplementation(() => {
        throw new Error('Validation error');
      });

      const result = validateCharacter(mockCharacter);

      expect(result.success).toBe(false);
      expect(result.errors?.[0].type).toBe('unknown');
      expect(result.errors?.[0].message).toBe('Validation failed');
    });
  });

  describe('importCharacterFromFile', () => {
    it('should import valid single character file', async () => {
      const file = new File([JSON.stringify(mockExportData)], 'test.json', {
        type: 'application/json',
      });

      (CharacterSchemaV2.safeParse as jest.Mock).mockReturnValue({
        success: true,
        data: mockCharacter,
      });

      const result = await importCharacterFromFile(file);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCharacter);
    });

    it('should reject batch export file', async () => {
      const batchData = {
        metadata: mockExportData.metadata,
        characters: [mockCharacter],
      };
      const file = new File([JSON.stringify(batchData)], 'test.json', {
        type: 'application/json',
      });

      const result = await importCharacterFromFile(file);

      expect(result.success).toBe(false);
      expect(result.errors?.[0].message).toContain('multiple characters');
    });

    it('should combine parse and validation errors', async () => {
      const incompatibleData = {
        ...mockExportData,
        metadata: { ...mockExportData.metadata, version: '2.0.0' },
      };
      const file = new File([JSON.stringify(incompatibleData)], 'test.json', {
        type: 'application/json',
      });

      (CharacterSchemaV2.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: {
          errors: [{ path: ['name'], message: 'Invalid name' }],
        },
      });

      const result = await importCharacterFromFile(file);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors?.[0].type).toBe('version');
      expect(result.errors?.[1].type).toBe('validation');
    });
  });
});