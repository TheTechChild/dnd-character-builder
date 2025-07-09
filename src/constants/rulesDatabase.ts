import type { RuleContent } from '@/components/ReferenceSearch/RulesPopup';

// Common rules database
export const rulesDatabase: Record<string, RuleContent> = {
  'ability-checks': {
    title: 'Ability Checks',
    category: 'Core Mechanics',
    content: 'To make an ability check, roll a d20 and add the relevant ability modifier. If you have proficiency in a relevant skill, add your proficiency bonus. Compare the total to the DC set by the DM.',
    examples: [
      'Athletics (Strength): Climbing a cliff, jumping across a gap',
      'Perception (Wisdom): Spotting a hidden door, hearing approaching enemies',
      'Persuasion (Charisma): Convincing a guard to let you pass',
    ],
    relatedRules: ['advantage-disadvantage', 'working-together'],
  },
  'advantage-disadvantage': {
    title: 'Advantage and Disadvantage',
    category: 'Core Mechanics',
    content: 'When you have advantage, roll two d20s and use the higher result. With disadvantage, roll two d20s and use the lower. If you have both advantage and disadvantage, they cancel out and you roll normally.',
    examples: [
      'Advantage: Attacking a prone enemy in melee',
      'Disadvantage: Attacking while prone',
      'Cancelled out: Attacking a prone enemy while you are also prone',
    ],
    relatedRules: ['ability-checks', 'attack-rolls', 'saving-throws'],
  },
  'combat-sequence': {
    title: 'Combat Sequence',
    category: 'Combat',
    content: 'The steps of combat: 1) Determine surprise, 2) Establish positions, 3) Roll initiative, 4) Take turns in initiative order, 5) Begin next round when everyone has had a turn.',
    examples: [],
    relatedRules: ['initiative', 'actions-in-combat', 'surprise'],
  },
  'actions-in-combat': {
    title: 'Actions in Combat',
    category: 'Combat',
    content: 'On your turn, you can move up to your speed and take one action. You may also have a bonus action and/or reaction available.',
    examples: [
      'Action: Attack, Cast a Spell, Dash, Dodge, Help, Hide, Ready, Search',
      'Bonus Action: Granted by specific features (e.g., off-hand attack, certain spells)',
      'Reaction: Opportunity attack, casting counterspell, using shield spell',
      'Free: Drawing/sheathing a weapon, opening a door, simple communication',
    ],
    relatedRules: ['combat-sequence', 'movement', 'opportunity-attacks'],
  },
  'death-saving-throws': {
    title: 'Death Saving Throws',
    category: 'Combat',
    content: 'When you drop to 0 hit points, you fall unconscious and must make death saving throws. Roll a d20: 10 or higher is a success, 9 or lower is a failure. Three successes stabilize you, three failures mean death. Rolling a 1 counts as two failures, rolling a 20 heals you for 1 hit point.',
    examples: [
      'Taking damage while at 0 HP causes an automatic failure',
      'Critical hits against unconscious characters cause two failures',
      'Healing of any amount brings you back to consciousness',
    ],
    relatedRules: ['dying', 'stabilizing', 'instant-death'],
  },
  'resting': {
    title: 'Resting',
    category: 'Adventuring',
    content: 'Short Rest (1 hour): Spend Hit Dice to recover HP, regain some class features. Long Rest (8 hours): Regain all HP, recover half your Hit Dice, regain spell slots and most features.',
    examples: [
      'Can only benefit from one long rest per 24 hours',
      'Light activity (reading, talking, eating) doesn\'t interrupt a long rest',
      'Combat or strenuous activity interrupts a long rest',
    ],
    relatedRules: ['hit-dice', 'exhaustion'],
  },
  'spellcasting': {
    title: 'Spellcasting Rules',
    category: 'Magic',
    content: 'To cast a spell, you must have the spell prepared (if required by your class) and expend a spell slot of the spell\'s level or higher. Cantrips don\'t require spell slots.',
    examples: [
      'Components: Verbal (V), Somatic (S), Material (M)',
      'Concentration: Can only maintain one concentration spell at a time',
      'Ritual Casting: Some spells can be cast as rituals without using a slot',
    ],
    relatedRules: ['spell-slots', 'concentration', 'counterspell'],
  },
  'concentration': {
    title: 'Concentration',
    category: 'Magic',
    content: 'Some spells require concentration to maintain. You can only concentrate on one spell at a time. When you take damage, make a Constitution saving throw (DC 10 or half the damage, whichever is higher) to maintain concentration.',
    examples: [
      'Automatically lose concentration if incapacitated or killed',
      'DM might call for saves in other situations (rough seas, earthquake)',
      'Casting another concentration spell ends the previous one',
    ],
    relatedRules: ['spellcasting', 'saving-throws'],
  },
};