import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Zap } from 'lucide-react';

interface SpellSlotsProps {
  character: Character;
}

export function SpellSlots({ character }: SpellSlotsProps) {
  const spellSlots = character.spellSlots;
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5" />
        SPELL SLOTS
      </h2>
      
      <div className="grid grid-cols-3 md:grid-cols-9 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
          const levelKey = level as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
          const slots = spellSlots?.[levelKey] || { total: 0, expended: 0 };
          const available = slots.total - slots.expended;
          
          return (
            <div 
              key={level}
              className={cn(
                "text-center p-2 rounded",
                "bg-slate-50 dark:bg-slate-800",
                "print:bg-white print:border print:border-black"
              )}
            >
              <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Level {level}
              </div>
              
              {slots.total > 0 ? (
                <>
                  <div className="text-lg font-bold">
                    {available}/{slots.total}
                  </div>
                  
                  <div className="flex justify-center gap-1 mt-1">
                    {Array.from({ length: slots.total }).map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full",
                          index < available
                            ? "bg-purple-500"
                            : "bg-slate-300 dark:bg-slate-600"
                        )}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-slate-400 dark:text-slate-600">—</div>
              )}
            </div>
          );
        })}
      </div>
      
      {false && (
        <div className="mt-4 p-3 rounded bg-purple-50 dark:bg-purple-950/20 print:bg-white print:border print:border-black">
          <h3 className="font-semibold text-sm mb-2">Pact Magic</h3>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm font-medium">Slots:</span>{' '}
              <span className="font-bold">
                0/0
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">Level:</span>{' '}
              <span className="font-bold">0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}