import { Character } from '@/types/character';
import { CharacterSchemaV2 } from '@/schemas/characterSchemaV2';
import { 
  CharacterExport, 
  BatchExport, 
  isCharacterExport, 
  isBatchExport,
  isCompatibleVersion,
  getExportVersion
} from './export';
import DOMPurify from 'dompurify';

export interface ImportError {
  type: 'validation' | 'parsing' | 'version' | 'unknown';
  field?: string;
  message: string;
  details?: unknown;
}

export interface ImportResult<T> {
  success: boolean;
  data?: T;
  errors?: ImportError[];
}

export interface ImportOptions {
  sanitize?: boolean;
  validateSchema?: boolean;
  maxFileSize?: number; // in bytes
}

const DEFAULT_OPTIONS: ImportOptions = {
  sanitize: true,
  validateSchema: true,
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

export function sanitizeCharacterData(character: unknown): unknown {
  if (typeof character !== 'object' || character === null) {
    return character;
  }

  const sanitized = { ...character } as Record<string, unknown>;

  // Sanitize string fields to prevent XSS
  const stringFields = ['name', 'background', 'alignment', 'notes', 'backstory'];
  stringFields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = DOMPurify.sanitize(sanitized[field], { 
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
      });
    }
  });

  // Sanitize nested objects
  if (sanitized['equipment'] && Array.isArray(sanitized['equipment'])) {
    sanitized['equipment'] = (sanitized['equipment'] as unknown[]).map((item: unknown) => {
      const itemObj = item as Record<string, unknown>;
      return {
      ...itemObj,
      name: typeof itemObj.name === 'string' ? DOMPurify.sanitize(itemObj.name as string, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) : itemObj.name,
      description: typeof itemObj.description === 'string' ? DOMPurify.sanitize(itemObj.description as string, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) : itemObj.description,
    };
    });
  }

  if (sanitized['spells'] && Array.isArray(sanitized['spells'])) {
    sanitized['spells'] = (sanitized['spells'] as unknown[]).map((spell: unknown) => {
      const spellObj = spell as Record<string, unknown>;
      return {
      ...spellObj,
      name: typeof spellObj.name === 'string' ? DOMPurify.sanitize(spellObj.name as string, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) : spellObj.name,
      description: typeof spellObj.description === 'string' ? DOMPurify.sanitize(spellObj.description as string, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) : spellObj.description,
    };
    });
  }

  if (sanitized['features'] && Array.isArray(sanitized['features'])) {
    sanitized['features'] = (sanitized['features'] as unknown[]).map((feature: unknown) => {
      const featureObj = feature as Record<string, unknown>;
      return {
      ...featureObj,
      name: typeof featureObj.name === 'string' ? DOMPurify.sanitize(featureObj.name as string, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) : featureObj.name,
      description: typeof featureObj.description === 'string' ? DOMPurify.sanitize(featureObj.description as string, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) : featureObj.description,
    };
    });
  }

  return sanitized;
}

export async function parseImportFile(file: File, options?: ImportOptions): Promise<ImportResult<CharacterExport | BatchExport>> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const errors: ImportError[] = [];

  // Check file size
  if (opts.maxFileSize && file.size > opts.maxFileSize) {
    return {
      success: false,
      errors: [{
        type: 'validation',
        message: `File size exceeds maximum allowed size of ${opts.maxFileSize / 1024 / 1024}MB`,
      }],
    };
  }

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Check if it's a valid export format
    if (!isCharacterExport(data) && !isBatchExport(data)) {
      return {
        success: false,
        errors: [{
          type: 'validation',
          message: 'Invalid file format. Expected character export data.',
        }],
      };
    }

    // Check version compatibility
    const version = getExportVersion(data);
    if (!isCompatibleVersion(version)) {
      errors.push({
        type: 'version',
        message: `Incompatible version ${version}. This may cause import issues.`,
      });
    }

    // Sanitize data if requested
    if (opts.sanitize) {
      if (isCharacterExport(data)) {
        data.character = sanitizeCharacterData(data.character) as Character;
      } else if (isBatchExport(data)) {
        data.characters = data.characters.map(char => sanitizeCharacterData(char) as Character);
      }
    }

    return {
      success: true,
      data,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        errors: [{
          type: 'parsing',
          message: 'Invalid JSON format',
          details: error.message,
        }],
      };
    }

    return {
      success: false,
      errors: [{
        type: 'unknown',
        message: 'Failed to import file',
        details: error instanceof Error ? error.message : String(error),
      }],
    };
  }
}

