import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { Sparkles, Heart, BookOpen, Trophy, Volume2 } from 'lucide-react';

export type ShagunMood = 
  | 'welcome' 
  | 'reading' 
  | 'cheering' 
  | 'arcade' 
  | 'exam' 
  | 'celebrating' 
  | 'meditating';

export type ShagunSize = 'avatar' | 'sm' | 'md' | 'lg' | 'hero';

interface ShagunAnimeGirlProps {
  mood?: ShagunMood;
  size?: ShagunSize;
  showSpeech?: boolean;
  customMessage?: string;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const ShagunAnimeGirl: React.FC<ShagunAnimeGirlProps> = ({
  mood = 'welcome',
  size = 'md',
  showSpeech = true,
  customMessage,
  className = '',
  onClick,
  interactive = true
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [isSparkling, setIsSparkling] = useState(false);

  // High-fidelity asset paths for Shagun
  const speakingPortrait = '/shagun/shagun_speaking_portrait.jpg';
  const speakingLandscape = '/shagun/shagun_speaking.jpg';
  const readingPortrait = '/shagun/shagun_reading_portrait.jpg';
  const readingLandscape = '/shagun/shagun_reading.jpg';

  // Determine primary and fallback image based on mood and size
  const isReadingPose = mood === 'reading' || mood === 'meditating';
  const isCompact = size === 'avatar' || size === 'sm';

  const primarySrc = isCompact
    ? (isReadingPose ? readingPortrait : speakingPortrait)
    : (isReadingPose ? readingLandscape : speakingLandscape);

  const fallbackSrc = isReadingPose ? readingLandscape : speakingLandscape;

  // Curated bilingual dialogues for Shagun
  const defaultMessages: Record<ShagunMood, string[]> = {
    welcome: [
      "Namaste! Moonlit Library mein aapka swagat hai ✨ Main Shagun hoon, aapki study partner.",
      "The candles are lit, the tea is warm... aaj kya naya seekhenge? 🌙",
      "Har roz thoda padhna hi giant constellation banata hai! Let's excel together."
    ],
    reading: [
      "Shhh... tranquil midnight reading time. Knowledge is the truest light 📖",
      "I'm reviewing your MBA frameworks with you. Deep focus is pure magic ✨",
      "Patience and consistency turn confusing concepts into second nature."
    ],
    cheering: [
      "You've got this! Ek ek case study ko step-by-step master karenge 💫",
      "Keep pushing forward! Your potential is as boundless as the night sky 🌟",
      "Great business leaders are forged through persistent curiosity!"
    ],
    arcade: [
      "Welcome to Moonlight Arcade! Spin the wheel and test your MBA instincts 🎡",
      "Real-world business situations require sharp trade-offs. Let's practice!",
      "50 questions, 50 learning breakthroughs! Let's hit a new high score 🎯"
    ],
    exam: [
      "Stay calm and breathe. Read every case scenario with strategic clarity 📝",
      "Remember: analyze the problem before jumping to solutions. You are prepared!",
      "I'm right here proctoring your exam. Show your mastery of the concepts!"
    ],
    celebrating: [
      "Splendid work! Look at your constellation expanding with brilliant stars 🏆✨",
      "Magnificent! Your discipline and hard work have unlocked another milestone!",
      "Aapne bohot behtareen score kiya! Proud of your dedicated focus 🌟"
    ],
    meditating: [
      "Breathe in the calm moonlight... exhale all tension and doubts 🌙",
      "Quiet mind, sharp insights. Your sanctuary is always here for you.",
      "Clear thinking begins with a tranquil heart."
    ]
  };

  const currentMessage = customMessage || (
    defaultMessages[mood] ? defaultMessages[mood][clickCount % defaultMessages[mood].length] : defaultMessages.welcome[0]
  );

  const handleClick = () => {
    if (!interactive) return;
    sound.playCelestialChime();
    setIsSparkling(true);
    setTimeout(() => setIsSparkling(false), 800);
    setClickCount(prev => prev + 1);
    if (onClick) onClick();
  };

  // Avatar Size (Circular Badge with Glowing Ring)
  if (size === 'avatar') {
    return (
      <div 
        onClick={handleClick}
        className={`relative inline-flex items-center justify-center rounded-full p-0.5 bg-gradient-to-tr from-[#C99B9B] via-[#C7B6E8] to-[#F3D8E5] shadow-lg shadow-[#C7B6E8]/20 cursor-pointer hover:scale-105 active:scale-95 transition-transform ${className}`}
        title="Shagun — Moonlit Mascot"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[#241A30] flex items-center justify-center">
          <img 
            src={primarySrc} 
            alt="Shagun Anime Girl" 
            className="w-full h-full object-cover object-[center_20%] select-none"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = fallbackSrc;
              }
            }}
          />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#F3D8E5] border-2 border-[#241A30] shadow-sm" />
      </div>
    );
  }

