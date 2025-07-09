import { useParams, Navigate } from 'react-router-dom';
import { useCharacter } from '@/stores/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoreStatsPage } from './pages/CoreStatsPage';
import { DetailsPage } from './pages/DetailsPage';
import { SpellcastingPage } from './pages/SpellcastingPage';
import { hasSpellcasting } from '@/utils/spellcasting';
import { cn } from '@/utils/cn';

export function CharacterSheet() {
  const { id } = useParams();
  const character = useCharacter(id || '');

  if (!character) {
    return <Navigate to="/characters" replace />;
  }

  const showSpellcasting = hasSpellcasting(character);

  return (
    <div className="container mx-auto p-4 max-w-7xl print:p-0">
      <Tabs defaultValue="core" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-3 print:hidden">
          <TabsTrigger value="core">Core Stats</TabsTrigger>
          <TabsTrigger value="details">Details & Equipment</TabsTrigger>
          {showSpellcasting && (
            <TabsTrigger value="spellcasting">Spellcasting</TabsTrigger>
          )}
        </TabsList>

        <TabsContent 
          value="core" 
          className={cn(
            "mt-0 space-y-4",
            "print:block print:!mt-0"
          )}
        >
          <CoreStatsPage character={character} />
        </TabsContent>

        <TabsContent 
          value="details"
          className={cn(
            "mt-0 space-y-4",
            "print:block print:!mt-8 print:break-before-page"
          )}
        >
          <DetailsPage character={character} />
        </TabsContent>

        {showSpellcasting && (
          <TabsContent 
            value="spellcasting"
            className={cn(
              "mt-0 space-y-4",
              "print:block print:!mt-8 print:break-before-page"
            )}
          >
            <SpellcastingPage character={character} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}