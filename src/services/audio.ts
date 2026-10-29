// Synthesized magical sound effects & ambient noise using Web Audio API

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: { stop: () => void } | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.35;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  // Soft sparkle / magical chime
  public playSparkle() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.05);

      gain.gain.setValueAtTime(0, startTime + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.08 * this.volume, startTime + idx * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + idx * 0.05 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.05);
      osc.stop(startTime + idx * 0.05 + 0.65);
    });
  }

  // Celestial task completion chord
  public playCelestialChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chord = [392.00, 493.88, 587.33, 739.99, 880.00]; // G4, B4, D5, F#5, A5 (Gmaj9)
    const startTime = ctx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.07);

      gain.gain.setValueAtTime(0, startTime + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.09 * this.volume, startTime + idx * 0.07 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + idx * 0.07 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.07);
      osc.stop(startTime + idx * 0.07 + 1.25);
    });
  }

  public playChime() {
    this.playCelestialChime();
  }


  // Soft page flip sound
  public playPageTurn() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  }

  // Moon Cat cheerful chirp
  public playCatPurr() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.28);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07 * this.volume, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Play Star Addition to Constellation
  public playStarAdd() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);

    gain.gain.setValueAtTime(0.08 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  // Ambient sound synthesizer
  public startAmbient(type: 'none' | 'night-breeze' | 'library-rain' | 'lofi-sparkles' | 'clock-chime') {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }

    if (this.isMuted || type === 'none') return;
    const ctx = this.getContext();
    if (!ctx) return;

    if (type === 'night-breeze' || type === 'library-rain') {
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(type === 'night-breeze' ? 380 : 800, ctx.currentTime);
      filter.Q.setValueAtTime(type === 'night-breeze' ? 1.5 : 0.8, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04 * this.volume, ctx.currentTime);

      // Low frequency modulation for wind breathing
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.02 * this.volume, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      lfo.start();

      this.ambientSource = {
        stop: () => {
          try {
            noise.stop();
            lfo.stop();
          } catch {}
        }
      };
    } else if (type === 'lofi-sparkles') {
      let intervalId: number;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.05 * this.volume, ctx.currentTime);
      gain.connect(ctx.destination);

      const playRandomTone = () => {
        if (!this.ctx) return;
        const tones = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
        const freq = tones[Math.floor(Math.random() * tones.length)];
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        noteGain.gain.setValueAtTime(0, this.ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.02 * this.volume, this.ctx.currentTime + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.8);
        osc.connect(noteGain);
        noteGain.connect(gain);
        osc.start();
        osc.stop(this.ctx.currentTime + 2.0);
      };

      intervalId = window.setInterval(playRandomTone, 1400);

      this.ambientSource = {
        stop: () => {
          clearInterval(intervalId);
        }
      };
    }
  }

  public stopAmbient() {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
  }

  // Gentle celestial arpeggio progression for Shagun's welcome scene
  public playWelcomeMelody(): { stop: () => void } {
    if (this.isMuted) return { stop: () => {} };
    const ctx = this.getContext();
    if (!ctx) return { stop: () => {} };

    // Beautiful pentatonic chord arpeggios: Fmaj7 -> Cmaj7 -> Dm7 -> Bbmaj7
    const chords = [
      [349.23, 440.00, 523.25, 659.25], // F4, A4, C5, E5
      [261.63, 329.63, 392.00, 493.88], // C4, E4, G4, B4
      [293.66, 349.23, 440.00, 523.25], // D4, F4, A4, C5
      [233.08, 293.66, 349.23, 440.00], // Bb3, D4, F4, A4
    ];

    let stopped = false;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.04 * this.volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    let chordIdx = 0;
    const playNextArpeggio = () => {
      if (stopped || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, noteIdx) => {
        if (stopped || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + noteIdx * 0.28);

        const noteStart = this.ctx.currentTime + noteIdx * 0.28;
        noteGain.gain.setValueAtTime(0, noteStart);
        noteGain.gain.linearRampToValueAtTime(0.035 * this.volume, noteStart + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 2.5);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(noteStart);
        osc.stop(noteStart + 2.6);
      });
    };

    playNextArpeggio();
    const interval = window.setInterval(playNextArpeggio, 2200);

    return {
      stop: () => {
        stopped = true;
        clearInterval(interval);
        try {
          masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
          setTimeout(() => masterGain.disconnect(), 500);
        } catch {}
      }
    };
  }

  // Synthesizes natural spoken welcome for Shagun
  public speakWelcome(
    text: string,
    onStart?: () => void,
    onBoundary?: (charIndex: number, length: number) => void,
    onEnd?: () => void
  ): { stop: () => void; isSupported: boolean } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return { stop: () => {}, isSupported: false };
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const femaleKeywords = ['female', 'zira', 'jenny', 'aria', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'eva', 'serena', 'natural'];
      
      let bestVoice = voices.find(v => 
        v.lang.startsWith('en') && femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))
      );

      if (!bestVoice) {
        bestVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Online')));
      }

      if (!bestVoice) {
        bestVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
      }

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      // Gentle, friendly conversational tone
      utterance.pitch = 1.05;
      utterance.rate = 0.92;
      utterance.volume = this.isMuted ? 0 : 0.95;

      if (onStart) utterance.onstart = () => onStart();
      if (onBoundary) {
        utterance.onboundary = (e) => {
          onBoundary(e.charIndex, (e as any).charLength || 5);
        };
      }
      if (onEnd) utterance.onend = () => onEnd();
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);

      return {
        stop: () => {
          try {
            window.speechSynthesis.cancel();
          } catch {}
        },
        isSupported: true
      };
    } catch (e) {
      return { stop: () => {}, isSupported: false };
    }
  }
}

export const sound = new SoundEngine();

// Preload voices in background
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
