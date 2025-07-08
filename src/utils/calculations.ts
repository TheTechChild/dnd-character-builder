import { AbilityScores, Skill, ProficiencyLevel, SpellcastingAbility } from '@/types';

export const SKILL_ABILITIES: Record<Skill, keyof AbilityScores> = {
  acrobatics: 'dex',
  animalHandling: 'wis',
  arcana: 'int',
  athletics: 'str',
  deception: 'cha',
  history: 'int',
  insight: 'wis',
  intimidation: 'cha',
  investigation: 'int',
  medicine: 'wis',
  nature: 'int',
  perception: 'wis',
  performance: 'cha',
  persuasion: 'cha',
  religion: 'int',
  sleightOfHand: 'dex',
  stealth: 'dex',
  survival: 'wis',
};

export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function getSkillModifier(
  skill: Skill,
  abilityScores: AbilityScores,
  proficiency: ProficiencyLevel,
  proficiencyBonus: number
): number {
  const ability = SKILL_ABILITIES[skill];
  const abilityScore = abilityScores[ability];
  const abilityModifier = getAbilityModifier(abilityScore);
  
  switch (proficiency) {
    case 'none':
      return abilityModifier;
    case 'proficient':
      return abilityModifier + proficiencyBonus;
    case 'expertise':
      return abilityModifier + (proficiencyBonus * 2);
  }
}

export function getPassivePerception(
  wisdomScore: number,
  proficiency: ProficiencyLevel,
  proficiencyBonus: number
): number {
  const wisModifier = getAbilityModifier(wisdomScore);
  let bonus = 10 + wisModifier;
  
  if (proficiency === 'proficient') {
    bonus += proficiencyBonus;
  } else if (proficiency === 'expertise') {
    bonus += proficiencyBonus * 2;
  }
  
  return bonus;
}

export function getSpellSaveDC(
  spellcastingAbility: SpellcastingAbility,
  abilityScores: AbilityScores,
  proficiencyBonus: number
): number {
  const abilityScore = abilityScores[spellcastingAbility];
  const abilityModifier = getAbilityModifier(abilityScore);
  return 8 + proficiencyBonus + abilityModifier;
}

export function getSpellAttackBonus(
  spellcastingAbility: SpellcastingAbility,
  abilityScores: AbilityScores,
  proficiencyBonus: number
): number {
  const abilityScore = abilityScores[spellcastingAbility];
  const abilityModifier = getAbilityModifier(abilityScore);
  return proficiencyBonus + abilityModifier;
}