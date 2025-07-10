import { Plus, Search, Filter, Grid3X3, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CharacterCard } from '@/components/CharacterCard';
import { ResponsiveLayout, ResponsiveGrid, MobileNavigation } from '@/components/layouts/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { 
  useFilteredCharacters, 
  useViewMode, 
  useSearch, 
  useQuickActions,
  useSelectedActions,
  useSelectedCharacters
} from '@/stores';

export default function ResponsiveCharacterList() {
  const filteredCharacters = useFilteredCharacters();
  const [viewMode, setViewMode] = useViewMode();
  const [searchQuery, setSearchQuery] = useSearch();
  const { deleteCharacterWithConfirm } = useQuickActions();
  const { toggleSelect } = useSelectedActions();
  const { selectedIds } = useSelectedCharacters();

  // Mobile navigation items
  const navItems = [
    { label: 'Characters', icon: <Grid3X3 />, active: true },
    { label: 'Create', icon: <Plus />, href: '/character/new' },
    { label: 'Filter', icon: <Filter />, onClick: () => console.log('Filter') },
  ];

  // Header content
  const header = (
    <div className="py-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold">Your Party</h1>
        
        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => setViewMode('grid')}
            className={cn(viewMode === 'grid' && 'bg-white/10')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setViewMode('list')}
            className={cn(viewMode === 'list' && 'bg-white/10')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile/Tablet Create Button */}
        <Link to="/character/new" className="sm:hidden">
          <Button size="medium" className="w-full">
            <Plus className="w-5 h-5 mr-2" />
            Create Character
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Mobile View Toggle */}
      <div className="flex sm:hidden items-center justify-center gap-1 p-1 bg-dark/50 rounded-lg">
        <Button
          variant="ghost"
          size="small"
          onClick={() => setViewMode('grid')}
          className={cn(
            'flex-1',
            viewMode === 'grid' && 'bg-white/10'
          )}
        >
          Grid
        </Button>
        <Button
          variant="ghost"
          size="small"
          onClick={() => setViewMode('list')}
          className={cn(
            'flex-1',
            viewMode === 'list' && 'bg-white/10'
          )}
        >
          List
        </Button>
      </div>
    </div>
  );

  // Sidebar content for desktop
  const sidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-heading font-semibold mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Characters</span>
            <span className="font-mono">{filteredCharacters.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Selected</span>
            <span className="font-mono">{selectedIds.length}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-heading font-semibold mb-3">Filter by Class</h3>
        <div className="space-y-1">
          {['Fighter', 'Wizard', 'Rogue', 'Cleric'].map(cls => (
            <button
              key={cls}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 text-sm transition-colors"
            >
              {cls}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Determine grid columns based on view mode
  const getGridCols = () => {
    switch (viewMode) {
      case 'list':
        return { default: 1, sm: 1, lg: 1 };
      default: // grid
        return { default: 1, sm: 2, md: 2, lg: 3, xl: 4 };
    }
  };

  return (
    <>
      <ResponsiveLayout
        header={header}
        sidebar={filteredCharacters.length > 0 ? sidebar : undefined}
        className="min-h-screen"
      >
        {filteredCharacters.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-32 h-32 mx-auto bg-dark/50 rounded-full flex items-center justify-center">
                <Grid3X3 className="w-16 h-16 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-heading font-bold">No Characters Yet</h2>
              <p className="text-muted-foreground">
                Begin your adventure by creating your first character.
              </p>
              <Link to="/character/new">
                <Button size="large">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Character
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <ResponsiveGrid cols={getGridCols()}>
            {filteredCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onDelete={() => deleteCharacterWithConfirm(character.id)}
                isSelected={selectedIds.includes(character.id)}
                onSelect={() => toggleSelect(character.id)}
              />
            ))}
          </ResponsiveGrid>
        )}
      </ResponsiveLayout>

      {/* Mobile Navigation */}
      <MobileNavigation items={navItems} />
    </>
  );
}