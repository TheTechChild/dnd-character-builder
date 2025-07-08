import { Character } from '@/types/schema';

export function exportCharacter(character: Character): void {
  const dataStr = JSON.stringify(character, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  
  const shortId = character.id.split('-')[0];
  const filename = character.name 
    ? `${character.name}-${shortId}.json`
    : `character-${shortId}.json`;
  
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}