import { describe, it, expect } from '@jest/globals';
import { validateCharacter } from './validation';
import { createEmptyCharacter } from './character';

describe('Character Validation', () => {
  it('should validate a valid character', () => {
    const character = createEmptyCharacter();
    const result = validateCharacter(character);
    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject character with missing required fields', () => {
    const invalidCharacter = {
      name: 'Test',
      level: 1,
      // Missing many required fields
    };
    const result = validateCharacter(invalidCharacter);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should reject character with invalid ability scores', () => {
    const character = createEmptyCharacter();
    character.abilityScores.str = 35; // Above max of 30
    const result = validateCharacter(character);
    expect(result.success).toBe(false);
    expect(result.error).toContain('abilityScores.str');
  });

  it('should reject character with invalid level', () => {
    const character = createEmptyCharacter();
    character.level = 25; // Above max of 20
    const result = validateCharacter(character);
    expect(result.success).toBe(false);
    expect(result.error).toContain('level');
  });

  it('should reject character with invalid death saves', () => {
    const character = createEmptyCharacter();
    character.deathSaves.successes = 5; // Above max of 3
    const result = validateCharacter(character);
    expect(result.success).toBe(false);
    expect(result.error).toContain('deathSaves.successes');
  });

  it('should accept character with optional fields missing', () => {
    const character = createEmptyCharacter();
    // These fields are optional
    delete character.subrace;
    delete character.subclass;
    delete character.spellcastingAbility;
    delete character.spells;
    
    const result = validateCharacter(character);
    expect(result.success).toBe(true);
  });

  it('should validate arrays correctly', () => {
    const character = createEmptyCharacter();
    character.languages = ['Common', 'Elvish', 'Dwarvish'];
    character.skills = [
      { skill: 'perception', proficiency: 'proficient' },
      { skill: 'stealth', proficiency: 'expertise' },
    ];
    
    const result = validateCharacter(character);
    expect(result.success).toBe(true);
  });
});