import { 
  RACES, 
  CLASSES, 
  BACKGROUNDS, 
  ALIGNMENTS, 
  STANDARD_ARRAY,
  CLASS_SKILLS,
  CLASS_SKILL_COUNT,
  LANGUAGES
} from '@/data/dnd5e';
import { WizardFormData } from '@/types/wizard';

const FIRST_NAMES = [
  'Aldric', 'Aria', 'Bran', 'Cora', 'Dain', 'Elara', 'Finn', 'Gwen',
  'Hugo', 'Iris', 'Jack', 'Kira', 'Leo', 'Mira', 'Nolan', 'Oria',
  'Quinn', 'Rosa', 'Soren', 'Tara', 'Ulric', 'Vera', 'Will', 'Xara',
  'Yorick', 'Zara', 'Aelar', 'Bereris', 'Cithreth', 'Drannor',
];

const LAST_NAMES = [
  'Brightblade', 'Stormwind', 'Ironforge', 'Goldleaf', 'Silverstone',
  'Darkwater', 'Flameheart', 'Frostborn', 'Moonwhisper', 'Starweaver',
  'Shadowmere', 'Lightbringer', 'Stonebreaker', 'Windwalker', 'Thornfield',
  'Riverstone', 'Nightshade', 'Sunblade', 'Winterborn', 'Summerpeak',
];

function randomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateRandomCharacter(): Partial<WizardFormData> {
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const race = randomElement(RACES);
  const characterClass = randomElement(CLASSES);
  const background = randomElement(BACKGROUNDS);
  const alignment = randomElement(ALIGNMENTS);
  
  // Randomly assign ability scores from standard array
  const shuffledScores = shuffleArray([...STANDARD_ARRAY]);
  const abilities = {
    strength: shuffledScores[0],
    dexterity: shuffledScores[1],
    constitution: shuffledScores[2],
    intelligence: shuffledScores[3],
    wisdom: shuffledScores[4],
    charisma: shuffledScores[5],
  };
  
  // Randomly select skills
  const availableSkills = CLASS_SKILLS[characterClass] || [];
  const skillCount = CLASS_SKILL_COUNT[characterClass] || 2;
  const selectedSkills = shuffleArray([...availableSkills]).slice(0, skillCount);
  
  // Randomly select 1-3 additional languages
  const languageCount = Math.floor(Math.random() * 3) + 1;
  const selectedLanguages = shuffleArray([...LANGUAGES])
    .filter(lang => lang !== 'Common')
    .slice(0, languageCount);
  
  return {
    name: `${firstName} ${lastName}`,
    race,
    class: characterClass,
    background,
    alignment,
    level: 1,
    abilities,
    abilityScoreMethod: 'standard',
    selectedSkills,
    selectedLanguages,
    useEquipmentPack: true,
    selectedEquipment: [],
  };
}