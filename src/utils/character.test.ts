import { describe, it, expect } from '@jest/globals';
import { createEmptyCharacter } from './character';
import { SCHEMA_VERSION } from '@/types/schema';

describe('Character Utils', () => {
  describe('createEmptyCharacter', () => {
    it('should create a character with all required fields', () => {
      const character = createEmptyCharacter();
      
      // Check metadata
      expect(character.id).toBeTruthy();
      expect(character.version).toBe(SCHEMA_VERSION);
      expect(character.createdAt).toBeTruthy();
      expect(character.updatedAt).toBeTruthy();
      
      // Check basic info
      expect(character.name).toBe('');
      expect(character.level).toBe(1);
      expect(character.race).toBe('');
      expect(character.class).toBe('');
      
      // Check ability scores
      expect(character.abilityScores).toEqual({
        str: 10,
        dex: 10,
        con: 10,
        int: 10,
        wis: 10,
        cha: 10,
      });
      
      // Check arrays are initialized
      expect(character.savingThrows).toEqual([]);
      expect(character.skills).toEqual([]);
      expect(character.languages).toEqual([]);
      expect(character.attacks).toEqual([]);
      expect(character.features).toEqual([]);
      expect(character.equipment).toEqual([]);
      
      // Check combat stats
      expect(character.armorClass).toBe(10);
      expect(character.speed).toBe(30);
      expect(character.maxHitPoints).toBe(0);
      expect(character.currentHitPoints).toBe(0);
      
      // Check currency
      expect(character.currency).toEqual({
        cp: 0,
        sp: 0,
        gp: 0,
        ep: 0,
        pp: 0,
      });
    });
    
    it('should generate unique IDs for each character', () => {
      const char1 = createEmptyCharacter();
      const char2 = createEmptyCharacter();
      
      expect(char1.id).not.toBe(char2.id);
    });
  });
});