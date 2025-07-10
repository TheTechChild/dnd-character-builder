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

// Hexagonal frame component
const HexagonFrame = ({ 
  children, 
  isActive = false,
  className 
}: { 
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}) => {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        style={{ transform: 'scale(1.1)' }}
      >
        <defs>
          <linearGradient id={`hexGradient-${isActive ? 'active' : 'inactive'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isActive ? "#D97706" : "#92400E"} />
            <stop offset="100%" stopColor={isActive ? "#F59E0B" : "#D97706"} />
          </linearGradient>
        </defs>
        <polygon
          points="50,5 85,25 85,75 50,95 15,75 15,25"
          fill="none"
          stroke={`url(#hexGradient-${isActive ? 'active' : 'inactive'})`}
          strokeWidth="2"
          className={cn(
            "transition-all duration-300",
            isActive && "filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          )}
        />
        {/* Inner decorative corners */}
        <path
          d="M 20,28 L 25,30 M 75,30 L 80,28 M 80,72 L 75,70 M 25,70 L 20,72"
          stroke={isActive ? "#F59E0B" : "#D97706"}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="relative z-10 flex items-center justify-center h-full">
        {children}
      </div>
    </div>
  );
};

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
      "bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-lg p-6",
      "border-2 border-amber-700/30 shadow-inner",
      "print:border-black print:bg-white"
    )}>
      <h2 className="text-xl font-heading font-bold mb-6 text-amber-900 text-center tracking-wider">
        ABILITY SCORES
      </h2>
      
      <div className="grid grid-cols-3 gap-6">
        {Object.entries(character.abilities).map(([key, score]) => {
          const abilityKey = key as keyof typeof character.abilities;
          const modifier = getAbilityModifier(score);
          const modifierStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
          
          return (
            <div 
              key={key} 
              className="relative group"
            >
              {/* Dice roll button */}
              <Button
                variant="ghost"
                size="small"
                className={cn(
                  "absolute -top-3 -right-3 h-8 w-8 p-0 z-20",
                  "bg-amber-200/80 hover:bg-amber-300",
                  "border border-amber-700/50",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  "rounded-full",
                  "print:hidden"
                )}
                onClick={() => handleAbilityRoll(abilityKey)}
                title={`Roll ${ABILITY_FULL_NAMES[abilityKey]} check`}
              >
                <Dices className="h-4 w-4 text-amber-900" />
              </Button>
              
              <HexagonFrame 
                isActive={!isEditMode}
                className="w-24 h-24 mx-auto"
              >
                <div className="text-center">
                  <div className="text-xs font-bold text-amber-700 mb-1">
                    {ABILITY_NAMES[abilityKey]}
                  </div>
                  <div className="text-2xl font-bold text-amber-900">
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
                      className="text-center bg-transparent"
                      editClassName="text-center bg-amber-50 rounded"
                    />
                  </div>
                  <div 
                    className={cn(
                      "text-lg font-bold cursor-pointer transition-colors",
                      "text-amber-800 hover:text-amber-600",
                      modifier >= 0 ? "text-green-700" : "text-red-700"
                    )}
                    onClick={() => !isEditMode && handleAbilityRoll(abilityKey)}
                    title={`Click to roll ${ABILITY_FULL_NAMES[abilityKey]} check`}
                  >
                    {modifierStr}
                  </div>
                </div>
              </HexagonFrame>
              
              {/* Decorative dots */}
              <div className="flex justify-center gap-1 mt-2">
                <div className="w-2 h-2 bg-amber-700/30 rounded-full" />
                <div className="w-2 h-2 bg-amber-700/50 rounded-full" />
                <div className="w-2 h-2 bg-amber-700/30 rounded-full" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}