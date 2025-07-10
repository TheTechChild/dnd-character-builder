import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice1 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dice3DButton } from './Dice3DButton';
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
          size="large"
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
        <div className="space-y-3">
          <Label className="text-amber-200 font-serif">Quick Rolls</Label>
          <div className="grid grid-cols-4 gap-3 justify-items-center">
            <Dice3DButton
              diceType="d20"
              onClick={() => handleQuickRoll('1d20', 'D20')}
              disabled={isRolling}
              isRolling={isRolling && notation === '1d20'}
            >
              20
            </Dice3DButton>
            <Dice3DButton
              diceType="d12"
              onClick={() => handleQuickRoll('1d12', 'D12')}
              disabled={isRolling}
              isRolling={isRolling && notation === '1d12'}
            >
              12
            </Dice3DButton>
            <Dice3DButton
              diceType="d10"
              onClick={() => handleQuickRoll('1d10', 'D10')}
              disabled={isRolling}
              isRolling={isRolling && notation === '1d10'}
            >
              10
            </Dice3DButton>
            <Dice3DButton
              diceType="d8"
              onClick={() => handleQuickRoll('1d8', 'D8')}
              disabled={isRolling}
              isRolling={isRolling && notation === '1d8'}
            >
              8
            </Dice3DButton>
            <Dice3DButton
              diceType="d6"
              onClick={() => handleQuickRoll('1d6', 'D6')}
              disabled={isRolling}
              isRolling={isRolling && notation === '1d6'}
            >
              6
            </Dice3DButton>
            <Dice3DButton
              diceType="d4"
              onClick={() => handleQuickRoll('1d4', 'D4')}
              disabled={isRolling}
              isRolling={isRolling && notation === '1d4'}
            >
              4
            </Dice3DButton>
            <Dice3DButton
              diceType="d100"
              onClick={() => handleQuickRoll('1d100', 'D100')}
              disabled={isRolling}
              isRolling={isRolling && notation === '1d100'}
            >
              %
            </Dice3DButton>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickRoll(DICE_SHORTCUTS.abilityScores, 'Stats')}
              disabled={isRolling}
              className="relative h-12 w-12 bg-gradient-to-b from-slate-400 via-slate-500 to-slate-600 rounded-md shadow-deep disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Stone texture */}
              <div className="absolute inset-0 opacity-30 texture-stone" />
              {/* Carved effect */}
              <div className="absolute inset-[2px] bg-gradient-to-b from-transparent via-black/10 to-black/30 rounded" />
              <span className="relative z-10 text-slate-100 font-bold text-sm font-serif tracking-wide drop-shadow-lg">Stats</span>
              {/* Bottom shadow for depth */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40" />
            </motion.button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickRoll(DICE_SHORTCUTS.advantage, 'Advantage')}
              disabled={isRolling}
              className="relative h-14 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 rounded-lg shadow-deep disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              {/* Stone carving effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
              <div className="absolute inset-[1px] rounded-lg bg-gradient-to-b from-white/10 via-transparent to-transparent" />
              
              {/* Mystical glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-400/20 via-transparent to-transparent animate-pulse" />
              </div>
              
              {/* Engraved text */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                <span className="text-emerald-100 font-serif font-bold text-sm tracking-wider drop-shadow-lg text-engrave">ADVANTAGE</span>
                <span className="text-emerald-200/80 text-xs font-mono mt-0.5">2d20kh1</span>
              </div>
              
              {/* Stone edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickRoll(DICE_SHORTCUTS.disadvantage, 'Disadvantage')}
              disabled={isRolling}
              className="relative h-14 bg-gradient-to-b from-red-700 via-red-800 to-red-900 rounded-lg shadow-deep disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            >
              {/* Stone carving effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
              <div className="absolute inset-[1px] rounded-lg bg-gradient-to-b from-white/10 via-transparent to-transparent" />
              
              {/* Ominous glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-red-400/20 via-transparent to-transparent animate-pulse" />
              </div>
              
              {/* Engraved text */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center">
                <span className="text-red-100 font-serif font-bold text-sm tracking-wider drop-shadow-lg text-engrave">DISADVANTAGE</span>
                <span className="text-red-200/80 text-xs font-mono mt-0.5">2d20kl1</span>
              </div>
              
              {/* Stone edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-300/30 to-transparent" />
            </motion.button>
          </div>
        </div>
        
        {/* Result display */}
        <AnimatePresence mode="wait">
          {lastRoll && (
            <motion.div
              key={lastRoll.id}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className={cn(
                'relative p-4 rounded-lg border-2 overflow-hidden',
                lastRoll.critical === 'hit' && 'bg-gradient-to-br from-yellow-100 via-amber-50 to-yellow-100 border-yellow-600',
                lastRoll.critical === 'miss' && 'bg-gradient-to-br from-red-100 via-red-50 to-red-100 border-red-600',
                !lastRoll.critical && 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 border-slate-400'
              )}
            >
              {/* Critical hit golden explosion effect */}
              {lastRoll.critical === 'hit' && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-gradient-radial from-yellow-400/50 via-amber-300/30 to-transparent"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.5, times: [0, 0.2, 1] }}
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1 h-12 bg-gradient-to-t from-transparent via-yellow-400 to-transparent"
                        style={{ 
                          transformOrigin: 'center bottom',
                          rotate: `${i * 45}deg` 
                        }}
                        initial={{ scale: 0, y: 0 }}
                        animate={{ scale: [0, 1.5, 0], y: [-20, -60, -80] }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    ))}
                  </motion.div>
                </>
              )}
              
              {/* Critical miss red crack effect */}
              {lastRoll.critical === 'miss' && (
                <>
                  <motion.svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.path
                      d="M 50 0 L 45 30 L 55 50 L 48 80 L 52 100"
                      stroke="url(#redCrackGradient)"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                    <motion.path
                      d="M 0 40 L 20 45 L 40 43 L 60 47 L 80 45 L 100 48"
                      stroke="url(#redCrackGradient)"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="redCrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#991b1b" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#dc2626" stopOpacity="1" />
                        <stop offset="100%" stopColor="#991b1b" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5] }}
                    transition={{ duration: 0.6 }}
                  />
                </>
              )}
              
              <div className="relative z-10">
                {lastRoll.label && (
                  <p className="text-sm font-serif font-medium mb-1 text-slate-700">{lastRoll.label}</p>
                )}
                <p className={cn(
                  'text-3xl font-bold font-serif',
                  lastRoll.critical === 'hit' && 'text-yellow-700 text-glow-gold animate-pulse',
                  lastRoll.critical === 'miss' && 'text-red-700 animate-shake',
                  !lastRoll.critical && 'text-slate-700'
                )}>
                  {formatShortResult(lastRoll)}
                </p>
                <p className="text-sm text-slate-600 mt-1 font-mono">
                  {formatRollResult(lastRoll)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}