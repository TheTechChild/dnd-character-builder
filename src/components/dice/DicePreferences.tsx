import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/switch';
import { useDiceStore, useDicePreferences } from '@/stores/diceStore';
import { Dices, Volume2, VolumeX, Sparkles, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function DicePreferences() {
  const { soundEnabled, animationsEnabled, showFloatingWidget } = useDicePreferences();
  const { setSoundEnabled, setAnimationsEnabled, setShowFloatingWidget } = useDiceStore();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dices className="h-5 w-5" />
          Dice Roller Preferences
        </CardTitle>
        <CardDescription>
          Customize your dice rolling experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-effects" className="flex items-center gap-2">
              <AnimatePresence mode="wait">
                {soundEnabled ? (
                  <motion.div
                    key="volume-on"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Volume2 className="h-4 w-4 text-amber-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="volume-off"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VolumeX className="h-4 w-4 text-slate-400" />
                  </motion.div>
                )}
              </AnimatePresence>
              Sound Effects
            </Label>
            <p className="text-sm text-muted-foreground">
              Play sounds when rolling dice
            </p>
          </div>
          <div className="relative">
            <Switch
              id="sound-effects"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              className="relative"
            />
            <AnimatePresence>
              {soundEnabled && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Sound wave animation */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.6, 0.3, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-amber-400" />
                  </motion.div>
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.6, 0.3, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5
                    }}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-amber-300" />
                  </motion.div>
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.6, 0.3, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 1
                    }}
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-amber-200" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="animations" className="flex items-center gap-2">
              <motion.div
                animate={animationsEnabled ? {
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1.1, 1]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: animationsEnabled ? Infinity : 0,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className={cn(
                  "h-4 w-4",
                  animationsEnabled ? "text-purple-600" : "text-slate-400"
                )} />
              </motion.div>
              Animations
            </Label>
            <p className="text-sm text-muted-foreground">
              Show rolling animations and transitions
            </p>
          </div>
          <Switch
            id="animations"
            checked={animationsEnabled}
            onCheckedChange={setAnimationsEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="floating-widget" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Floating Dice Widget
            </Label>
            <p className="text-sm text-muted-foreground">
              Show floating dice roller button
            </p>
          </div>
          <Switch
            id="floating-widget"
            checked={showFloatingWidget}
            onCheckedChange={setShowFloatingWidget}
          />
        </div>
      </CardContent>
    </Card>
  );
}