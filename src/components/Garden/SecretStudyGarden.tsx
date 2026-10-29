import React, { useState } from 'react';
import { GardenItem } from '../../types';
import { 
  Flower2, 
  Sparkles, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Info, 
  Compass,
  Star
} from 'lucide-react';
import { sound } from '../../services/audio';

interface SecretStudyGardenProps {
  items: GardenItem[];
  onUnlockItem: (id: string) => Promise<void>;
  reduceMotion?: boolean;
}

export const SecretStudyGarden: React.FC<SecretStudyGardenProps> = ({
  items,
  onUnlockItem,
  reduceMotion = false
}) => {
  const [activeItem, setActiveItem] = useState<GardenItem | null>(null);

  const rarityColors = {
    common: 'text-lavender-300 border-lavender-400/30 bg-lavender-900/30',
    rare: 'text-stargold-200 border-stargold-400/40 bg-stargold-900/30',
    celestial: 'text-rosemoon-200 border-rosemoon-400/40 bg-rosemoon-900/30',
    legendary: 'text-amber-200 border-amber-400/50 bg-amber-900/40',
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'bonsai':
        return (
          <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
            <path d="M24 38V26" stroke="#8B5A2B" strokeWidth="3" strokeLinecap="round" />
            <path d="M24 30C28 28 32 30 34 26" stroke="#8B5A2B" strokeWidth="2" strokeLinecap="round" />
            <ellipse cx="22" cy="18" rx="14" ry="9" fill="#2E7D32" opacity="0.8" />
            <ellipse cx="28" cy="14" rx="10" ry="7" fill="#4CAF50" opacity="0.9" />
            <ellipse cx="34" cy="24" rx="7" ry="5" fill="#388E3C" opacity="0.8" />
            <path d="M12 38H36L34 44H14L12 38Z" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5" />
          </svg>
        );
      case 'crystal':
        return (
          <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
            <polygon points="24,6 34,18 24,42 14,18" fill="#AA90EC" stroke="#E1D9F8" strokeWidth="2" />
            <polygon points="24,6 28,18 24,42 20,18" fill="#8E6CE5" opacity="0.7" />
            <polygon points="34,18 42,24 32,38 24,42" fill="#754ED0" opacity="0.6" stroke="#C7B7F2" strokeWidth="1.5" />
          </svg>
        );
      case 'cat-charm':
        return (
          <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="18" fill="#1C1838" stroke="#FFE8A3" strokeWidth="2" />
            <circle cx="24" cy="24" r="13" fill="#34285C" />
            <path d="M18 20L21 23M27 23L30 20" stroke="#FFE8A3" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 27C23 29 25 29 27 27" stroke="#F4ABC4" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'flower':
        return (
          <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="5" fill="#FDE047" />
            <circle cx="24" cy="14" r="6" fill="#F4ABC4" opacity="0.85" />
            <circle cx="34" cy="24" r="6" fill="#AA90EC" opacity="0.85" />
            <circle cx="24" cy="34" r="6" fill="#F4ABC4" opacity="0.85" />
            <circle cx="14" cy="24" r="6" fill="#AA90EC" opacity="0.85" />
            <path d="M24 34V44" stroke="#4CAF50" strokeWidth="2" />
          </svg>
        );
      case 'lantern':
        return (
          <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
            <rect x="16" y="14" width="16" height="22" rx="4" fill="#241E38" stroke="#FBBF24" strokeWidth="2" />
            <circle cx="24" cy="25" r="5" fill="#FEF08A" className="animate-pulse" />
            <path d="M20 14V8C20 6 28 6 28 8V14" stroke="#FBBF24" strokeWidth="2" />
          </svg>
        );
      default:
        return (
          <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
            <path d="M24 16C18 8 8 10 10 22C11 28 20 26 24 22" fill="#AA90EC" opacity="0.8" />
            <path d="M24 16C30 8 40 10 38 22C37 28 28 26 24 22" fill="#F4ABC4" opacity="0.8" />
            <line x1="24" y1="14" x2="24" y2="30" stroke="#FFF" strokeWidth="2" />
          </svg>
        );
    }
  };

  const unlockedCount = items.filter(i => i.unlocked).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Flower2 className="w-6 h-6 text-rosemoon-300" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              Secret Study Garden
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            A rooftop greenhouse observatory where real learning achievements blossom into magical decorations.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl glass-panel-glow border border-rosemoon-400/30 text-xs font-serif text-rosemoon-200">
          <Sparkles className="w-4 h-4 text-stargold-300" />
          <span>{unlockedCount} of {items.length} Curiosities Unlocked</span>
        </div>
      </div>

      {/* Secret Garden Visual Terrace */}
      <div className="relative min-h-[380px] rounded-3xl glass-panel-glow border border-lavender-400/30 overflow-hidden shadow-2xl p-8 flex flex-col justify-between">
        {/* Background moon terrace art */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e1333]/90 via-[#161c44]/80 to-[#121736]/90 pointer-events-none" />
        
        {/* Moon in sky */}
        <div className="absolute top-8 right-12 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-100 to-amber-300 opacity-60 blur-xs shadow-moon-glow" />

        {/* Terrace Railing silhouette */}
        <div className="absolute bottom-0 inset-x-0 h-16 border-t-2 border-lavender-400/20 flex items-center justify-around px-4 pointer-events-none opacity-40">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1.5 h-16 bg-lavender-400/30" />
          ))}
        </div>

        {/* Garden Charms Display Grid on Terrace */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 my-auto">
          {items.map(item => {
            const isUnlocked = item.unlocked;
            return (
              <div
                key={item.id}
                onClick={() => {
                  sound.playSparkle();
                  setActiveItem(item);
                }}
                className={`group flex flex-col items-center p-4 rounded-2xl glass-panel-subtle cursor-pointer transition-all duration-300 border ${
                  isUnlocked
                    ? 'border-lavender-400/40 hover:border-stargold-300 hover:scale-105 shadow-lg'
                    : 'border-white/5 opacity-50 grayscale hover:grayscale-0'
                }`}
              >
                <div className="relative mb-3">
                  {renderIcon(item.icon)}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-midnight-950/70 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-lavender-400" />
                    </div>
                  )}
                </div>

                <span className="text-xs font-serif font-semibold text-white text-center line-clamp-1 group-hover:text-stargold-200">
                  {item.name}
                </span>

                <span className={`text-[9px] uppercase tracking-wider font-mono mt-1 px-2 py-0.5 rounded-full border ${rarityColors[item.rarity]}`}>
                  {item.rarity}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer info tip */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-lavender-300/70 pt-4 border-t border-lavender-400/15">
          <span>Click any curiosity to inspect its origin and unlock condition</span>
          <span className="flex items-center gap-1">Rooftop Conservatory • Moonlit Library</span>
        </div>
      </div>

      {/* Selected Item Detail Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/75 backdrop-blur-sm animate-book-open">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel-glow border border-lavender-400/40 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 rounded-full border ${rarityColors[activeItem.rarity]}`}>
                {activeItem.rarity} Curiosity
              </span>
              <button 
                onClick={() => setActiveItem(null)}
                className="text-lavender-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-midnight-900 border border-lavender-400/25">
                {renderIcon(activeItem.icon)}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">
                  {activeItem.name}
                </h3>
                <p className="text-xs text-lavender-300 font-mono capitalize">
                  {activeItem.type} Decor
                </p>
              </div>
            </div>

            <p className="text-xs md:text-sm text-lavender-100 font-sans leading-relaxed mb-4">
              {activeItem.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-midnight-900/80 border border-lavender-400/20 mb-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-stargold-200 mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>Unlock Condition</span>
              </div>
              <p className="text-xs text-lavender-300">
                {activeItem.unlockCondition}
              </p>
            </div>

            <div className="flex items-center justify-between">
              {activeItem.unlocked ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Unlocked & Adorning Your Garden</span>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    await onUnlockItem(activeItem.id);
                    sound.playCelestialChime();
                    setActiveItem(prev => prev ? { ...prev, unlocked: true } : null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Claim / Force Unlock Curiosity</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
