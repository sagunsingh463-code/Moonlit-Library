import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Award, 
  Calendar, 
  Flame, 
  HelpCircle, 
  BookOpen, 
  Video, 
  Clock, 
  Compass, 
  Bot, 
  X,
  History,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { DailyQuest, QuestHistoryDay, SubjectItem } from '../../types';
import { sound } from '../../services/audio';

interface DailyQuestSystemProps {
  onAwardXp?: (amount: number) => void;
  onNavigate?: (view: any, itemId?: string) => void;
  subjects?: SubjectItem[];
  compact?: boolean;
}

const STORAGE_QUESTS_KEY = 'moonlit_daily_quests_v2';
const STORAGE_HISTORY_KEY = 'moonlit_quest_history_v2';

export const DailyQuestSystem: React.FC<DailyQuestSystemProps> = ({
  onAwardXp,
  onNavigate,
  subjects = [],
  compact = false
}) => {
  const getTodayDateStr = () => new Date().toISOString().split('T')[0];

  const defaultQuestsForToday = (): DailyQuest[] => [
    {
      id: `quest-1-${getTodayDateStr()}`,
      title: 'Microeconomics: Review Elasticity Formulas',
      description: 'Master price elasticity of demand and cross-price elasticity in the Arcade or Study Notes.',
      subject: 'Microeconomics',
      category: 'revision',
      targetMinutes: 15,
      xpReward: 75,
      completed: false,
      date: getTodayDateStr()
    },
    {
      id: `quest-2-${getTodayDateStr()}`,
      title: 'UI/UX: Nielsen’s 10 Usability Heuristics',
      description: 'Review heuristic evaluation principles for mobile & web digital interfaces.',
      subject: 'Introduction to UI/UX',
      category: 'reading',
      targetMinutes: 20,
      xpReward: 60,
      completed: false,
      date: getTodayDateStr()
    },
    {
      id: `quest-3-${getTodayDateStr()}`,
      title: 'Product Management: 50-Q Arcade Wheel',
      description: 'Spin the Term 2 Arcade wheel and answer practical PM case study scenarios.',
      subject: 'Product Management',
      category: 'quiz',
      targetMinutes: 25,
      xpReward: 100,
      completed: false,
      date: getTodayDateStr()
    },
    {
      id: `quest-4-${getTodayDateStr()}`,
      title: 'Midnight Focus: Deep Reading Session',
      description: 'Complete one uninterrupted 25-minute Pomodoro focus block in Midnight Focus Room.',
      subject: 'Leadership Accelerator',
      category: 'focus',
      targetMinutes: 25,
      xpReward: 85,
      completed: false,
      date: getTodayDateStr()
    },
    {
      id: `quest-5-${getTodayDateStr()}`,
      title: 'Market Research: Watch 1 Curated Video',
      description: 'Watch a masterclass on Qualitative vs Quantitative research in YouTube Centre.',
      subject: 'Market Research Methods',
      category: 'youtube',
      targetMinutes: 15,
      xpReward: 50,
      completed: false,
      date: getTodayDateStr()
    }
  ];

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_QUESTS_KEY);
      if (saved) {
        const parsed: DailyQuest[] = JSON.parse(saved);
        // Check if quests are from today
        const todayStr = new Date().toISOString().split('T')[0];
        const isToday = parsed.some(q => q.date === todayStr);
        if (isToday) return parsed;
      }
    } catch {}
    return defaultQuestsForToday();
  });

  const [history, setHistory] = useState<QuestHistoryDay[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { date: '2026-11-13', completedCount: 4, totalCount: 5, totalXpEarned: 270 },
      { date: '2026-11-14', completedCount: 5, totalCount: 5, totalXpEarned: 370 }
    ];
  });

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customSubject, setCustomSubject] = useState('Product Management');
  const [customXp, setCustomXp] = useState(50);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [lunaSuggesting, setLunaSuggesting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_QUESTS_KEY, JSON.stringify(quests));
    } catch {}
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch {}
  }, [history]);

  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalEarnedToday = quests.filter(q => q.completed).reduce((sum, q) => sum + q.xpReward, 0);

  const handleToggleQuest = (questId: string) => {
    setQuests(prev => {
      const updated = prev.map(q => {
        if (q.id === questId) {
          const nextCompleted = !q.completed;
          if (nextCompleted) {
            sound.playCelestialChime();
            if (onAwardXp) onAwardXp(q.xpReward);
          } else {
            sound.playSparkle();
          }
          return {
            ...q,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return q;
      });

      // Update history
      const todayStr = getTodayDateStr();
      const updatedCompleted = updated.filter(q => q.completed).length;
      const updatedXp = updated.filter(q => q.completed).reduce((acc, q) => acc + q.xpReward, 0);

      setHistory(hPrev => {
        const existingIdx = hPrev.findIndex(h => h.date === todayStr);
        if (existingIdx >= 0) {
          const copy = [...hPrev];
          copy[existingIdx] = {
            date: todayStr,
            completedCount: updatedCompleted,
            totalCount: updated.length,
            totalXpEarned: updatedXp
          };
          return copy;
        } else {
          return [
            ...hPrev,
            {
              date: todayStr,
              completedCount: updatedCompleted,
              totalCount: updated.length,
              totalXpEarned: updatedXp
            }
          ];
        }
      });

      return updated;
    });
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    sound.playSparkle();
    const newQuest: DailyQuest = {
      id: `custom-quest-${Date.now()}`,
      title: customTitle.trim(),
      description: `Custom MBA learning objective for ${customSubject}.`,
      subject: customSubject,
      category: 'revision',
      xpReward: Math.max(10, Math.min(200, customXp)),
      completed: false,
      date: getTodayDateStr(),
      isCustom: true
    };

    setQuests(prev => [...prev, newQuest]);
    setCustomTitle('');
    setIsCustomModalOpen(false);
  };

  const handleAskLunaForQuests = () => {
    setLunaSuggesting(true);
    sound.playSparkle();
    setTimeout(() => {
      const lunaGeneratedQuests: DailyQuest[] = [
        {
          id: `luna-quest-${Date.now()}-1`,
          title: 'Luna’s MBA Challenge: Solve 3 Game Theory Scenarios',
          description: 'Apply Prisoner’s Dilemma and Nash Equilibrium to competitive pricing cases.',
          subject: 'Microeconomics',
          category: 'quiz',
          targetMinutes: 20,
          xpReward: 90,
          completed: false,
          date: getTodayDateStr(),
          suggestedByLuna: true
        },
        {
          id: `luna-quest-${Date.now()}-2`,
          title: 'Luna’s Revision: Draft Value Proposition Canvas',
          description: 'Map customer pains, gains, and solution fit for a startup venture.',
          subject: 'Entrepreneurial Mindset',
          category: 'revision',
          targetMinutes: 25,
          xpReward: 110,
          completed: false,
          date: getTodayDateStr(),
          suggestedByLuna: true
        }
      ];

      setQuests(prev => [...prev, ...lunaGeneratedQuests]);
      setLunaSuggesting(false);
      sound.playCelestialChime();
    }, 1000);
  };

  const filteredQuests = quests.filter(q => {
    if (activeFilter === 'pending') return !q.completed;
    if (activeFilter === 'completed') return q.completed;
    return true;
  });

  const getCategoryIcon = (category: DailyQuest['category']) => {
    switch (category) {
      case 'reading': return <BookOpen size={14} className="text-amber-400" />;
      case 'revision': return <Compass size={14} className="text-amber-300" />;
      case 'quiz': return <HelpCircle size={14} className="text-yellow-400" />;
      case 'youtube': return <Video size={14} className="text-rose-400" />;
      case 'focus': return <Clock size={14} className="text-purple-400" />;
      default: return <Sparkles size={14} className="text-amber-400" />;
    }
  };

  if (compact) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-amber-600/30 bg-[#161412]/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-bold text-sm text-[#f4ebe1]">
              Daily Quests ˚୨୧⋆｡˚
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-300 font-bold">
            {completedCount}/{totalCount} Completed
          </span>
        </div>

        {/* Mini Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#2a241f] overflow-hidden border border-amber-600/20">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* First 3 quests preview */}
        <div className="space-y-2">
          {quests.slice(0, 3).map(quest => (
            <div
              key={quest.id}
              onClick={() => handleToggleQuest(quest.id)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                quest.completed
                  ? 'bg-[#1b1815]/50 border-amber-800/30 text-stone-400 line-through'
                  : 'bg-[#221e1a]/70 border-amber-700/30 text-[#f4ebe1] hover:border-amber-500/60'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {quest.completed ? (
                  <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" />
                ) : (
                  <Circle size={14} className="text-stone-500 flex-shrink-0" />
                )}
                <span className="truncate">{quest.title}</span>
              </div>
              <span className="text-[10px] font-mono text-amber-300 font-bold ml-2 flex-shrink-0">
                +{quest.xpReward} XP
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onNavigate && onNavigate('quests')}
          className="w-full text-center py-2 text-xs font-serif text-amber-300 hover:text-amber-100 flex items-center justify-center gap-1 transition-colors border-t border-amber-800/20 pt-2.5"
        >
          <span>View All Missions & Weekly History</span>
          <ChevronRight size={14} />
        </button>
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
              <Award size={14} />
              <span>Term 2 Active Study Missions</span>
              <span>•</span>
              <span>Daily Arc</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#f4ebe1] text-glow">
              Daily Quest Sanctuary ˚୨୧⋆｡˚
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
              Complete curated MBA learning missions every 24 hours. Every verified mission awards XP to raise your Level and feed your study companion!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 text-xs font-serif font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={15} />
              <span>Create Custom Quest</span>
            </button>
            <button
              onClick={handleAskLunaForQuests}
              disabled={lunaSuggesting}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-xs font-serif font-bold shadow-lg shadow-amber-900/30 hover:brightness-110 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Bot size={15} />
              <span>{lunaSuggesting ? 'Luna is thinking...' : 'Ask Luna for Missions'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-amber-700/25 bg-[#1a1714]/80 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-900/40 text-amber-300 border border-amber-600/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-sans font-medium">Completed Quests</p>
            <p className="text-lg md:text-xl font-serif font-bold text-[#f4ebe1]">
              {completedCount} / {totalCount}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-700/25 bg-[#1a1714]/80 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-yellow-900/40 text-yellow-300 border border-yellow-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-sans font-medium">XP Earned Today</p>
            <p className="text-lg md:text-xl font-serif font-bold text-amber-300">
              +{totalEarnedToday} XP
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-700/25 bg-[#1a1714]/80 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-900/40 text-rose-300 border border-rose-600/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-sans font-medium">Completion Rate</p>
            <p className="text-lg md:text-xl font-serif font-bold text-rose-200">
              {progressPercent}%
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-amber-700/25 bg-[#1a1714]/80 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-purple-900/40 text-purple-300 border border-purple-600/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 uppercase font-sans font-medium">Current Date</p>
            <p className="text-xs md:text-sm font-mono font-bold text-stone-200">
              {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' })}
            </p>
          </div>
        </div>
      </div>

      {/* Main Quests Section with Tabs */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-700/25 bg-[#161412]/80 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-amber-900/30">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#f4ebe1]">
              Today’s Missions ({filteredQuests.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {(['all', 'pending', 'completed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                  activeFilter === f
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'bg-[#221e1a] text-stone-400 hover:text-white border border-amber-800/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Quest Cards List */}
        <div className="space-y-3">
          {filteredQuests.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              No missions found under this filter. Complete more missions or add custom ones!
            </div>
          ) : (
            filteredQuests.map(quest => (
              <div
                key={quest.id}
                onClick={() => handleToggleQuest(quest.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  quest.completed
                    ? 'bg-[#1b1815]/60 border-amber-900/20 text-stone-500'
                    : 'bg-[#221e1a]/80 border-amber-700/30 hover:border-amber-500/60 text-[#f4ebe1]'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {quest.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-500 hover:text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-serif font-bold text-[#f4ebe1] truncate">
                        {quest.title}
                      </span>
                      {quest.isCustom && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/30">
                          Custom
                        </span>
                      )}
                      {quest.suggestedByLuna && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/30 flex items-center gap-1">
                          <Bot size={10} /> Luna Suggestion
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {quest.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                      <span className="flex items-center gap-1 text-amber-300">
                        {getCategoryIcon(quest.category)}
                        <span className="capitalize">{quest.category}</span>
                      </span>
                      <span>•</span>
                      <span>{quest.subject}</span>
                      {quest.targetMinutes && (
                        <>
                          <span>•</span>
                          <span>~{quest.targetMinutes} mins</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-amber-950/60 border border-amber-600/30 text-amber-300">
                    +{quest.xpReward} XP
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleQuest(quest.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      quest.completed
                        ? 'bg-amber-900/30 text-amber-300 border border-amber-700/40'
                        : 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold hover:brightness-110'
                    }`}
                  >
                    {quest.completed ? 'Completed ✓' : 'Mark Done'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quest History & Weekly Completion Arc */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-amber-700/25 bg-[#161412]/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={18} className="text-amber-400" />
            <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
              Weekly Quest Archival History
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            Past 7 Days
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
          {history.slice(-7).map((h, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#221e1a]/80 border border-amber-800/20 flex flex-col items-center gap-1.5"
            >
              <span className="text-[11px] font-mono text-stone-400">{h.date}</span>
              <div className="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-600/40 flex items-center justify-center text-xs font-bold text-amber-300">
                {h.completedCount}/{h.totalCount}
              </div>
              <span className="text-[10px] text-amber-400 font-mono font-bold">
                +{h.totalXpEarned} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Quest Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-amber-600/40 bg-[#1c1815] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
              <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
                Create Custom Study Mission
              </h3>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustom} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Mission Objective / Task
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Read 15 pages of Product Strategy notes"
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Subject
                </label>
                <select
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
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
                  XP Reward (10 - 200 XP)
                </label>
                <input
                  type="number"
                  min="10"
                  max="200"
                  value={customXp}
                  onChange={(e) => setCustomXp(parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold hover:brightness-110"
                >
                  Create Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
