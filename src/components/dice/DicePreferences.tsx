import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/switch';
import { useDiceStore, useDicePreferences } from '@/stores/diceStore';
import { Dices, Volume2, Sparkles, Layout } from 'lucide-react';

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
              <Volume2 className="h-4 w-4" />
              Sound Effects
            </Label>
            <p className="text-sm text-muted-foreground">
              Play sounds when rolling dice
            </p>
          </div>
          <Switch
            id="sound-effects"
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="animations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
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