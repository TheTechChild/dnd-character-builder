import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Shield, Heart, Zap, FootprintsIcon } from 'lucide-react';

interface CombatStatsProps {
  character: Character;
}

export function CombatStats({ character }: CombatStatsProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-4 gap-4",
      "print:grid-cols-4 print:gap-2"
    )}>
      <div className={cn(
        "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center",
        "print:border-black print:p-2"
      )}>
        <div className="flex items-center justify-center mb-2">
          <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          ARMOR CLASS
        </div>
        <div className="text-2xl font-bold">{character.armorClass || 10}</div>
      </div>
      
      <div className={cn(
        "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center",
        "print:border-black print:p-2"
      )}>
        <div className="flex items-center justify-center mb-2">
          <Heart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          HIT POINTS
        </div>
        <div className="text-2xl font-bold">
          {character.hitPoints?.current || 0}/{character.hitPoints?.max || 0}
        </div>
        {character.hitPoints?.temp > 0 && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            +{character.hitPoints.temp} temp
          </div>
        )}
      </div>
      
      <div className={cn(
        "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center",
        "print:border-black print:p-2"
      )}>
        <div className="flex items-center justify-center mb-2">
          <Zap className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          HIT DICE
        </div>
        <div className="text-2xl font-bold">
          {character.hitDice?.current || character.level}d{character.hitDice?.size || 8}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Total: {character.hitDice?.total || `${character.level}d8`}
        </div>
      </div>
      
      <div className={cn(
        "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center",
        "print:border-black print:p-2"
      )}>
        <div className="flex items-center justify-center mb-2">
          <FootprintsIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
          SPEED
        </div>
        <div className="text-2xl font-bold">{character.speed?.base || 30} ft</div>
      </div>
    </div>
  );
}