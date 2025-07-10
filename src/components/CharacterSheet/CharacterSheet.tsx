import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoreStatsPage } from './pages/CoreStatsPage';
import { DetailsPage } from './pages/DetailsPage';
import { SpellcastingPage } from './pages/SpellcastingPage';
import { hasSpellcasting } from '@/utils/spellcasting';
import { cn } from '@/utils/cn';
import { Edit2, Save, X, Undo2, Redo2 } from 'lucide-react';
import { useEditMode, useEditActions, useEditHistory, useEditableCharacter, useAutosave } from '@/stores/editHooks';
import { useSwipeableNavigation } from '@/hooks/useSwipeGesture';
import { Button } from '@/components/ui/button';

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
    <div className="container mx-auto p-2 sm:p-4 max-w-7xl print:p-0">
      {/* Edit Mode Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 print:hidden">
        <h1 className="text-xl md:text-2xl font-bold">
          {character.name}
          {isDirty && <span className="text-xs md:text-sm text-orange-500 ml-2">(unsaved changes)</span>}
        </h1>
        
        <div className="flex items-center gap-2 justify-end">
          {isEditMode && (
            <>
              <Button
                variant="ghost"
                size="small"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className="touch-target-sm"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className="touch-target-sm"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1 hidden sm:block" />
              <Button
                variant="primary"
                size="small"
                onClick={handleSave}
                disabled={!canSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={cancelChanges}
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
            className="touch-target"
          >
            <Edit2 className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{isEditMode ? 'Exit Edit Mode' : 'Edit'}</span>
            <span className="sm:hidden">{isEditMode ? 'Exit' : 'Edit'}</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-3 print:hidden">
          <TabsTrigger value="core" className="touch-target text-xs sm:text-sm">
            <span className="hidden sm:inline">Core Stats</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="touch-target text-xs sm:text-sm">
            <span className="hidden sm:inline">Details & Equipment</span>
            <span className="sm:hidden">Details</span>
          </TabsTrigger>
          {showSpellcasting && (
            <TabsTrigger value="spellcasting" className="touch-target text-xs sm:text-sm">
              <span className="hidden sm:inline">Spellcasting</span>
              <span className="sm:hidden">Spells</span>
            </TabsTrigger>
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
  );
}