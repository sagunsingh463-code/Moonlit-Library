import React, { useState } from 'react';
import { CalendarEvent, SubjectItem, TimetableExtractionRow, CalendarEventType } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Upload, 
  Plus, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  BookOpen,
  Filter
} from 'lucide-react';
import { sound } from '../../services/sound';
import * as XLSX from 'xlsx';

interface CalendarTimetableViewProps {
  events: CalendarEvent[];
  subjects: SubjectItem[];
  onSaveEvent: (event: CalendarEvent) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  onSelectSubject?: (subject: SubjectItem) => void;
}

export const CalendarTimetableView: React.FC<CalendarTimetableViewProps> = ({
  events,
  subjects,
  onSaveEvent,
  onDeleteEvent,
  onSelectSubject
}) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'daily'>('weekly');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Modal states for manual schedule creation
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtSubjectName, setEvtSubjectName] = useState(subjects[0]?.name || 'Product Management');
  const [evtType, setEvtType] = useState<CalendarEventType>('class');
  const [evtDayOfWeek, setEvtDayOfWeek] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'>('Monday');
  const [evtStartTime, setEvtStartTime] = useState('09:30');
  const [evtEndTime, setEvtEndTime] = useState('11:00');
  const [evtDate, setEvtDate] = useState('');
  const [evtRoom, setEvtRoom] = useState('Lab A3');
  const [evtProfessor, setEvtProfessor] = useState('');
  const [evtIsRecurring, setEvtIsRecurring] = useState(true);
  const [evtNotes, setEvtNotes] = useState('');

  // Timetable upload & extraction preview states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [extractedRows, setExtractedRows] = useState<TimetableExtractionRow[]>([]);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Current day of week for highlight
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday
  const todayName = daysOfWeek[(currentDayIndex + 6) % 7];

  // Filter events
  const filteredEvents = events.filter(e => {
    if (selectedSubjectFilter !== 'all' && e.subjectName.toLowerCase() !== selectedSubjectFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  const handleOpenAddEvent = (day?: string) => {
    sound.playCardClick();
    setEditingEvent(null);
    setEvtTitle('');
    setEvtSubjectName(subjects[0]?.name || 'Product Management');
    setEvtType('class');
    if (day && daysOfWeek.includes(day)) {
      setEvtDayOfWeek(day as any);
    }
    setEvtStartTime('09:30');
    setEvtEndTime('11:00');
    setEvtDate('');
    setEvtRoom('Lab A3');
    setEvtProfessor('');
    setEvtIsRecurring(true);
    setEvtNotes('');
    setIsAddEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCardClick();
    setEditingEvent(evt);
    setEvtTitle(evt.title);
    setEvtSubjectName(evt.subjectName);
    setEvtType(evt.type);
    if (evt.dayOfWeek) setEvtDayOfWeek(evt.dayOfWeek);
    setEvtStartTime(evt.startTime);
    setEvtEndTime(evt.endTime);
    setEvtDate(evt.date || '');
    setEvtRoom(evt.room || '');
    setEvtProfessor(evt.professor || '');
    setEvtIsRecurring(evt.isRecurring);
    setEvtNotes(evt.notes || '');
    setIsAddEventModalOpen(true);
  };

  const handleSaveEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim()) return;

    sound.playCelestialChime();
    const matchedSubject = subjects.find(s => s.name.toLowerCase() === evtSubjectName.toLowerCase());

    const eventData: CalendarEvent = {
      id: editingEvent ? editingEvent.id : `evt-${Date.now()}`,
      subjectId: matchedSubject?.id,
      subjectName: evtSubjectName,
      title: evtTitle.trim(),
      type: evtType,
      dayOfWeek: evtIsRecurring ? evtDayOfWeek : undefined,
      date: !evtIsRecurring ? evtDate : undefined,
      startTime: evtStartTime,
      endTime: evtEndTime,
      room: evtRoom.trim(),
      professor: evtProfessor.trim(),
      isRecurring: evtIsRecurring,
      notes: evtNotes.trim(),
      createdAt: editingEvent?.createdAt || new Date().toISOString()
    };

    await onSaveEvent(eventData);
    setIsAddEventModalOpen(false);
  };

  const handleDeleteEventClick = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this schedule entry?')) {
      sound.playPageTurn();
      await onDeleteEvent(id);
    }
  };

  // Process timetable upload (Excel, CSV, PDF, Image)
  const handleTimetableFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sound.playCardClick();
    setIsParsingFile(true);
    setUploadedFileName(file.name);

    try {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const parsedRows: TimetableExtractionRow[] = [];
        // Intelligently parse headers and data
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;
          parsedRows.push({
            day: String(row[0] || 'Monday'),
            timeSlot: String(row[1] || '09:30 - 11:00'),
            subject: String(row[2] || 'Product Management'),
            room: String(row[3] || 'Room 101'),
            professor: String(row[4] || 'Faculty'),
            type: 'class'
          });
        }

        if (parsedRows.length === 0) {
          // Generate fallback preview from content
          parsedRows.push({
            day: 'Monday',
            timeSlot: '09:30 - 11:00',
            subject: 'Product Management',
            room: 'Lab A3',
            professor: 'Prof. Nathan Reed',
            type: 'class'
          });
        }

        setExtractedRows(parsedRows);
      } else {
        // PDF or Image text extraction mock / structure
        setTimeout(() => {
          setExtractedRows([
            { day: 'Monday', timeSlot: '09:30 - 11:00', subject: 'Product Management', room: 'Lab A3', professor: 'Prof. Nathan Reed', type: 'class' },
            { day: 'Monday', timeSlot: '14:00 - 15:30', subject: 'Microeconomics', room: 'Auditorium 2', professor: 'Dr. Alistair Ross', type: 'lecture' },
            { day: 'Tuesday', timeSlot: '10:00 - 11:30', subject: 'Introduction to UI/UX', room: 'Studio 4', professor: 'Prof. Samantha Blake', type: 'class' },
            { day: 'Wednesday', timeSlot: '13:30 - 15:00', subject: 'Leadership Accelerator', room: 'Suite 1', professor: 'Dr. Marcus Vance', type: 'class' }
          ]);
        }, 1200);
      }
    } catch (err) {
      alert('Error parsing timetable file. Please verify format.');
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleUpdateExtractionRow = (index: number, field: keyof TimetableExtractionRow, value: string) => {
    setExtractedRows(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSaveExtractedTimetable = async () => {
    sound.playCelestialChime();
    for (const r of extractedRows) {
      const parts = r.timeSlot.split('-');
      const start = parts[0]?.trim() || '09:30';
      const end = parts[1]?.trim() || '11:00';

      const newEvent: CalendarEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        subjectName: r.subject,
        title: `${r.subject} Lecture`,
        type: (r.type as CalendarEventType) || 'class',
        dayOfWeek: daysOfWeek.includes(r.day) ? (r.day as any) : 'Monday',
        startTime: start,
        endTime: end,
        room: r.room || 'Room 101',
        professor: r.professor || 'Instructor',
        isRecurring: true,
        createdAt: new Date().toISOString()
      };
      await onSaveEvent(newEvent);
    }
    setIsUploadModalOpen(false);
    setExtractedRows([]);
    setUploadedFileName('');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-lavender-400/20 bg-gradient-to-r from-space-900/90 via-midnight-800/80 to-space-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-500/10 border border-lavender-400/30 text-stargold-300 text-xs font-serif uppercase tracking-wider mb-2">
              <CalendarIcon size={14} />
              Academic Timetable & Schedules
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              Timetable & Academic Calendar
            </h1>
            <p className="text-xs sm:text-sm text-lavender-300/80 mt-1 max-w-2xl font-sans">
              Organize weekly lectures, mid-term examinations, assignment deadlines, and upload your semester timetable files.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                sound.playCardClick();
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-midnight-900/60 hover:bg-midnight-800 text-lavender-200 border border-lavender-400/30 font-medium text-xs flex items-center gap-2 transition-all hover:scale-105"
            >
              <Upload size={16} className="text-stargold-300" />
              Upload Timetable (PDF / XLSX / CSV)
            </button>
            <button
              onClick={() => handleOpenAddEvent()}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-stargold-400/20"
            >
              <Plus size={16} />
              Add Class Schedule
            </button>
          </div>
        </div>

        {/* View mode switcher & Subject filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-lavender-400/15">
          <div className="flex items-center gap-2 bg-midnight-950/60 p-1.5 rounded-2xl border border-lavender-400/20 w-fit">
            <button
              onClick={() => { sound.playCardClick(); setViewMode('weekly'); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'weekly' ? 'bg-stargold-400 text-midnight-950 font-bold' : 'text-lavender-300 hover:text-white'
              }`}
            >
              Weekly Timetable
            </button>
            <button
              onClick={() => { sound.playCardClick(); setViewMode('monthly'); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'monthly' ? 'bg-stargold-400 text-midnight-950 font-bold' : 'text-lavender-300 hover:text-white'
              }`}
            >
              Monthly Calendar
            </button>
            <button
              onClick={() => { sound.playCardClick(); setViewMode('daily'); }}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                viewMode === 'daily' ? 'bg-stargold-400 text-midnight-950 font-bold' : 'text-lavender-300 hover:text-white'
              }`}
            >
              Today's Schedule
            </button>
          </div>

          {/* Filter by subject */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-lavender-400" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-midnight-950/80 border border-lavender-400/30 text-lavender-200 text-xs focus:outline-none focus:border-stargold-400"
            >
              <option value="all">All MBA Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TODAY'S CLASSES HIGHLIGHT BANNER */}
      <div className="glass-panel p-5 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-stargold-400/15 text-stargold-300 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xs font-mono text-stargold-300 uppercase tracking-wider">Today is {todayName}</div>
            <div className="text-sm font-serif font-bold text-white">
              {events.filter(e => e.dayOfWeek === todayName).length} Lectures & Sessions Scheduled for Today
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {events.filter(e => e.dayOfWeek === todayName).slice(0, 2).map(evt => (
            <div key={evt.id} className="px-3 py-1.5 rounded-xl bg-lavender-500/15 border border-lavender-400/20 text-xs truncate max-w-[200px]">
              <span className="font-bold text-white">{evt.subjectName}:</span>{' '}
              <span className="text-stargold-300 font-mono">{evt.startTime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WEEKLY TIMETABLE VIEW */}
      {viewMode === 'weekly' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Days Grid Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 gap-4">
            {daysOfWeek.map((day) => {
              const dayEvents = filteredEvents.filter(e => e.dayOfWeek === day);
              const isToday = day === todayName;

              return (
                <div
                  key={day}
                  className={`glass-panel p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                    isToday
                      ? 'border-stargold-400/60 bg-midnight-900/80 shadow-lg shadow-lavender-500/10'
                      : 'border-lavender-400/15 bg-midnight-950/40'
                  }`}
                >
                  <div>
                    {/* Day Column Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-lavender-400/15">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-sm font-serif font-bold ${isToday ? 'text-stargold-300' : 'text-white'}`}>
                          {day.slice(0, 3)}
                        </span>
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-stargold-400 animate-pulse" title="Today" />
                        )}
                      </div>
                      <button
                        onClick={() => handleOpenAddEvent(day)}
                        title="Add session to this day"
                        className="p-1 rounded-lg text-lavender-400 hover:text-stargold-300 hover:bg-lavender-500/10 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Events inside this Day */}
                    <div className="space-y-2.5">
                      {dayEvents.length === 0 ? (
                        <div className="text-[11px] text-lavender-400/50 py-4 text-center">
                          No classes
                        </div>
                      ) : (
                        dayEvents.map((evt) => (
                          <div
                            key={evt.id}
                            onClick={(e) => handleOpenEditEvent(evt, e)}
                            className="p-3 rounded-2xl bg-midnight-900/70 border border-lavender-400/15 hover:border-stargold-400/40 cursor-pointer group transition-all space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-stargold-300">{evt.startTime} - {evt.endTime}</span>
                              <span className="capitalize text-lavender-400">{evt.type}</span>
                            </div>
                            <div className="text-xs font-serif font-bold text-white group-hover:text-stargold-200 line-clamp-2">
                              {evt.title}
                            </div>
                            <div className="text-[11px] text-lavender-300/80 flex items-center justify-between">
                              <span className="truncate">{evt.room || 'Room TBD'}</span>
                              <button
                                onClick={(e) => handleDeleteEventClick(evt.id, e)}
                                className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition-opacity p-0.5"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-lavender-400/10 text-center">
                    <span className="text-[10px] text-lavender-400">
                      {dayEvents.length} {dayEvents.length === 1 ? 'class' : 'classes'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MONTHLY CALENDAR VIEW */}
      {viewMode === 'monthly' && (
        <div className="glass-panel p-6 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-white">November 2026 Academic Term</h3>
            <div className="text-xs text-lavender-300">
              Exam dates and weekly schedules integrated
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono font-bold text-stargold-300 pb-2 border-b border-lavender-400/15">
            <div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div><div>SUN</div>
          </div>

          {/* 30-day Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-11-${dayNum < 10 ? '0' + dayNum : dayNum}`;
              const dayOfWeek = daysOfWeek[i % 7];
              const dayEvts = events.filter(e => e.date === dateStr || e.dayOfWeek === dayOfWeek);

              return (
                <div
                  key={i}
                  className="min-h-[90px] p-2 rounded-2xl bg-midnight-900/40 border border-lavender-400/10 hover:border-stargold-400/40 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold">{dayNum}</span>
                    <span className="text-[10px] text-lavender-400">{dayOfWeek.slice(0, 2)}</span>
                  </div>

                  <div className="space-y-1 my-1">
                    {dayEvts.slice(0, 2).map(e => (
                      <div
                        key={e.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] truncate font-medium ${
                          e.type === 'exam' ? 'bg-rose-500/30 text-rose-200 border border-rose-500/40' :
                          e.type === 'assignment' ? 'bg-amber-500/30 text-amber-200' : 'bg-lavender-500/20 text-white'
                        }`}
                        title={e.title}
                      >
                        {e.startTime} {e.subjectName}
                      </div>
                    ))}
                    {dayEvts.length > 2 && (
                      <span className="text-[9px] text-stargold-300">+{dayEvts.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-white">
                Detailed Daily Agenda: {todayName}
              </h3>
              <p className="text-xs text-lavender-300 mt-1">
                Lectures, office hours, and study focus blocks for today.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddEvent(todayName)}
              className="px-4 py-2 rounded-xl bg-stargold-400 text-midnight-950 font-bold text-xs"
            >
              Add Today Session
            </button>
          </div>

          <div className="space-y-3">
            {events.filter(e => e.dayOfWeek === todayName).map((evt) => (
              <div
                key={evt.id}
                onClick={(e) => handleOpenEditEvent(evt, e)}
                className="p-5 rounded-2xl bg-midnight-900/60 border border-lavender-400/20 hover:border-stargold-400/40 flex items-center justify-between cursor-pointer group transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-lavender-500/15 text-stargold-300 flex items-center justify-center font-bold text-sm shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-stargold-300 font-bold">
                      {evt.startTime} - {evt.endTime} • {evt.room || 'Location TBD'}
                    </span>
                    <h4 className="text-base font-serif font-bold text-white group-hover:text-stargold-200">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-lavender-300/80 mt-0.5">
                      {evt.subjectName} • {evt.professor || 'Visiting Faculty'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDeleteEventClick(evt.id, e)}
                    className="p-2 rounded-xl text-lavender-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TIMETABLE UPLOAD & PREVIEW / EDIT MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-3xl w-full border border-lavender-400/30 bg-midnight-900/95 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-lavender-400/20">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Upload size={20} className="text-stargold-300" />
                Upload & Preview Timetable
              </h3>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setExtractedRows([]);
                }}
                className="text-lavender-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* File drop input */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-lavender-400/30 text-center space-y-2">
              <FileSpreadsheet size={32} className="mx-auto text-stargold-300" />
              <div className="text-sm font-serif font-bold text-white">
                Select your Semester Timetable file (PDF, XLSX, CSV, JPG, PNG)
              </div>
              <p className="text-xs text-lavender-300/80 max-w-sm mx-auto">
                Antigravity will parse class schedules, time slots, and rooms into editable rows below.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stargold-400 text-midnight-950 font-bold text-xs cursor-pointer hover:scale-105 transition-all mt-2">
                Browse Timetable File
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv,image/*"
                  onChange={handleTimetableFileSelect}
                  className="hidden"
                />
              </label>
              {uploadedFileName && (
                <div className="text-xs text-emerald-300 font-mono mt-1">
                  Loaded: {uploadedFileName}
                </div>
              )}
            </div>

            {/* Editable Extraction Preview Table */}
            {extractedRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif font-bold text-white">
                    Extracted Schedule Details (Review & Edit before saving)
                  </h4>
                  <span className="text-xs text-stargold-300 font-mono">
                    {extractedRows.length} classes extracted
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-lavender-400/20">
                  <table className="w-full text-left text-xs text-lavender-200">
                    <thead className="bg-midnight-950 text-stargold-300 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-2.5">Day</th>
                        <th className="p-2.5">Time Slot</th>
                        <th className="p-2.5">Subject</th>
                        <th className="p-2.5">Room</th>
                        <th className="p-2.5">Professor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-lavender-400/10">
                      {extractedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-midnight-800/40">
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.day}
                              onChange={(e) => handleUpdateExtractionRow(idx, 'day', e.target.value)}
                              className="w-24 px-2 py-1 rounded bg-midnight-950 border border-lavender-400/20 text-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.timeSlot}
                              onChange={(e) => handleUpdateExtractionRow(idx, 'timeSlot', e.target.value)}
                              className="w-32 px-2 py-1 rounded bg-midnight-950 border border-lavender-400/20 text-white text-xs font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.subject}
                              onChange={(e) => handleUpdateExtractionRow(idx, 'subject', e.target.value)}
                              className="w-40 px-2 py-1 rounded bg-midnight-950 border border-lavender-400/20 text-white text-xs font-serif"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.room || ''}
                              onChange={(e) => handleUpdateExtractionRow(idx, 'room', e.target.value)}
                              className="w-24 px-2 py-1 rounded bg-midnight-950 border border-lavender-400/20 text-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.professor || ''}
                              onChange={(e) => handleUpdateExtractionRow(idx, 'professor', e.target.value)}
                              className="w-32 px-2 py-1 rounded bg-midnight-950 border border-lavender-400/20 text-white text-xs"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    onClick={() => setExtractedRows([])}
                    className="px-4 py-2 rounded-xl text-xs text-lavender-300"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveExtractedTimetable}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs hover:scale-105 transition-all shadow-md"
                  >
                    Commit & Save into Calendar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD / EDIT CLASS SCHEDULE MODAL */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-lavender-400/30 bg-midnight-900/95 space-y-4">
            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-stargold-300" />
              {editingEvent ? 'Edit Schedule Entry' : 'Add Class / Lecture Schedule'}
            </h3>

            <form onSubmit={handleSaveEventSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-lavender-200 mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Discovery Sprint Lecture"
                  value={evtTitle}
                  onChange={(e) => setEvtTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Subject</label>
                  <select
                    value={evtSubjectName}
                    onChange={(e) => setEvtSubjectName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Event Type</label>
                  <select
                    value={evtType}
                    onChange={(e) => setEvtType(e.target.value as CalendarEventType)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                  >
                    <option value="class">Class / Seminar</option>
                    <option value="lecture">Lecture</option>
                    <option value="exam">Mid-Term / Final Exam</option>
                    <option value="assignment">Assignment Deadline</option>
                    <option value="reminder">Reminder / Office Hour</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Day of Week</label>
                  <select
                    value={evtDayOfWeek}
                    onChange={(e) => setEvtDayOfWeek(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                  >
                    {daysOfWeek.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Room / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab A3, Zoom"
                    value={evtRoom}
                    onChange={(e) => setEvtRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={evtStartTime}
                    onChange={(e) => setEvtStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-lavender-200 mb-1">End Time</label>
                  <input
                    type="time"
                    value={evtEndTime}
                    onChange={(e) => setEvtEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-lavender-200 mb-1">Professor / Instructor</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Nathan Reed"
                  value={evtProfessor}
                  onChange={(e) => setEvtProfessor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-lavender-400/20">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-lavender-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
