import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { playWebsiteOpeningSound } from '../../utils/audioEffects';
import './EntranceSliceTransition.css';

// 32 high-speed spacetime travel warp streaks for hyperdrive tunnel effect
const WARP_STREAKS = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  angle: (i * 360) / 32,
  delay: (i % 6) * 0.08,
  speed: 0.9 + (i % 5) * 0.15,
  length: 70 + (i % 4) * 35
}));

/**
 * Cinematic Spacetime Travel Entrance Transition
 * Features high-speed hyperspace warp stars, radiant glowing Afsha Enterprises logo,
 * slower majestic timing, and plays entrance.mp3 on website opening.
 */
export default function EntranceSliceTransition() {
  const [active, setActive] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Play entrance.mp3 when website opens
    playWebsiteOpeningSound();

    const handleFirstGesture = () => {
      playWebsiteOpeningSound();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    // Slow, cinematic timing for the spacetime logo experience
    const timer1 = setTimeout(() => {
      setExiting(true);
    }, 1900);

    // Complete transition and unmount after slices slide away
    const timer2 = setTimeout(() => {
      setActive(false);
    }, 2500);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleQuickSkip = () => {
    setExiting(true);
    setTimeout(() => setActive(false), 500);
  };

  if (!active) return null;

  return (
    <div
      className={`entrance-slice-overlay ${exiting ? 'slice-exiting' : ''}`}
      onClick={handleQuickSkip}
      role="button"
      tabIndex={0}
      aria-label="Click to enter immediately"
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
