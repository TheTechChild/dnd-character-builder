import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Bookmark, BookmarkCheck, Loader2 } from 'lucide-react';
import Fuse from 'fuse.js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useOpen5eMultiSearch } from '@/hooks/useOpen5e';
import { cacheService } from '@/services/cacheService';
import { useToast } from '@/components/ui/use-toast';
import type { Open5eEndpoint, SearchableContent, Open5eItem } from '@/types/open5e';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (item: SearchableContent) => void;
}

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

export function SearchModal({ isOpen, onClose, onSelect }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Open5eEndpoint | 'all'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const searchResults = useOpen5eMultiSearch(searchQuery);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dnd-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Load bookmarks
  useEffect(() => {
    cacheService.getBookmarks().then(bookmarks => {
      setBookmarkedIds(new Set(bookmarks.map(b => b.id)));
    });
  }, []);

  // Save search to recent
  const saveRecentSearch = useCallback((query: string) => {
    if (!query || query.length < 2) return;
    
    const updated = [query, ...recentSearches.filter(q => q !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('dnd-recent-searches', JSON.stringify(updated));
  }, [recentSearches]);

  // Combine and format search results
  const allResults = useMemo(() => {
    const results: SearchableContent[] = [];
    
    searchResults.forEach((query, index) => {
      const endpoint = ['spells', 'classes', 'races', 'equipment', 'conditions', 'magicitems'][index] as Open5eEndpoint;
      
      if (query.data && Array.isArray(query.data)) {
        query.data.forEach((item: unknown) => {
          const typedItem = item as { slug: string; name: string; desc?: string; description?: string };
          results.push({
            id: `${endpoint}:${typedItem.slug}`,
            name: typedItem.name,
            category: endpoint,
            description: typedItem.desc || typedItem.description || '',
            details: typedItem as Open5eItem,
          });
        });
      }
    });

    return results;
  }, [searchResults]);

  // Filter by category
  const filteredResults = useMemo(() => {
    if (selectedCategory === 'all') return allResults;
    return allResults.filter(item => item.category === selectedCategory);
  }, [allResults, selectedCategory]);

  // Fuzzy search on filtered results
  const fuse = useMemo(() => {
    return new Fuse(filteredResults, {
      keys: ['name', 'description'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [filteredResults]);

  const searchedResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return filteredResults;
    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, filteredResults, fuse]);

  const handleSelect = (item: SearchableContent) => {
    saveRecentSearch(searchQuery);
    onSelect?.(item);
    onClose();
  };

  const toggleBookmark = async (item: SearchableContent) => {
    const isBookmarked = bookmarkedIds.has(item.id);
    
    if (isBookmarked) {
      await cacheService.removeBookmark(item.id);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      toast({
        title: 'Bookmark removed',
        description: `${item.name} has been removed from bookmarks`,
      });
    } else {
      await cacheService.addBookmark(item.id, item.name, item.category, item.details.slug);
      setBookmarkedIds(prev => new Set([...prev, item.id]));
      toast({
        title: 'Bookmark added',
        description: `${item.name} has been added to bookmarks`,
      });
    }
  };

  const isLoading = searchResults.some(query => query.isLoading);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl h-[600px] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>D&D 5e Reference Search</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spells, items, rules..."
              className="pl-10"
              autoFocus
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
            )}
          </div>
          
          {searchQuery.length < 2 && recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Open5eEndpoint | 'all')} className="flex-1 flex flex-col">
          <TabsList className="px-6">
            <TabsTrigger value="all">All</TabsTrigger>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TabsTrigger key={key} value={key}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="flex-1 px-6 pb-6">
            <div className="space-y-2 pt-4">
              {searchedResults.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {searchQuery.length >= 2 ? 'No results found' : 'Start typing to search...'}
                </p>
              ) : (
                searchedResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group"
                    onClick={() => handleSelect(item)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <Badge className={`${categoryColors[item.category]} text-white`}>
                          {categoryLabels[item.category]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(item);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {bookmarkedIds.has(item.id) ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </Tabs>

        <div className="px-6 py-3 border-t text-xs text-gray-500 flex items-center justify-between">
          <span>Powered by Open5e API</span>
          <a 
            href="https://open5e.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            open5e.com
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}