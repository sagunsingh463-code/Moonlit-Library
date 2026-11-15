import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  Coffee, 
  BookOpen, 
  Award, 
  Settings2, 
  Smile, 
  Volume2, 
  Zap, 
  Crown,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { VirtualPetState, PetMood, PetAccessory, PetBackground } from '../../types';
import { sound } from '../../services/audio';

interface VirtualStudyPetProps {
  userXp?: number;
  onFeed?: () => void;
  compact?: boolean;
}

const STORAGE_PET_KEY = 'moonlit_virtual_pet_v2';

export const VirtualStudyPet: React.FC<VirtualStudyPetProps> = ({
  userXp = 450,
  onFeed,
  compact = false
}) => {
  const [pet, setPet] = useState<VirtualPetState>(() => {
    if (typeof window === 'undefined') {
      return {
        name: 'Mochi',
        level: 3,
        xp: 320,
        nextLevelXp: 500,
        mood: 'reading',
        accessory: 'scholar_hat',
        background: 'desk',
        unlockedAccessories: ['none', 'scholar_hat', 'velvet_bowtie'],
        unlockedBackgrounds: ['desk', 'window'],
        lastInteractedAt: new Date().toISOString()
      };
    }
    try {
      const saved = localStorage.getItem(STORAGE_PET_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Mochi',
      level: 3,
      xp: 320,
      nextLevelXp: 500,
      mood: 'reading',
      accessory: 'scholar_hat',
      background: 'desk',
      unlockedAccessories: ['none', 'scholar_hat', 'velvet_bowtie'],
      unlockedBackgrounds: ['desk', 'window'],
      lastInteractedAt: new Date().toISOString()
    };
  });

  const [speechBubble, setSpeechBubble] = useState<string>(
    'Purr... Welcome to the study sanctuary! Mochi is keeping you company today ☕✨'
  );
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PET_KEY, JSON.stringify(pet));
    } catch {}
  }, [pet]);

  // Gentle study reminder messages
  const studyEncouragements = [
    'Purr... You have been doing great studying Term 2! Take a slow, deep breath 🌙',
    'Mochi brought you a cozy cup of tea! Remember to rest your eyes for 20 seconds 🍵',
    'Every flashcard you review makes Mochi’s fur sparkle brighter ✨',
    'No pressure at all! Just one concept at a time, Sagun. You got this! 🐾',
    'Mochi is curling up with your Microeconomics notes... warm and peaceful 📖'
  ];

  const handlePetCat = () => {
    sound.playSparkle();
    setIsInteracting(true);
    const newMood: PetMood = 'happy';
    const xpBonus = 15;
    const nextXp = pet.xp + xpBonus;
    let nextLvl = pet.level;
    let nextReq = pet.nextLevelXp;

    if (nextXp >= pet.nextLevelXp) {
      sound.playCelestialChime();
      nextLvl += 1;
      nextReq = Math.round(pet.nextLevelXp * 1.5);
      setSpeechBubble(`🎉 Level Up! Mochi is now a Level ${nextLvl} Scholar Familiar! ✨`);
    } else {
      setSpeechBubble('Purrrr... (Mochi nuzzles gently against your study notes! +15 XP) ❤️');
    }

    setPet(prev => ({
      ...prev,
      mood: newMood,
      xp: nextXp,
      level: nextLvl,
      nextLevelXp: nextReq,
      lastInteractedAt: new Date().toISOString()
    }));

    setTimeout(() => setIsInteracting(false), 2000);
  };

  const handleFeedSnack = () => {
    sound.playCelestialChime();
    setIsInteracting(true);
    setPet(prev => ({
      ...prev,
      mood: 'eating',
      xp: prev.xp + 25,
      lastInteractedAt: new Date().toISOString()
    }));
    setSpeechBubble('Nom nom nom! Mochi loves this matcha dorayaki snack! 🍡 (+25 XP)');
    if (onFeed) onFeed();
    setTimeout(() => {
      setPet(prev => ({ ...prev, mood: 'reading' }));
      setIsInteracting(false);
    }, 2500);
  };

  const handleCycleMood = () => {
    const moods: PetMood[] = ['reading', 'happy', 'sleeping', 'cheering', 'eating'];
    const curIdx = moods.indexOf(pet.mood);
    const nextMood = moods[(curIdx + 1) % moods.length];
    setPet(prev => ({ ...prev, mood: nextMood }));
    sound.playSparkle();
  };

  const getPetIllustration = () => {
    // Anime cat with different accessories and moods rendered via SVG
    return (
      <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
        {/* Ambient soft glow */}
        <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-700 ${
          pet.mood === 'happy' ? 'bg-amber-400/25 scale-110' :
          pet.mood === 'eating' ? 'bg-rose-400/25 scale-110' :
          pet.mood === 'cheering' ? 'bg-yellow-400/30 scale-125' :
          'bg-amber-600/15'
        }`} />

        {/* Anime Cat SVG Art */}
        <svg viewBox="0 0 200 200" className={`w-full h-full relative z-10 filter drop-shadow-md transition-transform duration-300 ${isInteracting ? 'scale-105' : ''}`}>
          {/* Cat Ears */}
          <polygon points="60,80 40,25 90,55" fill="#3A2D28" stroke="#D4AF37" strokeWidth="2" />
          <polygon points="65,75 50,38 85,58" fill="#F4ABC4" />
          <polygon points="140,80 160,25 110,55" fill="#3A2D28" stroke="#D4AF37" strokeWidth="2" />
          <polygon points="135,75 150,38 115,58" fill="#F4ABC4" />

          {/* Cat Tail */}
          <path d="M 40,150 Q 15,120 25,95 Q 35,90 30,110 Q 25,135 50,160 Z" fill="#3A2D28" stroke="#D4AF37" strokeWidth="1.5">
            <animateTransform attributeName="transform" type="rotate" values="-5 40 150; 8 40 150; -5 40 150" dur="3s" repeatCount="indefinite" />
          </path>

          {/* Cat Body */}
          <ellipse cx="100" cy="140" rx="55" ry="45" fill="#2E2420" stroke="#D4AF37" strokeWidth="1.5" />
          {/* Chest fluff / cream belly */}
          <ellipse cx="100" cy="145" rx="32" ry="28" fill="#F4EBE1" />

          {/* Cat Head */}
          <ellipse cx="100" cy="90" rx="48" ry="40" fill="#3A2D28" stroke="#D4AF37" strokeWidth="2" />

          {/* Facial Features based on Mood */}
          {pet.mood === 'sleeping' ? (
            <>
              {/* Closed curved sleeping eyes */}
              <path d="M 75,90 Q 85,98 95,90" fill="none" stroke="#F4EBE1" strokeWidth="3" strokeLinecap="round" />
              <path d="M 105,90 Q 115,98 125,90" fill="none" stroke="#F4EBE1" strokeWidth="3" strokeLinecap="round" />
              <text x="145" y="65" fill="#D4AF37" fontSize="16" fontFamily="serif" fontWeight="bold">Zzz...</text>
            </>
          ) : pet.mood === 'happy' || pet.mood === 'cheering' ? (
            <>
              {/* Happy curved eyes */}
              <path d="M 75,92 Q 85,82 95,92" fill="none" stroke="#F4EBE1" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 105,92 Q 115,82 125,92" fill="none" stroke="#F4EBE1" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="70" cy="98" r="6" fill="#F4ABC4" opacity="0.6" />
              <circle cx="130" cy="98" r="6" fill="#F4ABC4" opacity="0.6" />
            </>
          ) : (
            <>
              {/* Alert round amber scholar eyes */}
              <circle cx="82" cy="88" r="9" fill="#D4AF37" />
              <circle cx="82" cy="88" r="6" fill="#1C1815" />
              <circle cx="80" cy="85" r="2.5" fill="#FFFFFF" />

              <circle cx="118" cy="88" r="9" fill="#D4AF37" />
              <circle cx="118" cy="88" r="6" fill="#1C1815" />
              <circle cx="116" cy="85" r="2.5" fill="#FFFFFF" />

              {/* Cute spectacles if reading */}
              {pet.mood === 'reading' && (
                <>
                  <circle cx="82" cy="88" r="13" fill="none" stroke="#D4AF37" strokeWidth="2" />
                  <circle cx="118" cy="88" r="13" fill="none" stroke="#D4AF37" strokeWidth="2" />
                  <line x1="95" y1="88" x2="105" y2="88" stroke="#D4AF37" strokeWidth="2" />
                </>
              )}
            </>
          )}

          {/* Nose & Mouth */}
          <polygon points="98,99 102,99 100,103" fill="#F4ABC4" />
          <path d="M 96,105 Q 100,108 100,104 Q 100,108 104,105" fill="none" stroke="#F4EBE1" strokeWidth="2" strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="55" y1="96" x2="35" y2="92" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
          <line x1="55" y1="102" x2="33" y2="104" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
          <line x1="145" y1="96" x2="165" y2="92" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />
          <line x1="145" y1="102" x2="167" y2="104" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7" />

          {/* ACCESSORY: Scholar Hat (Mortarboard) */}
          {pet.accessory === 'scholar_hat' && (
            <g transform="translate(70, 20)">
              <polygon points="30,0 65,10 30,20 -5,10" fill="#1A1512" stroke="#D4AF37" strokeWidth="1.5" />
              <rect x="18" y="15" width="24" height="10" fill="#2E2420" />
              {/* Golden Tassel */}
              <line x1="30" y1="10" x2="60" y2="28" stroke="#D4AF37" strokeWidth="2" />
              <circle cx="60" cy="30" r="3" fill="#D4AF37" />
            </g>
          )}

          {/* ACCESSORY: Velvet Bowtie */}
          {pet.accessory === 'velvet_bowtie' && (
            <g transform="translate(85, 120)">
              <polygon points="0,5 12,0 12,10" fill="#8E2800" stroke="#D4AF37" strokeWidth="1" />
              <polygon points="30,5 18,0 18,10" fill="#8E2800" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="15" cy="5" r="3.5" fill="#D4AF37" />
            </g>
          )}

          {/* ACCESSORY: Moon Amulet */}
          {pet.accessory === 'moon_amulet' && (
            <g transform="translate(93, 122)">
              <path d="M 7,0 A 7,7 0 1 0 14,7 A 5,5 0 1 1 7,0 Z" fill="#D4AF37" />
            </g>
          )}

          {/* Small Antique Book in Paws when Reading */}
          {pet.mood === 'reading' && (
            <g transform="translate(65, 135)">
              <rect x="0" y="0" width="70" height="40" rx="4" fill="#4A2E1B" stroke="#D4AF37" strokeWidth="1.5" />
              <rect x="4" y="3" width="30" height="34" rx="2" fill="#F4EBE1" />
              <rect x="36" y="3" width="30" height="34" rx="2" fill="#F4EBE1" />
              <line x1="35" y1="2" x2="35" y2="38" stroke="#D4AF37" strokeWidth="2" />
              {/* Mini bookmark ribbon */}
              <polygon points="35,38 38,46 35,43 32,46" fill="#8E2800" />
            </g>
          )}

          {/* Cute Matcha Dango / Pastry when Eating */}
          {pet.mood === 'eating' && (
            <g transform="translate(80, 125)">
              <circle cx="12" cy="12" r="9" fill="#85A98F" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="28" cy="12" r="9" fill="#F4ABC4" stroke="#D4AF37" strokeWidth="1" />
              <line x1="0" y1="12" x2="40" y2="12" stroke="#C5A059" strokeWidth="2" />
            </g>
          )}
        </svg>
      </div>
    );
  };

  if (compact) {
    return (
      <div className="glass-panel p-4 rounded-2xl border border-amber-600/30 bg-[#161412]/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🐾</span>
            <h3 className="font-serif font-bold text-sm text-[#f4ebe1]">
              Study Companion • {pet.name}
            </h3>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/30 text-amber-300 font-bold">
            Lv. {pet.level}
          </span>
        </div>

        {/* Pet Visual Display */}
        <div 
          onClick={handlePetCat}
          className="relative bg-[#1c1815]/90 rounded-2xl border border-amber-700/20 p-2 cursor-pointer hover:border-amber-500/50 transition-all flex flex-col items-center justify-center group"
          title="Click to pet Mochi! (+15 XP)"
        >
          {getPetIllustration()}

          {/* Speech Bubble */}
          <div className="mt-1 px-3 py-1.5 rounded-xl bg-[#26201a] border border-amber-600/30 text-[11px] text-[#f4ebe1] text-center max-w-xs font-sans italic">
            "{speechBubble}"
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-stone-400">
            <span>XP Growth</span>
            <span>{pet.xp} / {pet.nextLevelXp} XP</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#2a241f] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((pet.xp / pet.nextLevelXp) * 100))}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePetCat}
            className="flex-1 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium hover:bg-amber-500/30 transition-all flex items-center justify-center gap-1.5"
          >
            <Heart size={12} className="text-rose-400 fill-rose-400" />
            <span>Pet Cat</span>
          </button>
          <button
            onClick={handleFeedSnack}
            className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
          >
            <Coffee size={12} />
            <span>Feed Snack</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-600/30 bg-gradient-to-r from-[#1c1713] via-[#261f19] to-[#1c1713] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-200 text-xs font-serif">
              <span>🐾</span>
              <span>Dark Academia Study Familiar</span>
              <span>•</span>
              <span>Level {pet.level}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#f4ebe1] text-glow">
              {pet.name}’s Study Chamber ˚୨୧⋆｡˚
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md font-sans leading-relaxed">
              Mochi sits beside you while you study MBA subjects, reacts to your focus streaks, and levels up with every completed quiz and note!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 text-xs font-serif font-bold flex items-center gap-2 transition-all"
            >
              <Settings2 size={15} />
              <span>{isCustomizing ? 'Close Wardrobe' : 'Pet Wardrobe'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pet Chamber Box */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-700/30 bg-[#161412]/80 space-y-6 text-center">
        {/* Mood Selector Pill Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {(['reading', 'happy', 'sleeping', 'cheering', 'eating'] as PetMood[]).map(m => (
            <button
              key={m}
              onClick={() => {
                sound.playSparkle();
                setPet(prev => ({ ...prev, mood: m }));
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                pet.mood === m
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'bg-[#221e1a] text-stone-400 hover:text-white border border-amber-800/20'
              }`}
            >
              {m === 'reading' ? '📖 Reading' :
               m === 'happy' ? '✨ Happy' :
               m === 'sleeping' ? '💤 Sleeping' :
               m === 'cheering' ? '🎉 Cheering' : '🍡 Eating Snack'}
            </button>
          ))}
        </div>

        {/* Pet Large Visual */}
        <div 
          onClick={handlePetCat}
          className="p-8 rounded-3xl bg-gradient-to-b from-[#221e1a]/80 to-[#181512]/90 border border-amber-600/30 cursor-pointer hover:border-amber-400/60 transition-all max-w-sm mx-auto shadow-inner flex flex-col items-center justify-center space-y-4"
        >
          {getPetIllustration()}

          {/* Interactive Speech Bubble */}
          <div className="px-4 py-2.5 rounded-2xl bg-[#2a231d] border border-amber-600/30 text-xs text-[#f4ebe1] font-serif italic max-w-xs leading-relaxed shadow-lg">
            "{speechBubble}"
          </div>
        </div>

        {/* Level & XP Stats Row */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-amber-300 font-bold">Level {pet.level} Scholar Cat</span>
            <span className="text-stone-400">{pet.xp} / {pet.nextLevelXp} XP to next level</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#2a241f] overflow-hidden border border-amber-700/20">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((pet.xp / pet.nextLevelXp) * 100))}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handlePetCat}
            className="px-6 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 text-xs font-serif font-bold flex items-center gap-2 transition-all"
          >
            <Heart size={14} className="text-rose-400 fill-rose-400" />
            <span>Pet Mochi (+15 XP)</span>
          </button>
          <button
            onClick={handleFeedSnack}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-xs font-serif font-bold shadow-lg shadow-amber-900/30 hover:brightness-110 flex items-center gap-2 transition-all"
          >
            <Coffee size={14} />
            <span>Feed Sweet Dorayaki (+25 XP)</span>
          </button>
        </div>
      </div>

      {/* Wardrobe & Customization Modal / Drawer */}
      {isCustomizing && (
        <div className="glass-panel p-6 rounded-3xl border border-amber-600/30 bg-[#161412]/90 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
            <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
              Mochi's Academic Wardrobe & Accessories
            </h3>
            <span className="text-xs text-amber-400 font-mono">
              Level {pet.level} Privileges
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { id: 'none' as PetAccessory, label: 'Natural Familiar', levelReq: 1, desc: 'Clean, fluffy and unadorned.' },
              { id: 'scholar_hat' as PetAccessory, label: 'Scholar Hat (Mortarboard)', levelReq: 2, desc: 'Golden tassel for academic mastery.' },
              { id: 'velvet_bowtie' as PetAccessory, label: 'Velvet Bowtie', levelReq: 3, desc: 'Rich burgundy vintage library bowtie.' },
              { id: 'moon_amulet' as PetAccessory, label: 'Celestial Moon Amulet', levelReq: 4, desc: 'Glowing golden crescent pendant.' },
              { id: 'wizard_scarf' as PetAccessory, label: 'Gryffindor Wool Scarf', levelReq: 5, desc: 'Warm knitted scarf for library winters.' }
            ].map(item => {
              const isUnlocked = pet.level >= item.levelReq;
              const isEquipped = pet.accessory === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playSparkle();
                      setPet(prev => ({ ...prev, accessory: item.id }));
                    }
                  }}
                  className={`p-3 rounded-2xl border transition-all ${
                    isEquipped
                      ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                      : isUnlocked
                      ? 'bg-[#221e1a]/70 border-amber-800/30 text-stone-300 hover:border-amber-500/50 cursor-pointer'
                      : 'bg-[#181512]/50 border-stone-800 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-serif font-bold">{item.label}</span>
                    {isEquipped && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-stone-950 font-bold">
                        Equipped
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">{item.desc}</p>
                  {!isUnlocked && (
                    <span className="text-[10px] text-rose-400 font-mono mt-2 block">
                      🔒 Unlocks at Level {item.levelReq}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
