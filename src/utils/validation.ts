import { Character } from '@/types/schema';

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
  if (score < 3) {
    return { field: ability, message: `${ability} score must be at least 3` };
  }
  
  if (score > 20) {
    return { field: ability, message: `${ability} score must be no more than 20` };
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