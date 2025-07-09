import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiceStore } from '@/stores/diceStore';
import { rollInitiative } from '@/utils/diceRoller';
import { useToast } from '@/components/ui/use-toast';

interface QuickStatsProps {
  character: Character;
}

export function QuickStats({ character }: QuickStatsProps) {
  const { toast } = useToast();
  
  const handleInitiativeRoll = () => {
    const result = rollInitiative(character.initiative || 0);
    useDiceStore.getState().history.unshift(result);
    
    toast({
      title: 'Initiative',
      description: `Rolled ${result.total}${result.critical === 'hit' ? ' - Natural 20!' : result.critical === 'miss' ? ' - Natural 1!' : ''}`,
      variant: result.critical === 'hit' ? 'default' : result.critical === 'miss' ? 'destructive' : 'default',
    });
  };
  
  return (
    <div className="grid gap-4 print:gap-2">
      <div className="text-center">
        <div className="text-lg font-semibold">Proficiency Bonus</div>
        <div className="text-3xl font-bold">+{character.proficiencyBonus || 2}</div>
      </div>
      
      <div className="text-center relative group">
        <div className="text-lg font-semibold">Initiative</div>
        <div 
          className="text-3xl font-bold cursor-pointer hover:text-blue-600"
          onClick={handleInitiativeRoll}
          title="Click to roll initiative"
        >
          {character.initiative >= 0 ? '+' : ''}
          {character.initiative || 0}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute -top-2 -right-2 h-6 w-6 p-0",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "print:hidden"
          )}
          onClick={handleInitiativeRoll}
          title="Roll initiative"
        >
          <Dices className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}