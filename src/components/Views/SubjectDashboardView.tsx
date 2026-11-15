import React, { useState } from 'react';
import { 
  SubjectItem, 
  NoteItem, 
  FileItem, 
  AssignmentItem, 
  LectureItem, 
  QuestionItem, 
  CalendarEvent,
  YouTubeResource,
  ViewMode 
} from '../../types';
import { 
  ArrowLeft, 
  BookOpen, 
  FileText, 
  Video, 
  FileCheck2, 
  HelpCircle, 
  Database, 
  Gamepad2, 
  LineChart, 
  Calendar, 
  Upload, 
  Plus, 
  Sparkles, 
  Clock, 
  Download, 
  Eye, 
  CheckCircle2, 
  Play, 
  Trash2,
  Bookmark,
  Share2
} from 'lucide-react';
import { sound } from '../../services/sound';

interface SubjectDashboardViewProps {
  subject: SubjectItem;
  notes: NoteItem[];
  files: FileItem[];
  assignments: AssignmentItem[];
  lectures: LectureItem[];
  questions: QuestionItem[];
  calendarEvents: CalendarEvent[];
  youtubeResources: YouTubeResource[];
  onBack: () => void;
  onNavigateToView: (view: ViewMode) => void;
  onUploadFile: (file: File, subjectName: string) => Promise<void>;
  onOpenFileViewer: (file: FileItem) => void;
  onSaveYouTube: (resource: YouTubeResource) => Promise<void>;
  onDeleteYouTube: (id: string) => Promise<void>;
  onSaveSubject: (subject: SubjectItem) => Promise<void>;
}

