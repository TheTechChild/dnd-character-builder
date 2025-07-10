import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Heart, Zap, FootprintsIcon } from 'lucide-react';
import { EditableField } from './EditableField';
import { useEditField } from '@/stores/editHooks';

interface CombatStatsProps {
  character: Character;
  isEditMode?: boolean;
}

// Shield AC component
const ShieldAC = ({ value, isEditMode, onSave }: { value: number; isEditMode?: boolean; onSave: (value: number) => void }) => {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <filter id="metalShine">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Shield shape */}
        <path
          d="M 50,10 C 30,10 20,20 20,35 L 20,60 C 20,75 35,85 50,90 C 65,85 80,75 80,60 L 80,35 C 80,20 70,10 50,10 Z"
          fill="url(#shieldGradient)"
          stroke="#7F1D1D"
          strokeWidth="2"
          filter="url(#metalShine)"
        />
        
        {/* Shield decorations */}
        <path
          d="M 30,25 L 70,25 M 30,65 L 70,65"
          stroke="#F59E0B"
          strokeWidth="1"
          opacity="0.8"
        />
        
        {/* Shield center emblem */}
        <circle cx="50" cy="45" r="20" fill="#1F2937" stroke="#F59E0B" strokeWidth="1.5" />
      </svg>
      
      {/* AC Value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-3xl font-bold text-amber-100">
          <EditableField
            value={value}
            onSave={onSave}
            type="number"
            min={0}
            max={30}
            isEditMode={isEditMode}
            className="text-center bg-transparent"
            editClassName="text-center bg-gray-800 text-white rounded"
          />
        </div>
      </div>
    </div>
  );
};

// Animated HP Bar component
const HPBar = ({ 
  current, 
  max, 
  temp = 0,
  isEditMode,
  onSave 
}: { 
  current: number; 
  max: number; 
  temp?: number;
  isEditMode?: boolean;
  onSave: (field: 'current' | 'max' | 'temp', value: number) => void;
}) => {
  const percentage = max > 0 ? (current / max) * 100 : 0;
  const healthColor = percentage > 50 ? 'from-green-600 to-green-700' : 
                      percentage > 25 ? 'from-yellow-600 to-yellow-700' : 
                      'from-red-600 to-red-700';
  
  return (
    <div className="w-full">
      <div className="relative bg-gray-800 rounded-full h-8 overflow-hidden shadow-inner">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 5px,
              rgba(0,0,0,0.1) 5px,
              rgba(0,0,0,0.1) 10px
            )`
          }}
        />
        
        {/* Health bar */}
        <div 
          className={cn(
            "absolute left-0 top-0 h-full bg-gradient-to-r transition-all duration-700 ease-out",
            healthColor
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Liquid animation effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
              style={{
                animation: 'liquidFlow 3s ease-in-out infinite',
                transform: 'skewY(-45deg) translateX(-100%)'
              }}
            />
          </div>
        </div>
        
        {/* Temp HP overlay */}
        {temp > 0 && (
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400/80 to-blue-500/80"
            style={{ width: `${Math.min((temp / max) * 100, 20)}%` }}
          />
        )}
        
        {/* HP Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-1 text-white font-bold text-sm">
            <EditableField
              value={current}
              onSave={(value) => onSave('current', value)}
              type="number"
              min={0}
              max={999}
              isEditMode={isEditMode}
              className="text-center bg-transparent w-12"
              editClassName="text-center bg-gray-700 text-white rounded w-12"
            />
            <span>/</span>
            <EditableField
              value={max}
              onSave={(value) => onSave('max', value)}
              type="number"
              min={1}
              max={999}
              isEditMode={isEditMode}
              className="text-center bg-transparent w-12"
              editClassName="text-center bg-gray-700 text-white rounded w-12"
            />
            {temp > 0 && (
              <>
                <span className="text-blue-300 ml-1">+</span>
                <EditableField
                  value={temp}
                  onSave={(value) => onSave('temp', value)}
                  type="number"
                  min={0}
                  max={999}
                  isEditMode={isEditMode}
                  className="text-center bg-transparent text-blue-300 w-12"
                  editClassName="text-center bg-gray-700 text-blue-300 rounded w-12"
                />
              </>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes liquidFlow {
          0% { transform: skewY(-45deg) translateX(-100%); }
          100% { transform: skewY(-45deg) translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export function CombatStats({ character, isEditMode = false }: CombatStatsProps) {
  const { updateField } = useEditField();
  
  return (
    <div className="space-y-4">
      <div className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4",
        "print:grid-cols-4 print:gap-2"
      )}>
        {/* Armor Class */}
        <div className={cn(
          "bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-lg p-4",
          "border-2 border-amber-700/30 shadow-inner text-center",
          "print:border-black print:bg-white"
        )}>
          <div className="text-sm font-heading font-bold text-amber-900 mb-2">
            ARMOR CLASS
          </div>
          <ShieldAC 
            value={character.armorClass || 10}
            isEditMode={isEditMode}
            onSave={(value) => updateField('armorClass', value)}
          />
        </div>
        
        {/* Initiative */}
        <div className={cn(
          "bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-lg p-4",
          "border-2 border-amber-700/30 shadow-inner text-center",
          "print:border-black print:bg-white"
        )}>
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-6 h-6 text-amber-700" />
          </div>
          <div className="text-sm font-heading font-bold text-amber-900">
            INITIATIVE
          </div>
          <div className="text-3xl font-bold text-amber-900 mt-2">
            {(character.initiative || 0) >= 0 ? '+' : ''}
            <EditableField
              value={character.initiative || 0}
              onSave={(value) => updateField('initiative', value)}
              type="number"
              min={-5}
              max={20}
              isEditMode={isEditMode}
              className="text-center bg-transparent inline"
              editClassName="text-center bg-amber-50 rounded"
            />
          </div>
        </div>
        
        {/* Speed */}
        <div className={cn(
          "bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-lg p-4",
          "border-2 border-amber-700/30 shadow-inner text-center",
          "print:border-black print:bg-white"
        )}>
          <div className="flex items-center justify-center mb-2">
            <FootprintsIcon className="w-6 h-6 text-amber-700" />
          </div>
          <div className="text-sm font-heading font-bold text-amber-900">
            SPEED
          </div>
          <div className="text-3xl font-bold text-amber-900 mt-2">
            <EditableField
              value={character.speed?.base || 30}
              onSave={(value) => updateField('speed', { ...character.speed, base: value })}
              type="number"
              min={0}
              max={120}
              step={5}
              isEditMode={isEditMode}
              className="text-center bg-transparent inline"
              editClassName="text-center bg-amber-50 rounded"
            />
            <span> ft</span>
          </div>
        </div>
        
        {/* Hit Dice */}
        <div className={cn(
          "bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-lg p-4",
          "border-2 border-amber-700/30 shadow-inner text-center",
          "print:border-black print:bg-white"
        )}>
          <div className="flex items-center justify-center mb-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#92400E" />
              <path d="M2 17L12 22L22 17" stroke="#92400E" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="#92400E" strokeWidth="2" />
            </svg>
          </div>
          <div className="text-sm font-heading font-bold text-amber-900">
            HIT DICE
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-2">
            {character.hitDice?.current || character.level}d{character.hitDice?.size || 8}
          </div>
          <div className="text-xs text-amber-700">
            Total: {character.hitDice?.total || `${character.level}d8`}
          </div>
        </div>
      </div>
      
      {/* Hit Points Bar */}
      <div className={cn(
        "bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-lg p-4",
        "border-2 border-amber-700/30 shadow-inner",
        "print:border-black print:bg-white"
      )}>
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-6 h-6 text-red-700" />
          <h3 className="text-lg font-heading font-bold text-amber-900">HIT POINTS</h3>
        </div>
        <HPBar 
          current={character.hitPoints?.current || 0}
          max={character.hitPoints?.max || 1}
          temp={character.hitPoints?.temp || 0}
          isEditMode={isEditMode}
          onSave={(field, value) => {
            updateField('hitPoints', {
              ...character.hitPoints,
              [field]: value
            });
          }}
        />
      </div>
    </div>
  );
}