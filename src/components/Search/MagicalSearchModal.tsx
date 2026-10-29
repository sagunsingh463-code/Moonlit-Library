import React, { useState, useEffect, useRef } from 'react';
import { 
  FileItem, 
  NoteItem, 
  AssignmentItem, 
  LectureItem, 
  QuestionItem, 
  ViewMode 
} from '../../types';
import { 
  Search, 
  X, 
  FileText, 
  BookMarked, 
  FileCheck2, 
  GraduationCap, 
  HelpCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { sound } from '../../services/audio';

interface MagicalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileItem[];
  notes: NoteItem[];
  assignments: AssignmentItem[];
  lectures: LectureItem[];
  questions: QuestionItem[];
  onNavigate: (view: ViewMode, itemId?: string) => void;
}

export const MagicalSearchModal: React.FC<MagicalSearchModalProps> = ({
  isOpen,
  onClose,
  files,
  notes,
  assignments,
  lectures,
  questions,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global hotkey Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Search results compilation
  const matchedNotes = q ? notes.filter(n => 
    n.title.toLowerCase().includes(q) || 
    n.content.toLowerCase().includes(q) || 
    n.subject.toLowerCase().includes(q) ||
    n.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4) : [];

  const matchedFiles = q ? files.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.category.toLowerCase().includes(q) ||
    (f.description && f.description.toLowerCase().includes(q)) ||
    f.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 4) : [];

  const matchedAssignments = q ? assignments.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.subject.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchedLectures = q ? lectures.filter(l =>
    l.title.toLowerCase().includes(q) ||
    l.subject.toLowerCase().includes(q) ||
    l.keyTakeaways.some(t => t.toLowerCase().includes(q))
  ).slice(0, 3) : [];

  const matchedQuestions = q ? questions.filter(quest =>
    quest.question.toLowerCase().includes(q) ||
    quest.subject.toLowerCase().includes(q) ||
    quest.topic.toLowerCase().includes(q) ||
    quest.explanation.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const totalResults = matchedNotes.length + matchedFiles.length + matchedAssignments.length + matchedLectures.length + matchedQuestions.length;

  const handleSelect = (view: ViewMode, itemId?: string) => {
    sound.playPageTurn();
    onNavigate(view, itemId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-midnight-950/80 backdrop-blur-md animate-book-open">
      <div className="w-full max-w-2xl rounded-3xl glass-panel-glow border border-lavender-400/30 shadow-[0_0_50px_rgba(117,78,208,0.35)] overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-lavender-400/20">
          <Search className="w-5 h-5 text-stargold-300 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all files, notes, assignments, lectures, quizzes..."
            className="w-full bg-transparent text-white placeholder-lavender-300/50 text-base focus:outline-none font-sans"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 text-lavender-400 hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-[10px] rounded bg-midnight-900 border border-lavender-400/30 text-lavender-300 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-lavender-300/60 text-xs">
              <Sparkles className="w-8 h-8 text-stargold-400/40 mx-auto mb-2 animate-pulse" />
              <p className="font-serif text-sm text-lavender-200">What wisdom are you seeking tonight?</p>
              <p className="mt-1">Type keywords like "WACC", "Valuation", "Porter", "Supply Chain", or "Quiz".</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-lavender-300/60 text-xs">
              <p className="font-serif text-sm text-lavender-200">No whispers found for "{query}"</p>
              <p className="mt-1">Try searching for other terms or check your spelling.</p>
            </div>
          ) : (
            <>
              {/* Notes Results */}
              {matchedNotes.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stargold-300 px-2 block mb-1.5">
                    Notes ({matchedNotes.length})
                  </span>
                  <div className="space-y-1">
                    {matchedNotes.map(n => (
                      <div
                        key={n.id}
                        onClick={() => handleSelect('notes', n.id)}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-lavender-600/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <BookMarked className="w-4 h-4 text-lavender-300 group-hover:text-stargold-300 flex-shrink-0" />
                          <div className="truncate">
                            <span className="text-xs font-medium text-white group-hover:text-stargold-100">{n.title}</span>
                            <span className="text-[10px] text-lavender-300/70 ml-2">({n.subject})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-lavender-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files Results */}
              {matchedFiles.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-lavender-300 px-2 block mb-1.5">
                    Files ({matchedFiles.length})
                  </span>
                  <div className="space-y-1">
                    {matchedFiles.map(f => (
                      <div
                        key={f.id}
                        onClick={() => handleSelect('files', f.id)}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-lavender-600/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-rosemoon-300 group-hover:text-stargold-300 flex-shrink-0" />
                          <div className="truncate">
                            <span className="text-xs font-medium text-white group-hover:text-stargold-100">{f.name}</span>
                            <span className="text-[10px] text-lavender-300/70 ml-2">({f.category})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-lavender-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments Results */}
              {matchedAssignments.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-rosemoon-300 px-2 block mb-1.5">
                    Assignments ({matchedAssignments.length})
                  </span>
                  <div className="space-y-1">
                    {matchedAssignments.map(a => (
                      <div
                        key={a.id}
                        onClick={() => handleSelect('assignments', a.id)}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-lavender-600/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileCheck2 className="w-4 h-4 text-stargold-300 flex-shrink-0" />
                          <div className="truncate">
                            <span className="text-xs font-medium text-white group-hover:text-stargold-100">{a.title}</span>
                            <span className="text-[10px] text-lavender-300/70 ml-2">({a.status})</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-lavender-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions Results */}
              {matchedQuestions.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-moonlight-shimmer px-2 block mb-1.5">
                    Practice Questions ({matchedQuestions.length})
                  </span>
                  <div className="space-y-1">
                    {matchedQuestions.map(qItem => (
                      <div
                        key={qItem.id}
                        onClick={() => handleSelect('question-bank', qItem.id)}
                        className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-lavender-600/20 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <HelpCircle className="w-4 h-4 text-moonlight-shimmer flex-shrink-0" />
                          <p className="text-xs font-medium text-white truncate group-hover:text-stargold-100">
                            {qItem.question}
                          </p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-lavender-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-midnight-950/60 border-t border-lavender-400/15 flex items-center justify-between text-[11px] text-lavender-400">
          <span>{totalResults} items illuminated in your universe</span>
          <span className="flex items-center gap-1">Press ↵ to open</span>
        </div>
      </div>
    </div>
  );
};
