import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, X, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DiceRoller } from './DiceRoller';
import { DiceHistory } from './DiceHistory';
import { useDiceStore } from '@/stores/diceStore';

export function FloatingDiceWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { showFloatingWidget, setShowFloatingWidget } = useDiceStore();
  
  if (!showFloatingWidget) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-sm">Dice Roller</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowHistory(!showHistory)}
                    title={showHistory ? "Show roller" : "Show history"}
                  >
                    {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setIsOpen(false)}
                    title="Minimize"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowFloatingWidget(false)}
                    title="Close widget"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <motion.div
                initial={false}
                animate={{ height: showHistory ? 500 : 'auto' }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {showHistory ? (
                  <DiceHistory className="border-0 rounded-none shadow-none max-h-[450px]" maxItems={20} />
                ) : (
                  <DiceRoller className="border-0 rounded-none shadow-none" />
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg",
          "transition-colors duration-200"
        )}
        title="Toggle dice roller"
      >
        <Dices className="h-6 w-6" />
      </motion.button>
    </div>
  );
}