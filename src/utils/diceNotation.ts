export interface DiceExpression {
  count: number;
  sides: number;
  modifier?: number;
  keep?: {
    type: 'highest' | 'lowest';
    count: number;
  };
}

export interface ParsedDiceNotation {
  expressions: DiceExpression[];
  modifier: number;
}

export function parseDiceNotation(notation: string): ParsedDiceNotation {
  const cleanNotation = notation.replace(/\s/g, '').toLowerCase();
  
  if (!cleanNotation) {
    throw new Error('No valid dice expressions or modifiers found');
  }
  
  const expressions: DiceExpression[] = [];
  let totalModifier = 0;
  
  // Split by + or - while keeping the operator
  const parts = cleanNotation.split(/(?=[+-])/);
  
  for (const part of parts) {
    if (!part) continue;
    // Check if it's a plain number (modifier)
    const plainNumber = part.match(/^([+-]?\d+)$/);
    if (plainNumber) {
      totalModifier += parseInt(plainNumber[1], 10);
      continue;
    }
    
    // Parse dice expression with optional keep notation
    const diceMatch = part.match(/^([+-]?)(\d*)d(\d+)(?:k([hl]?)(\d+))?$/);
    if (!diceMatch) {
      throw new Error(`Invalid dice notation: ${part}`);
    }
    
    const [, sign, countStr, sidesStr, keepType, keepCountStr] = diceMatch;
    const baseCount = parseInt(countStr || '1', 10);
    const sides = parseInt(sidesStr, 10);
    const count = sign === '-' ? -baseCount : baseCount;
    
    if (baseCount < 1 || baseCount > 100) {
      throw new Error(`Invalid dice count: ${baseCount}. Must be between 1 and 100.`);
    }
    
    if (sides < 2 || sides > 100) {
      throw new Error(`Invalid dice sides: ${sides}. Must be between 2 and 100.`);
    }
    
    const expression: DiceExpression = {
      count,
      sides
    };
    
    if (keepType && keepCountStr) {
      const keepCount = parseInt(keepCountStr, 10);
      if (keepCount < 1 || keepCount > baseCount) {
        throw new Error(`Invalid keep count: ${keepCount}. Must be between 1 and ${baseCount}.`);
      }
      
      expression.keep = {
        type: keepType === 'h' ? 'highest' : 'lowest',
        count: keepCount
      };
    }
    
    expressions.push(expression);
  }
  
  if (expressions.length === 0 && totalModifier === 0) {
    throw new Error('No valid dice expressions or modifiers found');
  }
  
  return {
    expressions,
    modifier: totalModifier
  };
}

export function formatDiceExpression(expr: DiceExpression): string {
  const sign = expr.count < 0 ? '-' : '';
  const count = Math.abs(expr.count);
  const base = `${sign}${count === 1 ? '' : count}d${expr.sides}`;
  
  if (expr.keep) {
    const keepType = expr.keep.type === 'highest' ? 'h' : 'l';
    return `${base}k${keepType}${expr.keep.count}`;
  }
  
  return base;
}

export function formatParsedNotation(parsed: ParsedDiceNotation): string {
  const parts: string[] = [];
  
  for (const expr of parsed.expressions) {
    const formatted = formatDiceExpression(expr);
    if (parts.length === 0 || formatted.startsWith('-')) {
      parts.push(formatted);
    } else {
      parts.push(`+${formatted}`);
    }
  }
  
  if (parsed.modifier !== 0) {
    if (parsed.modifier > 0) {
      parts.push(`+${parsed.modifier}`);
    } else {
      parts.push(parsed.modifier.toString());
    }
  }
  
  return parts.join('');
}

// Common D&D dice notation shortcuts
export const DICE_SHORTCUTS = {
  advantage: '2d20kh1',
  disadvantage: '2d20kl1',
  d20: '1d20',
  d12: '1d12',
  d10: '1d10',
  d8: '1d8',
  d6: '1d6',
  d4: '1d4',
  d100: '1d100',
  percentile: '1d100',
  abilityScores: '4d6kh3'
} as const;

export type DiceShortcut = keyof typeof DICE_SHORTCUTS;