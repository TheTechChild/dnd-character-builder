import { AbilityScores, Skill, ProficiencyLevel, SpellcastingAbility } from '@/types';
import { Character, AbilityScore, SkillName, Skill as SkillData } from '@/types/character';

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

// Map full ability names to short forms for compatibility
export const ABILITY_SCORE_MAP: Record<AbilityScore, keyof AbilityScores> = {
  strength: 'str',
  dexterity: 'dex',
  constitution: 'con',
  intelligence: 'int',
  wisdom: 'wis',
  charisma: 'cha',
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

// Character-specific calculations
export function calculateAllAbilityModifiers(abilities: Character['abilities']): NonNullable<Character['abilityModifiers']> {
  return {
    strength: getAbilityModifier(abilities.strength),
    dexterity: getAbilityModifier(abilities.dexterity),
    constitution: getAbilityModifier(abilities.constitution),
    intelligence: getAbilityModifier(abilities.intelligence),
    wisdom: getAbilityModifier(abilities.wisdom),
    charisma: getAbilityModifier(abilities.charisma),
  };
}

export function calculateInitiative(dexterityScore: number): number {
  return getAbilityModifier(dexterityScore);
}

export function calculateSavingThrow(
  abilityScore: number,
  isProficient: boolean,
  proficiencyBonus: number
): number {
  const abilityModifier = getAbilityModifier(abilityScore);
  return isProficient ? abilityModifier + proficiencyBonus : abilityModifier;
}

export function calculateAllSavingThrows(
  abilities: Character['abilities'],
  savingThrowProficiencies: Record<AbilityScore, boolean>,
  proficiencyBonus: number
): Character['savingThrows'] {
  return {
    strength: {
      proficient: savingThrowProficiencies.strength,
      modifier: calculateSavingThrow(abilities.strength, savingThrowProficiencies.strength, proficiencyBonus),
    },
    dexterity: {
      proficient: savingThrowProficiencies.dexterity,
      modifier: calculateSavingThrow(abilities.dexterity, savingThrowProficiencies.dexterity, proficiencyBonus),
    },
    constitution: {
      proficient: savingThrowProficiencies.constitution,
      modifier: calculateSavingThrow(abilities.constitution, savingThrowProficiencies.constitution, proficiencyBonus),
    },
    intelligence: {
      proficient: savingThrowProficiencies.intelligence,
      modifier: calculateSavingThrow(abilities.intelligence, savingThrowProficiencies.intelligence, proficiencyBonus),
    },
    wisdom: {
      proficient: savingThrowProficiencies.wisdom,
      modifier: calculateSavingThrow(abilities.wisdom, savingThrowProficiencies.wisdom, proficiencyBonus),
    },
    charisma: {
      proficient: savingThrowProficiencies.charisma,
      modifier: calculateSavingThrow(abilities.charisma, savingThrowProficiencies.charisma, proficiencyBonus),
    },
  };
}

export function calculateSkillModifierForCharacter(
  skillName: SkillName,
  abilities: Character['abilities'],
  skill: SkillData,
  proficiencyBonus: number
): number {
  const abilityKey = SKILL_ABILITIES[skillName as Skill];
  const fullAbilityName = Object.entries(ABILITY_SCORE_MAP).find(([, short]) => short === abilityKey)?.[0] as AbilityScore;
  const abilityScore = abilities[fullAbilityName];
  const abilityModifier = getAbilityModifier(abilityScore);
  
  if (skill.expertise) {
    return abilityModifier + (proficiencyBonus * 2);
  } else if (skill.proficient) {
    return abilityModifier + proficiencyBonus;
  } else {
    return abilityModifier;
  }
}

export function calculateAllSkills(
  abilities: Character['abilities'],
  skillProficiencies: Record<SkillName, { proficient: boolean; expertise: boolean }>,
  proficiencyBonus: number
): Character['skills'] {
  const skills = {} as Character['skills'];
  
  for (const [skillName, proficiencyData] of Object.entries(skillProficiencies)) {
    const skill: SkillData = {
      proficient: proficiencyData.proficient,
      expertise: proficiencyData.expertise,
      modifier: 0, // calculated below
    };
    
    skill.modifier = calculateSkillModifierForCharacter(
      skillName as SkillName,
      abilities,
      skill,
      proficiencyBonus
    );
    
    skills[skillName as SkillName] = skill;
  }
  
  return skills;
}

// Hit points calculations
export function calculateMaxHitPoints(
  level: number,
  constitutionModifier: number,
  hitDieSize: number,
  additionalHp: number = 0
): number {
  // First level gets max hit die + con modifier
  // Each level after adds average hit die (rounded up) + con modifier
  const averageHitDie = Math.ceil((hitDieSize + 1) / 2);
  const baseHp = hitDieSize + ((level - 1) * averageHitDie);
  const conHp = level * constitutionModifier;
  return Math.max(1, baseHp + conHp + additionalHp);
}

// Experience and level calculations
export function getExperienceForLevel(level: number): number {
  const xpThresholds = [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
    85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
  ];
  return level >= 1 && level <= 20 ? xpThresholds[level - 1] : 0;
}

export function getLevelFromExperience(xp: number): number {
  const xpThresholds = [
    0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
    85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
  ];
  
  for (let i = xpThresholds.length - 1; i >= 0; i--) {
    if (xp >= xpThresholds[i]) {
      return i + 1;
    }
  }
  return 1;
}