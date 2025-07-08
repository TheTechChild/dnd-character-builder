import { describe, it, expect } from '@jest/globals';
import { validateCharacterName, validateAbilityScore, validateLevel, validateCharacter } from './validation';
import { createEmptyCharacter } from './character';

describe('Validation Utils', () => {
  describe('validateCharacterName', () => {
    it('should accept valid names', () => {
      expect(validateCharacterName('Gandalf')).toBeNull();
      expect(validateCharacterName('Jean-Luc Picard')).toBeNull();
      expect(validateCharacterName("D'Artagnan")).toBeNull();
      expect(validateCharacterName('Bilbo Baggins')).toBeNull();
    });

    it('should reject empty names', () => {
      expect(validateCharacterName('')).toEqual({
        field: 'name',
        message: 'Character name is required'
      });
      expect(validateCharacterName('   ')).toEqual({
        field: 'name',
        message: 'Character name is required'
      });
    });

    it('should reject names that are too short', () => {
      expect(validateCharacterName('A')).toEqual({
        field: 'name',
        message: 'Character name must be at least 2 characters long'
      });
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(51);
      expect(validateCharacterName(longName)).toEqual({
        field: 'name',
        message: 'Character name must be no more than 50 characters'
      });
    });

    it('should reject names with invalid characters', () => {
      expect(validateCharacterName('Gandalf123')).toEqual({
        field: 'name',
        message: 'Character name can only contain letters, spaces, hyphens, and apostrophes'
      });
      expect(validateCharacterName('Bilbo@Baggins')).toEqual({
        field: 'name',
        message: 'Character name can only contain letters, spaces, hyphens, and apostrophes'
      });
    });
  });

  describe('validateAbilityScore', () => {
    it('should accept valid ability scores', () => {
      expect(validateAbilityScore(10, 'STR')).toBeNull();
      expect(validateAbilityScore(1, 'DEX')).toBeNull();
      expect(validateAbilityScore(30, 'CON')).toBeNull();
    });

    it('should reject scores below 1', () => {
      expect(validateAbilityScore(0, 'STR')).toEqual({
        field: 'STR',
        message: 'STR score must be at least 1'
      });
      expect(validateAbilityScore(-5, 'DEX')).toEqual({
        field: 'DEX',
        message: 'DEX score must be at least 1'
      });
    });

    it('should reject scores above 30', () => {
      expect(validateAbilityScore(31, 'CON')).toEqual({
        field: 'CON',
        message: 'CON score must be no more than 30'
      });
      expect(validateAbilityScore(40, 'INT')).toEqual({
        field: 'INT',
        message: 'INT score must be no more than 30'
      });
    });
  });

  describe('validateLevel', () => {
    it('should accept valid levels', () => {
      expect(validateLevel(1)).toBeNull();
      expect(validateLevel(10)).toBeNull();
      expect(validateLevel(20)).toBeNull();
    });

    it('should reject levels below 1', () => {
      expect(validateLevel(0)).toEqual({
        field: 'level',
        message: 'Level must be at least 1'
      });
    });

    it('should reject levels above 20', () => {
      expect(validateLevel(21)).toEqual({
        field: 'level',
        message: 'Level must be no more than 20'
      });
    });
  });

  describe('validateCharacter', () => {
    it('should return no errors for a valid character', () => {
      const character = createEmptyCharacter();
      character.name = 'Aragorn';
      const errors = validateCharacter(character);
      expect(errors).toHaveLength(0);
    });

    it('should return multiple errors for invalid character', () => {
      const character = createEmptyCharacter();
      character.name = '';
      character.level = 25;
      character.abilityScores.str = 0;
      character.abilityScores.con = 35;
      
      const errors = validateCharacter(character);
      expect(errors).toHaveLength(4);
      expect(errors.map(e => e.field)).toContain('name');
      expect(errors.map(e => e.field)).toContain('level');
      expect(errors.map(e => e.field)).toContain('STR');
      expect(errors.map(e => e.field)).toContain('CON');
    });
  });
});