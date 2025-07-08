import { z } from 'zod';
import { validateCharacterName } from '../utils/validation';

// Character schema definition
export const CharacterSchema = z.object({
  id: z.string().uuid(),
  name: z.string().refine((name) => validateCharacterName(name) === null, {
    message: 'Invalid character name',
  }),
  race: z.string(),
  class: z.string(),
  level: z.number().min(1).max(20),
  background: z.string(),
  alignment: z.string(),
  abilityScores: z.object({
    str: z.number().min(3).max(20),
    dex: z.number().min(3).max(20),
    con: z.number().min(3).max(20),
    int: z.number().min(3).max(20),
    wis: z.number().min(3).max(20),
    cha: z.number().min(3).max(20),
  }),
  proficiencyBonus: z.number().min(2).max(6),
  hitPoints: z.object({
    current: z.number().min(0),
    max: z.number().min(1),
    temporary: z.number().min(0),
  }),
  armorClass: z.number().min(0),
  speed: z.number().min(0),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  traits: z.array(z.string()),
  equipment: z.array(z.string()),
});

// Additional schema utilities
export const CharacterExportSchema = z.object({
  version: z.string(),
  exportDate: z.string(),
  character: CharacterSchema,
});

export const CharacterImportOptionsSchema = z.object({
  overrideId: z.boolean().default(true),
  validateVersion: z.boolean().default(true),
  updateTimestamps: z.boolean().default(true),
});