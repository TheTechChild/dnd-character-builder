import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { BookOpen, Languages } from 'lucide-react';

interface ProficienciesAndLanguagesProps {
  character: Character;
}

export function ProficienciesAndLanguages({ character }: ProficienciesAndLanguagesProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4">PROFICIENCIES & LANGUAGES</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-sm">Proficiencies</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            {character.otherProficiencies?.length > 0 ? (
              <p>{character.otherProficiencies.join(', ')}</p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                No proficiencies defined.
              </p>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Languages className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h3 className="font-semibold text-sm">Languages</h3>
          </div>
          
          <div className="text-sm">
            {character.languages?.length > 0 ? (
              <p>{character.languages.join(', ')}</p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400">
                No languages defined.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}