import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { PersonalityTraits } from '../components/PersonalityTraits';
import { FeaturesAndTraits } from '../components/FeaturesAndTraits';
import { Equipment } from '../components/Equipment';
import { Currency } from '../components/Currency';
import { ProficienciesAndLanguages } from '../components/ProficienciesAndLanguages';

interface DetailsPageProps {
  character: Character;
  isEditMode?: boolean;
}

export function DetailsPage({ character }: DetailsPageProps) {
  return (
    <div className="space-y-4 print:space-y-2">
      <div className={cn(
        "grid gap-4",
        "lg:grid-cols-2",
        "print:grid-cols-2 print:gap-2"
      )}>
        <PersonalityTraits character={character} />
        <ProficienciesAndLanguages character={character} />
      </div>
      
      <FeaturesAndTraits character={character} />
      
      <div className={cn(
        "grid gap-4",
        "lg:grid-cols-3",
        "print:grid-cols-3 print:gap-2"
      )}>
        <div className="lg:col-span-2">
          <Equipment character={character} />
        </div>
        <Currency character={character} />
      </div>
    </div>
  );
}