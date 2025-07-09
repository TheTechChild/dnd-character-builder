import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { FileDropZone } from './FileDropZone';
import { ImportConflictDialog } from './ImportConflictDialog';
import { useCharacters, useCharacterActions, useQuickActions } from '@/stores/hooks';
import { useToast } from '@/components/ui/use-toast';
import { exportCharactersToJSON } from '@/utils/export';
import { exportCharacterToPDF } from '@/utils/pdf-export';
import { importCharactersFromFile, importFromURL } from '@/utils/import';
import { findConflicts, ImportConflict, ConflictResolution, resolveConflict } from '@/utils/import-conflicts';
import { Character } from '@/types/character';
import { Download, Upload, FileJson, FileText, Link } from 'lucide-react';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCharacterId?: string;
}

export function ImportExportDialog({
  open,
  onOpenChange,
  selectedCharacterId,
}: ImportExportDialogProps) {
  const characters = useCharacters();
  const { addCharacter, updateCharacter } = useCharacterActions();
  const { createCharacter } = useQuickActions();
  const { toast } = useToast();
  
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<Set<string>>(
    new Set(selectedCharacterId ? [selectedCharacterId] : [])
  );
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [currentConflict, setCurrentConflict] = useState<ImportConflict | null>(null);
  const [pendingImports, setPendingImports] = useState<Character[]>([]);
  const [conflicts, setConflicts] = useState<ImportConflict[]>([]);

  const handleExportJSON = useCallback(async () => {
    const selectedChars = characters.filter(char => selectedCharacterIds.has(char.id));
    
    if (selectedChars.length === 0) {
      toast({
        title: 'No characters selected',
        description: 'Please select at least one character to export.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await exportCharactersToJSON(selectedChars);
      toast({
        title: 'Export successful',
        description: `Exported ${selectedChars.length} character${selectedChars.length > 1 ? 's' : ''}`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  }, [characters, selectedCharacterIds, toast]);

  const handleExportPDF = useCallback(async () => {
    const selectedChars = characters.filter(char => selectedCharacterIds.has(char.id));
    
    if (selectedChars.length !== 1) {
      toast({
        title: 'Select one character',
        description: 'PDF export is only available for single characters.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await exportCharacterToPDF(selectedChars[0]);
      toast({
        title: 'PDF exported successfully',
        description: `Exported ${selectedChars[0].name} as PDF`,
      });
    } catch (error) {
      toast({
        title: 'PDF export failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  }, [characters, selectedCharacterIds, toast]);

  const processImport = useCallback(async (importedCharacters: Character[]) => {
    const foundConflicts = findConflicts(importedCharacters, characters);
    
    if (foundConflicts.length === 0) {
      // No conflicts, import all
      importedCharacters.forEach(char => createCharacter(char));
      toast({
        title: 'Import successful',
        description: `Imported ${importedCharacters.length} character${importedCharacters.length > 1 ? 's' : ''}`,
      });
      onOpenChange(false);
    } else {
      // Handle conflicts
      setPendingImports(importedCharacters);
      setConflicts(foundConflicts);
      setCurrentConflict(foundConflicts[0]);
    }
  }, [characters, createCharacter, toast, onOpenChange]);

  const handleFilesDropped = useCallback(async (files: FileList) => {
    setIsImporting(true);
    
    try {
      const file = files[0]; // Handle first file for now
      const result = await importCharactersFromFile(file);
      
      if (result.success && result.data) {
        await processImport(result.data);
      } else {
        const errorMessages = result.errors?.map(e => e.message).join(', ') || 'Unknown error';
        toast({
          title: 'Import failed',
          description: errorMessages,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  }, [processImport, toast]);

  const handleImportFromURL = useCallback(async () => {
    if (!importUrl.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter a URL to import from.',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    
    try {
      const result = await importFromURL(importUrl);
      
      if (result.success && result.data) {
        const characters = Array.isArray(result.data) ? result.data : [result.data];
        await processImport(characters);
        setImportUrl('');
      } else {
        const errorMessages = result.errors?.map(e => e.message).join(', ') || 'Unknown error';
        toast({
          title: 'Import failed',
          description: errorMessages,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  }, [importUrl, processImport, toast]);

  const handleConflictResolution = useCallback((resolution: ConflictResolution) => {
    if (!currentConflict) return;

    const resolved = resolveConflict(currentConflict, resolution);
    
    if (resolved) {
      if (resolution === 'replace' || resolution === 'merge') {
        updateCharacter(resolved.id, resolved);
      } else {
        addCharacter(resolved);
      }
    }

    // Move to next conflict
    const remainingConflicts = conflicts.slice(1);
    setConflicts(remainingConflicts);
    
    if (remainingConflicts.length > 0) {
      setCurrentConflict(remainingConflicts[0]);
    } else {
      // All conflicts resolved, import non-conflicting characters
      const conflictingIds = new Set([...conflicts, currentConflict].map(c => c.importedCharacter.id));
      const nonConflicting = pendingImports.filter(char => !conflictingIds.has(char.id));
      
      nonConflicting.forEach(char => createCharacter(char));
      
      toast({
        title: 'Import complete',
        description: `Successfully imported ${pendingImports.length} character${pendingImports.length > 1 ? 's' : ''}`,
      });
      
      // Reset state
      setCurrentConflict(null);
      setPendingImports([]);
      onOpenChange(false);
    }
  }, [currentConflict, conflicts, pendingImports, updateCharacter, addCharacter, createCharacter, toast, onOpenChange]);

  const handleConflictCancel = useCallback(() => {
    setCurrentConflict(null);
    setConflicts([]);
    setPendingImports([]);
    toast({
      title: 'Import cancelled',
      description: 'No characters were imported.',
    });
  }, [toast]);

  const toggleCharacterSelection = (characterId: string) => {
    const newSelection = new Set(selectedCharacterIds);
    if (newSelection.has(characterId)) {
      newSelection.delete(characterId);
    } else {
      newSelection.add(characterId);
    }
    setSelectedCharacterIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedCharacterIds.size === characters.length) {
      setSelectedCharacterIds(new Set());
    } else {
      setSelectedCharacterIds(new Set(characters.map(c => c.id)));
    }
  };

  return (
    <>
      <Dialog open={open && !currentConflict} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import/Export Characters</DialogTitle>
            <DialogDescription>
              Export your characters for backup or import characters from files or URLs.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export">
                <Download className="mr-2 h-4 w-4" />
                Export
              </TabsTrigger>
              <TabsTrigger value="import">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Select Characters</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSelectAll}
                    >
                      {selectedCharacterIds.size === characters.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                  
                  <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-4">
                    {characters.map((character) => (
                      <div key={character.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={character.id}
                          checked={selectedCharacterIds.has(character.id)}
                          onCheckedChange={() => toggleCharacterSelection(character.id)}
                        />
                        <Label
                          htmlFor={character.id}
                          className="flex-1 cursor-pointer text-sm font-normal"
                        >
                          {character.name} - Level {character.level} {character.class}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleExportJSON}
                    disabled={selectedCharacterIds.size === 0}
                    className="flex-1"
                  >
                    <FileJson className="mr-2 h-4 w-4" />
                    Export as JSON
                  </Button>
                  <Button
                    onClick={handleExportPDF}
                    disabled={selectedCharacterIds.size !== 1}
                    variant="outline"
                    className="flex-1"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <FileDropZone
                onFilesDropped={handleFilesDropped}
                accept=".json"
                multiple={false}
                disabled={isImporting}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or import from URL
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/character.json"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  disabled={isImporting}
                />
                <Button
                  onClick={handleImportFromURL}
                  disabled={isImporting || !importUrl.trim()}
                >
                  <Link className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ImportConflictDialog
        conflict={currentConflict}
        onResolve={handleConflictResolution}
        onCancel={handleConflictCancel}
      />
    </>
  );
}