import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/Label';
import { ImportConflict, ConflictResolution } from '@/utils/import-conflicts';
import { AlertCircle } from 'lucide-react';

interface ImportConflictDialogProps {
  conflict: ImportConflict | null;
  onResolve: (resolution: ConflictResolution) => void;
  onCancel: () => void;
}

export function ImportConflictDialog({
  conflict,
  onResolve,
  onCancel,
}: ImportConflictDialogProps) {
  const [resolution, setResolution] = React.useState<ConflictResolution>('skip');

  if (!conflict) return null;

  const handleResolve = () => {
    onResolve(resolution);
  };

  return (
    <Dialog open={!!conflict} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Import Conflict
          </DialogTitle>
          <DialogDescription>
            A character with the name "{conflict.importedCharacter.name}" already exists.
            How would you like to resolve this conflict?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Existing Character</p>
              <p className="text-muted-foreground">
                Level {conflict.existingCharacter.level} {conflict.existingCharacter.class}
              </p>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(conflict.existingCharacter.updatedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="font-medium">Imported Character</p>
              <p className="text-muted-foreground">
                Level {conflict.importedCharacter.level} {conflict.importedCharacter.class}
              </p>
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(conflict.importedCharacter.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <RadioGroup value={resolution} onValueChange={(value) => setResolution(value as ConflictResolution)}>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skip" id="skip" />
                <Label htmlFor="skip" className="flex-1 cursor-pointer">
                  <span className="font-medium">Skip</span>
                  <span className="block text-sm text-muted-foreground">
                    Don't import this character
                  </span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="replace" id="replace" />
                <Label htmlFor="replace" className="flex-1 cursor-pointer">
                  <span className="font-medium">Replace</span>
                  <span className="block text-sm text-muted-foreground">
                    Replace the existing character with the imported one
                  </span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="duplicate" id="duplicate" />
                <Label htmlFor="duplicate" className="flex-1 cursor-pointer">
                  <span className="font-medium">Create Duplicate</span>
                  <span className="block text-sm text-muted-foreground">
                    Import as a new character with "(Imported)" suffix
                  </span>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="merge" id="merge" />
                <Label htmlFor="merge" className="flex-1 cursor-pointer">
                  <span className="font-medium">Merge</span>
                  <span className="block text-sm text-muted-foreground">
                    Combine data from both characters (imported data takes priority)
                  </span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleResolve}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}