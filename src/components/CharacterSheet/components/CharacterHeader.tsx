import { Character } from '@/types/character';
import { User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CharacterHeaderProps {
  character: Character;
}

export function CharacterHeader({ character }: CharacterHeaderProps) {
  return (
    <div className={cn(
      "bg-slate-100 dark:bg-slate-800 rounded-lg p-4",
      "print:bg-white print:border print:border-black print:p-2"
    )}>
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4">
        <div className={cn(
          "flex items-center justify-center",
          "w-24 h-24 md:w-32 md:h-32",
          "bg-slate-200 dark:bg-slate-700 rounded-lg",
          "print:border print:border-black"
        )}>
          {character.imageUrl ? (
            <img 
              src={character.imageUrl} 
              alt={character.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <User className="w-12 h-12 text-slate-400" />
          )}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">{character.name}</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm md:text-base">
            <div>
              <span className="font-semibold">Class & Level:</span>{' '}
              {character.class} {character.level}
              {character.subclass && ` (${character.subclass})`}
            </div>
            
            <div>
              <span className="font-semibold">Race:</span>{' '}
              {character.race}
              {character.subrace && ` (${character.subrace})`}
            </div>
            
            <div>
              <span className="font-semibold">Background:</span>{' '}
              {character.background || 'None'}
            </div>
            
            <div>
              <span className="font-semibold">Experience:</span>{' '}
              {character.experiencePoints || 0} XP
            </div>
            
            {character.alignment && (
              <div>
                <span className="font-semibold">Alignment:</span>{' '}
                {character.alignment}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}