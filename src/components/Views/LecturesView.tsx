import React, { useState } from 'react';
import { LectureItem, FileItem } from '../../types';
import { 
  GraduationCap, 
  Plus, 
  Play, 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Star, 
  Trash2, 
  Sparkles,
  Edit3,
  Paperclip,
  ExternalLink,
  Search,
  Filter,
  X
} from 'lucide-react';
import { sound } from '../../services/audio';

interface LecturesViewProps {
  lectures: LectureItem[];
  availableFiles?: FileItem[];
  onSaveLecture: (lecture: LectureItem) => Promise<void>;
  onDeleteLecture: (id: string) => Promise<void>;
  onToggleWatched: (id: string) => Promise<void>;
}

export const LecturesView: React.FC<LecturesViewProps> = ({
  lectures,
  availableFiles = [],
  onSaveLecture,
  onDeleteLecture,
  onToggleWatched
}) => {
  const [selectedLectureId, setSelectedLectureId] = useState<string>(
    lectures.length > 0 ? lectures[0].id : ''
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<LectureItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Corporate Finance');
  const [newProfessor, setNewProfessor] = useState('Prof. Vance');
  const [newDuration, setNewDuration] = useState(60);
  const [newDate, setNewDate] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newAttachedFileName, setNewAttachedFileName] = useState('');
  const [newTakeaways, setNewTakeaways] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const subjects = ['All', ...Array.from(new Set(lectures.map(l => l.subject)))];

  const filteredLectures = lectures.filter(l => {
    const matchesSubject = selectedSubject === 'All' || l.subject === selectedSubject;
    const matchesSearch = !searchQuery || 
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.professor && l.professor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      l.keyTakeaways.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const activeLecture = lectures.find(l => l.id === selectedLectureId) || filteredLectures[0] || lectures[0];

  const handleOpenAddModal = () => {
    setEditingLecture(null);
    setNewTitle('');
    setNewSubject('Corporate Finance');
    setNewProfessor('Prof. Julian Vance');
    setNewDuration(60);
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewVideoUrl('');
    setNewAttachedFileName('');
    setNewTakeaways('');
    setNewNotes('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (lec: LectureItem) => {
    setEditingLecture(lec);
    setNewTitle(lec.title);
    setNewSubject(lec.subject);
    setNewProfessor(lec.professor || '');
    setNewDuration(lec.durationMinutes);
    setNewDate(lec.date);
    setNewVideoUrl(lec.videoUrl || '');
    setNewAttachedFileName(lec.attachedFileName || '');
    setNewTakeaways(lec.keyTakeaways.join('\n'));
    setNewNotes(lec.notesMarkdown || '');
    setShowAddModal(true);
  };

  const handleSaveLectureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const takeawaysArray = newTakeaways.split('\n').map(t => t.trim()).filter(Boolean);

    const lecItem: LectureItem = {
      id: editingLecture ? editingLecture.id : `lec-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      professor: newProfessor,
      date: newDate || new Date().toISOString().split('T')[0],
      durationMinutes: newDuration,
      videoUrl: newVideoUrl,
      attachedFileName: newAttachedFileName,
      keyTakeaways: takeawaysArray.length > 0 ? takeawaysArray : ['Core lecture discussion'],
      notesMarkdown: newNotes || `### Discussion Notes:\nKey takeaways from ${newTitle}`,
      isWatched: editingLecture ? editingLecture.isWatched : false,
      rating: 5
    };

    await onSaveLecture(lecItem);
    sound.playSparkle();
    setSelectedLectureId(lecItem.id);
    setShowAddModal(false);
    setEditingLecture(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-stargold-300" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              Lectures & Amphitheater
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            Organize MBA classes, stream recordings, review key takeaways, and track completion.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-lavender-600 to-indigo-600 text-white font-serif font-bold text-xs shadow-md hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lecture</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 text-xs">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedSubject === s
                  ? 'bg-lavender-600 text-white'
                  : 'glass-panel-subtle text-lavender-300 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-lavender-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lectures & professors..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-midnight-900 border border-lavender-400/25 text-white placeholder-lavender-400/60 text-xs focus:outline-none focus:border-stargold-400"
          />
        </div>
      </div>

      {/* Grid: Lecture Selector & Main Player / Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Lecture List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-lavender-300 px-1">
            Recorded Sessions ({filteredLectures.length})
          </span>

          <div className="space-y-2.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
            {filteredLectures.map(lec => {
              const isSelected = activeLecture?.id === lec.id;
              return (
                <div
                  key={lec.id}
                  onClick={() => {
                    sound.playPageTurn();
                    setSelectedLectureId(lec.id);
                  }}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-lavender-600/30 to-midnight-800/80 border-lavender-400/50 shadow-md'
                      : 'glass-panel-subtle border-lavender-400/15 hover:border-lavender-400/35'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-lavender-300 font-mono mb-1">
                    <span className="uppercase text-stargold-300">{lec.subject}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lec.durationMinutes}m
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-white line-clamp-1 mb-1">
                    {lec.title}
                  </h4>

                  <p className="text-xs text-lavender-300/80 font-sans">
                    {lec.professor} • {lec.date}
                  </p>

                  <div className="mt-3 pt-2 border-t border-lavender-400/10 flex items-center justify-between text-xs">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await onToggleWatched(lec.id);
                      }}
                      className="flex items-center gap-1.5 text-[11px]"
                    >
                      {lec.isWatched ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                          <span className="text-emerald-300">Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-3.5 h-3.5 text-lavender-400" />
                          <span className="text-lavender-400">Mark Watched</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenEditModal(lec)}
                        className="p-1 text-lavender-400 hover:text-white"
                        title="Edit lecture"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          await onDeleteLecture(lec.id);
                        }}
                        className="p-1 text-lavender-400 hover:text-red-400"
                        title="Delete lecture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Lecture Details & Takeaways (8 cols) */}
        {activeLecture ? (
          <div className="lg:col-span-8 rounded-3xl glass-panel-glow border border-lavender-400/30 p-6 space-y-6">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stargold-300">
                  {activeLecture.subject} • {activeLecture.professor}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-lavender-300">
                    Recorded {activeLecture.date}
                  </span>
                  <button
                    onClick={() => onToggleWatched(activeLecture.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                      activeLecture.isWatched
                        ? 'bg-emerald-950/60 border-emerald-400/40 text-emerald-200'
                        : 'bg-midnight-900 border-lavender-400/30 text-stargold-200'
                    }`}
                  >
                    {activeLecture.isWatched ? '✓ Watched' : 'Mark Completed'}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(activeLecture)}
                    className="p-1 text-lavender-400 hover:text-white"
                    title="Edit lecture"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className="font-serif font-bold text-2xl text-white">
                {activeLecture.title}
              </h2>
            </div>

            {/* Video Player or Embedded Audio Sanctuary */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-midnight-950/90 border border-lavender-400/25 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-lavender-600 to-indigo-600 flex items-center justify-center text-white shadow-moon-glow mb-3">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <p className="font-serif text-sm text-white">Lecture Recording Stream</p>
              <p className="text-xs text-lavender-300/80 mt-1 max-w-sm">
                Synchronized playback and video timestamps ready for MBA examination prep.
              </p>
              {activeLecture.attachedFileName && (
                <div className="mt-4 px-3 py-1.5 rounded-xl bg-midnight-900/80 border border-lavender-400/20 text-xs text-stargold-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Slides Attached: {activeLecture.attachedFileName}</span>
                </div>
              )}
            </div>

            {/* Key Takeaways Card */}
            <div className="p-5 rounded-2xl bg-midnight-900/70 border border-lavender-400/20">
              <h3 className="font-serif font-bold text-sm text-stargold-200 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-stargold-300" />
                <span>Executive Takeaways & Exam Highlights</span>
              </h3>

              <ul className="space-y-2">
                {activeLecture.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-lavender-100 leading-relaxed font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-stargold-300 mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lecture Notes Section */}
            {activeLecture.notesMarkdown && (
              <div className="p-5 rounded-2xl glass-panel-subtle border border-lavender-400/15">
                <h4 className="text-xs uppercase font-semibold text-lavender-300 mb-2">
                  Personal Study Notes
                </h4>
                <div className="text-xs text-lavender-200 font-mono leading-relaxed whitespace-pre-wrap">
                  {activeLecture.notesMarkdown}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center rounded-3xl glass-panel-subtle text-lavender-400 text-xs">
            No lecture selected.
          </div>
        )}
      </div>

      {/* Add / Edit Lecture Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-book-open">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-panel-glow border border-lavender-400/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingLecture ? 'Edit Lecture' : 'Add Lecture Recording'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-lavender-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLectureSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Lecture Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lecture 10: Private Equity Leveraged Buyouts"
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
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Professor</label>
                  <input
                    type="text"
                    value={newProfessor}
                    onChange={(e) => setNewProfessor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Attach Slide from My Files */}
              {availableFiles.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Attached Slide / Notes File</label>
                  <select
                    value={newAttachedFileName}
                    onChange={(e) => setNewAttachedFileName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                  >
                    <option value="">-- None or manual name --</option>
                    {availableFiles.map(f => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Key Takeaways (one per line)</label>
                <textarea
                  rows={3}
                  value={newTakeaways}
                  onChange={(e) => setNewTakeaways(e.target.value)}
                  placeholder="Key model assumptions&#10;Exam calculation shortcuts"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Personal Lecture Notes</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Detailed professor notes, formulas, or cases discussed..."
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                />
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-lavender-600 to-indigo-600 text-white font-serif font-bold text-xs shadow-md hover:brightness-110"
                >
                  {editingLecture ? 'Update Lecture' : 'Save Lecture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
