import { z } from 'zod';

// Re-export the character schema for external use
export { CharacterSchema } from '@/utils/validation';

// Additional schema utilities
export const CharacterExportSchema = z.object({
  version: z.string(),
  exportDate: z.string(),
  character: z.any(), // Will be validated by CharacterSchema
});

export const CharacterImportOptionsSchema = z.object({
  overrideId: z.boolean().default(true),
  validateVersion: z.boolean().default(true),
  updateTimestamps: z.boolean().default(true),
});