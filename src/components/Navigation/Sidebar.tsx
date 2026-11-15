import React, { useState } from 'react';
import { ViewMode, UserProfile } from '../../types';
import { 
  Home, 
  FolderGit2, 
  BookMarked, 
  FileCheck2, 
  GraduationCap, 
  HelpCircle, 
  Database, 
  Calendar, 
  LineChart, 
  Sparkles, 
  Flower2, 
  Moon, 
  ChevronLeft, 
  ChevronRight,
  User,
  LogOut,
  Award,
  Heart,
  GitBranch,
  TrendingUp
} from 'lucide-react';
import { MoonSticker, CatPawSticker } from '../Stickers/KawaiiStickers';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenFocusMode: () => void;
  onOpenProfile: () => void;
  currentUser: UserProfile | null;
  starsCount: number;
  streakDays: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenFocusMode,
  onOpenProfile,
  currentUser,
  starsCount,
  streakDays
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'home' as ViewMode, label: 'Home', icon: Home, badge: null },
    { id: 'quests' as ViewMode, label: 'Daily Quests', icon: Award, badge: 'Missions' },
    { id: 'pet' as ViewMode, label: 'Study Pet Mochi', icon: Heart, badge: 'Lv. 3' },
    { id: 'knowledge-map' as ViewMode, label: 'Knowledge Map', icon: GitBranch, badge: 'Trees' },
    { id: 'focus-score' as ViewMode, label: 'Focus Score', icon: TrendingUp, badge: 'Matrix' },
    { id: 'graduation-wall' as ViewMode, label: 'Graduation Wall', icon: GraduationCap, badge: '6 Terms' },
    { id: 'terms' as ViewMode, label: 'Academic Terms', icon: GraduationCap, badge: 'Terms' },
    { id: 'calendar' as ViewMode, label: 'Timetable & Cal', icon: Calendar, badge: 'Live' },
    { id: 'arcade' as ViewMode, label: 'Moonlight Arcade', icon: Sparkles, badge: '50 Qs' },
    { id: 'youtube' as ViewMode, label: 'YouTube Centre', icon: BookMarked, badge: null },
    { id: 'diary' as ViewMode, label: 'Learning Diary', icon: BookMarked, badge: null },
    { id: 'achievements' as ViewMode, label: 'Achievements', icon: Flower2, badge: null },
    { id: 'files' as ViewMode, label: 'My Files & PDFs', icon: FolderGit2, badge: null },
    { id: 'notes' as ViewMode, label: 'Notes', icon: BookMarked, badge: null },
    { id: 'assignments' as ViewMode, label: 'Assignments', icon: FileCheck2, badge: 'Due' },
    { id: 'quiz' as ViewMode, label: 'Quiz Room', icon: HelpCircle, badge: 'Practice' },
    { id: 'question-bank' as ViewMode, label: 'Question Bank', icon: Database, badge: null },
    { id: 'planner' as ViewMode, label: 'Study Planner', icon: Calendar, badge: null },
    { id: 'progress' as ViewMode, label: 'My Progress', icon: LineChart, badge: null },
  ];

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
    <aside 
      className={`hidden md:flex flex-col justify-between flex-shrink-0 min-h-screen bg-[#241A30]/90 backdrop-blur-2xl border-r border-[#C7B6E8]/20 py-4 select-none transition-all duration-300 shadow-xl ${
        isCollapsed ? 'w-20 px-2' : 'w-64 px-3'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <div 
            onClick={() => onSelectView('home')} 
            className="flex items-center gap-3 cursor-pointer group truncate"
          >
            <div className="relative shrink-0">
              <MoonSticker size={36} className="transform group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(199,182,232,0.4)]" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3D8E5] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C7B6E8]" />
              </span>
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h2 className="font-serif font-bold text-base text-[#FFF7ED] tracking-wide group-hover:text-[#F3D8E5] transition-colors truncate">
                  Moonlit Library
                </h2>
                <p className="text-[10px] text-[#C7B6E8] font-sans tracking-wider uppercase opacity-90 truncate">
                  Enchanted Study Sanctuary 🌸
                </p>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl text-[#C7B6E8] hover:text-[#FFF7ED] hover:bg-[#C7B6E8]/15 transition-all"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse to compact icons'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Stats Pill */}
        {!isCollapsed ? (
          <div className="mx-1 mb-4 p-2.5 rounded-2xl bg-[#30243D]/70 border border-[#C7B6E8]/25 flex items-center justify-around text-xs shadow-sm">
            <div 
              onClick={() => onSelectView('constellation')}
              className="flex items-center gap-1.5 cursor-pointer hover:text-[#FFF7ED] transition-colors"
              title="View personal constellation"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C7B6E8] shrink-0" />
              <span className="font-semibold text-[#FFF7ED]">{starsCount} Stars</span>
            </div>
            <div className="h-4 w-px bg-[#C7B6E8]/20" />
            <div className="flex items-center gap-1.5" title="Consecutive study streak">
              <span className="text-[#F3D8E5] text-xs">✨</span>
              <span className="font-medium text-[#F3D8E5]">{streakDays}d Streak</span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => onSelectView('constellation')}
            className="mb-4 py-2 flex flex-col items-center justify-center rounded-2xl bg-[#30243D]/70 border border-[#C7B6E8]/25 cursor-pointer hover:border-[#C7B6E8]/50"
            title={`${starsCount} Stars collected`}
          >
            <Sparkles className="w-4 h-4 text-[#C7B6E8]" />
            <span className="text-[10px] text-[#FFF7ED] font-mono mt-0.5">{starsCount}</span>
          </div>
        )}

        {/* Main Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#C7B6E8]/30 via-[#F3D8E5]/20 to-[#30243D]/60 text-[#FFF7ED] border border-[#C7B6E8]/40 shadow-[0_4px_16px_rgba(199,182,232,0.2)] font-semibold'
                    : 'text-[#E8DDF8]/75 hover:text-[#FFF7ED] hover:bg-[#C7B6E8]/10'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} truncate`}>
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#C7B6E8] scale-110' : 'text-[#C7B6E8]/70'}`} />
                  {!isCollapsed && <span className="font-sans truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3D8E5]/20 text-[#F3D8E5] border border-[#F3D8E5]/30 shrink-0 font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Special Sanctuary Sections & Profile Card */}
      <div className="pt-4 border-t border-[#C7B6E8]/15 space-y-2">
        {!isCollapsed && (
          <p className="px-3 text-[10px] uppercase tracking-widest text-[#C7B6E8]/70 font-semibold mb-1">
            Sanctuary Spaces
          </p>
        )}

        {/* Constellation Link */}
        <button
          onClick={() => onSelectView('constellation')}
          title={isCollapsed ? 'My Constellation' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3.5'} py-2 rounded-xl text-xs font-medium transition-all ${
            currentView === 'constellation'
              ? 'bg-[#C7B6E8]/25 text-[#FFF7ED] border border-[#C7B6E8]/40'
              : 'text-[#E8DDF8]/75 hover:text-[#FFF7ED] hover:bg-[#C7B6E8]/10'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C7B6E8] shrink-0" />
          {!isCollapsed && <span>My Constellation</span>}
        </button>

        {/* Secret Garden Link */}
        <button
          onClick={() => onSelectView('garden')}
          title={isCollapsed ? 'Secret Study Garden' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3.5'} py-2 rounded-xl text-xs font-medium transition-all ${
            currentView === 'garden'
              ? 'bg-[#F3D8E5]/25 text-[#FFF7ED] border border-[#F3D8E5]/40'
              : 'text-[#E8DDF8]/75 hover:text-[#FFF7ED] hover:bg-[#C7B6E8]/10'
          }`}
        >
          <Flower2 className="w-4 h-4 text-[#F3D8E5] shrink-0" />
          {!isCollapsed && <span>Secret Study Garden</span>}
        </button>

        {/* Midnight Focus Mode Trigger */}
        <button
          onClick={onOpenFocusMode}
          title={isCollapsed ? 'Midnight Focus Mode' : undefined}
          className={`w-full mt-2 group flex items-center justify-center ${isCollapsed ? 'p-2.5' : 'gap-2 py-2.5 px-3'} rounded-2xl bg-gradient-to-r from-[#30243D] to-[#452D57] border border-[#C7B6E8]/35 text-xs font-serif font-semibold text-[#FFF7ED] shadow-md hover:border-[#F3D8E5]/60 hover:shadow-dreamy-glow transition-all duration-300`}
        >
          <Moon className="w-4 h-4 text-[#F3D8E5] group-hover:rotate-12 transition-transform shrink-0" />
          {!isCollapsed && <span>Focus Mode</span>}
        </button>

        {/* User Profile Mini Card in Sidebar */}
        <div 
          onClick={onOpenProfile}
          className={`mt-3 p-2 rounded-2xl bg-[#30243D]/80 border border-[#C7B6E8]/20 hover:border-[#C7B6E8]/45 hover:bg-[#30243D] transition-all cursor-pointer flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title="Account & Profile Settings"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C7B6E8] to-[#F3D8E5] p-[1.5px] shadow-sm shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#241A30] flex items-center justify-center text-sm">
                {getAvatarEmoji()}
              </div>
            </div>
            {!isCollapsed && (
              <div className="text-left truncate">
                <p className="text-xs font-medium text-[#FFF7ED] truncate leading-tight">
                  {currentUser?.name || 'Seraphina'}
                </p>
                <p className="text-[10px] text-[#C7B6E8] truncate leading-tight">
                  {currentUser?.email ? 'Personal Universe' : 'Seraphina MBA'}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <CatPawSticker size={16} className="opacity-80 shrink-0 ml-1 text-[#F3D8E5]" />
          )}
        </div>
      </div>
    </aside>
  );
};
