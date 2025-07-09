import {
  rollDiceNotation,
  formatRollResult,
  formatShortResult,
  calculateRollStatistics,
  rollAbilityCheck,
  rollWithAdvantage,
  rollWithDisadvantage,
  rollInitiative,
  rollDeathSave,
  rollHitDice,
  rollAbilityScores,
  DiceRollResult
} from './diceRoller';

// Mock crypto.getRandomValues for deterministic tests
const mockGetRandomValues = jest.fn();
const originalRandomUUID = global.crypto.randomUUID;

beforeAll(() => {
  global.crypto.getRandomValues = mockGetRandomValues;
  global.crypto.randomUUID = jest.fn(() => 'test-uuid-123' as `${string}-${string}-${string}-${string}-${string}`);
});

afterAll(() => {
  global.crypto.randomUUID = originalRandomUUID;
});

describe('diceRoller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('rollDiceNotation', () => {
    it('rolls basic dice notation', () => {
      // Mock to always roll max value
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = 19; // Will result in 20 for d20
      });
      
      const result = rollDiceNotation('1d20');
      
      expect(result.id).toBe('test-uuid-123');
      expect(result.notation).toBe('1d20');
      expect(result.rolls).toHaveLength(1);
      expect(result.rolls[0].rolls).toEqual([20]);
      expect(result.rolls[0].keptRolls).toEqual([20]);
      expect(result.rolls[0].droppedRolls).toEqual([]);
      expect(result.rolls[0].subtotal).toBe(20);
      expect(result.modifier).toBe(0);
      expect(result.total).toBe(20);
      expect(result.critical).toBe('hit');
      expect(result.timestamp).toBeInstanceOf(Date);
    });
    
    it('rolls dice with modifier', () => {
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = 9; // Will result in 10 for d20
      });
      
      const result = rollDiceNotation('1d20+5');
      
      expect(result.rolls[0].rolls).toEqual([10]);
      expect(result.modifier).toBe(5);
      expect(result.total).toBe(15);
      expect(result.critical).toBeUndefined();
    });
    
    it('rolls multiple dice', () => {
      let rollCount = 0;
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = rollCount++ * 2; // Will result in 1, 3, 5 for 3d6
      });
      
      const result = rollDiceNotation('3d6');
      
      expect(result.rolls[0].rolls).toHaveLength(3);
      expect(result.rolls[0].rolls).toEqual([1, 3, 5]);
      expect(result.rolls[0].keptRolls).toEqual([1, 3, 5]);
      expect(result.rolls[0].subtotal).toBe(9);
      expect(result.total).toBe(9);
    });
    
    it('handles keep highest notation', () => {
      let rollCount = 0;
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = rollCount++ * 2; // Will result in 1, 3, 5, 1 for 4d6
      });
      
      const result = rollDiceNotation('4d6kh3');
      
      expect(result.rolls[0].rolls).toHaveLength(4);
      expect(result.rolls[0].keptRolls).toHaveLength(3);
      expect(result.rolls[0].droppedRolls).toHaveLength(1);
      // Verify that kept rolls are the highest 3
      const allRolls = [...result.rolls[0].rolls].sort((a, b) => b - a);
      const expectedKept = allRolls.slice(0, 3);
      expect(result.rolls[0].keptRolls.sort((a, b) => b - a)).toEqual(expectedKept);
    });
    
    it('handles keep lowest notation', () => {
      let rollCount = 0;
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = rollCount++ * 5; // Will result in different values for 2d20
      });
      
      const result = rollDiceNotation('2d20kl1');
      
      expect(result.rolls[0].rolls).toHaveLength(2);
      expect(result.rolls[0].keptRolls).toHaveLength(1);
      expect(result.rolls[0].droppedRolls).toHaveLength(1);
      expect(result.disadvantage).toBe(true);
    });
    
    it('detects advantage rolls', () => {
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = 10;
      });
      
      const result = rollDiceNotation('2d20kh1');
      
      expect(result.advantage).toBe(true);
      expect(result.disadvantage).toBeUndefined();
    });
    
    it('detects critical miss', () => {
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = 0; // Will result in 1 for d20
      });
      
      const result = rollDiceNotation('1d20');
      
      expect(result.rolls[0].rolls).toEqual([1]);
      expect(result.critical).toBe('miss');
    });
    
    it('handles negative dice', () => {
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = 4; // Will result in 5
      });
      
      const result = rollDiceNotation('1d20-1d6');
      
      expect(result.rolls).toHaveLength(2);
      expect(result.rolls[1].subtotal).toBe(-5);
    });
    
    it('includes label when provided', () => {
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = 10;
      });
      
      const result = rollDiceNotation('1d20', 'Athletics Check');
      
      expect(result.label).toBe('Athletics Check');
    });
  });
  
  describe('formatRollResult', () => {
    it('formats simple roll', () => {
      const result: DiceRollResult = {
        id: 'test',
        notation: '1d20',
        rolls: [{
          expression: { count: 1, sides: 20 },
          rolls: [15],
          keptRolls: [15],
          droppedRolls: [],
          subtotal: 15
        }],
        modifier: 0,
        total: 15,
        timestamp: new Date()
      };
      
      expect(formatRollResult(result)).toBe('d20[15] = 15');
    });
    
    it('formats roll with modifier', () => {
      const result: DiceRollResult = {
        id: 'test',
        notation: '1d20+5',
        rolls: [{
          expression: { count: 1, sides: 20 },
          rolls: [10],
          keptRolls: [10],
          droppedRolls: [],
          subtotal: 10
        }],
        modifier: 5,
        total: 15,
        timestamp: new Date()
      };
      
      expect(formatRollResult(result)).toBe('d20[10] +5 = 15');
    });
    
    it('formats roll with dropped dice', () => {
      const result: DiceRollResult = {
        id: 'test',
        notation: '4d6kh3',
        rolls: [{
          expression: { count: 4, sides: 6, keep: { type: 'highest', count: 3 } },
          rolls: [6, 5, 3, 1],
          keptRolls: [6, 5, 3],
          droppedRolls: [1],
          subtotal: 14
        }],
        modifier: 0,
        total: 14,
        timestamp: new Date()
      };
      
      expect(formatRollResult(result)).toBe('4d6[6, 5, 3, ~~1~~] = 14');
    });
  });
  
  describe('formatShortResult', () => {
    it('formats critical hit', () => {
      const result: DiceRollResult = {
        id: 'test',
        notation: '1d20+5',
        rolls: [],
        modifier: 5,
        total: 25,
        critical: 'hit',
        timestamp: new Date()
      };
      
      expect(formatShortResult(result)).toBe('Natural 20! = 25');
    });
    
    it('formats critical miss', () => {
      const result: DiceRollResult = {
        id: 'test',
        notation: '1d20+5',
        rolls: [],
        modifier: 5,
        total: 6,
        critical: 'miss',
        timestamp: new Date()
      };
      
      expect(formatShortResult(result)).toBe('Natural 1! = 6');
    });
    
    it('formats normal roll', () => {
      const result: DiceRollResult = {
        id: 'test',
        notation: '1d20+5',
        rolls: [],
        modifier: 5,
        total: 15,
        timestamp: new Date()
      };
      
      expect(formatShortResult(result)).toBe('1d20+5 = 15');
    });
  });
  
  describe('calculateRollStatistics', () => {
    it('calculates statistics for multiple rolls', () => {
      const results: DiceRollResult[] = [
        { id: '1', notation: '1d20', rolls: [], modifier: 0, total: 20, critical: 'hit', timestamp: new Date() },
        { id: '2', notation: '1d20', rolls: [], modifier: 0, total: 1, critical: 'miss', timestamp: new Date() },
        { id: '3', notation: '1d20', rolls: [], modifier: 0, total: 10, timestamp: new Date() },
        { id: '4', notation: '1d20', rolls: [], modifier: 0, total: 15, timestamp: new Date() },
        { id: '5', notation: '1d20', rolls: [], modifier: 0, total: 10, timestamp: new Date() }
      ];
      
      const stats = calculateRollStatistics(results);
      
      expect(stats.totalRolls).toBe(5);
      expect(stats.average).toBe(11.2);
      expect(stats.min).toBe(1);
      expect(stats.max).toBe(20);
      expect(stats.criticalHits).toBe(1);
      expect(stats.criticalMisses).toBe(1);
      expect(stats.distribution).toEqual({
        '1': 1,
        '10': 2,
        '15': 1,
        '20': 1
      });
    });
    
    it('handles empty results', () => {
      const stats = calculateRollStatistics([]);
      
      expect(stats.totalRolls).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
      expect(stats.criticalHits).toBe(0);
      expect(stats.criticalMisses).toBe(0);
      expect(stats.distribution).toEqual({});
    });
  });
  
  describe('helper functions', () => {
    beforeEach(() => {
      mockGetRandomValues.mockImplementation((arr: Uint8Array) => {
        arr[0] = 9; // Will result in 10 for d20
      });
    });
    
    it('rollAbilityCheck handles basic check', () => {
      const result = rollAbilityCheck(3);
      expect(result.notation).toBe('1d20+3');
      expect(result.label).toBe('Ability Check');
      expect(result.total).toBe(13);
    });
    
    it('rollAbilityCheck handles proficiency', () => {
      const result = rollAbilityCheck(2, 3);
      expect(result.notation).toBe('1d20+5');
      expect(result.total).toBe(15);
    });
    
    it('rollAbilityCheck handles expertise', () => {
      const result = rollAbilityCheck(2, 3, true);
      expect(result.notation).toBe('1d20+8');
      expect(result.total).toBe(18);
    });
    
    it('rollWithAdvantage', () => {
      const result = rollWithAdvantage(5);
      expect(result.notation).toBe('2d20kh1+5');
      expect(result.label).toBe('Advantage');
      expect(result.advantage).toBe(true);
    });
    
    it('rollWithDisadvantage', () => {
      const result = rollWithDisadvantage(-2);
      expect(result.notation).toBe('2d20kl1-2');
      expect(result.label).toBe('Disadvantage');
      expect(result.disadvantage).toBe(true);
    });
    
    it('rollInitiative', () => {
      const result = rollInitiative(2);
      expect(result.notation).toBe('1d20+2');
      expect(result.label).toBe('Initiative');
    });
    
    it('rollDeathSave', () => {
      const result = rollDeathSave();
      expect(result.notation).toBe('1d20');
      expect(result.label).toBe('Death Save');
    });
    
    it('rollHitDice', () => {
      const result = rollHitDice(10, 2);
      expect(result.notation).toBe('1d10+2');
      expect(result.label).toBe('Hit Dice');
    });
    
    it('rollAbilityScores returns 6 rolls', () => {
      const results = rollAbilityScores();
      expect(results).toHaveLength(6);
      results.forEach((result, index) => {
        expect(result.notation).toBe('4d6kh3');
        expect(result.label).toBe(`Ability Score ${index + 1}`);
      });
    });
  });
});