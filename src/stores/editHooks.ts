import { useEditStore } from './editStore';
import { useCharacterStore } from './characterStore';
import { Character } from '@/types/character';
import { useCallback, useEffect } from 'react';
import { useQuickActions } from './hooks';

// Hook to manage edit mode
export function useEditMode() {
  const {
    isEditMode,
    editingCharacterId,
    isDirty,
    setEditMode,
    resetEditState
  } = useEditStore();
  
  const enableEditMode = useCallback((characterId: string) => {
    setEditMode(true, characterId);
  }, [setEditMode]);
  
  const disableEditMode = useCallback(() => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    resetEditState();
  }, [isDirty, resetEditState]);
  
  return {
    isEditMode,
    editingCharacterId,
    isDirty,
    enableEditMode,
    disableEditMode
  };
}

// Hook to handle field changes with history tracking
export function useEditField() {
  const {
    markFieldDirty,
    addChangeToHistory,
    updateTempData,
    editingCharacterId
  } = useEditStore();
  
  const { getCharacter } = useCharacterStore();
  
  const updateField = useCallback(<T extends keyof Character>(
    field: T,
    newValue: Character[T]
  ) => {
    if (!editingCharacterId) return;
    
    const character = getCharacter(editingCharacterId);
    if (!character) return;
    
    const oldValue = character[field];
    
    // Add to history
    addChangeToHistory({
      field: field as string,
      oldValue,
      newValue,
      characterId: editingCharacterId
    });
    
    // Mark field as dirty
    markFieldDirty(field as string);
    
    // Update temp data
    updateTempData({ [field]: newValue });
  }, [editingCharacterId, getCharacter, addChangeToHistory, markFieldDirty, updateTempData]);
  
  return { updateField };
}

// Hook to handle save/cancel operations
export function useEditActions() {
  const {
    isDirty,
    tempCharacterData,
    editingCharacterId,
    clearDirtyFields,
    clearTempData,
    resetEditState
  } = useEditStore();
  
  const { saveCharacter } = useQuickActions();
  
  const saveChanges = useCallback(async () => {
    if (!editingCharacterId || !tempCharacterData) return;
    
    try {
      // Update the character with all temp data
      await saveCharacter(editingCharacterId, tempCharacterData);
      
      // Clear edit state
      clearDirtyFields();
      clearTempData();
      
      return true;
    } catch (error) {
      console.error('Failed to save changes:', error);
      return false;
    }
  }, [editingCharacterId, tempCharacterData, saveCharacter, clearDirtyFields, clearTempData]);
  
  const cancelChanges = useCallback(() => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return false;
    }
    
    resetEditState();
    return true;
  }, [isDirty, resetEditState]);
  
  return {
    saveChanges,
    cancelChanges,
    canSave: isDirty && !!tempCharacterData
  };
}

// Hook for undo/redo functionality
export function useEditHistory() {
  const {
    changeHistory,
    changeHistoryIndex,
    undoChange,
    redoChange,
    canUndo,
    canRedo,
    updateTempData
  } = useEditStore();
  
  
  const undo = useCallback(() => {
    const change = undoChange();
    if (!change) return;
    
    // Update temp data with the old value
    updateTempData({ [change.field]: change.oldValue });
  }, [undoChange, updateTempData]);
  
  const redo = useCallback(() => {
    const change = redoChange();
    if (!change) return;
    
    // Update temp data with the new value
    updateTempData({ [change.field]: change.newValue });
  }, [redoChange, updateTempData]);
  
  return {
    undo,
    redo,
    canUndo: canUndo(),
    canRedo: canRedo(),
    historyLength: changeHistory.length,
    currentIndex: changeHistoryIndex
  };
}

// Hook for autosave functionality
export function useAutosave(enabled: boolean = true, delayMs: number = 2000) {
  const { isDirty, tempCharacterData, editingCharacterId } = useEditStore();
  const { saveChanges } = useEditActions();
  
  useEffect(() => {
    if (!enabled || !isDirty || !tempCharacterData || !editingCharacterId) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      saveChanges();
    }, delayMs);
    
    return () => clearTimeout(timeoutId);
  }, [enabled, isDirty, tempCharacterData, editingCharacterId, delayMs, saveChanges]);
}

// Hook to get the current character data (merged with temp data)
export function useEditableCharacter(characterId: string | undefined) {
  const { getCharacter } = useCharacterStore();
  const { tempCharacterData, isEditMode, editingCharacterId } = useEditStore();
  
  const character = characterId ? getCharacter(characterId) : undefined;
  
  if (!character) return undefined;
  
  // If in edit mode for this character, merge with temp data
  if (isEditMode && editingCharacterId === characterId && tempCharacterData) {
    return {
      ...character,
      ...tempCharacterData
    } as Character;
  }
  
  return character;
}