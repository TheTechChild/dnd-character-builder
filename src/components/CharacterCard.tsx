import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Star, Trash2, Copy, Download, Shield, Heart, Sword } from 'lucide-react';
import { Character } from '@/types/character';
import { getAbilityModifier } from '@/utils/calculations';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDistanceToNow } from '@/utils/dateHelpers';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CharacterCardProps {
  character: Character;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = React.memo(({
  character,
  onDelete,
  isSelected,
  onSelect
}) => {
  const [showActions, setShowActions] = React.useState(false);

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
    setShowActions(false);
  };

  const { name, level, race, class: characterClass, abilities, hitPoints } = character;
  const currentHP = hitPoints?.current ?? hitPoints?.max ?? 0;
  const maxHP = hitPoints?.max ?? 0;
  const ac = character.armorClass ?? 10 + (abilities?.dexterity ? getAbilityModifier(abilities.dexterity) : 0);
  
  // Class-specific styling
  const classColorMap: Record<string, string> = {
    'Fighter': 'from-red-600/20 to-red-800/20 hover:from-red-600/30 hover:to-red-800/30 border-red-700/50',
    'Wizard': 'from-purple-600/20 to-purple-800/20 hover:from-purple-600/30 hover:to-purple-800/30 border-purple-700/50',
    'Rogue': 'from-gray-600/20 to-gray-800/20 hover:from-gray-600/30 hover:to-gray-800/30 border-gray-700/50',
    'Cleric': 'from-yellow-600/20 to-yellow-800/20 hover:from-yellow-600/30 hover:to-yellow-800/30 border-yellow-700/50',
    'Ranger': 'from-green-600/20 to-green-800/20 hover:from-green-600/30 hover:to-green-800/30 border-green-700/50',
    'Warlock': 'from-indigo-600/20 to-indigo-800/20 hover:from-indigo-600/30 hover:to-indigo-800/30 border-indigo-700/50',
    'Paladin': 'from-amber-600/20 to-amber-800/20 hover:from-amber-600/30 hover:to-amber-800/30 border-amber-700/50',
    'Barbarian': 'from-orange-600/20 to-orange-800/20 hover:from-orange-600/30 hover:to-orange-800/30 border-orange-700/50',
    'Sorcerer': 'from-pink-600/20 to-pink-800/20 hover:from-pink-600/30 hover:to-pink-800/30 border-pink-700/50',
    'Bard': 'from-violet-600/20 to-violet-800/20 hover:from-violet-600/30 hover:to-violet-800/30 border-violet-700/50',
    'Druid': 'from-emerald-600/20 to-emerald-800/20 hover:from-emerald-600/30 hover:to-emerald-800/30 border-emerald-700/50',
    'Monk': 'from-cyan-600/20 to-cyan-800/20 hover:from-cyan-600/30 hover:to-cyan-800/30 border-cyan-700/50'
  };
  
  const classColors = classColorMap[characterClass] || 'from-gray-600/20 to-gray-800/20 hover:from-gray-600/30 hover:to-gray-800/30 border-gray-700/50';

  return (
    <Card 
      variant="elevated" 
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        "bg-gradient-to-br",
        classColors,
        "border-2",
        "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZmFudGFzeSIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik01MCAxMGwyMCAzMGgtNDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC4yIiBvcGFjaXR5PSIwLjEiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuMiIgb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2ZhbnRhc3kpIi8+PC9zdmc+')] before:opacity-20 before:pointer-events-none"
      )}
    >
      {/* Ornate Corner Decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-current opacity-30" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-current opacity-30" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-current opacity-30" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-current opacity-30" />
      
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="touch-target-sm bg-black/50 border-white/30"
        />
      </div>

      <Link to={`/characters/${character.id}`} className="block">
        <div className="p-4 md:p-6">
          {/* Character Portrait with Mystical Frame */}
          <div className="relative w-full h-24 sm:h-28 md:h-32 mb-3 md:mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              {/* Portrait Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icnVuZXMiIHg9IjAiIHk9IjAiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPjxwYXRoIGQ9Ik0yNSA1djQwTTUgMjVoNDAiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMyIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNydW5lcykiLz48L3N2Zz4=')] opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              </div>
            </div>
            {/* Mystical Frame Border */}
            <div className="absolute inset-0 rounded-lg border-2 border-amber-700/50 shadow-[inset_0_0_20px_rgba(251,191,36,0.2)]" />
          </div>

          {/* Character Info */}
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-base md:text-lg font-bold truncate">{name || 'Unnamed Character'}</h3>
            <p className="text-xs md:text-sm text-gray-600">
              Level {level || 1} {race || 'Unknown'} {characterClass || 'Adventurer'}
            </p>
            
            {/* Stats with Medieval Iconography */}
            <div className="flex justify-between items-center text-xs md:text-sm mt-2">
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500" fill="currentColor" />
                <span className="font-medium">{currentHP}/{maxHP}</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-blue-500" />
                <span className="font-medium">{ac}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sword className="w-3 h-3 text-amber-500" />
                <span className="font-medium">Lv {level || 1}</span>
              </div>
            </div>

            {/* Last Modified */}
            <p className="text-xs text-gray-500">
              Last played: {character.updatedAt ? formatDistanceToNow(new Date(character.updatedAt)) : 'Never'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-3 md:mt-4">
            <button
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                // TODO: Implement favorite functionality
              }}
              className="text-gray-400 hover:text-yellow-500 transition-colors touch-target-sm p-2"
            >
              <Star className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors touch-target-sm p-2"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showActions && (
                <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg py-1 z-20 min-w-[120px]">
                  <button
                    onClick={(e) => handleActionClick(e, () => {
                      // TODO: Implement duplicate
                    })}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    <Copy className="w-3 h-3" />
                    Duplicate
                  </button>
                  <button
                    onClick={(e) => handleActionClick(e, () => {
                      // TODO: Implement export
                    })}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={(e) => handleActionClick(e, onDelete)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Click outside to close dropdown */}
      {showActions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowActions(false)}
        />
      )}
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>
    </Card>
  );
});