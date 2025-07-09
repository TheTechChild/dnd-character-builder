import { Character } from '@/types/character';
import { v4 as uuidv4 } from 'uuid';

export type ConflictResolution = 'replace' | 'duplicate' | 'skip' | 'merge';

export interface ImportConflict {
  importedCharacter: Character;
  existingCharacter: Character;
  resolution?: ConflictResolution;
}

export interface ConflictResolutionOptions {
  defaultResolution: ConflictResolution;
  autoResolve: boolean;
  mergeStrategy?: 'preferImported' | 'preferExisting' | 'newest';
}

const DEFAULT_OPTIONS: ConflictResolutionOptions = {
  defaultResolution: 'skip',
  autoResolve: false,
  mergeStrategy: 'preferImported',
};

export function findConflicts(
  importedCharacters: Character[],
  existingCharacters: Character[]
): ImportConflict[] {
  const conflicts: ImportConflict[] = [];

  for (const imported of importedCharacters) {
    // Check for ID conflict
    const existingById = existingCharacters.find(char => char.id === imported.id);
    if (existingById) {
      conflicts.push({
        importedCharacter: imported,
        existingCharacter: existingById,
      });
      continue;
    }

    // Check for name conflict (case-insensitive)
    const existingByName = existingCharacters.find(
      char => char.name.toLowerCase() === imported.name.toLowerCase()
    );
    if (existingByName) {
      conflicts.push({
        importedCharacter: imported,
        existingCharacter: existingByName,
      });
    }
  }

  return conflicts;
}

export function resolveConflict(
  conflict: ImportConflict,
  resolution: ConflictResolution
): Character | null {
  switch (resolution) {
    case 'replace':
      // Return imported character with existing ID
      return {
        ...conflict.importedCharacter,
        id: conflict.existingCharacter.id,
        updatedAt: new Date().toISOString(),
      };

    case 'duplicate':
      // Return imported character with new ID and modified name
      return {
        ...conflict.importedCharacter,
        id: uuidv4(),
        name: generateUniqueName(conflict.importedCharacter.name, conflict.existingCharacter.name),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

    case 'skip':
      // Don't import this character
      return null;

    case 'merge':
      // Merge imported data with existing, preferring imported values
      return mergeCharacters(conflict.existingCharacter, conflict.importedCharacter);

    default:
      return null;
  }
}

export function resolveConflicts(
  conflicts: ImportConflict[],
  options?: Partial<ConflictResolutionOptions>
): Character[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const resolved: Character[] = [];

  for (const conflict of conflicts) {
    const resolution = conflict.resolution || opts.defaultResolution;
    const result = resolveConflict(conflict, resolution);
    
    if (result) {
      resolved.push(result);
    }
  }

  return resolved;
}

function generateUniqueName(importedName: string, existingName: string): string {
  if (importedName === existingName) {
    return `${importedName} (Imported)`;
  }
  return importedName;
}

function mergeCharacters(
  existing: Character,
  imported: Character,
  strategy: 'preferImported' | 'preferExisting' | 'newest' = 'preferImported'
): Character {
  if (strategy === 'newest') {
    const existingDate = new Date(existing.updatedAt || existing.createdAt);
    const importedDate = new Date(imported.updatedAt || imported.createdAt);
    
    if (importedDate > existingDate) {
      strategy = 'preferImported';
    } else {
      strategy = 'preferExisting';
    }
  }

  const base = strategy === 'preferImported' ? imported : existing;
  const override = strategy === 'preferImported' ? existing : imported;

  // Deep merge character data
  const merged: Character = {
    ...base,
    id: existing.id, // Always keep existing ID
    createdAt: existing.createdAt, // Keep original creation date
    updatedAt: new Date().toISOString(),
    
    // Merge skills and saving throws - prefer proficient skills
    skills: mergeSkills(base.skills, override.skills),
    savingThrows: mergeSavingThrows(base.savingThrows, override.savingThrows),
    languages: [...new Set([...base.languages, ...override.languages])],
    
    // For equipment and features, prefer the list with more items
    equipment: base.equipment.length >= override.equipment.length ? base.equipment : override.equipment,
    features: base.features.length >= override.features.length ? base.features : override.features,
    
    // Merge spells if they exist
    spells: mergeSpells(base.spells, override.spells),
    
    // Merge notes by combining if different
    notes: mergeNotes(base.notes, override.notes),
  };

  return merged;
}

function mergeNotes(notes1?: string, notes2?: string): string | undefined {
  if (!notes1) return notes2;
  if (!notes2) return notes1;
  if (notes1 === notes2) return notes1;
  
  return `${notes1}\n\n--- Imported Notes ---\n\n${notes2}`;
}

function mergeSkills(base: Character['skills'], override: Character['skills']): Character['skills'] {
  const merged = { ...base };
  
  // For each skill, prefer the one with higher proficiency/expertise
  Object.entries(override).forEach(([skill, value]) => {
    const baseSkill = base[skill as keyof Character['skills']];
    if (value.expertise || (value.proficient && !baseSkill.proficient)) {
      merged[skill as keyof Character['skills']] = value;
    }
  });
  
  return merged;
}

function mergeSavingThrows(base: Character['savingThrows'], override: Character['savingThrows']): Character['savingThrows'] {
  const merged = { ...base };
  
  // For each saving throw, prefer the one with proficiency
  Object.entries(override).forEach(([ability, value]) => {
    const baseSave = base[ability as keyof Character['savingThrows']];
    if (value.proficient && !baseSave.proficient) {
      merged[ability as keyof Character['savingThrows']] = value;
    }
  });
  
  return merged;
}

function mergeSpells(base?: Character['spells'], override?: Character['spells']): Character['spells'] {
  if (!base && !override) return undefined;
  if (!base) return override;
  if (!override) return base;
  
  // For spells, prefer the one with more total spells
  const baseCount = Object.values(base).reduce((sum, level) => sum + level.length, 0);
  const overrideCount = Object.values(override).reduce((sum, level) => sum + level.length, 0);
  
  return overrideCount > baseCount ? override : base;
}

export function autoResolveConflicts(
  importedCharacters: Character[],
  existingCharacters: Character[],
  options?: Partial<ConflictResolutionOptions>
): {
  resolved: Character[];
  skipped: Character[];
  conflicts: ImportConflict[];
} {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const conflicts = findConflicts(importedCharacters, existingCharacters);
  
  if (!opts.autoResolve) {
    return {
      resolved: [],
      skipped: [],
      conflicts,
    };
  }

  const resolved: Character[] = [];
  const skipped: Character[] = [];

  for (const conflict of conflicts) {
    const result = resolveConflict(conflict, opts.defaultResolution);
    
    if (result) {
      resolved.push(result);
    } else {
      skipped.push(conflict.importedCharacter);
    }
  }

  // Add non-conflicting characters
  const conflictingIds = new Set(conflicts.map(c => c.importedCharacter.id));
  const nonConflicting = importedCharacters.filter(char => !conflictingIds.has(char.id));
  resolved.push(...nonConflicting);

  return {
    resolved,
    skipped,
    conflicts: [],
  };
}