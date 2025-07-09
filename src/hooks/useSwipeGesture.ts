import { useEffect, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  preventScrollOnSwipe?: boolean;
}

export function useSwipeGesture(
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) {
  const {
    minSwipeDistance = 50,
    maxSwipeTime = 500,
    preventScrollOnSwipe = true,
  } = config;

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!preventScrollOnSwipe || !touchStartX.current || !touchStartY.current) {
        return;
      }

      const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);

      // If horizontal movement is greater than vertical, prevent vertical scroll
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX.current || !touchStartY.current || !touchStartTime.current) {
        return;
      }

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      const deltaTime = touchEndTime - touchStartTime.current;

      // Reset values
      touchStartX.current = null;
      touchStartY.current = null;
      touchStartTime.current = null;

      // Check if it was a swipe (not too slow)
      if (deltaTime > maxSwipeTime) {
        return;
      }

      // Determine swipe direction
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > absY && absX > minSwipeDistance) {
        // Horizontal swipe
        if (deltaX > 0 && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        } else if (deltaX < 0 && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        }
      } else if (absY > absX && absY > minSwipeDistance) {
        // Vertical swipe
        if (deltaY > 0 && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        } else if (deltaY < 0 && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        }
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, minSwipeDistance, maxSwipeTime, preventScrollOnSwipe]);
}

// Hook for swipeable tabs/pages
export function useSwipeableNavigation(
  currentIndex: number,
  totalItems: number,
  onChange: (index: number) => void,
  config?: SwipeConfig
) {
  const handleSwipeLeft = () => {
    if (currentIndex < totalItems - 1) {
      onChange(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      onChange(currentIndex - 1);
    }
  };

  useSwipeGesture(
    {
      onSwipeLeft: handleSwipeLeft,
      onSwipeRight: handleSwipeRight,
    },
    config
  );
}