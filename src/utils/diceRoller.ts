import { DiceExpression, parseDiceNotation } from './diceNotation';

export interface DiceRollResult {
  id: string;
  notation: string;
  label?: string;
  rolls: DiceExpressionResult[];
  modifier: number;
  total: number;
  critical?: 'hit' | 'miss';
  advantage?: boolean;
  disadvantage?: boolean;
  timestamp: Date;
}

export interface DiceExpressionResult {
  expression: DiceExpression;
  rolls: number[];
  keptRolls: number[];
  droppedRolls: number[];
  subtotal: number;
}

// Cryptographically secure random number generator
function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValue = Math.pow(256, bytesNeeded);
  const threshold = maxValue - (maxValue % range);
  
  let randomValue: number;
  do {
    const randomBytes = new Uint8Array(bytesNeeded);
    crypto.getRandomValues(randomBytes);
    randomValue = randomBytes.reduce((acc, byte, i) => acc + byte * Math.pow(256, i), 0);
  } while (randomValue >= threshold);
  
  return min + (randomValue % range);
}

function rollDice(sides: number): number {
  return getRandomInt(1, sides);
}

function rollExpression(expression: DiceExpression): DiceExpressionResult {
  const count = Math.abs(expression.count);
  const rolls: number[] = [];
  
  // Roll all dice
  for (let i = 0; i < count; i++) {
    rolls.push(rollDice(expression.sides));
  }
  
  let keptRolls = [...rolls];
  let droppedRolls: number[] = [];
  
  // Apply keep rules if present
  if (expression.keep) {
    // Sort for keep operations
    const sorted = [...rolls].sort((a, b) => b - a); // High to low
    
    if (expression.keep.type === 'highest') {
      keptRolls = sorted.slice(0, expression.keep.count);
      droppedRolls = sorted.slice(expression.keep.count);
    } else {
      keptRolls = sorted.slice(-expression.keep.count);
      droppedRolls = sorted.slice(0, -expression.keep.count);
    }
  }
  
  // Calculate subtotal
  const subtotal = keptRolls.reduce((sum, roll) => sum + roll, 0) * (expression.count < 0 ? -1 : 1);
  
  return {
    expression,
    rolls,
    keptRolls,
    droppedRolls,
    subtotal
  };
}

export function rollDiceNotation(notation: string, label?: string): DiceRollResult {
  const parsed = parseDiceNotation(notation);
  const rolls: DiceExpressionResult[] = [];
  
  // Roll each expression
  for (const expression of parsed.expressions) {
    rolls.push(rollExpression(expression));
  }
  
  // Calculate total
  const rollsTotal = rolls.reduce((sum, result) => sum + result.subtotal, 0);
  const total = rollsTotal + parsed.modifier;
  
  // Check for criticals (only on single d20 rolls without modifiers)
  let critical: 'hit' | 'miss' | undefined;
  let advantage: boolean | undefined;
  let disadvantage: boolean | undefined;
  
  if (parsed.expressions.length === 1 && parsed.expressions[0].sides === 20) {
    const expr = parsed.expressions[0];
    
    // Check for advantage/disadvantage
    if (expr.count === 2 && expr.keep) {
      if (expr.keep.type === 'highest' && expr.keep.count === 1) {
        advantage = true;
      } else if (expr.keep.type === 'lowest' && expr.keep.count === 1) {
        disadvantage = true;
      }
    }
    
    // Check for critical on the kept roll
    if (rolls[0].keptRolls.length === 1) {
      const roll = rolls[0].keptRolls[0];
      if (roll === 20) critical = 'hit';
      else if (roll === 1) critical = 'miss';
    }
  }
  
  return {
    id: crypto.randomUUID(),
    notation,
    label,
    rolls,
    modifier: parsed.modifier,
    total,
    critical,
    advantage,
    disadvantage,
    timestamp: new Date()
  };
}

