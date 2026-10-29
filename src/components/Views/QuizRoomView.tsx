import React, { useState, useEffect } from 'react';
import { QuestionItem, QuizDefinition, QuizSession } from '../../types';
import { 
  HelpCircle, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  RotateCcw, 
  Award, 
  ArrowRight,
  ArrowLeft,
  Bookmark,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  FileCheck2,
  Layers,
  History,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../services/audio';
import { MoonCat } from '../Mascot/MoonCat';

interface QuizRoomViewProps {
  questions: QuestionItem[];
  customQuizzes: QuizDefinition[];
  quizHistory: QuizSession[];
  onSaveCustomQuiz: (quiz: QuizDefinition) => Promise<void>;
  onDeleteCustomQuiz: (id: string) => Promise<void>;
  onCompleteQuiz: (quiz: QuizSession) => Promise<void>;
  onBookmarkQuestion: (questionId: string) => Promise<void>;
  onRecordAttempt: (id: string, isCorrect: boolean) => Promise<void>;
  onNavigateToIncorrectPractice?: () => void;
}

export const QuizRoomView: React.FC<QuizRoomViewProps> = ({
  questions,
  customQuizzes,
  quizHistory,
  onSaveCustomQuiz,
  onDeleteCustomQuiz,
  onCompleteQuiz,
  onBookmarkQuestion,
  onRecordAttempt,
  onNavigateToIncorrectPractice
}) => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'create' | 'history'>('quizzes');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Active quiz session state
  const [inQuiz, setInQuiz] = useState(false);
  const [activeQuizTitle, setActiveQuizTitle] = useState('MBA Practice Assessment');
  const [activeQuizDefId, setActiveQuizDefId] = useState<string | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<QuestionItem[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // questionIndex -> selectedOption
  const [quizFinished, setQuizFinished] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 mins default
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(600);
  const [flaggedIndices, setFlaggedIndices] = useState<number[]>([]);
  const [showReview, setShowReview] = useState(false);

  // Create Quiz form state
  const [createTitle, setCreateTitle] = useState('');
  const [createSubject, setCreateSubject] = useState('Corporate Finance');
  const [createDesc, setCreateDesc] = useState('');
  const [createTimeLimit, setCreateTimeLimit] = useState(15);
  const [createPassScore, setCreatePassScore] = useState(75);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  const subjects = ['All', ...Array.from(new Set(questions.map(q => q.subject)))];

  // Start custom quiz or subject practice run
  const handleLaunchQuiz = (quizDef?: QuizDefinition, subjectFilter?: string) => {
    sound.playSparkle();
    let qList: QuestionItem[] = [];
    let title = 'MBA Practice Quiz';
    let timeLimitMins = 10;
    let defId: string | undefined = undefined;

    if (quizDef) {
      defId = quizDef.id;
      title = quizDef.title;
      timeLimitMins = quizDef.timeLimitMinutes;
      qList = questions.filter(q => quizDef.questionIds.includes(q.id));
      if (qList.length === 0) {
        // Fallback to subject questions if no specific IDs match
        qList = questions.filter(q => q.subject === quizDef.subject);
      }
    } else {
      title = `${subjectFilter || selectedSubject} Assessment Sprint`;
      const pool = (subjectFilter || selectedSubject) === 'All'
        ? questions
        : questions.filter(q => q.subject === (subjectFilter || selectedSubject));
      qList = [...pool].sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    if (qList.length === 0) {
      alert('No questions available in this category yet. Please add questions in Question Bank!');
      return;
    }

    setActiveQuizTitle(title);
    setActiveQuizDefId(defId);
    setActiveQuestions(qList);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedIndices([]);
    setQuizFinished(false);
    setShowReview(false);
    setTotalTimeSeconds(timeLimitMins * 60);
    setSecondsRemaining(timeLimitMins * 60);
    setInQuiz(true);
  };

  // Launch incorrect answers drill
  const handleLaunchIncorrectDrill = () => {
    const incorrectQuestions = questions.filter(q => q.lastAnsweredCorrectly === false || (q.timesIncorrect || 0) > 0);
    if (incorrectQuestions.length === 0) {
      alert('You have no recorded incorrect answers! Excellent work!');
      return;
    }
    sound.playSparkle();
    setActiveQuizTitle('Weak Topics & Missed Questions Drill');
    setActiveQuizDefId(undefined);
    setActiveQuestions(incorrectQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedIndices([]);
    setQuizFinished(false);
    setShowReview(false);
    setTotalTimeSeconds(Math.max(5, incorrectQuestions.length * 2) * 60);
    setSecondsRemaining(Math.max(5, incorrectQuestions.length * 2) * 60);
    setInQuiz(true);
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval: number | undefined;
    if (inQuiz && !quizFinished && secondsRemaining > 0) {
      interval = window.setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            handleFinalizeQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inQuiz, quizFinished, secondsRemaining]);

  const toggleFlag = (idx: number) => {
    setFlaggedIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const selectOption = (optIdx: number) => {
    sound.playPageTurn();
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optIdx
    }));
  };

  const handleFinalizeQuiz = async () => {
    setQuizFinished(true);
    let calculatedScore = 0;
    const answersRecord: {
      questionId: string;
      selectedOption: number;
      correctOption: number;
      isCorrect: boolean;
    }[] = [];

    activeQuestions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      const isCorrect = selected === q.correctOptionIndex;
      if (isCorrect) calculatedScore += 1;

      answersRecord.push({
        questionId: q.id,
        selectedOption: selected !== undefined ? selected : -1,
        correctOption: q.correctOptionIndex,
        isCorrect
      });

      // Record question attempt in database
      onRecordAttempt(q.id, isCorrect);
    });

    const percent = Math.round((calculatedScore / activeQuestions.length) * 100);
    const passed = percent >= 70;

    if (passed) {
      sound.playCelestialChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FFE8A3', '#B8A7EA', '#F4ABC4', '#A5C9FF']
      });
    } else {
      sound.playPageTurn();
    }

    const elapsedMinutes = Math.max(1, Math.round((totalTimeSeconds - secondsRemaining) / 60));

    const session: QuizSession = {
      id: `quiz-session-${Date.now()}`,
      title: activeQuizTitle,
      subject: activeQuestions[0]?.subject || 'General MBA',
      quizDefinitionId: activeQuizDefId,
      questionIds: activeQuestions.map(q => q.id),
      durationMinutes: elapsedMinutes,
      score: calculatedScore,
      totalQuestions: activeQuestions.length,
      percentage: percent,
      completedAt: new Date().toISOString(),
      passed,
      answersGiven: answersRecord
    };

    await onCompleteQuiz(session);
  };

  const handleSaveNewQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    const newTest: QuizDefinition = {
      id: `quiz-def-${Date.now()}`,
      title: createTitle,
      subject: createSubject,
      description: createDesc,
      timeLimitMinutes: createTimeLimit,
      passingScorePercent: createPassScore,
      questionIds: selectedQuestionIds.length > 0 ? selectedQuestionIds : questions.filter(q => q.subject === createSubject).map(q => q.id),
      createdAt: new Date().toISOString(),
      isCustom: true
    };

    await onSaveCustomQuiz(newTest);
    sound.playSparkle();
    setCreateTitle('');
    setCreateDesc('');
    setSelectedQuestionIds([]);
    setActiveTab('quizzes');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const incorrectCount = questions.filter(q => q.lastAnsweredCorrectly === false || (q.timesIncorrect || 0) > 0).length;

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-stargold-300" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              Quiz Room & Examination Hall
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            Build custom tests, practice timed MBA assessments, calculate accurate scores, and drill incorrect answers.
          </p>
        </div>

        {!inQuiz && (
          <div className="flex items-center gap-2">
            {incorrectCount > 0 && (
              <button
                onClick={handleLaunchIncorrectDrill}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rosemoon-500/20 text-rosemoon-200 border border-rosemoon-400/40 text-xs font-semibold hover:bg-rosemoon-500/30 transition-all shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-rosemoon-300" />
                <span>Drill Incorrect ({incorrectCount})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('create')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Test</span>
            </button>
          </div>
        )}
      </div>

      {!inQuiz ? (
        /* Tabs Bar */
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-lavender-400/20 pb-3 text-xs">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === 'quizzes'
                  ? 'bg-lavender-600 text-white shadow-sm'
                  : 'glass-panel-subtle text-lavender-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Available Tests & Quizzes ({customQuizzes.length + 1})</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === 'create'
                  ? 'bg-lavender-600 text-white shadow-sm'
                  : 'glass-panel-subtle text-lavender-300 hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Test Creator</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-lavender-600 text-white shadow-sm'
                  : 'glass-panel-subtle text-lavender-300 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Attempt History ({quizHistory.length})</span>
            </button>
          </div>

          {activeTab === 'quizzes' && (
            <div className="space-y-6">
              {/* Quick Launch Subject Sprint */}
              <div className="p-6 rounded-3xl glass-panel-glow border border-lavender-400/25 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl text-center md:text-left">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stargold-300">
                    Quick Practice Engine
                  </span>
                  <h3 className="font-serif font-bold text-xl text-white">
                    Adaptive Subject Sprint
                  </h3>
                  <p className="text-xs text-lavender-200/90 leading-relaxed font-sans">
                    Launch a rapid 5-question timed assessment drawing questions dynamically from your Question Bank.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                    {subjects.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSubject(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                          selectedSubject === s
                            ? 'bg-lavender-600 text-white shadow-sm'
                            : 'bg-midnight-900 border border-lavender-400/20 text-lavender-300 hover:text-white'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchQuiz(undefined, selectedSubject)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-sm shadow-star-glow hover:brightness-110 flex items-center gap-2 flex-shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Begin {selectedSubject} Sprint</span>
                </button>
              </div>

              {/* Custom Quizzes & Comprehensive Tests List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-lavender-300 px-1">
                  Custom Exams & Comprehensive Tests
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customQuizzes.map(quiz => {
                    const qCount = quiz.questionIds?.length || 5;
                    return (
                      <div
                        key={quiz.id}
                        className="p-5 rounded-3xl glass-panel-subtle border border-lavender-400/20 hover:border-lavender-400/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-lavender-300 mb-1.5">
                            <span className="uppercase text-stargold-300 font-semibold">{quiz.subject}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {quiz.timeLimitMinutes} mins
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-base text-white">
                            {quiz.title}
                          </h4>

                          <p className="text-xs text-lavender-200/80 font-sans mt-1 line-clamp-2">
                            {quiz.description || 'Comprehensive evaluation test designed for MBA midterm review.'}
                          </p>

                          <div className="flex items-center gap-3 mt-4 text-[11px] font-mono text-lavender-400">
                            <span>Questions: <strong>{qCount}</strong></span>
                            <span>•</span>
                            <span>Pass Mark: <strong>{quiz.passingScorePercent}%</strong></span>
                          </div>
                        </div>

                        <div className="pt-4 mt-3 border-t border-lavender-400/15 flex items-center justify-between">
                          <button
                            onClick={() => onDeleteCustomQuiz(quiz.id)}
                            className="p-1.5 text-lavender-400 hover:text-red-400 transition-colors"
                            title="Delete quiz"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleLaunchQuiz(quiz)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-lavender-600 to-indigo-600 text-white font-serif font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-1.5"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Attempt Timed Test</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Test Creator Tab */}
          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto rounded-3xl glass-panel-glow border border-lavender-400/30 p-6 md:p-8 space-y-5 animate-book-open">
              <div className="flex items-center justify-between pb-3 border-b border-lavender-400/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-stargold-300" />
                  <h3 className="font-serif font-bold text-lg text-white">Create Custom Quiz or Test</h3>
                </div>
                <button onClick={() => setActiveTab('quizzes')} className="text-xs text-lavender-400 hover:text-white">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSaveNewQuiz} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Test Title</label>
                  <input
                    type="text"
                    required
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    placeholder="e.g. Valuation & WACC Comprehensive Mock Exam"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-lavender-300 mb-1">Subject</label>
                    <select
                      value={createSubject}
                      onChange={(e) => setCreateSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                    >
                      <option value="Corporate Finance">Corporate Finance</option>
                      <option value="Marketing Strategy">Marketing Strategy</option>
                      <option value="Operations & Supply Chain">Operations & SCM</option>
                      <option value="Organizational Behavior">Organizational Behavior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-lavender-300 mb-1">Time Limit (Minutes)</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={createTimeLimit}
                      onChange={(e) => setCreateTimeLimit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-lavender-300 mb-1">Passing Score (%)</label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={createPassScore}
                      onChange={(e) => setCreatePassScore(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Test Description & Scope</label>
                  <textarea
                    rows={2}
                    value={createDesc}
                    onChange={(e) => setCreateDesc(e.target.value)}
                    placeholder="Describe topics, calculation formulas, or case questions included..."
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                  />
                </div>

                {/* Question Selection from Bank */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-lavender-300">
                      Select Questions from Bank ({selectedQuestionIds.length} chosen)
                    </label>
                    <span className="text-[11px] text-lavender-400">Leave unselected to auto-populate from subject</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-2xl bg-midnight-950/70 border border-lavender-400/20">
                    {questions.map(q => {
                      const isChecked = selectedQuestionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          onClick={() => {
                            setSelectedQuestionIds(prev => 
                              prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]
                            );
                          }}
                          className={`p-2 rounded-xl cursor-pointer text-xs flex items-center justify-between transition-colors ${
                            isChecked
                              ? 'bg-lavender-600/30 text-white border border-lavender-400/40'
                              : 'hover:bg-white/5 text-lavender-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="accent-stargold-400 rounded"
                            />
                            <span className="font-mono text-[10px] text-stargold-300">[{q.subject}]</span>
                            <span className="truncate">{q.question}</span>
                          </div>
                          <span className="text-[10px] text-lavender-400 flex-shrink-0">{q.difficulty}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('quizzes')}
                    className="px-4 py-2 rounded-xl bg-white/5 text-xs text-lavender-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110"
                  >
                    Save & Publish Test ✨
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Attempt History Tab */}
          {activeTab === 'history' && (
            <div className="rounded-3xl glass-panel-subtle border border-lavender-400/20 p-6 space-y-4">
              <h3 className="font-serif font-bold text-base text-white">
                Archived Assessment Records & Scores
              </h3>

              {quizHistory.length === 0 ? (
                <p className="text-xs text-lavender-400 italic py-6 text-center">
                  No completed quiz attempts recorded yet. Attempt a quiz above to start building your examination record!
                </p>
              ) : (
                <div className="space-y-3">
                  {quizHistory.map(att => (
                    <div
                      key={att.id}
                      className="p-4 rounded-2xl bg-midnight-900/70 border border-lavender-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-lavender-300">
                          <span className="uppercase text-stargold-300">{att.subject}</span>
                          <span>•</span>
                          <span>{new Date(att.completedAt).toLocaleString()}</span>
                        </div>
                        <h4 className="font-serif font-bold text-sm text-white mt-0.5">
                          {att.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-sm font-serif font-bold text-white block">
                            {att.score} / {att.totalQuestions} ({att.percentage}%)
                          </span>
                          <span className={`text-[10px] font-semibold uppercase ${att.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            {att.passed ? 'Passed ✓' : 'Needs Review ✗'}
                          </span>
                        </div>

                        <span className="text-xs font-mono text-lavender-400">
                          {att.durationMinutes}m
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : quizFinished ? (
        /* Results & Full Answers Review Screen */
        <div className="max-w-3xl mx-auto rounded-3xl glass-panel-glow border border-stargold-400/40 p-6 md:p-8 space-y-6 animate-book-open">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-stargold-400 to-amber-500 mx-auto flex items-center justify-center text-midnight-950 shadow-star-glow">
              <Award className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-white text-glow">
              {activeQuizTitle} — Results
            </h2>
            <p className="text-xs text-lavender-200">
              Session evaluated under the moonlit library canopy.
            </p>
          </div>

          {/* Score breakdown metrics */}
          {(() => {
            let correctCount = 0;
            activeQuestions.forEach((q, idx) => {
              if (userAnswers[idx] === q.correctOptionIndex) correctCount++;
            });
            const percent = Math.round((correctCount / activeQuestions.length) * 100);
            const passed = percent >= 70;

            return (
              <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/30 flex items-center justify-around">
                <div className="text-center">
                  <span className="text-[10px] uppercase text-lavender-300">Raw Score</span>
                  <p className="text-xl font-serif font-bold text-stargold-200">
                    {correctCount} / {activeQuestions.length}
                  </p>
                </div>
                <div className="h-8 w-px bg-lavender-400/20" />
                <div className="text-center">
                  <span className="text-[10px] uppercase text-lavender-300">Accuracy</span>
                  <p className={`text-xl font-serif font-bold ${passed ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {percent}%
                  </p>
                </div>
                <div className="h-8 w-px bg-lavender-400/20" />
                <div className="text-center">
                  <span className="text-[10px] uppercase text-lavender-300">Result</span>
                  <p className={`text-base font-serif font-bold uppercase ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {passed ? 'Passed ✓' : 'Needs Practice'}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Toggle Full Review of Questions */}
          <div className="flex items-center justify-between pt-2">
            <h4 className="font-serif font-bold text-sm text-white">
              Questions & Explanations Breakdown
            </h4>
            <button
              onClick={() => setShowReview(!showReview)}
              className="text-xs text-stargold-300 hover:text-white"
            >
              {showReview ? 'Hide Solutions' : 'Inspect All Solutions'}
            </button>
          </div>

          {showReview && (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {activeQuestions.map((q, idx) => {
                const userChoice = userAnswers[idx];
                const isCorrect = userChoice === q.correctOptionIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? 'bg-emerald-950/30 border-emerald-500/30'
                        : 'bg-red-950/30 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-white">
                        Question {idx + 1}
                      </span>
                      <span className={`text-[10px] font-semibold uppercase ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
                        {isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                      </span>
                    </div>

                    <p className="text-xs text-lavender-100 font-serif font-medium mb-3">
                      {q.question}
                    </p>

                    <div className="space-y-1 text-xs">
                      <p className="text-emerald-300">
                        <strong>Correct:</strong> {q.options[q.correctOptionIndex]}
                      </p>
                      {!isCorrect && (
                        <p className="text-red-300">
                          <strong>Your Answer:</strong> {userChoice !== undefined ? q.options[userChoice] : 'Not Answered'}
                        </p>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-lavender-400/10 text-xs text-lavender-300/90 italic">
                      Rationale: {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-lavender-400/20">
            {incorrectCount > 0 && (
              <button
                onClick={handleLaunchIncorrectDrill}
                className="px-5 py-2.5 rounded-xl bg-rosemoon-500/30 text-rosemoon-200 border border-rosemoon-400/40 text-xs font-semibold hover:bg-rosemoon-500/40 transition-all"
              >
                Practice Incorrect Questions Now
              </button>
            )}

            <button
              onClick={() => setInQuiz(false)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-lavender-600 to-indigo-600 text-white font-serif font-bold text-xs shadow-md hover:brightness-110 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return to Exam Hall</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Timed Quiz Runner */
        <div className="max-w-3xl mx-auto rounded-3xl glass-panel-glow border border-lavender-400/30 p-6 md:p-8 space-y-6">
          {/* Header Status & Countdown Clock */}
          <div className="flex items-center justify-between pb-3 border-b border-lavender-400/20">
            <div>
              <span className="text-[10px] uppercase font-semibold text-stargold-300">
                {activeQuizTitle}
              </span>
              <p className="text-xs font-mono text-lavender-300">
                Question {currentIndex + 1} of {activeQuestions.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleFlag(currentIndex)}
                className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 ${
                  flaggedIndices.includes(currentIndex)
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'glass-panel-subtle text-lavender-400 hover:text-white'
                }`}
                title="Flag question for later review"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Flag</span>
              </button>

              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs ${
                secondsRemaining < 120 
                  ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                  : 'bg-midnight-900 border-stargold-400/30 text-stargold-200'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Question Index Palette (Click to jump to any question) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {activeQuestions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined;
              const isFlagged = flaggedIndices.includes(idx);
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'ring-2 ring-stargold-300 bg-lavender-600 text-white'
                      : isFlagged
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                      : isAnswered
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-400/40'
                      : 'bg-midnight-900 text-lavender-400 hover:text-white'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Body */}
          {(() => {
            const currentQ = activeQuestions[currentIndex];
            if (!currentQ) return null;

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[11px] text-lavender-300 font-mono">
                  <span className="text-stargold-300 uppercase">{currentQ.subject} • {currentQ.topic}</span>
                  <span className="px-2 py-0.5 rounded-full bg-midnight-900 border border-lavender-400/20">{currentQ.difficulty}</span>
                </div>

                <h3 className="font-serif font-bold text-lg md:text-xl text-white leading-relaxed">
                  {currentQ.question}
                </h3>

                {/* 4 Answer Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = userAnswers[currentIndex] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => selectOption(optIdx)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-gradient-to-r from-lavender-600/40 to-indigo-600/30 border-stargold-300 text-white shadow-md'
                            : 'glass-panel-subtle border-lavender-400/20 hover:border-lavender-400/40 text-lavender-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs font-bold ${
                            isSelected ? 'border-stargold-300 text-stargold-200' : 'border-lavender-400/40 text-lavender-300'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-xs md:text-sm font-sans">{option}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-stargold-300" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Bottom Navigation & Submit Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-lavender-400/20">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl glass-panel-subtle text-xs text-lavender-300 hover:text-white disabled:opacity-30 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-lavender-400 font-mono">
              Answered {Object.keys(userAnswers).length} / {activeQuestions.length}
            </span>

            {currentIndex + 1 < activeQuestions.length ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-lavender-600 hover:bg-lavender-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinalizeQuiz}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110"
              >
                Submit Exam & Calculate Score ✨
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
