import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { CoreStatsPage } from './pages/CoreStatsPage';
import { DetailsPage } from './pages/DetailsPage';
import { SpellcastingPage } from './pages/SpellcastingPage';
import { hasSpellcasting } from '@/utils/spellcasting';
import { cn } from '@/utils/cn';
import { Edit2, Save, X, Undo2, Redo2, Scroll, Shield, Sparkles, Swords } from 'lucide-react';
import { useEditMode, useEditActions, useEditHistory, useEditableCharacter, useAutosave } from '@/stores/editHooks';
import { useSwipeableNavigation } from '@/hooks/useSwipeGesture';
import { Button } from '@/components/ui/button';

// Parchment edge effect component
const ParchmentEdge = ({ position }: { position: 'top' | 'bottom' | 'left' | 'right' }) => {
  const baseClass = "absolute pointer-events-none";
  const positionClasses = {
    top: "top-0 left-0 right-0 h-8",
    bottom: "bottom-0 left-0 right-0 h-8",
    left: "top-0 left-0 bottom-0 w-8",
    right: "top-0 right-0 bottom-0 w-8"
  };
  
  return (
    <div className={cn(baseClass, positionClasses[position])}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <filter id="roughPaper">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" />
          <feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 1 0" />
        </filter>
        <path
          d={position === 'top' || position === 'bottom' 
            ? "M 0,0 Q 10,10 20,5 T 40,8 T 60,4 T 80,7 T 100,0 L 100,100 L 0,100 Z"
            : "M 0,0 Q 10,10 5,20 T 8,40 T 4,60 T 7,80 T 0,100 L 100,100 L 100,0 Z"
          }
          fill="url(#parchmentGradient)"
          filter="url(#roughPaper)"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

// Bookmark tab component
const BookmarkTab = ({ 
  children, 
  icon: Icon, 
  isActive, 
  onClick 
}: { 
  children: React.ReactNode; 
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-4 py-3 rounded-t-lg transition-all duration-200",
        "border-2 border-b-0",
        isActive 
          ? "bg-gradient-to-b from-amber-100 to-amber-50 border-amber-700 z-10 transform scale-105"
          : "bg-gradient-to-b from-amber-200/50 to-amber-100/50 border-amber-600/50 hover:from-amber-200/70 hover:to-amber-100/70"
      )}
    >
      {/* Ribbon effect */}
      <div className={cn(
        "absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-4",
        "bg-red-700 shadow-lg",
        isActive ? "block" : "hidden"
      )}>
        <svg viewBox="0 0 24 16" className="w-full h-full">
          <path d="M 0,0 L 12,8 L 24,0 L 24,16 L 12,8 L 0,16 Z" fill="currentColor" />
        </svg>
      </div>
      
      <div className="flex items-center gap-2">
        <Icon className={cn(
          "w-4 h-4",
          isActive ? "text-amber-900" : "text-amber-700"
        )} />
        <span className={cn(
          "font-medium hidden sm:inline",
          isActive ? "text-amber-900" : "text-amber-700"
        )}>
          {children}
        </span>
      </div>
    </button>
  );
};

// Ornate section divider
export const SectionDivider = ({ className }: { className?: string }) => (
  <div className={cn("relative my-6", className)}>
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t-2 border-amber-700/30" />
    </div>
    <div className="relative flex justify-center">
      <svg width="80" height="20" viewBox="0 0 80 20" className="bg-gradient-subtle">
        <path
          d="M 10,10 Q 20,5 30,10 T 50,10 T 70,10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-amber-700"
        />
        <circle cx="40" cy="10" r="4" fill="currentColor" className="text-amber-800" />
        <circle cx="20" cy="10" r="2" fill="currentColor" className="text-amber-700" />
        <circle cx="60" cy="10" r="2" fill="currentColor" className="text-amber-700" />
      </svg>
    </div>
  </div>
);

