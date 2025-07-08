import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Search, Filter, Grid3X3, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  useFilteredCharacters, 
  useViewMode, 
  useSearch, 
  useFilters, 
  useSort,
  useQuickActions,
  useModals,
  useSelectedCharacters,
  useSelectedActions,
  type SortBy
} from '@/stores';
import { CharacterCard } from '@/components/CharacterCard';
import { CharacterListItem } from '@/components/CharacterListItem';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const CharacterList: React.FC = () => {
  const characters = useFilteredCharacters();
  const [viewMode, setViewMode] = useViewMode();
  const [searchTerm, setSearchTerm] = useSearch();
  const { filters, setFilters, clearFilters } = useFilters();
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useSort();
  const { deleteCharacterWithConfirm: deleteCharacter } = useQuickActions();
  const { modals, openModal, closeModal } = useModals();
  const { selectedIds, isAllSelected } = useSelectedCharacters();
  const { toggleSelectAll, toggleSelect, clearSelection } = useSelectedActions();
  
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Memoized values
  const uniqueClasses = useMemo(() => {
    const classes = new Set<string>();
    characters.forEach(char => {
      if (char.class) classes.add(char.class);
    });
    return Array.from(classes).sort();
  }, [characters]);

  const uniqueRaces = useMemo(() => {
    const races = new Set<string>();
    characters.forEach(char => {
      if (char.race) races.add(char.race);
    });
    return Array.from(races).sort();
  }, [characters]);


  // Handlers
  const handleDelete = useCallback((characterId: string) => {
    setCharacterToDelete(characterId);
    openModal('deleteConfirm');
  }, [openModal]);

  const confirmDelete = useCallback(() => {
    if (characterToDelete) {
      deleteCharacter(characterToDelete);
      setCharacterToDelete(null);
      closeModal('deleteConfirm');
    }
  }, [characterToDelete, deleteCharacter, closeModal]);

  const handleBulkDelete = useCallback(() => {
    if (selectedIds.length > 0) {
      // TODO: Implement bulk delete
      clearSelection();
    }
  }, [selectedIds, clearSelection]);

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'level', label: 'Level' },
    { value: 'lastModified', label: 'Last Modified' },
    { value: 'created', label: 'Date Created' },
    { value: 'class', label: 'Class' },
    { value: 'race', label: 'Race' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Characters</h1>
          <p className="text-gray-600 mt-1">
            {characters.length} {characters.length === 1 ? 'character' : 'characters'}
          </p>
        </div>
        <Link to="/characters/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Character
          </Button>
        </Link>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-gray-100' : ''}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {((filters.class && filters.class.length > 0) || (filters.race && filters.race.length > 0) || filters.minLevel !== undefined || filters.maxLevel !== undefined) && (
              <span className="ml-2 bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                {(filters.class?.length || 0) + (filters.race?.length || 0) + (filters.minLevel !== undefined ? 1 : 0) + (filters.maxLevel !== undefined ? 1 : 0)}
              </span>
            )}
          </Button>

          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortBy)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by">
                Sort by {sortOptions.find(opt => opt.value === sortBy)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Order */}
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Class Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Class</label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                  {uniqueClasses.map(cls => (
                    <label key={cls} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.class?.includes(cls) || false}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setFilters({ ...filters, class: [...(filters.class || []), cls] });
                          } else {
                            setFilters({ ...filters, class: (filters.class || []).filter((c: string) => c !== cls) });
                          }
                        }}
                      />
                      <span className="text-sm">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Race Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Race</label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                  {uniqueRaces.map(race => (
                    <label key={race} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={filters.race?.includes(race) || false}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setFilters({ ...filters, race: [...(filters.race || []), race] });
                          } else {
                            setFilters({ ...filters, race: (filters.race || []).filter((r: string) => r !== race) });
                          }
                        }}
                      />
                      <span className="text-sm">{race}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Level Range</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={filters.minLevel || ''}
                    onChange={(e) => setFilters({ ...filters, minLevel: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Min"
                    className="w-20"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={filters.maxLevel || ''}
                    onChange={(e) => setFilters({ ...filters, maxLevel: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Max"
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center">
            <span className="text-sm">
              {selectedIds.length} {selectedIds.length === 1 ? 'character' : 'characters'} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearSelection}>
                Clear Selection
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                Delete Selected
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Character Grid/List */}
      {characters.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onDelete={() => handleDelete(character.id)}
                  isSelected={selectedIds.includes(character.id)}
                  onSelect={() => toggleSelect(character.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {/* List Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-2 font-medium text-sm text-gray-600 border-b">
                <div className="col-span-1">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </div>
                <div className="col-span-3">Name</div>
                <div className="col-span-2">Class</div>
                <div className="col-span-2">Race</div>
                <div className="col-span-1">Level</div>
                <div className="col-span-2">Last Modified</div>
                <div className="col-span-1">Actions</div>
              </div>
              {characters.map((character) => (
                <CharacterListItem
                  key={character.id}
                  character={character}
                  onDelete={() => handleDelete(character.id)}
                  isSelected={selectedIds.includes(character.id)}
                  onSelect={() => toggleSelect(character.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={modals.deleteConfirm.isOpen}
        onClose={() => closeModal('deleteConfirm')}
        onConfirm={confirmDelete}
        characterName={characters.find(c => c.id === characterToDelete)?.name || ''}
      />
    </div>
  );
};

export default React.memo(CharacterList);