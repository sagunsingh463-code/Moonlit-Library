import React, { useState } from 'react';
import { 
  Home, 
  FolderGit2, 
  BookMarked, 
  HelpCircle, 
  MoreHorizontal, 
  FileCheck2, 
  GraduationCap, 
  Database, 
  Calendar, 
  LineChart, 
  Sparkles, 
  Flower2, 
  Moon, 
  User, 
  X,
  LogOut
} from 'lucide-react';
import { ViewMode, UserProfile } from '../../types';
import { sound } from '../../services/audio';

interface MobileNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  onOpenFocusMode: () => void;
  onOpenProfile: () => void;
  currentUser: UserProfile | null;
  starsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onSelectView,
  onOpenFocusMode,
  onOpenProfile,
  currentUser,
  starsCount
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleNavClick = (view: ViewMode) => {
    sound.playChime();
    onSelectView(view);
    setIsMoreOpen(false);
  };

  const moreNavItems = [
    { id: 'assignments' as ViewMode, label: 'Assignments', icon: FileCheck2, badge: 'Due' },
    { id: 'lectures' as ViewMode, label: 'Lectures', icon: GraduationCap },
    { id: 'question-bank' as ViewMode, label: 'Question Bank', icon: Database },
    { id: 'planner' as ViewMode, label: 'Study Planner', icon: Calendar },
    { id: 'progress' as ViewMode, label: 'My Progress', icon: LineChart },
    { id: 'constellation' as ViewMode, label: 'My Constellation', icon: Sparkles, star: true },
    { id: 'garden' as ViewMode, label: 'Secret Garden', icon: Flower2 }
  ];

  return (
    <>
      {/* ---------------- MORE DRAWER (BOTTOM SHEET) ---------------- */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-end bg-navy-950/80 backdrop-blur-md animate-fadeIn">
          {/* Backdrop Click */}
          <div className="flex-1" onClick={() => setIsMoreOpen(false)} />

          <div className="relative bg-gradient-to-b from-navy-900 to-navy-950 border-t border-lavender-500/30 rounded-t-3xl p-5 shadow-2xl animate-slideUp max-h-[85vh] overflow-y-auto">
            {/* Grab Bar */}
            <div className="w-12 h-1.5 bg-lavender-400/30 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-lavender-500/20">
              <div 
                onClick={() => {
                  setIsMoreOpen(false);
                  onOpenProfile();
                }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-lavender-600 to-rose-400 flex items-center justify-center text-lg shadow-md border border-lavender-300/40">
                  {currentUser?.avatar === 'cat-luna' ? '🐱' : '✨'}
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-cream-100 group-hover:text-moon-gold transition-colors">
                    {currentUser?.name || 'Scholar'}
                  </h4>
                  <p className="text-[11px] text-lavender-300">View Profile & Account Settings</p>
                </div>
              </div>

              <button
                onClick={() => setIsMoreOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-lavender-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* More Grid Items */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {moreNavItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`min-h-[48px] p-3 rounded-2xl flex items-center gap-3 text-left transition-all border ${
                      isActive
                        ? 'bg-lavender-600/30 border-lavender-400/50 text-white shadow-sm'
                        : 'bg-white/5 border-lavender-500/10 text-lavender-200 hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-moon-gold' : 'text-lavender-400'}`} />
                    <span className="text-xs font-medium truncate flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Midnight Focus Mode Mobile Button */}
            <button
              onClick={() => {
                setIsMoreOpen(false);
                onOpenFocusMode();
              }}
              className="w-full min-h-[48px] py-3 px-4 rounded-2xl bg-gradient-to-r from-midnight-900 to-indigo-950 border border-lavender-400/40 text-moon-gold font-serif text-xs font-bold flex items-center justify-center gap-2 shadow-lg mb-3"
            >
              <Moon className="w-4 h-4 text-moon-gold animate-pulse" />
              <span>Enter Midnight Focus Mode</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- FIXED BOTTOM NAVIGATION BAR ---------------- */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-gradient-to-t from-navy-950/98 via-navy-950/95 to-navy-900/90 backdrop-blur-lg border-t border-lavender-500/25 px-2 py-1 flex items-center justify-around safe-area-inset-bottom shadow-2xl">
        {/* 1. Home */}
        <button
          onClick={() => handleNavClick('home')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all ${
            currentView === 'home'
              ? 'text-moon-gold scale-105'
              : 'text-lavender-300 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* 2. Files */}
        <button
          onClick={() => handleNavClick('files')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all ${
            currentView === 'files'
              ? 'text-moon-gold scale-105'
              : 'text-lavender-300 hover:text-white'
          }`}
        >
          <FolderGit2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Files</span>
        </button>

        {/* 3. Notes */}
        <button
          onClick={() => handleNavClick('notes')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all ${
            currentView === 'notes'
              ? 'text-moon-gold scale-105'
              : 'text-lavender-300 hover:text-white'
          }`}
        >
          <BookMarked className="w-5 h-5" />
          <span className="text-[10px] font-medium">Notes</span>
        </button>

        {/* 4. Quizzes */}
        <button
          onClick={() => handleNavClick('quiz')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all ${
            currentView === 'quiz'
              ? 'text-moon-gold scale-105'
              : 'text-lavender-300 hover:text-white'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium">Quizzes</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => {
            sound.playChime();
            setIsMoreOpen(!isMoreOpen);
          }}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-2xl transition-all ${
            isMoreOpen || (currentView !== 'home' && currentView !== 'files' && currentView !== 'notes' && currentView !== 'quiz')
              ? 'text-lavender-200'
              : 'text-lavender-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <MoreHorizontal className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-moon-gold" />
          </div>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>
    </>
  );
};