export const SubjectDashboardView: React.FC<SubjectDashboardViewProps> = ({
  subject,
  notes,
  files,
  assignments,
  lectures,
  questions,
  calendarEvents,
  youtubeResources,
  onBack,
  onNavigateToView,
  onUploadFile,
  onOpenFileViewer,
  onSaveYouTube,
  onDeleteYouTube,
  onSaveSubject
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'notes' | 'youtube' | 'assignments' | 'quizzes' | 'questions' | 'games' | 'progress' | 'dates'
  >('overview');

  // Local state for YouTube modal
  const [isAddYtModalOpen, setIsAddYtModalOpen] = useState(false);
  const [ytUrl, setYtUrl] = useState('');
  const [ytTitle, setYtTitle] = useState('');
  const [ytPlaylist, setYtPlaylist] = useState('');
  const [activePlayingYt, setActivePlayingYt] = useState<YouTubeResource | null>(null);
  const [timestampNoteText, setTimestampNoteText] = useState('');
  const [timestampInput, setTimestampInput] = useState('00:00');

  // Drag and drop state for files
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // Filter items matching this subject
  const subjectNotes = notes.filter(n => n.subject?.toLowerCase() === subject.name.toLowerCase());
  const subjectFiles = files.filter(f => 
    f.folder?.toLowerCase() === subject.name.toLowerCase() || 
    (f.tags && f.tags.some(t => t.toLowerCase() === subject.name.toLowerCase()))
  );
  const subjectAssignments = assignments.filter(a => a.subject?.toLowerCase() === subject.name.toLowerCase());
  const subjectQuestions = questions.filter(q => q.subject?.toLowerCase() === subject.name.toLowerCase());
  const subjectEvents = calendarEvents.filter(e => e.subjectName?.toLowerCase() === subject.name.toLowerCase());
  const subjectYt = youtubeResources.filter(y => y.subjectName?.toLowerCase() === subject.name.toLowerCase());

  const tabs = [
    { id: 'overview', label: 'Overview & Syllabus', icon: BookOpen },
    { id: 'notes', label: `Materials & Files (${subjectFiles.length})`, icon: FileText },
    { id: 'youtube', label: `YouTube Centre (${subjectYt.length})`, icon: Video },
    { id: 'assignments', label: `Assignments (${subjectAssignments.length})`, icon: FileCheck2 },
    { id: 'quizzes', label: 'Quizzes & Practice', icon: HelpCircle },
    { id: 'questions', label: `Question Bank (${subjectQuestions.length})`, icon: Database },
    { id: 'games', label: 'Moonlight Arcade', icon: Gamepad2 },
    { id: 'progress', label: 'Progress Tracker', icon: LineChart },
    { id: 'dates', label: `Important Dates (${subjectEvents.length})`, icon: Calendar },
  ];

  // Helper to extract YouTube 11-char ID
  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleAddYouTubeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractYouTubeId(ytUrl);
    if (!videoId) {
      alert('Please enter a valid YouTube video URL');
      return;
    }

    sound.playCelestialChime();
    const newResource: YouTubeResource = {
      id: `yt-${Date.now()}`,
      subjectId: subject.id,
      subjectName: subject.name,
      title: ytTitle.trim() || `Lecture: ${subject.name}`,
      youtubeUrl: ytUrl.trim(),
      videoId,
      playlistName: ytPlaylist.trim() || 'Core Lectures',
      durationMinutes: 45,
      isWatched: false,
      notes: [],
      createdAt: new Date().toISOString()
    };

    await onSaveYouTube(newResource);
    setYtUrl('');
    setYtTitle('');
    setYtPlaylist('');
    setIsAddYtModalOpen(false);
  };

  const handleAddTimestampNote = async () => {
    if (!activePlayingYt || !timestampNoteText.trim()) return;
    sound.playCelestialChime();

    // parse mm:ss to seconds
    const parts = timestampInput.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
    else if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

    const newNote = {
      id: `note-${Date.now()}`,
      timestampSeconds: seconds,
      timestampDisplay: timestampInput,
      note: timestampNoteText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedYt: YouTubeResource = {
      ...activePlayingYt,
      notes: [...activePlayingYt.notes, newNote]
    };

    await onSaveYouTube(updatedYt);
    setActivePlayingYt(updatedYt);
    setTimestampNoteText('');
  };

  const handleFileUploadInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUploadedFiles(Array.from(e.target.files));
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processUploadedFiles = async (fileList: File[]) => {
    setIsUploading(true);
    setUploadFeedback(null);
    try {
      for (const f of fileList) {
        await onUploadFile(f, subject.name);
      }
      sound.playCelestialChime();
      setUploadFeedback(`Successfully uploaded ${fileList.length} file(s) into ${subject.name}!`);
    } catch (err: any) {
      setUploadFeedback(`Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadFeedback(null), 4000);
    }
  };

  const handleToggleSyllabusItem = async (index: number) => {
    sound.playCardClick();
    const updatedSyllabus = [...(subject.syllabus || [])];
    // Toggle marker in name or completion
    const currentComp = subject.completionPercentage || 0;
    const newComp = Math.min(100, currentComp + 10);
    await onSaveSubject({
      ...subject,
      completionPercentage: newComp
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Back button and Subject Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            sound.playCardClick();
            onBack();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-midnight-900/60 hover:bg-midnight-800 text-lavender-300 hover:text-white border border-lavender-400/20 transition-all text-xs font-serif"
        >
          <ArrowLeft size={16} />
          Back to Academic Terms
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-lavender-300">
          <span>TERM {subject.termNumber}</span>
          <span>•</span>
          <span className="text-stargold-300 font-bold">{subject.code}</span>
        </div>
      </div>

      {/* Main Subject Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-lavender-400/25 bg-gradient-to-r from-space-900/90 via-midnight-800/80 to-space-900/90">
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${subject.color || 'from-purple-500 to-pink-600'}`} />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.color || 'from-purple-500 to-pink-600'} flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0`}>
              {subject.code.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-lavender-500/10 text-stargold-300 text-xs font-mono font-bold border border-lavender-400/20">
                  {subject.code}
                </span>
                <span className="text-xs text-lavender-300/80">
                  {subject.credits} Academic Credits
                </span>
                {subject.professor && (
                  <span className="text-xs text-lavender-300/80 border-l border-lavender-400/20 pl-2">
                    Prof. {subject.professor}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                {subject.name}
              </h1>
              <p className="text-xs sm:text-sm text-lavender-300/80 mt-1 max-w-2xl">
                {subject.description}
              </p>
            </div>
          </div>

          {/* Quick Stats Box */}
          <div className="flex items-center gap-4 bg-midnight-950/60 p-4 rounded-2xl border border-lavender-400/15 shrink-0">
            <div>
              <div className="text-[10px] text-lavender-400 uppercase tracking-wider">Completion</div>
              <div className="text-2xl font-serif font-bold text-stargold-300">
                {subject.completionPercentage ?? 60}%
              </div>
            </div>
            <div className="h-8 w-px bg-lavender-400/20" />
            <div>
              <div className="text-[10px] text-lavender-400 uppercase tracking-wider">Materials</div>
              <div className="text-2xl font-serif font-bold text-white">
                {subjectFiles.length + subjectNotes.length}
              </div>
            </div>
          </div>
        </div>

        {/* 9 Tabs Scrollable Bar */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-lavender-400/15 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playCardClick();
                  setActiveTab(tab.id as any);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-lavender-500/30 text-stargold-300 border border-stargold-400/60 shadow-md'
                    : 'bg-midnight-900/40 text-lavender-300 hover:text-white hover:bg-midnight-800/60 border border-lavender-400/10'
                }`}
              >
                <Icon size={14} className={isSelected ? 'text-stargold-300' : 'text-lavender-400'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW & SYLLABUS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-lavender-400/20 space-y-4">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <BookOpen size={18} className="text-stargold-300" />
                Syllabus & Core Modules
              </h3>
              <p className="text-xs text-lavender-300/80">
                Click topics as you master them to automatically update your term progress.
              </p>

              <div className="space-y-2.5 pt-2">
                {(subject.syllabus || ['Overview', 'Fundamentals', 'Advanced Cases', 'Practical Application']).map((topic, i) => (
                  <div
                    key={i}
                    onClick={() => handleToggleSyllabusItem(i)}
                    className="p-3.5 rounded-2xl bg-midnight-950/40 border border-lavender-400/15 hover:border-stargold-400/40 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-lavender-500/10 text-stargold-300 text-xs font-mono font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm text-white font-medium group-hover:text-stargold-200">
                        {topic}
                      </span>
                    </div>
                    <CheckCircle2 size={18} className="text-emerald-400 opacity-80 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('notes')}
                className="glass-panel p-4 rounded-2xl border border-lavender-400/20 hover:border-stargold-400/40 text-center space-y-2 hover:scale-105 transition-all"
              >
                <Upload size={20} className="mx-auto text-stargold-300" />
                <div className="text-xs font-serif font-bold text-white">Upload PDFs</div>
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className="glass-panel p-4 rounded-2xl border border-lavender-400/20 hover:border-stargold-400/40 text-center space-y-2 hover:scale-105 transition-all"
              >
                <Video size={20} className="mx-auto text-pink-400" />
                <div className="text-xs font-serif font-bold text-white">Watch Lectures</div>
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className="glass-panel p-4 rounded-2xl border border-lavender-400/20 hover:border-stargold-400/40 text-center space-y-2 hover:scale-105 transition-all"
              >
                <Gamepad2 size={20} className="mx-auto text-purple-400" />
                <div className="text-xs font-serif font-bold text-white">Arcade Wheel</div>
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className="glass-panel p-4 rounded-2xl border border-lavender-400/20 hover:border-stargold-400/40 text-center space-y-2 hover:scale-105 transition-all"
              >
                <HelpCircle size={20} className="mx-auto text-emerald-400" />
                <div className="text-xs font-serif font-bold text-white">Quiz Practice</div>
              </button>
            </div>
          </div>

          {/* Sidebar Info Card */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-lavender-400/20 space-y-4">
              <h3 className="text-base font-serif font-bold text-white">Course Credentials</h3>
              <div className="space-y-3 text-xs text-lavender-300">
                <div className="flex justify-between pb-2 border-b border-lavender-400/15">
                  <span className="text-lavender-400">Department</span>
                  <span className="font-semibold text-white">MBA Core</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-lavender-400/15">
                  <span className="text-lavender-400">Credits</span>
                  <span className="font-mono text-stargold-300 font-bold">{subject.credits} Credits</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-lavender-400/15">
                  <span className="text-lavender-400">Term Schedule</span>
                  <span className="text-white">Term {subject.termNumber}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-lavender-400/15">
                  <span className="text-lavender-400">Instructor</span>
                  <span className="text-white">{subject.professor || 'Visiting Faculty'}</span>
                </div>
              </div>
            </div>

            {/* Upcoming subject events */}
            <div className="glass-panel p-6 rounded-3xl border border-lavender-400/20 space-y-3">
              <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Calendar size={16} className="text-stargold-300" />
                Class Schedule & Deadlines
              </h3>
              {subjectEvents.length === 0 ? (
                <p className="text-xs text-lavender-400">No scheduled sessions or exams recorded.</p>
              ) : (
                <div className="space-y-2">
                  {subjectEvents.slice(0, 3).map((evt) => (
                    <div key={evt.id} className="p-2.5 rounded-xl bg-midnight-950/40 border border-lavender-400/15 text-xs">
                      <div className="font-serif font-bold text-white">{evt.title}</div>
                      <div className="text-[11px] text-stargold-300 mt-0.5">
                        {evt.dayOfWeek || evt.date} • {evt.startTime} - {evt.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NOTES & MATERIALS (DRAG & DROP + IN-APP VIEWER) */}
      {activeTab === 'notes' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`glass-panel p-8 rounded-3xl border-2 border-dashed transition-all text-center space-y-3 ${
              isDragging
                ? 'border-stargold-400 bg-lavender-500/20 scale-[1.01]'
                : 'border-lavender-400/30 hover:border-lavender-400/60 bg-midnight-950/40'
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-lavender-500/15 flex items-center justify-center text-stargold-300">
              <Upload size={24} />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Drag & Drop PDF, PPTX, DOCX, XLSX, CSV, or Notes
              </h3>
              <p className="text-xs text-lavender-300/70 mt-1 max-w-md mx-auto">
                Files dropped here are automatically categorized into "{subject.name}".
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs cursor-pointer hover:scale-105 transition-all shadow-md">
              <Plus size={16} />
              Choose Files from Phone or Laptop
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,image/*"
                onChange={handleFileUploadInput}
                className="hidden"
              />
            </label>

            {isUploading && (
              <div className="text-xs text-stargold-300 animate-pulse font-mono">
                Uploading and saving materials to {subject.name}...
              </div>
            )}
            {uploadFeedback && (
              <div className="text-xs text-emerald-300 font-medium">
                {uploadFeedback}
              </div>
            )}
          </div>

          {/* Files List */}
          <div className="space-y-3">
            <h3 className="text-base font-serif font-bold text-white">
              Course Documents & Study Materials ({subjectFiles.length})
            </h3>

            {subjectFiles.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-lavender-400 text-xs border border-lavender-400/15">
                No files uploaded yet for {subject.name}. Drop a PDF syllabus, case study, or presentation above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectFiles.map((file) => (
                  <div
                    key={file.id}
                    className="glass-panel p-4 rounded-2xl border border-lavender-400/20 bg-midnight-950/60 hover:border-stargold-400/40 flex flex-col justify-between group transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-lavender-500/15 text-stargold-300 flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-serif font-bold text-white truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <span className="text-[10px] text-lavender-400 uppercase font-mono">
                          {file.type || 'Document'} • {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-lavender-400/15">
                      <button
                        onClick={() => onOpenFileViewer(file)}
                        className="inline-flex items-center gap-1.5 text-xs text-stargold-300 hover:text-stargold-200 font-medium"
                      >
                        <Eye size={14} />
                        Read In-App
                      </button>
                      <a
                        href={file.serverUrl || file.dataUrl || '#'}
                        download={file.name}
                        className="p-1.5 rounded-lg text-lavender-400 hover:text-white hover:bg-lavender-500/20 transition-colors"
                        title="Download"
                      >
                        <Download size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: YOUTUBE VIDEO LECTURES & TIMESTAMP NOTES */}
      {activeTab === 'youtube' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Video size={18} className="text-pink-400" />
                Curated YouTube Lectures for {subject.name}
              </h3>
              <p className="text-xs text-lavender-300/80 mt-0.5">
                Watch full lectures in-app with synchronized timestamp note-taking.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playCardClick();
                setIsAddYtModalOpen(true);
              }}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs inline-flex items-center gap-1.5 hover:scale-105 transition-all shadow-md"
            >
              <Plus size={16} />
              Add YouTube URL
            </button>
          </div>

          {/* Active Player if selected */}
          {activePlayingYt && (
            <div className="glass-panel p-6 rounded-3xl border border-stargold-400/40 bg-midnight-950/80 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Play size={16} className="text-pink-400" />
                  Now Playing: {activePlayingYt.title}
                </h4>
                <button
                  onClick={() => setActivePlayingYt(null)}
                  className="text-xs text-lavender-400 hover:text-white"
                >
                  Close Player ✕
                </button>
              </div>

              {/* Responsive 16:9 Embedded YouTube Iframe */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-lavender-400/30 bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activePlayingYt.videoId}?enablejsapi=1&autoplay=1`}
                  title={activePlayingYt.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Timestamp Notes authoring */}
              <div className="pt-3 border-t border-lavender-400/20 space-y-3">
                <h5 className="text-xs font-serif font-bold text-stargold-300 uppercase tracking-wider">
                  Personal Timestamped Notes
                </h5>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="mm:ss (e.g. 05:20)"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs font-mono"
                  />
                  <input
                    type="text"
                    placeholder="Key insight or formula explained at this timestamp..."
                    value={timestampNoteText}
                    onChange={(e) => setTimestampNoteText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs"
                  />
                  <button
                    onClick={handleAddTimestampNote}
                    className="px-4 py-1.5 rounded-xl bg-lavender-500/30 hover:bg-lavender-500/50 text-white font-medium text-xs border border-lavender-400/30"
                  >
                    Save Note
                  </button>
                </div>

                {/* Display recorded notes */}
                {activePlayingYt.notes && activePlayingYt.notes.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    {activePlayingYt.notes.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-midnight-900/50 border border-lavender-400/15 flex items-start justify-between text-xs">
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-stargold-300 bg-lavender-500/10 px-1.5 py-0.5 rounded text-[11px]">
                            {n.timestampDisplay}
                          </span>
                          <span className="text-lavender-200">{n.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* YouTube Video Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjectYt.map((yt) => (
              <div
                key={yt.id}
                onClick={() => {
                  sound.playCardClick();
                  setActivePlayingYt(yt);
                }}
                className="glass-panel rounded-2xl overflow-hidden border border-lavender-400/20 hover:border-pink-400/50 bg-midnight-950/60 cursor-pointer group transition-all hover:scale-[1.02]"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-midnight-950 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${yt.videoId}/hqdefault.jpg`}
                    alt={yt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={18} className="translate-x-0.5" />
                    </div>
                  </div>
                  {yt.isWatched && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/90 text-midnight-950 font-bold text-[10px]">
                      Watched ✓
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-mono text-lavender-400 uppercase">
                    {yt.playlistName || 'Course Lecture'}
                  </span>
                  <h4 className="text-sm font-serif font-bold text-white line-clamp-2 group-hover:text-pink-300 transition-colors">
                    {yt.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-lavender-300/80 pt-2 border-t border-lavender-400/15">
                    <span>{yt.notes?.length || 0} Timestamp Notes</span>
                    <span className="text-stargold-300 font-medium">Play in App →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add YouTube Modal */}
          {isAddYtModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
              <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-lavender-400/30 bg-midnight-900/95 space-y-4">
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Video size={18} className="text-pink-400" />
                  Add YouTube Lecture to {subject.name}
                </h3>

                <form onSubmit={handleAddYouTubeSubmit} className="space-y-3">
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
                      placeholder="e.g. RICE Prioritization Deep Dive"
                      value={ytTitle}
                      onChange={(e) => setYtTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-lavender-200 mb-1">Playlist / Module Group</label>
                    <input
                      type="text"
                      placeholder="e.g. Sprint 2 Videos"
                      value={ytPlaylist}
                      onChange={(e) => setYtPlaylist(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-lavender-400/20">
                    <button
                      type="button"
                      onClick={() => setIsAddYtModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl text-xs text-lavender-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs"
                    >
                      Save Lecture
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <FileCheck2 size={18} className="text-stargold-300" />
            Subject Assignments & Submissions
          </h3>

          {subjectAssignments.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-lavender-400 text-xs border border-lavender-400/15">
              No assignments recorded for {subject.name}.
            </div>
          ) : (
            <div className="space-y-3">
              {subjectAssignments.map((a) => (
                <div key={a.id} className="glass-panel p-5 rounded-2xl border border-lavender-400/20 bg-midnight-950/60 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.status === 'graded' ? 'bg-emerald-500/20 text-emerald-300' :
                        a.status === 'submitted' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {a.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-lavender-400">Due: {a.dueDate}</span>
                    </div>
                    <h4 className="text-base font-serif font-bold text-white">{a.title}</h4>
                    <p className="text-xs text-lavender-300/80 mt-0.5">{a.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {a.grade && <div className="text-lg font-mono font-bold text-stargold-300">{a.grade}</div>}
                    <div className="text-[11px] text-lavender-400">{a.weightage || '20% Weight'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5 & 7: QUIZZES & LEARNING GAMES */}
      {(activeTab === 'quizzes' || activeTab === 'games') && (
        <div className="glass-panel p-8 rounded-3xl border border-lavender-400/25 bg-midnight-950/70 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-stargold-400 to-amber-500 flex items-center justify-center text-midnight-950 shadow-lg shadow-stargold-400/20">
            <Gamepad2 size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            Play Moonlight Arcade: {subject.name} Challenge
          </h3>
          <p className="text-xs sm:text-sm text-lavender-300 max-w-md mx-auto">
            Take a 50-Question Challenge, test yourself in Memory Match, or practice Flashcards dedicated to {subject.name}.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToView('arcade')}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-stargold-400/20 flex items-center gap-2"
            >
              <Sparkles size={18} />
              Launch Moonlight Arcade
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: QUESTION BANK */}
      {activeTab === 'questions' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Database size={18} className="text-stargold-300" />
            Subject Question Bank ({subjectQuestions.length} Questions)
          </h3>
          <div className="space-y-3">
            {subjectQuestions.map((q, idx) => (
              <div key={q.id} className="glass-panel p-5 rounded-2xl border border-lavender-400/20 bg-midnight-950/60 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-stargold-300 font-bold">Q{idx + 1} • {q.topic}</span>
                  <span className="px-2 py-0.5 rounded bg-lavender-500/10 text-lavender-300 text-[10px]">
                    {q.difficulty}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-white">{q.question}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl text-xs border ${
                        i === q.correctOptionIndex
                          ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200 font-semibold'
                          : 'border-lavender-400/15 bg-midnight-900/40 text-lavender-300'
                      }`}
                    >
                      {opt} {i === q.correctOptionIndex && '✓'}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-lavender-400/80 pt-1 border-t border-lavender-400/10">
                  <strong className="text-stargold-300">Explanation:</strong> {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: PROGRESS TRACKER */}
      {activeTab === 'progress' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-lavender-400/20 bg-midnight-950/70 space-y-6 animate-fadeIn">
          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <LineChart size={18} className="text-stargold-300" />
            Mastery & Progress Tracker
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-midnight-900/60 border border-lavender-400/15 text-center space-y-1">
              <div className="text-xs text-lavender-400">Completion Score</div>
              <div className="text-3xl font-serif font-bold text-stargold-300">
                {subject.completionPercentage ?? 60}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-midnight-900/60 border border-lavender-400/15 text-center space-y-1">
              <div className="text-xs text-lavender-400">Total Notes & Files</div>
              <div className="text-3xl font-serif font-bold text-white">
                {subjectFiles.length + subjectNotes.length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-midnight-900/60 border border-lavender-400/15 text-center space-y-1">
              <div className="text-xs text-lavender-400">Lectures Curated</div>
              <div className="text-3xl font-serif font-bold text-white">
                {subjectYt.length}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-lavender-300">Adjust Completion Percentage Manual Slider:</label>
            <input
              type="range"
              min={0}
              max={100}
              value={subject.completionPercentage ?? 60}
              onChange={async (e) => {
                await onSaveSubject({
                  ...subject,
                  completionPercentage: Number(e.target.value)
                });
              }}
              className="w-full accent-stargold-400 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* TAB 9: IMPORTANT DATES */}
      {activeTab === 'dates' && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Calendar size={18} className="text-stargold-300" />
            Calendar Dates & Lecture Schedules
          </h3>
          <div className="space-y-3">
            {subjectEvents.map((evt) => (
              <div key={evt.id} className="glass-panel p-5 rounded-2xl border border-lavender-400/20 bg-midnight-950/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-stargold-300 uppercase px-2 py-0.5 rounded bg-lavender-500/10">
                    {evt.type}
                  </span>
                  <h4 className="text-base font-serif font-bold text-white mt-1">{evt.title}</h4>
                  <p className="text-xs text-lavender-300/80">Room: {evt.room || 'TBD'} • Prof: {evt.professor || 'Instructor'}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-stargold-300">{evt.dayOfWeek || evt.date}</div>
                  <div className="text-xs text-lavender-400">{evt.startTime} - {evt.endTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
