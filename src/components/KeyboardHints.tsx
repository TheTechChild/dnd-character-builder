import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export function KeyboardHints() {
  const { shortcuts } = useKeyboardShortcuts();
  
  // Only show on desktop
  if (window.innerWidth < 1024) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden lg:block">
      <div className="bg-darker/90 backdrop-blur-md border border-border-subtle rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-heading font-semibold text-gold-bright mb-2">
          Keyboard Shortcuts
        </h4>
        {shortcuts.slice(0, 4).map((shortcut, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <kbd className="px-2 py-1 bg-dark rounded text-xs font-mono">
              {shortcut.ctrl && 'Ctrl+'}
              {shortcut.alt && 'Alt+'}
              {shortcut.shift && 'Shift+'}
              {shortcut.key}
            </kbd>
            <span className="text-muted-foreground">{shortcut.description}</span>
          </div>
        ))}
        <div className="text-xs text-muted-foreground mt-2">
          Press <kbd className="px-1 py-0.5 bg-dark rounded text-xs font-mono">?</kbd> for all shortcuts
        </div>
      </div>
    </div>
  );
}