export function validateCharacter(character: unknown): ImportResult<Character> {
  const errors: ImportError[] = [];

  try {
    const result = CharacterSchemaV2.safeParse(character);
    
    if (!result.success) {
      result.error.errors.forEach(err => {
        errors.push({
          type: 'validation',
          field: err.path.join('.'),
          message: err.message,
        });
      });

      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      errors: [{
        type: 'unknown',
        message: 'Validation failed',
        details: error instanceof Error ? error.message : String(error),
      }],
    };
  }
}

export async function importCharacterFromFile(
  file: File,
  options?: ImportOptions
): Promise<ImportResult<Character>> {
  const parseResult = await parseImportFile(file, options);
  
  if (!parseResult.success || !parseResult.data) {
    return {
      success: false,
      errors: parseResult.errors,
    };
  }

  if (isCharacterExport(parseResult.data)) {
    const validationResult = validateCharacter(parseResult.data.character);
    
    if (!validationResult.success) {
      return {
        success: false,
        errors: [
          ...(parseResult.errors || []),
          ...(validationResult.errors || []),
        ],
      };
    }

    return {
      success: true,
      data: validationResult.data,
      errors: parseResult.errors,
    };
  }

  return {
    success: false,
    errors: [{
      type: 'validation',
      message: 'File contains multiple characters. Use batch import instead.',
    }],
  };
}

export async function importCharactersFromFile(
  file: File,
  options?: ImportOptions
): Promise<ImportResult<Character[]>> {
  const parseResult = await parseImportFile(file, options);
  
  if (!parseResult.success || !parseResult.data) {
    return {
      success: false,
      errors: parseResult.errors,
    };
  }

  const characters: Character[] = [];
  const errors: ImportError[] = [...(parseResult.errors || [])];

  if (isCharacterExport(parseResult.data)) {
    const validationResult = validateCharacter(parseResult.data.character);
    
    if (validationResult.success && validationResult.data) {
      characters.push(validationResult.data);
    } else {
      errors.push(...(validationResult.errors || []));
    }
  } else if (isBatchExport(parseResult.data)) {
    parseResult.data.characters.forEach((char, index) => {
      const validationResult = validateCharacter(char);
      
      if (validationResult.success && validationResult.data) {
        characters.push(validationResult.data);
      } else {
        validationResult.errors?.forEach((err: ImportError) => {
          errors.push({
            ...err,
            field: `characters[${index}].${err.field || ''}`,
          });
        });
      }
    });
  }

  return {
    success: characters.length > 0,
    data: characters.length > 0 ? characters : undefined,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export async function importFromURL(
  url: string,
  options?: ImportOptions
): Promise<ImportResult<Character | Character[]>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      return {
        success: false,
        errors: [{
          type: 'unknown',
          message: `Failed to fetch from URL: ${response.statusText}`,
        }],
      };
    }

    const blob = await response.blob();
    const file = new File([blob], 'import.json', { type: 'application/json' });
    
    // Try to import as batch first
    const batchResult = await importCharactersFromFile(file, options);
    if (batchResult.success) {
      return batchResult;
    }

    // If batch fails, try single character
    const singleResult = await importCharacterFromFile(file, options);
    return singleResult;
  } catch (error) {
    return {
      success: false,
      errors: [{
        type: 'unknown',
        message: 'Failed to import from URL',
        details: error instanceof Error ? error.message : String(error),
      }],
    };
  }
}