import React, { useState, useMemo, useCallback } from 'react';
import { Plus, Search, Filter, Grid3X3, List, Shield, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  useFilteredCharacters, 
  useViewMode, 
  useSearch, 
  useFilters, 
  useQuickActions,
  useModals,
  useSelectedCharacters,
  useSelectedActions
} from '@/stores';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import PageSection from '@/components/PageSection';
import { Character } from '@/types/character';

// Roman numeral converter
const toRoman = (num: number): string => {
  const romanNumerals = [
    { value: 1000, numeral: 'M' },
    { value: 900, numeral: 'CM' },
    { value: 500, numeral: 'D' },
    { value: 400, numeral: 'CD' },
    { value: 100, numeral: 'C' },
    { value: 90, numeral: 'XC' },
    { value: 50, numeral: 'L' },
    { value: 40, numeral: 'XL' },
    { value: 10, numeral: 'X' },
    { value: 9, numeral: 'IX' },
    { value: 5, numeral: 'V' },
    { value: 4, numeral: 'IV' },
    { value: 1, numeral: 'I' }
  ];
  
  let result = '';
  for (const { value, numeral } of romanNumerals) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result;
};

// Class gem colors
const classGemColors: Record<string, string> = {
  'Fighter': 'from-red-600 to-red-800',
  'Wizard': 'from-purple-600 to-purple-800',
  'Rogue': 'from-gray-600 to-gray-800',
  'Cleric': 'from-yellow-500 to-yellow-700',
  'Ranger': 'from-green-600 to-green-800',
  'Warlock': 'from-violet-600 to-violet-800',
  'Paladin': 'from-sky-500 to-sky-700',
  'Barbarian': 'from-orange-600 to-orange-800',
  'Sorcerer': 'from-pink-600 to-pink-800',
  'Druid': 'from-emerald-600 to-emerald-800',
  'Bard': 'from-rose-600 to-rose-800',
  'Monk': 'from-amber-600 to-amber-800'
};

// Brass control component for filters
const BrassControl = ({ children, className, ...props }: React.ComponentPropsWithoutRef<'button'>) => (
  <button
    className={cn(
      "relative px-4 py-2 rounded-md transition-all duration-200",
      "bg-gradient-to-b from-amber-600 to-amber-700",
      "border-2 border-amber-800 shadow-lg",
      "hover:from-amber-500 hover:to-amber-600 hover:shadow-xl",
      "active:from-amber-700 active:to-amber-800 active:shadow-inner",
      "text-amber-100 font-medium",
      className
    )}
    {...props}
  >
    <div className="absolute inset-0 rounded-md bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />
    {children}
  </button>
);

