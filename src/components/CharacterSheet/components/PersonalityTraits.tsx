import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { User2, Target, Link, AlertTriangle } from 'lucide-react';

interface PersonalityTraitsProps {
  character: Character;
}

export function PersonalityTraits({ character }: PersonalityTraitsProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4">PERSONALITY</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <User2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-sm">Personality Traits</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {character.traits?.join('\n') || 'No personality traits defined.'}
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-sm">Ideals</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {character.ideals || 'No ideals defined.'}
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-sm">Bonds</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {character.bonds || 'No bonds defined.'}
          </p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-sm">Flaws</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {character.flaws || 'No flaws defined.'}
          </p>
        </div>
      </div>
    </div>
  );
}