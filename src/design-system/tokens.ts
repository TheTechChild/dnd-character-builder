/**
 * Design System Tokens
 * D&D-themed spacing, borders, shadows, and animations
 */

/**
 * Spacing Scale
 * Based on D&D measurements where 0.25rem = 1 "foot"
 * 1 square = 5 feet = 1.25rem
 */
export const spacing = {
  // Base unit: 1 foot = 0.25rem
  foot: '0.25rem', // 4px
  
  // Common D&D distances
  square: '1.25rem', // 5 feet / 1 square (20px)
  reach: '1.25rem', // Standard melee reach
  shortRange: '2.5rem', // 10 feet (40px)
  mediumRange: '5rem', // 20 feet (80px)
  longRange: '7.5rem', // 30 feet (120px)
  
  // Practical spacing values
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px - half foot
  1: '0.25rem', // 4px - 1 foot
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px - 2 feet
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px - 3 feet
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px - 4 feet
  5: '1.25rem', // 20px - 1 square
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px - 2 squares
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px - 4 squares
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px - 8 squares
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px - 12 squares
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px - 16 squares
  96: '24rem', // 384px
} as const;

/**
 * Border Radius
 * Medieval/fantasy themed with slight irregularity
 */
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px - sharp corners
  base: '0.25rem', // 4px - slightly rounded
  md: '0.375rem', // 6px - standard rounding
  lg: '0.5rem', // 8px - noticeably rounded
  xl: '0.75rem', // 12px - very rounded
  '2xl': '1rem', // 16px - pill-like
  '3xl': '1.5rem', // 24px - very pill-like
  full: '9999px', // perfect circle
  
  // Irregular shapes for parchment/stone
  irregular: {
    topLeft: '0.5rem',
    topRight: '0.375rem',
    bottomRight: '0.625rem',
    bottomLeft: '0.25rem',
  },
  
  parchment: {
    topLeft: '0.75rem',
    topRight: '0.5rem',
    bottomRight: '1rem',
    bottomLeft: '0.625rem',
  },
} as const;

/**
 * Border Styles
 * Ornate and magical border effects
 */
export const borders = {
  // Basic borders
  none: 'none',
  solid: '1px solid',
  thick: '2px solid',
  
  // Ornate borders using box-shadow layering
  ornate: {
    simple: '0 0 0 1px var(--color-border-default), 0 0 0 3px var(--color-bg-darkest), 0 0 0 4px var(--color-border-gold)',
    double: '0 0 0 1px var(--color-border-gold), 0 0 0 4px var(--color-bg-darkest), 0 0 0 5px var(--color-border-gold)',
    triple: '0 0 0 1px var(--color-border-gold), 0 0 0 3px var(--color-bg-darkest), 0 0 0 4px var(--color-border-default), 0 0 0 6px var(--color-bg-darkest), 0 0 0 7px var(--color-border-gold)',
  },
  
  // Gradient borders for magical effects
  gradient: {
    gold: 'linear-gradient(135deg, var(--color-gold-bright), var(--color-gold-dark))',
    mystic: 'linear-gradient(135deg, var(--color-mystic-bright), var(--color-mystic-deep))',
    crimson: 'linear-gradient(135deg, var(--color-primary-crimson), var(--color-primary-dark-crimson))',
    rainbow: 'linear-gradient(135deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
  },
  
  // Rough/torn edges for parchment
  rough: {
    subtle: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0,50 Q10,45 20,50 T40,50 T60,50 T80,50 T100,50" stroke="%23D4C5A0" stroke-width="1" fill="none"/%3E%3C/svg%3E")',
    torn: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0,50 Q5,40 10,50 Q15,55 20,50 Q25,45 30,50 Q35,52 40,50 Q45,48 50,50 Q55,53 60,50 Q65,47 70,50 Q75,51 80,50 Q85,49 90,50 Q95,51 100,50" stroke="%23D4C5A0" stroke-width="1" fill="none"/%3E%3C/svg%3E")',
  },
} as const;

/**
 * Shadow System
 * Layered shadows for depth and magical effects
 */
