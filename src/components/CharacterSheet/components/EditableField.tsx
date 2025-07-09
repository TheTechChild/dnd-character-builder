import { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { Check, X, AlertCircle } from 'lucide-react';
import { validateCharacterField } from '@/schemas/characterEditSchema';

interface EditableFieldProps<T> {
  value: T;
  onSave: (value: T) => void;
  fieldName?: keyof typeof import('@/schemas/characterEditSchema').characterFieldValidators;
  type?: 'text' | 'number' | 'textarea';
  className?: string;
  editClassName?: string;
  displayFormatter?: (value: T) => string;
  parser?: (value: string) => T;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  disabled?: boolean;
  isEditMode?: boolean;
}

export function EditableField<T = string | number>({
  value,
  onSave,
  fieldName,
  type = 'text',
  className,
  editClassName,
  displayFormatter,
  parser,
  min,
  max,
  step,
  placeholder,
  disabled = false,
  isEditMode = false
}: EditableFieldProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  // Format value for display
  const displayValue = displayFormatter ? displayFormatter(value) : String(value);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleEdit = () => {
    if (disabled || !isEditMode) return;
    setIsEditing(true);
    setEditValue(String(value));
    setError(null);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
    setError(null);
  };
  
  const handleSave = () => {
    try {
      let parsedValue: T;
      
      if (parser) {
        parsedValue = parser(editValue);
      } else if (type === 'number') {
        parsedValue = Number(editValue) as T;
      } else {
        parsedValue = editValue as T;
      }
      
      // Validate if field name is provided
      if (fieldName) {
        const validation = validateCharacterField(fieldName, parsedValue);
        if (!validation.success) {
          setError(validation.error || 'Invalid value');
          return;
        }
      }
      
      onSave(parsedValue);
      setIsEditing(false);
      setEditValue('');
      setError(null);
    } catch (err) {
      setError('Invalid value');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  if (!isEditMode || !isEditing) {
    return (
      <div
        className={cn(
          'relative group',
          isEditMode && !disabled && 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded px-1 -mx-1',
          className
        )}
        onClick={handleEdit}
      >
        {displayValue || <span className="text-slate-400 italic">{placeholder || 'Click to edit'}</span>}
        {isEditMode && !disabled && (
          <div className="absolute inset-0 ring-2 ring-blue-500 ring-opacity-0 group-hover:ring-opacity-50 rounded pointer-events-none" />
        )}
      </div>
    );
  }
  
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div className="relative">
      <div className="flex items-start gap-1">
        <InputComponent
          ref={inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>}
          type={type === 'number' ? 'number' : 'text'}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            // Don't cancel if clicking on action buttons
            if (!e.relatedTarget?.closest('.editable-field-actions')) {
              handleCancel();
            }
          }}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={cn(
            'w-full px-2 py-1 text-sm border rounded',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-500' : 'border-slate-300 dark:border-slate-600',
            editClassName
          )}
        />
        <div className="editable-field-actions flex gap-1">
          <button
            onClick={handleSave}
            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {error && (
        <div className="absolute top-full left-0 mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
    </div>
  );
}