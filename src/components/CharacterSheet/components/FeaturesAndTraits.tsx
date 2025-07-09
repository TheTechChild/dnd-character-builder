import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Sparkles } from 'lucide-react';

interface FeaturesAndTraitsProps {
  character: Character;
}

export function FeaturesAndTraits({ character }: FeaturesAndTraitsProps) {
  const allFeatures = character.features || [];
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        FEATURES & TRAITS
      </h2>
      
      {allFeatures.length > 0 ? (
        <div className="space-y-3">
          {allFeatures.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "p-3 rounded-lg",
                "bg-slate-50 dark:bg-slate-800",
                "print:bg-white print:border print:border-black"
              )}
            >
              <h3 className="font-semibold text-sm mb-1">
                {feature.name}
                {feature.source && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    ({feature.source})
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
          No features or traits defined.
        </p>
      )}
    </div>
  );
}