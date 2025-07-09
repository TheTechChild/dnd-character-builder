import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Skull } from 'lucide-react';

interface DeathSavesProps {
  character: Character;
}

export function DeathSaves({ character }: DeathSavesProps) {
  const successes = character.deathSaves?.successes || 0;
  const failures = character.deathSaves?.failures || 0;
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Skull className="w-5 h-5" />
        DEATH SAVES
      </h3>
      
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