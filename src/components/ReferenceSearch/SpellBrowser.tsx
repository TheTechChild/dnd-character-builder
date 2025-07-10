import { useState, useMemo } from 'react';
import { Search, BookmarkPlus, BookmarkCheck, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSpells } from '@/hooks/useOpen5e';
import { cacheService } from '@/services/cacheService';
import { useToast } from '@/components/ui/use-toast';
import type { Open5eSpell } from '@/types/open5e';

const spellSchools = [
  'All Schools',
  'Abjuration',
  'Conjuration',
  'Divination',
  'Enchantment',
  'Evocation',
  'Illusion',
  'Necromancy',
  'Transmutation',
];

const spellLevels = [
  'All Levels',
  'Cantrip',
  '1st Level',
  '2nd Level',
  '3rd Level',
  '4th Level',
  '5th Level',
  '6th Level',
  '7th Level',
  '8th Level',
  '9th Level',
];

interface SpellCardProps {
  spell: Open5eSpell;
  onBookmark: (spell: Open5eSpell) => void;
  isBookmarked: boolean;
}

function SpellCard({ spell, onBookmark, isBookmarked }: SpellCardProps) {
  const schoolColors: Record<string, string> = {
    Abjuration: 'bg-blue-500',
    Conjuration: 'bg-yellow-500',
    Divination: 'bg-gray-500',
    Enchantment: 'bg-pink-500',
    Evocation: 'bg-red-500',
    Illusion: 'bg-purple-500',
    Necromancy: 'bg-green-500',
    Transmutation: 'bg-orange-500',
  };

  const levelText = spell.level_int === 0 ? 'Cantrip' : `Level ${spell.level_int}`;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{spell.name}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${schoolColors[spell.school] || 'bg-gray-500'} text-white`}>
                {spell.school}
              </Badge>
              <Badge variant="secondary">{levelText}</Badge>
              {spell.ritual === 'yes' && <Badge variant="secondary">Ritual</Badge>}
              {spell.concentration === 'yes' && <Badge variant="secondary">Concentration</Badge>}
            </div>
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={() => onBookmark(spell)}
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
          <div>
            <span className="font-medium">Casting Time:</span> {spell.casting_time}
          </div>
          <div>
            <span className="font-medium">Range:</span> {spell.range}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {spell.duration}
          </div>
          <div>
            <span className="font-medium">Components:</span> {spell.components}
          </div>
        </div>
        
        {spell.material && (
          <div className="text-sm">
            <span className="font-medium">Material:</span> {spell.material}
          </div>
        )}

        <Separator />

        <div className="text-sm space-y-2">
          <p>{spell.desc}</p>
          {spell.higher_level && (
            <>
              <p className="font-medium">At Higher Levels:</p>
              <p>{spell.higher_level}</p>
            </>
          )}
        </div>

        <Separator />

        <div className="text-sm">
          <span className="font-medium">Classes:</span> {spell.dnd_class}
        </div>
      </CardContent>
    </Card>
  );
}

export function SpellBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('All Schools');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [bookmarkedSpells, setBookmarkedSpells] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const { data: spells, isLoading, error } = useSpells();

  // Filter spells
  const filteredSpells = useMemo(() => {
    if (!spells) return [];

    return spells.filter(spell => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!spell.name.toLowerCase().includes(query) &&
            !spell.desc.toLowerCase().includes(query)) {
          return false;
        }
      }

      // School filter
      if (selectedSchool !== 'All Schools' && spell.school !== selectedSchool) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'All Levels') {
        if (selectedLevel === 'Cantrip' && spell.level_int !== 0) return false;
        if (selectedLevel !== 'Cantrip') {
          const level = parseInt(selectedLevel);
          if (spell.level_int !== level) return false;
        }
      }

      return true;
    });
  }, [spells, searchQuery, selectedSchool, selectedLevel]);

  const handleBookmark = async (spell: Open5eSpell) => {
    const spellId = `spells:${spell.slug}`;
    const isBookmarked = bookmarkedSpells.has(spellId);
    
    if (isBookmarked) {
      await cacheService.removeBookmark(spellId);
      setBookmarkedSpells(prev => {
        const next = new Set(prev);
        next.delete(spellId);
        return next;
      });
      toast({
        title: 'Bookmark removed',
        description: `${spell.name} has been removed from bookmarks`,
      });
    } else {
      await cacheService.addBookmark(spellId, spell.name, 'spells', spell.slug);
      setBookmarkedSpells(prev => new Set([...prev, spellId]));
      toast({
        title: 'Bookmark added',
        description: `${spell.name} has been added to bookmarks`,
      });
    }
  };

  // Load bookmarks
  useMemo(() => {
    cacheService.getBookmarks().then(bookmarks => {
      setBookmarkedSpells(new Set(bookmarks.map(b => b.id)));
    });
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Failed to load spells. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spells by name or description..."
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {spellSchools.map(school => (
                <SelectItem key={school} value={school}>
                  {school}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {spellLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600">
            Showing {filteredSpells.length} of {spells?.length || 0} spells
          </div>

          <ScrollArea className="h-[600px] pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSpells.map(spell => (
                <SpellCard
                  key={spell.slug}
                  spell={spell}
                  onBookmark={handleBookmark}
                  isBookmarked={bookmarkedSpells.has(`spells:${spell.slug}`)}
                />
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}