import React, { useState } from 'react';
import { MascotMood } from '../../types';
import { sound } from '../../services/audio';

interface MoonCatProps {
  mood?: MascotMood;
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
  className?: string;
  onPet?: () => void;
}

export const MoonCat: React.FC<MoonCatProps> = ({
  mood = 'studying',
  customMessage,
  size = 'md',
  showSpeech = true,
  className = '',
  onPet
}) => {
  const [internalMood, setInternalMood] = useState<MascotMood>(mood);
  const [clickCount, setClickCount] = useState(0);

  const activeMood = customMessage ? mood : internalMood;

  const defaultMessages: Record<MascotMood, string[]> = {
    sleepy: [
      "zZz... Luna is resting on the grimoire...",
      "Take small rests between study sprints, little star ✨",
      "Soft breathing under the moonlight... cozy studying..."
    ],
    studying: [
      "I'm reviewing your MBA notes with you! 📚",
      "Little steps create giant constellations! ✨",
      "Stay curious, Seraphina. You're doing splendidly!",
      "The library is quiet and peaceful tonight... perfect focus time."
    ],
    cheering: [
      "You've got this! One problem at a time! 🐾",
      "Paws up! Deep breath and conquer that chapter!",
      "I believe in your brilliant mind! 💫"
    ],
    celebrating: [
      "Purrr! Marvelous work! A new star was born in your constellation! 🌟",
      "Hooray!! That was magnificent! Have a moon cookie! 🍪✨",
      "Task conquered! Look how your universe is expanding! 🌙"
    ],
    curious: [
      "Ooh, what fascinating topic are we investigating next? 🐾",
      "Did you know? Spaced repetition cements 80% more recall!",
      "Every question is a doorway to mastery."
    ],
    meditating: [
      "Breathe in calm moonlight... exhale all tension... 🌙",
      "Quiet mind, sharp insights.",
      "In this tranquil sanctuary, you can learn anything."
    ]
  };

  const getDisplayMessage = () => {
    if (customMessage) return customMessage;
    const list = defaultMessages[activeMood] || defaultMessages.studying;
    return list[clickCount % list.length];
  };

  const handleCatClick = () => {
    sound.playCatPurr();
    setClickCount(prev => prev + 1);
    // Cycle playful reaction
    if (activeMood === 'sleepy') {
      setInternalMood('curious');
    } else if (activeMood === 'studying') {
      setInternalMood('cheering');
    } else {
      setInternalMood(mood);
    }
    if (onPet) onPet();
  };

  const dimensions = {
    sm: { w: 48, h: 48, box: 'w-12 h-12' },
    md: { w: 80, h: 80, box: 'w-20 h-20' },
    lg: { w: 120, h: 120, box: 'w-28 h-28' },
    xl: { w: 160, h: 160, box: 'w-40 h-40' }
  }[size];

  return (
    <div className={`relative flex items-center gap-3 select-none ${className}`}>
      {/* Speech Bubble */}
      {showSpeech && (
        <div className="relative max-w-xs px-3.5 py-2 rounded-2xl glass-panel text-xs md:text-sm text-moonlight-silver border border-lavender-400/30 shadow-lg shadow-lavender-500/10 animate-float-gentle">
          <p className="leading-relaxed font-sans">{getDisplayMessage()}</p>
          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-midnight-900 border-r border-b border-lavender-400/30 transform rotate-45" />
        </div>
      )}

      {/* Moon Cat Mascot SVG */}
      <div 
        onClick={handleCatClick}
        className={`cursor-pointer transform hover:scale-110 active:scale-95 transition-all duration-300 relative group`}
        title="Click to pet Luna the Moon Cat!"
      >
        <svg 
          width={dimensions.w} 
          height={dimensions.h} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-lg"
        >
          {/* Crescent Moon cushion or halo behind cat */}
          <path 
            d="M78 30C75 48 60 62 42 62C30 62 19 55 14 44C13 49 13 54 15 58C21 72 36 82 54 80C72 78 86 63 87 45C87 39 84 34 81 29L78 30Z" 
            fill="url(#crescentGlow)" 
            opacity="0.85"
          />

          {/* Cat Body (Midnight Black / Navy with Lavender Tint) */}
          <ellipse cx="50" cy="65" rx="26" ry="22" fill="#181D3B" stroke="#483D7C" strokeWidth="2.5" />

          {/* Chest fluff / bib (soft cream) */}
          <path d="M43 55C46 62 54 62 57 55C54 66 46 66 43 55Z" fill="#FFFDF7" opacity="0.9" />

          {/* Cat Head */}
          <ellipse cx="50" cy="42" rx="22" ry="18" fill="#181D3B" stroke="#483D7C" strokeWidth="2.5" />

          {/* Ears */}
          <polygon points="32,32 25,12 43,26" fill="#181D3B" stroke="#483D7C" strokeWidth="2" />
          <polygon points="32,30 27,16 40,26" fill="#F4ABC4" opacity="0.8" />

          <polygon points="68,32 75,12 57,26" fill="#181D3B" stroke="#483D7C" strokeWidth="2" />
          <polygon points="68,30 73,16 60,26" fill="#F4ABC4" opacity="0.8" />

          {/* Forehead crescent mark (Signature Moon Mark) */}
          <path d="M52 28C50 31 47 31 45 28C46 33 50 34 52 32C53 31 53 29 52 28Z" fill="#FDE047" />

          {/* Eyes & Expression depending on mood */}
          {activeMood === 'sleepy' && (
            <>
              {/* Happy closed sleepy arcs */}
              <path d="M37 43C39 46 43 46 45 43" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M55 43C57 46 61 46 63 43" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
              {/* Floating zZz */}
              <text x="75" y="24" fill="#B8A7EA" fontSize="12" fontWeight="bold" className="animate-pulse">z</text>
              <text x="83" y="15" fill="#E1D9F8" fontSize="10" fontWeight="bold">Z</text>
            </>
          )}

          {activeMood === 'studying' && (
            <>
              {/* Big focused anime eyes */}
              <ellipse cx="40" cy="42" rx="4" ry="5.5" fill="#FDE047" />
              <circle cx="41.5" cy="40.5" r="1.8" fill="#FFFFFF" />
              <circle cx="39" cy="44" r="1" fill="#181D3B" />

              <ellipse cx="60" cy="42" rx="4" ry="5.5" fill="#FDE047" />
              <circle cx="61.5" cy="40.5" r="1.8" fill="#FFFFFF" />
              <circle cx="59" cy="44" r="1" fill="#181D3B" />

              {/* Study spectacles! */}
              <circle cx="40" cy="42" r="6.5" fill="none" stroke="#FFE8A3" strokeWidth="1.5" opacity="0.85" />
              <circle cx="60" cy="42" r="6.5" fill="none" stroke="#FFE8A3" strokeWidth="1.5" opacity="0.85" />
              <line x1="46.5" y1="42" x2="53.5" y2="42" stroke="#FFE8A3" strokeWidth="1.5" />
            </>
          )}

          {(activeMood === 'celebrating' || activeMood === 'cheering') && (
            <>
              {/* Joyful star eyes */}
              <path d="M40 37L41.5 41L45.5 42L41.5 43.5L40 47.5L38.5 43.5L34.5 42L38.5 41L40 37Z" fill="#FDE047" />
              <path d="M60 37L61.5 41L65.5 42L61.5 43.5L60 47.5L58.5 43.5L54.5 42L58.5 41L60 37Z" fill="#FDE047" />
              {/* Tiny wizard / party hat */}
              <polygon points="50,6 40,22 60,22" fill="#754ED0" stroke="#FFE8A3" strokeWidth="1.5" />
              <circle cx="50" cy="5" r="3" fill="#FDE047" />
            </>
          )}

          {(activeMood === 'curious' || activeMood === 'meditating') && (
            <>
              <ellipse cx="40" cy="41" rx="4" ry="5" fill="#A5C9FF" />
              <circle cx="41" cy="40" r="1.8" fill="#FFFFFF" />
              <ellipse cx="60" cy="41" rx="4" ry="5" fill="#A5C9FF" />
              <circle cx="61" cy="40" r="1.8" fill="#FFFFFF" />
            </>
          )}

          {/* Cute Nose */}
          <polygon points="50,47 48,45 52,45" fill="#F4ABC4" />

          {/* Smiling Mouth */}
          <path d="M47 49C48.5 51 49.5 51 50 49C50.5 51 51.5 51 53 49" stroke="#E1D9F8" strokeWidth="1.5" strokeLinecap="round" />

          {/* Kawaii Rosy Cheeks */}
          <ellipse cx="33" cy="46" rx="3.5" ry="2" fill="#F4ABC4" opacity="0.6" />
          <ellipse cx="67" cy="46" rx="3.5" ry="2" fill="#F4ABC4" opacity="0.6" />

          {/* Whiskers */}
          <line x1="31" y1="46" x2="19" y2="44" stroke="#8E6CE5" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="31" y1="49" x2="18" y2="51" stroke="#8E6CE5" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="69" y1="46" x2="81" y2="44" stroke="#8E6CE5" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <line x1="69" y1="49" x2="82" y2="51" stroke="#8E6CE5" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />

          {/* Tail curving gently */}
          <path d="M72 70C84 72 88 56 82 50C80 48 76 52 78 55C80 58 78 65 70 66" stroke="#483D7C" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* Front Paws resting */}
          <ellipse cx="43" cy="78" rx="5" ry="4" fill="#181D3B" stroke="#483D7C" strokeWidth="1.5" />
          <ellipse cx="57" cy="78" rx="5" ry="4" fill="#181D3B" stroke="#483D7C" strokeWidth="1.5" />

          <defs>
            <linearGradient id="crescentGlow" x1="20" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.5" stopColor="#B8A7EA" />
              <stop offset="1" stopColor="#754ED0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover Hint */}
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-lavender-300 whitespace-nowrap bg-midnight-900/90 px-1.5 py-0.5 rounded pointer-events-none">
          Pet Luna 🐾
        </span>
      </div>
    </div>
  );
};