export const shadows = {
  // Subtle shadows for depth
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Colored shadows for magical items
  magical: {
    gold: '0 4px 14px 0 rgba(255, 215, 0, 0.3), 0 2px 8px 0 rgba(255, 215, 0, 0.2)',
    mystic: '0 4px 14px 0 rgba(139, 92, 246, 0.3), 0 2px 8px 0 rgba(139, 92, 246, 0.2)',
    crimson: '0 4px 14px 0 rgba(220, 20, 60, 0.3), 0 2px 8px 0 rgba(220, 20, 60, 0.2)',
    emerald: '0 4px 14px 0 rgba(16, 185, 129, 0.3), 0 2px 8px 0 rgba(16, 185, 129, 0.2)',
  },
  
  // Inset shadows for carved/engraved effects
  inset: {
    sm: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
    base: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    md: 'inset 0 4px 6px -1px rgba(0, 0, 0, 0.4)',
    lg: 'inset 0 8px 12px -2px rgba(0, 0, 0, 0.5)',
    engraved: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6), inset 0 -1px 2px 0 rgba(255, 255, 255, 0.1)',
  },
  
  // Special effect shadows
  glow: {
    gold: '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)',
    mystic: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)',
    crimson: '0 0 20px rgba(220, 20, 60, 0.4), 0 0 40px rgba(220, 20, 60, 0.2)',
  },
} as const;

/**
 * Animation Tokens
 * Timing functions and keyframes for magical effects
 */
export const animations = {
  // Timing functions
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    
    // Magical timing functions
    magical: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  
  // Duration values
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },
  
  // Keyframe animations
  keyframes: {
    // Glow pulse for magical items
    glowPulse: `
      @keyframes glowPulse {
        0%, 100% { 
          box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
          opacity: 0.8;
        }
        50% { 
          box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor;
          opacity: 1;
        }
      }
    `,
    
    // Subtle float for mystical elements
    float: `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `,
    
    // Page turn transition
    pageTurn: `
      @keyframes pageTurn {
        0% { 
          transform: rotateY(0);
          transform-origin: left center;
        }
        100% { 
          transform: rotateY(-180deg);
          transform-origin: left center;
        }
      }
    `,
    
    // Shimmer effect
    shimmer: `
      @keyframes shimmer {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
    `,
    
    // Fade in/out
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    
    fadeOut: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
  },
} as const;

/**
 * Z-index scale for layering
 */
export const zIndex = {
  behind: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  notification: 70,
  max: 9999,
} as const;

/**
 * Export tokens as CSS custom properties
 */
export const generateCSSVariables = () => {
  const cssVars: string[] = [];
  
  // Spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    const varName = key.replace('.', '-');
    cssVars.push(`--spacing-${varName}: ${value};`);
  });
  
  // Border radius variables
  Object.entries(borderRadius).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cssVars.push(`--radius-${key}: ${value};`);
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        cssVars.push(`--radius-${key}-${subKey}: ${subValue};`);
      });
    }
  });
  
  // Shadow variables
  Object.entries(shadows).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cssVars.push(`--shadow-${key}: ${value};`);
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        cssVars.push(`--shadow-${key}-${subKey}: ${subValue};`);
      });
    }
  });
  
  // Animation timing variables
  Object.entries(animations.timing).forEach(([key, value]) => {
    cssVars.push(`--timing-${key}: ${value};`);
  });
  
  // Animation duration variables
  Object.entries(animations.duration).forEach(([key, value]) => {
    cssVars.push(`--duration-${key}: ${value};`);
  });
  
  // Z-index variables
  Object.entries(zIndex).forEach(([key, value]) => {
    cssVars.push(`--z-${key}: ${value};`);
  });
  
  return cssVars.join('\n  ');
};

/**
 * Type exports for TypeScript usage
 */
export type SpacingScale = keyof typeof spacing;
export type BorderRadiusScale = keyof typeof borderRadius;
export type ShadowScale = keyof typeof shadows;
export type AnimationTiming = keyof typeof animations.timing;
export type AnimationDuration = keyof typeof animations.duration;
export type ZIndexScale = keyof typeof zIndex;