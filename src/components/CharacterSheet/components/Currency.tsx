import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Coins } from 'lucide-react';

interface CurrencyProps {
  character: Character;
}

export function Currency({ character }: CurrencyProps) {
  const currency = character.currency || {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 0,
    pp: 0
  };
  
  const totalInGold = 
    currency.cp / 100 +
    currency.sp / 10 +
    currency.ep / 2 +
    currency.gp +
    currency.pp * 10;
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Coins className="w-5 h-5" />
        CURRENCY
      </h2>
      
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className={cn(
            "text-center p-2 rounded",
            "bg-amber-50 dark:bg-amber-950/20",
            "print:bg-white print:border print:border-black"
          )}>
            <div className="text-xs font-medium text-amber-700 dark:text-amber-400">CP</div>
            <div className="text-xl font-bold">{currency.cp}</div>
          </div>
          
          <div className={cn(
            "text-center p-2 rounded",
            "bg-slate-50 dark:bg-slate-800",
            "print:bg-white print:border print:border-black"
          )}>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400">SP</div>
            <div className="text-xl font-bold">{currency.sp}</div>
          </div>
          
          <div className={cn(
            "text-center p-2 rounded",
            "bg-blue-50 dark:bg-blue-950/20",
            "print:bg-white print:border print:border-black"
          )}>
            <div className="text-xs font-medium text-blue-700 dark:text-blue-400">EP</div>
            <div className="text-xl font-bold">{currency.ep}</div>
          </div>
          
          <div className={cn(
            "text-center p-2 rounded",
            "bg-yellow-50 dark:bg-yellow-950/20",
            "print:bg-white print:border print:border-black"
          )}>
            <div className="text-xs font-medium text-yellow-700 dark:text-yellow-400">GP</div>
            <div className="text-xl font-bold">{currency.gp}</div>
          </div>
        </div>
        
        <div className={cn(
          "text-center p-2 rounded",
          "bg-purple-50 dark:bg-purple-950/20",
          "print:bg-white print:border print:border-black"
        )}>
          <div className="text-xs font-medium text-purple-700 dark:text-purple-400">PP</div>
          <div className="text-xl font-bold">{currency.pp}</div>
        </div>
        
        <div className="border-t pt-2">
          <div className="text-xs text-slate-600 dark:text-slate-400 text-center">
            Total Value
          </div>
          <div className="text-lg font-bold text-center">
            {totalInGold.toFixed(1)} GP
          </div>
        </div>
      </div>
    </div>
  );
}