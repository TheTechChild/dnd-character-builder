import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Scroll } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDiceStore, useDiceHistory } from '@/stores/diceStore';
import { formatShortResult, formatRollResult } from '@/utils/diceRoller';
import { formatMedievalTime } from '@/utils/medievalDate';
import { getDiceColorTheme, getDiceIcon } from '@/utils/diceColors';

interface DiceHistoryProps {
  className?: string;
  maxItems?: number;
}

export function DiceHistory({ className, maxItems = 50 }: DiceHistoryProps) {
  const history = useDiceHistory();
  const { clearHistory, removeFromHistory } = useDiceStore();
  
  const displayHistory = maxItems ? history.slice(0, maxItems) : history;
  
  if (displayHistory.length === 0) {
    return (
      <Card className={cn('w-full relative overflow-hidden', className)}>
        <div className="absolute inset-0 texture-parchment opacity-10" />
        <CardHeader className="relative">
          <CardTitle className="font-serif text-amber-900 flex items-center gap-2">
            <Scroll className="h-5 w-5" />
            Roll History
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-center text-amber-700/60 font-serif italic">No rolls recorded yet...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn('w-full relative overflow-hidden', className)}>
      {/* Parchment background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50" />
      <div className="absolute inset-0 texture-parchment opacity-20" />
      
      {/* Scroll edges */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-amber-900/20 via-amber-800/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-900/20 via-amber-800/10 to-transparent" />
      
      <CardHeader className="relative flex flex-row items-center justify-between border-b-2 border-amber-900/20">
        <CardTitle className="font-serif text-amber-900 flex items-center gap-2">
          <Scroll className="h-5 w-5" />
          Scroll of Fates
        </CardTitle>
        <Button
          variant="ghost"
          size="small"
          onClick={clearHistory}
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 font-serif text-sm"
        >
          Clear Scroll
        </Button>
      </CardHeader>
      <CardContent className="relative p-0">
        <ScrollArea className="h-[400px] px-6 py-4">
          <AnimatePresence mode="popLayout">
            {displayHistory.map((roll, index) => {
              const colorTheme = getDiceColorTheme(roll.notation);
              const diceIcon = getDiceIcon(roll.notation);
              
              return (
              <motion.div
                key={roll.id}
                initial={{ opacity: 0, x: -20, scaleY: 0 }}
                animate={{ opacity: 1, x: 0, scaleY: 1 }}
                exit={{ opacity: 0, x: 20, scaleY: 0 }}
                transition={{ 
                  delay: index * 0.05,
                  scaleY: { duration: 0.3, ease: 'easeOut' }
                }}
                className={cn(
                  'relative mb-4 p-3 rounded-parchment',
                  'bg-gradient-to-br from-amber-50/50 via-yellow-50/50 to-amber-50/50',
                  'border border-amber-800/30',
                  'shadow-sm hover:shadow-md transition-shadow duration-200',
                  roll.critical === 'hit' && 'border-l-4 border-l-yellow-600 bg-gradient-to-r from-yellow-100/50 to-amber-50/50',
                  roll.critical === 'miss' && 'border-l-4 border-l-red-800 bg-gradient-to-r from-red-100/50 to-amber-50/50'
                )}
                style={{ transformOrigin: 'top' }}
              >
                <Button
                  variant="ghost"
                  size="small"
                  className="absolute top-1 right-1 h-6 w-6 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-200/50"
                  onClick={() => removeFromHistory(roll.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                <div className="pr-8">
                  {roll.label && (
                    <p className="text-sm font-serif font-medium mb-1 text-amber-900">{roll.label}</p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className={cn('text-2xl', colorTheme.secondary)}>
                      {diceIcon}
                    </span>
                    
                    {roll.critical === 'hit' && (
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                    )}
                    {roll.critical === 'miss' && (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    
                    <p className={cn(
                      'text-xl font-serif font-bold',
                      roll.critical === 'hit' && 'text-yellow-700 text-glow-gold',
                      roll.critical === 'miss' && 'text-red-800',
                      !roll.critical && colorTheme.primary,
                      !roll.critical && colorTheme.glow
                    )}>
                      {formatShortResult(roll)}
                    </p>
                  </div>
                  
                  {roll.advantage && (
                    <span className="text-xs text-emerald-700 font-serif italic">
                      ✦ Blessed Fortune
                    </span>
                  )}
                  {roll.disadvantage && (
                    <span className="text-xs text-red-700 font-serif italic">
                      ✦ Cursed Fate
                    </span>
                  )}
                  
                  <p className="text-xs text-amber-700/80 mt-1 font-mono">
                    {formatRollResult(roll)}
                  </p>
                  
                  <p className="text-xs text-amber-600/60 mt-2 font-serif italic">
                    ⸻ {formatMedievalTime(roll.timestamp)}
                  </p>
                </div>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}