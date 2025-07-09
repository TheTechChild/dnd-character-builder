import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { CharacterHeader } from '../components/CharacterHeader';
import { AbilityScores } from '../components/AbilityScores';
import { Skills } from '../components/Skills';
import { SavingThrows } from '../components/SavingThrows';
import { CombatStats } from '../components/CombatStats';
import { Attacks } from '../components/Attacks';
import { DeathSaves } from '../components/DeathSaves';

interface CoreStatsPageProps {
  character: Character;
  isEditMode?: boolean;
}

export function CoreStatsPage({ character, isEditMode = false }: CoreStatsPageProps) {
  return (
    <div className="space-y-4 print:space-y-2">
      <CharacterHeader character={character} isEditMode={isEditMode} />
      
      <div className={cn(
        "grid gap-4",
        "lg:grid-cols-2",
        "print:grid-cols-2 print:gap-2"
      )}>
        <div className="space-y-4 print:space-y-2">
          <AbilityScores character={character} isEditMode={isEditMode} />
          
          <div className="grid gap-4 print:gap-2">
            <div className="text-center">
              <div className="text-lg font-semibold">Proficiency Bonus</div>
              <div className="text-3xl font-bold">+{character.proficiencyBonus || 2}</div>
            </div>
            
            <div className="text-center">
              <div className="text-lg font-semibold">Initiative</div>
              <div className="text-3xl font-bold">
                {character.initiative >= 0 ? '+' : ''}
                {character.initiative || 0}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 print:space-y-2">
          <Skills character={character} />
          <SavingThrows character={character} />
        </div>
      </div>
      
      <div className="border-t pt-4 print:pt-2">
        <CombatStats character={character} />
        
        <div className={cn(
          "grid gap-4 mt-4",
          "lg:grid-cols-2",
          "print:grid-cols-2 print:gap-2 print:mt-2"
        )}>
          <Attacks character={character} />
          <DeathSaves character={character} />
        </div>
      </div>
    </div>
  );
}