import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Moon, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight, 
  Pause, 
  Play,
  Compass
} from 'lucide-react';
import { sound } from '../services/audio';

interface OpeningExperienceProps {
  onEnter: () => void;
  reduceMotion?: boolean;
}

// Exact dialogue requested by user
const WELCOME_SCRIPT = "Hi, I'm Shagun. Welcome to my little reading world. This is my cozy corner for learning, dreaming, and discovering something new every day. I'm so happy you're here. Come on in!";

// Subtitle chunks synced to time
const SUBTITLE_CHUNKS = [
  { start: 0, end: 3.5, text: "Reading quietly under the moonlight...", phase: 'reading' },
  { start: 3.5, end: 5.0, text: "Shagun looks up from her book with a gentle smile...", phase: 'look_up' },
  { start: 5.0, end: 7.8, text: "“Hi, I'm Shagun. Welcome to my little reading world.”", phase: 'speaking_1' },
  { start: 7.8, end: 11.2, text: "“This is my cozy corner for learning, dreaming, and discovering something new every day.”", phase: 'speaking_2' },
  { start: 11.2, end: 13.5, text: "“I'm so happy you're here. Come on in!”", phase: 'speaking_3' },
  { start: 13.5, end: 15.0, text: "✨ Welcome to Moonlit Library — Step into your universe of learning ✨", phase: 'ready' },
];

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({ 
  onEnter, 
  reduceMotion = false 
}) => {
  // Timeline state (0 to 15 seconds)
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isEntering, setIsEntering] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [audioPromptVisible, setAudioPromptVisible] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isSpeakingActive, setIsSpeakingActive] = useState(false);

  // Audio references
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const melodyRef = useRef<{ stop: () => void } | null>(null);
  const speechRef = useRef<{ stop: () => void; isSupported: boolean } | null>(null);
  const speechTriggeredRef = useRef(false);

  // Character stage based on elapsed time
  const isLookingUp = elapsed >= 3.4;
  const isSpeaking = (elapsed >= 5.0 && elapsed < 13.0) || isSpeakingActive;
  const isGesturing = elapsed >= 13.0 && !isSpeakingActive;

  // Find active subtitle
  const activeSubtitle = SUBTITLE_CHUNKS.find(
    c => elapsed >= c.start && elapsed < c.end
  ) || SUBTITLE_CHUNKS[SUBTITLE_CHUNKS.length - 1];

  // Initialize Audio element on mount
  useEffect(() => {
    // Check if user previously saved skip preference
    if (typeof window !== 'undefined') {
      const savedSkip = localStorage.getItem('moonlit_skip_intro');
      if (savedSkip === 'true') {
        setDontShowAgain(true);
      }
    }

    // Pre-create real voice audio element
    const audio = new Audio('/shagun/shagun_welcome.mp3');
    audio.preload = 'auto';
    audio.volume = 1.0;
    audio.onplay = () => {
      setIsSpeakingActive(true);
      setAudioPromptVisible(false);
    };
    audio.onended = () => {
      setIsSpeakingActive(false);
    };
    audio.onpause = () => {
      setIsSpeakingActive(false);
    };
    voiceAudioRef.current = audio;

    // Try starting ambient melody
    try {
      const melody = sound.playWelcomeMelody();
      melodyRef.current = melody;
    } catch (e) {
      // Autoplay waiting for interaction
      setAudioPromptVisible(true);
    }

    return () => {
      if (voiceAudioRef.current) {
        voiceAudioRef.current.pause();
        voiceAudioRef.current.currentTime = 0;
      }
      if (melodyRef.current) melodyRef.current.stop();
      if (speechRef.current) speechRef.current.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Play Shagun Voice (Neural MP3 with SpeechSynthesis fallback)
  const playVoice = () => {
    setAudioPromptVisible(false);
    setHasUserInteracted(true);
    setIsMuted(false);
    sound.setMuted(false);

    // Ensure ambient background melody is playing
    if (!melodyRef.current) {
      melodyRef.current = sound.playWelcomeMelody();
    }

    const audio = voiceAudioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play()
        .then(() => {
          setIsSpeakingActive(true);
        })
        .catch((err) => {
          console.warn('HTML5 audio play blocked, falling back to Web Speech synthesis:', err);
          // Fallback to speech synthesis
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          speechRef.current = sound.speakWelcome(
            WELCOME_SCRIPT,
            () => setIsSpeakingActive(true),
            undefined,
            () => setIsSpeakingActive(false)
          );
        });
    } else {
      speechRef.current = sound.speakWelcome(
        WELCOME_SCRIPT,
        () => setIsSpeakingActive(true),
        undefined,
        () => setIsSpeakingActive(false)
      );
    }
  };

  // Timer loop (15 seconds total)
  useEffect(() => {
    if (!isPlaying || isEntering) return;

    const interval = window.setInterval(() => {
      setElapsed(prev => {
        const next = Math.round((prev + 0.1) * 10) / 10;
        if (next >= 15) {
          handleEnter();
          return 15;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isEntering]);

  // Trigger speech when elapsed reaches 5.0 seconds
  useEffect(() => {
    if (elapsed >= 5.0 && !speechTriggeredRef.current && !isMuted) {
      speechTriggeredRef.current = true;
      if (hasUserInteracted) {
        playVoice();
      } else {
        // Try autoplaying voice; if blocked, prompt stays visible
        const audio = voiceAudioRef.current;
        if (audio) {
          audio.currentTime = 0;
          audio.play()
            .then(() => {
              setIsSpeakingActive(true);
              setAudioPromptVisible(false);
            })
            .catch(() => {
              setAudioPromptVisible(true);
            });
        } else {
          setAudioPromptVisible(true);
        }
      }
    }
  }, [elapsed, isMuted, hasUserInteracted]);

  // User taps anywhere or the prompt to unlock sound
  const handleUserActivateAudio = () => {
    setHasUserInteracted(true);
    setAudioPromptVisible(false);
    setIsMuted(false);
    sound.setMuted(false);

    if (!melodyRef.current) {
      melodyRef.current = sound.playWelcomeMelody();
    }

    // If already in the speaking window (elapsed >= 4.0), play voice immediately!
    if (elapsed >= 3.5 && elapsed < 14.0) {
      speechTriggeredRef.current = true;
      playVoice();
    }
  };

  // Toggle Mute
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);

    if (nextMuted) {
      if (voiceAudioRef.current) voiceAudioRef.current.pause();
      if (melodyRef.current) melodyRef.current.stop();
      if (speechRef.current) speechRef.current.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingActive(false);
    } else {
      handleUserActivateAudio();
    }
  };

  // Replay from beginning
  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSparkle();
    
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    if (speechRef.current) speechRef.current.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    speechTriggeredRef.current = false;
    setIsSpeakingActive(false);
    setElapsed(0);
    setIsPlaying(true);
    handleUserActivateAudio();
  };

  // Enter Library transition
  const handleEnter = () => {
    if (isEntering) return;
    sound.playCelestialChime();
    sound.playSparkle();

    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current.currentTime = 0;
    }
    if (melodyRef.current) melodyRef.current.stop();
    if (speechRef.current) speechRef.current.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (dontShowAgain) {
      localStorage.setItem('moonlit_skip_intro', 'true');
    } else {
      localStorage.removeItem('moonlit_skip_intro');
    }

    setIsEntering(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  // Skip immediately
  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleEnter();
  };

  // Progress percentage (0 - 100%)
  const progressPercent = Math.min(100, Math.round((elapsed / 15) * 100));

  return (
    <div 
      onClick={handleUserActivateAudio}
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-midnight-950 text-cream-50 select-none transition-opacity duration-700 cursor-pointer ${
        isEntering ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ---------------- 1. BACKGROUND ANIME CINEMATIC ARTWORK ---------------- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
        {/* Layer A: Shagun Reading Her Tome (0s to 3.5s) */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            reduceMotion ? '' : 'animate-camera-drift'
          } ${isLookingUp ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
          style={{
            backgroundImage: `url('/shagun/shagun_reading.jpg')`,
            backgroundPosition: 'center 45%'
          }}
        />

        {/* Layer B: Shagun Looking Up, Smiling & Welcoming (3.5s to 15s) */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            reduceMotion ? '' : 'animate-camera-drift'
          } ${isLookingUp ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{
            backgroundImage: `url('/shagun/shagun_speaking.jpg')`,
            backgroundPosition: 'center 45%'
          }}
        />

        {/* Breathing & Gentle Sway Overlay */}
        <div className={`absolute inset-0 ${reduceMotion ? '' : 'animate-shagun-breathe'}`} />

        {/* Vignette & Moonlight Ambience Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/30 to-midnight-950/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-950/60 via-transparent to-midnight-950/60 pointer-events-none" />

        {/* Book Glow Shimmer Effect */}
        <div 
          className={`absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-stargold-300/15 blur-3xl pointer-events-none ${
            reduceMotion ? '' : 'animate-shagun-book-glow'
          }`}
        />

        {/* Luminous Crescent Moon Halo (Outside Window) */}
        <div className="absolute top-10 left-1/4 w-44 h-44 rounded-full bg-lavender-400/10 blur-2xl pointer-events-none animate-pulse" />

        {/* Floating Fairy Dust Particles / Stardust */}
        {!reduceMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-stargold-200 shadow-star-glow"
                style={{
                  top: `${15 + (i * 5.5)}%`,
                  left: `${10 + ((i * 17) % 80)}%`,
                  animation: `floatingMote ${4 + (i % 5)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.45}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ---------------- 2. TOP CINEMATIC HEADER ---------------- */}
      <header className="relative z-20 px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between gap-3">
        
        {/* Left: Audio / Sound FX Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-2xl glass-panel-glow border border-lavender-400/30 text-lavender-200 hover:text-white hover:border-lavender-300 transition-all flex items-center gap-2 text-xs font-medium shadow-lg"
            title={isMuted ? 'Unmute Shagun and Background Music' : 'Mute Sound'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rosemoon-400" />
                <span className="hidden sm:inline text-rosemoon-300">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-stargold-300 animate-pulse" />
                <span className="hidden sm:inline text-lavender-100">Sound ON</span>
              </>
            )}
          </button>

          {/* Replay Button */}
          <button
            onClick={handleReplay}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-2xl glass-panel-glow border border-lavender-400/30 text-lavender-200 hover:text-white hover:border-lavender-300 transition-all flex items-center justify-center text-xs shadow-lg"
            title="Replay Shagun's Welcome from start"
          >
            <RotateCcw className="w-4 h-4 text-lavender-300" />
          </button>

          {/* Play / Pause Timer Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            className="min-h-[44px] min-w-[44px] p-2.5 rounded-2xl glass-panel-glow border border-lavender-400/30 text-lavender-200 hover:text-white hover:border-lavender-300 transition-all hidden md:flex items-center justify-center text-xs shadow-lg"
            title={isPlaying ? 'Pause Intro Timer' : 'Resume Intro Timer'}
          >
            {isPlaying ? <Pause className="w-4 h-4 text-lavender-300" /> : <Play className="w-4 h-4 text-stargold-300" />}
          </button>
        </div>

        {/* Center: Title & Subtitle Badge */}
        <div className="text-center px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-900/80 border border-lavender-400/30 backdrop-blur-md mb-1 shadow-md">
            <span className="text-xs">🌙</span>
            <span className="font-serif font-bold text-xs sm:text-sm text-cream-100 tracking-wider">
              Moonlit Library
            </span>
            <Sparkles className="w-3.5 h-3.5 text-stargold-300" />
          </div>
          <p className="text-[11px] sm:text-xs text-lavender-200/90 font-serif italic max-w-md hidden sm:block drop-shadow">
            "My little corner of dreams, books, and discoveries."
          </p>
        </div>

        {/* Right: Quick Skip Intro Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSkip}
            className="min-h-[44px] px-3.5 py-2 rounded-2xl glass-panel-glow border border-lavender-400/30 text-lavender-200 hover:text-white hover:border-stargold-300 transition-all flex items-center gap-1.5 text-xs font-medium shadow-lg group"
            title="Skip directly into the library"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5 text-stargold-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* ---------------- 3. FLOATING AUDIO AUTOPLAY PROMPT (IF BLOCKED OR WAITING) ---------------- */}
      {audioPromptVisible && (
        <div className="relative z-30 mx-auto animate-bounce px-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUserActivateAudio();
              playVoice();
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-stargold-400 via-rosemoon-400 to-lavender-500 text-midnight-950 font-serif font-bold text-xs sm:text-sm shadow-[0_0_35px_rgba(254,224,71,0.7)] flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-transform border border-stargold-200"
          >
            <Volume2 className="w-4 h-4 text-midnight-950 animate-pulse" />
            <span>Click to Hear Shagun Speak Her Welcome 🔊</span>
          </button>
        </div>
      )}

      {/* ---------------- 4. BOTTOM DIALOGUE & INTERACTION CARD ---------------- */}
      <footer 
        onClick={(e) => e.stopPropagation()} 
        className="relative z-20 px-3 sm:px-6 pb-4 sm:pb-6 max-w-4xl mx-auto w-full flex flex-col items-center gap-3 cursor-default"
      >
        {/* Shagun Dialogue Speech Card */}
        <div className="w-full glass-panel-glow rounded-3xl border border-lavender-300/35 p-4 sm:p-5 shadow-[0_0_40px_rgba(117,78,208,0.4)] backdrop-blur-xl transition-all duration-300">
          
          {/* Header Row: Host Profile & Status Indicator */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-lavender-500/20">
            <div className="flex items-center gap-2.5">
              {/* Cute Shagun Avatar Thumbnail */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stargold-300/80 shadow-sm shrink-0">
                <img 
                  src="/shagun/shagun_speaking.jpg" 
                  alt="Shagun" 
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-cream-100">
                    Shagun
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-lavender-600/40 text-lavender-200 border border-lavender-400/30">
                    Host 🌙
                  </span>
                </div>
                <p className="text-[10px] text-lavender-300 font-mono">
                  {isSpeaking ? 'Speaking softly under the moonlight...' : isGesturing ? 'Welcoming you inside...' : 'Reading peacefully...'}
                </p>
              </div>
            </div>

            {/* Speaking / Audio Waveform Indicator & Hear Voice Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playVoice();
                }}
                className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                  isSpeaking
                    ? 'bg-stargold-400/20 border border-stargold-300 text-stargold-200'
                    : 'bg-lavender-600/40 hover:bg-lavender-500/60 border border-lavender-400/40 text-lavender-100 hover:text-white'
                }`}
                title="Play or replay Shagun's voice greeting"
              >
                <Volume2 className="w-3.5 h-3.5 text-stargold-300" />
                <span>{isSpeaking ? 'Speaking 🔊' : 'Hear Voice 🔊'}</span>
              </button>

              {isSpeaking && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-stargold-400/15 border border-stargold-300/40">
                  <span className="w-1.5 h-3 rounded-full bg-stargold-300 animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-4 rounded-full bg-stargold-300 animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-2 rounded-full bg-stargold-300 animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          </div>

          {/* Dialogue Captions with Smooth Transitions */}
          <div className="min-h-[52px] sm:min-h-[48px] flex items-center justify-center text-center px-2">
            <p className="font-serif text-sm sm:text-base text-cream-100 leading-relaxed drop-shadow">
              {activeSubtitle.text}
            </p>
          </div>
        </div>

        {/* Primary Action Button: "Enter My Library" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-lavender-600 via-indigo-600 to-rosemoon-500 text-white font-serif font-bold text-sm sm:text-base tracking-wider shadow-[0_0_35px_rgba(142,108,229,0.55)] hover:shadow-[0_0_55px_rgba(255,232,163,0.7)] transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 min-w-[240px] sm:min-w-[280px]"
          >
            <Sparkles className="w-4 h-4 text-stargold-300 group-hover:rotate-180 transition-transform duration-500" />
            <span>Enter My Library</span>
            <Compass className="w-4 h-4 text-lavender-200 group-hover:rotate-45 transition-transform duration-500" />
            
            {/* Ambient starlight glow around button */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-stargold-300 via-lavender-400 to-rosemoon-400 opacity-0 group-hover:opacity-40 blur transition-opacity duration-300 pointer-events-none" />
          </button>
        </div>

        {/* Footer Settings & 15-Second Progress Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 text-xs text-lavender-300/80">
          
          {/* Don't show this again checkbox */}
          <label 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center gap-2 cursor-pointer hover:text-cream-100 transition-colors"
          >
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded bg-midnight-900 border-lavender-400/40 text-lavender-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-[11px] font-sans">Don't show this intro on next visit</span>
          </label>

          {/* 15s Timeline Counter & Progress Pill */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-moon-gold text-xs">🌙</span>
            <span>{elapsed.toFixed(1)}s / 15.0s</span>
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-midnight-900/80 border border-lavender-500/30 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-lavender-500 to-stargold-300 transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
