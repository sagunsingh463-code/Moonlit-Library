import React, { useState, useEffect, useMemo } from 'react';
import { StudyPlanTask, SubjectItem } from '../../types';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Sparkles, 
  Timer, 
  Play, 
  Edit3, 
  Filter, 
  BookOpen, 
  Flame, 
  Award,
  X,
  Check,
  ChevronRight,
  Bookmark
} from 'lucide-react';
import { sound } from '../../services/audio';

interface StudyPlannerViewProps {
  tasks: StudyPlanTask[];
  subjects?: SubjectItem[];
  onSaveTask: (task: StudyPlanTask) => Promise<void>;
  onToggleTask: (id: string) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onOpenFocusMode?: () => void;
}

const DAYS: StudyPlanTask['day'][] = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

interface ExamMilestone {
  id: string;
  title: string;
  subject: string;
  date: string;
  type: string;
}

const UPCOMING_EXAMS: ExamMilestone[] = [
  {
    id: 'exam-1',
    title: 'Product Management: Mid-Term Case Study Evaluation',
    subject: 'Product Management',
    date: '2026-11-20T10:00:00',
    type: 'Term 2 Mid-Term'
  },
  {
    id: 'exam-2',
    title: 'Microeconomics: Quantitative Problem Sets & Elasticity',
    subject: 'Microeconomics',
    date: '2026-11-25T14:00:00',
    type: 'Core Exam'
  },
  {
    id: 'exam-3',
    title: 'Market Research Methods: Statistical Analysis Presentation',
    subject: 'Market Research Methods',
    date: '2026-11-28T11:00:00',
    type: 'Capstone Defense'
  },
  {
    id: 'exam-4',
    title: 'Leadership Accelerator: Executive Simulation Challenge',
    subject: 'Leadership Accelerator',
    date: '2026-12-02T15:00:00',
    type: 'Simulation Exam'
  },
  {
    id: 'exam-5',
    title: 'Introduction to UI/UX: Design System & Prototype Critique',
    subject: 'Introduction to UI/UX',
    date: '2026-12-06T09:30:00',
    type: 'Final Review'
  }
];

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  tasks = [],
  subjects = [],
  onSaveTask,
  onToggleTask,
  onDeleteTask,
  onOpenFocusMode
}) => {
  // Safe tasks array fallback
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Determine today's day of week
  const getTodayDayName = (): StudyPlanTask['day'] => {
    const dayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
    const map: Record<number, StudyPlanTask['day']> = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    };
    return map[dayIndex] || 'Monday';
  };

  const todayName = getTodayDayName();
  const [selectedDay, setSelectedDay] = useState<StudyPlanTask['day'] | 'All'>(todayName);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<StudyPlanTask | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState(subjects[0]?.name || 'Product Management');
  const [formDay, setFormDay] = useState<StudyPlanTask['day']>(todayName);
  const [formTimeSlot, setFormTimeSlot] = useState('08:00 PM - 09:30 PM');
  const [formDuration, setFormDuration] = useState(90);
  const [formIsExamPrep, setFormIsExamPrep] = useState(false);
  const [formPriority, setFormPriority] = useState<'normal' | 'medium' | 'high'>('medium');
  const [formCategory, setFormCategory] = useState<string>('Deep Focus');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Milestone countdown state
  const [selectedExamId, setSelectedExamId] = useState<string>(UPCOMING_EXAMS[0].id);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeExam = UPCOMING_EXAMS.find(e => e.id === selectedExamId) || UPCOMING_EXAMS[0];
  const examTargetDate = new Date(activeExam.date);
  const diffTime = Math.max(0, examTargetDate.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
  const diffMins = Math.floor((diffTime / (1000 * 60)) % 60);
  const diffSecs = Math.floor((diffTime / 1000) % 60);

  // Pre-fill edit modal
  const handleOpenEdit = (task: StudyPlanTask) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormSubject(task.subject);
    setFormDay(task.day);
    setFormTimeSlot(task.timeSlot);
    setFormDuration(task.durationMinutes);
    setFormIsExamPrep(Boolean(task.isExamPrep));
    setFormPriority(task.priority || 'medium');
    setFormCategory(task.category || 'Deep Focus');
  };

  // Open clean add modal
  const handleOpenAdd = (defaultDay?: StudyPlanTask['day']) => {
    setEditingTask(null);
    setFormTitle('');
    setFormSubject(subjects[0]?.name || 'Product Management');
    setFormDay(defaultDay || (selectedDay === 'All' ? todayName : selectedDay));
    setFormTimeSlot('08:00 PM - 09:30 PM');
    setFormDuration(90);
    setFormIsExamPrep(false);
    setFormPriority('medium');
    setFormCategory('Deep Focus');
    setShowAddModal(true);
  };

  // Save task (create or update)
  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const taskToSave: StudyPlanTask = {
        id: editingTask ? editingTask.id : `task-${Date.now()}`,
        title: formTitle.trim(),
        subject: formSubject,
        day: formDay,
        timeSlot: formTimeSlot.trim() || '08:00 PM - 09:30 PM',
        durationMinutes: Number(formDuration) || 60,
        completed: editingTask ? editingTask.completed : false,
        isExamPrep: formIsExamPrep,
        priority: formPriority,
        category: formCategory
      };

      await onSaveTask(taskToSave);
      sound.playSparkle();
      setShowAddModal(false);
      setEditingTask(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return safeTasks.filter(task => {
      // Day filter
      if (selectedDay !== 'All' && task.day !== selectedDay) {
        return false;
      }
      // Subject filter
      if (selectedSubjectFilter !== 'All' && task.subject !== selectedSubjectFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === 'pending' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      return true;
    });
  }, [safeTasks, selectedDay, selectedSubjectFilter, statusFilter]);

  // Overall metrics
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter(t => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const todayTasks = safeTasks.filter(t => t.day === todayName);
  const todayCompleted = todayTasks.filter(t => t.completed).length;

  // Available unique subjects from tasks + subjects prop
  const availableSubjectOptions = useMemo(() => {
    const set = new Set<string>();
    subjects.forEach(s => set.add(s.name));
    safeTasks.forEach(t => set.add(t.subject));
    if (set.size === 0) {
      set.add('Product Management');
      set.add('Microeconomics');
      set.add('Introduction to UI/UX');
      set.add('Leadership Accelerator');
      set.add('Corporate Finance');
    }
    return Array.from(set);
  }, [subjects, safeTasks]);

  // Preset time slots
  const presetTimeSlots = [
    '09:00 AM - 10:30 AM',
    '02:00 PM - 03:30 PM',
    '05:00 PM - 06:30 PM',
    '08:00 PM - 09:30 PM',
    '09:30 PM - 11:00 PM'
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto font-sans text-[#f5efe6] animate-fade-in">
      {/* Top Header & Dark Academia Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#d4af37]/20 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#221e1a] border border-[#d4af37]/30 text-[#d4af37] shadow-sm">
              <Calendar className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#f5efe6] tracking-wide">
                  Study Planner & Academic Rhythms
                </h1>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30">
                  Term 2 Active
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#c8bcad] font-serif italic mt-0.5">
                Structured MBA time-blocks, disciplined deep focus routines & real-time exam countdowns.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenFocusMode && (
            <button
              onClick={() => {
                sound.playSparkle();
                onOpenFocusMode();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#221e1a] hover:bg-[#2c2621] border border-[#d4af37]/40 text-[#f5efe6] text-xs font-serif font-semibold transition-all hover:scale-[1.02] shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
              <span>Midnight Focus</span>
            </button>
          )}

          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8972e] text-[#141210] font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Study Block</span>
          </button>
        </div>
      </div>

      {/* Hero Exam Milestone Countdown Card */}
      <div className="p-6 rounded-3xl bg-[#181512] border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#d4af37]">
                <Timer className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#d4af37]">
                Upcoming Examination Milestone
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="bg-[#221e1a] border border-[#d4af37]/30 text-[#f5efe6] rounded-xl px-3 py-1.5 text-xs font-serif font-semibold focus:outline-none focus:border-[#d4af37]"
              >
                {UPCOMING_EXAMS.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.subject} — {exam.title}
                  </option>
                ))}
              </select>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#322c26] text-[#d4af37] border border-[#d4af37]/20 font-mono">
                {activeExam.type}
              </span>
            </div>

            <p className="text-xs text-[#c8bcad] font-serif">
              Target Date: <strong className="text-[#f5efe6]">{new Date(activeExam.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
            </p>
          </div>

          {/* Countdown Clock Cubes */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono">
            <div className="p-3 sm:p-4 rounded-2xl bg-[#12100e] border border-[#d4af37]/30 text-center min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-[#d4af37] block">
                {String(diffDays).padStart(2, '0')}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#a09485] mt-0.5">Days</span>
            </div>
            <span className="text-xl sm:text-2xl text-[#d4af37]/60 font-bold">:</span>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#12100e] border border-[#d4af37]/30 text-center min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-[#f5efe6] block">
                {String(diffHours).padStart(2, '0')}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#a09485] mt-0.5">Hours</span>
            </div>
            <span className="text-xl sm:text-2xl text-[#d4af37]/60 font-bold">:</span>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#12100e] border border-[#d4af37]/30 text-center min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-[#f5efe6] block">
                {String(diffMins).padStart(2, '0')}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#a09485] mt-0.5">Mins</span>
            </div>
            <span className="text-xl sm:text-2xl text-[#d4af37]/60 font-bold">:</span>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#12100e] border border-[#d4af37]/30 text-center min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-[#d4af37] block">
                {String(diffSecs).padStart(2, '0')}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#a09485] mt-0.5">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Mascot Motivation Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Completion Card */}
        <div className="p-4 rounded-2xl bg-[#1a1714] border border-[#d4af37]/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#c8bcad]">
              Weekly Progress
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold font-serif text-[#f5efe6]">
                {completedTasks} / {totalTasks}
              </h3>
              <span className="text-xs text-[#d4af37] font-mono">({completionPercentage}%)</span>
            </div>
            {/* Progress Bar */}
            <div className="w-36 h-2 rounded-full bg-[#12100e] overflow-hidden mt-1 border border-[#d4af37]/20">
              <div 
                className="h-full bg-gradient-to-r from-[#d4af37] to-[#e6ca65] rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <span className="p-3 rounded-xl bg-[#221e1a] text-[#d4af37] border border-[#d4af37]/20">
            <Award className="w-5 h-5" />
          </span>
        </div>

        {/* Today's Focus Routine */}
        <div className="p-4 rounded-2xl bg-[#1a1714] border border-[#d4af37]/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#c8bcad]">
              Today ({todayName})
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold font-serif text-[#f5efe6]">
                {todayCompleted} / {todayTasks.length} Blocks
              </h3>
              <span className="text-xs text-[#d4af37] font-mono">
                {todayTasks.length > 0 ? `${Math.round((todayCompleted / todayTasks.length) * 100)}%` : 'Rest Day'}
              </span>
            </div>
            <p className="text-[11px] text-[#a09485] font-serif italic">
              {todayTasks.length - todayCompleted > 0 
                ? `${todayTasks.length - todayCompleted} study sprint(s) remaining today` 
                : 'All scheduled blocks conquered! ✨'}
            </p>
          </div>
          <span className="p-3 rounded-xl bg-[#221e1a] text-[#d4af37] border border-[#d4af37]/20">
            <Flame className="w-5 h-5" />
          </span>
        </div>

        {/* Mascot Study Tip */}
        <div className="p-4 rounded-2xl bg-[#1a1714] border border-[#d4af37]/20 flex items-center gap-3">
          <img 
            src="/shagun/shagun_speaking_portrait.jpg" 
            alt="Shagun" 
            className="w-12 h-12 rounded-xl object-cover border border-[#d4af37]/30 flex-shrink-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/shagun/shagun_speaking.jpg'; }}
          />
          <div className="text-xs">
            <span className="text-[10px] uppercase font-mono text-[#d4af37] block font-semibold">
              Shagun's Advice
            </span>
            <p className="text-[#c8bcad] font-serif italic leading-snug mt-0.5">
              "Master 1 core topic deeply rather than skimming 5. Use the focus timer for uninterrupted flow!"
            </p>
          </div>
        </div>
      </div>

      {/* Day Tabs & Controls Filter Bar */}
      <div className="space-y-4">
        {/* Days selector tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedDay(todayName)}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedDay === todayName
                ? 'bg-[#d4af37] text-[#141210] shadow-star-glow scale-105'
                : 'bg-[#1e1b18] text-[#c8bcad] hover:text-[#f5efe6] border border-[#d4af37]/20'
            }`}
          >
            <span>Today • {todayName}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#141210]/20 font-mono">
              {safeTasks.filter(t => t.day === todayName).length}
            </span>
          </button>

          <button
            onClick={() => setSelectedDay('All')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedDay === 'All'
                ? 'bg-[#d4af37] text-[#141210] shadow-star-glow font-bold'
                : 'bg-[#1e1b18] text-[#c8bcad] hover:text-[#f5efe6] border border-[#d4af37]/20'
            }`}
          >
            <span>Weekly Matrix (All Days)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#141210]/20 font-mono">
              {safeTasks.length}
            </span>
          </button>

          <div className="h-4 w-px bg-[#d4af37]/20 mx-1 flex-shrink-0" />

          {DAYS.map(day => {
            const count = safeTasks.filter(t => t.day === day).length;
            const isToday = day === todayName;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedDay === day
                    ? 'bg-[#2a241f] text-[#d4af37] border border-[#d4af37] font-semibold'
                    : 'bg-[#181512] text-[#c8bcad] hover:text-[#f5efe6] border border-[#d4af37]/10'
                }`}
              >
                <span>{day}</span>
                {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />}
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#12100e] text-[#a09485] font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter bar: Subject & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#1a1714] border border-[#d4af37]/20 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="text-[11px] font-mono uppercase text-[#c8bcad]">Subject:</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-[#221e1a] border border-[#d4af37]/30 text-[#f5efe6] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#d4af37]"
              >
                <option value="All">All Subjects</option>
                {availableSubjectOptions.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[#12100e] p-1 rounded-xl border border-[#d4af37]/20">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  statusFilter === 'all' 
                    ? 'bg-[#d4af37] text-[#141210] font-bold' 
                    : 'text-[#c8bcad] hover:text-[#f5efe6]'
                }`}
              >
                All ({filteredTasks.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  statusFilter === 'pending' 
                    ? 'bg-[#d4af37] text-[#141210] font-bold' 
                    : 'text-[#c8bcad] hover:text-[#f5efe6]'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  statusFilter === 'completed' 
                    ? 'bg-[#d4af37] text-[#141210] font-bold' 
                    : 'text-[#c8bcad] hover:text-[#f5efe6]'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#a09485]">
              Showing {filteredTasks.length} study block(s)
            </span>
            <button
              onClick={() => handleOpenAdd(selectedDay === 'All' ? todayName : selectedDay)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a241f] hover:bg-[#342d27] border border-[#d4af37]/40 text-[#d4af37] font-serif font-bold text-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Block</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task List / Study Blocks */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const isTodayTask = task.day === todayName;

          return (
            <div
              key={task.id}
              className={`p-4 md:p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                task.completed
                  ? 'bg-[#151311]/70 border-[#2e2924] text-[#7d7367]'
                  : 'bg-[#1c1916] border-[#d4af37]/25 hover:border-[#d4af37]/60 hover:bg-[#221e1a] text-[#f5efe6] shadow-md'
              }`}
            >
              {/* Left Section: Checkbox + Details */}
              <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
                <button
                  onClick={async () => {
                    sound.playSparkle();
                    await onToggleTask(task.id);
                  }}
                  className="mt-0.5 md:mt-0 flex-shrink-0 transition-transform active:scale-90"
                  title={task.completed ? "Mark as pending" : "Mark as completed"}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#8c8072] group-hover:text-[#d4af37]" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#2a241f] text-[#d4af37] border border-[#d4af37]/20">
                      {task.subject}
                    </span>

                    {selectedDay === 'All' && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                        isTodayTask 
                          ? 'bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/40 font-bold' 
                          : 'bg-[#161412] text-[#a09485] border-[#322c26]'
                      }`}>
                        {task.day}
                      </span>
                    )}

                    {task.isExamPrep && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Timer className="w-2.5 h-2.5" />
                        Exam Prep
                      </span>
                    )}

                    {task.priority === 'high' && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-semibold">
                        High Priority
                      </span>
                    )}

                    {task.category && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#12100e] text-[#a09485] border border-[#322c26]">
                        {task.category}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-serif font-bold text-sm md:text-base leading-snug transition-all ${
                    task.completed ? 'line-through text-[#7d7367]' : 'text-[#f5efe6]'
                  }`}>
                    {task.title}
                  </h3>
                </div>
              </div>

              {/* Right Section: Time Slot, Focus Play Button & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#2e2924]">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#c8bcad] bg-[#12100e] px-2.5 py-1.5 rounded-xl border border-[#322c26]">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{task.timeSlot}</span>
                  <span className="text-[#8c8072]">({task.durationMinutes}m)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Start Focus Mode Button */}
                  {onOpenFocusMode && !task.completed && (
                    <button
                      onClick={() => {
                        sound.playSparkle();
                        onOpenFocusMode();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2a241f] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#141210] border border-[#d4af37]/30 text-xs font-serif font-semibold transition-all hover:scale-105"
                      title="Start Focus Timer for this block"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Focus</span>
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-2 rounded-xl text-[#a09485] hover:text-[#d4af37] hover:bg-[#221e1a] transition-colors"
                    title="Edit block"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={async () => {
                      if (confirm(`Remove "${task.title}" from your study planner?`)) {
                        await onDeleteTask(task.id);
                      }
                    }}
                    className="p-2 rounded-xl text-[#a09485] hover:text-red-400 hover:bg-red-950/20 transition-colors"
                    title="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center rounded-3xl bg-[#181512] border border-dashed border-[#d4af37]/30 text-[#a09485] space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#221e1a] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37]">
              <BookOpen className="w-7 h-7 stroke-1" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#f5efe6]">
                No study blocks found for {selectedDay === 'All' ? 'selected filters' : selectedDay}
              </h3>
              <p className="text-xs text-[#a09485] font-serif mt-1 max-w-md mx-auto">
                Schedule a deep focus block for your MBA assignments, case studies, or quiz prep.
              </p>
            </div>
            <button
              onClick={() => handleOpenAdd(selectedDay === 'All' ? todayName : selectedDay)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d4af37] text-[#141210] font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule Study Block</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Study Block Modal */}
      {(showAddModal || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0908]/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#181512] border border-[#d4af37]/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#d4af37]/20">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#2a241f] text-[#d4af37] border border-[#d4af37]/30">
                  <Calendar className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-lg text-[#f5efe6]">
                  {editingTask ? 'Edit Study Block' : 'Schedule Study Block'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                }} 
                className="p-1.5 rounded-xl text-[#a09485] hover:text-[#f5efe6] hover:bg-[#221e1a]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4 pt-4">
              {/* Title input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#c8bcad] mb-1.5">
                  Focus Topic / Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Microeconomics: Marginal Revenue & Deadweight Loss"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12100e] border border-[#d4af37]/30 text-[#f5efe6] text-xs placeholder:text-[#6a6053] focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>

              {/* Subject & Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c8bcad] mb-1.5">
                    Subject *
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#d4af37]/30 text-[#f5efe6] text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    {availableSubjectOptions.map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c8bcad] mb-1.5">
                    Day of Week *
                  </label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as StudyPlanTask['day'])}
                    className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#d4af37]/30 text-[#f5efe6] text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    {DAYS.map(d => (
                      <option key={d} value={d}>
                        {d} {d === todayName ? '(Today)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time slot & Presets */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#c8bcad] mb-1.5">
                  Time Slot
                </label>
                <input
                  type="text"
                  value={formTimeSlot}
                  onChange={(e) => setFormTimeSlot(e.target.value)}
                  placeholder="e.g. 08:00 PM - 09:30 PM"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#12100e] border border-[#d4af37]/30 text-[#f5efe6] text-xs focus:outline-none focus:border-[#d4af37]"
                />
                {/* Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {presetTimeSlots.map(preset => (
                    <button
                      type="button"
                      key={preset}
                      onClick={() => setFormTimeSlot(preset)}
                      className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                        formTimeSlot === preset
                          ? 'bg-[#d4af37] text-[#141210] font-bold border-[#d4af37]'
                          : 'bg-[#221e1a] text-[#a09485] hover:text-[#f5efe6] border-[#342d27]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c8bcad] mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={360}
                    step={15}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#d4af37]/30 text-[#f5efe6] text-xs focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c8bcad] mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#d4af37]/30 text-[#f5efe6] text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Deep Focus">Deep Focus</option>
                    <option value="Case Study">Case Study</option>
                    <option value="Reading & Synthesis">Reading & Synthesis</option>
                    <option value="Problem Set">Problem Set</option>
                    <option value="Lecture Review">Lecture Review</option>
                    <option value="Interview Practice">Interview Practice</option>
                  </select>
                </div>
              </div>

              {/* Priority & Exam Prep Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#c8bcad] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-[#d4af37]/30 text-[#f5efe6] text-xs focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="high">High Priority 🔥</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsExamPrep}
                      onChange={(e) => setFormIsExamPrep(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#d4af37]"
                    />
                    <span className="text-xs text-[#f5efe6] font-medium">
                      Mark as Exam Prep Focus
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#d4af37]/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#221e1a] text-xs text-[#c8bcad] hover:text-[#f5efe6] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8972e] text-[#141210] font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingTask ? 'Update Study Block ✨' : 'Schedule Study Block ✨'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
