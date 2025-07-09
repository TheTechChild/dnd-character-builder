import { useState } from 'react';
import { Bookmark, Trash2, ExternalLink, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { useBookmarks } from '@/hooks/useOpen5e';
import { cacheService } from '@/services/cacheService';
import { useToast } from '@/components/ui/use-toast';
import type { Open5eEndpoint } from '@/types/open5e';

const categoryLabels: Record<Open5eEndpoint, string> = {
  spells: 'Spells',
  classes: 'Classes',
  races: 'Races',
  equipment: 'Equipment',
  conditions: 'Conditions',
  magicitems: 'Magic Items',
  monsters: 'Monsters',
};

const categoryColors: Record<Open5eEndpoint, string> = {
  spells: 'bg-purple-500',
  classes: 'bg-blue-500',
  races: 'bg-green-500',
  equipment: 'bg-orange-500',
  conditions: 'bg-red-500',
  magicitems: 'bg-indigo-500',
  monsters: 'bg-gray-500',
};

interface BookmarkItemProps {
  bookmark: {
    id: string;
    name: string;
    category: Open5eEndpoint;
    slug: string;
    timestamp: number;
  };
  onRemove: (id: string) => void;
  onOpen: (category: Open5eEndpoint, slug: string) => void;
}

function BookmarkItem({ bookmark, onRemove, onOpen }: BookmarkItemProps) {
  const formattedDate = new Date(bookmark.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{bookmark.name}</h4>
              <Badge className={`${categoryColors[bookmark.category]} text-white text-xs`}>
                {categoryLabels[bookmark.category]}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Added {formattedDate}</p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpen(bookmark.category, bookmark.slug)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(bookmark.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BookmarkManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Open5eEndpoint | 'all'>('all');
  
  const { toast } = useToast();
  const { data: bookmarks = [], refetch } = useBookmarks();

  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!bookmark.name.toLowerCase().includes(query)) {
        return false;
      }
    }

    if (selectedCategory !== 'all' && bookmark.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  const handleRemove = async (id: string) => {
    await cacheService.removeBookmark(id);
    await refetch();
    toast({
      title: 'Bookmark removed',
      description: 'The bookmark has been removed from your collection',
    });
  };

  const handleOpen = (category: Open5eEndpoint, slug: string) => {
    // In a real implementation, this would open the item in a detail view
    console.log('Open item:', category, slug);
    toast({
      title: 'Opening reference',
      description: `Loading ${category} details...`,
    });
  };

  const groupedBookmarks = filteredBookmarks.reduce((acc, bookmark) => {
    if (!acc[bookmark.category]) {
      acc[bookmark.category] = [];
    }
    acc[bookmark.category].push(bookmark);
    return acc;
  }, {} as Record<Open5eEndpoint, typeof bookmarks>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          <h2 className="text-xl font-semibold">My Bookmarks</h2>
          <Badge variant="secondary">{bookmarks.length}</Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bookmarks..."
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key as Open5eEndpoint)}
              className="hidden sm:inline-flex"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {filteredBookmarks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bookmark className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              {searchQuery || selectedCategory !== 'all'
                ? 'No bookmarks found matching your filters'
                : 'No bookmarks yet. Start exploring and bookmark your favorite references!'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-4 pr-4">
            {selectedCategory === 'all' ? (
              Object.entries(groupedBookmarks).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-600 uppercase tracking-wider">
                    {categoryLabels[category as Open5eEndpoint]} ({items.length})
                  </h3>
                  <div className="grid gap-2">
                    {items.map(bookmark => (
                      <BookmarkItem
                        key={bookmark.id}
                        bookmark={bookmark}
                        onRemove={handleRemove}
                        onOpen={handleOpen}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="grid gap-2">
                {filteredBookmarks.map(bookmark => (
                  <BookmarkItem
                    key={bookmark.id}
                    bookmark={bookmark}
                    onRemove={handleRemove}
                    onOpen={handleOpen}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}