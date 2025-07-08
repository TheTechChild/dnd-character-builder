import { describe, it, expect } from '@jest/globals';
import { createEmptyCharacter } from './character';

describe('Character Utils', () => {
  describe('createEmptyCharacter', () => {
    it('should create a character with all required fields', () => {
      const character = createEmptyCharacter();
      
      // Check metadata
      expect(character.id).toBeTruthy();
      expect(character.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
      
      // Check basic info
      expect(character.name).toBe('');
      expect(character.level).toBe(1);
      expect(character.race).toBe('');
      expect(character.class).toBe('');
      expect(character.background).toBe('');
      expect(character.alignment).toBe('');
      
      // Check ability scores
      expect(character.abilityScores).toEqual({
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      });
      
      // Check proficiency bonus
      expect(character.proficiencyBonus).toBe(2);
      
      // Check arrays are initialized
      expect(character.skills).toEqual([]);
      expect(character.languages).toEqual([]);
      expect(character.traits).toEqual([]);
      expect(character.equipment).toEqual([]);
      
      // Check combat stats
      expect(character.armorClass).toBe(10);
      expect(character.speed).toBe(30);
      expect(character.hitPoints).toEqual({
        current: 0,
        max: 0,
        temporary: 0,
      });
    });
    
    it('should generate unique IDs for each character', () => {
      const char1 = createEmptyCharacter();
      const char2 = createEmptyCharacter();
      
      expect(char1.id).not.toBe(char2.id);
    });
  });
});