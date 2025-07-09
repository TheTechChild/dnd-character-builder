export const RACES = [
  'Dragonborn',
  'Dwarf',
  'Elf',
  'Gnome',
  'Half-Elf',
  'Halfling',
  'Half-Orc',
  'Human',
  'Tiefling',
] as const;

export const SUBRACES: Record<string, string[]> = {
  Dwarf: ['Hill Dwarf', 'Mountain Dwarf'],
  Elf: ['High Elf', 'Wood Elf', 'Dark Elf (Drow)'],
  Gnome: ['Forest Gnome', 'Rock Gnome'],
  Halfling: ['Lightfoot', 'Stout'],
};

export const CLASSES = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
] as const;

export const BACKGROUNDS = [
  'Acolyte',
  'Charlatan',
  'Criminal',
  'Entertainer',
  'Folk Hero',
  'Guild Artisan',
  'Hermit',
  'Noble',
  'Outlander',
  'Sage',
  'Sailor',
  'Soldier',
  'Urchin',
] as const;

export const ALIGNMENTS = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil',
] as const;

export const ABILITY_SCORES = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
] as const;

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

export const RACIAL_BONUSES: Record<string, Partial<Record<typeof ABILITY_SCORES[number], number>>> = {
  Dragonborn: { strength: 2, charisma: 1 },
  'Hill Dwarf': { constitution: 2, wisdom: 1 },
  'Mountain Dwarf': { constitution: 2, strength: 2 },
  'High Elf': { dexterity: 2, intelligence: 1 },
  'Wood Elf': { dexterity: 2, wisdom: 1 },
  'Dark Elf (Drow)': { dexterity: 2, charisma: 1 },
  'Forest Gnome': { intelligence: 2, dexterity: 1 },
  'Rock Gnome': { intelligence: 2, constitution: 1 },
  'Half-Elf': { charisma: 2 }, // Plus 1 to two other abilities of choice
  'Lightfoot': { dexterity: 2, charisma: 1 },
  'Stout': { dexterity: 2, constitution: 1 },
  'Half-Orc': { strength: 2, constitution: 1 },
  Human: {}, // +1 to all abilities
  Tiefling: { charisma: 2, intelligence: 1 },
};

export const CLASS_HIT_DICE: Record<string, number> = {
  Barbarian: 12,
  Bard: 8,
  Cleric: 8,
  Druid: 8,
  Fighter: 10,
  Monk: 8,
  Paladin: 10,
  Ranger: 10,
  Rogue: 8,
  Sorcerer: 6,
  Warlock: 8,
  Wizard: 6,
};

export const CLASS_PRIMARY_ABILITIES: Record<string, typeof ABILITY_SCORES[number][]> = {
  Barbarian: ['strength'],
  Bard: ['charisma'],
  Cleric: ['wisdom'],
  Druid: ['wisdom'],
  Fighter: ['strength', 'dexterity'],
  Monk: ['dexterity', 'wisdom'],
  Paladin: ['strength', 'charisma'],
  Ranger: ['dexterity', 'wisdom'],
  Rogue: ['dexterity'],
  Sorcerer: ['charisma'],
  Warlock: ['charisma'],
  Wizard: ['intelligence'],
};

export const CLASS_SKILLS: Record<string, string[]> = {
  Barbarian: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
  Bard: ['acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival'],
  Cleric: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
  Druid: ['arcana', 'animalHandling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival'],
  Fighter: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
  Monk: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth'],
  Paladin: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion'],
  Ranger: ['animalHandling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival'],
  Rogue: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'],
  Sorcerer: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion'],
  Warlock: ['arcana', 'deception', 'history', 'intimidation', 'investigation', 'nature', 'religion'],
  Wizard: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
};

export const CLASS_SKILL_COUNT: Record<string, number> = {
  Barbarian: 2,
  Bard: 3,
  Cleric: 2,
  Druid: 2,
  Fighter: 2,
  Monk: 2,
  Paladin: 2,
  Ranger: 3,
  Rogue: 4,
  Sorcerer: 2,
  Warlock: 2,
  Wizard: 2,
};

