import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from '@/types/character';
import { cn } from '@/lib/utils';
import { Shield, Heart, Sword, Star, MoreVertical } from 'lucide-react';
import { getAbilityModifier } from '@/utils/calculations';

interface DesktopCharacterCardProps {
  character: Character;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function DesktopCharacterCard({
  character,
  onDelete,
  isSelected,
  onSelect
}: DesktopCharacterCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const ac = character.armorClass ?? 10 + (character.abilities?.dexterity ? getAbilityModifier(character.abilities.dexterity) : 0);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl opacity-0 transition-all duration-500",
        "bg-gradient-to-br from-gold-bright/20 via-transparent to-mystic-bright/20",
        "blur-xl scale-110",
        isHovered && "opacity-100 scale-100"
      )} />

      <div className={cn(
        "relative rounded-xl overflow-hidden",
        "bg-gradient-to-br from-dark to-darker",
        "border-2 border-border-subtle",
        "transition-all duration-300",
        "hover:border-gold-bright/50",
        "hover:shadow-magical-gold",
        "hover:-translate-y-1",
        "will-transform"
      )}>
        {/* Decorative corner pieces */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <path 
              d="M0,0 L32,0 Q0,0 0,32 Z" 
              fill="url(#goldGradient)" 
              opacity="0.3"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#FFA500" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 rotate-90">
          <svg viewBox="0 0 64 64" className="w-full h-full">
            <path 
              d="M0,0 L32,0 Q0,0 0,32 Z" 
              fill="url(#goldGradient)" 
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Character portrait with parallax effect */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <div 
            className="absolute inset-0 transition-transform duration-700 will-transform"
            style={{
              transform: isHovered ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(255,255,255,0.1)_50%,transparent_80%)]" />
            </div>
            
            {/* Character initial */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={cn(
                "text-6xl font-heading font-bold",
                "bg-gradient-to-br from-gold-bright to-gold-dark",
                "bg-clip-text text-transparent",
                "drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]",
                "transition-all duration-500",
                isHovered && "scale-110 rotate-3"
              )}>
                {character.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            </div>
          </div>

          {/* Magical overlay effect */}
          <div className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100"
          )}>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gold-bright/10 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-heading font-bold mb-1">
              {character.name || 'Unnamed Character'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Level {character.level || 1} {character.race || 'Unknown'} {character.class || 'Adventurer'}
            </p>
          </div>

          {/* Stats with animated bars */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">HP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-dark rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                    style={{
                      width: `${(character.hitPoints?.current ?? 0) / (character.hitPoints?.max ?? 1) * 100}%`
                    }}
                  />
                </div>
                <span className="text-sm font-mono">
                  {character.hitPoints?.current ?? 0}/{character.hitPoints?.max ?? 0}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">AC</span>
              </div>
              <span className="text-sm font-mono">{ac}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sword className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium">Level</span>
              </div>
              <span className="text-sm font-mono">{character.level || 1}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implement favorite
              }}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-gold-bright/10 hover:text-gold-bright",
                "hover:scale-110"
              )}
            >
              <Star className="w-5 h-5" />
            </button>

            <Link 
              to={`/character/${character.id}`}
              className={cn(
                "px-4 py-2 rounded-lg",
                "bg-gradient-to-r from-gold-dark to-gold-bright",
                "text-darker font-semibold",
                "transition-all duration-200",
                "hover:shadow-magical-gold",
                "hover:scale-105",
                "active:scale-95"
              )}
            >
              View Character
            </Link>

            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-red-500/10 hover:text-red-500",
                "hover:scale-110"
              )}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selection checkbox with glow */}
        <div className={cn(
          "absolute top-4 left-4 z-20",
          isSelected && "drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
        )}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-5 h-5 rounded accent-gold-bright cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}