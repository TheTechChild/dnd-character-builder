import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { WizardStepProps, WizardFormData } from '@/types/wizard';
import { STARTING_EQUIPMENT_PACKS, STARTING_GOLD, CLASS_HIT_DICE } from '@/data/dnd5e';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/NativeSelect';

export default function EquipmentStep({ data, onUpdate, onNext, onBack }: WizardStepProps) {
  const { watch } = useFormContext<WizardFormData>();
  const [selectedPack, setSelectedPack] = useState<string>('');
  
  const selectedClass = watch('class');
  const useEquipmentPack = data.useEquipmentPack;
  const startingGoldInfo = STARTING_GOLD[selectedClass] || { dice: '5d4', multiplier: 10 };

  const rollStartingGold = () => {
    const [count, sides] = startingGoldInfo.dice.split('d').map(Number);
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    
    const gold = total * startingGoldInfo.multiplier;
    onUpdate({ startingGold: gold });
  };

  const getClassEquipmentOptions = () => {
    // This would be expanded with actual class-specific equipment options
    const classEquipment: Record<string, string[]> = {
      Fighter: ["Explorer's Pack", "Dungeoneer's Pack"],
      Wizard: ["Scholar's Pack", "Explorer's Pack"],
      Rogue: ["Burglar's Pack", "Dungeoneer's Pack", "Explorer's Pack"],
      Cleric: ["Priest's Pack", "Explorer's Pack"],
      // Add more classes as needed
    };
    
    return classEquipment[selectedClass] || ["Explorer's Pack"];
  };

  const handlePackSelection = (pack: string) => {
    setSelectedPack(pack);
    const equipment = STARTING_EQUIPMENT_PACKS[pack as keyof typeof STARTING_EQUIPMENT_PACKS] || [];
    onUpdate({ selectedEquipment: equipment });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Equipment</h2>
      <p className="text-gray-600">Choose your starting equipment or take gold to purchase your own.</p>

      <div className="space-y-4">
        <div>
          <Label>Equipment Method</Label>
          <div className="mt-2 space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={useEquipmentPack}
                onChange={() => onUpdate({ useEquipmentPack: true })}
                className="text-indigo-600"
              />
              <span>Choose equipment pack (recommended for beginners)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={!useEquipmentPack}
                onChange={() => onUpdate({ useEquipmentPack: false })}
                className="text-indigo-600"
              />
              <span>Take starting gold ({startingGoldInfo.dice} × {startingGoldInfo.multiplier} gp)</span>
            </label>
          </div>
        </div>

        {useEquipmentPack ? (
          <div>
            <Label htmlFor="equipmentPack">Equipment Pack</Label>
            <Select
              id="equipmentPack"
              value={selectedPack}
              onChange={(e) => handlePackSelection(e.target.value)}
            >
              <option value="">Select an equipment pack</option>
              {getClassEquipmentOptions().map(pack => (
                <option key={pack} value={pack}>{pack}</option>
              ))}
            </Select>

            {selectedPack && STARTING_EQUIPMENT_PACKS[selectedPack as keyof typeof STARTING_EQUIPMENT_PACKS] && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4">
                <h4 className="font-semibold text-gray-800 mb-2">{selectedPack} Contents:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {STARTING_EQUIPMENT_PACKS[selectedPack as keyof typeof STARTING_EQUIPMENT_PACKS].map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-md p-4">
              <h4 className="font-semibold text-indigo-800 mb-2">Class Equipment:</h4>
              <p className="text-indigo-700">
                As a {selectedClass}, you also start with:
              </p>
              <ul className="list-disc list-inside text-indigo-600 mt-2">
                <li>Armor and weapons based on your class</li>
                <li>A {CLASS_HIT_DICE[selectedClass]}-sided hit die</li>
                <li>Class-specific items (holy symbol, spellbook, etc.)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="startingGold">Starting Gold</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="startingGold"
                type="number"
                min="0"
                value={data.startingGold || 0}
                onChange={(e) => onUpdate({ startingGold: parseInt(e.target.value) || 0 })}
                className="w-32"
              />
              <span className="text-gray-600">gp</span>
              <button
                type="button"
                onClick={rollStartingGold}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Roll {startingGoldInfo.dice}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              You'll need to purchase all your equipment with this gold.
            </p>
          </div>
        )}
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
          Next: Review & Finalize
        </button>
      </div>
    </div>
  );
}