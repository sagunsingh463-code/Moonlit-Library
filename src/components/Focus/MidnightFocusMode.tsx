import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Moon, 
  Sparkles, 
  Wind, 
  CloudRain, 
  Music, 
  CheckCircle2, 
  Minimize2 
} from 'lucide-react';
import { sound } from '../../services/audio';
import { MoonCat } from '../Mascot/MoonCat';
import { SkyBackground } from '../SkyBackground';

interface MidnightFocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (minutes: number, taskName: string) => Promise<void>;
  reduceMotion?: boolean;
}

export const MidnightFocusMode: React.FC<MidnightFocusModeProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
  reduceMotion = false
}) => {
  const [taskName, setTaskName] = useState('MBA Corporate Valuation & Cash Flow Modeling');
  const [timerMode, setTimerMode] = useState<'focus-25' | 'deep-50' | 'break-5' | 'break-15'>('focus-25');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [ambient, setAmbient] = useState<'none' | 'night-breeze' | 'library-rain' | 'lofi-sparkles'>('night-breeze');

  // Handle Timer Duration Switching
  const handleModeChange = (mode: 'focus-25' | 'deep-50' | 'break-5' | 'break-15') => {
    setIsActive(false);
    setTimerMode(mode);
    const secs = {
      'focus-25': 25 * 60,
      'deep-50': 50 * 60,
      'break-5': 5 * 60,
      'break-15': 15 * 60
    }[mode];
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
  };

  // Timer Tick Effect
  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      return;
    }

    let interval: number | undefined;
    if (isActive && remainingSeconds > 0) {
      interval = window.setInterval(() => {
        setRemainingSeconds(prev => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isActive) {
      setIsActive(false);
      sound.playCelestialChime();
      const mins = Math.floor(totalSeconds / 60);
      onSessionComplete(mins, taskName);
    }

    return () => clearInterval(interval);
  }, [isActive, remainingSeconds, isOpen, totalSeconds, onSessionComplete, taskName]);

  const toggleTimer = () => {
    if (!isActive) {
      sound.playSparkle();
      if (ambient !== 'none') {
        sound.startAmbient(ambient);
      }
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setRemainingSeconds(totalSeconds);
  };

  const handleAmbientToggle = (nextAmbient: 'none' | 'night-breeze' | 'library-rain' | 'lofi-sparkles') => {
    setAmbient(nextAmbient);
    sound.startAmbient(nextAmbient);
  };

  const handleFinishEarly = async () => {
    const elapsedMinutes = Math.max(1, Math.floor((totalSeconds - remainingSeconds) / 60));
    sound.playCelestialChime();
    await onSessionComplete(elapsedMinutes, taskName);
    onClose();
  };

  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-midnight-950 flex flex-col justify-between p-6 md:p-12 overflow-hidden select-none animate-book-open">
      {/* Background Starry Sky Canvas */}
      <SkyBackground reduceMotion={reduceMotion} />

      {/* Top Controls Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-midnight-900/80 border border-stargold-400/30 flex items-center justify-center shadow-moon-glow">
            <Moon className="w-5 h-5 text-stargold-300" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-white tracking-wide text-glow">
              Midnight Focus Mode
            </h2>
            <p className="text-xs text-lavender-300/80 font-sans">
              Distraction-free moonlit sanctuary
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Ambient sound picker */}
          <div className="flex items-center gap-1 p-1 rounded-2xl glass-panel-subtle text-xs">
            <button
              onClick={() => handleAmbientToggle('none')}
              className={`px-2.5 py-1.5 rounded-xl transition-colors ${ambient === 'none' ? 'bg-lavender-500/30 text-white' : 'text-lavender-300 hover:text-white'}`}
            >
              Mute
            </button>
            <button
              onClick={() => handleAmbientToggle('night-breeze')}
              className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors ${ambient === 'night-breeze' ? 'bg-stargold-500/20 text-stargold-200 border border-stargold-400/30' : 'text-lavender-300 hover:text-white'}`}
            >
              <Wind className="w-3.5 h-3.5" /> Breeze
            </button>
            <button
              onClick={() => handleAmbientToggle('library-rain')}
              className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors ${ambient === 'library-rain' ? 'bg-lavender-500/30 text-lavender-200 border border-lavender-400/30' : 'text-lavender-300 hover:text-white'}`}
            >
              <CloudRain className="w-3.5 h-3.5" /> Rain
            </button>
            <button
              onClick={() => handleAmbientToggle('lofi-sparkles')}
              className={`px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-colors ${ambient === 'lofi-sparkles' ? 'bg-rosemoon-500/20 text-rosemoon-200 border border-rosemoon-400/30' : 'text-lavender-300 hover:text-white'}`}
            >
              <Music className="w-3.5 h-3.5" /> Lofi
            </button>
          </div>

          {/* Close focus mode */}
          <button
            onClick={() => {
              sound.stopAmbient();
              onClose();
            }}
            className="p-2.5 rounded-2xl glass-panel text-lavender-300 hover:text-white hover:border-lavender-400/50 transition-colors"
            title="Exit Midnight Focus Mode"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Focus Centerpiece */}
      <div className="relative z-10 max-w-xl mx-auto w-full text-center flex flex-col items-center my-auto">
        
        {/* Editable Current Task Focus */}
        <div className="mb-8 w-full">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-stargold-300/80 mb-2 block">
            Current Focus Intention
          </span>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full text-center bg-transparent border-b border-lavender-400/30 hover:border-lavender-400/60 focus:border-stargold-300 focus:outline-none text-xl md:text-2xl font-serif text-white py-1 px-4 transition-colors"
          />
        </div>

        {/* Circular Moonlit Clock Display */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center mb-8">
          {/* Outer glowing ring */}
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-midnight-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-stargold-300 transition-all duration-1000 ease-linear"
              strokeWidth="8"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 232, 163, 0.6))'
              }}
            />
          </svg>

          {/* Center Digital Clock Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl md:text-7xl font-mono font-bold text-white tracking-tighter text-glow">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-serif text-lavender-300 mt-2 uppercase tracking-widest">
              {isActive ? 'In Deep Flow' : 'Sanctuary Paused'}
            </span>
          </div>
        </div>

        {/* Timer Duration Mode Selector */}
        <div className="flex items-center gap-2 mb-6 p-1.5 rounded-2xl glass-panel-subtle text-xs">
          <button
            onClick={() => handleModeChange('focus-25')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${timerMode === 'focus-25' ? 'bg-stargold-400/20 text-stargold-200 border border-stargold-400/40' : 'text-lavender-300 hover:text-white'}`}
          >
            25m Focus
          </button>
          <button
            onClick={() => handleModeChange('deep-50')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${timerMode === 'deep-50' ? 'bg-stargold-400/20 text-stargold-200 border border-stargold-400/40' : 'text-lavender-300 hover:text-white'}`}
          >
            50m Deep Flow
          </button>
          <button
            onClick={() => handleModeChange('break-5')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${timerMode === 'break-5' ? 'bg-lavender-500/20 text-lavender-200 border border-lavender-400/40' : 'text-lavender-300 hover:text-white'}`}
          >
            5m Rest
          </button>
          <button
            onClick={() => handleModeChange('break-15')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${timerMode === 'break-15' ? 'bg-lavender-500/20 text-lavender-200 border border-lavender-400/40' : 'text-lavender-300 hover:text-white'}`}
          >
            15m Starlight Break
          </button>
        </div>

        {/* Timer Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl glass-panel text-lavender-300 hover:text-white hover:border-lavender-400/40 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-4 rounded-full font-serif font-bold text-base tracking-wider flex items-center gap-3 transition-all duration-300 shadow-lg ${
              isActive
                ? 'bg-rosemoon-500/30 text-rosemoon-200 border border-rosemoon-400/50 hover:bg-rosemoon-500/40 shadow-rosemoon-500/20'
                : 'bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 shadow-star-glow hover:brightness-110'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Flow</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Begin Flow</span>
              </>
            )}
          </button>

          <button
            onClick={handleFinishEarly}
            className="p-3.5 rounded-2xl glass-panel text-stargold-300 hover:text-stargold-100 hover:border-stargold-400/40 transition-colors"
            title="Complete session & ignite star"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Companion Bar */}
      <div className="relative z-10 flex items-center justify-center">
        <MoonCat 
          mood="meditating" 
          customMessage={isActive ? "Breathe deeply... you are creating something magical." : "Whenever you are ready, step into the flow."}
          size="md"
        />
      </div>
    </div>
  );
};
