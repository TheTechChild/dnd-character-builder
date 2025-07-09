import { saveAs } from 'file-saver';
import {
  createExportMetadata,
  formatFilename,
  formatBatchFilename,
  exportCharacterToJSON,
  exportCharactersToJSON,
  isCharacterExport,
  isBatchExport,
  getExportVersion,
  isCompatibleVersion,
  type CharacterExport,
} from '../export';
import { Character } from '@/types/character';

// Mock file-saver
jest.mock('file-saver');
const mockSaveAs = saveAs as jest.MockedFunction<typeof saveAs>;

// Store original Blob
const originalBlob = global.Blob;

// Mock Blob
class MockBlob {
  content: string[];
  options: { type?: string } | undefined;
  
  constructor(content: string[], options?: { type?: string }) {
    this.content = content;
    this.options = options;
    this.type = options?.type || '';
  }
  
  type: string;
  
  async text() {
    return this.content.join('');
  }
}

global.Blob = MockBlob as unknown as typeof Blob;

describe('Export Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-07-08T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });
  
  afterAll(() => {
    global.Blob = originalBlob;
  });

  const mockCharacter: Character = {
    id: '123',
    name: 'Aragorn',
    level: 5,
    class: 'Ranger',
    subclass: 'Hunter',
    race: 'Human',
    subrace: undefined,
    background: 'Wanderer',
    alignment: 'Lawful Good',
    experiencePoints: 6500,
    abilities: {
      strength: 16,
      dexterity: 14,
      constitution: 14,
      intelligence: 12,
      wisdom: 15,
      charisma: 13,
    },
    abilityModifiers: {
      strength: 3,
      dexterity: 2,
      constitution: 2,
      intelligence: 1,
      wisdom: 2,
      charisma: 1,
    },
    proficiencyBonus: 3,
    savingThrows: {
      strength: { proficient: true, modifier: 6 },
      dexterity: { proficient: true, modifier: 5 },
      constitution: { proficient: false, modifier: 2 },
      intelligence: { proficient: false, modifier: 1 },
      wisdom: { proficient: false, modifier: 2 },
      charisma: { proficient: false, modifier: 1 },
    },
    skills: {
      acrobatics: { proficient: false, expertise: false, modifier: 2 },
      animalHandling: { proficient: true, expertise: false, modifier: 5 },
      arcana: { proficient: false, expertise: false, modifier: 1 },
      athletics: { proficient: true, expertise: false, modifier: 6 },
      deception: { proficient: false, expertise: false, modifier: 1 },
      history: { proficient: false, expertise: false, modifier: 1 },
      insight: { proficient: false, expertise: false, modifier: 2 },
      intimidation: { proficient: false, expertise: false, modifier: 1 },
      investigation: { proficient: false, expertise: false, modifier: 1 },
      medicine: { proficient: false, expertise: false, modifier: 2 },
      nature: { proficient: true, expertise: false, modifier: 4 },
      perception: { proficient: true, expertise: false, modifier: 5 },
      performance: { proficient: false, expertise: false, modifier: 1 },
      persuasion: { proficient: false, expertise: false, modifier: 1 },
      religion: { proficient: false, expertise: false, modifier: 1 },
      sleightOfHand: { proficient: false, expertise: false, modifier: 2 },
      stealth: { proficient: true, expertise: false, modifier: 5 },
      survival: { proficient: true, expertise: false, modifier: 5 },
    },
    armorClass: 15,
    initiative: 2,
    speed: {
      base: 30,
    },
    hitPoints: {
      current: 44,
      max: 44,
      temp: 0,
    },
    hitDice: {
      total: '5d10',
      current: 5,
      size: 10,
    },
    deathSaves: {
      successes: 0,
      failures: 0,
    },
    attacks: [],
    spellcastingAbility: 'wisdom',
    spellSaveDC: 13,
    spellAttackBonus: 5,
    spellSlots: undefined,
    spells: undefined,
    equipment: [],
    currency: {
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 15,
      pp: 0,
    },
    features: [],
    traits: [],
    otherProficiencies: ['Herbalism Kit'],
    languages: ['Common', 'Elvish'],
    createdAt: '2024-07-01T10:00:00Z',
    updatedAt: '2024-07-08T10:00:00Z',
  };

  describe('createExportMetadata', () => {
    it('should create metadata with correct format', () => {
      const metadata = createExportMetadata('json');
      
      expect(metadata).toEqual({
        version: '1.0.0',
        exportDate: '2024-07-08T12:00:00.000Z',
        application: 'dnd-character-builder',
        exportFormat: 'json',
      });
    });

    it('should default to json format', () => {
      const metadata = createExportMetadata();
      expect(metadata.exportFormat).toBe('json');
    });
  });

  describe('formatFilename', () => {
    it('should format filename with date', () => {
      const filename = formatFilename('Aragorn Strider', 'json');
      expect(filename).toBe('aragorn-strider-2024-07-08.json');
    });

    it('should format filename without date', () => {
      const filename = formatFilename('Aragorn Strider', 'json', false);
      expect(filename).toBe('aragorn-strider.json');
    });

    it('should sanitize special characters', () => {
      const filename = formatFilename('Test@Character#123!', 'pdf');
      expect(filename).toBe('test-character-123-2024-07-08.pdf');
    });

    it('should handle empty names', () => {
      const filename = formatFilename('', 'json');
      expect(filename).toBe('2024-07-08.json');
    });
  });

  describe('formatBatchFilename', () => {
    it('should format batch filename with date', () => {
      const filename = formatBatchFilename('json');
      expect(filename).toBe('dnd-characters-2024-07-08.json');
    });
  });

  describe('exportCharacterToJSON', () => {
    it('should export single character with metadata', async () => {
      await exportCharacterToJSON(mockCharacter);

      expect(mockSaveAs).toHaveBeenCalledTimes(1);
      const [blob, filename] = mockSaveAs.mock.calls[0];
      
      expect(filename).toBe('aragorn-2024-07-08.json');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json;charset=utf-8');

      // Check blob content
      const text = await blob.text();
      const data = JSON.parse(text);
      
      expect(data).toHaveProperty('metadata');
      expect(data).toHaveProperty('character');
      expect(data.character.name).toBe('Aragorn');
      expect(data.metadata.version).toBe('1.0.0');
      expect(data.metadata.exportFormat).toBe('json');
    });
  });

  describe('exportCharactersToJSON', () => {
    it('should export single character when array has one item', async () => {
      await exportCharactersToJSON([mockCharacter]);

      expect(mockSaveAs).toHaveBeenCalledTimes(1);
      const [, filename] = mockSaveAs.mock.calls[0];
      expect(filename).toBe('aragorn-2024-07-08.json');
    });

    it('should export batch when array has multiple items', async () => {
      const character2 = { ...mockCharacter, id: '456', name: 'Legolas' };
      await exportCharactersToJSON([mockCharacter, character2]);

      expect(mockSaveAs).toHaveBeenCalledTimes(1);
      const [blob, filename] = mockSaveAs.mock.calls[0];
      
      expect(filename).toBe('dnd-characters-2024-07-08.json');
      
      const text = await blob.text();
      const data = JSON.parse(text);
      
      expect(data).toHaveProperty('metadata');
      expect(data).toHaveProperty('characters');
      expect(data.characters).toHaveLength(2);
      expect(data.characters[0].name).toBe('Aragorn');
      expect(data.characters[1].name).toBe('Legolas');
    });

    it('should throw error for empty array', async () => {
      await expect(exportCharactersToJSON([])).rejects.toThrow('No characters to export');
    });
  });

  describe('Type Guards', () => {
    const singleExport = {
      metadata: createExportMetadata(),
      character: mockCharacter,
    };

    const batchExport = {
      metadata: createExportMetadata(),
      characters: [mockCharacter],
    };

    describe('isCharacterExport', () => {
      it('should return true for valid single export', () => {
        expect(isCharacterExport(singleExport)).toBe(true);
      });

      it('should return false for batch export', () => {
        expect(isCharacterExport(batchExport)).toBe(false);
      });

      it('should return false for invalid data', () => {
        expect(isCharacterExport(null)).toBe(false);
        expect(isCharacterExport({})).toBe(false);
        expect(isCharacterExport({ metadata: {} })).toBe(false);
        expect(isCharacterExport({ character: {} })).toBe(false);
      });
    });

    describe('isBatchExport', () => {
      it('should return true for valid batch export', () => {
        expect(isBatchExport(batchExport)).toBe(true);
      });

      it('should return false for single export', () => {
        expect(isBatchExport(singleExport)).toBe(false);
      });

      it('should return false for invalid data', () => {
        expect(isBatchExport(null)).toBe(false);
        expect(isBatchExport({})).toBe(false);
        expect(isBatchExport({ metadata: {} })).toBe(false);
        expect(isBatchExport({ characters: {} })).toBe(false);
        expect(isBatchExport({ metadata: {}, characters: 'not-array' })).toBe(false);
      });
    });
  });

  describe('Version Utilities', () => {
    describe('getExportVersion', () => {
      it('should return version from metadata', () => {
        const data = {
          metadata: { version: '2.1.0' },
          character: mockCharacter,
        };
        expect(getExportVersion(data as CharacterExport)).toBe('2.1.0');
      });

      it('should return 0.0.0 for missing version', () => {
        const data = {
          metadata: {},
          character: mockCharacter,
        };
        expect(getExportVersion(data as CharacterExport)).toBe('0.0.0');
      });

      it('should return 0.0.0 for missing metadata', () => {
        const data = {
          character: mockCharacter,
        };
        expect(getExportVersion(data as CharacterExport)).toBe('0.0.0');
      });
    });

    describe('isCompatibleVersion', () => {
      it('should return true for same major version', () => {
        expect(isCompatibleVersion('1.0.0')).toBe(true);
        expect(isCompatibleVersion('1.5.3')).toBe(true);
        expect(isCompatibleVersion('1.99.99')).toBe(true);
      });

      it('should return false for different major version', () => {
        expect(isCompatibleVersion('2.0.0')).toBe(false);
        expect(isCompatibleVersion('0.9.0')).toBe(false);
      });
    });
  });
});