// Wanted poster card component
const WantedPosterCard = ({ 
  character, 
  isSelected, 
  onSelect,
  delay 
}: { 
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div 
      className="character-card relative group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Parchment background */}
      <div className={cn(
        "relative bg-gradient-to-br from-amber-50 to-amber-100",
        "border-4 border-amber-900/30 rounded-sm",
        "shadow-2xl transform transition-all duration-300",
        "hover:scale-105 hover:rotate-1 hover:shadow-magical-gold",
        "p-6"
      )}>
        {/* Worn paper texture */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.1) 2px,
              rgba(139, 69, 19, 0.1) 4px
            )`
          }}
        />
        
        {/* "WANTED" header */}
        <div className="relative text-center mb-4">
          <h3 className="text-3xl font-heading font-bold text-amber-900 tracking-wider">
            WANTED
          </h3>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mt-1" />
        </div>
        
        {/* Portrait frame */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-dark to-gold-medium rounded-lg transform rotate-1" />
          <div className="relative bg-gray-800 rounded-lg p-1 transform -rotate-1">
            {character.imageUrl && !imageError ? (
              <img 
                src={character.imageUrl}
                alt={character.name}
                className="w-full h-48 object-cover rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center">
                <Shield className="w-16 h-16 text-gray-600" />
              </div>
            )}
          </div>
        </div>
        
        {/* Character info */}
        <div className="relative space-y-3">
          {/* Name */}
          <h4 className="text-xl font-heading font-bold text-center text-amber-900">
            {character.name}
          </h4>
          
          {/* Class with gem */}
          <div className="flex items-center justify-center gap-2">
            <div className={cn(
              "w-6 h-6 rounded-full bg-gradient-to-br shadow-lg",
              classGemColors[character.class] || 'from-gray-600 to-gray-800'
            )}>
              <div className="w-full h-full rounded-full bg-white/20" />
            </div>
            <span className="text-amber-800 font-medium">{character.class || 'Unknown'}</span>
          </div>
          
          {/* Level in roman numerals */}
          <div className="text-center">
            <span className="text-sm text-amber-700">Level</span>
            <p className="text-2xl font-bold text-amber-900">{toRoman(character.level || 1)}</p>
          </div>
          
          {/* Stats as metal plates */}
          <div className="flex justify-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-gray-600 rounded transform rotate-1" />
              <div className="relative bg-gradient-to-b from-gray-300 to-gray-500 px-3 py-1 rounded text-center">
                <div className="text-xs text-gray-700">HP</div>
                <div className="text-lg font-bold text-gray-900">{character.hitPoints?.max || 0}</div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-gray-600 rounded transform -rotate-1" />
              <div className="relative bg-gradient-to-b from-gray-300 to-gray-500 px-3 py-1 rounded text-center">
                <div className="text-xs text-gray-700">AC</div>
                <div className="text-lg font-bold text-gray-900">{character.armorClass || 10}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="bg-white"
          />
        </div>
        
        <Link 
          to={`/character/${character.id}`}
          className="absolute inset-0 z-10"
        />
      </div>
    </div>
  );
};

// Empty tavern state
const EmptyTavernState = () => (
  <div className="text-center py-16">
    <div className="relative max-w-md mx-auto">
      {/* Tavern table illustration */}
      <div className="relative mb-8">
        <svg viewBox="0 0 400 300" className="w-full h-auto">
          {/* Table */}
          <rect x="50" y="150" width="300" height="100" fill="#8B4513" stroke="#654321" strokeWidth="2" />
          <rect x="40" y="250" width="20" height="40" fill="#654321" />
          <rect x="340" y="250" width="20" height="40" fill="#654321" />
          <rect x="180" y="250" width="20" height="40" fill="#654321" />
          <rect x="200" y="250" width="20" height="40" fill="#654321" />
          
          {/* Empty chairs */}
          <path d="M 100,140 L 100,180 L 120,180 L 120,140" stroke="#654321" strokeWidth="2" fill="none" />
          <path d="M 280,140 L 280,180 L 300,180 L 300,140" stroke="#654321" strokeWidth="2" fill="none" />
          
          {/* Candle */}
          <rect x="190" y="130" width="20" height="20" fill="#FFF8DC" />
          <ellipse cx="200" cy="125" rx="5" ry="10" fill="#FFA500" opacity="0.8" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-heading font-bold text-amber-900 mb-4">
        No adventurers in your party
      </h3>
      <p className="text-gray-600 mb-8">
        The tavern is quiet... Time to recruit some heroes!
      </p>
      
      <Link to="/character/new">
        <Button className="relative overflow-hidden group">
          <span className="relative z-10 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Recruit Your First Hero
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-gold-bright/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </Link>
    </div>
  </div>
);

// Ledger list item
const LedgerListItem = ({ 
  character, 
  onDelete, 
  isSelected, 
  onSelect,
  index 
}: { 
  character: Character;
  onDelete: () => void;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const rowClass = index % 2 === 0 ? 'bg-amber-50/30' : 'bg-amber-100/30';
  
  return (
    <div className={cn(
      "grid grid-cols-12 gap-4 px-4 py-3 items-center",
      "border-b border-amber-200/50 transition-all duration-200",
      "hover:bg-amber-200/50 hover:shadow-md",
      rowClass
    )}>
      <div className="col-span-1">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </div>
      <div className="col-span-3 font-heading font-bold text-amber-900">
        <Link to={`/character/${character.id}`} className="hover:text-gold-bright">
          {character.name}
        </Link>
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <div className={cn(
          "w-4 h-4 rounded-full bg-gradient-to-br shadow",
          classGemColors[character.class] || 'from-gray-600 to-gray-800'
        )} />
        <span className="text-amber-800">{character.class || 'Unknown'}</span>
      </div>
      <div className="col-span-2 text-amber-800">{character.race || 'Unknown'}</div>
      <div className="col-span-1 font-bold text-amber-900">{toRoman(character.level || 1)}</div>
      <div className="col-span-2 text-sm text-amber-700">
        {new Date(character.updatedAt).toLocaleDateString()}
      </div>
      <div className="col-span-1">
        <Button
          variant="ghost"
          size="small"
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="text-red-600 hover:text-red-700"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

const CharacterList: React.FC = () => {
  const characters = useFilteredCharacters();
  const [viewMode, setViewMode] = useViewMode();
  const [searchTerm, setSearchTerm] = useSearch();
  const { filters, setFilters, clearFilters } = useFilters();
  const { deleteCharacterWithConfirm: deleteCharacter } = useQuickActions();
  const { modals, openModal, closeModal } = useModals();
  const { selectedIds, isAllSelected } = useSelectedCharacters();
  const { toggleSelectAll, toggleSelect } = useSelectedActions();
  
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


  return (
    <div className="min-h-screen">
      {/* Custom styles */}
      <style>{`
        @keyframes fadeInStagger {
          from {
            opacity: 0;
            transform: translateY(20px) rotate(-2deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
        }
        
        .character-card {
          animation: fadeInStagger 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      
      <PageSection spacing="lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-gold-bright" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gold-gradient">
              Your Adventuring Party
            </h1>
            <Sparkles className="w-10 h-10 text-gold-bright animate-pulse" />
          </div>
          <p className="text-lg text-gray-400">
            {characters.length} {characters.length === 1 ? 'hero stands' : 'heroes stand'} ready for adventure
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 rounded-lg border-2 border-amber-800/50 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search the roster..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-amber-50/50 border-amber-700/50 focus:border-gold-medium"
              />
            </div>

            {/* Brass Controls */}
            <div className="flex flex-wrap gap-2">
              <BrassControl onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 inline mr-2" />
                Filters
                {((filters.class && filters.class.length > 0) || (filters.race && filters.race.length > 0) || filters.minLevel !== undefined || filters.maxLevel !== undefined) && (
                  <span className="ml-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs">
                    {(filters.class?.length || 0) + (filters.race?.length || 0) + (filters.minLevel !== undefined ? 1 : 0) + (filters.maxLevel !== undefined ? 1 : 0)}
                  </span>
                )}
              </BrassControl>

              {/* View Mode Toggle */}
              <div className="flex rounded-md overflow-hidden border-2 border-amber-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "px-3 py-2 transition-all duration-200",
                    viewMode === 'grid'
                      ? "bg-gradient-to-b from-amber-600 to-amber-700 text-amber-100"
                      : "bg-gradient-to-b from-amber-700/50 to-amber-800/50 text-amber-200 hover:from-amber-600/50"
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "px-3 py-2 transition-all duration-200",
                    viewMode === 'list'
                      ? "bg-gradient-to-b from-amber-600 to-amber-700 text-amber-100"
                      : "bg-gradient-to-b from-amber-700/50 to-amber-800/50 text-amber-200 hover:from-amber-600/50"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* New Character */}
              <Link to="/character/new">
                <BrassControl className="bg-gradient-to-b from-green-600 to-green-700 border-green-800 hover:from-green-500 hover:to-green-600">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Recruit Hero
                </BrassControl>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Class Filter */}
              <div>
                <label className="block text-sm font-heading font-bold text-amber-900 mb-2">Class</label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-amber-300 rounded bg-white/50">
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
                      <span className="text-sm text-amber-800">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Race Filter */}
              <div>
                <label className="block text-sm font-heading font-bold text-amber-900 mb-2">Race</label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-amber-300 rounded bg-white/50">
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
                      <span className="text-sm text-amber-800">{race}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Range */}
              <div>
                <label className="block text-sm font-heading font-bold text-amber-900 mb-2">Level Range</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={filters.minLevel || ''}
                    onChange={(e) => setFilters({ ...filters, minLevel: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Min"
                    className="w-20 bg-white/50 border-amber-300"
                  />
                  <span className="text-amber-700">-</span>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={filters.maxLevel || ''}
                    onChange={(e) => setFilters({ ...filters, maxLevel: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Max"
                    className="w-20 bg-white/50 border-amber-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="text-amber-700 hover:text-amber-900"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Character Grid/List */}
        {characters.length === 0 ? (
          <EmptyTavernState />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {characters.map((character, index) => (
                  <WantedPosterCard
                    key={character.id}
                    character={character}
                    isSelected={selectedIds.includes(character.id)}
                    onSelect={() => toggleSelect(character.id)}
                    delay={index * 100}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border-4 border-amber-900/30 overflow-hidden">
                {/* Ledger header */}
                <div className="bg-amber-900/20 grid grid-cols-12 gap-4 px-4 py-3 font-heading font-bold text-amber-900 border-b-2 border-amber-300">
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
                  <div className="col-span-2">Last Entry</div>
                  <div className="col-span-1">Actions</div>
                </div>
                
                {/* Ledger entries */}
                <div>
                  {characters.map((character, index) => (
                    <LedgerListItem
                      key={character.id}
                      character={character}
                      onDelete={() => handleDelete(character.id)}
                      isSelected={selectedIds.includes(character.id)}
                      onSelect={() => toggleSelect(character.id)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </PageSection>

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