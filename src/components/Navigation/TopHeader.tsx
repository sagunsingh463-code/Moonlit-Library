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
  Sparkles,
  Sun,
  Moon,
  Plus
} from 'lucide-react';
import { AppSettings, MoonPhaseType, UserProfile } from '../../types';
import { sound } from '../../services/audio';
import { themeService, ThemePreference, EffectiveTheme } from '../../services/theme';

interface TopHeaderProps {
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenFocusMode: () => void;
  onOpenProfile: () => void;
  onReopenOpening: () => void;
  onOpenAiAssistant?: () => void;
  onOpenQuickAdd?: () => void;
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
  onOpenAiAssistant,
  onOpenQuickAdd,
  currentUser,
  settings,
  onUpdateSettings,
  currentMoonPhase = 'waning-gibbous'
}) => {
  const [effectiveTheme, setEffectiveTheme] = React.useState<EffectiveTheme>(() => themeService.getEffectiveTheme());
  const [themePref, setThemePref] = React.useState<ThemePreference>(() => themeService.getPreference());

  React.useEffect(() => {
    const unsubscribe = themeService.subscribe((theme, pref) => {
      setEffectiveTheme(theme);
      setThemePref(pref);
    });
    return unsubscribe;
  }, []);

  const handleToggleTheme = () => {
    sound.playSparkle();
    themeService.toggleTheme();
  };
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
    if (currentUser.avatar === 'shagun-anime') {
      return (
        <img 
          src="/shagun/shagun_speaking_portrait.jpg" 
          alt="Shagun" 
          className="w-full h-full object-cover object-[center_20%] rounded-full" 
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/shagun/shagun_speaking.jpg'; }}
        />
      );
    }
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
    <header className="h-16 px-3 sm:px-6 bg-[#241A30]/85 backdrop-blur-2xl border-b border-[#C7B6E8]/20 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30 select-none max-w-full overflow-hidden shadow-sm">
      {/* Search Bar Input */}
      <div className="flex-1 max-w-md min-w-0">
        <button
          onClick={onOpenSearch}
          className="w-full min-h-[44px] flex items-center justify-between px-3 sm:px-4 py-2 rounded-2xl bg-[#30243D]/70 border border-[#C7B6E8]/25 text-[#E8DDF8]/70 hover:text-[#FFF7ED] hover:border-[#C7B6E8]/50 hover:bg-[#30243D] transition-all text-xs sm:text-sm group shadow-inner"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-4 h-4 text-[#C7B6E8] group-hover:text-[#F3D8E5] transition-colors shrink-0" />
            <span className="truncate">Search library & notes...</span>
          </div>
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] rounded-lg bg-[#241A30] text-[#C7B6E8] border border-[#C7B6E8]/20 font-mono shrink-0 ml-2">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Toolbar */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Moon Phase Widget */}
        <div 
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#30243D]/70 border border-[#C7B6E8]/25 text-xs text-[#FFF7ED]"
          title="Current Celestial Moon Phase"
        >
          <span className="text-sm">{phaseInfo.symbol}</span>
          <span className="font-serif font-medium">{phaseInfo.name}</span>
        </div>

        {/* Quick Add Button */}
        {onOpenQuickAdd && (
          <button
            onClick={onOpenQuickAdd}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-[#F3D8E5] via-[#C7B6E8] to-[#C99B9B] hover:opacity-95 text-[#30243D] text-xs font-serif font-bold transition-all shadow-md hover:scale-105"
            title="Quick Add Note, Task, Class, or Video"
          >
            <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>
        )}

        {/* Bookmarks Quick Drawer Button */}
        <button
          onClick={onOpenBookmarks}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-[#30243D]/70 hover:bg-[#C7B6E8]/20 border border-[#C7B6E8]/25 text-[#E8DDF8] hover:text-[#FFF7ED] text-xs transition-colors"
          title="Open Magical Moon Bookmarks"
        >
          <Bookmark className="w-4 h-4 text-[#C99B9B] fill-[#C99B9B]/30 shrink-0" />
          <span className="hidden md:inline font-medium">Bookmarks</span>
        </button>

        {/* Luna AI Study Assistant Button */}
        {onOpenAiAssistant && (
          <button
            onClick={onOpenAiAssistant}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-gradient-to-r from-[#C7B6E8]/20 to-[#F3D8E5]/20 hover:from-[#C7B6E8]/35 hover:to-[#F3D8E5]/35 border border-[#C7B6E8]/30 text-[#FFF7ED] text-xs transition-colors shadow-sm"
            title="Open Luna AI Study Assistant (Hindi & English)"
          >
            <Sparkles className="w-4 h-4 text-[#F3D8E5] shrink-0" />
            <span className="hidden md:inline font-serif font-semibold">Ask AI</span>
          </button>
        )}

        {/* Ambient Sound Dropdown */}
        <div className="relative group">
          <button 
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-2xl bg-[#30243D]/70 hover:bg-[#30243D] border border-[#C7B6E8]/25 text-[#E8DDF8] hover:text-[#FFF7ED] text-xs transition-colors"
            title="Ambient Atmosphere"
          >
            {settings.ambientSound === 'night-breeze' && <Wind className="w-4 h-4 text-[#C7B6E8]" />}
            {settings.ambientSound === 'library-rain' && <CloudRain className="w-4 h-4 text-[#E8DDF8]" />}
            {settings.ambientSound === 'lofi-sparkles' && <Music className="w-4 h-4 text-[#F3D8E5]" />}
            {settings.ambientSound === 'none' && <Wind className="w-4 h-4 opacity-50" />}
          </button>
          
          <div className="absolute right-0 mt-2 w-48 p-2 rounded-2xl glass-panel-glow border border-[#C7B6E8]/30 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 text-xs space-y-1">
            <p className="px-2 py-1 text-[10px] uppercase font-bold text-[#C7B6E8]">Ambient Atmosphere</p>
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
              className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${settings.ambientSound === 'lofi-sparkles' ? 'bg-[#C7B6E8]/30 text-[#FFF7ED]' : 'hover:bg-white/5 text-[#E8DDF8]'}`}
            >
              <Music className="w-3.5 h-3.5 text-[#F3D8E5]" /> Lofi Sparkles
            </button>
          </div>
        </div>

        {/* Visible Light Mode / Dark Mode Toggle Button */}
        <button
          onClick={handleToggleTheme}
          className={`min-h-[44px] min-w-[44px] relative flex items-center justify-center p-2 rounded-2xl border transition-all ${
            effectiveTheme === 'light'
              ? 'bg-[#FFF7ED] border-[#C99B9B]/60 text-[#30243D] hover:bg-[#F3D8E5]/30 shadow-sm'
              : 'bg-[#30243D]/70 border-[#C7B6E8]/25 text-[#E8DDF8] hover:text-[#FFF7ED] hover:border-[#C7B6E8]/50'
          }`}
          title={
            themePref === 'auto'
              ? `Current: ${effectiveTheme === 'light' ? 'Light Mode (Daytime ☀️)' : 'Dark Sanctuary (Nighttime 🌙)'} [Automatic 7 AM-6 PM Schedule]. Click to toggle.`
              : `Current: ${effectiveTheme === 'light' ? 'Light Mode (Daytime ☀️)' : 'Dark Sanctuary (Nighttime 🌙)'} [Manual Override]. Click to toggle.`
          }
        >
          {effectiveTheme === 'light' ? (
            <Sun className="w-4 h-4 text-[#C99B9B] fill-[#F3D8E5]" />
          ) : (
            <Moon className="w-4 h-4 text-[#C7B6E8] fill-[#C7B6E8]/30" />
          )}
          {themePref === 'auto' && (
            <span 
              className="absolute -top-1 -right-1 text-[8px] font-mono px-1 rounded-full bg-[#C7B6E8] text-[#30243D] font-bold"
              title="Auto Day/Night Mode Active"
            >
              A
            </span>
          )}
        </button>

        {/* Master Sound FX Toggle */}
        <button
          onClick={toggleSound}
          className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-2xl border transition-colors ${
            settings.soundEnabled 
              ? 'bg-[#30243D]/70 border-[#C7B6E8]/25 text-[#C7B6E8] hover:text-[#FFF7ED]' 
              : 'bg-[#1E1528] border-red-400/30 text-red-300'
          }`}
          title={settings.soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Motion Reduction Toggle (Desktop) */}
        <button
          onClick={toggleReduceMotion}
          className={`hidden sm:flex min-h-[44px] min-w-[44px] items-center justify-center p-2 rounded-2xl border transition-colors ${
            settings.reduceMotion 
              ? 'bg-[#F3D8E5]/20 border-[#F3D8E5]/40 text-[#F3D8E5]' 
              : 'bg-[#30243D]/70 border-[#C7B6E8]/25 text-[#E8DDF8] hover:text-[#FFF7ED]'
          }`}
          title={settings.reduceMotion ? 'Reduced Motion: ON' : 'Reduce Motion (Accessibility)'}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Revisit Shagun's Moonlit Welcome Scene */}
        <button
          onClick={onReopenOpening}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-2xl bg-[#30243D]/70 hover:bg-[#30243D] border border-[#C7B6E8]/25 text-[#FFF7ED] transition-colors shadow-sm"
          title="Revisit Shagun's Moonlit Welcome Scene 🌙"
        >
          <span className="text-sm">🌙</span>
        </button>

        {/* User Profile Button */}
        <button
          onClick={onOpenProfile}
          className="min-h-[44px] flex items-center gap-2 pl-2 pr-3 py-1 rounded-2xl bg-[#30243D]/70 hover:bg-[#30243D] border border-[#C7B6E8]/25 hover:border-[#C7B6E8]/45 transition-all cursor-pointer group shadow-sm"
          title="Manage Account & Profile"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C7B6E8] to-[#F3D8E5] p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#241A30] flex items-center justify-center text-sm">
              {getAvatarEmoji()}
            </div>
          </div>
          <div className="hidden sm:block text-left max-w-[120px] truncate">
            <p className="text-xs font-serif font-medium text-[#FFF7ED] truncate leading-tight">
              {currentUser?.name || settings.studentName}
            </p>
            <p className="text-[10px] text-[#C7B6E8] truncate leading-tight">
              {currentUser?.email ? 'Account 🌙' : settings.targetDegree}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
};
