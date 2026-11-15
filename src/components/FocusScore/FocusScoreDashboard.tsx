import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flame, 
  TrendingUp, 
  Calendar, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Award, 
  BarChart3, 
  Edit3, 
  ChevronRight,
  Sparkles,
  PieChart,
  X
} from 'lucide-react';
import { FocusSessionRecord, FocusProductivityReport, SubjectItem } from '../../types';
import { sound } from '../../services/audio';

interface FocusScoreDashboardProps {
  onSessionComplete?: (durationMinutes: number) => void;
  subjects?: SubjectItem[];
  compact?: boolean;
}

const STORAGE_SESSIONS_KEY = 'moonlit_focus_sessions_v2';

export const FocusScoreDashboard: React.FC<FocusScoreDashboardProps> = ({
  onSessionComplete,
  subjects = [],
  compact = false
}) => {
  // Timer State
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [selectedSubject, setSelectedSubject] = useState('Product Management');
  const [sessionNotes, setSessionNotes] = useState('');

  // Manual Log Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logMinutes, setLogMinutes] = useState(45);
  const [logSubject, setLogSubject] = useState('Microeconomics');
  const [logType, setLogType] = useState<FocusSessionRecord['sessionType']>('deep_work');
  const [logNotes, setLogNotes] = useState('');

  // Persistent Recorded Sessions
  const [sessions, setSessions] = useState<FocusSessionRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_SESSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'sess-1', startTime: '2026-11-14T10:00:00.000Z', endTime: '2026-11-14T10:50:00.000Z', durationMinutes: 50, subject: 'Microeconomics', sessionType: 'pomodoro', breakMinutes: 10, completedTasksCount: 2, notes: 'Completed supply & demand quiz and notes revision.' },
      { id: 'sess-2', startTime: '2026-11-14T14:30:00.000Z', endTime: '2026-11-14T15:15:00.000Z', durationMinutes: 45, subject: 'Introduction to UI/UX', sessionType: 'reading', breakMinutes: 5, completedTasksCount: 1, notes: 'Reviewed Nielsen 10 Usability Heuristics.' },
      { id: 'sess-3', startTime: '2026-11-15T09:00:00.000Z', endTime: '2026-11-15T09:40:00.000Z', durationMinutes: 40, subject: 'Product Management', sessionType: 'deep_work', breakMinutes: 5, completedTasksCount: 2, notes: 'Drafted PRD structure for MBA case.' }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
    } catch {}
  }, [sessions]);

  // Pomodoro countdown timer effect
  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = window.setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      setIsRunning(false);
      sound.playCelestialChime();

      if (timerType === 'focus') {
        const duration = timerMinutes;
        const newRecord: FocusSessionRecord = {
          id: `sess-${Date.now()}`,
          startTime: new Date(Date.now() - duration * 60000).toISOString(),
          endTime: new Date().toISOString(),
          durationMinutes: duration,
          subject: selectedSubject,
          sessionType: 'pomodoro',
          breakMinutes: 5,
          completedTasksCount: 1,
          notes: sessionNotes.trim() || `Pomodoro block for ${selectedSubject}.`
        };

        setSessions(prev => [newRecord, ...prev]);
        if (onSessionComplete) onSessionComplete(duration);
        setSessionNotes('');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining, timerType, timerMinutes, selectedSubject, sessionNotes, onSessionComplete]);

  const handleStartPause = () => {
    sound.playSparkle();
    setIsRunning(!isRunning);
  };

  const handleResetTimer = (minutes: number = timerMinutes) => {
    sound.playSparkle();
    setIsRunning(false);
    setTimerMinutes(minutes);
    setSecondsRemaining(minutes * 60);
  };

  const handleSetTimerPreset = (type: 'focus' | 'short_break' | 'long_break', minutes: number) => {
    sound.playSparkle();
    setTimerType(type);
    handleResetTimer(minutes);
  };

  const handleSaveManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCelestialChime();

    const newRecord: FocusSessionRecord = {
      id: `manual-sess-${Date.now()}`,
      startTime: new Date(Date.now() - logMinutes * 60000).toISOString(),
      endTime: new Date().toISOString(),
      durationMinutes: Math.max(5, logMinutes),
      subject: logSubject,
      sessionType: logType,
      breakMinutes: 5,
      completedTasksCount: 1,
      notes: logNotes.trim() || `Offline study session logged for ${logSubject}.`
    };

    setSessions(prev => [newRecord, ...prev]);
    if (onSessionComplete) onSessionComplete(logMinutes);
    setIsLogModalOpen(false);
    setLogNotes('');
  };

  // CALCULATE REAL PRODUCTIVITY METRICS
  const totalMinutesRecorded = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHoursRecorded = (totalMinutesRecorded / 60).toFixed(1);
  const totalTasksCompleted = sessions.reduce((acc, s) => acc + (s.completedTasksCount || 1), 0);

  // Subject distribution breakdown
  const subjectMap: Record<string, number> = {};
  sessions.forEach(s => {
    const subj = s.subject || 'General Study';
    subjectMap[subj] = (subjectMap[subj] || 0) + s.durationMinutes;
  });

  const subjectDistribution = Object.keys(subjectMap).map(subj => ({
    subject: subj,
    minutes: subjectMap[subj],
    percentage: totalMinutesRecorded > 0 ? Math.round((subjectMap[subj] / totalMinutesRecorded) * 100) : 0
  })).sort((a, b) => b.minutes - a.minutes);

  // Compute Focus Score (0 - 100)
  // Factors: Total hours (max 40 pts), Tasks completed (max 30 pts), Session consistency (max 30 pts)
  const durationScore = Math.min(40, (totalMinutesRecorded / 300) * 40); // 300 mins target
  const tasksScore = Math.min(30, (totalTasksCompleted / 8) * 30);
  const consistencyScore = sessions.length > 2 ? 30 : (sessions.length * 10);
  const computedFocusScore = Math.min(100, Math.round(durationScore + tasksScore + consistencyScore));

  const formatTimerDisplay = () => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (compact) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-amber-600/30 bg-[#161412]/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-bold text-sm text-[#f4ebe1]">
              Focus Score • Productivity
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/30 text-amber-300">
            {computedFocusScore} / 100
          </span>
        </div>

        {/* Score Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-sans text-stone-400">
            <span>Overall Score</span>
            <span className="text-amber-200 font-bold">{computedFocusScore}% High Productivity</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#2a241f] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${computedFocusScore}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center pt-1">
          <div className="p-2.5 rounded-xl bg-[#221e1a] border border-amber-800/20">
            <span className="text-[10px] text-stone-400 block">Total Focus</span>
            <span className="text-sm font-serif font-bold text-white">{totalHoursRecorded} hrs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#221e1a] border border-amber-800/20">
            <span className="text-[10px] text-stone-400 block">Logged Sessions</span>
            <span className="text-sm font-serif font-bold text-amber-300">{sessions.length} sessions</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-600/30 bg-gradient-to-r from-[#1c1713] via-[#261f19] to-[#1c1713] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-200 text-xs font-serif">
              <TrendingUp size={14} />
              <span>Personal MBA Productivity Matrix</span>
              <span>•</span>
              <span>Focus Score: {computedFocusScore}/100</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#f4ebe1] text-glow">
              Focus Score & Productivity ˚୨୧⋆｡˚
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
              Track actual study session durations, Pomodoro cycles, and subject distribution. Calculated from recorded study logs with manual correction options.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 text-xs font-serif font-bold flex items-center gap-2 transition-all"
            >
              <Plus size={15} />
              <span>Log Offline Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-amber-700/25 bg-[#1a1714]/80 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-900/40 text-amber-300 border border-amber-600/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-sans font-medium">Focus Score</p>
            <p className="text-xl font-serif font-bold text-amber-300">{computedFocusScore} / 100</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-700/25 bg-[#1a1714]/80 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-yellow-900/40 text-yellow-300 border border-yellow-600/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-sans font-medium">Total Study Time</p>
            <p className="text-xl font-serif font-bold text-[#f4ebe1]">{totalHoursRecorded} hrs</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-700/25 bg-[#1a1714]/80 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-900/40 text-rose-300 border border-rose-600/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-sans font-medium">Completed Tasks</p>
            <p className="text-xl font-serif font-bold text-rose-200">{totalTasksCompleted} tasks</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-700/25 bg-[#1a1714]/80 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-900/40 text-purple-300 border border-purple-600/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-sans font-medium">Focus Sessions</p>
            <p className="text-xl font-serif font-bold text-stone-200">{sessions.length} logged</p>
          </div>
        </div>
      </div>

      {/* Split Grid: Pomodoro Timer & Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Pomodoro Timer Panel */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-700/30 bg-[#161412]/80 space-y-6 text-center">
          <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
            <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
              Pomodoro Focus Timer
            </h3>
            <span className="text-xs font-mono text-amber-400 capitalize">
              {timerType.replace('_', ' ')}
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleSetTimerPreset('focus', 25)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                timerType === 'focus' && timerMinutes === 25
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'bg-[#221e1a] text-stone-400 hover:text-white border border-amber-800/20'
              }`}
            >
              Focus 25m
            </button>
            <button
              onClick={() => handleSetTimerPreset('focus', 50)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                timerType === 'focus' && timerMinutes === 50
                  ? 'bg-amber-600 text-stone-950 font-bold'
                  : 'bg-[#221e1a] text-stone-400 hover:text-white border border-amber-800/20'
              }`}
            >
              Deep MBA 50m
            </button>
            <button
              onClick={() => handleSetTimerPreset('short_break', 5)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                timerType === 'short_break'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-[#221e1a] text-stone-400 hover:text-white border border-amber-800/20'
              }`}
            >
              Short Break 5m
            </button>
            <button
              onClick={() => handleSetTimerPreset('long_break', 15)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                timerType === 'long_break'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-[#221e1a] text-stone-400 hover:text-white border border-amber-800/20'
              }`}
            >
              Long Break 15m
            </button>
          </div>

          {/* Big Digital Countdown Clock */}
          <div className="py-6">
            <div className="text-5xl sm:text-6xl font-mono font-bold text-amber-200 tracking-wider text-glow">
              {formatTimerDisplay()}
            </div>
            <p className="text-xs text-stone-400 mt-2 font-serif italic">
              {isRunning ? '✨ Deep study stream in progress...' : 'Ready to begin your study block.'}
            </p>
          </div>

          {/* Subject Selector for Active Session */}
          <div className="max-w-xs mx-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={isRunning}
              className="w-full px-3 py-2 rounded-xl bg-[#221e1a] border border-amber-700/30 text-stone-200 text-xs focus:outline-none focus:border-amber-400 disabled:opacity-50"
            >
              <option value="Microeconomics">Microeconomics</option>
              <option value="Introduction to UI/UX">Introduction to UI/UX</option>
              <option value="Leadership Accelerator">Leadership Accelerator</option>
              <option value="Market Research Methods">Market Research Methods</option>
              <option value="Product Management">Product Management</option>
              <option value="CV Interview Workshop">CV Interview Workshop</option>
              <option value="Entrepreneurial Mindset">Entrepreneurial Mindset</option>
            </select>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleStartPause}
              className={`px-8 py-3 rounded-2xl font-serif font-bold text-sm shadow-lg transition-all flex items-center gap-2 ${
                isRunning
                  ? 'bg-amber-900/60 text-amber-200 border border-amber-500/40 hover:bg-amber-900/80'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 hover:brightness-110'
              }`}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              <span>{isRunning ? 'Pause Flow' : 'Start Focus'}</span>
            </button>
            <button
              onClick={() => handleResetTimer()}
              className="p-3 rounded-2xl bg-[#221e1a] border border-amber-700/30 text-stone-400 hover:text-white transition-colors"
              title="Reset Timer"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Subject Distribution Breakdown */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-700/30 bg-[#161412]/80 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
            <div className="flex items-center gap-2">
              <PieChart size={18} className="text-amber-400" />
              <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
                Subject-Wise Study Allocation
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-mono">
              Real Tracking
            </span>
          </div>

          <div className="space-y-3.5">
            {subjectDistribution.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-8">
                No recorded sessions yet. Start a focus session above to record time!
              </p>
            ) : (
              subjectDistribution.map(item => (
                <div key={item.subject} className="space-y-1">
                  <div className="flex justify-between text-xs font-serif">
                    <span className="text-[#f4ebe1]">{item.subject}</span>
                    <span className="text-amber-300 font-mono">{item.minutes}m ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#2a241f] overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-700 to-amber-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Focus Sessions History */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-700/30 bg-[#161412]/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-amber-400" />
            <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
              Recent Study Sessions Log
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {sessions.length} Recorded
          </span>
        </div>

        <div className="space-y-2.5">
          {sessions.slice(0, 5).map(s => (
            <div 
              key={s.id} 
              className="p-3.5 rounded-2xl bg-[#221e1a]/80 border border-amber-800/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-serif font-bold text-white">{s.subject}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/30 text-amber-300 capitalize font-mono">
                    {s.sessionType.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-stone-400 font-sans">{s.notes || 'Focused study block.'}</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-stone-400">
                <span>{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="font-bold text-amber-300 px-2 py-1 rounded-xl bg-amber-950/60">
                  +{s.durationMinutes}m
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Session Log Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-amber-600/40 bg-[#1c1815] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
              <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
                Log Offline Study Session
              </h3>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveManualLog} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Subject
                </label>
                <select
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="Microeconomics">Microeconomics</option>
                  <option value="Introduction to UI/UX">Introduction to UI/UX</option>
                  <option value="Leadership Accelerator">Leadership Accelerator</option>
                  <option value="Market Research Methods">Market Research Methods</option>
                  <option value="Product Management">Product Management</option>
                  <option value="CV Interview Workshop">CV Interview Workshop</option>
                  <option value="Entrepreneurial Mindset">Entrepreneurial Mindset</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="360"
                  value={logMinutes}
                  onChange={(e) => setLogMinutes(parseInt(e.target.value) || 25)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Session Type
                </label>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="pomodoro">Pomodoro Session</option>
                  <option value="deep_work">Deep Work Block</option>
                  <option value="reading">Textbook & PDF Reading</option>
                  <option value="quiz_prep">Quiz / Exam Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Session Summary Notes
                </label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  rows={2}
                  placeholder="What concepts did you master during this block?"
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold hover:brightness-110"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
