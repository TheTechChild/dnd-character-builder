import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Skull, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDiceStore } from '@/stores/diceStore';
import { rollDeathSave } from '@/utils/diceRoller';
import { useToast } from '@/components/ui/use-toast';

interface DeathSavesWithDiceProps {
  character: Character;
}

export function DeathSavesWithDice({ character }: DeathSavesWithDiceProps) {
  const successes = character.deathSaves?.successes || 0;
  const failures = character.deathSaves?.failures || 0;
  const { toast } = useToast();
  
  const handleDeathSave = () => {
    const result = rollDeathSave();
    useDiceStore.getState().history.unshift(result);
    
    let message = `Rolled ${result.total}`;
    let variant: "default" | "destructive" = "default";
    
    if (result.critical === 'hit') {
      message = 'Natural 20! You gain 1 hit point and become conscious!';
    } else if (result.critical === 'miss') {
      message = 'Natural 1! You suffer two death save failures!';
      variant = "destructive";
    } else if (result.total >= 10) {
      message = `Success! Rolled ${result.total}`;
    } else {
      message = `Failure! Rolled ${result.total}`;
      variant = "destructive";
    }
    
    toast({
      title: 'Death Saving Throw',
      description: message,
      variant: variant,
    });
  };
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black",
      "relative"
    )}>
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Skull className="w-5 h-5" />
        DEATH SAVES
      </h3>
      
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "absolute top-4 right-4",
          "print:hidden"
        )}
        onClick={handleDeathSave}
      >
        <Dices className="h-4 w-4 mr-2" />
        Roll Save
      </Button>
      
      <div className="space-y-3">
        <div>
          <div className="text-sm font-medium mb-1">Successes</div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={`success-${i}`}
                className={cn(
                  "w-8 h-8 rounded-full border-2",
                  i <= successes
                    ? "bg-green-500 border-green-600"
                    : "border-slate-300 dark:border-slate-600",
                  "print:border-black"
                )}
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-1">Failures</div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={`failure-${i}`}
                className={cn(
                  "w-8 h-8 rounded-full border-2",
                  i <= failures
                    ? "bg-red-500 border-red-600"
                    : "border-slate-300 dark:border-slate-600",
                  "print:border-black"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}