import { describe, it, expect } from '@jest/globals';
import {
  getAbilityModifier,
  getProficiencyBonus,
  getSkillModifier,
  getPassivePerception,
  getSpellSaveDC,
  getSpellAttackBonus,
  SKILL_ABILITIES,
} from './calculations';
import { AbilityScores } from '@/types';

describe('D&D Calculations', () => {
  describe('getAbilityModifier', () => {
    it('should calculate correct modifiers', () => {
      expect(getAbilityModifier(1)).toBe(-5);
      expect(getAbilityModifier(10)).toBe(0);
      expect(getAbilityModifier(11)).toBe(0);
      expect(getAbilityModifier(12)).toBe(1);
      expect(getAbilityModifier(13)).toBe(1);
      expect(getAbilityModifier(20)).toBe(5);
      expect(getAbilityModifier(30)).toBe(10);
    });
  });

  describe('getProficiencyBonus', () => {
    it('should calculate correct proficiency bonuses', () => {
      expect(getProficiencyBonus(1)).toBe(2);
      expect(getProficiencyBonus(4)).toBe(2);
      expect(getProficiencyBonus(5)).toBe(3);
      expect(getProficiencyBonus(8)).toBe(3);
      expect(getProficiencyBonus(9)).toBe(4);
      expect(getProficiencyBonus(12)).toBe(4);
      expect(getProficiencyBonus(13)).toBe(5);
      expect(getProficiencyBonus(16)).toBe(5);
      expect(getProficiencyBonus(17)).toBe(6);
      expect(getProficiencyBonus(20)).toBe(6);
    });
  });

  describe('getSkillModifier', () => {
    const abilityScores: AbilityScores = {
      str: 16,
      dex: 14,
      con: 12,
      int: 10,
      wis: 13,
      cha: 8,
    };

    it('should calculate skill modifiers without proficiency', () => {
      expect(getSkillModifier('athletics', abilityScores, 'none', 2)).toBe(3);
      expect(getSkillModifier('acrobatics', abilityScores, 'none', 2)).toBe(2);
      expect(getSkillModifier('deception', abilityScores, 'none', 2)).toBe(-1);
    });

    it('should calculate skill modifiers with proficiency', () => {
      expect(getSkillModifier('athletics', abilityScores, 'proficient', 2)).toBe(5);
      expect(getSkillModifier('perception', abilityScores, 'proficient', 3)).toBe(4);
    });

    it('should calculate skill modifiers with expertise', () => {
      expect(getSkillModifier('stealth', abilityScores, 'expertise', 2)).toBe(6);
      expect(getSkillModifier('investigation', abilityScores, 'expertise', 3)).toBe(6);
    });
  });

  describe('getPassivePerception', () => {
    it('should calculate passive perception correctly', () => {
      expect(getPassivePerception(10, 'none', 2)).toBe(10);
      expect(getPassivePerception(14, 'none', 2)).toBe(12);
      expect(getPassivePerception(14, 'proficient', 2)).toBe(14);
      expect(getPassivePerception(14, 'expertise', 3)).toBe(18);
    });
  });

  describe('getSpellSaveDC', () => {
    const abilityScores: AbilityScores = {
      str: 10,
      dex: 10,
      con: 10,
      int: 16,
      wis: 14,
      cha: 18,
    };

    it('should calculate spell save DC correctly', () => {
      expect(getSpellSaveDC('int', abilityScores, 2)).toBe(13);
      expect(getSpellSaveDC('wis', abilityScores, 3)).toBe(14);
      expect(getSpellSaveDC('cha', abilityScores, 4)).toBe(16);
    });
  });

  describe('getSpellAttackBonus', () => {
    const abilityScores: AbilityScores = {
      str: 10,
      dex: 10,
      con: 10,
      int: 16,
      wis: 14,
      cha: 18,
    };

    it('should calculate spell attack bonus correctly', () => {
      expect(getSpellAttackBonus('int', abilityScores, 2)).toBe(5);
      expect(getSpellAttackBonus('wis', abilityScores, 3)).toBe(6);
      expect(getSpellAttackBonus('cha', abilityScores, 4)).toBe(8);
    });
  });
});