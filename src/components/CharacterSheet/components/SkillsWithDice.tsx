import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { getAbilityModifier } from '@/utils/calculations';
import { Circle, CircleDot, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiceStore } from '@/stores/diceStore';
import { rollAbilityCheck } from '@/utils/diceRoller';
import { useToast } from '@/components/ui/use-toast';

interface SkillsWithDiceProps {
  character: Character;
}

const SKILL_ABILITY_MAP: Record<string, keyof Character['abilities']> = {
  acrobatics: 'dexterity',
  animalHandling: 'wisdom',
  arcana: 'intelligence',
  athletics: 'strength',
  deception: 'charisma',
  history: 'intelligence',
  insight: 'wisdom',
  intimidation: 'charisma',
  investigation: 'intelligence',
  medicine: 'wisdom',
  nature: 'intelligence',
  perception: 'wisdom',
  performance: 'charisma',
  persuasion: 'charisma',
  religion: 'intelligence',
  sleightOfHand: 'dexterity',
  stealth: 'dexterity',
  survival: 'wisdom'
};

const SKILL_DISPLAY_NAMES: Record<string, string> = {
  acrobatics: 'Acrobatics',
  animalHandling: 'Animal Handling',
  arcana: 'Arcana',
  athletics: 'Athletics',
  deception: 'Deception',
  history: 'History',
  insight: 'Insight',
  intimidation: 'Intimidation',
  investigation: 'Investigation',
  medicine: 'Medicine',
  nature: 'Nature',
  perception: 'Perception',
  performance: 'Performance',
  persuasion: 'Persuasion',
  religion: 'Religion',
  sleightOfHand: 'Sleight of Hand',
  stealth: 'Stealth',
  survival: 'Survival'
};

export function SkillsWithDice({ character }: SkillsWithDiceProps) {
  const proficiencyBonus = character.proficiencyBonus || 2;
  const { toast } = useToast();
  
  const calculateSkillModifier = (skillKey: string): number => {
    const skill = character.skills[skillKey as keyof typeof character.skills];
    const abilityKey = SKILL_ABILITY_MAP[skillKey];
    const abilityScore = character.abilities[abilityKey];
    const abilityModifier = getAbilityModifier(abilityScore);
    
    let modifier = abilityModifier;
    if (skill?.proficient) {
      modifier += proficiencyBonus;
    }
    if (skill?.expertise) {
      modifier += proficiencyBonus;
    }
    
    return modifier;
  };
  
  const handleSkillRoll = (skillKey: string) => {
    const skill = character.skills[skillKey as keyof typeof character.skills];
    const abilityKey = SKILL_ABILITY_MAP[skillKey];
    const abilityScore = character.abilities[abilityKey];
    const abilityModifier = getAbilityModifier(abilityScore);
    
    const result = rollAbilityCheck(
      abilityModifier,
      skill?.proficient ? proficiencyBonus : undefined,
      skill?.expertise
    );
    
    // Override the label with the specific skill name
    const modifiedResult = { ...result, label: `${SKILL_DISPLAY_NAMES[skillKey]} Check` };
    useDiceStore.getState().history.unshift(modifiedResult);
    
    toast({
      title: `${SKILL_DISPLAY_NAMES[skillKey]} Check`,
      description: `Rolled ${result.total}${result.critical === 'hit' ? ' - Natural 20!' : result.critical === 'miss' ? ' - Natural 1!' : ''}`,
      variant: result.critical === 'hit' ? 'default' : result.critical === 'miss' ? 'destructive' : 'default',
    });
  };
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4">SKILLS</h2>
      
      <div className="space-y-1">
        {Object.entries(SKILL_DISPLAY_NAMES).map(([key, displayName]) => {
          const skill = character.skills[key as keyof typeof character.skills];
          const modifier = calculateSkillModifier(key);
          const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          const Icon = skill?.proficient ? CircleDot : Circle;
          
          return (
            <div 
              key={key}
              className="flex items-center gap-2 text-sm group hover:bg-slate-50 dark:hover:bg-slate-800 rounded px-1"
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">
                {displayName}
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  ({SKILL_ABILITY_MAP[key].slice(0, 3).toUpperCase()})
                </span>
              </span>
              <span 
                className="font-medium tabular-nums cursor-pointer hover:text-blue-600"
                onClick={() => handleSkillRoll(key)}
                title={`Click to roll ${displayName} check`}
              >
                {modifierStr}
              </span>
              <Button
                variant="ghost"
                size="small"
                className={cn(
                  "h-6 w-6 p-0",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "print:hidden"
                )}
                onClick={() => handleSkillRoll(key)}
                title={`Roll ${displayName} check`}
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