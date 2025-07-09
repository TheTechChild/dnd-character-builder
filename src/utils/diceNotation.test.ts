import { parseDiceNotation, formatDiceExpression, formatParsedNotation, DICE_SHORTCUTS } from './diceNotation';

describe('parseDiceNotation', () => {
  it('parses basic dice notation', () => {
    const result = parseDiceNotation('1d20');
    expect(result.expressions).toHaveLength(1);
    expect(result.expressions[0]).toEqual({
      count: 1,
      sides: 20
    });
    expect(result.modifier).toBe(0);
  });
  
  it('parses dice with count', () => {
    const result = parseDiceNotation('3d6');
    expect(result.expressions[0]).toEqual({
      count: 3,
      sides: 6
    });
  });
  
  it('parses dice with positive modifier', () => {
    const result = parseDiceNotation('1d20+5');
    expect(result.expressions[0]).toEqual({
      count: 1,
      sides: 20
    });
    expect(result.modifier).toBe(5);
  });
  
  it('parses dice with negative modifier', () => {
    const result = parseDiceNotation('2d8-2');
    expect(result.expressions[0]).toEqual({
      count: 2,
      sides: 8
    });
    expect(result.modifier).toBe(-2);
  });
  
  it('parses multiple dice expressions', () => {
    const result = parseDiceNotation('1d20+1d4+3');
    expect(result.expressions).toHaveLength(2);
    expect(result.expressions[0]).toEqual({
      count: 1,
      sides: 20
    });
    expect(result.expressions[1]).toEqual({
      count: 1,
      sides: 4
    });
    expect(result.modifier).toBe(3);
  });
  
  it('parses keep highest notation', () => {
    const result = parseDiceNotation('4d6kh3');
    expect(result.expressions[0]).toEqual({
      count: 4,
      sides: 6,
      keep: {
        type: 'highest',
        count: 3
      }
    });
  });
  
  it('parses keep lowest notation', () => {
    const result = parseDiceNotation('2d20kl1');
    expect(result.expressions[0]).toEqual({
      count: 2,
      sides: 20,
      keep: {
        type: 'lowest',
        count: 1
      }
    });
  });
  
  it('handles whitespace', () => {
    const result = parseDiceNotation(' 1 d 20 + 5 ');
    expect(result.expressions[0]).toEqual({
      count: 1,
      sides: 20
    });
    expect(result.modifier).toBe(5);
  });
  
  it('handles uppercase', () => {
    const result = parseDiceNotation('1D20+5');
    expect(result.expressions[0]).toEqual({
      count: 1,
      sides: 20
    });
    expect(result.modifier).toBe(5);
  });
  
  it('handles implicit count', () => {
    const result = parseDiceNotation('d20');
    expect(result.expressions[0]).toEqual({
      count: 1,
      sides: 20
    });
  });
  
  it('handles negative dice', () => {
    const result = parseDiceNotation('1d20-1d4');
    expect(result.expressions).toHaveLength(2);
    expect(result.expressions[0]).toEqual({
      count: 1,
      sides: 20
    });
    expect(result.expressions[1]).toEqual({
      count: -1,
      sides: 4
    });
  });
  
  it('throws error for invalid notation', () => {
    expect(() => parseDiceNotation('invalid')).toThrow('Invalid dice notation');
    expect(() => parseDiceNotation('1d')).toThrow('Invalid dice notation');
    expect(() => parseDiceNotation('d')).toThrow('Invalid dice notation');
  });
  
  it('throws error for invalid dice count', () => {
    expect(() => parseDiceNotation('0d20')).toThrow('Invalid dice count');
    expect(() => parseDiceNotation('101d20')).toThrow('Invalid dice count');
  });
  
  it('parses negative dice as negative modifier', () => {
    const result = parseDiceNotation('-5d20');
    expect(result.expressions[0].count).toBe(-5);
  });
  
  it('throws error for invalid dice sides', () => {
    expect(() => parseDiceNotation('1d1')).toThrow('Invalid dice sides');
    expect(() => parseDiceNotation('1d101')).toThrow('Invalid dice sides');
  });
  
  it('throws error for invalid keep count', () => {
    expect(() => parseDiceNotation('4d6kh5')).toThrow('Invalid keep count');
    expect(() => parseDiceNotation('2d20kl3')).toThrow('Invalid keep count');
    expect(() => parseDiceNotation('1d20kh0')).toThrow('Invalid keep count');
  });
  
  it('parses just a modifier', () => {
    const result = parseDiceNotation('+5');
    expect(result.expressions).toHaveLength(0);
    expect(result.modifier).toBe(5);
  });
  
  it('throws error for empty notation', () => {
    expect(() => parseDiceNotation('')).toThrow('No valid dice expressions');
    expect(() => parseDiceNotation('   ')).toThrow('No valid dice expressions');
  });
});

describe('formatDiceExpression', () => {
  it('formats basic dice expression', () => {
    expect(formatDiceExpression({ count: 1, sides: 20 })).toBe('d20');
    expect(formatDiceExpression({ count: 3, sides: 6 })).toBe('3d6');
  });
  
  it('formats negative dice expression', () => {
    expect(formatDiceExpression({ count: -2, sides: 8 })).toBe('-2d8');
  });
  
  it('formats dice with keep notation', () => {
    expect(formatDiceExpression({
      count: 4,
      sides: 6,
      keep: { type: 'highest', count: 3 }
    })).toBe('4d6kh3');
    
    expect(formatDiceExpression({
      count: 2,
      sides: 20,
      keep: { type: 'lowest', count: 1 }
    })).toBe('2d20kl1');
  });
});

describe('formatParsedNotation', () => {
  it('formats complete parsed notation', () => {
    const parsed = {
      expressions: [
        { count: 1, sides: 20 },
        { count: 1, sides: 4 }
      ],
      modifier: 3
    };
    expect(formatParsedNotation(parsed)).toBe('d20+d4+3');
  });
  
  it('formats notation with negative parts', () => {
    const parsed = {
      expressions: [
        { count: 1, sides: 20 },
        { count: -1, sides: 4 }
      ],
      modifier: -2
    };
    expect(formatParsedNotation(parsed)).toBe('d20-d4-2');
  });
  
  it('formats just a modifier', () => {
    const parsed = {
      expressions: [],
      modifier: 5
    };
    expect(formatParsedNotation(parsed)).toBe('+5');
  });
});

describe('DICE_SHORTCUTS', () => {
  it('has valid dice notations', () => {
    for (const notation of Object.values(DICE_SHORTCUTS)) {
      expect(() => parseDiceNotation(notation)).not.toThrow();
    }
  });
  
  it('has correct advantage notation', () => {
    const result = parseDiceNotation(DICE_SHORTCUTS.advantage);
    expect(result.expressions[0]).toEqual({
      count: 2,
      sides: 20,
      keep: { type: 'highest', count: 1 }
    });
  });
  
  it('has correct disadvantage notation', () => {
    const result = parseDiceNotation(DICE_SHORTCUTS.disadvantage);
    expect(result.expressions[0]).toEqual({
      count: 2,
      sides: 20,
      keep: { type: 'lowest', count: 1 }
    });
  });
  
  it('has correct ability score notation', () => {
    const result = parseDiceNotation(DICE_SHORTCUTS.abilityScores);
    expect(result.expressions[0]).toEqual({
      count: 4,
      sides: 6,
      keep: { type: 'highest', count: 3 }
    });
  });
});