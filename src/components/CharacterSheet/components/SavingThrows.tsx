import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { getAbilityModifier } from '@/utils/calculations';
import { Circle, CircleDot } from 'lucide-react';

interface SavingThrowsProps {
  character: Character;
}


export function SavingThrows({ character }: SavingThrowsProps) {
  const proficiencyBonus = character.proficiencyBonus || 2;
  
  const calculateSavingThrowModifier = (ability: keyof typeof character.abilities): number => {
    const abilityScore = character.abilities[ability];
    const abilityModifier = getAbilityModifier(abilityScore);
    const savingThrow = character.savingThrows[ability];
    const isProficient = savingThrow?.proficient || false;
    
    return isProficient ? abilityModifier + proficiencyBonus : abilityModifier;
  };
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4">SAVING THROWS</h2>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {(Object.keys(character.abilities) as Array<keyof typeof character.abilities>).map((ability) => {
          const isProficient = character.savingThrows[ability]?.proficient || false;
          const modifier = calculateSavingThrowModifier(ability);
          const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          const Icon = isProficient ? CircleDot : Circle;
          
          return (
            <div 
              key={ability}
              className="flex items-center gap-2 text-sm"
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">
                {ability.slice(0, 3).toUpperCase()}
              </span>
              <span className="font-medium tabular-nums">
                {modifierStr}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}