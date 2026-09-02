import { useState, useEffect } from 'react';
import './EntranceSliceTransition.css';

/**
 * Dual Diagonal Cutout Slices transition effect from bottom-right to top-left
 * Runs when the website opens to deliver an extraordinary high-end cinematic reveal.
 */
export default function EntranceSliceTransition() {
  const [active, setActive] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start sliding animation
    const timer1 = setTimeout(() => {
      setExiting(true);
    }, 200);

    // Complete transition and remove from DOM
    const timer2 = setTimeout(() => {
      setActive(false);
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!active) return null;

  return (
    <div className={`entrance-slice-overlay ${exiting ? 'slice-exiting' : ''}`}>
      {/* Top diagonal slice */}
      <div className="cutout-slice-top">
        <div className="slice-brand-badge">
          <span className="slice-logo-mark">AFSHA</span>
          <span className="slice-tagline">ENTERPRISES</span>
        </div>
      </div>

      {/* Seam glow light beam along the diagonal */}
      <div className="cutout-slice-seam" />

      {/* Bottom diagonal slice */}
      <div className="cutout-slice-bottom">
        <div className="slice-watermark">PREMIUM WELLNESS &amp; LIFESTYLE</div>
      </div>
    </div>
  );
}
