import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Sword } from 'lucide-react';

interface AttacksProps {
  character: Character;
}

export function Attacks({ character }: AttacksProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        <Sword className="w-5 h-5" />
        ATTACKS
      </h3>
      
      <div className="space-y-2">
        {character.attacks?.length > 0 ? (
          character.attacks.slice(0, 3).map((attack, index) => {
            const attackBonus = attack.attackBonus;
            const attackBonusStr = attackBonus >= 0 ? `+${attackBonus}` : `${attackBonus}`;
            
            return (
              <div 
                key={index}
                className={cn(
                  "flex items-center justify-between p-2 rounded",
                  "bg-slate-50 dark:bg-slate-800",
                  "print:bg-white print:border print:border-black"
                )}
              >
                <span className="font-medium">{attack.name}</span>
                <div className="text-sm space-x-2">
                  <span className="font-medium">
                    {attackBonusStr}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {attack.damage} {attack.damageType}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            No attacks
          </div>
        )}
        
        {character.attacks?.length > 3 && (
          <div className="text-sm text-slate-600 dark:text-slate-400 text-center">
            +{character.attacks.length - 3} more...
          </div>
        )}
      </div>
    </div>
  );
}

