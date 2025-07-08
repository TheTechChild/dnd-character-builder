import { AbilityScores } from './index';

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
  alignment: string;
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  hitPoints: {
    current: number;
    max: number;
    temporary: number;
  };
  armorClass: number;
  speed: number;
  skills: string[];
  languages: string[];
  traits: string[];
  equipment: string[];
}