import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Trash2, Copy, Download, Edit } from 'lucide-react';
import { Character } from '@/types/character';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDistanceToNow } from '@/utils/dateHelpers';

interface CharacterListItemProps {
  character: Character;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const CharacterListItem: React.FC<CharacterListItemProps> = React.memo(({
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

  const { name, level, race, class: characterClass } = character;

  return (
    <div className="relative group">
      <Link
        to={`/characters/${character.id}`}
        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 rounded-lg items-center"
      >
        {/* Checkbox */}
        <div className="col-span-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Name */}
        <div className="col-span-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-gray-600">
                {name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <span className="font-medium truncate">{name || 'Unnamed Character'}</span>
          </div>
        </div>

        {/* Class */}
        <div className="col-span-2 text-sm text-gray-600 truncate">
          {characterClass || 'Adventurer'}
        </div>

        {/* Race */}
        <div className="col-span-2 text-sm text-gray-600 truncate">
          {race || 'Unknown'}
        </div>

        {/* Level */}
        <div className="col-span-1 text-sm text-gray-600">
          {level || 1}
        </div>

        {/* Last Modified */}
        <div className="col-span-2 text-sm text-gray-500">
          {character.updatedAt ? formatDistanceToNow(new Date(character.updatedAt)) : 'Never'}
        </div>

        {/* Actions */}
        <div className="col-span-1 flex justify-end">
          <div className="relative">
            <button
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all p-1 rounded"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showActions && (
              <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg py-1 z-20 min-w-[120px]">
                <Link
                  to={`/characters/${character.id}/edit`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Link>
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