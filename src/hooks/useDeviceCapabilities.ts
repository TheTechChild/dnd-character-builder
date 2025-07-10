import { useState, useEffect } from 'react';

export interface DeviceCapabilities {
  hasTouch: boolean;
  hasHover: boolean;
  hasReducedMotion: boolean;
  hasFinePointer: boolean;
  hasHighContrast: boolean;
  colorGamut: 'srgb' | 'p3' | 'rec2020';
  connectionSpeed: 'slow' | 'fast' | 'unknown';
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    hasTouch: false,
    hasHover: false,
    hasReducedMotion: false,
    hasFinePointer: false,
    hasHighContrast: false,
    colorGamut: 'srgb',
    connectionSpeed: 'unknown'
  });

  useEffect(() => {
    const checkCapabilities = () => {
      // Touch capability
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Hover capability
      const hoverQuery = window.matchMedia('(hover: hover)');
      const hasHover = hoverQuery.matches;

      // Reduced motion preference
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const hasReducedMotion = motionQuery.matches;

      // Pointer precision
      const pointerQuery = window.matchMedia('(pointer: fine)');
      const hasFinePointer = pointerQuery.matches;

      // High contrast mode
      const contrastQuery = window.matchMedia('(prefers-contrast: high)');
      const hasHighContrast = contrastQuery.matches;

      // Color gamut
      let colorGamut: 'srgb' | 'p3' | 'rec2020' = 'srgb';
      if (window.matchMedia('(color-gamut: rec2020)').matches) {
        colorGamut = 'rec2020';
      } else if (window.matchMedia('(color-gamut: p3)').matches) {
        colorGamut = 'p3';
      }

      // Connection speed
      let connectionSpeed: 'slow' | 'fast' | 'unknown' = 'unknown';
      if ('connection' in navigator) {
        const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
        if (connection) {
          const effectiveType = connection.effectiveType;
          connectionSpeed = effectiveType === 'slow-2g' || effectiveType === '2g' ? 'slow' : 'fast';
        }
      }

      setCapabilities({
        hasTouch,
        hasHover,
        hasReducedMotion,
        hasFinePointer,
        hasHighContrast,
        colorGamut,
        connectionSpeed
      });
    };

    checkCapabilities();

    // Listen for changes
    const mediaQueries = [
      window.matchMedia('(hover: hover)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(pointer: fine)'),
      window.matchMedia('(prefers-contrast: high)')
    ];

    mediaQueries.forEach(query => {
      query.addEventListener('change', checkCapabilities);
    });

    return () => {
      mediaQueries.forEach(query => {
        query.removeEventListener('change', checkCapabilities);
      });
    };
  }, []);

  return capabilities;
}