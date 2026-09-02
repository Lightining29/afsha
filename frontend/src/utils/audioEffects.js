/**
 * High-End Synthesized Audio Effects using Web Audio API
 * Provides a luxurious opening chime and subtle UI sound effects with zero external MP3 dependencies.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play luxurious website opening sound
 * A celestial harmonic chime chord (C5 - E5 - G5 - C6) with soft reverb decay.
 */
export function playWebsiteOpeningSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Harmonic frequencies for luxury warm bell chord (C-maj9 vibe)
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
    masterGain.connect(ctx.destination);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.035);

      noteGain.gain.setValueAtTime(0.001, now + idx * 0.035);
      noteGain.gain.exponentialRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.035 + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.1);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + idx * 0.035);
      osc.stop(now + 1.8);
    });
  } catch (err) {
    // Audio policies in modern browsers gracefully degrade without error
  }
}

/**
 * Play subtle button click/hover micro-sound
 */
export function playButtonChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
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
  } catch (err) {}
}
