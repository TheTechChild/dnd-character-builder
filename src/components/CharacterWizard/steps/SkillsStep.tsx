import { useFormContext } from 'react-hook-form';
import { WizardStepProps, WizardFormData } from '@/types/wizard';
import { CLASS_SKILLS, CLASS_SKILL_COUNT, BACKGROUND_SKILLS, LANGUAGES } from '@/data/dnd5e';
import { SKILL_ABILITIES } from '@/utils/calculations';
import { calculateAbilityModifier } from '@/utils/calculations';
import { Checkbox } from '@/components/ui/checkbox';

export default function SkillsStep({ data, onUpdate, onNext, onBack }: WizardStepProps) {
  const { watch } = useFormContext<WizardFormData>();
  
  const selectedClass = watch('class');
  const selectedBackground = watch('background');
  const abilities = watch('abilities');
  const selectedSkills = data.selectedSkills || [];
  const selectedLanguages = data.selectedLanguages || [];

  // Get available skills from class
  const classSkills = CLASS_SKILLS[selectedClass] || [];
  const skillCount = CLASS_SKILL_COUNT[selectedClass] || 2;

  // Get skills from background
  const backgroundSkills = BACKGROUND_SKILLS[selectedBackground] || [];

  const handleSkillToggle = (skill: string) => {
    const newSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter(s => s !== skill)
      : [...selectedSkills, skill];
    
    onUpdate({ selectedSkills: newSkills });
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    
    onUpdate({ selectedLanguages: newLanguages });
  };

  const canSelectMoreSkills = selectedSkills.length < skillCount;

  const formatSkillName = (skill: string): string => {
    // Convert camelCase to Title Case
    return skill
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Skills & Languages</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Class Skills</h3>
          <p className="text-gray-600 mb-4">
            Choose {skillCount} skills from your class list. 
            You can select {skillCount - selectedSkills.length} more.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {classSkills.map(skill => {
              const abilityScore = SKILL_ABILITIES[skill as keyof typeof SKILL_ABILITIES];
              const fullAbilityName = {
                str: 'strength',
                dex: 'dexterity', 
                con: 'constitution',
                int: 'intelligence',
                wis: 'wisdom',
                cha: 'charisma'
              }[abilityScore] as keyof typeof abilities;
              const abilityModifier = calculateAbilityModifier(abilities[fullAbilityName]);
              const isFromBackground = backgroundSkills.includes(skill);
              const isSelected = selectedSkills.includes(skill);
              
              return (
                <label
                  key={skill}
                  className={`
                    flex items-start space-x-2 p-3 rounded-md border cursor-pointer
                    ${isFromBackground ? 'bg-green-50 border-green-300' : ''}
                    ${isSelected && !isFromBackground ? 'bg-indigo-50 border-indigo-300' : ''}
                    ${!isFromBackground && !isSelected ? 'bg-white border-gray-200 hover:border-gray-300' : ''}
                  `}
                >
                  <Checkbox
                    checked={isSelected || isFromBackground}
                    disabled={isFromBackground || (!isSelected && !canSelectMoreSkills)}
                    onCheckedChange={() => !isFromBackground && handleSkillToggle(skill)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{formatSkillName(skill)}</div>
                    <div className="text-sm text-gray-500">
                      {abilityScore.toUpperCase()} ({abilityModifier >= 0 ? '+' : ''}{abilityModifier})
                      {isFromBackground && ' (Background)'}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {backgroundSkills.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-green-800 font-medium">Background Skills:</p>
            <p className="text-green-700">
              Your {selectedBackground} background grants proficiency in: {' '}
              {backgroundSkills.map(skill => formatSkillName(skill)).join(', ')}
            </p>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Languages</h3>
          <p className="text-gray-600 mb-4">
            Select languages your character knows. You start with Common and your racial language.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LANGUAGES.map(language => {
              const isCommon = language === 'Common';
              const isSelected = selectedLanguages.includes(language) || isCommon;
              
              return (
                <label
                  key={language}
                  className={`
                    flex items-center space-x-2 p-3 rounded-md border cursor-pointer
                    ${isCommon ? 'bg-gray-100 border-gray-300' : ''}
                    ${isSelected && !isCommon ? 'bg-indigo-50 border-indigo-300' : ''}
                    ${!isCommon && !isSelected ? 'bg-white border-gray-200 hover:border-gray-300' : ''}
                  `}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isCommon}
                    onCheckedChange={() => !isCommon && handleLanguageToggle(language)}
                  />
                  <span className="font-medium">
                    {language}
                    {isCommon && ' (Starting)'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Next: Equipment
        </button>
      </div>
    </div>
  );
}