import React, { useState } from 'react';
import { StudyPlanTask } from '../../types';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trash2, 
  Sparkles, 
  Timer,
  AlertTriangle,
  X
} from 'lucide-react';
import { sound } from '../../services/audio';

interface StudyPlannerViewProps {
  tasks: StudyPlanTask[];
  onSaveTask: (task: StudyPlanTask) => Promise<void>;
  onToggleTask: (id: string) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  tasks,
  onSaveTask,
  onToggleTask,
  onDeleteTask
}) => {
  const days: StudyPlanTask['day'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  const [selectedDay, setSelectedDay] = useState<StudyPlanTask['day']>('Monday');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Corporate Finance');
  const [newTimeSlot, setNewTimeSlot] = useState('08:00 PM - 09:30 PM');
  const [newDuration, setNewDuration] = useState(90);
  const [isExamPrep, setIsExamPrep] = useState(false);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: StudyPlanTask = {
      id: `task-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      day: selectedDay,
      timeSlot: newTimeSlot,
      durationMinutes: newDuration,
      completed: false,
      isExamPrep
    };

    await onSaveTask(newTask);
    sound.playSparkle();
    setShowAddModal(false);
    setNewTitle('');
  };

  // Exam countdown calculation (target: Nov 15, 2026)
  const examDate = new Date('2026-11-15T09:00:00');
  const now = new Date();
  const diffTime = Math.max(0, examDate.getTime() - now.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-stargold-300" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              Study Planner & Celestial Rhythms
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            Weekly time blocks, disciplined study routines, and countdown to MBA final examinations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Block</span>
        </button>
      </div>

      {/* Exam Countdown Ticker Card */}
      <div className="p-6 rounded-3xl glass-panel-glow border border-stargold-400/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-stargold-400/20 border border-stargold-400/40 flex items-center justify-center text-stargold-300 shadow-sm">
            <Timer className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-stargold-300">
              Upcoming Academic Milestone
            </span>
            <h3 className="font-serif font-bold text-lg text-white">
              MBA Mid-Term Comprehensive Examinations
            </h3>
            <p className="text-xs text-lavender-300 font-sans">
              Corporate Finance, Valuation & Competitive Marketing Strategy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="p-3 rounded-2xl bg-midnight-950/80 border border-lavender-400/20 text-center min-w-[70px]">
            <span className="text-2xl font-bold text-stargold-100">{diffDays}</span>
            <span className="block text-[9px] uppercase tracking-wider text-lavender-400">Days</span>
          </div>
          <span className="text-xl text-stargold-300 font-bold">:</span>
          <div className="p-3 rounded-2xl bg-midnight-950/80 border border-lavender-400/20 text-center min-w-[70px]">
            <span className="text-2xl font-bold text-white">{diffHours}</span>
            <span className="block text-[9px] uppercase tracking-wider text-lavender-400">Hours</span>
          </div>
        </div>
      </div>

      {/* Weekly Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-lavender-400/20 text-xs">
        {days.map(day => {
          const count = tasks.filter(t => t.day === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-2xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-lavender-600 to-indigo-600 text-white shadow-md border border-lavender-400/40'
                  : 'glass-panel-subtle text-lavender-300 hover:text-white'
              }`}
            >
              <span>{day}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-midnight-950/60 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day's Task Blocks */}
      <div className="space-y-3">
        {tasks.filter(t => t.day === selectedDay).map(task => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
              task.completed
                ? 'bg-midnight-950/40 border-lavender-400/10 text-lavender-400/60 line-through'
                : 'glass-panel-subtle border-lavender-400/20 hover:border-stargold-400/40 text-white'
            }`}
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <button
                onClick={async () => {
                  sound.playSparkle();
                  await onToggleTask(task.id);
                }}
                className="flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-stargold-300" />
                ) : (
                  <Circle className="w-5 h-5 text-lavender-400 hover:text-white" />
                )}
              </button>

              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold text-stargold-300 tracking-wider">
                    {task.subject}
                  </span>
                  {task.isExamPrep && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-stargold-400/20 text-stargold-300 border border-stargold-400/30">
                      Exam Prep
                    </span>
                  )}
                </div>
                <h4 className="font-serif font-bold text-sm text-white truncate mt-0.5">
                  {task.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-xs font-mono text-lavender-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-lavender-400" />
                {task.timeSlot} ({task.durationMinutes}m)
              </span>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-lavender-400 hover:text-red-400 transition-colors p-1"
                title="Remove block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {tasks.filter(t => t.day === selectedDay).length === 0 && (
          <div className="p-12 text-center rounded-3xl glass-panel-subtle text-lavender-400 text-xs">
            No study blocks scheduled for {selectedDay}. Click "Add Study Block" to schedule a deep focus sprint.
          </div>
        )}
      </div>

      {/* Add Study Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-book-open">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel-glow border border-lavender-400/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-white">Schedule Study Block</h3>
              <button onClick={() => setShowAddModal(false)} className="text-lavender-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Title / Focus Topic</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. WACC Capital Structure Practice"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value as StudyPlanTask['day'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="08:00 PM - 09:30 PM"
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="examPrep"
                  checked={isExamPrep}
                  onChange={(e) => setIsExamPrep(e.target.checked)}
                  className="accent-stargold-400 rounded"
                />
                <label htmlFor="examPrep" className="text-xs text-lavender-200">
                  Mark as Mid-Term Exam Prep Focus
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-lavender-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110"
                >
                  Schedule Block ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
