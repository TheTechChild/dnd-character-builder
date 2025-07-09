import { WizardStepProps, WizardStep } from '@/types/wizard';
import { calculateAbilityModifier } from '@/utils/calculations';
import { RACIAL_BONUSES, CLASS_HIT_DICE } from '@/data/dnd5e';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

export default function ReviewStep({ data, onUpdate, onBack }: WizardStepProps) {
  const getRacialBonuses = () => {
    const key = data.subrace || data.race;
    const bonuses = key ? { ...RACIAL_BONUSES[key] } : {};
    
    // Special case for Human: +1 to all abilities
    if (data.race === 'Human' && !data.subrace) {
      return {
        strength: 1,
        dexterity: 1,
        constitution: 1,
        intelligence: 1,
        wisdom: 1,
        charisma: 1,
      };
    }
    
    return bonuses || {};
  };

  const racialBonuses = getRacialBonuses();
  const proficiencyBonus = Math.ceil(data.level / 4) + 1;

  const getFinalAbilityScores = () => {
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const;
    return abilities.map(ability => {
      const base = data.abilities[ability];
      const racial = racialBonuses[ability] || 0;
      const total = base + racial;
      const modifier = calculateAbilityModifier(total);
      
      return {
        ability,
        base,
        racial,
        total,
        modifier
      };
    });
  };

  const finalScores = getFinalAbilityScores();
  const conModifier = calculateAbilityModifier(
    data.abilities.constitution + (racialBonuses.constitution || 0)
  );
  const hitDieSize = CLASS_HIT_DICE[data.class] || 8;
  const maxHP = hitDieSize + conModifier;

  const formatSkillName = (skill: string): string => {
    return skill
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const EditButton = ({ step, label }: { step: WizardStep; label: string }) => (
    <button
      type="button"
      onClick={() => {
        const params = new URLSearchParams(window.location.search);
        params.set('step', step);
        window.history.pushState({}, '', `${window.location.pathname}?${params}`);
        window.location.reload();
      }}
      className="text-indigo-600 hover:text-indigo-800 text-sm"
    >
      Edit {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Review Your Character</h2>
      <p className="text-gray-600">Review your character details before finalizing.</p>

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            <EditButton step="basic" label="Basic Info" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">{data.name}</span>
            </div>
            <div>
              <span className="text-gray-600">Player:</span>
              <span className="ml-2 font-medium">{data.playerName || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-gray-600">Race:</span>
              <span className="ml-2 font-medium">{data.subrace || data.race}</span>
            </div>
            <div>
              <span className="text-gray-600">Class:</span>
              <span className="ml-2 font-medium">{data.class} (Level {data.level})</span>
            </div>
            <div>
              <span className="text-gray-600">Background:</span>
              <span className="ml-2 font-medium">{data.background}</span>
            </div>
            <div>
              <span className="text-gray-600">Alignment:</span>
              <span className="ml-2 font-medium">{data.alignment}</span>
            </div>
          </div>
        </div>

        {/* Ability Scores */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Ability Scores</h3>
            <EditButton step="abilities" label="Abilities" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {finalScores.map(({ ability, racial, total, modifier }) => (
              <div key={ability} className="text-center">
                <div className="font-medium capitalize text-gray-700">{ability.slice(0, 3).toUpperCase()}</div>
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-sm text-gray-600">
                  {modifier >= 0 ? '+' : ''}{modifier}
                </div>
                {racial !== 0 && (
                  <div className="text-xs text-green-600">+{racial} racial</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills & Languages */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Skills & Languages</h3>
            <EditButton step="skills" label="Skills" />
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Proficient Skills:</span>
              <span className="ml-2 font-medium">
                {data.selectedSkills.length > 0 
                  ? data.selectedSkills.map(skill => formatSkillName(skill)).join(', ')
                  : 'None selected'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Languages:</span>
              <span className="ml-2 font-medium">
                Common{data.selectedLanguages.length > 0 ? ', ' + data.selectedLanguages.join(', ') : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Equipment</h3>
            <EditButton step="equipment" label="Equipment" />
          </div>
          <div className="text-sm">
            {data.useEquipmentPack ? (
              <div>
                <span className="text-gray-600">Equipment Pack:</span>
                <span className="ml-2 font-medium">
                  {data.selectedEquipment.length > 0 ? 'Selected' : 'None selected'}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-gray-600">Starting Gold:</span>
                <span className="ml-2 font-medium">{data.startingGold || 0} gp</span>
              </div>
            )}
          </div>
        </div>

        {/* Calculated Stats */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-indigo-800 mb-3">Calculated Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-indigo-600">Proficiency Bonus:</span>
              <span className="ml-2 font-medium">+{proficiencyBonus}</span>
            </div>
            <div>
              <span className="text-indigo-600">Hit Points:</span>
              <span className="ml-2 font-medium">{maxHP} (1d{hitDieSize} + {conModifier})</span>
            </div>
            <div>
              <span className="text-indigo-600">Hit Dice:</span>
              <span className="ml-2 font-medium">{data.level}d{hitDieSize}</span>
            </div>
            <div>
              <span className="text-indigo-600">Armor Class:</span>
              <span className="ml-2 font-medium">
                {10 + calculateAbilityModifier(data.abilities.dexterity + (racialBonuses.dexterity || 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={data.notes || ''}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Add any additional notes about your character..."
            rows={4}
          />
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
        <div className="text-sm text-gray-600">
          Click "Create Character" above to finalize
        </div>
      </div>
    </div>
  );
}