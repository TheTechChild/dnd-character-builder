import { useFormContext } from 'react-hook-form';
import { WizardStepProps, WizardFormData } from '@/types/wizard';
import { RACES, SUBRACES, CLASSES, BACKGROUNDS, ALIGNMENTS } from '@/data/dnd5e';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/NativeSelect';

export default function BasicInfoStep({ onNext }: WizardStepProps) {
  const { register, watch, formState: { errors } } = useFormContext<WizardFormData>();
  const selectedRace = watch('race');

  const isValid = () => {
    const data = watch();
    return data.name && data.race && data.class && data.background && data.alignment;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>
      <p className="text-gray-600">Let's start with the basics of your character.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Character Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Character name is required' })}
            placeholder="Enter character name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="playerName">Player Name</Label>
          <Input
            id="playerName"
            {...register('playerName')}
            placeholder="Your name (optional)"
          />
        </div>

        <div>
          <Label htmlFor="race">Race *</Label>
          <Select
            id="race"
            {...register('race', { required: 'Race is required' })}
          >
            <option value="">Select a race</option>
            {RACES.map(race => (
              <option key={race} value={race}>{race}</option>
            ))}
          </Select>
          {errors.race && (
            <p className="text-red-500 text-sm mt-1">{errors.race.message}</p>
          )}
        </div>

        {selectedRace && SUBRACES[selectedRace] && (
          <div>
            <Label htmlFor="subrace">Subrace</Label>
            <Select
              id="subrace"
              {...register('subrace')}
            >
              <option value="">Select a subrace</option>
              {SUBRACES[selectedRace].map(subrace => (
                <option key={subrace} value={subrace}>{subrace}</option>
              ))}
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="class">Class *</Label>
          <Select
            id="class"
            {...register('class', { required: 'Class is required' })}
          >
            <option value="">Select a class</option>
            {CLASSES.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </Select>
          {errors.class && (
            <p className="text-red-500 text-sm mt-1">{errors.class.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="level">Level</Label>
          <Input
            id="level"
            type="number"
            min="1"
            max="20"
            {...register('level', {
              valueAsNumber: true,
              min: { value: 1, message: 'Level must be at least 1' },
              max: { value: 20, message: 'Level cannot exceed 20' }
            })}
          />
          {errors.level && (
            <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="background">Background *</Label>
          <Select
            id="background"
            {...register('background', { required: 'Background is required' })}
          >
            <option value="">Select a background</option>
            {BACKGROUNDS.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </Select>
          {errors.background && (
            <p className="text-red-500 text-sm mt-1">{errors.background.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="alignment">Alignment *</Label>
          <Select
            id="alignment"
            {...register('alignment', { required: 'Alignment is required' })}
          >
            <option value="">Select alignment</option>
            {ALIGNMENTS.map(alignment => (
              <option key={alignment} value={alignment}>{alignment}</option>
            ))}
          </Select>
          {errors.alignment && (
            <p className="text-red-500 text-sm mt-1">{errors.alignment.message}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Ability Scores
        </button>
      </div>
    </div>
  );
}