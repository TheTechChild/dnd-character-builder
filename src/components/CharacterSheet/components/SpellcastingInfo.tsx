import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Wand2, Shield, Target, BookOpen } from 'lucide-react';
import { getSpellcastingAbility, calculateSpellSaveDC, calculateSpellAttackBonus } from '@/utils/spellcasting';

interface SpellcastingInfoProps {
  character: Character;
}

export function SpellcastingInfo({ character }: SpellcastingInfoProps) {
  const spellcastingAbility = getSpellcastingAbility(character);
  const spellSaveDC = calculateSpellSaveDC(character);
  const spellAttackBonus = calculateSpellAttackBonus(character);
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Wand2 className="w-5 h-5" />
        SPELLCASTING
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={cn(
          "text-center p-3 rounded",
          "bg-slate-50 dark:bg-slate-800",
          "print:bg-white print:border print:border-black"
        )}>
          <div className="flex items-center justify-center mb-2">
            <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            SPELLCASTING ABILITY
          </div>
          <div className="text-lg font-bold capitalize">
            {spellcastingAbility || 'None'}
          </div>
        </div>
        
        <div className={cn(
          "text-center p-3 rounded",
          "bg-slate-50 dark:bg-slate-800",
          "print:bg-white print:border print:border-black"
        )}>
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            SPELL SAVE DC
          </div>
          <div className="text-2xl font-bold">{spellSaveDC}</div>
        </div>
        
        <div className={cn(
          "text-center p-3 rounded",
          "bg-slate-50 dark:bg-slate-800",
          "print:bg-white print:border print:border-black"
        )}>
          <div className="flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            SPELL ATTACK BONUS
          </div>
          <div className="text-2xl font-bold">
            {spellAttackBonus >= 0 ? '+' : ''}{spellAttackBonus}
          </div>
        </div>
        
        <div className={cn(
          "text-center p-3 rounded",
          "bg-slate-50 dark:bg-slate-800",
          "print:bg-white print:border print:border-black"
        )}>
          <div className="flex items-center justify-center mb-2">
            <Wand2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            SPELLS KNOWN
          </div>
          <div className="text-2xl font-bold">
            {Object.values(character.spells || {}).reduce((total, levelSpells) => 
              total + (Array.isArray(levelSpells) ? levelSpells.length : 0), 0
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Prepared</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-slate-300 dark:border-slate-600 rounded-full" />
          <span>Not Prepared</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">(R)</span>
          <span>Ritual</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">(C)</span>
          <span>Concentration</span>
        </div>
      </div>
    </div>
  );
}