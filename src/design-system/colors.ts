export const colors = {
  // Primary colors - Deep crimson reds for accents
  primary: {
    darkCrimson: '#8B0000',
    crimson: '#DC143C',
    lightCrimson: '#E85D75',
    crimsonGlow: 'rgba(220, 20, 60, 0.4)',
  },

  // Background colors - Rich dark grays with purple undertones
  background: {
    darkest: '#0A0A0B',
    darker: '#131316',
    dark: '#1A1A1F',
    medium: '#232329',
    light: '#2A2A32',
    lighter: '#32323B',
    lightest: '#3A3A45',
  },

  // Gold accents for highlights and important elements
  gold: {
    bright: '#FFD700',
    medium: '#FFA500',
    dark: '#FF8C00',
    antique: '#D4A574',
    glow: 'rgba(255, 215, 0, 0.3)',
  },

  // Mystic purples for magic elements
  mystic: {
    deep: '#6B46C1',
    medium: '#7C3AED',
    bright: '#8B5CF6',
    light: '#A78BFA',
    glow: 'rgba(124, 58, 237, 0.4)',
  },

  // Fantasy-themed status colors
  status: {
    // Success - Emerald greens
    success: {
      dark: '#065F46',
      medium: '#10B981',
      light: '#34D399',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
    // Error - Blood reds
    error: {
      dark: '#991B1B',
      medium: '#DC2626',
      light: '#EF4444',
      glow: 'rgba(220, 38, 38, 0.3)',
    },
    // Warning - Amber yellows
    warning: {
      dark: '#92400E',
      medium: '#F59E0B',
      light: '#FCD34D',
      glow: 'rgba(245, 158, 11, 0.3)',
    },
    // Info - Mystic blues
    info: {
      dark: '#1E3A8A',
      medium: '#3B82F6',
      light: '#60A5FA',
      glow: 'rgba(59, 130, 246, 0.3)',
    },
  },

  // Text colors
  text: {
    primary: '#F5F5F0',
    secondary: '#A0A0A0',
    tertiary: '#707070',
    muted: '#505050',
    inverse: '#0A0A0B',
  },

  // Border colors
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    default: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.20)',
    mystic: 'rgba(139, 92, 246, 0.30)',
    gold: 'rgba(255, 215, 0, 0.25)',
  },

  // Shadow colors
  shadow: {
    dark: 'rgba(0, 0, 0, 0.5)',
    purple: 'rgba(107, 70, 193, 0.15)',
    gold: 'rgba(255, 215, 0, 0.1)',
    crimson: 'rgba(220, 20, 60, 0.15)',
  },

  // Special effects
  effects: {
    parchment: '#F4E8D0',
    parchmentDark: '#D4C5A0',
    mist: 'rgba(255, 255, 255, 0.03)',
    shimmer: 'rgba(255, 215, 0, 0.05)',
  },
} as const;

// Light theme overrides (for future implementation)
export const lightColors = {
  background: {
    darkest: '#FFFFFF',
    darker: '#F9FAFB',
    dark: '#F3F4F6',
    medium: '#E5E7EB',
    light: '#D1D5DB',
    lighter: '#C7C7CF',
    lightest: '#9CA3AF',
  },
  text: {
    primary: '#0A0A0B',
    secondary: '#374151',
    tertiary: '#6B7280',
    muted: '#9CA3AF',
    inverse: '#F5F5F0',
  },
  border: {
    subtle: 'rgba(0, 0, 0, 0.08)',
    default: 'rgba(0, 0, 0, 0.12)',
    strong: 'rgba(0, 0, 0, 0.20)',
    mystic: 'rgba(107, 70, 193, 0.25)',
    gold: 'rgba(255, 140, 0, 0.30)',
  },
} as const;

// Gradient definitions
export const gradients = {
  // Radial gradients with subtle color shifts
  backgroundSubtle: `radial-gradient(ellipse at top, ${colors.background.dark}, ${colors.background.darkest})`,
  backgroundMystic: `radial-gradient(ellipse at top left, ${colors.background.dark}, ${colors.background.darker} 40%, ${colors.mystic.deep}20 100%)`,
  backgroundCrimson: `radial-gradient(ellipse at bottom right, ${colors.background.dark}, ${colors.background.darker} 40%, ${colors.primary.darkCrimson}20 100%)`,
  
  // Linear gradients for cards and surfaces
  cardSurface: `linear-gradient(135deg, ${colors.background.medium}, ${colors.background.dark})`,
  cardHover: `linear-gradient(135deg, ${colors.background.light}, ${colors.background.medium})`,
  
  // Gold shimmer effects
  goldShimmer: `linear-gradient(90deg, transparent, ${colors.gold.glow}, transparent)`,
  
  // Mystic glow effects
  mysticGlow: `radial-gradient(circle, ${colors.mystic.glow}, transparent 70%)`,
  crimsonGlow: `radial-gradient(circle, ${colors.primary.crimsonGlow}, transparent 70%)`,
  
  // Button gradients
  buttonPrimary: `linear-gradient(135deg, ${colors.primary.crimson}, ${colors.primary.darkCrimson})`,
  buttonGold: `linear-gradient(135deg, ${colors.gold.bright}, ${colors.gold.medium})`,
  buttonMystic: `linear-gradient(135deg, ${colors.mystic.bright}, ${colors.mystic.medium})`,
} as const;