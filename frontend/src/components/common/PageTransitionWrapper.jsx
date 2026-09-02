import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/Transitions.css';

const BLACK_TRANSITIONS = [
  'black-slide-in-out',
  'black-perspective-slide',
  'black-slide-in-out',
  'black-horizontal-wipe'
];

/**
 * Universal Page Transition Wrapper with Slide In & Slide Out Effects
 * Displays a full-screen slide in and slide out transition whenever ANY page opens
 * or routes change across the entire website.
 */
export default function PageTransitionWrapper({ children }) {
  const location = useLocation();
  const [transitioning, setTransitioning] = useState(true);
  const [transitionIndex, setTransitionIndex] = useState(0);

  useEffect(() => {
    // Trigger slide in and slide out transition whenever any page opens
    setTransitioning(true);
    setTransitionIndex((prev) => (prev + 1) % BLACK_TRANSITIONS.length);

    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 620);

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
