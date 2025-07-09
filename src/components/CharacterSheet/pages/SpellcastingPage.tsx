import { Character } from '@/types/character';
import { SpellcastingInfo } from '../components/SpellcastingInfo';
import { SpellSlots } from '../components/SpellSlots';
import { SpellList } from '../components/SpellList';

interface SpellcastingPageProps {
  character: Character;
}

export function SpellcastingPage({ character }: SpellcastingPageProps) {
  return (
    <div className="space-y-4 print:space-y-2">
      <SpellcastingInfo character={character} />
      
      <SpellSlots character={character} />
      
      <SpellList character={character} />
    </div>
  );
}