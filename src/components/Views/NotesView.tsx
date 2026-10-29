import React, { useState } from 'react';
import { NoteItem } from '../../types';
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  Bookmark, 
  Check, 
  Search, 
  Calendar, 
  Edit3, 
  Eye, 
  Sparkles, 
  Download,
  Copy,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  CheckSquare,
  Code,
  Quote,
  Calculator
} from 'lucide-react';
import { sound } from '../../services/audio';

interface NotesViewProps {
  notes: NoteItem[];
  selectedNoteId?: string;
  onSaveNote: (note: NoteItem) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  selectedNoteId,
  onSaveNote,
  onDeleteNote
}) => {
  const [activeNoteId, setActiveNoteId] = useState<string>(
    selectedNoteId || (notes.length > 0 ? notes[0].id : '')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const subjects = ['All', ...Array.from(new Set(notes.map(n => n.subject)))];

  const filteredNotes = notes.filter(n => {
    const matchesSubject = selectedSubject === 'All' || n.subject === selectedSubject;
    const matchesSearch = !searchQuery || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const handleCreateNewNote = async () => {
    sound.playPageTurn();
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New Moonlit Grimoire Note',
      content: `# New MBA Topic\n\n### Core Intuition\nWrite your equations, frameworks, and case takeaways here...\n\n- Key Assumption 1\n- Key Assumption 2`,
      subject: 'Corporate Finance',
      tags: ['Study Notes', 'Frameworks'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isBookmarked: false,
      needsRevision: false,
      wordCount: 18
    };
    await onSaveNote(newNote);
    setActiveNoteId(newNote.id);
  };

  const handleDuplicateNote = async () => {
    if (!activeNote) return;
    sound.playSparkle();
    const dup: NoteItem = {
      ...activeNote,
      id: `note-${Date.now()}`,
      title: `${activeNote.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await onSaveNote(dup);
    setActiveNoteId(dup.id);
  };

  const handleExportNote = () => {
    if (!activeNote) return;
    sound.playPageTurn();
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleUpdateActiveNote = async (updates: Partial<NoteItem>) => {
    if (!activeNote) return;
    setIsSaving(true);
    const content = updates.content !== undefined ? updates.content : activeNote.content;
    const words = content.trim().split(/\s+/).filter(Boolean).length;

    const updated: NoteItem = {
      ...activeNote,
      ...updates,
      updatedAt: new Date().toISOString(),
      wordCount: words
    };
    await onSaveNote(updated);
    setTimeout(() => setIsSaving(false), 250);
  };

  // Markdown Toolbar Action Helper
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!activeNote) return;
    const textarea = document.getElementById('note-editor-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = activeNote.content;
    const selected = current.substring(start, end) || 'text';

    const replacement = `${prefix}${selected}${suffix}`;
    const nextContent = current.substring(0, start) + replacement + current.substring(end);

    handleUpdateActiveNote({ content: nextContent });
    sound.playPageTurn();

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const toggleBookmark = async () => {
    if (!activeNote) return;
    sound.playSparkle();
    await handleUpdateActiveNote({
      isBookmarked: !activeNote.isBookmarked,
      bookmarkColor: activeNote.isBookmarked ? undefined : '#FFE8A3'
    });
  };

  return (
    <div className="p-6 h-[calc(100vh-4rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <BookMarked className="w-6 h-6 text-stargold-300" />
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide text-glow">
              Grimoires & Study Notes
            </h1>
          </div>
          <p className="text-xs text-lavender-200/80 font-sans mt-0.5">
            Rich markdown notebook with formatting toolbar, moon bookmarks, and file exports.
          </p>
        </div>

        <button
          onClick={handleCreateNewNote}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Editor & List Split Pane */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
        
        {/* Left Notes Browser List (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl glass-panel-subtle border border-lavender-400/25 p-4 flex flex-col justify-between overflow-hidden">
          <div>
            {/* Search & Subject filter */}
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-lavender-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter grimoires..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-midnight-900 border border-lavender-400/25 text-white placeholder-lavender-400/60 text-xs focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
                {subjects.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSubject(s)}
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                      selectedSubject === s
                        ? 'bg-lavender-600 text-white font-medium'
                        : 'text-lavender-300 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Note items scrollable list */}
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-16rem)] pr-1">
              {filteredNotes.map(n => {
                const isActive = activeNote?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      sound.playPageTurn();
                      setActiveNoteId(n.id);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-gradient-to-r from-lavender-600/30 to-midnight-800/80 border-lavender-400/50 shadow-md'
                        : 'bg-midnight-900/60 border-lavender-400/15 hover:border-lavender-400/35'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stargold-300">
                        {n.subject}
                      </span>
                      {n.isBookmarked && (
                        <Bookmark className="w-3.5 h-3.5 text-stargold-300 fill-stargold-300" />
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-xs text-white truncate mt-1">
                      {n.title}
                    </h4>
                    <p className="text-[11px] text-lavender-300/70 line-clamp-1 mt-1 font-sans">
                      {n.content.replace(/^#+ /, '').slice(0, 80)}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-lavender-400/70 mt-2 pt-2 border-t border-lavender-400/10 font-mono">
                      <span>{n.wordCount || 0} words</span>
                      <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-center text-[11px] text-lavender-400/80">
            {filteredNotes.length} Grimoires recorded
          </div>
        </div>

        {/* Right Note Editor (8 cols) */}
        {activeNote ? (
          <div className="lg:col-span-8 rounded-3xl glass-panel-glow border border-lavender-400/30 p-6 flex flex-col justify-between overflow-hidden">
            <div>
              {/* Note Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-lavender-400/20 mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={activeNote.subject}
                    onChange={(e) => handleUpdateActiveNote({ subject: e.target.value })}
                    className="text-xs font-semibold uppercase tracking-wider bg-midnight-900 border border-lavender-400/30 text-stargold-200 px-3 py-1 rounded-xl focus:outline-none"
                  />
                  <span className="text-[11px] text-lavender-400 font-mono">
                    {activeNote.wordCount} words • ~{Math.max(1, Math.ceil(activeNote.wordCount / 180))}m read
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Moon Bookmark */}
                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-colors ${
                      activeNote.isBookmarked
                        ? 'bg-stargold-400/20 border-stargold-400/50 text-stargold-200'
                        : 'glass-panel-subtle text-lavender-300 hover:text-white'
                    }`}
                    title="Toggle illustrated moon bookmark"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${activeNote.isBookmarked ? 'fill-current' : ''}`} />
                    <span>{activeNote.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>

                  {/* Needs Revision Toggle */}
                  <button
                    onClick={() => handleUpdateActiveNote({ needsRevision: !activeNote.needsRevision })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      activeNote.needsRevision
                        ? 'bg-rosemoon-500/20 border-rosemoon-400/50 text-rosemoon-200'
                        : 'glass-panel-subtle text-lavender-300 hover:text-white'
                    }`}
                  >
                    {activeNote.needsRevision ? 'Needs Recall' : 'Mastered'}
                  </button>

                  {/* Duplicate Note */}
                  <button
                    onClick={handleDuplicateNote}
                    className="p-1.5 rounded-xl glass-panel-subtle text-lavender-300 hover:text-white"
                    title="Duplicate note"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Export / Download as MD */}
                  <button
                    onClick={handleExportNote}
                    className="p-1.5 rounded-xl glass-panel-subtle text-stargold-300 hover:text-white"
                    title="Download Note (.md)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Preview Toggle */}
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="p-1.5 rounded-xl glass-panel-subtle text-lavender-300 hover:text-white"
                    title={previewMode ? 'Edit Mode' : 'Preview Mode'}
                  >
                    {previewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  {/* Delete Note */}
                  <button
                    onClick={async () => {
                      await onDeleteNote(activeNote.id);
                      if (notes.length > 1) {
                        setActiveNoteId(notes.find(n => n.id !== activeNote.id)?.id || '');
                      }
                    }}
                    className="p-1.5 rounded-xl glass-panel-subtle text-lavender-400 hover:text-red-400"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                placeholder="Note Title..."
                className="w-full bg-transparent font-serif font-bold text-xl md:text-2xl text-white placeholder-lavender-400/50 focus:outline-none mb-3"
              />

              {/* Markdown Quick Formatting Toolbar */}
              {!previewMode && (
                <div className="flex items-center gap-1 p-1 rounded-xl bg-midnight-950/60 border border-lavender-400/15 mb-3 text-xs text-lavender-300 overflow-x-auto">
                  <button onClick={() => insertFormatting('**', '**')} className="p-1.5 rounded hover:bg-white/10 hover:text-white" title="Bold">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting('*', '*')} className="p-1.5 rounded hover:bg-white/10 hover:text-white" title="Italic">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting('# ')} className="p-1.5 rounded hover:bg-white/10 hover:text-white" title="Heading 1">
                    <Heading1 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting('## ')} className="p-1.5 rounded hover:bg-white/10 hover:text-white" title="Heading 2">
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting('- ')} className="p-1.5 rounded hover:bg-white/10 hover:text-white" title="Bullet List">
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting('- [ ] ')} className="p-1.5 rounded hover:bg-white/10 hover:text-white" title="Checklist">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting('`', '`')} className="p-1.5 rounded hover:bg-white/10 hover:text-white" title="Inline Code">
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting('> ')} className="p-1.5 rounded hover:bg-white/10 hover:text-white" title="Quote">
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => insertFormatting('```text\nWACC = (E/V)*Re + (D/V)*Rd*(1-Tc)\n```\n')} className="p-1.5 rounded hover:bg-white/10 hover:text-white flex items-center gap-1 text-[11px]" title="Insert Formula">
                    <Calculator className="w-3.5 h-3.5 text-stargold-300" />
                    <span>Formula</span>
                  </button>
                </div>
              )}
            </div>

            {/* Note Content Editor / Preview */}
            <div className="flex-1 overflow-y-auto my-2 min-h-[300px]">
              {previewMode ? (
                <div className="prose prose-invert max-w-none text-sm text-lavender-100 leading-relaxed font-sans whitespace-pre-wrap bg-midnight-950/40 p-4 rounded-2xl border border-lavender-400/10">
                  {activeNote.content}
                </div>
              ) : (
                <textarea
                  id="note-editor-textarea"
                  value={activeNote.content}
                  onChange={(e) => handleUpdateActiveNote({ content: e.target.value })}
                  placeholder="Draft your MBA takeaways, DCF equations, frameworks..."
                  className="w-full h-full min-h-[320px] bg-transparent resize-none focus:outline-none text-sm text-lavender-100 font-mono leading-relaxed placeholder-lavender-400/40"
                />
              )}
            </div>

            {/* Footer Status */}
            <div className="pt-3 border-t border-lavender-400/15 flex items-center justify-between text-[11px] text-lavender-400">
              <span>{isSaving ? 'Saving changes...' : 'Saved to Moonlit Vault & Physical Database'}</span>
              <span className="font-mono">Last edited: {new Date(activeNote.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-8 rounded-3xl glass-panel-subtle text-lavender-400">
            Select or create a note to begin writing under the stars.
          </div>
        )}
      </div>
    </div>
  );
};
