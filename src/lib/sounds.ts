// src/lib/sounds.ts

const ctx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', gain = 0.3) {
  const ac = ctx();
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.connect(vol);
  vol.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ac.currentTime);
  vol.gain.setValueAtTime(gain, ac.currentTime);
  vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

export function playCorrect() {
  playTone(523, 0.1); // C5
  setTimeout(() => playTone(659, 0.15), 100); // E5
}

export function playIncorrect() {
  playTone(300, 0.15, 'sawtooth', 0.2);
  setTimeout(() => playTone(250, 0.2, 'sawtooth', 0.2), 150);
}

export function playPass() {
  [523, 659, 784, 1046].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2), i * 100);
  });
}

export function playFail() {
  [400, 350, 300, 250].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sawtooth', 0.15), i * 100);
  });
}

export function playDragClick() {
  playTone(440, 0.08, 'triangle', 0.15);
}

export function playDrop() {
  playTone(300, 0.08, 'triangle', 0.15);
}