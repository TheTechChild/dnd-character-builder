import { z } from 'zod';

// Base validation schemas
const AbilityScoreSchema = z.number().min(1).max(30);

const SavingThrowSchema = z.object({
  proficient: z.boolean(),
  modifier: z.number(),
});

const SkillSchema = z.object({
  proficient: z.boolean(),
  expertise: z.boolean(),
  modifier: z.number(),
});

const AttackSchema = z.object({
  name: z.string().min(1),
  attackBonus: z.number(),
  damage: z.string().regex(/^\d+d\d+(\+\d+)?$/), // e.g., "1d8+3"
  damageType: z.string().min(1),
  range: z.string().optional(),
  properties: z.array(z.string()).optional(),
});

const SpellSlotSchema = z.object({
  total: z.number().min(0),
  expended: z.number().min(0),
});

const SpellSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  level: z.number().min(0).max(9),
  school: z.string().min(1),
  castingTime: z.string().min(1),
  range: z.string().min(1),
  components: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().min(1),
  prepared: z.boolean().optional(),
  ritual: z.boolean().optional(),
  concentration: z.boolean().optional(),
});

const EquipmentTypeSchema = z.enum([
  'weapon',
  'armor',
  'shield',
  'tool',
  'gear',
  'consumable',
  'treasure',
  'other'
]);

const EquipmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  quantity: z.number().min(0),
  weight: z.number().min(0).optional(),
  equipped: z.boolean().optional(),
  type: EquipmentTypeSchema,
  armorClass: z.number().optional(),
  damage: z.string().optional(),
  properties: z.array(z.string()).optional(),
  description: z.string().optional(),
});

const FeatureSchema = z.object({
  name: z.string().min(1),
  source: z.string().min(1),
  description: z.string().min(1),
  uses: z.object({
    current: z.number().min(0),
    max: z.number().min(1),
    resetOn: z.enum(['short rest', 'long rest', 'dawn']),
  }).optional(),
});