  // Hero Size (Wide Landscape Showcase Banner)
  if (size === 'hero') {
    return (
      <div className={`relative w-full rounded-3xl overflow-hidden border border-[#C7B6E8]/30 shadow-2xl bg-[#241A30] group ${className}`}>
        <div className="w-full h-56 sm:h-72 md:h-80 relative overflow-hidden">
          <img 
            src={primarySrc} 
            alt="Shagun in Moonlight Library" 
            className="w-full h-full object-cover object-[center_35%] transform group-hover:scale-105 transition-transform duration-700"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = fallbackSrc;
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#241A30] via-[#241A30]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#241A30]/80 via-transparent to-[#241A30]/40" />

          {/* Overlay Info */}
          <div className="absolute bottom-4 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#30243D]/80 border border-[#C7B6E8]/40 text-[11px] text-[#F3D8E5] font-mono">
                <Sparkles size={12} className="text-[#C7B6E8]" />
                <span>Permanent Mascot & Study Partner</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FFF7ED] tracking-wide">
                Shagun 🌙
              </h3>
              <p className="text-xs text-[#E8DDF8] max-w-md font-sans">
                {currentMessage}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-[#30243D]/80 border border-[#C7B6E8]/20 text-[#FFF7ED] font-serif">
                Sanctuary Host
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Card Modes (sm, md, lg) with Speech Bubble
  const dimensions = {
    sm: { imgBox: 'w-16 h-16 sm:w-20 sm:h-20', maxBubble: 'max-w-xs' },
    md: { imgBox: 'w-24 h-24 sm:w-28 sm:h-28', maxBubble: 'max-w-sm' },
    lg: { imgBox: 'w-32 h-32 sm:w-40 sm:h-40', maxBubble: 'max-w-md' }
  }[size];

  return (
    <div className={`relative flex items-center gap-3.5 select-none ${className}`}>
      {/* Interactive Speech Bubble */}
      {showSpeech && (
        <div 
          onClick={handleClick}
          className={`relative ${dimensions.maxBubble} px-4 py-3 rounded-2xl bg-[#30243D]/90 backdrop-blur-xl border border-[#C7B6E8]/35 text-xs text-[#FFF7ED] shadow-xl shadow-[#241A30]/40 cursor-pointer hover:border-[#F3D8E5]/60 transition-all group`}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-[#F3D8E5] text-[11px]">Shagun</span>
              <span className="text-[9px] px-2 py-0.2 rounded-full bg-[#C7B6E8]/20 text-[#C7B6E8] border border-[#C7B6E8]/30">
                Host 🌙
              </span>
            </div>
            <Sparkles size={12} className={`text-[#F3D8E5] ${isSparkling ? 'animate-spin' : ''}`} />
          </div>
          <p className="leading-relaxed font-sans text-[#E8DDF8] text-xs sm:text-[13px]">
            {currentMessage}
          </p>
          <div className="text-[9px] text-[#C7B6E8]/70 mt-1 flex items-center gap-1 font-mono">
            <span>✨ Tap Shagun for fresh thoughts</span>
          </div>
          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#30243D] border-r border-b border-[#C7B6E8]/35 transform rotate-45" />
        </div>
      )}

      {/* Shagun Anime Girl Artwork Frame */}
      <div 
        onClick={handleClick}
        className={`relative ${dimensions.imgBox} rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-tr from-[#C99B9B] via-[#C7B6E8] to-[#F3D8E5] shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0 ${
          isSparkling ? 'ring-4 ring-[#C7B6E8]/50 scale-105' : ''
        }`}
        title="Shagun — Click to interact"
      >
        <div className="w-full h-full rounded-[14px] sm:rounded-[22px] overflow-hidden bg-[#241A30] relative">
          <img 
            src={primarySrc} 
            alt="Shagun" 
            className="w-full h-full object-cover object-[center_20%] select-none transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.fallback) {
                target.dataset.fallback = 'true';
                target.src = fallbackSrc;
              }
            }}
          />
          {/* Subtle Ambient Dreamy Rim Light */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#241A30]/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Mascot Name Badge */}
        <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#241A30] border border-[#C99B9B]/50 text-[9px] font-serif font-bold text-[#F3D8E5] shadow-sm whitespace-nowrap">
          Shagun ✨
        </div>
      </div>
    </div>
  );
};
