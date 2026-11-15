import React, { useState, useEffect, useRef } from 'react';
import { 
  SubjectItem, 
  QuestionItem, 
  GameScoreRecord, 
  ArcadeGameType,
  AchievementItem
} from '../../types';
import { 
  generateSubjectChallengeQuestions,
  initialMemoryGamePairs,
  initialFlashcards,
  initialTrueFalseQuestions,
  TrueFalseQuestion
} from '../../services/arcadeQuestions';
import { 
  Sparkles, 
  Gamepad2, 
  RotateCw, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Flame, 
  Star, 
  Layers, 
  Zap, 
  BookOpen, 
  Brain, 
  RefreshCw, 
  ArrowRight, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Filter,
  Trash2,
  Edit3,
  Trophy
} from 'lucide-react';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';

interface MoonlightArcadeViewProps {
  subjects: SubjectItem[];
  allQuestions: QuestionItem[];
  onSaveScore: (score: GameScoreRecord) => Promise<void>;
  onSaveQuestion: (question: QuestionItem) => Promise<void>;
  onDeleteQuestion: (id: string) => Promise<void>;
  userStreak: number;
  userStars: number;
}

export const MoonlightArcadeView: React.FC<MoonlightArcadeViewProps> = ({
  subjects,
  allQuestions,
  onSaveScore,
  onSaveQuestion,
  onDeleteQuestion,
  userStreak,
  userStars
}) => {
  // Navigation between Arcade sub-zones
  const [activeTab, setActiveTab] = useState<'wheel' | 'memory' | 'flashcard' | 'speed' | 'concept' | 'true-false' | 'bank' | 'leaderboard'>('wheel');

  // ============================================
  // SPIN THE WHEEL & 50-QUESTION CHALLENGE STATE
  // ============================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('');
  const [isMixedQuiz, setIsMixedQuiz] = useState(false);
  
  // 50-Question Challenge Active Session
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [challengeQuestions, setChallengeQuestions] = useState<QuestionItem[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: { selected: number; isCorrect: boolean } }>({});
  const [challengeTimerSeconds, setChallengeTimerSeconds] = useState(3000); // 50 mins default
  const [challengeTimeTaken, setChallengeTimeTaken] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isChallengeComplete, setIsChallengeComplete] = useState(false);
  const [isReviewingIncorrect, setIsReviewingIncorrect] = useState(false);

  // Scores History
  const [scoreHistory, setScoreHistory] = useState<GameScoreRecord[]>([]);

  // Wheel colors
  const wheelColors = [
    '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', 
    '#06b6d4', '#6366f1', '#14b8a6', '#f43f5e', '#a855f7'
  ];

  // Active subjects for the wheel (default to Term 2 ongoing + core)
  const activeWheelSubjects = subjects.length > 0 
    ? subjects 
    : [
        { id: '1', name: 'Product Management' },
        { id: '2', name: 'Microeconomics' },
        { id: '3', name: 'Introduction to UI/UX' },
        { id: '4', name: 'Leadership Accelerator' },
        { id: '5', name: 'Finance' },
        { id: '6', name: 'Marketing Analysis' }
      ];

  const currentRotation = useRef(0);

  // Draw the Canvas Wheel
  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 16;
    const numSegments = activeWheelSubjects.length;
    const arc = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, width, height);

    // Draw wheel segments
    for (let i = 0; i < numSegments; i++) {
      const segAngle = angle + i * arc;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, segAngle, segAngle + arc);
      ctx.closePath();
      ctx.fillStyle = wheelColors[i % wheelColors.length];
      ctx.fill();
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(segAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Cinzel", serif, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      const text = activeWheelSubjects[i].name;
      ctx.fillText(text.length > 18 ? text.slice(0, 16) + '..' : text, radius - 20, 5);
      ctx.restore();
    }

    // Outer Glowing Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌙', centerX, centerY);
  };

  useEffect(() => {
    drawWheel(currentRotation.current);
  }, [activeWheelSubjects]);

  // Spin Wheel Action
  const handleSpinWheel = () => {
    if (isSpinning) return;
    sound.playCelestialChime();
    setIsSpinning(true);
    setSelectedSubjectName('');

    const spinRotations = 5 + Math.random() * 4; // 5 to 9 full turns
    const totalAngle = spinRotations * 2 * Math.PI;
    const durationMs = 4000;
    const startTime = performance.now();
    const startAngle = currentRotation.current;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      currentRotation.current = startAngle + totalAngle * ease;
      drawWheel(currentRotation.current);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        // Determine chosen slice at top pointer (angle = 3*PI/2)
        const numSegments = activeWheelSubjects.length;
        const arc = (2 * Math.PI) / numSegments;
        const normalized = (currentRotation.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        // pointer is at top (1.5 * PI)
        const pointerAngle = (1.5 * Math.PI - normalized + 2 * Math.PI) % (2 * Math.PI);
        const selectedIndex = Math.floor(pointerAngle / arc) % numSegments;
        const picked = activeWheelSubjects[selectedIndex]?.name || 'Product Management';
        setSelectedSubjectName(picked);
        sound.playCelestialChime();
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    };

    requestAnimationFrame(animateSpin);
  };

  // Launch 50-Question Challenge
  const handleStart50QuestionChallenge = (subjectName: string) => {
    sound.playCelestialChime();
    const questions50 = generateSubjectChallengeQuestions(subjectName, 50);
    setChallengeQuestions(questions50);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setHasSubmittedAnswer(false);
    setUserAnswers({});
    setChallengeTimerSeconds(3000); // 50 mins
    setChallengeTimeTaken(0);
    setIsTimerRunning(true);
    setIsChallengeActive(true);
    setIsChallengeComplete(false);
    setIsReviewingIncorrect(false);
  };

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isChallengeActive && isTimerRunning && !isChallengeComplete) {
      interval = setInterval(() => {
        setChallengeTimerSeconds(prev => {
          if (prev <= 1) {
            handleCompleteChallenge();
            return 0;
          }
          return prev - 1;
        });
        setChallengeTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isChallengeActive, isTimerRunning, isChallengeComplete]);

  // Answer submit
  const handleAnswerOptionSelect = (optionIdx: number) => {
    if (hasSubmittedAnswer) return;
    sound.playCardClick();
    setSelectedOption(optionIdx);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || hasSubmittedAnswer) return;
    const currentQ = challengeQuestions[currentQIndex];
    const isCorrect = selectedOption === currentQ.correctOptionIndex;

    if (isCorrect) {
      sound.playCelestialChime();
    } else {
      sound.playPageTurn();
    }

    setHasSubmittedAnswer(true);
    setUserAnswers(prev => ({
      ...prev,
      [currentQIndex]: {
        selected: selectedOption,
        isCorrect
      }
    }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < challengeQuestions.length - 1) {
      sound.playCardClick();
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasSubmittedAnswer(false);
    } else {
      handleCompleteChallenge();
    }
  };

  const handleCompleteChallenge = async () => {
    setIsTimerRunning(false);
    setIsChallengeComplete(true);

    const totalQuestions = challengeQuestions.length;
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const xpEarned = correctCount * 10 + (accuracy >= 80 ? 200 : 50);

    const scoreRecord: GameScoreRecord = {
      id: `score-${Date.now()}`,
      gameType: 'wheel',
      subjectName: selectedSubjectName || 'Mixed MBA',
      score: correctCount,
      maxScore: totalQuestions,
      accuracy,
      timeTakenSeconds: challengeTimeTaken,
      xpEarned,
      completedAt: new Date().toISOString()
    };

    await onSaveScore(scoreRecord);
    setScoreHistory(prev => [scoreRecord, ...prev]);

    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  // Format seconds to mm:ss
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins < 10 ? '0' + mins : mins}:${remaining < 10 ? '0' + remaining : remaining}`;
  };

  // ============================================
  // MEMORY MATCH GAME MODE STATE
  // ============================================
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const initMemoryGame = () => {
    sound.playCardClick();
    const pairs = initialMemoryGamePairs.slice(0, 6); // 6 pairs = 12 cards
    const cards: any[] = [];
    pairs.forEach(p => {
      cards.push({ id: p.id, type: 'concept', text: p.concept, matchId: p.id });
      cards.push({ id: `${p.id}-def`, type: 'definition', text: p.definition, matchId: p.id });
    });
    // Shuffle cards
    setMemoryCards(cards.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchedIds([]);
    setMemoryMoves(0);
  };

  useEffect(() => {
    if (activeTab === 'memory' && memoryCards.length === 0) {
      initMemoryGame();
    }
  }, [activeTab]);

  const handleCardFlip = (idx: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(idx) || matchedIds.includes(memoryCards[idx].matchId)) {
      return;
    }
    sound.playCardClick();
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      const first = memoryCards[newFlipped[0]];
      const second = memoryCards[newFlipped[1]];
      if (first.matchId === second.matchId) {
        sound.playCelestialChime();
        setMatchedIds(prev => [...prev, first.matchId]);
        setFlippedIndices([]);
        if (matchedIds.length + 1 === 6) {
          confetti({ particleCount: 50 });
        }
      } else {
        setTimeout(() => setFlippedIndices([]), 1200);
      }
    }
  };

  // ============================================
  // FLASHCARD CHALLENGE STATE
  // ============================================
  const [flashcardList, setFlashcardList] = useState(initialFlashcards);
  const [currentFcIndex, setCurrentFcIndex] = useState(0);
  const [isFcRevealed, setIsFcRevealed] = useState(false);

  // ============================================
  // TRUE OR FALSE STATE
  // ============================================
  const [tfQuestions, setTfQuestions] = useState<TrueFalseQuestion[]>(initialTrueFalseQuestions);
  const [tfIndex, setTfIndex] = useState(0);
  const [tfScore, setTfScore] = useState(0);
  const [tfAnswerFeedback, setTfAnswerFeedback] = useState<boolean | null>(null);

  const handleTrueFalseAnswer = (userChoice: boolean) => {
    const current = tfQuestions[tfIndex];
    const isCorrect = userChoice === current.isTrue;
    if (isCorrect) {
      sound.playCelestialChime();
      setTfScore(prev => prev + 1);
    } else {
      sound.playPageTurn();
    }
    setTfAnswerFeedback(isCorrect);
  };

  const handleNextTf = () => {
    setTfAnswerFeedback(null);
    if (tfIndex < tfQuestions.length - 1) {
      setTfIndex(prev => prev + 1);
    } else {
      alert(`True or False completed! Score: ${tfScore + 1} / ${tfQuestions.length}`);
      setTfIndex(0);
      setTfScore(0);
    }
  };

  // ============================================
  // QUESTION BANK EDITOR STATE
  // ============================================
  const [bankSearch, setBankSearch] = useState('');
  const [bankSubjectFilter, setBankSubjectFilter] = useState('all');
  const [bankDifficultyFilter, setBankDifficultyFilter] = useState('all');
  const [isAddQModalOpen, setIsAddQModalOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<QuestionItem | null>(null);

  // Form states for adding/editing question
  const [qSubject, setQSubject] = useState(subjects[0]?.name || 'Product Management');
  const [qTopic, setQTopic] = useState('');
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const filteredBankQuestions = allQuestions.filter(q => {
    if (bankSubjectFilter !== 'all' && q.subject.toLowerCase() !== bankSubjectFilter.toLowerCase()) return false;
    if (bankDifficultyFilter !== 'all' && q.difficulty.toLowerCase() !== bankDifficultyFilter.toLowerCase()) return false;
    if (bankSearch.trim()) {
      const match = q.question.toLowerCase().includes(bankSearch.toLowerCase()) ||
                    q.topic.toLowerCase().includes(bankSearch.toLowerCase()) ||
                    q.explanation.toLowerCase().includes(bankSearch.toLowerCase());
      if (!match) return false;
    }
    return true;
  });

  const handleOpenAddQuestion = () => {
    sound.playCardClick();
    setEditingQ(null);
    setQSubject(subjects[0]?.name || 'Product Management');
    setQTopic('');
    setQText('');
    setQOptions(['', '', '', '']);
    setQCorrectIndex(0);
    setQExplanation('');
    setQDifficulty('Medium');
    setIsAddQModalOpen(true);
  };

  const handleOpenEditQuestion = (q: QuestionItem) => {
    sound.playCardClick();
    setEditingQ(q);
    setQSubject(q.subject);
    setQTopic(q.topic);
    setQText(q.question);
    setQOptions([...q.options]);
    setQCorrectIndex(q.correctOptionIndex);
    setQExplanation(q.explanation);
    setQDifficulty(q.difficulty);
    setIsAddQModalOpen(true);
  };

  const handleSaveQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || qOptions.some(o => !o.trim())) {
      alert('Please fill out the question and all 4 options.');
      return;
    }

    sound.playCelestialChime();
    const qData: QuestionItem = {
      id: editingQ ? editingQ.id : `q-${Date.now()}`,
      subject: qSubject,
      topic: qTopic.trim() || 'General MBA Concepts',
      question: qText.trim(),
      options: qOptions.map(o => o.trim()),
      correctOptionIndex: qCorrectIndex,
      explanation: qExplanation.trim() || 'Verified answer rationale.',
      difficulty: qDifficulty,
      isBookmarked: editingQ?.isBookmarked ?? false,
      timesPracticed: editingQ?.timesPracticed ?? 0,
      timesCorrect: editingQ?.timesCorrect ?? 0
    };

    await onSaveQuestion(qData);
    setIsAddQModalOpen(false);
  };

  const handleExportQuestions = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allQuestions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'moonlit_question_bank.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Top Banner Header with Gamification Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-lavender-400/20 bg-gradient-to-r from-space-900/90 via-midnight-800/80 to-space-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-500/10 border border-lavender-400/30 text-stargold-300 text-xs font-serif uppercase tracking-wider mb-2">
              <Gamepad2 size={14} />
              Gamified MBA Learning Zone
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              Moonlight Arcade
            </h1>
            <p className="text-xs sm:text-sm text-lavender-300/80 mt-1 max-w-2xl font-sans">
              Master your MBA curriculum through animated spin challenges, memory matches, rapid flashcards, and 50-question mastery trials.
            </p>
          </div>

          {/* Gamification Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-midnight-950/70 border border-stargold-400/30">
              <Flame size={18} className="text-amber-400 animate-pulse" />
              <div>
                <div className="text-[9px] text-lavender-400 uppercase font-mono">Study Streak</div>
                <div className="text-sm font-serif font-bold text-stargold-300">{userStreak || 7} Days 🔥</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-midnight-950/70 border border-stargold-400/30">
              <Star size={18} className="text-stargold-300" />
              <div>
                <div className="text-[9px] text-lavender-400 uppercase font-mono">Stars Collected</div>
                <div className="text-sm font-serif font-bold text-white">{userStars || 18} Stars ✨</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-midnight-950/70 border border-lavender-400/20">
              <Trophy size={18} className="text-purple-300" />
              <div>
                <div className="text-[9px] text-lavender-400 uppercase font-mono">Rank Level</div>
                <div className="text-sm font-serif font-bold text-lavender-200">MBA Scholar II</div>
              </div>
            </div>
          </div>
        </div>

        {/* Arcade Modes Sub-Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-lavender-400/15 overflow-x-auto no-scrollbar">
          {[
            { id: 'wheel', label: '🎡 Spin the Subject Wheel (50 Qs)' },
            { id: 'memory', label: '🃏 Memory Match' },
            { id: 'flashcard', label: '⚡ Flashcard Challenge' },
            { id: 'true-false', label: '✓/✗ True or False' },
            { id: 'bank', label: `📚 Question Bank (${allQuestions.length})` },
            { id: 'leaderboard', label: '🏆 High Scores' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playCardClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold shadow-md'
                  : 'bg-midnight-900/40 text-lavender-300 hover:text-white hover:bg-midnight-800/60 border border-lavender-400/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. SPIN THE SUBJECT WHEEL & 50-QUESTION RUNNER */}
      {/* ========================================================= */}
      {activeTab === 'wheel' && (
        <div className="space-y-8 animate-fadeIn">
          {!isChallengeActive ? (
            /* Wheel Spinning Stage */
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 flex flex-col items-center text-center space-y-6">
              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white">
                  Spin the Wheel of Destiny
                </h3>
                <p className="text-xs text-lavender-300">
                  Press SPIN to randomly select an active MBA subject and launch a full 50-question conceptual trial!
                </p>
              </div>

              {/* Animated Canvas Wheel Container */}
              <div className="relative flex items-center justify-center py-4">
                {/* Fixed Top Glowing Pointer */}
                <div className="absolute top-0 z-20 transform -translate-y-1">
                  <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-stargold-400 filter drop-shadow-[0_0_8px_#fbbf24]" />
                </div>

                <canvas
                  ref={canvasRef}
                  width={340}
                  height={340}
                  className="rounded-full shadow-2xl transition-transform duration-100"
                />
              </div>

              {/* Spin & Launch Controls */}
              <div className="flex flex-col items-center gap-3">
                <button
                  disabled={isSpinning}
                  onClick={handleSpinWheel}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-stargold-400 via-amber-400 to-amber-500 text-midnight-950 font-bold text-base hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-stargold-400/25 flex items-center gap-2.5"
                >
                  <RotateCw size={20} className={isSpinning ? 'animate-spin' : ''} />
                  {isSpinning ? 'Selecting Subject...' : 'SPIN THE WHEEL'}
                </button>

                {/* Selected Subject Result Banner */}
                {selectedSubjectName && (
                  <div className="p-4 rounded-2xl bg-lavender-500/20 border border-stargold-400/60 animate-bounce mt-2 space-y-2">
                    <div className="text-xs font-mono text-stargold-300 uppercase">
                      Wheel Landed On:
                    </div>
                    <div className="text-xl font-serif font-bold text-white">
                      {selectedSubjectName}
                    </div>
                    <button
                      onClick={() => handleStart50QuestionChallenge(selectedSubjectName)}
                      className="px-6 py-2.5 rounded-xl bg-stargold-400 text-midnight-950 font-bold text-xs hover:scale-105 transition-all shadow-md"
                    >
                      Start 50-Question {selectedSubjectName} Challenge →
                    </button>
                  </div>
                )}

                {/* Or Choose Mixed Quiz */}
                <div className="pt-4 border-t border-lavender-400/15 w-full flex items-center justify-center gap-3">
                  <span className="text-xs text-lavender-400">Prefer all subjects combined?</span>
                  <button
                    onClick={() => handleStart50QuestionChallenge('Mixed MBA Curriculum')}
                    className="px-4 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-xs text-lavender-200 hover:text-white hover:border-stargold-400"
                  >
                    Take Mixed 50-Question Exam
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active 50-Question Runner */
            <div className="space-y-6">
              {!isChallengeComplete ? (
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-lavender-400/25 bg-midnight-950/70 space-y-6">
                  {/* Runner Header: Progress & Timer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-lavender-400/15">
                    <div>
                      <div className="text-xs font-mono text-stargold-300 font-bold">
                        {selectedSubjectName || 'MBA Challenge'} • 50 QUESTIONS TRIAL
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white">
                        Question {currentQIndex + 1} of {challengeQuestions.length}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Live Timer */}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-midnight-900 border border-lavender-400/20 text-xs font-mono text-stargold-300 font-bold">
                        <Timer size={16} />
                        {formatTimer(challengeTimerSeconds)}
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Exit current challenge? Your progress will be saved.')) {
                            handleCompleteChallenge();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs"
                      >
                        End & Submit
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-midnight-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-stargold-400 to-amber-500 transition-all duration-300"
                      style={{ width: `${((currentQIndex + 1) / challengeQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Box */}
                  {challengeQuestions[currentQIndex] && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-md bg-lavender-500/15 text-lavender-300">
                          {challengeQuestions[currentQIndex].topic}
                        </span>
                        <span className="text-[11px] font-mono text-stargold-300 uppercase">
                          {challengeQuestions[currentQIndex].difficulty} Difficulty
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-serif text-white font-medium leading-relaxed">
                        {challengeQuestions[currentQIndex].question}
                      </h4>

                      {/* 4 Multiple Choice Options */}
                      <div className="space-y-2.5 pt-2">
                        {challengeQuestions[currentQIndex].options.map((opt, optIdx) => {
                          const isPicked = selectedOption === optIdx;
                          const isCorrect = optIdx === challengeQuestions[currentQIndex].correctOptionIndex;

                          let btnStyle = 'border-lavender-400/20 bg-midnight-900/60 text-lavender-200 hover:border-lavender-400/50';
                          if (hasSubmittedAnswer) {
                            if (isCorrect) {
                              btnStyle = 'border-emerald-500/80 bg-emerald-500/20 text-emerald-200 font-bold';
                            } else if (isPicked && !isCorrect) {
                              btnStyle = 'border-rose-500/80 bg-rose-500/20 text-rose-200 line-through';
                            }
                          } else if (isPicked) {
                            btnStyle = 'border-stargold-400 bg-lavender-500/20 text-white font-semibold';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasSubmittedAnswer}
                              onClick={() => handleAnswerOptionSelect(optIdx)}
                              className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                            >
                              <span className="w-6 h-6 rounded-lg bg-midnight-950 text-stargold-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {['A', 'B', 'C', 'D'][optIdx]}
                              </span>
                              <span className="flex-1 leading-snug">{opt}</span>
                              {hasSubmittedAnswer && isCorrect && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
                              {hasSubmittedAnswer && isPicked && !isCorrect && <XCircle size={18} className="text-rose-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Immediate Feedback Explanation */}
                      {hasSubmittedAnswer && (
                        <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20 space-y-2 animate-fadeIn">
                          <div className="flex items-center gap-2 text-xs font-bold font-serif">
                            {userAnswers[currentQIndex]?.isCorrect ? (
                              <span className="text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle2 size={16} /> Correct Answer! (+10 XP)
                              </span>
                            ) : (
                              <span className="text-rose-400 flex items-center gap-1.5">
                                <XCircle size={16} /> Incorrect Answer
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-lavender-200/90 leading-relaxed">
                            <strong className="text-stargold-300">Explanation:</strong> {challengeQuestions[currentQIndex].explanation}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-4 border-t border-lavender-400/15">
                        <span className="text-xs text-lavender-400">
                          Question {currentQIndex + 1} of 50
                        </span>

                        {!hasSubmittedAnswer ? (
                          <button
                            disabled={selectedOption === null}
                            onClick={handleConfirmAnswer}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs hover:scale-105 disabled:opacity-50 transition-all shadow-md"
                          >
                            Submit Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs hover:scale-105 transition-all shadow-md flex items-center gap-1.5"
                          >
                            {currentQIndex < challengeQuestions.length - 1 ? 'Next Question →' : 'View Final Scoreboard 🏆'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Challenge Complete Scorecard */
                <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-stargold-400/40 bg-midnight-950/80 text-center space-y-6 animate-fadeIn">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-stargold-400 to-amber-500 text-midnight-950 flex items-center justify-center shadow-xl shadow-stargold-400/25">
                    <Trophy size={40} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-3xl font-serif font-bold text-white">
                      50-Question Challenge Completed!
                    </h3>
                    <p className="text-xs text-lavender-300">
                      Subject: {selectedSubjectName || 'Mixed MBA'}
                    </p>
                  </div>

                  {/* Summary Metric Boxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20">
                      <div className="text-[10px] text-lavender-400 uppercase font-mono">Score</div>
                      <div className="text-2xl font-serif font-bold text-stargold-300">
                        {Object.values(userAnswers).filter(a => a.isCorrect).length} / 50
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20">
                      <div className="text-[10px] text-lavender-400 uppercase font-mono">Accuracy</div>
                      <div className="text-2xl font-serif font-bold text-emerald-300">
                        {Math.round((Object.values(userAnswers).filter(a => a.isCorrect).length / 50) * 100)}%
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20">
                      <div className="text-[10px] text-lavender-400 uppercase font-mono">Time Taken</div>
                      <div className="text-2xl font-serif font-bold text-white font-mono">
                        {formatTimer(challengeTimeTaken)}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20">
                      <div className="text-[10px] text-lavender-400 uppercase font-mono">XP Earned</div>
                      <div className="text-2xl font-serif font-bold text-purple-300">
                        +{Object.values(userAnswers).filter(a => a.isCorrect).length * 10 + 100} XP
                      </div>
                    </div>
                  </div>

                  {/* Review incorrect or start new challenge */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                    <button
                      onClick={() => setIsReviewingIncorrect(!isReviewingIncorrect)}
                      className="px-5 py-2.5 rounded-xl bg-midnight-900 border border-lavender-400/30 text-lavender-200 hover:text-white text-xs font-serif"
                    >
                      {isReviewingIncorrect ? 'Hide Review' : 'Review Incorrect Answers (Audit)'}
                    </button>
                    <button
                      onClick={() => {
                        setIsChallengeActive(false);
                        setIsChallengeComplete(false);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs hover:scale-105 transition-all shadow-md"
                    >
                      Return to Moonlight Wheel
                    </button>
                  </div>

                  {/* Review Incorrect Section */}
                  {isReviewingIncorrect && (
                    <div className="pt-6 border-t border-lavender-400/20 text-left space-y-4 max-w-3xl mx-auto">
                      <h4 className="text-sm font-serif font-bold text-stargold-300">
                        Reviewing Missed Questions:
                      </h4>
                      {challengeQuestions.map((q, idx) => {
                        if (userAnswers[idx]?.isCorrect) return null;
                        return (
                          <div key={idx} className="p-4 rounded-2xl bg-midnight-900/80 border border-rose-500/30 space-y-2 text-xs">
                            <div className="text-rose-300 font-bold">Q{idx + 1}: {q.question}</div>
                            <div className="text-lavender-300">
                              <strong className="text-emerald-300">Correct:</strong> {q.options[q.correctOptionIndex]}
                            </div>
                            <div className="text-[11px] text-lavender-400">
                              <strong className="text-stargold-300">Rationale:</strong> {q.explanation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MEMORY MATCH GAME MODE */}
      {/* ========================================================= */}
      {activeTab === 'memory' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Brain size={20} className="text-purple-400" />
                MBA Concept Memory Match
              </h3>
              <p className="text-xs text-lavender-300 mt-1">
                Flip cards to match core business concepts with their definitions. Moves: {memoryMoves}
              </p>
            </div>
            <button
              onClick={initMemoryGame}
              className="px-4 py-2 rounded-xl bg-midnight-900 border border-lavender-400/20 text-xs text-stargold-300 hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Reset Cards
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {memoryCards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedIds.includes(card.matchId);
              const isMatched = matchedIds.includes(card.matchId);

              return (
                <div
                  key={idx}
                  onClick={() => handleCardFlip(idx)}
                  className={`min-h-[120px] p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-center text-center select-none ${
                    isMatched
                      ? 'border-emerald-500/80 bg-emerald-500/20 text-emerald-200'
                      : isFlipped
                      ? 'border-stargold-400 bg-lavender-500/20 text-white'
                      : 'border-lavender-400/20 bg-midnight-900/80 text-lavender-400 hover:border-lavender-400/50'
                  }`}
                >
                  {isFlipped ? (
                    <div className="text-xs font-serif font-medium leading-relaxed">
                      {card.text}
                    </div>
                  ) : (
                    <div className="text-2xl opacity-60">🌙</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. FLASHCARD CHALLENGE */}
      {/* ========================================================= */}
      {activeTab === 'flashcard' && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 max-w-2xl mx-auto space-y-6 text-center animate-fadeIn">
          <div>
            <div className="text-xs font-mono text-stargold-300 uppercase">
              Flashcard {currentFcIndex + 1} of {flashcardList.length} • {flashcardList[currentFcIndex].subject}
            </div>
            <h3 className="text-xl font-serif font-bold text-white mt-1">
              Active Recall Flashcard
            </h3>
          </div>

          {/* Flashcard container with flip animation */}
          <div
            onClick={() => {
              sound.playCardClick();
              setIsFcRevealed(!isFcRevealed);
            }}
            className="min-h-[220px] p-8 rounded-3xl border border-lavender-400/30 bg-midnight-900/80 hover:border-stargold-400/60 cursor-pointer flex flex-col items-center justify-center transition-all shadow-xl space-y-4"
          >
            <div className="text-xs text-lavender-400 uppercase tracking-wider">
              {isFcRevealed ? 'Back: Answer & Definition' : 'Front: Prompt (Click to reveal)'}
            </div>
            <div className="text-base sm:text-lg font-serif font-medium text-white leading-relaxed">
              {isFcRevealed ? flashcardList[currentFcIndex].backAnswer : flashcardList[currentFcIndex].frontPrompt}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playCardClick();
                setIsFcRevealed(false);
                setCurrentFcIndex(prev => (prev > 0 ? prev - 1 : flashcardList.length - 1));
              }}
              className="px-4 py-2 rounded-xl bg-midnight-900 border border-lavender-400/20 text-xs text-lavender-300"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                sound.playCardClick();
                setIsFcRevealed(!isFcRevealed);
              }}
              className="px-5 py-2 rounded-xl bg-lavender-500/20 border border-lavender-400/40 text-xs text-white font-medium"
            >
              {isFcRevealed ? 'Hide Answer' : 'Flip Card ↻'}
            </button>
            <button
              onClick={() => {
                sound.playCardClick();
                setIsFcRevealed(false);
                setCurrentFcIndex(prev => (prev < flashcardList.length - 1 ? prev + 1 : 0));
              }}
              className="px-4 py-2 rounded-xl bg-midnight-900 border border-lavender-400/20 text-xs text-lavender-300"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TRUE OR FALSE GAME MODE */}
      {/* ========================================================= */}
      {activeTab === 'true-false' && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 max-w-2xl mx-auto space-y-6 text-center animate-fadeIn">
          <div>
            <div className="text-xs font-mono text-stargold-300 uppercase">
              Question {tfIndex + 1} of {tfQuestions.length} • Score: {tfScore}
            </div>
            <h3 className="text-xl font-serif font-bold text-white mt-1">
              Rapid True or False
            </h3>
          </div>

          <div className="p-8 rounded-3xl bg-midnight-900/80 border border-lavender-400/30 text-lg font-serif text-white leading-relaxed">
            "{tfQuestions[tfIndex].statement}"
          </div>

          {tfAnswerFeedback === null ? (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleTrueFalseAnswer(true)}
                className="w-36 py-3 rounded-2xl bg-emerald-500 text-midnight-950 font-bold text-sm hover:scale-105 transition-all shadow-md"
              >
                TRUE ✓
              </button>
              <button
                onClick={() => handleTrueFalseAnswer(false)}
                className="w-36 py-3 rounded-2xl bg-rose-500 text-white font-bold text-sm hover:scale-105 transition-all shadow-md"
              >
                FALSE ✗
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl text-xs ${
                tfAnswerFeedback ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
              }`}>
                <div className="font-bold mb-1">
                  {tfAnswerFeedback ? 'Correct!' : 'Incorrect!'}
                </div>
                <div>{tfQuestions[tfIndex].explanation}</div>
              </div>
              <button
                onClick={handleNextTf}
                className="px-6 py-2.5 rounded-xl bg-stargold-400 text-midnight-950 font-bold text-xs"
              >
                Next Statement →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. EDITABLE QUESTION BANK */}
      {/* ========================================================= */}
      {activeTab === 'bank' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header controls: Search, Filter, Add, Export */}
          <div className="glass-panel p-6 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-2.5 text-lavender-400" />
                <input
                  type="text"
                  placeholder="Search questions or rationale..."
                  value={bankSearch}
                  onChange={(e) => setBankSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                />
              </div>

              <select
                value={bankSubjectFilter}
                onChange={(e) => setBankSubjectFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-lavender-200 text-xs"
              >
                <option value="all">All Subjects</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>

              <select
                value={bankDifficultyFilter}
                onChange={(e) => setBankDifficultyFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-lavender-200 text-xs"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportQuestions}
                className="px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-xs text-lavender-300 hover:text-white flex items-center gap-1.5"
              >
                <Download size={14} /> Export JSON
              </button>
              <button
                onClick={handleOpenAddQuestion}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus size={16} /> Add Question
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredBankQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="glass-panel p-5 rounded-2xl border border-lavender-400/20 bg-midnight-950/60 space-y-3 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-stargold-300 font-bold">Q{idx + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-lavender-500/10 text-lavender-300 text-[10px]">
                        {q.subject} • {q.topic}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-midnight-900 text-[10px] text-lavender-400">
                        {q.difficulty}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-white">{q.question}</h4>
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditQuestion(q)}
                      className="p-1.5 rounded-lg text-lavender-300 hover:text-white hover:bg-lavender-500/20"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this question?')) {
                          await onDeleteQuestion(q.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-lavender-300 hover:text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-xl border ${
                        i === q.correctOptionIndex
                          ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-200 font-semibold'
                          : 'border-lavender-400/15 bg-midnight-900/40 text-lavender-300'
                      }`}
                    >
                      {opt} {i === q.correctOptionIndex && '✓'}
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-lavender-400/90 pt-1 border-t border-lavender-400/10">
                  <strong className="text-stargold-300">Explanation:</strong> {q.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Add / Edit Question Modal */}
          {isAddQModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-lavender-400/30 bg-midnight-900/95 space-y-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-stargold-300" />
                  {editingQ ? 'Edit Question' : 'Add New Question to Bank'}
                </h3>

                <form onSubmit={handleSaveQuestionSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-lavender-200 mb-1">Subject</label>
                      <select
                        value={qSubject}
                        onChange={(e) => setQSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                      >
                        {subjects.map(s => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-lavender-200 mb-1">Difficulty</label>
                      <select
                        value={qDifficulty}
                        onChange={(e) => setQDifficulty(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-lavender-200 mb-1">Topic / Framework</label>
                    <input
                      type="text"
                      placeholder="e.g. RICE Prioritization"
                      value={qTopic}
                      onChange={(e) => setQTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-lavender-200 mb-1">Question Prompt *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="State the MBA conceptual or case question..."
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs text-lavender-200">
                      Options & Correct Answer (Select the radio for correct option):
                    </label>
                    {qOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOptionRadio"
                          checked={qCorrectIndex === i}
                          onChange={() => setQCorrectIndex(i)}
                          className="accent-stargold-400"
                        />
                        <input
                          type="text"
                          required
                          placeholder={`Option ${['A', 'B', 'C', 'D'][i]}...`}
                          value={opt}
                          onChange={(e) => {
                            const copy = [...qOptions];
                            copy[i] = e.target.value;
                            setQOptions(copy);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs text-lavender-200 mb-1">Explanation & Rationale</label>
                    <textarea
                      rows={2}
                      placeholder="Why is this the correct answer? Cite MBA frameworks or mechanics..."
                      value={qExplanation}
                      onChange={(e) => setQExplanation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-lavender-400/20">
                    <button
                      type="button"
                      onClick={() => setIsAddQModalOpen(false)}
                      className="px-3 py-1.5 rounded-xl text-xs text-lavender-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs"
                    >
                      Save Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. HIGH SCORES & LEADERBOARD */}
      {/* ========================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 space-y-6 animate-fadeIn">
          <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
            <Trophy size={20} className="text-stargold-300" />
            Personal Challenge Leaderboard
          </h3>

          <div className="space-y-3">
            {scoreHistory.length === 0 ? (
              <div className="p-8 text-center text-xs text-lavender-400 border border-dashed border-lavender-400/20 rounded-2xl">
                No game challenges recorded yet. Spin the wheel to set your first high score!
              </div>
            ) : (
              scoreHistory.map((s, idx) => (
                <div key={s.id} className="p-4 rounded-2xl bg-midnight-900/60 border border-lavender-400/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-stargold-400/20 text-stargold-300 font-bold flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-serif font-bold text-white">{s.subjectName}</div>
                      <div className="text-[11px] text-lavender-400">{new Date(s.completedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-stargold-300 font-mono">{s.score} / {s.maxScore} ({s.accuracy}%)</div>
                    <div className="text-[10px] text-emerald-400 font-mono">+{s.xpEarned} XP</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
