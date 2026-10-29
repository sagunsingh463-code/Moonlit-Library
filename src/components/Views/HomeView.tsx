import React from 'react';
import { 
  UserStudyStats, 
  NoteItem, 
  QuestionItem, 
  AssignmentItem, 
  StudyPlanTask, 
  ViewMode, 
  MoonPhaseType 
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
  Play
} from 'lucide-react';
import { MoonCat } from '../Mascot/MoonCat';
import { sound } from '../../services/audio';

interface HomeViewProps {
  studentName?: string;
  stats: UserStudyStats;
  notes: NoteItem[];
  questions: QuestionItem[];
  assignments: AssignmentItem[];
  plannerTasks: StudyPlanTask[];
  onNavigate: (view: ViewMode, itemId?: string) => void;
  onOpenFocusMode: () => void;
  onToggleTask: (taskId: string) => Promise<void>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  studentName = 'Seraphina',
  stats,
  notes,
  questions,
  assignments,
  plannerTasks,
  onNavigate,
  onOpenFocusMode,
  onToggleTask
}) => {
  // Memory shelf items: Notes needing revision + Bookmarked questions
  const revisionNotes = notes.filter(n => n.needsRevision || n.isBookmarked).slice(0, 3);
  const bookmarkedQuestions = questions.filter(q => q.isBookmarked).slice(0, 3);
  const upcomingAssignments = assignments.filter(a => a.status !== 'submitted' && a.status !== 'graded').slice(0, 3);
  const todaysTasks = plannerTasks.slice(0, 4);

  const moonPhaseSymbols: Record<MoonPhaseType, string> = {
    'new-moon': '🌑',
    'waxing-crescent': '🌒',
    'first-quarter': '🌓',
    'waxing-gibbous': '🌔',
    'full-moon': '🌕',
    'waning-gibbous': '🌖',
    'last-quarter': '🌗',
    'waning-crescent': '🌘',
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      {/* Welcome Banner with Moon Cat Companion */}
      <div className="relative rounded-3xl glass-panel-glow border border-lavender-400/30 p-5 sm:p-6 md:p-8 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Soft background glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-lavender-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-900/80 border border-stargold-400/30 text-xs font-serif text-stargold-200 mb-3">
            <span>✨ Sanctuary is Open</span>
            <span>•</span>
            <span>Personal Universe</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-serif font-bold text-white tracking-wide text-glow mb-2">
            Welcome back, {studentName} 🌙
          </h1>
          <p className="text-xs md:text-sm text-lavender-200/90 font-sans leading-relaxed">
            The candles are lit, the tea is warm, and a tranquil night sky invites deep learning. What shall we master tonight?
          </p>


          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mt-5 justify-center md:justify-start">
            <button
              onClick={onOpenFocusMode}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Begin Midnight Focus</span>
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-lavender-200 hover:text-white hover:border-lavender-400/40 text-xs font-medium transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-lavender-300" />
              <span>Quick Quiz Session</span>
            </button>
            <button
              onClick={() => onNavigate('notes')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-panel text-lavender-200 hover:text-white hover:border-lavender-400/40 text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-rosemoon-300" />
              <span>New Study Note</span>
            </button>
          </div>
        </div>

        {/* Mascot in studying / encouraging mood */}
        <div className="relative z-10 flex-shrink-0">
          <MoonCat 
            mood="studying" 
            size="lg" 
            showSpeech={true}
          />
        </div>
      </div>

      {/* Key Real Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Study Time */}
        <div className="p-4 rounded-2xl glass-panel-subtle border border-lavender-400/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-lavender-600/20 text-lavender-300 border border-lavender-400/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-lavender-300/80 font-sans uppercase">Study Time</p>
            <p className="text-lg md:text-xl font-serif font-bold text-white">
              {Math.floor(stats.totalStudyMinutes / 60)}h {stats.totalStudyMinutes % 60}m
            </p>
          </div>
        </div>

        {/* Stars in Sky */}
        <div 
          onClick={() => onNavigate('constellation')}
          className="p-4 rounded-2xl glass-panel-subtle border border-lavender-400/20 flex items-center gap-3.5 cursor-pointer hover:border-stargold-400/50 transition-colors"
        >
          <div className="p-3 rounded-xl bg-stargold-500/20 text-stargold-300 border border-stargold-400/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-lavender-300/80 font-sans uppercase">Constellation</p>
            <p className="text-lg md:text-xl font-serif font-bold text-stargold-100">
              {stats.starsCollected} Stars
            </p>
          </div>
        </div>

        {/* Quiz Accuracy */}
        <div 
          onClick={() => onNavigate('quiz')}
          className="p-4 rounded-2xl glass-panel-subtle border border-lavender-400/20 flex items-center gap-3.5 cursor-pointer hover:border-lavender-400/50 transition-colors"
        >
          <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-400/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-lavender-300/80 font-sans uppercase">Quiz Mastery</p>
            <p className="text-lg md:text-xl font-serif font-bold text-white">
              {stats.quizAverageScore}% Accuracy
            </p>
          </div>
        </div>

        {/* Study Streak */}
        <div className="p-4 rounded-2xl glass-panel-subtle border border-lavender-400/20 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rosemoon-500/20 text-rosemoon-300 border border-rosemoon-400/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-lavender-300/80 font-sans uppercase">Current Streak</p>
            <p className="text-lg md:text-xl font-serif font-bold text-rosemoon-200">
              {stats.currentStreakDays} Days Flow
            </p>
          </div>
        </div>
      </div>

      {/* Signature Feature: Moon Phases Weekly Study Consistency Bar */}
      <div className="p-5 rounded-3xl glass-panel-subtle border border-lavender-400/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌙</span>
            <h3 className="font-serif font-bold text-sm md:text-base text-white">
              Weekly Moon Phases Consistency
            </h3>
          </div>
          <span className="text-xs text-lavender-300/80 font-mono">
            {stats.weeklyLogs.length} Days Tracked
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-3 text-center">
          {stats.weeklyLogs.map((dayLog, i) => {
            const symbol = moonPhaseSymbols[dayLog.phase] || '🌖';
            return (
              <div 
                key={i} 
                className="p-3 rounded-2xl bg-midnight-900/60 border border-lavender-400/15 flex flex-col items-center gap-1.5 hover:border-stargold-400/40 transition-colors"
              >
                <span className="text-xs font-mono text-lavender-300">{dayLog.dayName}</span>
                <span className="text-2xl filter drop-shadow-sm">{symbol}</span>
                <span className="text-[11px] font-semibold text-white">{dayLog.minutes}m</span>
                <span className="text-[9px] text-lavender-400">{dayLog.tasksCount} tasks</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Split Grid: Memory Shelf & Today's Study Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Signature Feature: Memory Shelf */}
        <div className="p-6 rounded-3xl glass-panel-subtle border border-lavender-400/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-lavender-400/15 mb-4">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-stargold-300" />
                <h3 className="font-serif font-bold text-base text-white">
                  Memory Shelf
                </h3>
              </div>
              <span className="text-[11px] text-lavender-300/70 font-sans">
                Spaced Revision & Saved Wisdom
              </span>
            </div>

            {/* Revision Notes List */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-semibold text-lavender-300 tracking-wider">
                Topics Needing Active Recall
              </span>

              {revisionNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => onNavigate('notes', note.id)}
                  className="p-3 rounded-2xl bg-midnight-900/60 hover:bg-lavender-600/20 border border-lavender-400/20 hover:border-stargold-400/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Bookmark className="w-4 h-4 text-stargold-300 fill-stargold-400/40 flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-medium text-white truncate">{note.title}</p>
                      <p className="text-[10px] text-lavender-300/80">{note.subject}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-lavender-400 flex-shrink-0 ml-2" />
                </div>
              ))}

              <span className="text-[10px] uppercase font-semibold text-rosemoon-300 tracking-wider block pt-2">
                Bookmarked Exam Questions
              </span>

              {bookmarkedQuestions.map(q => (
                <div
                  key={q.id}
                  onClick={() => onNavigate('question-bank', q.id)}
                  className="p-3 rounded-2xl bg-midnight-900/60 hover:bg-rosemoon-500/20 border border-lavender-400/20 hover:border-rosemoon-400/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <HelpCircle className="w-4 h-4 text-rosemoon-300 flex-shrink-0" />
                    <p className="text-xs font-medium text-lavender-100 truncate">{q.question}</p>
                  </div>
                  <span className="text-[10px] text-rosemoon-200 px-2 py-0.5 rounded-full bg-rosemoon-500/20 border border-rosemoon-400/30 flex-shrink-0 ml-2">
                    {q.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('notes')}
            className="mt-4 text-xs font-serif text-stargold-300 hover:text-stargold-100 flex items-center gap-1.5 transition-colors"
          >
            <span>View All Notes & Grimoires</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Today's Goals & Urgent Assignments */}
        <div className="p-6 rounded-3xl glass-panel-subtle border border-lavender-400/25 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-lavender-400/15 mb-4">
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="w-5 h-5 text-rosemoon-300" />
                <h3 className="font-serif font-bold text-base text-white">
                  Today's Study Checklist
                </h3>
              </div>
              <button
                onClick={() => onNavigate('planner')}
                className="text-xs text-lavender-300 hover:text-white transition-colors"
              >
                Open Planner
              </button>
            </div>

            {/* Checklist Tasks */}
            <div className="space-y-2.5">
              {todaysTasks.map(task => (
                <div
                  key={task.id}
                  onClick={async () => {
                    sound.playSparkle();
                    await onToggleTask(task.id);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed
                      ? 'bg-midnight-950/40 border-lavender-400/10 text-lavender-400/60 line-through'
                      : 'bg-midnight-900/60 border-lavender-400/20 hover:border-stargold-300 text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-stargold-300 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-lavender-400 flex-shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="text-xs font-medium truncate">{task.title}</p>
                      <p className="text-[10px] text-lavender-400">{task.subject} • {task.timeSlot}</p>
                    </div>
                  </div>
                  {task.isExamPrep && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-stargold-400/20 text-stargold-300 border border-stargold-400/30 flex-shrink-0 ml-2">
                      Exam Prep
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Upcoming High Priority Assignment Reminder */}
            {upcomingAssignments.length > 0 && (
              <div className="mt-5 p-3.5 rounded-2xl bg-rosemoon-900/20 border border-rosemoon-400/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-rosemoon-300">
                    Approaching Deadline
                  </span>
                  <p className="text-xs font-serif font-bold text-white mt-0.5">
                    {upcomingAssignments[0].title}
                  </p>
                  <p className="text-[10px] text-lavender-300">
                    Due {new Date(upcomingAssignments[0].dueDate).toLocaleDateString()} • {upcomingAssignments[0].weightage}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('assignments', upcomingAssignments[0].id)}
                  className="px-3 py-1.5 rounded-xl bg-rosemoon-500/30 hover:bg-rosemoon-500/50 text-white text-xs font-medium transition-colors"
                >
                  Submit
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-lavender-400/15 flex items-center justify-between text-[11px] text-lavender-400">
            <span>Every completed task adds a glowing star to your constellation ✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};
