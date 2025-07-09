import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { getAbilityModifier } from '@/utils/calculations';
import { EditableField } from './EditableField';
import { useEditField } from '@/stores/editHooks';
import { Button } from '@/components/ui/button';
import { Dices } from 'lucide-react';
import { useDiceStore } from '@/stores/diceStore';
import { useToast } from '@/components/ui/use-toast';

interface AbilityScoresWithDiceProps {
  character: Character;
  isEditMode?: boolean;
}

const ABILITY_NAMES = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA'
} as const;

const ABILITY_FULL_NAMES = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma'
} as const;

export function AbilityScoresWithDice({ character, isEditMode = false }: AbilityScoresWithDiceProps) {
  const { updateField } = useEditField();
  const roll = useDiceStore((state) => state.roll);
  const { toast } = useToast();
  
  const handleAbilityRoll = (ability: keyof typeof character.abilities) => {
    const modifier = getAbilityModifier(character.abilities[ability]);
    const notation = modifier >= 0 ? `1d20+${modifier}` : `1d20${modifier}`;
    const result = roll(notation, `${ABILITY_FULL_NAMES[ability]} Check`);
    
    toast({
      title: `${ABILITY_FULL_NAMES[ability]} Check`,
      description: `Rolled ${result.total}${result.critical === 'hit' ? ' - Natural 20!' : result.critical === 'miss' ? ' - Natural 1!' : ''}`,
      variant: result.critical === 'hit' ? 'default' : result.critical === 'miss' ? 'destructive' : 'default',
    });
  };
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4">ABILITY SCORES</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(character.abilities).map(([key, score]) => {
          const abilityKey = key as keyof typeof character.abilities;
          const modifier = getAbilityModifier(score);
          const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          
          return (
            <div 
              key={key} 
              className={cn(
                "text-center space-y-1",
                "border border-slate-200 dark:border-slate-700 rounded p-2",
                "print:border-black",
                "relative group"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "absolute -top-2 -right-2 h-6 w-6 p-0",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "print:hidden"
                )}
                onClick={() => handleAbilityRoll(abilityKey)}
                title={`Roll ${ABILITY_FULL_NAMES[abilityKey]} check`}
              >
                <Dices className="h-4 w-4" />
              </Button>
              
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {ABILITY_NAMES[abilityKey]}
              </div>
              <div className="text-2xl font-bold">
                <EditableField
                  value={score}
                  onSave={(value) => {
                    updateField('abilities', {
                      ...character.abilities,
                      [abilityKey]: value
                    });
                  }}
                  type="number"
                  min={1}
                  max={30}
                  isEditMode={isEditMode}
                  className="text-center"
                  editClassName="text-center"
                />
              </div>
              <div 
                className="text-sm font-medium cursor-pointer hover:text-blue-600"
                onClick={() => !isEditMode && handleAbilityRoll(abilityKey)}
                title={`Click to roll ${ABILITY_FULL_NAMES[abilityKey]} check`}
              >
                ({modifierStr})
              </div>
              
              <div className="flex justify-center gap-1 mt-1">
                <div className={cn(
                  "w-3 h-3 border border-slate-300 dark:border-slate-600 rounded-sm",
                  "print:border-black"
                )} />
                <div className={cn(
                  "w-3 h-3 border border-slate-300 dark:border-slate-600 rounded-sm",
                  "print:border-black"
                )} />
                <div className={cn(
                  "w-3 h-3 border border-slate-300 dark:border-slate-600 rounded-sm",
                  "print:border-black"
                )} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}