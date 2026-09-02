/**
 * High-End Synthesized & MP3 Audio Effects
 * Plays /entrance.mp3 when the website opens with seamless fallback.
 */

let audioCtx = null;
let entranceAudio = null;

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
 * Play website opening sound using entrance.mp3 with graceful fallback
 */
export function playWebsiteOpeningSound() {
  if (typeof window === 'undefined') return;

  try {
    if (!entranceAudio) {
      entranceAudio = new Audio('/entrance.mp3');
      entranceAudio.volume = 0.9;
    }
    entranceAudio.currentTime = 0;
    const playPromise = entranceAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy prevented immediate playback; fallback to Web Audio API chime
        playSynthesizedChime();
      });
    }
  } catch (err) {
    playSynthesizedChime();
  }
}

/**
 * Fallback synthesizer using Web Audio API if MP3 playback is restricted
 */
function playSynthesizedChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50];

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
  } catch (e) {}
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
