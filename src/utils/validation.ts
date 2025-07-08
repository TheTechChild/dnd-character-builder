import { Character } from '@/types/schema';
import { z, ZodError } from 'zod';
import { CharacterSchemaV2, CreateCharacterInputSchema, UpdateCharacterInputSchema } from '@/schemas/characterSchemaV2';
import { Character as CharacterV2 } from '@/types/character';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCharacterName(name: string): ValidationError | null {
  if (!name || name.trim().length === 0) {
    return { field: 'name', message: 'Character name is required' };
  }
  
  if (name.length < 2) {
    return { field: 'name', message: 'Character name must be at least 2 characters long' };
  }
  
  if (name.length > 50) {
    return { field: 'name', message: 'Character name must be no more than 50 characters' };
  }
  
  const validNamePattern = /^[a-zA-Z\s\-']+$/;
  if (!validNamePattern.test(name)) {
    return { field: 'name', message: 'Character name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return null;
}

export function validateAbilityScore(score: number, ability: string): ValidationError | null {
  if (score < 1) {
    return { field: ability, message: `${ability} score must be at least 1` };
  }
  
  if (score > 30) {
    return { field: ability, message: `${ability} score must be no more than 30` };
  }
  
  return null;
}

export function validateLevel(level: number): ValidationError | null {
  if (level < 1) {
    return { field: 'level', message: 'Level must be at least 1' };
  }
  
  if (level > 20) {
    return { field: 'level', message: 'Level must be no more than 20' };
  }
  
  return null;
}

export function validateCharacter(character: Character): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const nameError = validateCharacterName(character.name);
  if (nameError) errors.push(nameError);
  
  const levelError = validateLevel(character.level);
  if (levelError) errors.push(levelError);
  
  const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;
  for (const ability of abilities) {
    const score = character.abilityScores[ability];
    const error = validateAbilityScore(score, ability.toUpperCase());
    if (error) errors.push(error);
  }
  
  return errors;
}

// Zod-based validation functions
export function validateCharacterV2(character: unknown): { success: true; data: CharacterV2 } | { success: false; errors: ValidationError[] } {
  try {
    const validated = CharacterSchemaV2.parse(character);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'An unknown error occurred' }] };
  }
}

export function validateCreateCharacterInput(input: unknown): { success: true; data: z.infer<typeof CreateCharacterInputSchema> } | { success: false; errors: ValidationError[] } {
  try {
    const validated = CreateCharacterInputSchema.parse(input);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'An unknown error occurred' }] };
  }
}

export function validateUpdateCharacterInput(input: unknown): { success: true; data: z.infer<typeof UpdateCharacterInputSchema> } | { success: false; errors: ValidationError[] } {
  try {
    const validated = UpdateCharacterInputSchema.parse(input);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: ValidationError[] = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'An unknown error occurred' }] };
  }
}

// Helper function to validate specific fields
export function validateField(fieldPath: string, value: unknown, schema: z.ZodSchema): ValidationError | null {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        field: fieldPath,
        message: error.errors[0]?.message || 'Invalid value',
      };
    }
    return {
      field: fieldPath,
      message: 'An unknown error occurred',
    };
  }
}

// Validate HP doesn't exceed maximum
export function validateHitPoints(current: number, max: number, temp: number = 0): ValidationError | null {
  if (current < 0) {
    return { field: 'hitPoints.current', message: 'Current HP cannot be negative' };
  }
  
  if (current > max + temp) {
    return { field: 'hitPoints.current', message: 'Current HP cannot exceed max HP plus temporary HP' };
  }
  
  return null;
}