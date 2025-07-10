import { Character } from '@/types/character';
import { SpellcastingInfo } from '../components/SpellcastingInfo';
import { SpellSlots } from '../components/SpellSlots';
import { SpellList } from '../components/SpellList';

interface SpellcastingPageProps {
  character: Character;
  isEditMode?: boolean;
}

export function SpellcastingPage({ character, isEditMode = false }: SpellcastingPageProps) {
  return (
    <div className="space-y-4 print:space-y-2">
      <SpellcastingInfo character={character} />
      
      <SpellSlots character={character} isEditMode={isEditMode} />
      
      <SpellList character={character} />
    </div>
  );
}