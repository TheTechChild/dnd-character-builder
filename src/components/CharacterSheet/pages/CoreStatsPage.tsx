import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { CharacterHeader } from '../components/CharacterHeader';
import { AbilityScoresWithDice } from '../components/AbilityScoresWithDice';
import { SkillsWithDice } from '../components/SkillsWithDice';
import { SavingThrowsWithDice } from '../components/SavingThrowsWithDice';
import { CombatStats } from '../components/CombatStats';
import { Attacks } from '../components/Attacks';
import { DeathSavesWithDice } from '../components/DeathSavesWithDice';
import { QuickStats } from '../components/QuickStats';

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
          <AbilityScoresWithDice character={character} isEditMode={isEditMode} />
          
          <QuickStats character={character} />
        </div>
        
        <div className="space-y-4 print:space-y-2">
          <SkillsWithDice character={character} />
          <SavingThrowsWithDice character={character} />
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
          <DeathSavesWithDice character={character} />
        </div>
      </div>
    </div>
  );
}