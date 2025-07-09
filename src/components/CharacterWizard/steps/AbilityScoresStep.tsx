import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { WizardStepProps, WizardFormData } from '@/types/wizard';
import { ABILITY_SCORES, STANDARD_ARRAY, POINT_BUY_COSTS, RACIAL_BONUSES } from '@/data/dnd5e';
import { calculateAbilityModifier } from '@/utils/calculations';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/NativeSelect';

export default function AbilityScoresStep({ onUpdate, onNext, onBack }: WizardStepProps) {
  const { setValue, watch } = useFormContext<WizardFormData>();
  const [availablePoints, setAvailablePoints] = useState(27);
  const [standardArrayAssignments, setStandardArrayAssignments] = useState<Record<string, number>>({});
  const [availableScores, setAvailableScores] = useState<number[]>([...STANDARD_ARRAY]);

  const method = watch('abilityScoreMethod');
  const abilities = watch('abilities');
  const race = watch('race');
  const subrace = watch('subrace');

  // Get racial bonuses
  const getRacialBonuses = () => {
    const key = subrace || race;
    const bonuses = key ? { ...RACIAL_BONUSES[key] } : {};
    
    // Special case for Human: +1 to all abilities
    if (race === 'Human' && !subrace) {
      return Object.fromEntries(
        ABILITY_SCORES.map(ability => [ability, 1])
      );
    }
    
    return bonuses || {};
  };

  const racialBonuses = getRacialBonuses();

  // Calculate point buy cost
  useEffect(() => {
    if (method === 'pointBuy') {
      const totalCost = Object.values(abilities).reduce((sum, score) => {
        return sum + (POINT_BUY_COSTS[score] || 0);
      }, 0);
      setAvailablePoints(27 - totalCost);
    }
  }, [abilities, method]);

  const handleAbilityChange = (ability: typeof ABILITY_SCORES[number], value: number) => {
    setValue(`abilities.${ability}`, value);
  };

  const handleStandardArrayAssignment = (ability: typeof ABILITY_SCORES[number], value: number) => {
    const previousValue = standardArrayAssignments[ability];
    
    // If there was a previous value, add it back to available scores
    if (previousValue) {
      setAvailableScores(prev => [...prev, previousValue].sort((a, b) => b - a));
    }
    
    // Remove the new value from available scores
    setAvailableScores(prev => prev.filter(score => score !== value));
    
    // Update assignments
    setStandardArrayAssignments(prev => ({ ...prev, [ability]: value }));
    handleAbilityChange(ability, value);
  };

  const rollAbilityScores = () => {
    const rollStat = () => {
      const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
      rolls.sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
    };

    const newAbilities = Object.fromEntries(
      ABILITY_SCORES.map(ability => [ability, rollStat()])
    );
    
    onUpdate({ abilities: newAbilities as WizardFormData['abilities'] });
  };

  const renderAbilityInput = (ability: typeof ABILITY_SCORES[number]) => {
    const baseScore = abilities[ability];
    const racialBonus = racialBonuses[ability] || 0;
    const totalScore = baseScore + racialBonus;
    const modifier = calculateAbilityModifier(totalScore);

    return (
      <div key={ability} className="space-y-2">
        <Label className="capitalize">{ability}</Label>
        <div className="flex items-center space-x-2">
          {method === 'standard' ? (
            <Select
              value={standardArrayAssignments[ability]?.toString() || ''}
              onChange={(e) => handleStandardArrayAssignment(ability, parseInt(e.target.value))}
              className="w-20"
            >
              <option value="">--</option>
              {availableScores.map(score => (
                <option key={score} value={score}>{score}</option>
              ))}
              {standardArrayAssignments[ability] && (
                <option value={standardArrayAssignments[ability]}>
                  {standardArrayAssignments[ability]}
                </option>
              )}
            </Select>
          ) : method === 'pointBuy' ? (
            <Select
              value={baseScore.toString()}
              onChange={(e) => handleAbilityChange(ability, parseInt(e.target.value))}
              className="w-20"
            >
              {[8, 9, 10, 11, 12, 13, 14, 15].map(score => {
                const cost = POINT_BUY_COSTS[score];
                const currentCost = POINT_BUY_COSTS[baseScore] || 0;
                const wouldCost = cost - currentCost;
                const canAfford = wouldCost <= availablePoints;
                
                return (
                  <option
                    key={score}
                    value={score}
                    disabled={!canAfford && score !== baseScore}
                  >
                    {score} ({cost}pts)
                  </option>
                );
              })}
            </Select>
          ) : (
            <Input
              type="number"
              min="3"
              max="18"
              value={baseScore}
              onChange={(e) => handleAbilityChange(ability, parseInt(e.target.value) || 10)}
              className="w-20"
            />
          )}
          
          {racialBonus !== 0 && (
            <span className="text-green-600">+{racialBonus}</span>
          )}
          
          <span className="font-semibold">= {totalScore}</span>
          <span className="text-gray-600">
            ({modifier >= 0 ? '+' : ''}{modifier})
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Ability Scores</h2>
      <p className="text-gray-600">Choose how to determine your ability scores.</p>

      <div>
        <Label htmlFor="method">Score Generation Method</Label>
        <Select
          id="method"
          value={method}
          onChange={(e) => onUpdate({ abilityScoreMethod: e.target.value as WizardFormData['abilityScoreMethod'] })}
        >
          <option value="standard">Standard Array (15, 14, 13, 12, 10, 8)</option>
          <option value="pointBuy">Point Buy (27 points)</option>
          <option value="manual">Manual Entry</option>
          <option value="random">Random (4d6 drop lowest)</option>
        </Select>
      </div>

      {method === 'pointBuy' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4">
          <p className="text-indigo-800">
            Points Remaining: <span className="font-bold">{availablePoints}</span>
          </p>
        </div>
      )}

      {method === 'random' && (
        <button
          type="button"
          onClick={rollAbilityScores}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Roll Ability Scores
        </button>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ABILITY_SCORES.map(ability => renderAbilityInput(ability))}
      </div>

      {Object.keys(racialBonuses).length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <p className="text-gray-700 font-medium">Racial Bonuses Applied:</p>
          <p className="text-gray-600">
            {Object.entries(racialBonuses)
              .filter(([, bonus]) => bonus !== 0)
              .map(([ability, bonus]) => `${ability}: +${bonus}`)
              .join(', ')}
          </p>
        </div>
      )}

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
          Next: Skills & Languages
        </button>
      </div>
    </div>
  );
}