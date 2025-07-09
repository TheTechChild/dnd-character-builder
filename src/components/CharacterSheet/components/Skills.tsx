import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { getAbilityModifier } from '@/utils/calculations';
import { Circle, CircleDot } from 'lucide-react';

interface SkillsProps {
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

export function Skills({ character }: SkillsProps) {
  const proficiencyBonus = character.proficiencyBonus || 2;
  
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
              className="flex items-center gap-2 text-sm"
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">
                {displayName}
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                  ({SKILL_ABILITY_MAP[key].slice(0, 3).toUpperCase()})
                </span>
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