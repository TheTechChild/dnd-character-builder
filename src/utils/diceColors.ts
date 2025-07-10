/**
 * Get color theme based on dice notation
 */
export function getDiceColorTheme(notation: string): {
  primary: string;
  secondary: string;
  glow?: string;
} {
  const normalized = notation.toLowerCase();
  
  // D20 - Crimson/Red theme
  if (normalized.includes('d20')) {
    return {
      primary: 'text-red-700',
      secondary: 'text-red-600/80',
      glow: 'text-glow-crimson'
    };
  }
  
  // D12 - Rose theme
  if (normalized.includes('d12')) {
    return {
      primary: 'text-rose-700',
      secondary: 'text-rose-600/80'
    };
  }
  
  // D10 - Amber/Gold theme
  if (normalized.includes('d10')) {
    return {
      primary: 'text-amber-700',
      secondary: 'text-amber-600/80',
      glow: 'text-glow-gold'
    };
  }
  
  // D8 - Emerald theme
  if (normalized.includes('d8')) {
    return {
      primary: 'text-emerald-700',
      secondary: 'text-emerald-600/80'
    };
  }
  
  // D6 - Blue theme
  if (normalized.includes('d6')) {
    return {
      primary: 'text-blue-700',
      secondary: 'text-blue-600/80'
    };
  }
  
  // D4 - Purple theme
  if (normalized.includes('d4')) {
    return {
      primary: 'text-purple-700',
      secondary: 'text-purple-600/80',
      glow: 'text-glow-mystic'
    };
  }
  
  // D100 - Slate theme
  if (normalized.includes('d100') || normalized.includes('d%')) {
    return {
      primary: 'text-slate-700',
      secondary: 'text-slate-600/80'
    };
  }
  
  // Advantage - Emerald green
  if (normalized.includes('kh') || normalized.includes('advantage')) {
    return {
      primary: 'text-emerald-700',
      secondary: 'text-emerald-600/80'
    };
  }
  
  // Disadvantage - Deep red
  if (normalized.includes('kl') || normalized.includes('disadvantage')) {
    return {
      primary: 'text-red-800',
      secondary: 'text-red-700/80'
    };
  }
  
  // Default - Amber
  return {
    primary: 'text-amber-900',
    secondary: 'text-amber-700/80'
  };
}

/**
 * Get dice icon based on notation
 */
export function getDiceIcon(notation: string): string {
  const normalized = notation.toLowerCase();
  
  if (normalized.includes('d20')) return '⟐';
  if (normalized.includes('d12')) return '⬟';
  if (normalized.includes('d10')) return '◆';
  if (normalized.includes('d8')) return '◈';
  if (normalized.includes('d6')) return '◻';
  if (normalized.includes('d4')) return '▲';
  if (normalized.includes('d100')) return '⦿';
  
  return '◉'; // Default dice icon
}