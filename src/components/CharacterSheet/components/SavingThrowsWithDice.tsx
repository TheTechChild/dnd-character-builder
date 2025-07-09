import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { getAbilityModifier } from '@/utils/calculations';
import { Circle, CircleDot, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiceStore } from '@/stores/diceStore';
import { useToast } from '@/components/ui/use-toast';

interface SavingThrowsWithDiceProps {
  character: Character;
}

const ABILITY_FULL_NAMES = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma'
} as const;

export function SavingThrowsWithDice({ character }: SavingThrowsWithDiceProps) {
  const proficiencyBonus = character.proficiencyBonus || 2;
  const roll = useDiceStore((state) => state.roll);
  const { toast } = useToast();
  
  const calculateSavingThrowModifier = (ability: keyof typeof character.abilities): number => {
    const abilityScore = character.abilities[ability];
    const abilityModifier = getAbilityModifier(abilityScore);
    const savingThrow = character.savingThrows[ability];
    const isProficient = savingThrow?.proficient || false;
    
    return isProficient ? abilityModifier + proficiencyBonus : abilityModifier;
  };
  
  const handleSavingThrow = (ability: keyof typeof character.abilities) => {
    const modifier = calculateSavingThrowModifier(ability);
    const notation = modifier >= 0 ? `1d20+${modifier}` : `1d20${modifier}`;
    const result = roll(notation, `${ABILITY_FULL_NAMES[ability]} Save`);
    
    toast({
      title: `${ABILITY_FULL_NAMES[ability]} Saving Throw`,
      description: `Rolled ${result.total}${result.critical === 'hit' ? ' - Natural 20!' : result.critical === 'miss' ? ' - Natural 1!' : ''}`,
      variant: result.critical === 'hit' ? 'default' : result.critical === 'miss' ? 'destructive' : 'default',
    });
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
              className="flex items-center gap-2 text-sm group hover:bg-slate-50 dark:hover:bg-slate-800 rounded px-1"
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">
                {ability.slice(0, 3).toUpperCase()}
              </span>
              <span 
                className="font-medium tabular-nums cursor-pointer hover:text-blue-600"
                onClick={() => handleSavingThrow(ability)}
                title={`Click to roll ${ABILITY_FULL_NAMES[ability]} saving throw`}
              >
                {modifierStr}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "print:hidden"
                )}
                onClick={() => handleSavingThrow(ability)}
                title={`Roll ${ABILITY_FULL_NAMES[ability]} saving throw`}
              >
                <Dices className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}