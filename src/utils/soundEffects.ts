// Simple sound effects using Web Audio API
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!audioContext && typeof window !== 'undefined' && window.AudioContext) {
    try {
      audioContext = new AudioContext();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
      return null;
    }
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, volume: number = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;
  
  // Envelope
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

function playDiceRoll() {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  // Multiple quick tones to simulate dice rolling
  const frequencies = [200, 300, 250, 400, 350, 300];
  frequencies.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.05, 0.2), i * 50);
  });
}

export const soundEffects = {
  diceRoll: () => {
    try {
      playDiceRoll();
    } catch (e) {
      console.warn('Error playing dice roll sound:', e);
    }
  },
  
  criticalHit: () => {
    try {
      // Ascending triumph sound
      playTone(440, 0.1, 0.3); // A4
      setTimeout(() => playTone(554, 0.1, 0.3), 100); // C#5
      setTimeout(() => playTone(659, 0.2, 0.4), 200); // E5
    } catch (e) {
      console.warn('Error playing critical hit sound:', e);
    }
  },
  
  criticalMiss: () => {
    try {
      // Descending failure sound
      playTone(440, 0.1, 0.3); // A4
      setTimeout(() => playTone(392, 0.1, 0.3), 100); // G4
      setTimeout(() => playTone(330, 0.2, 0.4), 200); // E4
    } catch (e) {
      console.warn('Error playing critical miss sound:', e);
    }
  },
  
  buttonClick: () => {
    try {
      playTone(600, 0.05, 0.1);
    } catch (e) {
      console.warn('Error playing button click sound:', e);
    }
  }
};

// Clean up audio context when needed
export function cleanupAudio() {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}