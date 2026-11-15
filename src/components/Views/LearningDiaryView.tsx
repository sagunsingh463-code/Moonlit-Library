import React, { useState } from 'react';
import { LearningDiaryEntry, DiaryMood, SubjectItem } from '../../types';
import { 
  BookHeart, 
  Plus, 
  Sparkles, 
  Clock, 
  Calendar, 
  Smile, 
  Flame, 
  Trash2, 
  Edit3,
  BookOpen,
  Award
} from 'lucide-react';
import { sound } from '../../services/sound';

interface LearningDiaryViewProps {
  entries: LearningDiaryEntry[];
  subjects: SubjectItem[];
  onSaveEntry: (entry: LearningDiaryEntry) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
  userStreak: number;
}

export const LearningDiaryView: React.FC<LearningDiaryViewProps> = ({
  entries,
  subjects,
  onSaveEntry,
  onDeleteEntry,
  userStreak
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LearningDiaryEntry | null>(null);

  // Form states
  const [entryDate, setEntryDate] = useState(new Date().toISOString().slice(0, 10));
  const [entryMood, setEntryMood] = useState<DiaryMood>('focused');
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entrySubjects, setEntrySubjects] = useState<string[]>([subjects[0]?.name || 'Product Management']);
  const [entryHours, setEntryHours] = useState(2.5);
  const [entryTakeaway, setEntryTakeaway] = useState('');

  const moodEmojis: Record<DiaryMood, { emoji: string; label: string; color: string }> = {
    calm: { emoji: '🌊', label: 'Calm & Steady', color: 'text-cyan-300' },
    focused: { emoji: '🎯', label: 'Deep Focus', color: 'text-stargold-300' },
    inspired: { emoji: '✨', label: 'Inspired & Creative', color: 'text-purple-300' },
    tired: { emoji: '🌙', label: 'Reflective / Exhausted', color: 'text-lavender-300' },
    victorious: { emoji: '🏆', label: 'Victorious / Breakthrough', color: 'text-emerald-300' }
  };

  const handleOpenAdd = () => {
    sound.playCardClick();
    setEditingEntry(null);
    setEntryDate(new Date().toISOString().slice(0, 10));
    setEntryMood('focused');
    setEntryTitle('');
    setEntryContent('');
    setEntrySubjects([subjects[0]?.name || 'Product Management']);
    setEntryHours(2.5);
    setEntryTakeaway('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (entry: LearningDiaryEntry) => {
    sound.playCardClick();
    setEditingEntry(entry);
    setEntryDate(entry.date);
    setEntryMood(entry.mood);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setEntrySubjects([...entry.subjectsCovered]);
    setEntryHours(entry.hoursStudied);
    setEntryTakeaway(entry.keyTakeaway);
    setIsAddModalOpen(true);
  };

  const handleSaveEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryTitle.trim() || !entryContent.trim()) return;

    sound.playCelestialChime();
    const diaryItem: LearningDiaryEntry = {
      id: editingEntry ? editingEntry.id : `diary-${Date.now()}`,
      date: entryDate,
      mood: entryMood,
      title: entryTitle.trim(),
      content: entryContent.trim(),
      subjectsCovered: entrySubjects,
      hoursStudied: Number(entryHours) || 2,
      keyTakeaway: entryTakeaway.trim() || 'Consistent daily study creates long-term mastery.',
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await onSaveEntry(diaryItem);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-lavender-400/20 bg-gradient-to-r from-space-900/90 via-midnight-800/80 to-space-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-500/10 border border-lavender-400/30 text-stargold-300 text-xs font-serif uppercase tracking-wider mb-2">
              <BookHeart size={14} className="text-pink-400" />
              Daily Reflection & Wisdom
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              My Learning Diary
            </h1>
            <p className="text-xs sm:text-sm text-lavender-300/80 mt-1 max-w-2xl font-sans">
              Record daily MBA reflections, emotional states, hours studied, and breakthroughs.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-midnight-950/70 border border-stargold-400/30">
              <Flame size={20} className="text-amber-400 animate-pulse" />
              <div>
                <div className="text-[10px] text-lavender-400 uppercase font-mono">Streak</div>
                <div className="text-base font-serif font-bold text-stargold-300">{userStreak} Days Active 🔥</div>
              </div>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-stargold-400/20"
            >
              <Plus size={16} />
              New Entry
            </button>
          </div>
        </div>
      </div>

      {/* Diary Entries List */}
      <div className="space-y-5">
        {entries.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center text-lavender-400 border border-dashed border-lavender-400/20 space-y-3">
            <BookHeart size={36} className="mx-auto text-pink-400/60" />
            <h3 className="text-base font-serif font-bold text-white">No diary entries yet</h3>
            <p className="text-xs max-w-sm mx-auto">
              Document your daily learnings, key frameworks mastered, and reflections.
            </p>
          </div>
        ) : (
          entries.map((item) => {
            const mood = moodEmojis[item.mood] || moodEmojis.focused;

            return (
              <div
                key={item.id}
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 space-y-4 hover:border-lavender-400/50 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-lavender-400/15">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" title={mood.label}>{mood.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-stargold-300">{item.date}</span>
                        <span className="text-[11px] text-lavender-400">• {mood.label}</span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-white mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-lavender-300 bg-lavender-500/10 px-3 py-1 rounded-xl">
                      ⏱ {item.hoursStudied} Hours Studied
                    </span>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-lavender-400 hover:text-white hover:bg-lavender-500/20"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this diary entry?')) {
                          await onDeleteEntry(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-lavender-400 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-lavender-200/90 leading-relaxed font-sans whitespace-pre-line">
                  {item.content}
                </p>

                {/* Key Takeaway & Subject badges */}
                <div className="pt-3 border-t border-lavender-400/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-stargold-300 font-serif">Key Takeaway:</strong>
                    <span className="text-lavender-300 italic">"{item.keyTakeaway}"</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {item.subjectsCovered.map((sub, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-midnight-900 border border-lavender-400/20 text-[10px] text-lavender-200">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Diary Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-lavender-400/30 bg-midnight-900/95 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-stargold-300" />
              {editingEntry ? 'Edit Diary Entry' : 'New Learning Reflection'}
            </h3>

            <form onSubmit={handleSaveEntrySubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Date</label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => setEntryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Hours Studied</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="16"
                    value={entryHours}
                    onChange={(e) => setEntryHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-lavender-200 mb-1">Mood & State</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(moodEmojis) as DiaryMood[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setEntryMood(m)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        entryMood === m ? 'border-stargold-400 bg-lavender-500/20 scale-105' : 'border-lavender-400/20 bg-midnight-950'
                      }`}
                    >
                      <div className="text-xl">{moodEmojis[m].emoji}</div>
                      <div className="text-[9px] text-lavender-300 truncate mt-1">{m}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-lavender-200 mb-1">Reflection Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mastered Little's Law & Product Retention Cohorts"
                  value={entryTitle}
                  onChange={(e) => setEntryTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-lavender-200 mb-1">Journal Reflection *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="What concepts clicked today? What challenged you? How will you apply this in your career?"
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs text-lavender-200 mb-1">Single Core Takeaway</label>
                <input
                  type="text"
                  placeholder="e.g. Always evaluate customer retention before spending on acquisition."
                  value={entryTakeaway}
                  onChange={(e) => setEntryTakeaway(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs italic"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-lavender-400/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-lavender-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs"
                >
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
