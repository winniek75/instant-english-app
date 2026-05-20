let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    const frequencies = [523.25, 659.25, 783.99]; // C-E-G chime
    const gain = 0.2;
    const duration = 0.3;

    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + i * 0.08 + 0.02);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.08 + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime + i * 0.08);
      oscillator.stop(ctx.currentTime + i * 0.08 + duration);
    });
  } catch (e) {
    // Silently ignore audio errors
    console.warn('Audio playback failed:', e);
  }
}

export function playWrongSound(): void {
  try {
    const ctx = getAudioContext();
    const duration = 0.2;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, ctx.currentTime + duration);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
}
