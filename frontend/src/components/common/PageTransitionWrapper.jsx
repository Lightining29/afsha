import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/Transitions.css';

const BLACK_TRANSITIONS = [
  'black-circular-wipe',
  'black-perspective-slide',
  'black-diagonal-wipe',
  'black-horizontal-wipe'
];

/**
 * Universal Page Transition Wrapper with Deep Black Cinematic Effects
 * Cycles through Black Circular Wipe, Black Perspective Slide, Black Diagonal Wipe, and Black Horizontal Wipe
 * on every page navigation across the entire website.
 */
export default function PageTransitionWrapper({ children }) {
  const location = useLocation();
  const [transitioning, setTransitioning] = useState(false);
  const [transitionIndex, setTransitionIndex] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid running on very first initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setTransitioning(true);
    setTransitionIndex((prev) => (prev + 1) % BLACK_TRANSITIONS.length);

    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 380);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const activeBlackTransition = BLACK_TRANSITIONS[transitionIndex];

  return (
    <div className="page-transition-host">
      {transitioning && (
        <div className={`black-transition-layer ${activeBlackTransition}`} aria-hidden="true" />
      )}
      <div className={transitioning ? 'page-content-transitioning' : ''}>
        {children}
      </div>
    </div>
  );
}
