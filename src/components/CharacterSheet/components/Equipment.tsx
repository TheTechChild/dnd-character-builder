import { Character } from '@/types/character';
import { cn } from '@/utils/cn';
import { Package, Weight } from 'lucide-react';

interface EquipmentProps {
  character: Character;
}

export function Equipment({ character }: EquipmentProps) {
  const calculateCarryingCapacity = () => {
    const strScore = character.abilities.strength || 10;
    return strScore * 15;
  };
  
  const totalWeight = character.equipment?.reduce((total, item) => {
    return total + (item.weight || 0) * (item.quantity || 1);
  }, 0) || 0;
  
  const carryingCapacity = calculateCarryingCapacity();
  
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700",
      "print:border-black"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Package className="w-5 h-5" />
          EQUIPMENT & INVENTORY
        </h2>
        
        <div className="flex items-center gap-2 text-sm">
          <Weight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className={cn(
            totalWeight > carryingCapacity && "text-red-600 dark:text-red-400 font-semibold"
          )}>
            {totalWeight} / {carryingCapacity} lbs
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        {character.equipment?.length > 0 ? (
          character.equipment.map((item, index) => (
            <div 
              key={item.id || index}
              className={cn(
                "p-2 rounded",
                "bg-slate-50 dark:bg-slate-800",
                "print:bg-white print:border print:border-black"
              )}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {item.name}
                  {item.quantity > 1 && ` x${item.quantity}`}
                  {item.type && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                      ({item.type})
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {item.armorClass && (
                    <span className="text-sm">AC {item.armorClass}</span>
                  )}
                  {item.damage && (
                    <span className="text-sm">{item.damage}</span>
                  )}
                  {item.weight && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.weight * (item.quantity || 1)} lbs
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            No equipment defined.
          </p>
        )}
      </div>
    </div>
  );
}