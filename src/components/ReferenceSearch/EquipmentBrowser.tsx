import { useState, useMemo } from 'react';
import { Search, BookmarkPlus, BookmarkCheck, Loader2, Sword, Shield, Gem } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEquipment, useMagicItems } from '@/hooks/useOpen5e';
import { cacheService } from '@/services/cacheService';
import { useToast } from '@/components/ui/use-toast';
import type { Open5eEquipment, Open5eMagicItem } from '@/types/open5e';

const equipmentCategories = [
  'All Categories',
  'Weapon',
  'Armor',
  'Adventuring Gear',
  'Tools',
  'Mounts and Vehicles',
  'Trade Goods',
];

const rarityColors: Record<string, string> = {
  Common: 'bg-gray-500',
  Uncommon: 'bg-green-500',
  Rare: 'bg-blue-500',
  'Very Rare': 'bg-purple-500',
  Legendary: 'bg-orange-500',
  Artifact: 'bg-red-500',
};

interface EquipmentCardProps {
  item: Open5eEquipment;
  onBookmark: (item: Open5eEquipment) => void;
  isBookmarked: boolean;
}

function EquipmentCard({ item, onBookmark, isBookmarked }: EquipmentCardProps) {
  const categoryIcon = item.category === 'Weapon' ? Sword : Shield;
  const Icon = categoryIcon;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{item.category}</Badge>
              {item.cost && <Badge variant="secondary">{item.cost}</Badge>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(item)}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {item.damage_dice && (
            <div>
              <span className="font-medium">Damage:</span> {item.damage_dice} {item.damage_type}
            </div>
          )}
          {item.weight && (
            <div>
              <span className="font-medium">Weight:</span> {item.weight}
            </div>
          )}
        </div>

        {item.properties && item.properties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.properties.map((prop, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {prop}
              </Badge>
            ))}
          </div>
        )}

        {item.desc && (
          <>
            <Separator />
            <p className="text-sm">{item.desc}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface MagicItemCardProps {
  item: Open5eMagicItem;
  onBookmark: (item: Open5eMagicItem) => void;
  isBookmarked: boolean;
}

function MagicItemCard({ item, onBookmark, isBookmarked }: MagicItemCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${rarityColors[item.rarity] || 'bg-gray-500'} text-white`}>
                {item.rarity}
              </Badge>
              <Badge variant="outline">{item.type}</Badge>
              {item.requires_attunement === 'requires attunement' && (
                <Badge variant="secondary">Attunement</Badge>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBookmark(item)}
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{item.desc}</p>
      </CardContent>
    </Card>
  );
}

export function EquipmentBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedRarity, setSelectedRarity] = useState('All Rarities');
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const { data: equipment, isLoading: equipmentLoading } = useEquipment();
  const { data: magicItems, isLoading: magicItemsLoading } = useMagicItems();

  // Filter regular equipment
  const filteredEquipment = useMemo(() => {
    if (!equipment) return [];

    return equipment.filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(query) &&
            !(item.desc && item.desc.toLowerCase().includes(query))) {
          return false;
        }
      }

      if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [equipment, searchQuery, selectedCategory]);

  // Filter magic items
  const filteredMagicItems = useMemo(() => {
    if (!magicItems) return [];

    return magicItems.filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(query) &&
            !item.desc.toLowerCase().includes(query)) {
          return false;
        }
      }

      if (selectedRarity !== 'All Rarities' && item.rarity !== selectedRarity) {
        return false;
      }

      return true;
    });
  }, [magicItems, searchQuery, selectedRarity]);

  const handleBookmarkEquipment = async (item: Open5eEquipment) => {
    const itemId = `equipment:${item.slug}`;
    const isBookmarked = bookmarkedItems.has(itemId);
    
    if (isBookmarked) {
      await cacheService.removeBookmark(itemId);
      setBookmarkedItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      toast({
        title: 'Bookmark removed',
        description: `${item.name} has been removed from bookmarks`,
      });
    } else {
      await cacheService.addBookmark(itemId, item.name, 'equipment', item.slug);
      setBookmarkedItems(prev => new Set([...prev, itemId]));
      toast({
        title: 'Bookmark added',
        description: `${item.name} has been added to bookmarks`,
      });
    }
  };

  const handleBookmarkMagicItem = async (item: Open5eMagicItem) => {
    const itemId = `magicitems:${item.slug}`;
    const isBookmarked = bookmarkedItems.has(itemId);
    
    if (isBookmarked) {
      await cacheService.removeBookmark(itemId);
      setBookmarkedItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
      toast({
        title: 'Bookmark removed',
        description: `${item.name} has been removed from bookmarks`,
      });
    } else {
      await cacheService.addBookmark(itemId, item.name, 'magicitems', item.slug);
      setBookmarkedItems(prev => new Set([...prev, itemId]));
      toast({
        title: 'Bookmark added',
        description: `${item.name} has been added to bookmarks`,
      });
    }
  };

  // Load bookmarks
  useMemo(() => {
    cacheService.getBookmarks().then(bookmarks => {
      setBookmarkedItems(new Set(bookmarks.map(b => b.id)));
    });
  }, []);


  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment and magic items..."
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="equipment">
        <TabsList>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="magic">Magic Items</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment" className="space-y-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {equipmentCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {equipmentLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600">
                Showing {filteredEquipment.length} of {equipment?.length || 0} items
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEquipment.map(item => (
                    <EquipmentCard
                      key={item.slug}
                      item={item}
                      onBookmark={handleBookmarkEquipment}
                      isBookmarked={bookmarkedItems.has(`equipment:${item.slug}`)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </TabsContent>

        <TabsContent value="magic" className="space-y-4">
          <Select value={selectedRarity} onValueChange={setSelectedRarity}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Rarities">All Rarities</SelectItem>
              {Object.keys(rarityColors).map(rarity => (
                <SelectItem key={rarity} value={rarity}>
                  {rarity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {magicItemsLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600">
                Showing {filteredMagicItems.length} of {magicItems?.length || 0} magic items
              </div>

              <ScrollArea className="h-[600px] pr-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMagicItems.map(item => (
                    <MagicItemCard
                      key={item.slug}
                      item={item}
                      onBookmark={handleBookmarkMagicItem}
                      isBookmarked={bookmarkedItems.has(`magicitems:${item.slug}`)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}