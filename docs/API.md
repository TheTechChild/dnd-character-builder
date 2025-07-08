# Character Data API

## Character Schema

The character data follows a specific JSON schema. Here's the structure:

```typescript
interface Character {
  // Metadata
  id: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  
  // Basic Info
  name: string;
  race: string;
  class: string;
  level: number;
  // ... etc
}
```

## Import/Export Format

### Export
Characters are exported as JSON files with the following naming convention:
`{character-name}-{partial-id}.json`

### Import
The import function validates the JSON against the character schema and ensures:
- All required fields are present
- Data types are correct
- Values are within valid ranges

## LocalStorage

Characters are stored in localStorage under the key `dnd-character-storage`.

## Validation

All character data is validated using Zod schemas. See `src/utils/validation.ts` for the complete schema definition.