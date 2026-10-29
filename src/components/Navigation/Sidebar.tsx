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
  LogOut
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
    { id: 'files' as ViewMode, label: 'My Files', icon: FolderGit2, badge: null },
    { id: 'notes' as ViewMode, label: 'Notes', icon: BookMarked, badge: null },
    { id: 'assignments' as ViewMode, label: 'Assignments', icon: FileCheck2, badge: 'Due' },
    { id: 'lectures' as ViewMode, label: 'Lectures', icon: GraduationCap, badge: null },
    { id: 'quiz' as ViewMode, label: 'Quiz Room', icon: HelpCircle, badge: 'Practice' },
    { id: 'question-bank' as ViewMode, label: 'Question Bank', icon: Database, badge: null },
    { id: 'planner' as ViewMode, label: 'Study Planner', icon: Calendar, badge: null },
    { id: 'progress' as ViewMode, label: 'My Progress', icon: LineChart, badge: null },
  ];

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
    <aside 
      className={`hidden md:flex flex-col justify-between flex-shrink-0 min-h-screen glass-panel border-r border-lavender-400/20 py-4 select-none transition-all duration-300 ${
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
              <MoonSticker size={36} className="transform group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stargold-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-stargold-300" />
              </span>
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h2 className="font-serif font-bold text-base text-white tracking-wide group-hover:text-stargold-200 transition-colors truncate">
                  Moonlit Library
                </h2>
                <p className="text-[10px] text-lavender-300 font-sans tracking-wider uppercase opacity-80 truncate">
                  Personal Universe
                </p>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg text-lavender-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse to compact icons'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Stats Pill */}
        {!isCollapsed ? (
          <div className="mx-1 mb-4 p-2.5 rounded-2xl bg-midnight-900/60 border border-lavender-400/15 flex items-center justify-around text-xs">
            <div 
              onClick={() => onSelectView('constellation')}
              className="flex items-center gap-1.5 cursor-pointer hover:text-stargold-300 transition-colors"
              title="View personal constellation"
            >
              <Sparkles className="w-3.5 h-3.5 text-stargold-300 shrink-0" />
              <span className="font-semibold text-stargold-100">{starsCount} Stars</span>
            </div>
            <div className="h-4 w-px bg-lavender-400/20" />
            <div className="flex items-center gap-1.5" title="Consecutive study streak">
              <span className="text-rosemoon-300 text-xs">🔥</span>
              <span className="font-medium text-rosemoon-200">{streakDays}d Streak</span>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => onSelectView('constellation')}
            className="mb-4 py-2 flex flex-col items-center justify-center rounded-2xl bg-midnight-900/60 border border-lavender-400/15 cursor-pointer hover:border-stargold-400/40"
            title={`${starsCount} Stars collected`}
          >
            <Sparkles className="w-4 h-4 text-stargold-300" />
            <span className="text-[10px] text-stargold-200 font-mono mt-0.5">{starsCount}</span>
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
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3.5'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-lavender-600/40 to-indigo-600/30 text-white border border-lavender-400/40 shadow-[0_0_15px_rgba(142,108,229,0.2)]'
                    : 'text-lavender-200/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} truncate`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-stargold-300' : 'text-lavender-300/80'}`} />
                  {!isCollapsed && <span className="font-sans truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rosemoon-500/20 text-rosemoon-300 border border-rosemoon-400/30 shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Special Sanctuary Sections & Profile Card */}
      <div className="pt-4 border-t border-lavender-400/15 space-y-2">
        {!isCollapsed && (
          <p className="px-3 text-[10px] uppercase tracking-widest text-lavender-300/60 font-semibold mb-1">
            Sanctuary Spaces
          </p>
        )}

        {/* Constellation Link */}
        <button
          onClick={() => onSelectView('constellation')}
          title={isCollapsed ? 'My Constellation' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3.5'} py-2 rounded-xl text-xs font-medium transition-all ${
            currentView === 'constellation'
              ? 'bg-lavender-500/30 text-stargold-200 border border-stargold-400/30'
              : 'text-lavender-200/80 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-stargold-300 shrink-0" />
          {!isCollapsed && <span>My Constellation</span>}
        </button>

        {/* Secret Garden Link */}
        <button
          onClick={() => onSelectView('garden')}
          title={isCollapsed ? 'Secret Study Garden' : undefined}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-3.5'} py-2 rounded-xl text-xs font-medium transition-all ${
            currentView === 'garden'
              ? 'bg-lavender-500/30 text-rosemoon-200 border border-rosemoon-400/30'
              : 'text-lavender-200/80 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flower2 className="w-4 h-4 text-rosemoon-300 shrink-0" />
          {!isCollapsed && <span>Secret Study Garden</span>}
        </button>

        {/* Midnight Focus Mode Trigger */}
        <button
          onClick={onOpenFocusMode}
          title={isCollapsed ? 'Midnight Focus Mode' : undefined}
          className={`w-full mt-2 group flex items-center justify-center ${isCollapsed ? 'p-2.5' : 'gap-2 py-2.5 px-3'} rounded-xl bg-gradient-to-r from-midnight-800 to-indigo-950 border border-lavender-400/30 text-xs font-serif font-semibold text-stargold-200 shadow-md hover:shadow-purple-glow hover:border-stargold-300/50 transition-all duration-300`}
        >
          <Moon className="w-4 h-4 text-stargold-300 group-hover:rotate-12 transition-transform shrink-0" />
          {!isCollapsed && <span>Focus Mode</span>}
        </button>

        {/* User Profile Mini Card in Sidebar */}
        <div 
          onClick={onOpenProfile}
          className={`mt-3 p-2 rounded-2xl bg-midnight-950/70 border border-lavender-500/20 hover:border-lavender-400/40 hover:bg-white/5 transition-all cursor-pointer flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title="Account & Profile Settings"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lavender-600 to-rose-400 flex items-center justify-center text-sm shadow-sm shrink-0">
              {getAvatarEmoji()}
            </div>
            {!isCollapsed && (
              <div className="text-left truncate">
                <p className="text-xs font-medium text-white truncate leading-tight">
                  {currentUser?.name || 'Seraphina'}
                </p>
                <p className="text-[10px] text-lavender-300/80 truncate leading-tight">
                  {currentUser?.email ? 'Personal Universe' : 'Seraphina MBA'}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <CatPawSticker size={16} className="opacity-70 shrink-0 ml-1" />
          )}
        </div>
      </div>
    </aside>
  );
};
