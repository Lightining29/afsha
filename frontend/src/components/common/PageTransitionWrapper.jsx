import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/Transitions.css';

const TRANSITION_CLASSES = [
  'transition-perspective-slide',
  'transition-diagonal-wipe',
  'transition-circular',
  'transition-horizontal-wipe'
];

/**
 * Universal Page Transition Wrapper
 * Cycles through Perspective Slide, Diagonal Wipe, .circular, and Horizontal Wipe
 * whenever navigation happens across all pages on the website.
 */
export default function PageTransitionWrapper({ children }) {
  const location = useLocation();
  const [transitionIndex, setTransitionIndex] = useState(0);
  const [animKey, setAnimKey] = useState(location.pathname);

  useEffect(() => {
    setAnimKey(location.pathname);
    setTransitionIndex((prev) => (prev + 1) % TRANSITION_CLASSES.length);
  }, [location.pathname]);

  const activeTransition = TRANSITION_CLASSES[transitionIndex];

  return (
    <div key={animKey} className={`page-transition-host ${activeTransition}`}>
      {children}
    </div>
  );
}