export function formatRollResult(result: DiceRollResult): string {
  const parts: string[] = [];
  
  // Format each expression result
  for (const exprResult of result.rolls) {
    const expr = exprResult.expression;
    const sign = expr.count < 0 ? '-' : parts.length > 0 ? '+' : '';
    const count = Math.abs(expr.count);
    
    // Format rolls with kept/dropped indication
    const rollsStr = exprResult.rolls.map(roll => {
      const isKept = exprResult.keptRolls.includes(roll);
      return isKept ? roll.toString() : `~~${roll}~~`;
    }).join(', ');
    
    parts.push(`${sign}${count === 1 ? '' : count}d${expr.sides}[${rollsStr}]`);
  }
  
  // Add modifier
  if (result.modifier !== 0) {
    parts.push(result.modifier > 0 ? `+${result.modifier}` : result.modifier.toString());
  }
  
  // Add total
  parts.push(`= ${result.total}`);
  
  return parts.join(' ');
}

export function formatShortResult(result: DiceRollResult): string {
  if (result.critical === 'hit') {
    return `Natural 20! = ${result.total}`;
  } else if (result.critical === 'miss') {
    return `Natural 1! = ${result.total}`;
  }
  
  return `${result.notation} = ${result.total}`;
}

// Roll statistics tracking
export interface RollStatistics {
  totalRolls: number;
  average: number;
  min: number;
  max: number;
  criticalHits: number;
  criticalMisses: number;
  distribution: Record<number, number>;
}

export function calculateRollStatistics(results: DiceRollResult[]): RollStatistics {
  if (results.length === 0) {
    return {
      totalRolls: 0,
      average: 0,
      min: 0,
      max: 0,
      criticalHits: 0,
      criticalMisses: 0,
      distribution: {}
    };
  }
  
  const totals = results.map(r => r.total);
  const distribution: Record<number, number> = {};
  
  for (const total of totals) {
    distribution[total] = (distribution[total] || 0) + 1;
  }
  
  return {
    totalRolls: results.length,
    average: totals.reduce((sum, t) => sum + t, 0) / totals.length,
    min: Math.min(...totals),
    max: Math.max(...totals),
    criticalHits: results.filter(r => r.critical === 'hit').length,
    criticalMisses: results.filter(r => r.critical === 'miss').length,
    distribution
  };
}

// Common roll helpers
export function rollAbilityCheck(abilityModifier: number, proficiencyBonus?: number, expertise?: boolean): DiceRollResult {
  let modifier = abilityModifier;
  if (proficiencyBonus !== undefined) {
    modifier += expertise ? proficiencyBonus * 2 : proficiencyBonus;
  }
  
  const notation = modifier >= 0 ? `1d20+${modifier}` : `1d20${modifier}`;
  return rollDiceNotation(notation, 'Ability Check');
}

export function rollWithAdvantage(modifier: number = 0): DiceRollResult {
  const notation = modifier !== 0 
    ? `2d20kh1${modifier >= 0 ? '+' : ''}${modifier}`
    : '2d20kh1';
  return rollDiceNotation(notation, 'Advantage');
}

export function rollWithDisadvantage(modifier: number = 0): DiceRollResult {
  const notation = modifier !== 0
    ? `2d20kl1${modifier >= 0 ? '+' : ''}${modifier}`
    : '2d20kl1';
  return rollDiceNotation(notation, 'Disadvantage');
}

export function rollInitiative(dexModifier: number): DiceRollResult {
  const notation = dexModifier >= 0 ? `1d20+${dexModifier}` : `1d20${dexModifier}`;
  return rollDiceNotation(notation, 'Initiative');
}

export function rollDeathSave(): DiceRollResult {
  return rollDiceNotation('1d20', 'Death Save');
}

export function rollHitDice(hitDie: number, conModifier: number): DiceRollResult {
  const notation = conModifier >= 0 ? `1d${hitDie}+${conModifier}` : `1d${hitDie}${conModifier}`;
  return rollDiceNotation(notation, 'Hit Dice');
}

export function rollAbilityScores(): DiceRollResult[] {
  const results: DiceRollResult[] = [];
  for (let i = 0; i < 6; i++) {
    results.push(rollDiceNotation('4d6kh3', `Ability Score ${i + 1}`));
  }
  return results;
}