export const BACKGROUND_SKILLS: Record<string, string[]> = {
  Acolyte: ['insight', 'religion'],
  Charlatan: ['deception', 'sleightOfHand'],
  Criminal: ['deception', 'stealth'],
  Entertainer: ['acrobatics', 'performance'],
  'Folk Hero': ['animalHandling', 'survival'],
  'Guild Artisan': ['insight', 'persuasion'],
  Hermit: ['medicine', 'religion'],
  Noble: ['history', 'persuasion'],
  Outlander: ['athletics', 'survival'],
  Sage: ['arcana', 'history'],
  Sailor: ['athletics', 'perception'],
  Soldier: ['athletics', 'intimidation'],
  Urchin: ['sleightOfHand', 'stealth'],
};

export const LANGUAGES = [
  'Common',
  'Dwarvish',
  'Elvish',
  'Giant',
  'Gnomish',
  'Goblin',
  'Halfling',
  'Orc',
  'Abyssal',
  'Celestial',
  'Draconic',
  'Deep Speech',
  'Infernal',
  'Primordial',
  'Sylvan',
  'Undercommon',
] as const;

export const STARTING_EQUIPMENT_PACKS = {
  "Burglar's Pack": [
    'Backpack',
    'Ball bearings (bag of 1,000)',
    'String (10 feet)',
    'Bell',
    'Candles (5)',
    'Crowbar',
    'Hammer',
    'Pitons (10)',
    'Hooded lantern',
    'Oil (2 flasks)',
    'Rations (5 days)',
    'Tinderbox',
    'Waterskin',
    'Hempen rope (50 feet)',
  ],
  "Diplomat's Pack": [
    'Chest',
    'Case, map or scroll (2)',
    'Fine clothes',
    'Ink (bottle)',
    'Ink pen',
    'Lamp',
    'Oil (2 flasks)',
    'Paper (5 sheets)',
    'Perfume (vial)',
    'Sealing wax',
    'Soap',
  ],
  "Dungeoneer's Pack": [
    'Backpack',
    'Crowbar',
    'Hammer',
    'Pitons (10)',
    'Torches (10)',
    'Tinderbox',
    'Rations (10 days)',
    'Waterskin',
    'Hempen rope (50 feet)',
  ],
  "Entertainer's Pack": [
    'Backpack',
    'Bedroll',
    'Costumes (2)',
    'Candles (5)',
    'Rations (5 days)',
    'Waterskin',
    'Disguise kit',
  ],
  "Explorer's Pack": [
    'Backpack',
    'Bedroll',
    'Mess kit',
    'Tinderbox',
    'Torches (10)',
    'Rations (10 days)',
    'Waterskin',
    'Hempen rope (50 feet)',
  ],
  "Priest's Pack": [
    'Backpack',
    'Blanket',
    'Candles (10)',
    'Tinderbox',
    'Alms box',
    'Blocks of incense (2)',
    'Censer',
    'Vestments',
    'Rations (2 days)',
    'Waterskin',
  ],
  "Scholar's Pack": [
    'Backpack',
    'Book of lore',
    'Ink (bottle)',
    'Ink pen',
    'Parchment (10 sheets)',
    'Little bag of sand',
    'Small knife',
  ],
};

export const STARTING_GOLD: Record<string, { dice: string; multiplier: number }> = {
  Barbarian: { dice: '2d4', multiplier: 10 },
  Bard: { dice: '5d4', multiplier: 10 },
  Cleric: { dice: '5d4', multiplier: 10 },
  Druid: { dice: '2d4', multiplier: 10 },
  Fighter: { dice: '5d4', multiplier: 10 },
  Monk: { dice: '5d4', multiplier: 1 },
  Paladin: { dice: '5d4', multiplier: 10 },
  Ranger: { dice: '5d4', multiplier: 10 },
  Rogue: { dice: '4d4', multiplier: 10 },
  Sorcerer: { dice: '3d4', multiplier: 10 },
  Warlock: { dice: '4d4', multiplier: 10 },
  Wizard: { dice: '4d4', multiplier: 10 },
};