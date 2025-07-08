import { describe, it, expect } from '@jest/globals';
import { CreateCharacterInputSchema } from '@/schemas/characterSchemaV2';
import { 
  getAbilityModifier, 
  getProficiencyBonus, 
  calculateAllAbilityModifiers,
  calculateInitiative,
  calculateMaxHitPoints,
  getExperienceForLevel,
  getLevelFromExperience
} from '@/utils/calculations';

describe('Character Schema', () => {
  it('should validate a minimal character input', () => {
    const input = {
      name: 'Gandalf the Grey',
      race: 'Human',
      class: 'Wizard',
      background: 'Sage',
      alignment: 'Neutral Good',
      abilities: {
        strength: 10,
        dexterity: 14,
        constitution: 13,
        intelligence: 18,
        wisdom: 15,
        charisma: 12,
      },
    };

    const result = CreateCharacterInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should reject invalid ability scores', () => {
    const input = {
      name: 'Invalid Character',
      race: 'Human',
      class: 'Fighter',
      background: 'Soldier',
      alignment: 'Lawful Good',
      abilities: {
        strength: 35, // Too high!
        dexterity: 14,
        constitution: 13,
        intelligence: 10,
        wisdom: 10,
        charisma: 8,
      },
    };

    const result = CreateCharacterInputSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toContain('30');
    }
  });

  it('should reject invalid character names', () => {
    const invalidNames = [
      '', // Empty
      'A', // Too short
      'This is a really long name that exceeds fifty characters limit', // Too long
      'Name@123', // Invalid characters
      'Name#Special', // Invalid characters
    ];

    for (const name of invalidNames) {
      const input = {
        name,
        race: 'Elf',
        class: 'Ranger',
        background: 'Outlander',
        alignment: 'Chaotic Good',
        abilities: {
          strength: 13,
          dexterity: 16,
          constitution: 14,
          intelligence: 12,
          wisdom: 15,
          charisma: 10,
        },
      };

      const result = CreateCharacterInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    }
  });

  it('should accept valid character names', () => {
    const validNames = [
      'Aragorn',
      'Jean-Luc Picard',
      "D'Artagnan",
      'Mary Jane Watson',
      'Drizzt Do\'Urden',
    ];

    for (const name of validNames) {
      const input = {
        name,
        race: 'Half-Elf',
        class: 'Bard',
        background: 'Entertainer',
        alignment: 'Chaotic Neutral',
        abilities: {
          strength: 10,
          dexterity: 14,
          constitution: 12,
          intelligence: 13,
          wisdom: 11,
          charisma: 16,
        },
      };

      const result = CreateCharacterInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    }
  });
});

describe('Ability Score Calculations', () => {
  it('should calculate ability modifiers correctly', () => {
    expect(getAbilityModifier(1)).toBe(-5);
    expect(getAbilityModifier(3)).toBe(-4);
    expect(getAbilityModifier(10)).toBe(0);
    expect(getAbilityModifier(11)).toBe(0);
    expect(getAbilityModifier(12)).toBe(1);
    expect(getAbilityModifier(13)).toBe(1);
    expect(getAbilityModifier(14)).toBe(2);
    expect(getAbilityModifier(15)).toBe(2);
    expect(getAbilityModifier(18)).toBe(4);
    expect(getAbilityModifier(20)).toBe(5);
    expect(getAbilityModifier(30)).toBe(10);
  });

  it('should calculate all ability modifiers', () => {
    const abilities = {
      strength: 16,
      dexterity: 14,
      constitution: 15,
      intelligence: 8,
      wisdom: 13,
      charisma: 12,
    };

    const modifiers = calculateAllAbilityModifiers(abilities);
    
    expect(modifiers.strength).toBe(3);
    expect(modifiers.dexterity).toBe(2);
    expect(modifiers.constitution).toBe(2);
    expect(modifiers.intelligence).toBe(-1);
    expect(modifiers.wisdom).toBe(1);
    expect(modifiers.charisma).toBe(1);
  });

  it('should calculate initiative correctly', () => {
    expect(calculateInitiative(8)).toBe(-1);
    expect(calculateInitiative(10)).toBe(0);
    expect(calculateInitiative(14)).toBe(2);
    expect(calculateInitiative(18)).toBe(4);
  });
});

describe('Proficiency Bonus', () => {
  it('should calculate proficiency bonus by level', () => {
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

describe('Hit Points Calculations', () => {
  it('should calculate max HP correctly', () => {
    // Level 1 Fighter (d10) with +2 CON
    expect(calculateMaxHitPoints(1, 2, 10)).toBe(12);
    
    // Level 5 Wizard (d6) with +1 CON
    // First level: 6 + 1 = 7
    // Levels 2-5: 4 * (avg(4) + 1) = 4 * 5 = 20
    // Total: 7 + 20 = 27
    expect(calculateMaxHitPoints(5, 1, 6)).toBe(27);
    
    // Level 10 Barbarian (d12) with +4 CON
    // First level: 12 + 4 = 16
    // Levels 2-10: 9 * (avg(7) + 4) = 9 * 11 = 99
    // Total: 16 + 99 = 115
    expect(calculateMaxHitPoints(10, 4, 12)).toBe(115);
    
    // Level 1 Sorcerer (d6) with -1 CON (minimum 1 HP)
    expect(calculateMaxHitPoints(1, -1, 6)).toBe(5);
  });
});

describe('Experience and Level', () => {
  it('should return correct XP thresholds for levels', () => {
    expect(getExperienceForLevel(1)).toBe(0);
    expect(getExperienceForLevel(2)).toBe(300);
    expect(getExperienceForLevel(5)).toBe(6500);
    expect(getExperienceForLevel(10)).toBe(64000);
    expect(getExperienceForLevel(20)).toBe(355000);
  });

  it('should calculate level from experience', () => {
    expect(getLevelFromExperience(0)).toBe(1);
    expect(getLevelFromExperience(299)).toBe(1);
    expect(getLevelFromExperience(300)).toBe(2);
    expect(getLevelFromExperience(6499)).toBe(4);
    expect(getLevelFromExperience(6500)).toBe(5);
    expect(getLevelFromExperience(355000)).toBe(20);
    expect(getLevelFromExperience(400000)).toBe(20);
  });
});