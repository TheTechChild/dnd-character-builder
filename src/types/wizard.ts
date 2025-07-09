import { CreateCharacterInput } from './character';

export type WizardStep = 'basic' | 'abilities' | 'skills' | 'equipment' | 'review';

export interface WizardFormData extends CreateCharacterInput {
  level: number;
  playerName?: string;
  subrace?: string;
  abilityScoreMethod: 'standard' | 'pointBuy' | 'manual' | 'random';
  selectedSkills: string[];
  selectedLanguages: string[];
  selectedEquipment: string[];
  startingGold?: number;
  useEquipmentPack: boolean;
  notes?: string;
}

export type WizardStepProps = {
  data: WizardFormData;
  onUpdate: (data: Partial<WizardFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export const WIZARD_STEPS: WizardStep[] = ['basic', 'abilities', 'skills', 'equipment', 'review'];

export const STEP_LABELS: Record<WizardStep, string> = {
  basic: 'Basic Info',
  abilities: 'Ability Scores',
  skills: 'Skills & Languages',
  equipment: 'Equipment',
  review: 'Review & Finalize',
};

export const INITIAL_FORM_DATA: WizardFormData = {
  name: '',
  race: '',
  subrace: undefined,
  class: '',
  background: '',
  alignment: '',
  level: 1,
  playerName: '',
  abilities: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  },
  abilityScoreMethod: 'standard',
  selectedSkills: [],
  selectedLanguages: [],
  selectedEquipment: [],
  useEquipmentPack: true,
  notes: '',
};