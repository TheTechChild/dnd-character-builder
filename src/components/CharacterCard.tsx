import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Star, Trash2, Copy, Download } from 'lucide-react';
import { Character } from '@/types/character';
import { getAbilityModifier } from '@/utils/calculations';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDistanceToNow } from '@/utils/dateHelpers';

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

  return (
    <div className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          className="touch-target-sm"
        />
      </div>

      <Link to={`/characters/${character.id}`} className="block">
        <div className="p-4 md:p-6">
          {/* Character Portrait Placeholder */}
          <div className="w-full h-24 sm:h-28 md:h-32 bg-gray-200 rounded-md mb-3 md:mb-4 flex items-center justify-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-400">
              {name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          </div>

          {/* Character Info */}
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-base md:text-lg font-bold truncate">{name || 'Unnamed Character'}</h3>
            <p className="text-xs md:text-sm text-gray-600">
              Level {level || 1} {race || 'Unknown'} {characterClass || 'Adventurer'}
            </p>
            
            {/* Stats */}
            <div className="flex justify-between text-xs md:text-sm">
              <span className="font-medium">HP: {currentHP}/{maxHP}</span>
              <span className="font-medium">AC: {ac}</span>
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
    </div>
  );
});