export function CharacterSheet() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('core');
  
  // Edit mode hooks
  const { isEditMode, isDirty, enableEditMode, disableEditMode } = useEditMode();
  const { saveChanges, cancelChanges, canSave } = useEditActions();
  const { undo, redo, canUndo, canRedo } = useEditHistory();
  
  // Use editable character that merges with temp data
  const character = useEditableCharacter(id);
  
  // Enable autosave
  useAutosave(isEditMode, 2000);
  
  // Set up swipe navigation (must be before conditional returns)
  const tabs = character && hasSpellcasting(character) 
    ? ['core', 'details', 'spellcasting'] 
    : ['core', 'details'];
  const currentTabIndex = tabs.indexOf(activeTab);
  
  // Add swipe support for tab navigation
  useSwipeableNavigation(
    currentTabIndex,
    tabs.length,
    (index) => setActiveTab(tabs[index])
  );

  if (!character) {
    return <Navigate to="/characters" replace />;
  }

  const showSpellcasting = hasSpellcasting(character);
  
  const handleEditToggle = () => {
    if (isEditMode) {
      cancelChanges();
    } else {
      enableEditMode(character.id);
    }
  };
  
  const handleSave = async () => {
    const success = await saveChanges();
    if (success) {
      disableEditMode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Custom styles */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .parchment-shadow {
          box-shadow: 
            0 4px 20px rgba(139, 69, 19, 0.3),
            inset 0 2px 10px rgba(255, 255, 255, 0.1),
            inset 0 -2px 10px rgba(0, 0, 0, 0.2);
        }
        
        .text-fantasy {
          font-family: 'Cinzel', 'Georgia', serif;
          letter-spacing: 0.05em;
        }
      `}</style>
      
      {/* Define gradient for parchment edges */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="parchmentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8B6914" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#654321" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="container mx-auto p-2 sm:p-4 max-w-7xl print:p-0">
        {/* Parchment container */}
        <div className="relative bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 rounded-lg parchment-shadow">
          {/* Worn edges */}
          <ParchmentEdge position="top" />
          <ParchmentEdge position="bottom" />
          <ParchmentEdge position="left" />
          <ParchmentEdge position="right" />
          
          {/* Texture overlay */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none rounded-lg"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(139, 69, 19, 0.05) 2px,
                rgba(139, 69, 19, 0.05) 4px
              )`
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 p-4 sm:p-8">
            {/* Edit Mode Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 print:hidden">
              <div className="flex items-center gap-3">
                <Scroll className="w-8 h-8 text-amber-800" />
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-amber-900 text-fantasy">
                  {character.name}
                  {isDirty && <span className="text-sm text-orange-600 ml-2 font-normal">(unsaved changes)</span>}
                </h1>
              </div>
              
              <div className="flex items-center gap-2 justify-end">
                {isEditMode && (
                  <>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={undo}
                      disabled={!canUndo}
                      title="Undo (Ctrl+Z)"
                      className="touch-target-sm bg-amber-200/50 hover:bg-amber-300/50 text-amber-900"
                    >
                      <Undo2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={redo}
                      disabled={!canRedo}
                      title="Redo (Ctrl+Y)"
                      className="touch-target-sm bg-amber-200/50 hover:bg-amber-300/50 text-amber-900"
                    >
                      <Redo2 className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-amber-700/30 mx-1 hidden sm:block" />
                    <Button
                      variant="primary"
                      size="small"
                      onClick={handleSave}
                      disabled={!canSave}
                      className="bg-gradient-to-b from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 border-green-800"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={cancelChanges}
                      className="bg-amber-200/50 hover:bg-amber-300/50 text-amber-900"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                <Button
                  variant={isEditMode ? "ghost" : "primary"}
                  size="small"
                  onClick={handleEditToggle}
                  className={cn(
                    "touch-target",
                    isEditMode 
                      ? "bg-amber-200/50 hover:bg-amber-300/50 text-amber-900"
                      : "bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border-amber-800"
                  )}
                >
                  <Edit2 className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{isEditMode ? 'Exit Edit Mode' : 'Edit'}</span>
                  <span className="sm:hidden">{isEditMode ? 'Exit' : 'Edit'}</span>
                </Button>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="flex gap-2 bg-transparent p-0 h-auto print:hidden">
                <BookmarkTab 
                  icon={Shield} 
                  isActive={activeTab === 'core'}
                  onClick={() => setActiveTab('core')}
                >
                  Core Stats
                </BookmarkTab>
                <BookmarkTab 
                  icon={Swords} 
                  isActive={activeTab === 'details'}
                  onClick={() => setActiveTab('details')}
                >
                  Details & Equipment
                </BookmarkTab>
                {showSpellcasting && (
                  <BookmarkTab 
                    icon={Sparkles} 
                    isActive={activeTab === 'spellcasting'}
                    onClick={() => setActiveTab('spellcasting')}
                  >
                    Spellcasting
                  </BookmarkTab>
                )}
              </TabsList>

              <TabsContent 
                value="core" 
                className={cn(
                  "mt-0 space-y-4",
                  "print:block print:!mt-0"
                )}
              >
                <CoreStatsPage character={character} isEditMode={isEditMode} />
              </TabsContent>

              <TabsContent 
                value="details"
                className={cn(
                  "mt-0 space-y-4",
                  "print:block print:!mt-8 print:break-before-page"
                )}
              >
                <DetailsPage character={character} isEditMode={isEditMode} />
              </TabsContent>

              {showSpellcasting && (
                <TabsContent 
                  value="spellcasting"
                  className={cn(
                    "mt-0 space-y-4",
                    "print:block print:!mt-8 print:break-before-page"
                  )}
                >
                  <SpellcastingPage character={character} isEditMode={isEditMode} />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}