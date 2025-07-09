import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { ScrollText, Circle, CircleDot } from 'lucide-react';

interface SpellListProps {
  character: Character;
}

export function SpellList({ character }: SpellListProps) {
  const spellsObj = character.spells;
  
  // Convert the spells object to a format we can work with
  const spellsByLevel: Record<number, Character['spells'] extends undefined ? never : NonNullable<Character['spells']>['cantrips']> = {};
  
  // Handle cantrips
  if (spellsObj && 'cantrips' in spellsObj) {
    spellsByLevel[0] = spellsObj.cantrips;
  }
  
  // Handle leveled spells
  for (let i = 1; i <= 9; i++) {
    const levelKey = i as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    if (spellsObj?.[levelKey]) {
      spellsByLevel[i] = spellsObj[levelKey];
    }
  }
  
  const sortedLevels = Object.keys(spellsByLevel)
    .map(Number)
    .sort((a, b) => a - b);
  
  const totalSpells = Object.values(spellsByLevel).reduce((total, levelSpells) => 
    total + levelSpells.length, 0);
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <ScrollText className="w-5 h-5" />
        SPELL LIST
      </h2>
      
      {totalSpells === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
          No spells known or prepared.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedLevels.map((level) => (
            <div key={level} className="space-y-2">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">
                {level === 0 ? 'CANTRIPS' : `LEVEL ${level}`}
              </h3>
              
              <div className="grid gap-2">
                {spellsByLevel[level].map((spell, index) => {
                  const Icon = spell.prepared !== false ? CircleDot : Circle;
                  
                  return (
                    <div 
                      key={index}
                      className={cn(
                        "p-2 rounded",
                        "bg-slate-50 dark:bg-slate-800",
                        "print:bg-white print:border print:border-black"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {level > 0 && (
                          <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {spell.name}
                            </span>
                            <div className="flex gap-1 text-xs">
                              {spell.ritual && (
                                <span className="font-medium text-purple-600 dark:text-purple-400">
                                  (R)
                                </span>
                              )}
                              {spell.concentration && (
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  (C)
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                            <span className="font-medium">
                              {spell.school}
                            </span>
                            {spell.castingTime && (
                              <span> • {spell.castingTime}</span>
                            )}
                            {spell.range && (
                              <span> • {spell.range}</span>
                            )}
                            {spell.components && (
                              <span> • {spell.components}</span>
                            )}
                          </div>
                          
                          {spell.description && (
                            <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">
                              {spell.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}