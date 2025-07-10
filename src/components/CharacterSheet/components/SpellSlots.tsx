import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Sparkles } from 'lucide-react';
import { EditableField } from './EditableField';
import { useEditField } from '@/stores/editHooks';

interface SpellSlotsProps {
  character: Character;
  isEditMode?: boolean;
}

// Glowing orb component
const SpellOrb = ({ 
  isActive, 
  level, 
  onClick 
}: { 
  isActive: boolean; 
  level: number;
  onClick?: () => void;
}) => {
  const colors = {
    1: 'from-blue-400 to-blue-600',
    2: 'from-green-400 to-green-600', 
    3: 'from-yellow-400 to-yellow-600',
    4: 'from-orange-400 to-orange-600',
    5: 'from-red-400 to-red-600',
    6: 'from-purple-400 to-purple-600',
    7: 'from-pink-400 to-pink-600',
    8: 'from-indigo-400 to-indigo-600',
    9: 'from-violet-400 to-violet-600'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "relative w-8 h-8 rounded-full transition-all duration-300",
        onClick && "cursor-pointer hover:scale-110"
      )}
    >
      {/* Outer glow */}
      {isActive && (
        <div 
          className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-br blur-md animate-pulse",
            colors[level as keyof typeof colors]
          )}
        />
      )}
      
      {/* Main orb */}
      <div 
        className={cn(
          "relative w-full h-full rounded-full",
          isActive 
            ? `bg-gradient-to-br ${colors[level as keyof typeof colors]} shadow-lg`
            : "bg-gray-400/30 border-2 border-gray-500/50"
        )}
      >
        {/* Inner shine */}
        {isActive && (
          <>
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/40 to-transparent" />
            <div className="absolute top-1 left-1 w-2 h-2 bg-white/60 rounded-full blur-sm" />
          </>
        )}
      </div>
      
      {/* Mystical particles */}
      {isActive && (
        <div className="absolute inset-0">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-float"
              style={{
                left: `${25 + i * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            />
          ))}
        </div>
      )}
    </button>
  );
};

export function SpellSlots({ character, isEditMode = false }: SpellSlotsProps) {
  const spellSlots = character.spellSlots;
  const { updateField } = useEditField();
  
  const handleSlotClick = (level: number, slotIndex: number) => {
    if (isEditMode) return;
    
    const levelKey = level as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    const slots = spellSlots?.[levelKey];
    if (!slots) return;
    
    const currentExpended = slots.expended;
    const newExpended = slotIndex < (slots.total - currentExpended) 
      ? currentExpended + 1 
      : currentExpended - (slotIndex - (slots.total - currentExpended - 1));
    
    updateField('spellSlots', {
      ...character.spellSlots,
      [levelKey]: {
        ...slots,
        expended: Math.max(0, Math.min(slots.total, newExpended))
      }
    } as typeof character.spellSlots);
  };
  
  return (
    <div className={cn(
      "bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-lg p-6",
      "border-2 border-amber-700/30 shadow-inner",
      "print:border-black print:bg-white"
    )}>
      <h2 className="text-xl font-heading font-bold mb-6 text-amber-900 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-purple-700" />
        SPELL SLOTS
      </h2>
      
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => {
          const levelKey = level as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
          const slots = spellSlots?.[levelKey] || { total: 0, expended: 0 };
          const available = slots.total - slots.expended;
          
          if (slots.total === 0) return null;
          
          return (
            <div 
              key={level}
              className={cn(
                "bg-amber-100/50 rounded-lg p-3",
                "border border-amber-700/20"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-heading font-bold text-amber-900">
                    Level {level}
                  </div>
                  <div className="text-xs text-amber-700">
                    {available} of {slots.total} remaining
                  </div>
                </div>
                
                {isEditMode && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-amber-700">Total:</span>
                    <EditableField
                      value={slots.total}
                      onSave={(value) => {
                        updateField('spellSlots', {
                          ...character.spellSlots,
                          [levelKey]: {
                            ...slots,
                            total: value,
                            expended: Math.min(slots.expended, value)
                          }
                        } as typeof character.spellSlots);
                      }}
                      type="number"
                      min={0}
                      max={9}
                      isEditMode={isEditMode}
                      className="w-8 text-center bg-amber-50"
                      editClassName="w-8 text-center bg-white rounded"
                    />
                  </div>
                )}
              </div>
              
              {/* Spell slot orbs */}
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: slots.total }).map((_, index) => (
                  <SpellOrb
                    key={index}
                    isActive={index < available}
                    level={level}
                    onClick={!isEditMode ? () => handleSlotClick(level, index) : undefined}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0;
          }
          20% { 
            opacity: 1;
          }
          50% { 
            transform: translateY(-20px) translateX(5px); 
            opacity: 0.8;
          }
          80% { 
            opacity: 0.5;
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}