// Character name validation
const CharacterNameSchema = z.string()
  .min(2, 'Character name must be at least 2 characters long')
  .max(50, 'Character name must be no more than 50 characters')
  .regex(/^[a-zA-Z\s\-']+$/, 'Character name can only contain letters, spaces, hyphens, and apostrophes');

// Main Character schema
export const CharacterSchemaV2 = z.object({
  // Metadata
  id: z.string().uuid(),
  version: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  
  // Basic Info
  name: CharacterNameSchema,
  race: z.string().min(1),
  subrace: z.string().optional(),
  class: z.string().min(1),
  subclass: z.string().optional(),
  level: z.number().min(1).max(20),
  experiencePoints: z.number().min(0),
  background: z.string().min(1),
  alignment: z.string().min(1),
  playerName: z.string().optional(),
  
  // Ability Scores
  abilities: z.object({
    strength: AbilityScoreSchema,
    dexterity: AbilityScoreSchema,
    constitution: AbilityScoreSchema,
    intelligence: AbilityScoreSchema,
    wisdom: AbilityScoreSchema,
    charisma: AbilityScoreSchema,
  }),
  
  // Ability Score Modifiers (calculated, optional in input)
  abilityModifiers: z.object({
    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),
  }).optional(),
  
  // Proficiency Bonus
  proficiencyBonus: z.number().min(2).max(6),
  
  // Saving Throws
  savingThrows: z.object({
    strength: SavingThrowSchema,
    dexterity: SavingThrowSchema,
    constitution: SavingThrowSchema,
    intelligence: SavingThrowSchema,
    wisdom: SavingThrowSchema,
    charisma: SavingThrowSchema,
  }),
  
  // Skills
  skills: z.object({
    acrobatics: SkillSchema,
    animalHandling: SkillSchema,
    arcana: SkillSchema,
    athletics: SkillSchema,
    deception: SkillSchema,
    history: SkillSchema,
    insight: SkillSchema,
    intimidation: SkillSchema,
    investigation: SkillSchema,
    medicine: SkillSchema,
    nature: SkillSchema,
    perception: SkillSchema,
    performance: SkillSchema,
    persuasion: SkillSchema,
    religion: SkillSchema,
    sleightOfHand: SkillSchema,
    stealth: SkillSchema,
    survival: SkillSchema,
  }),
  
  // Combat Stats
  armorClass: z.number().min(0),
  initiative: z.number(),
  speed: z.object({
    base: z.number().min(0),
    swim: z.number().min(0).optional(),
    fly: z.number().min(0).optional(),
    climb: z.number().min(0).optional(),
    burrow: z.number().min(0).optional(),
  }),
  
  // Hit Points
  hitPoints: z.object({
    current: z.number().min(0),
    max: z.number().min(1),
    temp: z.number().min(0),
  }).refine(data => data.current <= data.max + data.temp, {
    message: "Current HP cannot exceed max HP plus temporary HP",
  }),
  
  // Hit Dice
  hitDice: z.object({
    total: z.string().regex(/^\d+d\d+$/), // e.g., "3d8"
    current: z.number().min(0),
    size: z.number().refine(val => [6, 8, 10, 12].includes(val), {
      message: "Hit die size must be 6, 8, 10, or 12",
    }),
  }),
  
  // Death Saves
  deathSaves: z.object({
    successes: z.number().min(0).max(3),
    failures: z.number().min(0).max(3),
  }),
  
  // Attacks & Spellcasting
  attacks: z.array(AttackSchema),
  spellcastingAbility: z.enum(['intelligence', 'wisdom', 'charisma']).optional(),
  spellSaveDC: z.number().optional(),
  spellAttackBonus: z.number().optional(),
  
  // Spell Slots
  spellSlots: z.object({
    1: SpellSlotSchema,
    2: SpellSlotSchema,
    3: SpellSlotSchema,
    4: SpellSlotSchema,
    5: SpellSlotSchema,
    6: SpellSlotSchema,
    7: SpellSlotSchema,
    8: SpellSlotSchema,
    9: SpellSlotSchema,
  }).optional(),
  
  // Spells
  spells: z.object({
    cantrips: z.array(SpellSchema),
    1: z.array(SpellSchema),
    2: z.array(SpellSchema),
    3: z.array(SpellSchema),
    4: z.array(SpellSchema),
    5: z.array(SpellSchema),
    6: z.array(SpellSchema),
    7: z.array(SpellSchema),
    8: z.array(SpellSchema),
    9: z.array(SpellSchema),
  }).optional(),
  
  // Equipment
  equipment: z.array(EquipmentSchema),
  currency: z.object({
    cp: z.number().min(0),
    sp: z.number().min(0),
    ep: z.number().min(0),
    gp: z.number().min(0),
    pp: z.number().min(0),
  }),
  
  // Features & Traits
  features: z.array(FeatureSchema),
  traits: z.array(z.string()),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),
  
  // Other Proficiencies & Languages
  otherProficiencies: z.array(z.string()),
  languages: z.array(z.string()),
  
  // Physical Description
  appearance: z.object({
    age: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    eyes: z.string().optional(),
    skin: z.string().optional(),
    hair: z.string().optional(),
  }).optional(),
  
  // Backstory
  backstory: z.string().optional(),
  alliesAndOrganizations: z.array(z.string()).optional(),
  
  // Character Image
  imageUrl: z.string().url().optional().or(z.literal('')),
  
  // Notes
  notes: z.string().optional(),
});

// Export and Import schemas
export const CharacterExportSchemaV2 = z.object({
  version: z.string(),
  exportDate: z.string().datetime(),
  character: CharacterSchemaV2,
});

// Create character input (minimal required fields)
export const CreateCharacterInputSchema = z.object({
  name: CharacterNameSchema,
  race: z.string().min(1),
  subrace: z.string().optional(),
  class: z.string().min(1),
  background: z.string().min(1),
  alignment: z.string().min(1),
  abilities: z.object({
    strength: AbilityScoreSchema,
    dexterity: AbilityScoreSchema,
    constitution: AbilityScoreSchema,
    intelligence: AbilityScoreSchema,
    wisdom: AbilityScoreSchema,
    charisma: AbilityScoreSchema,
  }),
});

// Update character input (all fields optional except id)
export const UpdateCharacterInputSchema = CharacterSchemaV2.partial().required({ id: true });

// Type exports
export type Character = z.infer<typeof CharacterSchemaV2>;
export type CreateCharacterInput = z.infer<typeof CreateCharacterInputSchema>;
export type UpdateCharacterInput = z.infer<typeof UpdateCharacterInputSchema>;