import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDiceStore, useDiceHistory } from '@/stores/diceStore';
import { formatShortResult, formatRollResult } from '@/utils/diceRoller';
import { formatDistanceToNow } from 'date-fns';

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
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle>Roll History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">No rolls yet</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Roll History</CardTitle>
        <Button
          variant="ghost"
          size="small"
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence mode="popLayout">
            {displayHistory.map((roll, index) => (
              <motion.div
                key={roll.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative mb-3 p-3 rounded-lg border',
                  roll.critical === 'hit' && 'bg-green-50 border-green-300',
                  roll.critical === 'miss' && 'bg-red-50 border-red-300',
                  !roll.critical && 'bg-gray-50 border-gray-200'
                )}
              >
                <Button
                  variant="ghost"
                  size="small"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => removeFromHistory(roll.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
                
                <div className="pr-8">
                  {roll.label && (
                    <p className="text-sm font-medium mb-1">{roll.label}</p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {roll.critical === 'hit' && (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    )}
                    {roll.critical === 'miss' && (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    
                    <p className={cn(
                      'text-lg font-semibold',
                      roll.critical === 'hit' && 'text-green-600',
                      roll.critical === 'miss' && 'text-red-600'
                    )}>
                      {formatShortResult(roll)}
                    </p>
                  </div>
                  
                  {roll.advantage && (
                    <span className="text-xs text-green-600 font-medium">
                      Advantage
                    </span>
                  )}
                  {roll.disadvantage && (
                    <span className="text-xs text-red-600 font-medium">
                      Disadvantage
                    </span>
                  )}
                  
                  <p className="text-xs text-gray-600 mt-1">
                    {formatRollResult(roll)}
                  </p>
                  
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(roll.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}