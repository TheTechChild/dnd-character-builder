import { Character } from '@/types/character';
import { getAbilityModifier } from './calculations';

const SPELLCASTING_CLASSES = [
  'artificer',
  'bard',
  'cleric',
  'druid',
  'paladin',
  'ranger',
  'sorcerer',
  'warlock',
  'wizard'
];

const SPELLCASTING_SUBCLASSES = [
  'eldritch knight',
  'arcane trickster'
];

export function hasSpellcasting(character: Character): boolean {
  const className = character.class?.toLowerCase() || '';
  const subclassName = character.subclass?.toLowerCase() || '';
  
  return SPELLCASTING_CLASSES.includes(className) || 
         SPELLCASTING_SUBCLASSES.includes(subclassName);
}

export function getSpellcastingAbility(character: Character): keyof typeof character.abilities | null {
  const className = character.class?.toLowerCase() || '';
  
  const spellcastingAbilityMap: Record<string, keyof typeof character.abilities> = {
    artificer: 'intelligence',
    bard: 'charisma',
    cleric: 'wisdom',
    druid: 'wisdom',
    paladin: 'charisma',
    ranger: 'wisdom',
    sorcerer: 'charisma',
    warlock: 'charisma',
    wizard: 'intelligence'
  };
  
  return spellcastingAbilityMap[className] || null;
}

export function calculateSpellSaveDC(character: Character): number {
  const spellcastingAbility = getSpellcastingAbility(character);
  if (!spellcastingAbility) return 8;
  
  const abilityScore = character.abilities[spellcastingAbility];
  const abilityModifier = getAbilityModifier(abilityScore);
  const proficiencyBonus = character.proficiencyBonus || 2;
  
  return 8 + proficiencyBonus + abilityModifier;
}

export function calculateSpellAttackBonus(character: Character): number {
  const spellcastingAbility = getSpellcastingAbility(character);
  if (!spellcastingAbility) return 0;
  
  const abilityScore = character.abilities[spellcastingAbility];
  const abilityModifier = getAbilityModifier(abilityScore);
  const proficiencyBonus = character.proficiencyBonus || 2;
  
  return proficiencyBonus + abilityModifier;
}