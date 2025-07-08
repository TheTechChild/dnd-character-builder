import { Character } from '@/types/schema';

export function createEmptyCharacter(): Character {
  return {
    id: crypto.randomUUID(),
    name: '',
    race: '',
    class: '',
    level: 1,
    background: '',
    alignment: '',
    abilityScores: {
      str: 10,
      dex: 10,
      con: 10,
      int: 10,
      wis: 10,
      cha: 10,
    },
    proficiencyBonus: 2,
    hitPoints: {
      current: 0,
      max: 0,
      temporary: 0,
    },
    armorClass: 10,
    speed: 30,
    skills: [],
    languages: [],
    traits: [],
    equipment: [],
  };
}