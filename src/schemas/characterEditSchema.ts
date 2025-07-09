import { z } from 'zod';

// Ability score validation
export const abilityScoreSchema = z.number()
  .min(1, 'Ability score must be at least 1')
  .max(30, 'Ability score cannot exceed 30');

// Level validation
export const levelSchema = z.number()
  .min(1, 'Level must be at least 1')
  .max(20, 'Level cannot exceed 20');

// Hit points validation
export const hitPointsSchema = z.object({
  current: z.number().min(0, 'Current HP cannot be negative'),
  max: z.number().min(1, 'Max HP must be at least 1'),
  temp: z.number().min(0, 'Temp HP cannot be negative')
}).refine(data => data.current <= data.max + data.temp, {
  message: 'Current HP cannot exceed max HP + temp HP'
});

// Armor class validation
export const armorClassSchema = z.number()
  .min(0, 'AC cannot be negative')
  .max(30, 'AC cannot exceed 30');

// Experience points validation
export const experienceSchema = z.number()
  .min(0, 'Experience cannot be negative')
  .max(355000, 'Experience cannot exceed 355,000');

// Currency validation
export const currencySchema = z.object({
  cp: z.number().min(0, 'Copper cannot be negative'),
  sp: z.number().min(0, 'Silver cannot be negative'),
  ep: z.number().min(0, 'Electrum cannot be negative'),
  gp: z.number().min(0, 'Gold cannot be negative'),
  pp: z.number().min(0, 'Platinum cannot be negative')
});

// Text field validation
export const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name cannot exceed 100 characters');

export const textFieldSchema = z.string()
  .max(500, 'Text cannot exceed 500 characters');

export const longTextFieldSchema = z.string()
  .max(5000, 'Text cannot exceed 5000 characters');

// Speed validation
export const speedSchema = z.object({
  base: z.number().min(0, 'Speed cannot be negative').max(120, 'Speed seems unusually high'),
  swim: z.number().min(0).max(120).optional(),
  fly: z.number().min(0).max(120).optional(),
  climb: z.number().min(0).max(120).optional(),
  burrow: z.number().min(0).max(120).optional()
});

// Hit dice validation
export const hitDiceSchema = z.object({
  total: z.string().regex(/^\d+d\d+$/, 'Format must be XdY (e.g., 3d8)'),
  current: z.number().min(0),
  size: z.number().refine((val) => [6, 8, 10, 12].includes(val), {
    message: 'Hit die size must be 6, 8, 10, or 12'
  })
});

// Proficiency bonus validation (calculated, but validating for safety)
export const proficiencyBonusSchema = z.number()
  .min(2, 'Proficiency bonus must be at least 2')
  .max(6, 'Proficiency bonus cannot exceed 6');

// Spell slot validation
export const spellSlotSchema = z.object({
  total: z.number().min(0).max(9),
  expended: z.number().min(0)
}).refine(data => data.expended <= data.total, {
  message: 'Expended slots cannot exceed total slots'
});

// Equipment item validation
export const equipmentItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  weight: z.number().min(0).optional(),
  equipped: z.boolean().optional(),
  type: z.enum(['weapon', 'armor', 'shield', 'tool', 'gear', 'consumable', 'treasure', 'other']),
  armorClass: z.number().optional(),
  damage: z.string().optional(),
  properties: z.array(z.string()).optional(),
  description: z.string().optional()
});

// Attack validation
export const attackSchema = z.object({
  name: z.string().min(1, 'Attack name is required'),
  attackBonus: z.number(),
  damage: z.string().regex(/^\d+d\d+(\+\d+)?$/, 'Damage format must be XdY or XdY+Z'),
  damageType: z.string().min(1, 'Damage type is required'),
  range: z.string().optional(),
  properties: z.array(z.string()).optional()
});

// Spell validation
export const spellSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Spell name is required'),
  level: z.number().min(0).max(9),
  school: z.string().min(1, 'School is required'),
  castingTime: z.string().min(1, 'Casting time is required'),
  range: z.string().min(1, 'Range is required'),
  components: z.string().min(1, 'Components are required'),
  duration: z.string().min(1, 'Duration is required'),
  description: z.string().min(1, 'Description is required'),
  prepared: z.boolean().optional(),
  ritual: z.boolean().optional(),
  concentration: z.boolean().optional()
});

// Character validation schema for specific fields
export const characterFieldValidators = {
  name: nameSchema,
  level: levelSchema,
  experiencePoints: experienceSchema,
  abilities: z.object({
    strength: abilityScoreSchema,
    dexterity: abilityScoreSchema,
    constitution: abilityScoreSchema,
    intelligence: abilityScoreSchema,
    wisdom: abilityScoreSchema,
    charisma: abilityScoreSchema
  }),
  hitPoints: hitPointsSchema,
  armorClass: armorClassSchema,
  speed: speedSchema,
  hitDice: hitDiceSchema,
  proficiencyBonus: proficiencyBonusSchema,
  currency: currencySchema,
  equipment: z.array(equipmentItemSchema),
  attacks: z.array(attackSchema),
  spells: z.object({
    cantrips: z.array(spellSchema),
    1: z.array(spellSchema),
    2: z.array(spellSchema),
    3: z.array(spellSchema),
    4: z.array(spellSchema),
    5: z.array(spellSchema),
    6: z.array(spellSchema),
    7: z.array(spellSchema),
    8: z.array(spellSchema),
    9: z.array(spellSchema)
  }).optional(),
  traits: z.array(textFieldSchema),
  ideals: textFieldSchema.optional(),
  bonds: textFieldSchema.optional(),
  flaws: textFieldSchema.optional(),
  backstory: longTextFieldSchema.optional(),
  notes: longTextFieldSchema.optional()
};

// Helper function to validate a specific field
export function validateCharacterField<T extends keyof typeof characterFieldValidators>(
  field: T,
  value: unknown
): { success: boolean; error?: string } {
  const validator = characterFieldValidators[field];
  if (!validator) {
    return { success: true };
  }
  
  const result = validator.safeParse(value);
  if (!result.success) {
    return {
      success: false,
      error: result.error.errors[0]?.message || 'Invalid value'
    };
  }
  
  return { success: true };
}