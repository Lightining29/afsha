import { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2 } from 'lucide-react';
import { playWebsiteOpeningSound, setupGestureUnlock } from '../../utils/audioEffects';
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
  const [soundPlaying, setSoundPlaying] = useState(false);
  const audioElementRef = useRef(null);

  useEffect(() => {
    // Setup global unlock listeners immediately (including passive non-click events)
    setupGestureUnlock();

    const triggerAudio = () => {
      const audioEl = window.__afshaEntranceAudio || audioElementRef.current || document.getElementById('afsha-entrance-audio');
      if (audioEl) {
        audioEl.volume = 1.0;
        audioEl.play().then(() => {
          setSoundPlaying(true);
        }).catch(() => {});
      }
      playWebsiteOpeningSound().then((played) => {
        if (played) setSoundPlaying(true);
      });
    };

    // 1. Immediate play on mount
    triggerAudio();

    // 2. Passive non-click triggers (mouse movement, scroll, hover, focus)
    const passiveEvents = ['mousemove', 'pointermove', 'scroll', 'wheel', 'mouseenter', 'focus', 'touchstart', 'click'];
    const onPassive = () => {
      triggerAudio();
      passiveEvents.forEach((evt) => {
        window.removeEventListener(evt, onPassive, true);
        document.removeEventListener(evt, onPassive, true);
      });
    };

    passiveEvents.forEach((evt) => {
      window.addEventListener(evt, onPassive, { passive: true, capture: true });
      document.addEventListener(evt, onPassive, { passive: true, capture: true });
    });

    // Check if audio has started playing periodically
    const checkInterval = setInterval(() => {
      const audioEl = window.__afshaEntranceAudio || audioElementRef.current || document.getElementById('afsha-entrance-audio');
      if (audioEl && !audioEl.paused) {
        setSoundPlaying(true);
        clearInterval(checkInterval);
      }
    }, 150);

    // Slow, cinematic timing for the spacetime logo experience
    const timer1 = setTimeout(() => {
      setExiting(true);
    }, 2200);

    // Complete transition and unmount after slices slide away
    const timer2 = setTimeout(() => {
      setActive(false);
    }, 2800);

    return () => {
      clearInterval(checkInterval);
      passiveEvents.forEach((evt) => {
        window.removeEventListener(evt, onPassive, true);
        document.removeEventListener(evt, onPassive, true);
      });
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleUserTap = () => {
    // Direct user click on overlay: 100% guarantees audio playback without autoplay block
    const audioEl = audioElementRef.current || document.getElementById('afsha-entrance-audio');
    if (audioEl) {
      audioEl.play().catch(() => {});
    }
    playWebsiteOpeningSound();
    setSoundPlaying(true);

    setExiting(true);
    setTimeout(() => setActive(false), 550);
  };

  if (!active) return null;

  return (
    <div
      className={`entrance-slice-overlay ${exiting ? 'slice-exiting' : ''}`}
      onClick={handleUserTap}
      role="button"
      tabIndex={0}
      aria-label="Click anywhere to enter with sound"
    >
      {/* ── Native DOM Audio Element for Preloading and Direct Playback ── */}
      <audio
        ref={audioElementRef}
        id="afsha-entrance-audio"
        src="/entrance.mp3"
        preload="auto"
        playsInline
        autoPlay
        onPlay={() => setSoundPlaying(true)}
      />

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

          {/* Interactive Sound Status Pill */}
          <div className={`slice-sound-indicator ${soundPlaying ? 'is-playing' : 'is-waiting'}`}>
            <Volume2 size={15} />
            <span>{soundPlaying ? 'ENTRANCE SOUND PLAYING' : '✦ SPACETIME AUDIO EXPERIENCE ✦'}</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Diagonal Cutout Slice ── */}
      <div className="cutout-slice-bottom">
        <div className="slice-watermark">SPACETIME SPEED • PREMIUM SHOPPING EXPERIENCE</div>
      </div>
    </div>
  );
}
