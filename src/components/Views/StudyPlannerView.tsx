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
      {/* Top Header & Dreamy Aesthetic Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C7B6E8]/20 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-[#241A30] border border-[#C7B6E8]/30 text-[#C7B6E8] shadow-sm">
              <Calendar className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FFF7ED] tracking-wide">
                  Study Planner & Academic Rhythms
                </h1>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[#30243D] text-[#F3D8E5] border border-[#C99B9B]/30">
                  Term 2 Active
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#8C7A9E] font-serif italic mt-0.5">
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#241A30] hover:bg-[#30243D] border border-[#C7B6E8]/40 text-[#FFF7ED] text-xs font-serif font-semibold transition-all hover:scale-[1.02] shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-[#C7B6E8] fill-[#C7B6E8]" />
              <span>Midnight Focus</span>
            </button>
          )}

          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C7B6E8] via-[#F3D8E5] to-[#C99B9B] text-[#30243D] font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Study Block</span>
          </button>
        </div>
      </div>

      {/* Hero Exam Milestone Countdown Card */}
      <div className="p-6 rounded-3xl bg-[#241A30]/85 border border-[#C99B9B]/35 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7B6E8]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#30243D] text-[#F3D8E5] border border-[#C7B6E8]/20">
                <Timer className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C7B6E8]">
                Upcoming Examination Milestone
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] rounded-xl px-3 py-1.5 text-xs font-serif font-semibold focus:outline-none focus:border-[#C7B6E8]"
              >
                {UPCOMING_EXAMS.map(exam => (
                  <option key={exam.id} value={exam.id}>
                    {exam.subject} — {exam.title}
                  </option>
                ))}
              </select>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#30243D] text-[#F3D8E5] border border-[#C99B9B]/30 font-mono">
                {activeExam.type}
              </span>
            </div>

            <p className="text-xs text-[#8C7A9E] font-serif">
              Target Date: <strong className="text-[#FFF7ED]">{new Date(activeExam.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
            </p>
          </div>

          {/* Countdown Clock Cubes */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono">
            <div className="p-3 sm:p-4 rounded-2xl bg-[#1E1528] border border-[#C99B9B]/35 text-center min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-[#F3D8E5] block">
                {String(diffDays).padStart(2, '0')}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#8C7A9E] mt-0.5">Days</span>
            </div>
            <span className="text-xl sm:text-2xl text-[#C7B6E8]/60 font-bold">:</span>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#1E1528] border border-[#C7B6E8]/30 text-center min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-[#FFF7ED] block">
                {String(diffHours).padStart(2, '0')}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#8C7A9E] mt-0.5">Hours</span>
            </div>
            <span className="text-xl sm:text-2xl text-[#C7B6E8]/60 font-bold">:</span>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#1E1528] border border-[#C7B6E8]/30 text-center min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-[#FFF7ED] block">
                {String(diffMins).padStart(2, '0')}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#8C7A9E] mt-0.5">Mins</span>
            </div>
            <span className="text-xl sm:text-2xl text-[#C7B6E8]/60 font-bold">:</span>

            <div className="p-3 sm:p-4 rounded-2xl bg-[#1E1528] border border-[#C99B9B]/35 text-center min-w-[65px] sm:min-w-[80px] shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-[#F3D8E5] block">
                {String(diffSecs).padStart(2, '0')}
              </span>
              <span className="block text-[9px] uppercase tracking-wider text-[#8C7A9E] mt-0.5">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Mascot Motivation Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly Completion Card */}
        <div className="p-4 rounded-2xl bg-[#241A30]/85 border border-[#C7B6E8]/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A9E]">
              Weekly Progress
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold font-serif text-[#FFF7ED]">
                {completedTasks} / {totalTasks}
              </h3>
              <span className="text-xs text-[#F3D8E5] font-mono">({completionPercentage}%)</span>
            </div>
            {/* Progress Bar */}
            <div className="w-36 h-2 rounded-full bg-[#1E1528] overflow-hidden mt-1 border border-[#C7B6E8]/20">
              <div 
                className="h-full bg-gradient-to-r from-[#C7B6E8] via-[#F3D8E5] to-[#C99B9B] rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <span className="p-3 rounded-xl bg-[#30243D] text-[#C7B6E8] border border-[#C7B6E8]/20">
            <Award className="w-5 h-5" />
          </span>
        </div>

        {/* Today's Focus Routine */}
        <div className="p-4 rounded-2xl bg-[#241A30]/85 border border-[#C7B6E8]/20 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#8C7A9E]">
              Today ({todayName})
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold font-serif text-[#FFF7ED]">
                {todayCompleted} / {todayTasks.length} Blocks
              </h3>
              <span className="text-xs text-[#F3D8E5] font-mono">
                {todayTasks.length > 0 ? `${Math.round((todayCompleted / todayTasks.length) * 100)}%` : 'Rest Day'}
              </span>
            </div>
            <p className="text-[11px] text-[#8C7A9E] font-serif italic">
              {todayTasks.length - todayCompleted > 0 
                ? `${todayTasks.length - todayCompleted} study sprint(s) remaining today` 
                : 'All scheduled blocks conquered! ✨'}
            </p>
          </div>
          <span className="p-3 rounded-xl bg-[#30243D] text-[#C99B9B] border border-[#C7B6E8]/20">
            <Flame className="w-5 h-5" />
          </span>
        </div>

        {/* Mascot Study Tip */}
        <div className="p-4 rounded-2xl bg-[#241A30]/85 border border-[#C7B6E8]/20 flex items-center gap-3">
          <img 
            src="/shagun/shagun_speaking_portrait.jpg" 
            alt="Shagun" 
            className="w-12 h-12 rounded-xl object-cover border border-[#C99B9B]/40 flex-shrink-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/shagun/shagun_speaking.jpg'; }}
          />
          <div className="text-xs">
            <span className="text-[10px] uppercase font-mono text-[#F3D8E5] block font-semibold">
              Shagun's Advice
            </span>
            <p className="text-[#8C7A9E] font-serif italic leading-snug mt-0.5">
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
                ? 'bg-gradient-to-r from-[#C7B6E8] to-[#F3D8E5] text-[#30243D] shadow-star-glow scale-105'
                : 'bg-[#241A30] text-[#8C7A9E] hover:text-[#FFF7ED] border border-[#C7B6E8]/20'
            }`}
          >
            <span>Today • {todayName}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1E1528]/40 font-mono">
              {safeTasks.filter(t => t.day === todayName).length}
            </span>
          </button>

          <button
            onClick={() => setSelectedDay('All')}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedDay === 'All'
                ? 'bg-gradient-to-r from-[#C7B6E8] to-[#F3D8E5] text-[#30243D] shadow-star-glow font-bold'
                : 'bg-[#241A30] text-[#8C7A9E] hover:text-[#FFF7ED] border border-[#C7B6E8]/20'
            }`}
          >
            <span>Weekly Matrix (All Days)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1E1528]/40 font-mono">
              {safeTasks.length}
            </span>
          </button>

          <div className="h-4 w-px bg-[#C7B6E8]/20 mx-1 flex-shrink-0" />

          {DAYS.map(day => {
            const count = safeTasks.filter(t => t.day === day).length;
            const isToday = day === todayName;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedDay === day
                    ? 'bg-[#30243D] text-[#F3D8E5] border border-[#C99B9B]/50 font-semibold'
                    : 'bg-[#1E1528] text-[#8C7A9E] hover:text-[#FFF7ED] border border-[#C7B6E8]/10'
                }`}
              >
                <span>{day}</span>
                {isToday && <span className="w-1.5 h-1.5 rounded-full bg-[#F3D8E5]" />}
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1E1528] text-[#8C7A9E] font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter bar: Subject & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#241A30]/85 border border-[#C7B6E8]/20 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#C7B6E8]" />
              <span className="text-[11px] font-mono uppercase text-[#8C7A9E]">Subject:</span>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#C7B6E8]"
              >
                <option value="All">All Subjects</option>
                {availableSubjectOptions.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-[#1E1528] p-1 rounded-xl border border-[#C7B6E8]/20">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  statusFilter === 'all' 
                    ? 'bg-gradient-to-r from-[#C7B6E8] to-[#F3D8E5] text-[#30243D] font-bold' 
                    : 'text-[#8C7A9E] hover:text-[#FFF7ED]'
                }`}
              >
                All ({filteredTasks.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  statusFilter === 'pending' 
                    ? 'bg-gradient-to-r from-[#C7B6E8] to-[#F3D8E5] text-[#30243D] font-bold' 
                    : 'text-[#8C7A9E] hover:text-[#FFF7ED]'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  statusFilter === 'completed' 
                    ? 'bg-gradient-to-r from-[#C7B6E8] to-[#F3D8E5] text-[#30243D] font-bold' 
                    : 'text-[#8C7A9E] hover:text-[#FFF7ED]'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#8C7A9E]">
              Showing {filteredTasks.length} study block(s)
            </span>
            <button
              onClick={() => handleOpenAdd(selectedDay === 'All' ? todayName : selectedDay)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#30243D] hover:bg-[#3D2C4E] border border-[#C7B6E8]/40 text-[#F3D8E5] font-serif font-bold text-xs transition-all"
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
                  ? 'bg-[#1E1528]/50 border-[#30243D] text-[#8C7A9E]'
                  : 'bg-[#241A30]/85 border-[#C7B6E8]/25 hover:border-[#C99B9B]/60 hover:bg-[#30243D]/50 text-[#FFF7ED] shadow-md'
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
                    <CheckCircle2 className="w-5 h-5 text-[#F3D8E5]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#8C7A9E] group-hover:text-[#F3D8E5]" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#30243D] text-[#F3D8E5] border border-[#C7B6E8]/20">
                      {task.subject}
                    </span>

                    {selectedDay === 'All' && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                        isTodayTask 
                          ? 'bg-[#30243D] text-[#F3D8E5] border-[#C99B9B]/40 font-bold' 
                          : 'bg-[#1E1528] text-[#E8DDF8] border-[#C7B6E8]/15 font-medium'
                      }`}>
                        {task.day}
                      </span>
                    )}

                    {task.isExamPrep && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C99B9B]/20 text-[#F3D8E5] border border-[#C99B9B]/30 flex items-center gap-1 font-medium">
                        <Timer className="w-2.5 h-2.5" />
                        Exam Prep
                      </span>
                    )}

                    {task.priority === 'high' && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/30 font-semibold">
                        High Priority
                      </span>
                    )}

                    {task.category && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1E1528] text-[#E8DDF8] border border-[#C7B6E8]/20 font-medium">
                        {task.category}
                      </span>
                    )}
                  </div>

                  <h3 className={`font-serif font-bold text-sm md:text-base leading-snug transition-all ${
                    task.completed ? 'line-through text-[#C7B6E8]/70' : 'text-[#FFF7ED]'
                  }`}>
                    {task.title}
                  </h3>
                </div>
              </div>

              {/* Right Section: Time Slot, Focus Play Button & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#C7B6E8]/15">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#E8DDF8] bg-[#1E1528] px-2.5 py-1.5 rounded-xl border border-[#C7B6E8]/20 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#C7B6E8]" />
                  <span>{task.timeSlot}</span>
                  <span className="text-[#C7B6E8]">({task.durationMinutes}m)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Start Focus Mode Button */}
                  {onOpenFocusMode && !task.completed && (
                    <button
                      onClick={() => {
                        sound.playSparkle();
                        onOpenFocusMode();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#30243D] hover:bg-gradient-to-r hover:from-[#C7B6E8] hover:to-[#F3D8E5] text-[#F3D8E5] hover:text-[#30243D] border border-[#C7B6E8]/30 text-xs font-serif font-semibold transition-all hover:scale-105"
                      title="Start Focus Timer for this block"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Focus</span>
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(task)}
                    className="p-2 rounded-xl text-[#8C7A9E] hover:text-[#F3D8E5] hover:bg-[#30243D] transition-colors"
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
                    className="p-2 rounded-xl text-[#8C7A9E] hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
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
          <div className="p-12 text-center rounded-3xl bg-[#241A30]/80 border border-dashed border-[#C7B6E8]/30 text-[#8C7A9E] space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1E1528] border border-[#C7B6E8]/20 flex items-center justify-center text-[#C7B6E8]">
              <BookOpen className="w-7 h-7 stroke-1" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#FFF7ED]">
                No study blocks found for {selectedDay === 'All' ? 'selected filters' : selectedDay}
              </h3>
              <p className="text-xs text-[#8C7A9E] font-serif mt-1 max-w-md mx-auto">
                Schedule a deep focus block for your MBA assignments, case studies, or quiz prep.
              </p>
            </div>
            <button
              onClick={() => handleOpenAdd(selectedDay === 'All' ? todayName : selectedDay)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C7B6E8] via-[#F3D8E5] to-[#C99B9B] text-[#30243D] font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule Study Block</span>
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Study Block Modal */}
      {(showAddModal || editingTask) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1528]/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#241A30] border border-[#C99B9B]/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#C7B6E8]/20">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#30243D] text-[#C7B6E8] border border-[#C7B6E8]/30">
                  <Calendar className="w-4 h-4" />
                </span>
                <h3 className="font-serif font-bold text-lg text-[#FFF7ED]">
                  {editingTask ? 'Edit Study Block' : 'Schedule Study Block'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTask(null);
                }} 
                className="p-1.5 rounded-xl text-[#8C7A9E] hover:text-[#FFF7ED] hover:bg-[#30243D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-4 pt-4">
              {/* Title input */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C7A9E] mb-1.5">
                  Focus Topic / Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Microeconomics: Marginal Revenue & Deadweight Loss"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] text-xs placeholder:text-[#8C7A9E]/60 focus:outline-none focus:border-[#C7B6E8] transition-all"
                />
              </div>

              {/* Subject & Day */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C7A9E] mb-1.5">
                    Subject *
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] text-xs focus:outline-none focus:border-[#C7B6E8]"
                  >
                    {availableSubjectOptions.map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C7A9E] mb-1.5">
                    Day of Week *
                  </label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as StudyPlanTask['day'])}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] text-xs focus:outline-none focus:border-[#C7B6E8]"
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
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C7A9E] mb-1.5">
                  Time Slot
                </label>
                <input
                  type="text"
                  value={formTimeSlot}
                  onChange={(e) => setFormTimeSlot(e.target.value)}
                  placeholder="e.g. 08:00 PM - 09:30 PM"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] text-xs focus:outline-none focus:border-[#C7B6E8]"
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
                          ? 'bg-gradient-to-r from-[#C7B6E8] to-[#F3D8E5] text-[#30243D] font-bold border-[#F3D8E5]'
                          : 'bg-[#1E1528] text-[#8C7A9E] hover:text-[#FFF7ED] border-[#C7B6E8]/20'
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
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C7A9E] mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={360}
                    step={15}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] text-xs focus:outline-none focus:border-[#C7B6E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C7A9E] mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] text-xs focus:outline-none focus:border-[#C7B6E8]"
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
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8C7A9E] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1E1528] border border-[#C7B6E8]/30 text-[#FFF7ED] text-xs focus:outline-none focus:border-[#C7B6E8]"
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
                      className="w-4 h-4 rounded accent-[#C7B6E8]"
                    />
                    <span className="text-xs text-[#FFF7ED] font-medium">
                      Mark as Exam Prep Focus
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#C7B6E8]/20">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#1E1528] text-xs text-[#8C7A9E] hover:text-[#FFF7ED] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C7B6E8] via-[#F3D8E5] to-[#C99B9B] text-[#30243D] font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all disabled:opacity-50"
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
