export interface Open5eSpell {
  slug: string;
  name: string;
  desc: string;
  higher_level: string;
  page: string;
  range: string;
  components: string;
  material: string;
  ritual: string;
  duration: string;
  concentration: string;
  casting_time: string;
  level: string;
  level_int: number;
  school: string;
  dnd_class: string;
  archetype: string;
  circles: string;
  document__slug: string;
  document__title: string;
  document__license_url: string;
}

export interface Open5eClass {
  name: string;
  slug: string;
  desc: string;
  hit_dice: string;
  hp_at_1st_level: string;
  hp_at_higher_levels: string;
  prof_armor: string;
  prof_weapons: string;
  prof_tools: string;
  prof_saving_throws: string;
  prof_skills: string;
  equipment: string;
  table: string;
  spellcasting_ability: string;
  subtypes_name: string;
  archetypes: Array<{
    name: string;
    slug: string;
    desc: string;
  }>;
  document__slug: string;
  document__title: string;
  document__license_url: string;
}

export interface Open5eRace {
  name: string;
  slug: string;
  desc: string;
  asi_desc: string;
  asi: Array<{
    attributes: string[];
    value: number;
  }>;
  age: string;
  alignment: string;
  size: string;
  speed: {
    walk: number;
  };
  speed_desc: string;
  languages: string;
  vision: string;
  traits: string;
  subraces: Array<{
    name: string;
    slug: string;
    desc: string;
    asi: Array<{
      attributes: string[];
      value: number;
    }>;
  }>;
  document__slug: string;
  document__title: string;
  document__license_url: string;
}

export interface Open5eEquipment {
  name: string;
  slug: string;
  category: string;
  cost: string;
  damage_dice: string;
  damage_type: string;
  weight: string;
  properties: string[];
  desc: string;
  document__slug: string;
  document__title: string;
  document__license_url: string;
}

export interface Open5eCondition {
  name: string;
  slug: string;
  desc: string;
  document__slug: string;
  document__title: string;
  document__license_url: string;
}

export interface Open5eMagicItem {
  name: string;
  slug: string;
  type: string;
  desc: string;
  rarity: string;
  requires_attunement: string;
  document__slug: string;
  document__title: string;
  document__license_url: string;
}

export interface Open5eMonster {
  name: string;
  slug: string;
  desc: string;
  size: string;
  type: string;
  subtype: string;
  alignment: string;
  armor_class: number;
  armor_desc: string;
  hit_points: number;
  hit_dice: string;
  speed: {
    walk: number;
    swim?: number;
    fly?: number;
    burrow?: number;
    climb?: number;
  };
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  challenge_rating: string;
  cr: number;
  xp: number;
  document__slug: string;
  document__title: string;
  document__license_url: string;
}

export interface Open5eResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type Open5eEndpoint = 
  | 'spells'
  | 'classes'
  | 'races'
  | 'equipment'
  | 'conditions'
  | 'magicitems'
  | 'monsters';

export interface CachedContent<T> {
  data: T;
  timestamp: number;
  endpoint: Open5eEndpoint;
}

export type Open5eItem = Open5eSpell | Open5eClass | Open5eRace | Open5eEquipment | Open5eCondition | Open5eMagicItem | Open5eMonster;

export interface SearchableContent {
  id: string;
  name: string;
  category: Open5eEndpoint;
  description: string;
  details: Open5eItem;
}