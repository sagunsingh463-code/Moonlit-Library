import React from 'react';
import { 
  Search, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Eye, 
  Wind,
  CloudRain,
  Music,
  Maximize2,
  User,
  Sparkles
} from 'lucide-react';
import { AppSettings, MoonPhaseType, UserProfile } from '../../types';
import { sound } from '../../services/audio';

interface TopHeaderProps {
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenFocusMode: () => void;
  onReopenOpening: () => void;
  onOpenProfile: () => void;
  currentUser: UserProfile | null;
  settings: AppSettings;
  onUpdateSettings: (updater: (prev: AppSettings) => AppSettings) => void;
  currentMoonPhase?: MoonPhaseType;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenSearch,
  onOpenBookmarks,
  onOpenFocusMode,
  onReopenOpening,
  onOpenProfile,
  currentUser,
  settings,
  onUpdateSettings,
  currentMoonPhase = 'waning-gibbous'
}) => {
  const toggleSound = () => {
    onUpdateSettings(prev => {
      const nextSound = !prev.soundEnabled;
      sound.setMuted(!nextSound);
      if (nextSound && prev.ambientSound !== 'none') {
        sound.startAmbient(prev.ambientSound);
      } else {
        sound.stopAmbient();
      }
      return { ...prev, soundEnabled: nextSound };
    });
  };

  const handleAmbientChange = (ambient: AppSettings['ambientSound']) => {
    onUpdateSettings(prev => {
      sound.startAmbient(ambient);
      return { ...prev, ambientSound: ambient };
    });
  };

  const toggleReduceMotion = () => {
    onUpdateSettings(prev => ({ ...prev, reduceMotion: !prev.reduceMotion }));
  };

  const moonPhaseLabels: Record<MoonPhaseType, { name: string; symbol: string }> = {
    'new-moon': { name: 'New Moon', symbol: '🌑' },
    'waxing-crescent': { name: 'Waxing Crescent', symbol: '🌒' },
    'first-quarter': { name: 'First Quarter', symbol: '🌓' },
    'waxing-gibbous': { name: 'Waxing Gibbous', symbol: '🌔' },
    'full-moon': { name: 'Full Moon', symbol: '🌕' },
    'waning-gibbous': { name: 'Waning Gibbous', symbol: '🌖' },
    'last-quarter': { name: 'Third Quarter', symbol: '🌗' },
    'waning-crescent': { name: 'Waning Crescent', symbol: '🌘' },
  };

  const phaseInfo = moonPhaseLabels[currentMoonPhase] || { name: 'Waxing Moon', symbol: '🌔' };

  const getAvatarEmoji = () => {
    if (!currentUser) return '🌙';
    switch (currentUser.avatar) {
      case 'cat-luna': return '🐱';
      case 'starlight': return '✨';
      case 'bunny-star': return '🐰';
      case 'fox-midnight': return '🦊';
      case 'witch-lavender': return '🧙‍♀️';
      case 'owl-cosmic': return '🦉';
      default: return '🌙';
    }
  };

  return (
    <header className="h-16 px-3 sm:px-6 glass-panel border-b border-lavender-400/20 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 select-none max-w-full overflow-hidden">
      {/* Search Bar Input */}
      <div className="flex-1 max-w-md min-w-0">
        <button
          onClick={onOpenSearch}
          className="w-full min-h-[44px] flex items-center justify-between px-3 sm:px-4 py-2 rounded-xl bg-midnight-900/70 border border-lavender-400/25 text-lavender-200/70 hover:text-white hover:border-lavender-400/50 hover:bg-midnight-800/80 transition-all text-xs sm:text-sm group shadow-inner"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-lavender-300 group-hover:text-stargold-300 transition-colors shrink-0" />
            <span className="truncate">Search library...</span>
          </div>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] rounded bg-midnight-800 text-lavender-300/80 border border-lavender-400/20 font-mono shrink-0 ml-2">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Moon Phase Widget */}
        <div 
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-midnight-900/60 border border-stargold-400/25 text-xs text-stargold-200"
          title="Current Celestial Moon Phase"
        >
          <span className="text-sm">{phaseInfo.symbol}</span>
          <span className="font-serif font-medium">{phaseInfo.name}</span>
        </div>

        {/* Bookmarks Quick Drawer Button */}
        <button
          onClick={onOpenBookmarks}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-midnight-900/60 hover:bg-lavender-500/20 border border-lavender-400/25 text-lavender-200 hover:text-stargold-200 text-xs transition-colors"
          title="Open Magical Moon Bookmarks"
        >
          <Bookmark className="w-4 h-4 text-rosemoon-300 fill-rosemoon-400/30 shrink-0" />
          <span className="hidden md:inline">Bookmarks</span>
        </button>

        {/* Ambient Sound Dropdown */}
        <div className="relative group">
          <button 
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-midnight-900/60 hover:bg-midnight-800 border border-lavender-400/25 text-lavender-300 hover:text-white text-xs transition-colors"
            title="Ambient Atmosphere"
          >
            {settings.ambientSound === 'night-breeze' && <Wind className="w-4 h-4 text-stargold-300" />}
            {settings.ambientSound === 'library-rain' && <CloudRain className="w-4 h-4 text-lavender-300" />}
            {settings.ambientSound === 'lofi-sparkles' && <Music className="w-4 h-4 text-rosemoon-300" />}
            {settings.ambientSound === 'none' && <Wind className="w-4 h-4 opacity-50" />}
          </button>
          
          <div className="absolute right-0 mt-2 w-48 p-2 rounded-2xl glass-panel-glow border border-lavender-400/30 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 text-xs space-y-1">
            <p className="px-2 py-1 text-[10px] uppercase font-bold text-lavender-300/70">Ambient Atmosphere</p>
            <button
              onClick={() => handleAmbientChange('none')}
              className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors ${settings.ambientSound === 'none' ? 'bg-lavender-500/30 text-white' : 'hover:bg-white/5 text-lavender-200'}`}
            >
              Quiet Silence
            </button>
            <button
              onClick={() => handleAmbientChange('night-breeze')}
              className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${settings.ambientSound === 'night-breeze' ? 'bg-lavender-500/30 text-white' : 'hover:bg-white/5 text-lavender-200'}`}
            >
              <Wind className="w-3.5 h-3.5 text-stargold-300" /> Night Breeze
            </button>
            <button
              onClick={() => handleAmbientChange('library-rain')}
              className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${settings.ambientSound === 'library-rain' ? 'bg-lavender-500/30 text-white' : 'hover:bg-white/5 text-lavender-200'}`}
            >
              <CloudRain className="w-3.5 h-3.5 text-lavender-300" /> Library Rain
            </button>
            <button
              onClick={() => handleAmbientChange('lofi-sparkles')}
              className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${settings.ambientSound === 'lofi-sparkles' ? 'bg-lavender-500/30 text-white' : 'hover:bg-white/5 text-lavender-200'}`}
            >
              <Music className="w-3.5 h-3.5 text-rosemoon-300" /> Lofi Sparkles
            </button>
          </div>
        </div>

        {/* Master Sound FX Toggle */}
        <button
          onClick={toggleSound}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl border transition-colors ${
            settings.soundEnabled 
              ? 'bg-midnight-900/60 border-lavender-400/25 text-stargold-300 hover:text-white' 
              : 'bg-midnight-950/80 border-red-400/30 text-red-300'
          }`}
          title={settings.soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Motion Reduction Toggle (Desktop) */}
        <button
          onClick={toggleReduceMotion}
          className={`hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center p-2 rounded-xl border transition-colors ${
            settings.reduceMotion 
              ? 'bg-rosemoon-500/20 border-rosemoon-400/40 text-rosemoon-300' 
              : 'bg-midnight-900/60 border-lavender-400/25 text-lavender-300 hover:text-white'
          }`}
          title={settings.reduceMotion ? 'Reduced Motion: ON' : 'Reduce Motion (Accessibility)'}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Revisit Shagun's Moonlit Welcome Scene */}
        <button
          onClick={onReopenOpening}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-midnight-900/60 hover:bg-midnight-800 border border-lavender-400/25 text-stargold-300 hover:text-stargold-200 transition-colors shadow-sm"
          title="Revisit Shagun's Moonlit Welcome Scene 🌙"
        >
          <span className="text-sm">🌙</span>
        </button>

        {/* User Profile Button */}
        <button
          onClick={onOpenProfile}
          className="min-h-[44px] flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-lavender-400/30 transition-all cursor-pointer group"
          title="Manage Account & Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender-600 to-rosemoon-400 flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform">
            {getAvatarEmoji()}
          </div>
          <div className="hidden sm:block text-left max-w-[120px] truncate">
            <p className="text-xs font-medium text-white truncate leading-tight">
              {currentUser?.name || settings.studentName}
            </p>
            <p className="text-[10px] text-lavender-300/80 truncate leading-tight">
              {currentUser?.email ? 'Account 🌙' : settings.targetDegree}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
