import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { WizardFormData, WIZARD_STEPS, STEP_LABELS, INITIAL_FORM_DATA, WizardStep, WizardStepProps } from '@/types/wizard';
import { useQuickActions } from '@/stores';
import { calculateAbilityModifier } from '@/utils/calculations';
import { generateRandomCharacter } from '@/utils/randomCharacter';
import { useSwipeableNavigation } from '@/hooks/useSwipeGesture';
import { v4 as uuidv4 } from 'uuid';
import BasicInfoStep from './steps/BasicInfoStep';
import AbilityScoresStep from './steps/AbilityScoresStep';
import SkillsStep from './steps/SkillsStep';
import EquipmentStep from './steps/EquipmentStep';
import ReviewStep from './steps/ReviewStep';
import ProgressIndicator from './ProgressIndicator';

const STEP_COMPONENTS: Record<WizardStep, React.ComponentType<WizardStepProps>> = {
  basic: BasicInfoStep,
  abilities: AbilityScoresStep,
  skills: SkillsStep,
  equipment: EquipmentStep,
  review: ReviewStep,
};

export default function CharacterWizard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { createCharacter } = useQuickActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current step from URL or default to first step
  const currentStepParam = searchParams.get('step') as WizardStep | null;
  const currentStepIndex = currentStepParam ? WIZARD_STEPS.indexOf(currentStepParam) : 0;
  const currentStep = WIZARD_STEPS[currentStepIndex] || WIZARD_STEPS[0];

  // Load draft from localStorage
  const loadDraft = (): WizardFormData => {
    const draft = localStorage.getItem('characterWizardDraft');
    if (draft) {
      try {
        return { ...INITIAL_FORM_DATA, ...JSON.parse(draft) };
      } catch {
        return INITIAL_FORM_DATA;
      }
    }
    return INITIAL_FORM_DATA;
  };

  const methods = useForm<WizardFormData>({
    defaultValues: loadDraft(),
    mode: 'onChange',
  });

  const { watch, handleSubmit, setValue } = methods;
  const formData = watch();

  // Save draft to localStorage on changes
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem('characterWizardDraft', JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Update URL when step changes
  const setCurrentStep = (step: WizardStep) => {
    setSearchParams({ step });
  };

  const handleNext = () => {
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(WIZARD_STEPS[currentStepIndex - 1]);
    }
  };

  const handleUpdate = (data: Partial<WizardFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key as keyof WizardFormData, value);
    });
  };

  const handleFinalize = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      // Calculate derived values
      const abilityModifiers = {
        strength: calculateAbilityModifier(data.abilities.strength),
        dexterity: calculateAbilityModifier(data.abilities.dexterity),
        constitution: calculateAbilityModifier(data.abilities.constitution),
        intelligence: calculateAbilityModifier(data.abilities.intelligence),
        wisdom: calculateAbilityModifier(data.abilities.wisdom),
        charisma: calculateAbilityModifier(data.abilities.charisma),
      };

      // Create character with full data
      const character = {
        id: uuidv4(),
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: data.name,
        race: data.race,
        subrace: data.subrace,
        class: data.class,
        level: data.level,
        experiencePoints: 0,
        background: data.background,
        alignment: data.alignment,
        playerName: data.playerName,
        abilities: data.abilities,
        abilityModifiers,
        proficiencyBonus: Math.ceil(data.level / 4) + 1,
        // Initialize other required fields with defaults
        savingThrows: createDefaultSavingThrows(),
        skills: createDefaultSkills(data.selectedSkills),
        armorClass: 10 + abilityModifiers.dexterity,
        initiative: abilityModifiers.dexterity,
        speed: { base: 30 },
        hitPoints: { current: 10, max: 10, temp: 0 },
        hitDice: { total: `${data.level}d8`, current: data.level, size: 8 },
        deathSaves: { successes: 0, failures: 0 },
        attacks: [],
        equipment: [],
        currency: { cp: 0, sp: 0, ep: 0, gp: data.startingGold || 0, pp: 0 },
        features: [],
        traits: [],
        otherProficiencies: [],
        languages: data.selectedLanguages,
        notes: data.notes,
      };

      createCharacter(character);
      localStorage.removeItem('characterWizardDraft');
      navigate(`/characters/${character.id}`);
    } catch (error) {
      console.error('Failed to create character:', error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Your progress will be saved as a draft.')) {
      navigate('/characters');
    }
  };

  const handleRandomGenerate = () => {
    const randomData = generateRandomCharacter();
    Object.entries(randomData).forEach(([key, value]) => {
      setValue(key as keyof WizardFormData, value);
    });
    // Jump to review step
    setCurrentStep('review');
  };

  // Add swipe gesture support for mobile navigation
  useSwipeableNavigation(
    currentStepIndex,
    WIZARD_STEPS.length,
    (index) => setCurrentStep(WIZARD_STEPS[index]),
    { preventScrollOnSwipe: true }
  );

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <FormProvider {...methods}>
      <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8 max-w-4xl">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Create New Character</h1>
            <p className="text-sm md:text-base text-gray-600">Follow the steps below to create your D&D character</p>
          </div>
          <button
            type="button"
            onClick={handleRandomGenerate}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center justify-center sm:justify-start space-x-2 touch-target"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-sm md:text-base">Random Character</span>
          </button>
        </div>

        <ProgressIndicator
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          labels={STEP_LABELS}
        />

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
          <StepComponent
            data={formData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Save Draft & Exit
          </button>

          <div className="space-x-4">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}

            {currentStep === 'review' ? (
              <button
                type="button"
                onClick={handleFinalize}
                disabled={isSubmitting}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Character'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

// Helper functions
function createDefaultSavingThrows() {
  return {
    strength: { proficient: false, modifier: 0 },
    dexterity: { proficient: false, modifier: 0 },
    constitution: { proficient: false, modifier: 0 },
    intelligence: { proficient: false, modifier: 0 },
    wisdom: { proficient: false, modifier: 0 },
    charisma: { proficient: false, modifier: 0 }
  };
}

function createDefaultSkills(selectedSkills: string[]) {
  return {
    acrobatics: { proficient: selectedSkills.includes('acrobatics'), expertise: false, modifier: 0 },
    animalHandling: { proficient: selectedSkills.includes('animalHandling'), expertise: false, modifier: 0 },
    arcana: { proficient: selectedSkills.includes('arcana'), expertise: false, modifier: 0 },
    athletics: { proficient: selectedSkills.includes('athletics'), expertise: false, modifier: 0 },
    deception: { proficient: selectedSkills.includes('deception'), expertise: false, modifier: 0 },
    history: { proficient: selectedSkills.includes('history'), expertise: false, modifier: 0 },
    insight: { proficient: selectedSkills.includes('insight'), expertise: false, modifier: 0 },
    intimidation: { proficient: selectedSkills.includes('intimidation'), expertise: false, modifier: 0 },
    investigation: { proficient: selectedSkills.includes('investigation'), expertise: false, modifier: 0 },
    medicine: { proficient: selectedSkills.includes('medicine'), expertise: false, modifier: 0 },
    nature: { proficient: selectedSkills.includes('nature'), expertise: false, modifier: 0 },
    perception: { proficient: selectedSkills.includes('perception'), expertise: false, modifier: 0 },
    performance: { proficient: selectedSkills.includes('performance'), expertise: false, modifier: 0 },
    persuasion: { proficient: selectedSkills.includes('persuasion'), expertise: false, modifier: 0 },
    religion: { proficient: selectedSkills.includes('religion'), expertise: false, modifier: 0 },
    sleightOfHand: { proficient: selectedSkills.includes('sleightOfHand'), expertise: false, modifier: 0 },
    stealth: { proficient: selectedSkills.includes('stealth'), expertise: false, modifier: 0 },
    survival: { proficient: selectedSkills.includes('survival'), expertise: false, modifier: 0 }
  };
}