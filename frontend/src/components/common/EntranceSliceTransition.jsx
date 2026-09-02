import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import './EntranceSliceTransition.css';

// 32 high-speed spacetime travel warp streaks for hyperdrive tunnel effect
const WARP_STREAKS = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  angle: (i * 360) / 32,
  delay: (i % 6) * 0.05,
  speed: 0.7 + (i % 5) * 0.12,
  length: 70 + (i % 4) * 35
}));

/**
 * Full-Screen Entrance Logo Transition Effect (Medium Speed)
 * A dynamic, continuous transition effect featuring the Afsha Enterprises shining logo,
 * spacetime warp streaks, and a smooth diagonal wipe to reveal the homepage.
 */
export default function EntranceSliceTransition() {
  const [active, setActive] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Medium-speed transition effect: logo reveals with warp speed, then smoothly wipes
    const timer1 = setTimeout(() => {
      setExiting(true);
    }, 650);

    // Transition effect completes and unmounts
    const timer2 = setTimeout(() => {
      setActive(false);
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleUserTap = () => {
    setExiting(true);
    setTimeout(() => setActive(false), 450);
  };

  if (!active) return null;

  return (
    <div
      className={`entrance-slice-overlay ${exiting ? 'slice-exiting' : ''}`}
      onClick={handleUserTap}
      role="button"
      tabIndex={0}
      aria-label="Click to skip transition"
    >
      {/* ── Spacetime Travel Hyperspace Tunnel Background ── */}
      <div className="spacetime-warp-container" aria-hidden="true">
        {WARP_STREAKS.map((streak) => (
          <div
            key={streak.id}
            className="spacetime-warp-ray"
            style={{
              transform: `rotate(${streak.angle}deg)`,
              animationDelay: `${streak.delay}s`,
              animationDuration: `${streak.speed}s`,
              '--streak-len': `${streak.length}px`
            }}
          />
        ))}
        {/* Pulsating Spacetime Gravitational Distortion Rings */}
        <div className="spacetime-distortion-ring ring-1" />
        <div className="spacetime-distortion-ring ring-2" />
        <div className="spacetime-distortion-ring ring-3" />
      </div>

      {/* ── Top Diagonal Cutout Slice ── */}
      <div className="cutout-slice-top">
        <div className="slice-brand-badge">
          <div className="slice-logo-sparkle-wrap">
            <Sparkles size={28} className="slice-cosmic-sparkle" />
          </div>
          <span className="slice-logo-mark">AFSHA</span>
          <span className="slice-tagline">ENTERPRISES</span>
          <span className="slice-sub-tagline">✦ LUXURY WELLNESS &amp; CARE ✦</span>
        </div>
      </div>

      {/* ── Bottom Diagonal Cutout Slice ── */}
      <div className="cutout-slice-bottom">
        <div className="slice-watermark">SPACETIME SPEED • PREMIUM SHOPPING EXPERIENCE</div>
      </div>
    </div>
  );
}
