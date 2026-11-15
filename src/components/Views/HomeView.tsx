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
      {/* 1. WIDE DREAMY PINTEREST LIBRARY COVER BANNER            */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden border border-[#C7B6E8]/35 shadow-2xl bg-[#20162B]">
        {/* Dreamy Library Banner Image (Compact & Balanced Height) */}
        <div className="h-32 sm:h-36 md:h-40 w-full relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507842229450-79779f62a6b2?auto=format&fit=crop&w=1600&q=85"
            alt="Moonlit Library Vintage Panorama"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.78] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#20162B] via-[#20162B]/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#20162B]/85 via-transparent to-[#20162B]/70" />

          {/* Dreamy Ambient Moonlight & Lilac Glow */}
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#C7B6E8]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-[#F3D8E5]/12 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Banner Content & Balanced Vertical Alignment */}
        <div className="p-5 sm:p-6 relative -mt-8 sm:-mt-10 z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-mono text-[#F3D8E5] tracking-widest flex items-center gap-2">
              <span>library ˚୨୧⋆｡˚ ⋆ 🌸</span>
              <span>•</span>
              <span className="text-[#E8DDF8] font-sans font-medium">🌙 Sagun Singh’s Dreamy Study Sanctuary ✨</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#FFF7ED] tracking-wide text-glow leading-tight">
              Welcome to Moonlit Library
            </h1>
            <p className="text-xs sm:text-sm text-[#E8DDF8] font-sans max-w-xl leading-relaxed mt-0.5 font-normal">
              The candles are lit, the tea is warm, and a tranquil twilight sanctuary invites deep focus. What shall we master tonight?
            </p>
          </div>

          {/* Quick Sanctuary Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenFocusMode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#F3D8E5] via-[#C7B6E8] to-[#C99B9B] text-[#241530] font-serif font-bold text-xs shadow-md shadow-[#C7B6E8]/25 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Begin Midnight Focus</span>
            </button>
            <button
              onClick={() => onNavigate('arcade')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#241A30]/90 hover:bg-[#30243D] border border-[#C7B6E8]/35 text-[#FFF7ED] text-xs font-serif font-semibold transition-all hover:scale-[1.03]"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#C7B6E8]" />
              <span>Moonlight Arcade</span>
            </button>
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#241A30]/90 hover:bg-[#30243D] border border-[#F3D8E5]/40 text-[#F3D8E5] text-xs font-serif font-semibold transition-all hover:scale-[1.03]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F3D8E5]" />
                <span>Ask Luna AI</span>
              </button>
            )}
          </div>
        </div>

        {/* Pinterest Dreamy Aesthetic Color Palette Swatch Bar */}
        <div className="grid grid-cols-6 h-1.5 w-full border-t border-[#C7B6E8]/20">
          <div className="bg-[#C7B6E8]" title="#C7B6E8 Dusty Lavender" />
          <div className="bg-[#F3D8E5]" title="#F3D8E5 Pastel Pink" />
          <div className="bg-[#E8DDF8]" title="#E8DDF8 Soft Lilac" />
          <div className="bg-[#FFF7ED]" title="#FFF7ED Cream" />
          <div className="bg-[#30243D]" title="#30243D Deep Plum" />
          <div className="bg-[#C99B9B]" title="#C99B9B Muted Rose Gold" />
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
          <div className="p-5 rounded-3xl glass-panel border border-[#C7B6E8]/25 bg-[#30243D]/75 space-y-3 relative group shadow-md">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#E8DDF8] font-medium">
              <span>Wisdom Shelf ˚୨୧⋆｡˚ 🌸</span>
              <button 
                onClick={handleNextQuote}
                className="hover:underline text-[10px] text-[#F3D8E5] hover:text-[#FFF7ED]"
              >
                Next Quote →
              </button>
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-[#FFF7ED] leading-relaxed">
              {quotesList[quoteIndex].quote}
            </p>
            <span className="text-[11px] font-mono text-[#F3D8E5] block text-right font-medium">
              — {quotesList[quoteIndex].author}
            </span>

            {/* Cute Food & Drink Stickers Row */}
            <div className="pt-2 border-t border-[#C7B6E8]/15 flex items-center justify-around text-lg">
              <span title="Steaming Latte" className="hover:scale-125 transition-transform cursor-pointer">☕</span>
              <span title="Butter Croissant" className="hover:scale-125 transition-transform cursor-pointer">🥐</span>
              <span title="Pancake Stack" className="hover:scale-125 transition-transform cursor-pointer">🥞</span>
              <span title="Custard Pudding" className="hover:scale-125 transition-transform cursor-pointer">🍮</span>
              <span title="Matcha Dorayaki" className="hover:scale-125 transition-transform cursor-pointer">🍵</span>
            </div>
          </div>

          {/* Retro Cassette / Dreamy Sanctuary Music Player */}
          <div className="p-5 rounded-3xl glass-panel border border-[#C99B9B]/35 bg-[#30243D]/80 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-serif font-bold text-[#FFF7ED]">
              <div className="flex items-center gap-2">
                <span className="text-base">📻</span>
                <span>Dreamy Study Sanctuary Player ✨</span>
              </div>
              <span className="text-[10px] font-mono text-[#F3D8E5] px-2.5 py-0.5 rounded-full bg-[#1E1528] border border-[#C7B6E8]/35 font-medium">
                {isPlayingMusic ? 'Now Playing' : 'Paused'}
              </span>
            </div>

            {/* Cassette Graphic with Spinning Wheels */}
            <div className="p-3.5 rounded-2xl bg-[#1E1528] border border-[#C7B6E8]/30 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-0.5 min-w-0 flex-1">
                <span className="text-[10px] font-mono text-[#F3D8E5] block uppercase truncate font-medium">
                  {playlist[currentTrackIndex].artist}
                </span>
                <p className="text-xs font-serif font-bold text-[#FFF7ED] truncate">
                  {playlist[currentTrackIndex].title}
                </p>
              </div>

              {/* Spinning Tape Wheels */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <div className={`w-6 h-6 rounded-full border-2 border-dashed border-[#C99B9B] flex items-center justify-center ${isPlayingMusic ? 'retro-cassette-wheel' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F3D8E5]" />
                </div>
                <div className={`w-6 h-6 rounded-full border-2 border-dashed border-[#C99B9B] flex items-center justify-center ${isPlayingMusic ? 'retro-cassette-wheel' : ''}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F3D8E5]" />
                </div>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-[#E8DDF8]">
                {playlist[currentTrackIndex].duration}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlayMusic}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-[#F3D8E5] via-[#C7B6E8] to-[#C99B9B] text-[#241530] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                  title={isPlayingMusic ? 'Pause Music' : 'Play Ambient Track'}
                >
                  {isPlayingMusic ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current translate-x-0.5" />}
                </button>
                <button
                  onClick={handleNextTrack}
                  className="p-2 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/25 text-[#E8DDF8] hover:text-[#FFF7ED] transition-colors"
                  title="Next Track"
                >
                  <SkipForward size={14} />
                </button>
              </div>
            </div>

            {/* Playlist Tracklist Preview */}
            <div className="space-y-1 pt-1 text-[11px] font-mono text-[#E8DDF8]/90 border-t border-[#C7B6E8]/15">
              {playlist.map((track, idx) => (
                <div 
                  key={track.title}
                  onClick={() => {
                    sound.playSparkle();
                    setCurrentTrackIndex(idx);
                    setIsPlayingMusic(true);
                    sound.startAmbient(track.audioType);
                  }}
                  className={`flex items-center justify-between p-1.5 rounded-xl cursor-pointer transition-colors ${
                    idx === currentTrackIndex ? 'bg-[#3D2E4E] text-[#F3D8E5] font-bold' : 'hover:bg-[#1E1528]'
                  }`}
                >
                  <span className="truncate">{idx + 1}. {track.title}</span>
                  <span className="text-[10px] ml-2 flex-shrink-0 text-[#E8DDF8]">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Aesthetic Checklist Widget (`books lent` / daily tasks) */}
          <div className="p-5 rounded-3xl glass-panel border border-[#C7B6E8]/25 bg-[#30243D]/75 space-y-3 shadow-md">
            <div className="flex items-center justify-between pb-2 border-b border-[#C7B6E8]/15">
              <span 
                onClick={() => onNavigate('planner')}
                className="text-xs font-serif font-bold text-[#FFF7ED] hover:text-[#F3D8E5] cursor-pointer flex items-center gap-1.5 transition-colors"
                title="Open Study Planner"
              >
                books lent & study tasks ˚୨୧⋆｡˚ 🌸
              </span>
              <button
                onClick={() => onNavigate('planner')}
                className="text-[10px] font-mono text-[#F3D8E5] hover:text-[#FFF7ED] hover:underline font-medium"
              >
                {plannerTasks && plannerTasks.length > 0
                  ? `${plannerTasks.filter(t => t.completed).length}/${plannerTasks.length} Done`
                  : `${customTasks.filter(t => t.done).length}/${customTasks.length} Done`}
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {plannerTasks && plannerTasks.length > 0 ? (
                plannerTasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    onClick={async () => {
                      sound.playSparkle();
                      await onToggleTask(task.id);
                    }}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                      task.completed
                        ? 'bg-[#1E1528]/60 border-[#30243D] text-[#C7B6E8]/70 line-through'
                        : 'bg-[#1E1528] border-[#C7B6E8]/25 text-[#FFF7ED] hover:border-[#C7B6E8]/50 hover:bg-[#30243D]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {task.completed ? (
                        <CheckCircle2 size={14} className="text-[#F3D8E5] flex-shrink-0" />
                      ) : (
                        <Circle size={14} className="text-[#C7B6E8] flex-shrink-0" />
                      )}
                      <span className="truncate">{task.title}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#F3D8E5] flex-shrink-0 font-medium">{task.day}</span>
                  </div>
                ))
              ) : (
                customTasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleCustomTask(task.id)}
                    className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                      task.done
                        ? 'bg-[#1E1528]/60 border-[#30243D] text-[#C7B6E8]/70 line-through'
                        : 'bg-[#1E1528] border-[#C7B6E8]/25 text-[#FFF7ED] hover:border-[#C7B6E8]/50 hover:bg-[#30243D]'
                    }`}
                  >
                    {task.done ? (
                      <CheckCircle2 size={14} className="text-[#F3D8E5] flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-[#C7B6E8] flex-shrink-0" />
                    )}
                    <span className="truncate">{task.text}</span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-1 text-center">
              <button
                onClick={() => onNavigate('planner')}
                className="text-[10px] text-[#F3D8E5] hover:text-[#FFF7ED] hover:underline font-serif inline-flex items-center gap-1 transition-colors font-medium"
              >
                <span>Open Full Study Planner</span>
                <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------ */}
        {/* COLUMN 2: Shagun's Reading Nook & Retro Flip Clock      */}
        {/* ------------------------------------------------------ */}
        <div className="space-y-6">
          {/* Shagun Permanent Mascot Reading Card */}
          <div className="p-6 rounded-3xl glass-panel-glow border border-[#C99B9B]/40 bg-[#241A30]/85 space-y-4 shadow-xl text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#30243D] border border-[#C7B6E8]/30 text-xs font-serif text-[#F3D8E5]">
              <span>☕</span>
              <span>Sanctuary Mascot & Companion</span>
            </div>

            {/* Permanent Mascot Shagun */}
            <div className="py-2 flex items-center justify-center">
              <ShagunAnimeGirl mood="reading" size="lg" showSpeech={true} />
            </div>
          </div>

          {/* Retro Flip Clock Widget (From Reference!) */}
          <div className="p-5 rounded-3xl glass-panel border border-[#C7B6E8]/25 bg-[#241A30]/80 space-y-3 text-center">
            <span className="text-[11px] font-mono text-[#E8DDF8] font-medium flex items-center justify-center gap-1.5">
              <span>🌙</span>
              <span>-- check the time ˚୨୧⋆｡˚ --</span>
              <span>🌸</span>
            </span>

            {/* Flip Clock Big Digits Display */}
            <div className="grid grid-cols-2 gap-3 max-w-[260px] mx-auto">
              <div className="p-4 rounded-2xl bg-[#1E1528] border border-[#C99B9B]/40 shadow-inner">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#FFF7ED] tracking-wider">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono text-[#E8DDF8] block mt-1 uppercase font-medium">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).split(' ')[1] || 'HR : MIN'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#1E1528] border border-[#C99B9B]/40 shadow-inner">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#F3D8E5] block">
                  {todayName.slice(0, 3).toUpperCase()}
                </span>
                <span className="text-[10px] font-mono text-[#E8DDF8] block mt-1 font-medium">
                  {currentTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Mini Cake & Dessert Stickers Row (From Reference!) */}
            <div className="pt-2 border-t border-[#C7B6E8]/15 flex items-center justify-center gap-3 text-lg">
              <span title="Strawberry Cake">🍰</span>
              <span title="Caramel Pudding">🍮</span>
              <span title="Matcha Mochi">🍡</span>
              <span title="Warm Waffle">🧇</span>
              <span title="Sakura Blossom">🌸</span>
            </div>
          </div>

          {/* Today's Classes & Timetable Preview */}
          <div className="p-5 rounded-3xl glass-panel border border-[#C7B6E8]/25 bg-[#241A30]/80 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#C7B6E8]/15">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#C7B6E8]" />
                <h3 className="font-serif font-bold text-xs text-[#FFF7ED]">
                  Today's Classes ({todayName}) 🌸
                </h3>
              </div>
              <button
                onClick={() => onNavigate('calendar')}
                className="text-[10px] text-[#F3D8E5] hover:text-[#FFF7ED] hover:underline font-medium"
              >
                Full Calendar →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {todaysClasses.length === 0 ? (
                <p className="text-[11px] text-[#E8DDF8]/90 py-2 text-center italic font-serif">
                  No classes scheduled today. Perfect day for Midnight Focus! ✨
                </p>
              ) : (
                todaysClasses.map(c => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/20 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[#F3D8E5] text-[10px] font-medium">{c.startTime} - {c.endTime}</span>
                      <p className="font-serif font-bold text-[#FFF7ED] text-xs">{c.title}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#30243D] text-[#F3D8E5] border border-[#C99B9B]/30 font-medium">
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
          <div className="p-5 rounded-3xl glass-panel border border-[#C99B9B]/35 bg-[#241A30]/85 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#FFF7ED]">
                study streak ˚୨୧⋆｡˚ 🌸
              </span>
              {/* Cute Ramen & Dango Stickers from Reference! */}
              <div className="flex items-center gap-1.5 text-base">
                <span title="Ramen">🍜</span>
                <span title="Dango">🍡</span>
                <span title="Sparkle">✨</span>
              </div>
            </div>

            {/* Streak Counter [ - ] [ Count ] [ + ] */}
            <div className="flex items-center justify-center gap-4 py-2">
              <button
                onClick={() => handleBoostStreak(-1)}
                className="w-8 h-8 rounded-xl bg-[#30243D] border border-[#C7B6E8]/30 text-[#F3D8E5] font-bold text-sm hover:bg-[#3D2C4E] hover:text-[#FFF7ED] transition-colors"
                title="Decrease streak"
              >
                -
              </button>
              <div className="px-5 py-2 rounded-2xl bg-[#1E1528] border-2 border-[#C99B9B]/50 text-2xl font-mono font-bold text-[#F3D8E5] min-w-[70px] text-center shadow-inner">
                {currentStreak}
              </div>
              <button
                onClick={() => handleBoostStreak(1)}
                className="w-8 h-8 rounded-xl bg-[#30243D] border border-[#C7B6E8]/30 text-[#F3D8E5] font-bold text-sm hover:bg-[#3D2C4E] hover:text-[#FFF7ED] transition-colors"
                title="Boost streak"
              >
                +
              </button>
            </div>
            <p className="text-[10px] font-mono text-[#E8DDF8] text-center font-medium">
              Consecutive days deep learning in Moonlit Library ✨
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
      <div className="p-6 rounded-3xl glass-panel border border-[#C7B6E8]/25 bg-[#241A30]/80 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#C7B6E8]/15">
          <div>
            <div className="text-[11px] font-mono text-[#F3D8E5] tracking-wider font-medium flex items-center gap-1.5">
              <span>9—readings / subjects ˚୨୧⋆｡˚ 🌸</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#FFF7ED] mt-0.5">
              Term 2 Academic Subjects & Curricula Gallery ✨
            </h2>
          </div>
          <button
            onClick={() => onNavigate('terms')}
            className="text-xs font-serif text-[#F3D8E5] hover:text-[#FFF7ED] hover:underline flex items-center gap-1 font-medium"
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
              className="group p-3 rounded-2xl bg-[#1E1528] border border-[#C7B6E8]/20 hover:border-[#C99B9B]/60 hover:bg-[#30243D]/50 cursor-pointer transition-all space-y-3 shadow-md hover:shadow-xl"
            >
              {/* Cover Image Thumbnail */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#1E1528]">
                <img
                  src={sub.cover}
                  alt={sub.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#241A30]/90 border border-[#C99B9B]/40 text-[10px] font-mono text-[#F3D8E5] font-bold">
                  /{sub.code}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-sm font-serif font-bold text-[#FFF7ED] group-hover:text-[#F3D8E5] transition-colors truncate">
                  {sub.title}
                </h3>
                <p className="text-[11px] text-[#E8DDF8] font-sans line-clamp-1 font-normal">
                  {sub.desc}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#C7B6E8] pt-1 font-medium">
                  <span>{sub.count}</span>
                  <span className="group-hover:translate-x-1 transition-transform text-[#F3D8E5] font-semibold">Study →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SANCTUARY SHORTCUTS ROW (5 Features)                  */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => onNavigate('quests')}
          className="p-4 rounded-2xl glass-panel border border-[#C7B6E8]/20 bg-[#241A30]/80 hover:border-[#C99B9B]/60 hover:bg-[#30243D] cursor-pointer transition-all space-y-1 text-center group shadow-sm hover:shadow-md"
        >
          <Award className="w-5 h-5 mx-auto text-[#F3D8E5] group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-[#FFF7ED]">Daily Quests</h4>
          <p className="text-[10px] text-[#E8DDF8] font-medium">Earn XP & Missions</p>
        </div>

        <div
          onClick={() => onNavigate('pet')}
          className="p-4 rounded-2xl glass-panel border border-[#C7B6E8]/20 bg-[#241A30]/80 hover:border-[#C99B9B]/60 hover:bg-[#30243D] cursor-pointer transition-all space-y-1 text-center group shadow-sm hover:shadow-md"
        >
          <Heart className="w-5 h-5 mx-auto text-[#C99B9B] group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-[#FFF7ED]">Study Pet Mochi</h4>
          <p className="text-[10px] text-[#E8DDF8] font-medium">Lv. 3 Scholar Cat</p>
        </div>

        <div
          onClick={() => onNavigate('knowledge-map')}
          className="p-4 rounded-2xl glass-panel border border-[#C7B6E8]/20 bg-[#241A30]/80 hover:border-[#C99B9B]/60 hover:bg-[#30243D] cursor-pointer transition-all space-y-1 text-center group shadow-sm hover:shadow-md"
        >
          <GitBranch className="w-5 h-5 mx-auto text-[#C7B6E8] group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-[#FFF7ED]">Knowledge Map</h4>
          <p className="text-[10px] text-[#E8DDF8] font-medium">Visual Concept Trees</p>
        </div>

        <div
          onClick={() => onNavigate('focus-score')}
          className="p-4 rounded-2xl glass-panel border border-[#C7B6E8]/20 bg-[#241A30]/80 hover:border-[#C99B9B]/60 hover:bg-[#30243D] cursor-pointer transition-all space-y-1 text-center group shadow-sm hover:shadow-md"
        >
          <TrendingUp className="w-5 h-5 mx-auto text-[#E8DDF8] group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-[#FFF7ED]">Focus Score</h4>
          <p className="text-[10px] text-[#E8DDF8] font-medium">Productivity Matrix</p>
        </div>

        <div
          onClick={() => onNavigate('graduation-wall')}
          className="p-4 rounded-2xl glass-panel border border-[#C7B6E8]/20 bg-[#241A30]/80 hover:border-[#C99B9B]/60 hover:bg-[#30243D] cursor-pointer transition-all space-y-1 text-center group shadow-sm hover:shadow-md"
        >
          <GraduationCap className="w-5 h-5 mx-auto text-[#F3D8E5] group-hover:scale-110 transition-transform" />
          <h4 className="text-xs font-serif font-bold text-[#FFF7ED]">Graduation Wall</h4>
          <p className="text-[10px] text-[#E8DDF8] font-medium">6-Term Degree Wall</p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. YOUTUBE MASTERCLASSES SHELF (Curated Lectures)        */}
      {/* ======================================================== */}
      {youtubeResources.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-[#C7B6E8]/25 bg-[#241A30]/80 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video size={18} className="text-[#C7B6E8]" />
              <h3 className="font-serif font-bold text-base text-[#FFF7ED]">
                Curated YouTube Masterclasses 🌸
              </h3>
            </div>
            <button
              onClick={() => onNavigate('youtube')}
              className="text-xs text-[#F3D8E5] hover:text-[#FFF7ED] hover:underline font-medium"
            >
              Open YouTube Centre →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeResources.slice(0, 3).map(yt => (
              <div
                key={yt.id}
                onClick={() => onNavigate('youtube')}
                className="p-3 rounded-2xl bg-[#1E1528] border border-[#C7B6E8]/15 hover:border-[#C99B9B]/50 hover:bg-[#30243D]/50 cursor-pointer group transition-all space-y-2 shadow-sm hover:shadow-md"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1E1528]">
                  <img
                    src={`https://img.youtube.com/vi/${yt.videoId}/hqdefault.jpg`}
                    alt={yt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7B6E8] to-[#F3D8E5] text-[#241530] flex items-center justify-center shadow-md">
                      <Play size={14} className="translate-x-0.5 fill-current" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#F3D8E5] uppercase font-semibold">{yt.subjectName}</div>
                  <h4 className="text-xs font-serif font-bold text-[#FFF7ED] truncate group-hover:text-[#F3D8E5]">
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
