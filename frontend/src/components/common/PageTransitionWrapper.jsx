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
  const [animClass, setAnimClass] = useState('transition-perspective-slide');

  useEffect(() => {
    const nextClass = TRANSITION_CLASSES[transitionIndex];
    setAnimClass(nextClass);
    setTransitionIndex((prev) => (prev + 1) % TRANSITION_CLASSES.length);

    const timer = setTimeout(() => {
      setAnimClass('');
    }, 700);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`page-transition-host ${animClass}`}>
      {children}
    </div>
  );
}
