import React, { useState } from 'react';
import { QuestionItem } from '../../types';
import { 
  Database, 
  Plus, 
  Bookmark, 
  RotateCw, 
  CheckCircle, 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles,
  Layers,
  AlertCircle,
  Edit3,
  Trash2,
  X,
  Play
} from 'lucide-react';
import { sound } from '../../services/audio';

interface QuestionBankViewProps {
  questions: QuestionItem[];
  selectedQuestionId?: string;
  onSaveQuestion: (question: QuestionItem) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
  onBookmarkQuestion: (questionId: string) => Promise<void>;
  onRecordAttempt: (id: string, isCorrect: boolean) => Promise<void>;
  onStartIncorrectDrill?: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  questions,
  selectedQuestionId,
  onSaveQuestion,
  onDeleteQuestion,
  onBookmarkQuestion,
  onRecordAttempt,
  onStartIncorrectDrill
}) => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [filterView, setFilterView] = useState<'all' | 'bookmarked' | 'incorrect'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);

  // Form state
  const [newSubject, setNewSubject] = useState('Corporate Finance');
  const [newTopic, setNewTopic] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIdx, setCorrectIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<QuestionItem['difficulty']>('Medium');

  const subjects = ['All', ...Array.from(new Set(questions.map(q => q.subject)))];

  const incorrectCount = questions.filter(q => q.lastAnsweredCorrectly === false || (q.timesIncorrect || 0) > 0).length;
  const bookmarkedCount = questions.filter(q => q.isBookmarked).length;

  const filtered = questions.filter(q => {
    const matchesSub = selectedSubject === 'All' || q.subject === selectedSubject;
    const matchesDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    
    let matchesSpecial = true;
    if (filterView === 'bookmarked') matchesSpecial = q.isBookmarked;
    if (filterView === 'incorrect') matchesSpecial = q.lastAnsweredCorrectly === false || (q.timesIncorrect || 0) > 0;

    const matchesSearch = !searchQuery || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesDiff && matchesSpecial && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setNewSubject('Corporate Finance');
    setNewTopic('');
    setNewQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectIdx(0);
    setNewExplanation('');
    setNewDifficulty('Medium');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (q: QuestionItem) => {
    setEditingQuestion(q);
    setNewSubject(q.subject);
    setNewTopic(q.topic);
    setNewQuestionText(q.question);
    setOptions([...q.options]);
    setCorrectIdx(q.correctOptionIndex);
    setNewExplanation(q.explanation);
    setNewDifficulty(q.difficulty);
    setShowAddModal(true);
  };

  const handleSaveQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const targetOptions = options.map((opt, i) => opt.trim() || `Option ${String.fromCharCode(65 + i)}`);

    const qItem: QuestionItem = {
      id: editingQuestion ? editingQuestion.id : `q-${Date.now()}`,
      subject: newSubject,
      topic: newTopic || 'General Concept',
      question: newQuestionText,
      options: targetOptions,
      correctOptionIndex: correctIdx,
      explanation: newExplanation || 'Core fundamental principle.',
      difficulty: newDifficulty,
      isBookmarked: editingQuestion ? editingQuestion.isBookmarked : false,
      timesPracticed: editingQuestion ? editingQuestion.timesPracticed : 0,
      timesCorrect: editingQuestion ? editingQuestion.timesCorrect : 0,
      timesIncorrect: editingQuestion ? editingQuestion.timesIncorrect : 0,
      lastAnsweredCorrectly: editingQuestion ? editingQuestion.lastAnsweredCorrectly : undefined
    };

    await onSaveQuestion(qItem);
    sound.playSparkle();
    setShowAddModal(false);
    setEditingQuestion(null);
  };

  const getDifficultyColor = (diff: QuestionItem['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Medium':
        return 'bg-stargold-500/20 text-stargold-300 border-stargold-500/30';
      case 'Hard':
        return 'bg-rosemoon-500/20 text-rosemoon-300 border-rosemoon-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Database className="w-6 h-6 text-moonlight-shimmer" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              Question Bank & Grimoire
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            Store, edit, and organize practice questions. Drill incorrect answers to turn weaknesses into mastery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Flashcard Mode Toggle */}
          <button
            onClick={() => {
              sound.playPageTurn();
              setIsFlashcardMode(!isFlashcardMode);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
              isFlashcardMode
                ? 'bg-rosemoon-500/30 text-rosemoon-200 border-rosemoon-400/50 shadow-sm'
                : 'glass-panel-subtle text-lavender-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isFlashcardMode ? 'Flashcard Mode: ON' : 'Flashcard Mode'}</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Special Filters Row: All, Bookmarked, Incorrect Questions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl glass-panel-subtle text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterView('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterView === 'all'
                ? 'bg-lavender-600 text-white shadow-sm'
                : 'text-lavender-300 hover:text-white'
            }`}
          >
            All Questions ({questions.length})
          </button>

          <button
            onClick={() => setFilterView('bookmarked')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              filterView === 'bookmarked'
                ? 'bg-stargold-400/20 text-stargold-200 border border-stargold-400/40'
                : 'text-lavender-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-stargold-300" />
            <span>Bookmarked ({bookmarkedCount})</span>
          </button>

          <button
            onClick={() => setFilterView('incorrect')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              filterView === 'incorrect'
                ? 'bg-rosemoon-500/20 text-rosemoon-200 border border-rosemoon-400/40'
                : 'text-lavender-300 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rosemoon-300" />
            <span>Missed / Weak Topics ({incorrectCount})</span>
          </button>
        </div>

        {filterView === 'incorrect' && incorrectCount > 0 && onStartIncorrectDrill && (
          <button
            onClick={onStartIncorrectDrill}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rosemoon-500 to-amber-500 text-white font-serif font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Drill on Weak Topics</span>
          </button>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedSubject === s
                  ? 'bg-lavender-600 text-white shadow-sm'
                  : 'glass-panel-subtle text-lavender-300 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-midnight-900 border border-lavender-400/25 text-xs text-lavender-200 focus:outline-none"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-lavender-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-midnight-900 border border-lavender-400/25 text-white placeholder-lavender-400/60 text-xs focus:outline-none focus:border-stargold-400"
            />
          </div>
        </div>
      </div>

      {/* Cards List or Flashcard Grid */}
      {isFlashcardMode ? (
        /* Flashcard Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(q => {
            const isFlipped = flippedCardId === q.id;
            return (
              <div
                key={q.id}
                onClick={() => {
                  sound.playPageTurn();
                  setFlippedCardId(isFlipped ? null : q.id);
                }}
                className="min-h-[280px] p-6 rounded-3xl glass-panel-glow border border-lavender-400/30 cursor-pointer hover:border-stargold-400/50 transition-all duration-300 flex flex-col justify-between group shadow-xl relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-semibold text-stargold-300">
                      {q.subject} • {q.topic}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                  </div>

                  {!isFlipped ? (
                    <div>
                      <h4 className="font-serif font-bold text-base text-white leading-relaxed">
                        {q.question}
                      </h4>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-book-open">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-emerald-400 block mb-0.5">
                          Correct Answer:
                        </span>
                        <p className="text-xs font-serif font-bold text-white">
                          {q.options[q.correctOptionIndex]}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-midnight-950/70 border border-lavender-400/20 text-xs text-lavender-200/90 leading-relaxed font-sans">
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-lavender-400/15 flex items-center justify-between text-[11px] text-lavender-400">
                  <span className="flex items-center gap-1 group-hover:text-stargold-200 transition-colors">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>{isFlipped ? 'Tap to see prompt' : 'Tap to reveal answer'}</span>
                  </span>
                  
                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="p-1 hover:text-white"
                      title="Edit question"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onBookmarkQuestion(q.id)}
                      className="p-1 hover:text-stargold-300"
                      title="Bookmark"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${q.isBookmarked ? 'text-stargold-300 fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Standard Detailed List */
        <div className="space-y-4">
          {filtered.map(q => {
            const hasError = q.lastAnsweredCorrectly === false || (q.timesIncorrect || 0) > 0;
            return (
              <div
                key={q.id}
                className="p-5 rounded-3xl glass-panel-subtle border border-lavender-400/20 hover:border-lavender-400/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-semibold text-stargold-300">
                      {q.subject}
                    </span>
                    <span className="text-lavender-400 text-xs">•</span>
                    <span className="text-xs text-lavender-200 font-medium">{q.topic}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${getDifficultyColor(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    {hasError && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                        {q.timesIncorrect} Missed Attempts
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(q)}
                      className="p-1.5 rounded-lg glass-panel-subtle text-lavender-300 hover:text-white"
                      title="Edit question"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onBookmarkQuestion(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        q.isBookmarked
                          ? 'bg-stargold-400/20 text-stargold-300 border-stargold-400/40'
                          : 'text-lavender-400 border-lavender-400/15 hover:text-white'
                      }`}
                      title="Bookmark question"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${q.isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => onDeleteQuestion(q.id)}
                      className="p-1.5 rounded-lg glass-panel-subtle text-lavender-400 hover:text-red-400"
                      title="Delete question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-base text-white">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                        idx === q.correctOptionIndex
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                          : 'bg-midnight-900/50 border-lavender-400/10 text-lavender-300'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px] font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-lavender-300/80 italic font-sans pt-1">
                  Rationale: {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="p-8 text-center glass-panel-subtle rounded-3xl border border-lavender-400/20 text-lavender-400 text-xs">
          No questions found matching your filter criteria.
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-book-open">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-panel-glow border border-lavender-400/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingQuestion ? 'Edit Question' : 'Add Question to Bank'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-lavender-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="e.g. Modigliani-Miller"
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Draft question prompt..."
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-lavender-300">Options (Select radio for correct answer)</label>
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === i}
                      onChange={() => setCorrectIdx(i)}
                      className="accent-stargold-400"
                    />
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const copy = [...options];
                        copy[i] = e.target.value;
                        setOptions(copy);
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="w-full px-3 py-1.5 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as QuestionItem['difficulty'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Rationale / Explanation</label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Explain why the selected option is correct..."
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110"
                >
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
