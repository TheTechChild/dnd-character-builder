import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice1 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDiceStore, useDicePreferences } from '@/stores/diceStore';
import { formatRollResult, formatShortResult, DiceRollResult } from '@/utils/diceRoller';
import { DICE_SHORTCUTS } from '@/utils/diceNotation';
import { soundEffects } from '@/utils/soundEffects';


interface DiceRollerProps {
  className?: string;
  onRoll?: (result: DiceRollResult) => void;
}

export function DiceRoller({ className, onRoll }: DiceRollerProps) {
  const [notation, setNotation] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');
  const [lastRoll, setLastRoll] = useState<DiceRollResult | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  const roll = useDiceStore((state) => state.roll);
  const { animationsEnabled, soundEnabled } = useDicePreferences();
  
  const handleRoll = () => {
    if (!notation.trim()) {
      setError('Please enter a dice notation');
      return;
    }
    
    try {
      setError('');
      setIsRolling(true);
      
      // Delay for animation
      if (soundEnabled) {
        soundEffects.diceRoll();
      }
      
      setTimeout(() => {
        const result = roll(notation, label || undefined);
        setLastRoll(result);
        setIsRolling(false);
        onRoll?.(result);
        
        if (soundEnabled) {
          if (result.critical === 'hit') {
            soundEffects.criticalHit();
          } else if (result.critical === 'miss') {
            soundEffects.criticalMiss();
          }
        }
      }, animationsEnabled ? 500 : 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid dice notation');
      setIsRolling(false);
    }
  };
  
  const handleQuickRoll = (dice: string, quickLabel?: string) => {
    setNotation(dice);
    setLabel(quickLabel || '');
    setError('');
    setIsRolling(true);
    
    if (soundEnabled) {
      soundEffects.diceRoll();
    }
    
    setTimeout(() => {
      const result = roll(dice, quickLabel || label || undefined);
      setLastRoll(result);
      setIsRolling(false);
      onRoll?.(result);
      
      if (soundEnabled) {
        if (result.critical === 'hit') {
          soundEffects.criticalHit();
        } else if (result.critical === 'miss') {
          soundEffects.criticalMiss();
        }
      }
    }, animationsEnabled ? 500 : 0);
  };
  
  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle>Dice Roller</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input fields */}
        <div className="space-y-2">
          <div>
            <Label htmlFor="notation">Dice Notation</Label>
            <Input
              id="notation"
              placeholder="e.g., 1d20+5, 3d6, 2d20kh1"
              value={notation}
              onChange={(e) => {
                setNotation(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRoll();
              }}
              disabled={isRolling}
            />
          </div>
          
          <div>
            <Label htmlFor="label">Label (optional)</Label>
            <Input
              id="label"
              placeholder="e.g., Athletics Check"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRoll();
              }}
              disabled={isRolling}
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
        
        {/* Roll button */}
        <Button
          onClick={handleRoll}
          disabled={isRolling || !notation.trim()}
          className="w-full"
          size="lg"
        >
          {isRolling ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
            >
              <Dice1 className="h-5 w-5" />
            </motion.div>
          ) : (
            'Roll Dice'
          )}
        </Button>
        
        {/* Quick roll buttons */}
        <div className="space-y-2">
          <Label>Quick Rolls</Label>
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll('1d20', 'D20')}
              disabled={isRolling}
            >
              d20
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll('1d12', 'D12')}
              disabled={isRolling}
            >
              d12
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll('1d10', 'D10')}
              disabled={isRolling}
            >
              d10
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll('1d8', 'D8')}
              disabled={isRolling}
            >
              d8
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll('1d6', 'D6')}
              disabled={isRolling}
            >
              d6
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll('1d4', 'D4')}
              disabled={isRolling}
            >
              d4
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll('1d100', 'D100')}
              disabled={isRolling}
            >
              d100
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll(DICE_SHORTCUTS.abilityScores, 'Stats')}
              disabled={isRolling}
            >
              Stats
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll(DICE_SHORTCUTS.advantage, 'Advantage')}
              disabled={isRolling}
              className="text-green-600"
            >
              Advantage
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickRoll(DICE_SHORTCUTS.disadvantage, 'Disadvantage')}
              disabled={isRolling}
              className="text-red-600"
            >
              Disadvantage
            </Button>
          </div>
        </div>
        
        {/* Result display */}
        <AnimatePresence mode="wait">
          {lastRoll && (
            <motion.div
              key={lastRoll.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                'p-4 rounded-lg border',
                lastRoll.critical === 'hit' && 'bg-green-50 border-green-500',
                lastRoll.critical === 'miss' && 'bg-red-50 border-red-500',
                !lastRoll.critical && 'bg-gray-50'
              )}
            >
              {lastRoll.label && (
                <p className="text-sm font-medium mb-1">{lastRoll.label}</p>
              )}
              <p className={cn(
                'text-2xl font-bold',
                lastRoll.critical === 'hit' && 'text-green-600',
                lastRoll.critical === 'miss' && 'text-red-600'
              )}>
                {formatShortResult(lastRoll)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {formatRollResult(lastRoll)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}