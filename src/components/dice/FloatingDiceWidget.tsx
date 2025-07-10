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
            <div className="relative bg-gradient-to-br from-amber-900/95 via-amber-950/95 to-amber-900/95 rounded-lg shadow-2xl overflow-hidden">
              {/* Brass corner decorations */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-600 clip-path-corner-tl shadow-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-yellow-600 via-yellow-500 to-yellow-600 clip-path-corner-tr shadow-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-yellow-600 via-yellow-500 to-yellow-600 clip-path-corner-bl shadow-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-tl from-yellow-600 via-yellow-500 to-yellow-600 clip-path-corner-br shadow-lg" />
              </div>
              
              {/* Wood grain texture overlay */}
              <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
                <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />
              </div>
              
              {/* Inner content with wood border */}
              <div className="relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 m-2 rounded border-2 border-amber-800/50">
                <div className="flex items-center justify-between p-2 border-b-2 border-amber-800/30">
                  <h3 className="font-serif font-semibold text-sm text-amber-100">Dice Roller</h3>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="small"
                    className="h-6 w-6 p-0 text-amber-200 hover:text-amber-100 hover:bg-amber-800/20"
                    onClick={() => setShowHistory(!showHistory)}
                    title={showHistory ? "Show roller" : "Show history"}
                  >
                    {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    className="h-6 w-6 p-0 text-amber-200 hover:text-amber-100 hover:bg-amber-800/20"
                    onClick={() => setIsOpen(false)}
                    title="Minimize"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    className="h-6 w-6 p-0 text-amber-200 hover:text-amber-100 hover:bg-amber-800/20"
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
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900",
          "text-amber-100 rounded-full p-4 shadow-2xl",
          "border-2 border-amber-700/50",
          "before:absolute before:inset-0 before:rounded-full",
          "before:bg-gradient-to-t before:from-transparent before:via-amber-600/20 before:to-transparent",
          "before:animate-pulse",
          "transition-all duration-200"
        )}
        title="Toggle dice roller"
      >
        <Dices className="h-6 w-6 relative z-10" />
        {/* Mystical glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-amber-400/20 blur-xl animate-pulse" />
      </motion.button>
    </div>
  );
}