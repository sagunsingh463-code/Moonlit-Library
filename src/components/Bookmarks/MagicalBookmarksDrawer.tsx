import React from 'react';
import { NoteItem, QuestionItem, ViewMode } from '../../types';
import { X, Bookmark, ExternalLink, Moon, Sparkles, BookOpen, HelpCircle } from 'lucide-react';
import { sound } from '../../services/audio';

interface MagicalBookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteItem[];
  questions: QuestionItem[];
  onNavigateToNote: (noteId: string) => void;
  onNavigateToQuestion: (questionId: string) => void;
}

export const MagicalBookmarksDrawer: React.FC<MagicalBookmarksDrawerProps> = ({
  isOpen,
  onClose,
  notes,
  questions,
  onNavigateToNote,
  onNavigateToQuestion
}) => {
  if (!isOpen) return null;

  const bookmarkedNotes = notes.filter(n => n.isBookmarked);
  const bookmarkedQuestions = questions.filter(q => q.isBookmarked);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-midnight-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md h-full glass-panel-glow border-l border-lavender-400/30 p-6 flex flex-col justify-between shadow-2xl animate-book-open">
        
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-lavender-400/20">
            <div className="flex items-center gap-2.5">
              {/* Illustrated Moon-Shaped Bookmark */}
              <div className="w-9 h-11 rounded-b-xl bg-gradient-to-b from-stargold-300 via-rosemoon-300 to-lavender-600 flex items-center justify-center shadow-moon-glow">
                <Moon className="w-4 h-4 text-midnight-950 fill-white" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-white">Magical Bookmarks</h2>
                <p className="text-[11px] text-lavender-300 font-sans">
                  {bookmarkedNotes.length + bookmarkedQuestions.length} Moonlit Anchors
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-lavender-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bookmarked Items List */}
          <div className="mt-5 space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-1">
            
            {/* Bookmarked Notes Section */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stargold-200 mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bookmarked Notes ({bookmarkedNotes.length})</span>
              </div>

              {bookmarkedNotes.length === 0 ? (
                <p className="text-xs text-lavender-400/70 italic px-2">No bookmarked notes yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {bookmarkedNotes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => {
                        sound.playPageTurn();
                        onNavigateToNote(note.id);
                        onClose();
                      }}
                      className="group p-3.5 rounded-2xl bg-midnight-900/70 hover:bg-lavender-600/20 border border-lavender-400/25 hover:border-stargold-400/50 cursor-pointer transition-all duration-200 flex items-start gap-3"
                    >
                      {/* Moon Ribbon Badge */}
                      <div 
                        className="w-3 h-8 rounded-b-md flex-shrink-0"
                        style={{ backgroundColor: note.bookmarkColor || '#FFE8A3' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase text-lavender-300/80">
                            {note.subject}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-lavender-400 group-hover:text-stargold-200 transition-colors" />
                        </div>
                        <h4 className="text-xs font-medium text-white truncate mt-0.5 group-hover:text-stargold-100">
                          {note.title}
                        </h4>
                        {note.bookmarkNote && (
                          <p className="text-[11px] text-stargold-200/90 italic mt-1 line-clamp-1">
                            "{note.bookmarkNote}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarked Questions Section */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rosemoon-300 mb-3">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Saved Questions ({bookmarkedQuestions.length})</span>
              </div>

              {bookmarkedQuestions.length === 0 ? (
                <p className="text-xs text-lavender-400/70 italic px-2">No saved questions yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {bookmarkedQuestions.map(q => (
                    <div
                      key={q.id}
                      onClick={() => {
                        sound.playSparkle();
                        onNavigateToQuestion(q.id);
                        onClose();
                      }}
                      className="group p-3.5 rounded-2xl bg-midnight-900/70 hover:bg-rosemoon-500/20 border border-lavender-400/25 hover:border-rosemoon-400/50 cursor-pointer transition-all duration-200 flex items-start gap-3"
                    >
                      <div className="w-3 h-8 rounded-b-md flex-shrink-0 bg-rosemoon-300" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase text-rosemoon-300">
                            {q.subject} • {q.difficulty}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-lavender-400 group-hover:text-rosemoon-200 transition-colors" />
                        </div>
                        <p className="text-xs text-lavender-100 line-clamp-2 mt-1 group-hover:text-white">
                          {q.question}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-4 border-t border-lavender-400/15 flex items-center justify-between text-[11px] text-lavender-400">
          <span>Click any item to jump directly to it</span>
          <Sparkles className="w-3.5 h-3.5 text-stargold-300" />
        </div>
      </div>
    </div>
  );
};
