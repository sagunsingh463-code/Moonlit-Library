import React, { useState } from 'react';
import { NoteItem, StudyPlanTask, CalendarEvent, YouTubeResource, SubjectItem } from '../../types';
import { 
  Plus, 
  FileText, 
  CheckSquare, 
  Calendar, 
  Video, 
  Sparkles, 
  X 
} from 'lucide-react';
import { sound } from '../../services/sound';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectItem[];
  onSaveNote: (note: NoteItem) => Promise<void>;
  onSaveTask: (task: StudyPlanTask) => Promise<void>;
  onSaveCalendarEvent: (event: CalendarEvent) => Promise<void>;
  onSaveYouTube: (resource: YouTubeResource) => Promise<void>;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSaveNote,
  onSaveTask,
  onSaveCalendarEvent,
  onSaveYouTube
}) => {
  const [activeTab, setActiveTab] = useState<'note' | 'task' | 'calendar' | 'youtube'>('note');

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState(subjects[0]?.name || 'Product Management');
  const [noteContent, setNoteContent] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState(subjects[0]?.name || 'Product Management');
  const [taskDay, setTaskDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [taskTime, setTaskTime] = useState('20:00 - 21:00');

  // Calendar form state
  const [calTitle, setCalTitle] = useState('');
  const [calSubject, setCalSubject] = useState(subjects[0]?.name || 'Product Management');
  const [calDay, setCalDay] = useState('Monday');
  const [calStart, setCalStart] = useState('09:30');
  const [calEnd, setCalEnd] = useState('11:00');
  const [calRoom, setCalRoom] = useState('Lab A3');

  // YouTube form state
  const [ytUrl, setYtUrl] = useState('');
  const [ytTitle, setYtTitle] = useState('');
  const [ytSubject, setYtSubject] = useState(subjects[0]?.name || 'Product Management');

  if (!isOpen) return null;

  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCelestialChime();

    if (activeTab === 'note') {
      if (!noteTitle.trim()) return;
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        title: noteTitle.trim(),
        subject: noteSubject,
        content: noteContent.trim() || 'Quick note created from navigation bar.',
        tags: [noteSubject, 'Quick Note'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isBookmarked: false,
        needsRevision: false,
        wordCount: noteContent.trim().split(/\s+/).length
      };
      await onSaveNote(newNote);
    } else if (activeTab === 'task') {
      if (!taskTitle.trim()) return;
      const newTask: StudyPlanTask = {
        id: `task-${Date.now()}`,
        title: taskTitle.trim(),
        subject: taskSubject,
        day: taskDay,
        timeSlot: taskTime,
        durationMinutes: 60,
        completed: false
      };
      await onSaveTask(newTask);
    } else if (activeTab === 'calendar') {
      if (!calTitle.trim()) return;
      const newEvent: CalendarEvent = {
        id: `evt-${Date.now()}`,
        subjectName: calSubject,
        title: calTitle.trim(),
        type: 'class',
        dayOfWeek: calDay as any,
        startTime: calStart,
        endTime: calEnd,
        room: calRoom,
        isRecurring: true,
        createdAt: new Date().toISOString()
      };
      await onSaveCalendarEvent(newEvent);
    } else if (activeTab === 'youtube') {
      const vidId = extractYouTubeId(ytUrl);
      if (!vidId) {
        alert('Invalid YouTube URL');
        return;
      }
      const newYt: YouTubeResource = {
        id: `yt-${Date.now()}`,
        subjectName: ytSubject,
        title: ytTitle.trim() || `Lecture: ${ytSubject}`,
        youtubeUrl: ytUrl.trim(),
        videoId: vidId,
        playlistName: 'Core Lectures',
        durationMinutes: 45,
        isWatched: false,
        notes: [],
        createdAt: new Date().toISOString()
      };
      await onSaveYouTube(newYt);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-lavender-400/30 bg-midnight-900/95 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-lavender-400/20">
          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-stargold-300" />
            Quick Add to Moonlight Library
          </h3>
          <button onClick={onClose} className="text-lavender-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-midnight-950 border border-lavender-400/20 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('note')}
            className={`py-2 rounded-xl font-medium transition-all flex flex-col items-center gap-1 ${
              activeTab === 'note' ? 'bg-stargold-400 text-midnight-950 font-bold' : 'text-lavender-300 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>Note</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`py-2 rounded-xl font-medium transition-all flex flex-col items-center gap-1 ${
              activeTab === 'task' ? 'bg-stargold-400 text-midnight-950 font-bold' : 'text-lavender-300 hover:text-white'
            }`}
          >
            <CheckSquare size={14} />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`py-2 rounded-xl font-medium transition-all flex flex-col items-center gap-1 ${
              activeTab === 'calendar' ? 'bg-stargold-400 text-midnight-950 font-bold' : 'text-lavender-300 hover:text-white'
            }`}
          >
            <Calendar size={14} />
            <span>Class</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`py-2 rounded-xl font-medium transition-all flex flex-col items-center gap-1 ${
              activeTab === 'youtube' ? 'bg-stargold-400 text-midnight-950 font-bold' : 'text-lavender-300 hover:text-white'
            }`}
          >
            <Video size={14} />
            <span>Video</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeTab === 'note' && (
            <>
              <div>
                <label className="block text-xs text-lavender-200 mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valuation Mechanics WACC Notes"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-lavender-200 mb-1">Subject</label>
                <select
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                >
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-lavender-200 mb-1">Quick Content</label>
                <textarea
                  rows={3}
                  placeholder="Bullet points or key formula..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>
            </>
          )}

          {activeTab === 'task' && (
            <>
              <div>
                <label className="block text-xs text-lavender-200 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finish Market Research Survey Deck"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-lavender-200 mb-1">Subject</label>
                <select
                  value={taskSubject}
                  onChange={(e) => setTaskSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                >
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Day</label>
                  <select
                    value={taskDay}
                    onChange={(e) => setTaskDay(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'calendar' && (
            <>
              <div>
                <label className="block text-xs text-lavender-200 mb-1">Class / Seminar Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Microeconomics Lecture"
                  value={calTitle}
                  onChange={(e) => setCalTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Day of Week</label>
                  <select
                    value={calDay}
                    onChange={(e) => setCalDay(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Room</label>
                  <input
                    type="text"
                    value={calRoom}
                    onChange={(e) => setCalRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'youtube' && (
            <>
              <div>
                <label className="block text-xs text-lavender-200 mb-1">YouTube URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-lavender-200 mb-1">Lecture Title</label>
                <input
                  type="text"
                  placeholder="e.g. Stanford Case Analysis"
                  value={ytTitle}
                  onChange={(e) => setYtTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-lavender-400/20">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs text-lavender-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs"
            >
              Add to Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
