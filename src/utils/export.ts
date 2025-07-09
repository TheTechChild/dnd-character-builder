import { saveAs } from 'file-saver';
import { Character } from '@/types/character';

export interface ExportMetadata {
  version: string;
  exportDate: string;
  application: string;
  exportFormat: 'json' | 'pdf';
}

export interface CharacterExport {
  metadata: ExportMetadata;
  character: Character;
}

export interface BatchExport {
  metadata: ExportMetadata;
  characters: Character[];
}

const APPLICATION_NAME = 'dnd-character-builder';
const EXPORT_VERSION = '1.0.0';

export function createExportMetadata(format: 'json' | 'pdf' = 'json'): ExportMetadata {
  return {
    version: EXPORT_VERSION,
    exportDate: new Date().toISOString(),
    application: APPLICATION_NAME,
    exportFormat: format,
  };
}

export function formatFilename(
  characterName: string,
  extension: string,
  includeDate = true
): string {
  const sanitizedName = characterName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  if (includeDate) {
    const date = new Date().toISOString().split('T')[0];
    return sanitizedName ? `${sanitizedName}-${date}.${extension}` : `${date}.${extension}`;
  }
  
  return sanitizedName ? `${sanitizedName}.${extension}` : `unnamed.${extension}`;
}

export function formatBatchFilename(extension: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `dnd-characters-${date}.${extension}`;
}

export async function exportCharacterToJSON(character: Character): Promise<void> {
  const exportData: CharacterExport = {
    metadata: createExportMetadata('json'),
    character,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json;charset=utf-8',
  });

  const filename = formatFilename(character.name, 'json');
  saveAs(blob, filename);
}

export async function exportCharactersToJSON(characters: Character[]): Promise<void> {
  if (characters.length === 0) {
    throw new Error('No characters to export');
  }

  if (characters.length === 1) {
    return exportCharacterToJSON(characters[0]);
  }

  const exportData: BatchExport = {
    metadata: createExportMetadata('json'),
    characters,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json;charset=utf-8',
  });

  const filename = formatBatchFilename('json');
  saveAs(blob, filename);
}

export function isCharacterExport(data: unknown): data is CharacterExport {
  return (
    data !== null &&
    data !== undefined &&
    typeof data === 'object' &&
    'metadata' in data &&
    'character' in data &&
    !('characters' in data)
  );
}

export function isBatchExport(data: unknown): data is BatchExport {
  return (
    data !== null &&
    data !== undefined &&
    typeof data === 'object' &&
    'metadata' in data &&
    'characters' in data &&
    Array.isArray((data as { characters: unknown }).characters)
  );
}

export function getExportVersion(data: CharacterExport | BatchExport): string {
  return data.metadata?.version || '0.0.0';
}

export function isCompatibleVersion(version: string): boolean {
  const [major] = version.split('.');
  const [currentMajor] = EXPORT_VERSION.split('.');
  return major === currentMajor;
}

// Legacy export function for backwards compatibility
export function exportCharacter(character: Character): void {
  exportCharacterToJSON(character).catch(console.error);
}