/**
 * Bulletproof Audio Player for entrance.mp3
 * Handles browser autoplay policies, preloading, user gesture unlock on mobile & desktop,
 * and high-fidelity playback.
 */

let globalEntranceAudio = null;
let isAudioPlaying = false;
let unlockListenersAttached = false;

/**
 * Get or create the singleton entrance audio instance
 */
export function getEntranceAudio() {
  if (typeof window === 'undefined') return null;

  if (!globalEntranceAudio) {
    // Check if DOM element exists
    const domAudio = document.getElementById('afsha-entrance-audio');
    if (domAudio) {
      globalEntranceAudio = domAudio;
    } else {
      globalEntranceAudio = new Audio('/salesman.mp3');
      globalEntranceAudio.id = 'afsha-entrance-audio';
      globalEntranceAudio.preload = 'auto';
      globalEntranceAudio.setAttribute('playsinline', 'true');
      globalEntranceAudio.setAttribute('webkit-playsinline', 'true');
    }
    globalEntranceAudio.volume = 1.0;

    globalEntranceAudio.addEventListener('play', () => {
      isAudioPlaying = true;
    });
    globalEntranceAudio.addEventListener('ended', () => {
      isAudioPlaying = false;
    });
  }

  return globalEntranceAudio;
}

/**
 * Attempt to play entrance.mp3
 * Returns a promise resolving to boolean (true if playing, false if blocked by browser policy)
 */
export async function playWebsiteOpeningSound() {
  if (typeof window === 'undefined') return false;

  const audio = getEntranceAudio();
  if (!audio) return false;

  try {
    audio.currentTime = 0;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      await playPromise;
      isAudioPlaying = true;
      return true;
    }
    return true;
  } catch (err) {
    // Browser autoplay policy blocked sound without interaction
    isAudioPlaying = false;
    setupGestureUnlock();
    return false;
  }
}

/**
 * Setup global gesture unlock listeners to start audio immediately on first user touch/click/keypress
 */
export function setupGestureUnlock() {
  if (typeof window === 'undefined' || unlockListenersAttached) return;
  unlockListenersAttached = true;

  const triggerAudioOnGesture = () => {
    const audio = getEntranceAudio();
    if (audio && !isAudioPlaying) {
      audio.currentTime = 0;
      audio.play().then(() => {
        isAudioPlaying = true;
        cleanupGestureListeners();
      }).catch(() => {
        // Retry on next gesture if still blocked
      });
    } else if (isAudioPlaying) {
      cleanupGestureListeners();
    }
  };

  const cleanupGestureListeners = () => {
    ['click', 'touchstart', 'touchend', 'mousedown', 'keydown', 'pointerdown'].forEach((evt) => {
      document.removeEventListener(evt, triggerAudioOnGesture, true);
      window.removeEventListener(evt, triggerAudioOnGesture, true);
    });
    unlockListenersAttached = false;
  };

  ['click', 'touchstart', 'touchend', 'mousedown', 'keydown', 'pointerdown'].forEach((evt) => {
    document.addEventListener(evt, triggerAudioOnGesture, { once: false, passive: true, capture: true });
    window.addEventListener(evt, triggerAudioOnGesture, { once: false, passive: true, capture: true });
  });
}

/**
 * Check if audio is currently playing
 */
export function isEntranceAudioPlaying() {
  return isAudioPlaying;
}

/**
 * Subtle button click sound
 */
export function playButtonChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  } catch (e) {}
}
