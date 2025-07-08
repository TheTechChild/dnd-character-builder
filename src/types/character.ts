export interface Character {
  // Metadata
  id: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  
  // Basic Info
  name: string;
  race: string;
  subrace?: string;
  class: string;
  subclass?: string;
  level: number;
  experiencePoints: number;
  background: string;
  alignment: string;
  playerName?: string;
  
  // Ability Scores
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  
  // Ability Score Modifiers (calculated)
  abilityModifiers?: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  
  // Proficiency Bonus (calculated based on level)
  proficiencyBonus: number;
  
  // Saving Throws
  savingThrows: {
    strength: SavingThrow;
    dexterity: SavingThrow;
    constitution: SavingThrow;
    intelligence: SavingThrow;
    wisdom: SavingThrow;
    charisma: SavingThrow;
  };
  
  // Skills
  skills: {
    acrobatics: Skill;
    animalHandling: Skill;
    arcana: Skill;
    athletics: Skill;
    deception: Skill;
    history: Skill;
    insight: Skill;
    intimidation: Skill;
    investigation: Skill;
    medicine: Skill;
    nature: Skill;
    perception: Skill;
    performance: Skill;
    persuasion: Skill;
    religion: Skill;
    sleightOfHand: Skill;
    stealth: Skill;
    survival: Skill;
  };
  
  // Combat Stats
  armorClass: number;
  initiative: number;
  speed: {
    base: number;
    swim?: number;
    fly?: number;
    climb?: number;
    burrow?: number;
  };
  
  // Hit Points
  hitPoints: {
    current: number;
    max: number;
    temp: number;
  };
  
  // Hit Dice
  hitDice: {
    total: string; // e.g., "3d8"
    current: number;
    size: number; // 6, 8, 10, or 12
  };
  
  // Death Saves
  deathSaves: {
    successes: number;
    failures: number;
  };
  
  // Attacks & Spellcasting
  attacks: Attack[];
  spellcastingAbility?: SpellcastingAbility;
  spellSaveDC?: number;
  spellAttackBonus?: number;
  
  // Spell Slots
  spellSlots?: {
    1: { total: number; expended: number };
    2: { total: number; expended: number };
    3: { total: number; expended: number };
    4: { total: number; expended: number };
    5: { total: number; expended: number };
    6: { total: number; expended: number };
    7: { total: number; expended: number };
    8: { total: number; expended: number };
    9: { total: number; expended: number };
  };
  
  // Spells
  spells?: {
    cantrips: Spell[];
    1: Spell[];
    2: Spell[];
    3: Spell[];
    4: Spell[];
    5: Spell[];
    6: Spell[];
    7: Spell[];
    8: Spell[];
    9: Spell[];
  };
  
  // Equipment
  equipment: Equipment[];
  currency: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };
  
  // Features & Traits
  features: Feature[];
  traits: string[];
  ideals?: string;
  bonds?: string;
  flaws?: string;
  
  // Other Proficiencies & Languages
  otherProficiencies: string[];
  languages: string[];
  
  // Physical Description
  appearance?: {
    age?: string;
    height?: string;
    weight?: string;
    eyes?: string;
    skin?: string;
    hair?: string;
  };
  
  // Backstory
  backstory?: string;
  alliesAndOrganizations?: string[];
  
  // Character Image
  imageUrl?: string;
  
  // Notes
  notes?: string;
}

// Supporting Types
export interface SavingThrow {
  proficient: boolean;
  modifier: number; // calculated
}

export interface Skill {
  proficient: boolean;
  expertise: boolean;
  modifier: number; // calculated
}

export interface Attack {
  name: string;
  attackBonus: number;
  damage: string; // e.g., "1d8+3"
  damageType: string;
  range?: string;
  properties?: string[];
}

export type SpellcastingAbility = 'intelligence' | 'wisdom' | 'charisma';

export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
  prepared?: boolean;
  ritual?: boolean;
  concentration?: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
  equipped?: boolean;
  type: EquipmentType;
  armorClass?: number;
  damage?: string;
  properties?: string[];
  description?: string;
}

export type EquipmentType = 
  | 'weapon'
  | 'armor'
  | 'shield'
  | 'tool'
  | 'gear'
  | 'consumable'
  | 'treasure'
  | 'other';

export interface Feature {
  name: string;
  source: string; // e.g., "Fighter 1", "Feat"
  description: string;
  uses?: {
    current: number;
    max: number;
    resetOn: 'short rest' | 'long rest' | 'dawn';
  };
}

// Utility types for calculations
export type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
export type SkillName = keyof Character['skills'];

// Class-specific feature types (extensible)
export interface ClassFeatures {
  // Fighter
  fightingStyle?: string;
  secondWind?: { used: boolean };
  actionSurge?: { used: boolean; count: number };
  
  // Wizard
  arcaneRecovery?: { used: boolean };
  spellbook?: Spell[];
  
  // Rogue
  sneakAttackDice?: number;
  thiefsCant?: boolean;
  
  // Cleric
  domain?: string;
  channelDivinity?: { used: number; max: number };
  
  // Add more as needed...
}

// Character creation/update DTOs
export interface CreateCharacterInput {
  name: string;
  race: string;
  subrace?: string;
  class: string;
  background: string;
  alignment: string;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

export interface UpdateCharacterInput extends Partial<Omit<Character, 'id' | 'version' | 'createdAt' | 'updatedAt'>> {}