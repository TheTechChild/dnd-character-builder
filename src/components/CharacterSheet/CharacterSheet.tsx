import { useParams, Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CoreStatsPage } from './pages/CoreStatsPage';
import { DetailsPage } from './pages/DetailsPage';
import { SpellcastingPage } from './pages/SpellcastingPage';
import { hasSpellcasting } from '@/utils/spellcasting';
import { cn } from '@/utils/cn';
import { Edit2, Save, X, Undo2, Redo2 } from 'lucide-react';
import { useEditMode, useEditActions, useEditHistory, useEditableCharacter, useAutosave } from '@/stores/editHooks';
import { Button } from '@/components/ui/button';

export function CharacterSheet() {
  const { id } = useParams();
  
  // Edit mode hooks
  const { isEditMode, isDirty, enableEditMode, disableEditMode } = useEditMode();
  const { saveChanges, cancelChanges, canSave } = useEditActions();
  const { undo, redo, canUndo, canRedo } = useEditHistory();
  
  // Use editable character that merges with temp data
  const character = useEditableCharacter(id);
  
  // Enable autosave
  useAutosave(isEditMode, 2000);

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
    <div className="container mx-auto p-4 max-w-7xl print:p-0">
      {/* Edit Mode Toolbar */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <h1 className="text-2xl font-bold">
          {character.name}
          {isDirty && <span className="text-sm text-orange-500 ml-2">(unsaved changes)</span>}
        </h1>
        
        <div className="flex items-center gap-2">
          {isEditMode && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </Button>
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={!canSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelChanges}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          <Button
            variant={isEditMode ? "ghost" : "default"}
            size="sm"
            onClick={handleEditToggle}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditMode ? 'Exit Edit Mode' : 'Edit'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="core" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-3 print:hidden">
          <TabsTrigger value="core">Core Stats</TabsTrigger>
          <TabsTrigger value="details">Details & Equipment</TabsTrigger>
          {showSpellcasting && (
            <TabsTrigger value="spellcasting">Spellcasting</TabsTrigger>
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