import React, { useState, useEffect } from 'react';
import { 
  UserStudyStats, 
  NoteItem, 
  QuestionItem, 
  AssignmentItem, 
  StudyPlanTask, 
  ViewMode, 
  CalendarEvent,
  YouTubeResource,
  ExamCountdownItem,
  SubjectItem
} from '../../types';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  BookOpen, 
  FileCheck2, 
  HelpCircle, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  Circle,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  Gamepad2,
  Calendar,
  GraduationCap,
  Video,
  Award,
  TrendingUp,
  GitBranch,
  Coffee,
  Heart,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { ShagunAnimeGirl } from '../Mascot/ShagunAnimeGirl';
import { DailyQuestSystem } from '../Quests/DailyQuestSystem';
import { VirtualStudyPet } from '../Pet/VirtualStudyPet';
import { InteractiveKnowledgeMap } from '../KnowledgeMap/InteractiveKnowledgeMap';
import { FocusScoreDashboard } from '../FocusScore/FocusScoreDashboard';
import { GraduationWallView } from '../Graduation/GraduationWallView';
import { sound } from '../../services/audio';

interface HomeViewProps {
  studentName?: string;
  stats: UserStudyStats;
  notes: NoteItem[];
  questions: QuestionItem[];
  assignments: AssignmentItem[];
  plannerTasks: StudyPlanTask[];
  calendarEvents?: CalendarEvent[];
  youtubeResources?: YouTubeResource[];
  examCountdowns?: ExamCountdownItem[];
  subjects?: SubjectItem[];
  onNavigate: (view: ViewMode, itemId?: string) => void;
  onOpenFocusMode: () => void;
  onToggleTask: (taskId: string) => Promise<void>;
  onOpenAiAssistant?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  studentName = 'Sagun Singh',
  stats,
  notes,
  questions,
  assignments,
  plannerTasks,
  calendarEvents = [],
  youtubeResources = [],
  examCountdowns = [],
  subjects = [],
  onNavigate,
  onOpenFocusMode,
  onToggleTask,
  onOpenAiAssistant
}) => {
  // Live Flip Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Study Streak booster state
  const [currentStreak, setCurrentStreak] = useState(stats.currentStreakDays || 5);
  const handleBoostStreak = (delta: number) => {
    sound.playSparkle();
    setCurrentStreak(prev => Math.max(0, prev + delta));
  };

  // Aesthetic Music Player State
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const playlist = [
    { title: 'Achilles Come Down', artist: 'Dark Academia Ambience', duration: '7:02', audioType: 'lofi-sparkles' as const },
    { title: 'Chopin - Nocturne in C Minor', artist: 'Soft Library Rain', duration: '3:45', audioType: 'night-breeze' as const },
    { title: 'Clair de Lune (Debussy)', artist: 'Moonlit Velvet Piano', duration: '4:18', audioType: 'lofi-sparkles' as const },
    { title: 'Deep Midnight Focus Beats', artist: 'Hades Study Lofi', duration: '2:24', audioType: 'night-breeze' as const }
  ];

  const handleTogglePlayMusic = () => {
    sound.playSparkle();
    const nextState = !isPlayingMusic;
    setIsPlayingMusic(nextState);
    if (nextState) {
      sound.startAmbient(playlist[currentTrackIndex].audioType);
    } else {
      sound.stopAmbient();
    }
  };

  const handleNextTrack = () => {
    sound.playSparkle();
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlayingMusic) {
      sound.startAmbient(playlist[nextIdx].audioType);
    }
  };

  // Quotes rotation
  const quotesList = [
    {
      quote: '"Philtatos," Achilles says. Sharply. Most beloved.',
      author: 'Madeline Miller, The Song of Achilles'
    },
    {
      quote: 'What gets measured gets managed. Efficiency is doing things right; effectiveness is doing the right things.',
      author: 'Peter F. Drucker, Management Pioneer'
    },
    {
      quote: 'Questions are places in your mind where answers fit. If you haven\'t asked the question, the answer has nowhere to go.',
      author: 'Clayton M. Christensen, The Innovator\'s Dilemma'
    },
    {
      quote: 'Dwell on the beauty of life. Watch the stars, and see yourself running with them.',
      author: 'Marcus Aurelius, Meditations'
    }
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  const handleNextQuote = () => {
    sound.playSparkle();
    setQuoteIndex(prev => (prev + 1) % quotesList.length);
  };

  // Custom to-do tasks
  const [customTasks, setCustomTasks] = useState([
    { id: 'c-1', text: 'my heart and other black holes (review notes)', done: true },
    { id: 'c-2', text: 'microeconomics elasticity derivation problem set', done: false },
    { id: 'c-3', text: 'draft PRD customer problem statements', done: false }
  ]);

  const handleToggleCustomTask = (id: string) => {
    sound.playSparkle();
    setCustomTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Term 2 Subjects Gallery Cards
  const gallerySubjects = [
    { id: 'microeconomics', code: '01', title: 'Microeconomics', desc: 'Supply & Demand, Elasticity, Game Theory', count: '14 Notes • 5 Files', cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
    { id: 'ui-ux', code: '02', title: 'Introduction to UI/UX', desc: 'Design Thinking, Nielsen Heuristics, Figma', count: '18 Notes • 8 Files', cover: 'https://images.unsplash.com/photo-1507842229450-79779f62a6b2?auto=format&fit=crop&w=600&q=80' },
    { id: 'leadership', code: '03', title: 'Leadership Accelerator', desc: 'Situational Leadership, EQ, Crucial Talks', count: '10 Notes • 4 Files', cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80' },
    { id: 'market-research', code: '04', title: 'Market Research Methods', desc: 'Primary vs Secondary, Surveys, Conjoint', count: '12 Notes • 6 Files', cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80' },
    { id: 'product-management', code: '05', title: 'Product Management', desc: 'PRD Structure, RICE Prioritization, JTBD', count: '22 Notes • 11 Files', cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80' },
    { id: 'cv-interview', code: '06', title: 'CV Interview Workshop', desc: 'STAR Framework, Behavioral Questions, Resumes', count: '8 Notes • 7 Files', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
    { id: 'entrepreneurship', code: '07', title: 'Entrepreneurial Mindset', desc: 'Lean Startup, Unit Economics, MVP Launch', count: '15 Notes • 6 Files', cover: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80' },
    { id: 'term-1-review', code: '08', title: 'Term 1 Mastered Review', desc: 'Design Thinking, Finance, Vibe Coding, Statistics', count: '9 Subjects Completed', cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80' },
    { id: 'terms-3-6', code: '09', title: 'Terms 3–6 Roadmaps', desc: 'Digital Analytics, Corporate Strategy, Capstone', count: 'Future Curriculum', cover: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80' }
  ];

  // Today's classes
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysOfWeek[currentTime.getDay()];
  const todaysClasses = calendarEvents.filter(e => e.dayOfWeek === todayName);

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-7xl mx-auto overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* 1. WIDE VINTAGE LIBRARY COVER BANNER                     */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-[#d4af37]/35 shadow-2xl bg-[#141210]">
        {/* Vintage Library Banner Image */}
        <div className="h-44 sm:h-56 md:h-64 w-full relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507842229450-79779f62a6b2?auto=format&fit=crop&w=1600&q=85"
            alt="Moonlit Library Vintage Panorama"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.72] contrast-[1.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121110] via-[#121110]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121110]/80 via-transparent to-[#121110]/80" />

          {/* Golden Ambient Candlelight Glow */}
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Banner Content & Notion Style Header */}
        <div className="p-5 sm:p-7 relative -mt-16 z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs sm:text-sm font-mono text-[#d4af37] tracking-widest flex items-center gap-2">
              <span>library ˚୨୧⋆｡˚ ⋆</span>
              <span>•</span>
              <span className="text-stone-400">Sagun Singh’s MBA Sanctuary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-[#f4ebe1] tracking-wide text-glow">
              Welcome to Moonlit Library
            </h1>
            <p className="text-xs sm:text-sm text-[#e8d8c8]/90 font-sans max-w-xl leading-relaxed">
              The candles are lit, the tea is warm, and vintage grimoires invite deep focus. What shall we master tonight?
            </p>
          </div>

          {/* Quick Sanctuary Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenFocusMode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#945c36] text-[#121110] font-serif font-bold text-xs shadow-lg shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Begin Midnight Focus</span>
            </button>
            <button
              onClick={() => onNavigate('arcade')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221e1a]/90 hover:bg-[#2b2520] border border-[#d4af37]/35 text-[#f4ebe1] text-xs font-serif font-bold transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Moonlight Arcade</span>
            </button>
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221e1a]/90 hover:bg-[#2b2520] border border-[#d4af37]/35 text-[#d4af37] text-xs font-serif font-bold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask Luna AI</span>
              </button>
            )}
          </div>
        </div>

        {/* Dark Academia Color Palette Swatch Tiles Bar (From Reference!) */}
        <div className="grid grid-cols-6 h-2 w-full border-t border-[#d4af37]/20">
          <div className="bg-[#2b1810]" title="#2b1810 Mahogany" />
          <div className="bg-[#4a2e1b]" title="#4a2e1b Chocolate" />
          <div className="bg-[#6b4226]" title="#6b4226 Saddle Brown" />
          <div className="bg-[#945c36]" title="#945c36 Warm Amber" />
          <div className="bg-[#c5a059]" title="#c5a059 Antique Gold" />
          <div className="bg-[#e8d8c8]" title="#e8d8c8 Vintage Parchment" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THREE-COLUMN DASHBOARD (Directly matching reference!)  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* ------------------------------------------------------ */}
        {/* COLUMN 1: Quote, Stickers, Retro Player & Checklist     */}
        {/* ------------------------------------------------------ */}
        <div className="space-y-6">
          {/* Literary / MBA Wisdom Quote Card */}
          <div className="p-5 rounded-3xl glass-panel border border-[#d4af37]/30 bg-[#161412]/80 space-y-3 relative group">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#d4af37]">
              <span>Wisdom Shelf ˚୨୧⋆｡˚</span>
              <button 
                onClick={handleNextQuote}
                className="hover:underline text-[10px] text-stone-400 hover:text-white"
              >
                Next Quote →
              </button>
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-[#f4ebe1] leading-relaxed">
              {quotesList[quoteIndex].quote}
            </p>
            <span className="text-[11px] font-mono text-[#c5a059] block text-right font-medium">
              — {quotesList[quoteIndex].author}
            </span>

            {/* Cute Food & Drink Stickers Row (From Reference!) */}
            <div className="pt-2 border-t border-[#d4af37]/15 flex items-center justify-around text-lg">
              <span title="Steaming Latte" className="hover:scale-125 transition-transform cursor-pointer">☕</span>
              <span title="Butter Croissant" className="hover:scale-125 transition-transform cursor-pointer">🥐</span>
              <span title="Pancake Stack" className="hover:scale-125 transition-transform cursor-pointer">🥞</span>
              <span title="Custard Pudding" className="hover:scale-125 transition-transform cursor-pointer">🍮</span>
              <span title="Matcha Dorayaki" className="hover:scale-125 transition-transform cursor-pointer">🍵</span>
            </div>
          </div>

          {/* Retro Cassette / Vintage Dark Academia Music Player (From Reference!) */}
          <div className="p-5 rounded-3xl glass-panel border border-[#d4af37]/35 bg-[#1a1714] space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-serif font-bold text-[#f4ebe1]">
              <div className="flex items-center gap-2">
                <span className="text-base">📻</span>
                <span>Dark Academia Cassette Player</span>
              </div>
              <span className="text-[10px] font-mono text-[#d4af37] px-2 py-0.5 rounded-full bg-[#2b221b] border border-[#d4af37]/30">
                {isPlayingMusic ? 'Now Playing' : 'Paused'}
              </span>
            </div>

            {/* Cassette Graphic with Spinning Wheels */}
            <div className="p-3.5 rounded-2xl bg-[#12100e] border border-[#d4af37]/30 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-[10px] font-mono text-[#c5a059] block uppercase truncate">
                  {playlist[currentTrackIndex].artist}
                </span>
                <p className="text-xs font-serif font-bold text-white truncate">
                  {playlist[currentTrackIndex].title}
                </p>
              </div>

              {/* Spinning Tape Wheels */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <div className={`w-6 h-6 rounded-full border-2 border-dashed border-[#d4af37] flex items-center justify-center ${isPlayingMusic ? 'retro-cassette-wheel' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                </div>
                <div className={`w-6 h-6 rounded-full border-2 border-dashed border-[#d4af37] flex items-center justify-center ${isPlayingMusic ? 'retro-cassette-wheel' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                </div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-stone-400">
                {playlist[currentTrackIndex].duration}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlayMusic}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#d4af37] to-[#945c36] text-[#121110] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  title={isPlayingMusic ? 'Pause Music' : 'Play Ambient Track'}
                >
                  {isPlayingMusic ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current translate-x-0.5" />}
                </button>
                <button
                  onClick={handleNextTrack}
                  className="p-2 rounded-xl bg-[#26201b] border border-[#d4af37]/25 text-stone-300 hover:text-white"
                  title="Next Track"
                >
                  <SkipForward size={14} />
                </button>
              </div>
            </div>

            {/* Playlist Tracklist Preview */}
            <div className="space-y-1 pt-1 text-[11px] font-mono text-stone-400 border-t border-[#d4af37]/15">
              {playlist.map((track, idx) => (
                <div 
                  key={track.title}
                  onClick={() => {
                    sound.playSparkle();
                    setCurrentTrackIndex(idx);
                    setIsPlayingMusic(true);
                    sound.startAmbient(track.audioType);
                  }}
                  className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                    idx === currentTrackIndex ? 'bg-[#2b221b] text-[#d4af37] font-bold' : 'hover:bg-[#221e1a]'
                  }`}
                >
                  <span className="truncate">{idx + 1}. {track.title}</span>
                  <span className="text-[10px] ml-2 flex-shrink-0">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aesthetic Checklist Widget (`books lent` / daily tasks from Reference!) */}
          <div className="p-5 rounded-3xl glass-panel border border-[#d4af37]/30 bg-[#161412]/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/15">
              <span className="text-xs font-serif font-bold text-[#f4ebe1]">
                books lent & tasks ༉‧₊˚
              </span>
              <span className="text-[10px] font-mono text-[#d4af37]">
                {customTasks.filter(t => t.done).length}/{customTasks.length} Done
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {customTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => handleToggleCustomTask(task.id)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    task.done
                      ? 'bg-[#1a1714]/50 border-stone-800 text-stone-500 line-through'
                      : 'bg-[#221e1a]/80 border-[#d4af37]/20 text-[#f4ebe1] hover:border-[#d4af37]/50'
                  }`}
                >
                  {task.done ? (
                    <CheckCircle2 size={14} className="text-[#d4af37] flex-shrink-0" />
                  ) : (
                    <Circle size={14} className="text-stone-500 flex-shrink-0" />
                  )}
                  <span className="truncate">{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* COLUMN 2: Shagun's Reading Nook & Retro Flip Clock      */}
        {/* ------------------------------------------------------ */}
        <div className="space-y-6">
          {/* Shagun Permanent Mascot Reading Card */}
          <div className="p-6 rounded-3xl glass-panel-glow border border-[#d4af37]/40 bg-[#181512] space-y-4 shadow-xl text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2a221b] border border-[#d4af37]/30 text-xs font-serif text-[#d4af37]">
              <span>☕</span>
              <span>Sanctuary Mascot & Companion</span>
            </div>

            {/* Permanent Mascot Shagun */}
            <div className="py-2 flex items-center justify-center">
              <ShagunAnimeGirl mood="reading" size="lg" showSpeech={true} />
            </div>
          </div>

          {/* Retro Flip Clock Widget (From Reference!) */}
          <div className="p-5 rounded-3xl glass-panel border border-[#d4af37]/30 bg-[#161412]/80 space-y-3 text-center">
            <span className="text-[11px] font-mono text-[#d4af37] block">
              -- check the time ༉‧₊˚ --
            </span>

            {/* Flip Clock Big Digits Display */}
            <div className="grid grid-cols-2 gap-3 max-w-[260px] mx-auto">
              <div className="p-4 rounded-2xl bg-[#26201a] border border-[#d4af37]/35 shadow-inner">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#f4ebe1] tracking-wider">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono text-stone-400 block mt-1 uppercase">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[1] || 'HR : MIN'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#26201a] border border-[#d4af37]/35 shadow-inner">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#d4af37] block">
                  {todayName.slice(0, 3).toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-stone-300 block mt-1">
                  {currentTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Mini Cake & Dessert Stickers Row (From Reference!) */}
            <div className="pt-2 border-t border-[#d4af37]/15 flex items-center justify-center gap-3 text-lg">
              <span title="Strawberry Cake">🍰</span>
              <span title="Caramel Pudding">🍮</span>
              <span title="Matcha Mochi">🍡</span>
              <span title="Warm Waffle">🧇</span>
            </div>
          </div>

          {/* Today's Classes & Timetable Preview */}
          <div className="p-5 rounded-3xl glass-panel border border-[#d4af37]/30 bg-[#161412]/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#d4af37]/15">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#d4af37]" />
                <h3 className="font-serif font-bold text-xs text-white">
                  Today's Classes ({todayName})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-[10px] text-[#d4af37] hover:underline"
              >
                Full Calendar →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {todaysClasses.length === 0 ? (
                <p className="text-[11px] text-stone-400 py-2 text-center italic">
                  No classes scheduled today. Perfect day for Midnight Focus!
                </p>
              ) : (
                todaysClasses.map(c => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-[#221e1a] border border-[#d4af37]/15 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[#d4af37] text-[10px]">{c.startTime} - {c.endTime}</span>
                      <p className="font-serif font-bold text-white text-xs">{c.title}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-600/30">
                      {c.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* COLUMN 3: Streak, Pet & 9-Readings Subject Gallery     */}
        {/* ------------------------------------------------------ */}
        <div className="space-y-6">
          {/* Study Streak Counter Box (From Reference!) */}
          <div className="p-5 rounded-3xl glass-panel border border-[#d4af37]/35 bg-[#1a1714] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#f4ebe1]">
                study streak ༉‧₊˚
              </span>
              {/* Cute Ramen & Dango Stickers from Reference! */}
              <div className="flex items-center gap-1.5 text-base">
                <span title="Ramen">🍜</span>
                <span title="Dango">🍡</span>
              </div>
            </div>

            {/* Streak Counter [ - ] [ Count ] [ + ] */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={() => handleBoostStreak(-1)}
                className="w-8 h-8 rounded-xl bg-[#2b221b] border border-[#d4af37]/30 text-[#d4af37] font-bold text-sm hover:bg-[#382b22] transition-colors"
                title="Decrease streak"
              >
                -
              </button>
              <div className="px-5 py-2 rounded-2xl bg-[#12100e] border-2 border-[#d4af37]/50 text-2xl font-mono font-bold text-amber-200 min-w-[70px] text-center shadow-inner">
                {currentStreak}
              </div>
              <button
                onClick={() => handleBoostStreak(1)}
                className="w-8 h-8 rounded-xl bg-[#2b221b] border border-[#d4af37]/30 text-[#d4af37] font-bold text-sm hover:bg-[#382b22] transition-colors"
                title="Boost streak"
              >
                +
              </button>
            </div>
            <p className="text-[10px] font-mono text-stone-400 text-center">
              Consecutive days deep learning in Moonlit Library
            </p>
          </div>

          {/* Virtual Study Pet Widget ("Mochi") */}
          <VirtualStudyPet compact={true} onFeed={() => sound.playCelestialChime()} />

          {/* Daily Quests Mini Preview */}
          <DailyQuestSystem compact={true} onNavigate={onNavigate} />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. 9—SUBJECTS / READINGS GALLERY (From Reference!)       */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl glass-panel border border-[#d4af37]/30 bg-[#161412]/80 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#d4af37]/15">
          <div>
            <div className="text-[11px] font-mono text-[#d4af37] tracking-wider">
              9—readings / subjects—༉
            </div>
            <h2 className="text-xl font-serif font-bold text-[#f4ebe1] mt-0.5">
              Term 2 Academic Subjects & Curricula Gallery
            </h2>
          </div>
          <button
            onClick={() => onNavigate('terms')}
            className="text-xs font-serif text-[#d4af37] hover:underline flex items-center gap-1"
          >
            <span>Explore All 6 Academic Terms</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* 9 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallerySubjects.map(sub => (
            <div
              key={sub.id}
              onClick={() => {
                sound.playSparkle();
                if (sub.id === 'term-1-review' || sub.id === 'terms-3-6') {
                  onNavigate('terms');
                } else {
                  onNavigate('knowledge-map', sub.id);
                }
              }}
              className="group p-3 rounded-2xl bg-[#1e1a16] border border-[#d4af37]/25 hover:border-[#d4af37]/60 cursor-pointer transition-all space-y-3 shadow-md hover:shadow-xl"
            >
              {/* Cover Image Thumbnail */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#12100e]">
                <img
                  src={sub.cover}
                  alt={sub.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#12100e]/80 border border-[#d4af37]/40 text-[10px] font-mono text-[#d4af37] font-bold">
                  /{sub.code}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-bold text-[#f4ebe1] group-hover:text-[#d4af37] transition-colors truncate">
                  {sub.title}
                </h3>
                <p className="text-[11px] text-stone-400 font-sans line-clamp-1">
                  {sub.desc}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#c5a059] pt-1">
                  <span>{sub.count}</span>
                  <span className="group-hover:translate-x-1 transition-transform">Study →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SANCTUARY SHORTCUTS ROW (5 New Features)              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => onNavigate('quests')}
          className="p-4 rounded-2xl glass-panel border border-[#d4af37]/30 bg-[#1a1714] hover:border-[#d4af37] cursor-pointer transition-all space-y-1 text-center group"
        >
          <Award className="w-5 h-5 mx-auto text-amber-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-white">Daily Quests</h4>
          <p className="text-[10px] text-stone-400">Earn XP & Missions</p>
        </div>

        <div
          onClick={() => onNavigate('pet')}
          className="p-4 rounded-2xl glass-panel border border-[#d4af37]/30 bg-[#1a1714] hover:border-[#d4af37] cursor-pointer transition-all space-y-1 text-center group"
        >
          <Heart className="w-5 h-5 mx-auto text-rose-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-white">Study Pet Mochi</h4>
          <p className="text-[10px] text-stone-400">Lv. 3 Scholar Cat</p>
        </div>

        <div
          onClick={() => onNavigate('knowledge-map')}
          className="p-4 rounded-2xl glass-panel border border-[#d4af37]/30 bg-[#1a1714] hover:border-[#d4af37] cursor-pointer transition-all space-y-1 text-center group"
        >
          <GitBranch className="w-5 h-5 mx-auto text-amber-300 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-white">Knowledge Map</h4>
          <p className="text-[10px] text-stone-400">Visual Concept Trees</p>
        </div>

        <div
          onClick={() => onNavigate('focus-score')}
          className="p-4 rounded-2xl glass-panel border border-[#d4af37]/30 bg-[#1a1714] hover:border-[#d4af37] cursor-pointer transition-all space-y-1 text-center group"
        >
          <TrendingUp className="w-5 h-5 mx-auto text-emerald-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-white">Focus Score</h4>
          <p className="text-[10px] text-stone-400">Productivity Matrix</p>
        </div>

        <div
          onClick={() => onNavigate('graduation-wall')}
          className="p-4 rounded-2xl glass-panel border border-[#d4af37]/30 bg-[#1a1714] hover:border-[#d4af37] cursor-pointer transition-all space-y-1 text-center group"
        >
          <GraduationCap className="w-5 h-5 mx-auto text-purple-400 group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-white">Graduation Wall</h4>
          <p className="text-[10px] text-stone-400">6-Term Degree Wall</p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. YOUTUBE MASTERCLASSES SHELF (Curated Lectures)        */}
      {/* ======================================================== */}
      {youtubeResources.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-[#d4af37]/30 bg-[#161412]/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video size={18} className="text-[#d4af37]" />
              <h3 className="font-serif font-bold text-base text-white">
                Curated YouTube Masterclasses
              </h3>
            </div>
            <button
              onClick={() => onNavigate('youtube')}
              className="text-xs text-[#d4af37] hover:underline"
            >
              Open YouTube Centre →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeResources.slice(0, 3).map(yt => (
              <div
                key={yt.id}
                onClick={() => onNavigate('youtube')}
                className="p-3 rounded-2xl bg-[#1e1a16] border border-[#d4af37]/15 hover:border-[#d4af37]/50 cursor-pointer group transition-all space-y-2"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#12100e]">
                  <img
                    src={`https://img.youtube.com/vi/${yt.videoId}/hqdefault.jpg`}
                    alt={yt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37] text-stone-950 flex items-center justify-center shadow-md">
                      <Play size={14} className="translate-x-0.5 fill-current" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#d4af37] uppercase">{yt.subjectName}</div>
                  <h4 className="text-xs font-serif font-bold text-white truncate group-hover:text-[#d4af37]">
                    {yt.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
