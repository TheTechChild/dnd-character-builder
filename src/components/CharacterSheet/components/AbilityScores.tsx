import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { getAbilityModifier } from '@/utils/calculations';
import { EditableField } from './EditableField';
import { useEditField } from '@/stores/editHooks';

interface AbilityScoresProps {
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

export function AbilityScores({ character, isEditMode = false }: AbilityScoresProps) {
  const { updateField } = useEditField();
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
                "print:border-black"
              )}
            >
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
              <div className="text-sm font-medium">({modifierStr})</div>
              
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