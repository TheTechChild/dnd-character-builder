import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

interface ProgressiveImageProps {
  src: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
}

export function ProgressiveImage({ 
  src, 
  placeholderSrc, 
  alt, 
  className 
}: ProgressiveImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc || '');
  const [imageLoading, setImageLoading] = useState(true);
  const capabilities = useDeviceCapabilities();

  useEffect(() => {
    // Skip loading high-res images on slow connections
    if (capabilities.connectionSpeed === 'slow' && placeholderSrc) {
      setImageSrc(placeholderSrc);
      setImageLoading(false);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setImageLoading(false);
    };
  }, [src, placeholderSrc, capabilities.connectionSpeed]);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          'w-full h-full object-cover',
          imageLoading && 'blur-sm scale-110',
          !capabilities.hasReducedMotion && 'transition-all duration-500'
        )}
      />
      {imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
      )}
    </div>
  );
}

interface EnhancedEffectProps {
  children: React.ReactNode;
  className?: string;
  simpleClassName?: string;
  enhancedClassName?: string;
}

export function EnhancedEffect({ 
  children, 
  className,
  simpleClassName = '',
  enhancedClassName = ''
}: EnhancedEffectProps) {
  const capabilities = useDeviceCapabilities();
  
  // Apply progressive enhancement based on capabilities
  const enhancementClasses = cn(
    className,
    // Basic styles for all devices
    simpleClassName,
    // Enhanced styles for capable devices
    {
      [enhancedClassName]: capabilities.hasHover && !capabilities.hasReducedMotion,
      // Remove animations for reduced motion
      'transition-none animate-none': capabilities.hasReducedMotion,
      // Simpler shadows on mobile
      'shadow-sm': capabilities.hasTouch && !capabilities.hasHover,
      // High contrast adjustments
      'border-2 border-white': capabilities.hasHighContrast
    }
  );

  return (
    <div className={enhancementClasses}>
      {children}
    </div>
  );
}

// Utility component for device-specific rendering
interface DeviceOnlyProps {
  children: React.ReactNode;
  desktop?: boolean;
  mobile?: boolean;
  tablet?: boolean;
}

export function DeviceOnly({ 
  children, 
  desktop = false,
  mobile = false,
  tablet = false
}: DeviceOnlyProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      
      if (mobile && width < 640) {
        setShouldRender(true);
      } else if (tablet && width >= 640 && width < 1024) {
        setShouldRender(true);
      } else if (desktop && width >= 1024) {
        setShouldRender(true);
      } else {
        setShouldRender(false);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [desktop, mobile, tablet]);

  return shouldRender ? <>{children}</> : null;
}