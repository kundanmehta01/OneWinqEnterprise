import { useRef, useCallback } from 'react';

/**
 * Custom hook for detecting mobile touch swipe gestures.
 * Distinguishes horizontal swipes from vertical page scrolling to prevent unintended transitions.
 */
export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  minDistance = 45,
  maxPerpendicular = 85,
  maxDuration = 600,
  enabled = true
}) => {
  const touchStart = useRef(null);
  const touchStartTime = useRef(0);

  const onTouchStart = useCallback(
    (e) => {
      if (!enabled || e.touches.length !== 1) return;

      const target = e.target;
      // Skip if swiping on an interactive input, textarea, or elements marked with data-no-swipe
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('[data-no-swipe]')
      ) {
        return;
      }

      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      touchStartTime.current = Date.now();
    },
    [enabled]
  );

  const onTouchEnd = useCallback(
    (e) => {
      if (!enabled || !touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const duration = Date.now() - touchStartTime.current;

      touchStart.current = null;

      // Check duration constraint
      if (duration > maxDuration) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Check minimum horizontal distance
      if (absX < minDistance) return;

      // Must be predominantly horizontal to avoid interfering with vertical page scrolling
      if (absX < absY * 1.4) return;

      // Must not exceed perpendicular (vertical) movement threshold
      if (absY > maxPerpendicular) return;

      if (deltaX < 0) {
        // Swiped Left (finger moved right-to-left) -> Next
        if (onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Swiped Right (finger moved left-to-right) -> Previous
        if (onSwipeRight) {
          onSwipeRight();
        }
      }
    },
    [enabled, minDistance, maxPerpendicular, maxDuration, onSwipeLeft, onSwipeRight]
  );

  return {
    onTouchStart,
    onTouchEnd
  };
};

export default useSwipeGesture;
