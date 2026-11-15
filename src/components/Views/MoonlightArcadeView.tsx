import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Trophy,
  SlidersHorizontal,
  Settings,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  ChevronRight,
  Check,
  X
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

// Canonical Term 2 Ongoing Subjects
const term2DefaultSubjects: Partial<SubjectItem>[] = [
  { id: 't2-1', name: 'Microeconomics', termNumber: 2, code: 'ECON201' },
  { id: 't2-2', name: 'Introduction to UI/UX', termNumber: 2, code: 'UX202' },
  { id: 't2-3', name: 'Leadership Accelerator', termNumber: 2, code: 'LEAD203' },
  { id: 't2-4', name: 'Market Research Methods', termNumber: 2, code: 'MRM204' },
  { id: 't2-5', name: 'Product Management', termNumber: 2, code: 'PM205' },
  { id: 't2-6', name: 'CV Interview Workshop', termNumber: 2, code: 'CAR206' },
  { id: 't2-7', name: 'Entrepreneurial Mindset', termNumber: 2, code: 'ENT207' }
];

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
  const [activeTab, setActiveTab] = useState<'wheel' | 'memory' | 'flashcard' | 'true-false' | 'bank' | 'leaderboard'>('wheel');

  // ============================================
  // TERM 2 SELECTION & WHEEL SETTINGS
  // Default strictly to Term 2 (Currently Ongoing)
  // ============================================
  const [selectedWheelTerm, setSelectedWheelTerm] = useState<number>(() => {
    if (typeof window === 'undefined') return 2;
    const saved = localStorage.getItem('moonlit_arcade_wheel_term');
    return saved ? parseInt(saved, 10) : 2;
  });

  const [isTermSettingsOpen, setIsTermSettingsOpen] = useState(false);

  // Active subjects for the wheel: Strictly filter by selectedWheelTerm
  const activeWheelSubjects = useMemo(() => {
    const termFiltered = subjects.filter(s => s.termNumber === selectedWheelTerm);
    if (termFiltered.length > 0) return termFiltered;
    if (selectedWheelTerm === 2) {
      return term2DefaultSubjects as SubjectItem[];
    }
    return subjects.filter(s => s.termNumber === selectedWheelTerm).length > 0 
      ? subjects.filter(s => s.termNumber === selectedWheelTerm)
      : (term2DefaultSubjects as SubjectItem[]);
  }, [subjects, selectedWheelTerm]);

  const handleSelectWheelTerm = (termNum: number) => {
    sound.playCardClick();
    setSelectedWheelTerm(termNum);
    localStorage.setItem('moonlit_arcade_wheel_term', String(termNum));
    setIsTermSettingsOpen(false);
  };

  // ============================================
  // SPIN THE WHEEL & 50-QUESTION CHALLENGE STATE
  // ============================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('');
  
  // 50-Question Challenge Active Session
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [challengeQuestions, setChallengeQuestions] = useState<QuestionItem[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: { selected: number; isCorrect: boolean } }>({});
  const [challengeTimerSeconds, setChallengeTimerSeconds] = useState(3000); // 50 mins countdown
  const [challengeTimeTaken, setChallengeTimeTaken] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isChallengeComplete, setIsChallengeComplete] = useState(false);
  
  // Audit filter in Scorecard: 'missed' | 'all'
  const [auditFilter, setAuditFilter] = useState<'missed' | 'all'>('missed');

  // Scores History
  const [scoreHistory, setScoreHistory] = useState<GameScoreRecord[]>([]);

  // Wheel vibrant colors
  const wheelColors = [
    '#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', 
    '#ec4899', '#3b82f6', '#6366f1', '#14b8a6', '#a855f7'
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
    const numSegments = activeWheelSubjects.length || 1;
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
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(segAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Cinzel", serif, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 5;
      const text = activeWheelSubjects[i]?.name || `Subject ${i + 1}`;
      ctx.fillText(text.length > 18 ? text.slice(0, 16) + '..' : text, radius - 22, 5);
      ctx.restore();
    }

    // Outer Glowing Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Center Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌙', centerX, centerY);
  };

  useEffect(() => {
    drawWheel(currentRotation.current);
  }, [activeWheelSubjects]);

  // Spin Wheel Action (Random Selection)
  const handleSpinWheel = () => {
    if (isSpinning || activeWheelSubjects.length === 0) return;
    sound.playCelestialChime();
    setIsSpinning(true);
    setSelectedSubjectName('');

    const spinRotations = 6 + Math.random() * 4; // 6 to 10 full turns
    const totalAngle = spinRotations * 2 * Math.PI;
    const durationMs = 4200;
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
        const pointerAngle = (1.5 * Math.PI - normalized + 2 * Math.PI) % (2 * Math.PI);
        const selectedIndex = Math.floor(pointerAngle / arc) % numSegments;
        const picked = activeWheelSubjects[selectedIndex]?.name || 'Microeconomics';
        setSelectedSubjectName(picked);
        sound.playCelestialChime();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    };

    requestAnimationFrame(animateSpin);
  };

  // Launch 50-Question Scenario Challenge
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
    setAuditFilter('missed');
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
    const xpEarned = correctCount * 10 + (accuracy >= 80 ? 250 : 50);

    const scoreRecord: GameScoreRecord = {
      id: `score-${Date.now()}`,
      gameType: 'wheel',
      subjectName: selectedSubjectName || 'Term 2 MBA Challenge',
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
      particleCount: 120,
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
  // WEAK TOPICS & PERSONALIZED RECOMMENDATIONS ENGINE
  // ============================================
  const challengeAnalytics = useMemo(() => {
    if (!isChallengeComplete || challengeQuestions.length === 0) {
      return { weakTopics: [], recommendations: [], correctCount: 0, accuracy: 0 };
    }

    const topicStats: Record<string, { subject: string; topic: string; total: number; incorrect: number; questions: QuestionItem[] }> = {};
    let correctCount = 0;

    challengeQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      const isCorrect = Boolean(ans?.isCorrect);
      if (isCorrect) correctCount++;

      if (!topicStats[q.topic]) {
        topicStats[q.topic] = {
          subject: q.subject,
          topic: q.topic,
          total: 0,
          incorrect: 0,
          questions: []
        };
      }
      topicStats[q.topic].total += 1;
      if (!isCorrect) {
        topicStats[q.topic].incorrect += 1;
        topicStats[q.topic].questions.push(q);
      }
    });

    const weakTopics = Object.values(topicStats)
      .filter(t => t.incorrect > 0)
      .sort((a, b) => b.incorrect - a.incorrect);

    const totalQuestions = challengeQuestions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Generate personalized MBA recommendations
    const recommendations: { title: string; detail: string; action: string }[] = [];

    weakTopics.slice(0, 4).forEach(w => {
      let advice = `Review foundational frameworks for "${w.topic}" in your ${w.subject} curriculum.`;
      let action = `Focus on case study scenarios in ${w.subject}`;

      if (w.topic.toLowerCase().includes('elasticity') || w.topic.toLowerCase().includes('revenue')) {
        advice = 'Revisit Price Elasticity of Demand (|Ed| > 1 elastic vs |Ed| < 1 inelastic) and how price adjustments shift total revenue curves.';
        action = 'Practice Microeconomics Lecture 3 pricing formulas';
      } else if (w.topic.toLowerCase().includes('rice') || w.topic.toLowerCase().includes('prioritization')) {
        advice = 'Review the RICE scoring formula ((Reach × Impact × Confidence) / Effort) and how to discount speculative projects.';
        action = 'Review Term 2 Product Management Lecture 2';
      } else if (w.topic.toLowerCase().includes('retention') || w.topic.toLowerCase().includes('nrr') || w.topic.toLowerCase().includes('churn')) {
        advice = 'Focus on cohort retention curve flattening (PMF indicator) and SaaS Net Revenue Retention (NRR) decomposition.';
        action = 'Analyze SaaS unit economics in Product Management';
      } else if (w.topic.toLowerCase().includes('fitts') || w.topic.toLowerCase().includes('hick') || w.topic.toLowerCase().includes('wcag')) {
        advice = 'Revise human-computer interaction heuristics: Fitts\'s Law thumb zones, Hick\'s decision latency, and WCAG AA 4.5:1 text contrast ratios.';
        action = 'Re-check UI/UX Lecture 4 accessibility rules';
      } else if (w.topic.toLowerCase().includes('psychological safety') || w.topic.toLowerCase().includes('hersey') || w.topic.toLowerCase().includes('situational')) {
        advice = 'Deep dive into Amy Edmondson\'s Google Project Aristotle psychological safety and Hersey-Blanchard Situational Leadership matrices.';
        action = 'Review Leadership Accelerator Case Studies';
      } else if (w.topic.toLowerCase().includes('star') || w.topic.toLowerCase().includes('x-y-z') || w.topic.toLowerCase().includes('interview')) {
        advice = 'Practice structuring behavioral answers using STAR (Situation, Task, Action, Result) and Google\'s X-Y-Z quantifiable resume formula.';
        action = 'Practice in CV Interview Workshop notes';
      } else if (w.topic.toLowerCase().includes('effectuation') || w.topic.toLowerCase().includes('affordable loss') || w.topic.toLowerCase().includes('mom test')) {
        advice = 'Study Saras Sarasvathy\'s Effectuation principles (Bird-in-Hand, Affordable Loss, Lemonade) and Rob Fitzpatrick\'s Mom Test interview rules.';
        action = 'Review Entrepreneurial Mindset frameworks';
      }

      recommendations.push({
        title: `${w.topic} (${w.incorrect} Missed)`,
        detail: advice,
        action
      });
    });

    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Outstanding Mastery!',
        detail: 'You demonstrated comprehensive conceptual mastery across all tested business scenarios. Proceed to advanced case studies or explore another Term 2 subject.',
        action: 'Maintain streak and challenge other active subjects'
      });
    }

    return { weakTopics, recommendations, correctCount, accuracy };
  }, [isChallengeComplete, challengeQuestions, userAnswers]);

  // ============================================
  // MEMORY MATCH GAME MODE STATE
  // ============================================
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  const initMemoryGame = () => {
    sound.playCardClick();
    const pairs = initialMemoryGamePairs.slice(0, 6);
    const cards: any[] = [];
    pairs.forEach(p => {
      cards.push({ id: p.id, type: 'concept', text: p.concept, matchId: p.id });
      cards.push({ id: `${p.id}-def`, type: 'definition', text: p.definition, matchId: p.id });
    });
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
  // EDITABLE QUESTION BANK STATE & APPROVAL FLOW
  // ============================================
  const [bankSearch, setBankSearch] = useState('');
  const [bankSubjectFilter, setBankSubjectFilter] = useState('all');
  const [bankDifficultyFilter, setBankDifficultyFilter] = useState('all');
  const [bankApprovalFilter, setBankApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [isAddQModalOpen, setIsAddQModalOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<QuestionItem | null>(null);

  // Form states for adding/editing question
  const [qSubject, setQSubject] = useState('Microeconomics');
  const [qTopic, setQTopic] = useState('');
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qExplanation, setQExplanation] = useState('');
  const [qDifficulty, setQDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [qIsApproved, setQIsApproved] = useState(true);

  const filteredBankQuestions = allQuestions.filter(q => {
    if (bankSubjectFilter !== 'all' && q.subject.toLowerCase() !== bankSubjectFilter.toLowerCase()) return false;
    if (bankDifficultyFilter !== 'all' && q.difficulty.toLowerCase() !== bankDifficultyFilter.toLowerCase()) return false;
    if (bankApprovalFilter === 'approved' && q.isApproved === false) return false;
    if (bankApprovalFilter === 'pending' && q.isApproved !== false) return false;
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
    setQSubject(activeWheelSubjects[0]?.name || 'Microeconomics');
    setQTopic('');
    setQText('');
    setQOptions(['', '', '', '']);
    setQCorrectIndex(0);
    setQExplanation('');
    setQDifficulty('Medium');
    setQIsApproved(true);
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
    setQIsApproved(q.isApproved !== false);
    setIsAddQModalOpen(true);
  };

  const handleToggleApproveQuestion = async (q: QuestionItem) => {
    sound.playSparkle();
    const updated: QuestionItem = {
      ...q,
      isApproved: q.isApproved === false ? true : false
    };
    await onSaveQuestion(updated);
  };

  const handleSaveQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || qOptions.some(o => !o.trim())) {
      alert('Please fill out the question scenario and all 4 options.');
      return;
    }

    sound.playCelestialChime();
    const qData: QuestionItem = {
      id: editingQ ? editingQ.id : `q-${Date.now()}`,
      subject: qSubject,
      topic: qTopic.trim() || 'General MBA Case Application',
      question: qText.trim(),
      options: qOptions.map(o => o.trim()),
      correctOptionIndex: qCorrectIndex,
      explanation: qExplanation.trim() || 'Verified answer rationale based on MBA frameworks.',
      difficulty: qDifficulty,
      isApproved: qIsApproved,
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
              Master practical MBA decision-making through the 50-Question Spin Wheel, weak-topic diagnostics, and conceptual trials.
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
            { id: 'flashcard', label: '⚡ Flashcards' },
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
              {/* Active Wheel Term Configuration Pill */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stargold-400/10 border border-stargold-400/30 text-stargold-300 text-xs font-serif">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Active Wheel: <strong>Term {selectedWheelTerm} {selectedWheelTerm === 2 ? '(Currently Ongoing)' : selectedWheelTerm === 1 ? '(Completed)' : '(Upcoming)'}</strong>
                  <span className="text-lavender-400 text-[11px]">({activeWheelSubjects.length} Subjects)</span>
                </div>

                <button
                  onClick={() => setIsTermSettingsOpen(!isTermSettingsOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-midnight-900 border border-lavender-400/30 text-lavender-300 hover:text-white text-xs hover:border-stargold-400 transition-all"
                  title="Configure wheel term settings"
                >
                  <Settings size={13} />
                  <span>Switch Term Settings</span>
                </button>
              </div>

              {/* Term Settings Drawer / Dropdown */}
              {isTermSettingsOpen && (
                <div className="p-4 rounded-2xl bg-midnight-900/95 border border-stargold-400/40 max-w-md w-full text-left space-y-3 animate-fadeIn shadow-2xl">
                  <div className="flex items-center justify-between text-xs font-bold text-white border-b border-lavender-400/20 pb-2">
                    <span className="flex items-center gap-1.5">
                      <SlidersHorizontal size={14} className="text-stargold-300" />
                      Wheel Subject Term Settings
                    </span>
                    <button 
                      onClick={() => setIsTermSettingsOpen(false)}
                      className="text-lavender-400 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <p className="text-[11px] text-lavender-300">
                    Per preference, Term 2 is active by default. Term 1 and future terms do not appear on the active Term 2 wheel unless switched here.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {[
                      { num: 1, label: 'Term 1 (Completed)', count: '9 Subjects' },
                      { num: 2, label: 'Term 2 (Ongoing) ★', count: '7 Subjects' },
                      { num: 3, label: 'Term 3 (Upcoming)', count: 'Electives' },
                      { num: 4, label: 'Term 4 (Upcoming)', count: 'Electives' }
                    ].map(t => (
                      <button
                        key={t.num}
                        onClick={() => handleSelectWheelTerm(t.num)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          selectedWheelTerm === t.num
                            ? 'border-stargold-400 bg-stargold-400/20 text-white font-bold'
                            : 'border-lavender-400/20 bg-midnight-950/60 text-lavender-300 hover:border-lavender-400/50'
                        }`}
                      >
                        <div className="font-serif">{t.label}</div>
                        <div className="text-[10px] text-lavender-400">{t.count}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="max-w-md space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white">
                  Spin the Wheel of Destiny
                </h3>
                <p className="text-xs text-lavender-300">
                  Press SPIN to randomly select an active subject from <strong>Term {selectedWheelTerm}</strong> and launch a 50-question conceptual scenario challenge!
                </p>
              </div>

              {/* Animated Canvas Wheel Container */}
              <div className="relative flex items-center justify-center py-4">
                {/* Fixed Top Golden Pointer */}
                <div className="absolute top-0 z-20 transform -translate-y-1">
                  <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-stargold-400 filter drop-shadow-[0_0_10px_#fbbf24]" />
                </div>

                <canvas
                  ref={canvasRef}
                  width={350}
                  height={350}
                  className="rounded-full shadow-2xl transition-transform duration-100 border-2 border-stargold-400/40"
                />
              </div>

              {/* Spin & Launch Controls */}
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                <button
                  disabled={isSpinning || activeWheelSubjects.length === 0}
                  onClick={handleSpinWheel}
                  className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-stargold-400 via-amber-400 to-amber-500 text-midnight-950 font-bold text-base hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-stargold-400/25 flex items-center justify-center gap-2.5"
                >
                  <RotateCw size={20} className={isSpinning ? 'animate-spin' : ''} />
                  {isSpinning ? 'Spinning Subject Wheel...' : 'SPIN THE WHEEL'}
                </button>

                {/* Selected Subject Result Banner */}
                {selectedSubjectName && (
                  <div className="w-full p-5 rounded-2xl bg-gradient-to-r from-lavender-500/20 via-purple-500/20 to-lavender-500/20 border border-stargold-400/70 animate-bounce mt-2 space-y-3">
                    <div className="text-xs font-mono text-stargold-300 uppercase tracking-widest">
                      Wheel Landed On:
                    </div>
                    <div className="text-2xl font-serif font-bold text-white tracking-wide">
                      {selectedSubjectName}
                    </div>
                    <button
                      onClick={() => handleStart50QuestionChallenge(selectedSubjectName)}
                      className="w-full py-3 rounded-xl bg-stargold-400 text-midnight-950 font-bold text-sm hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Start 50-Question Scenario Challenge</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {/* Mixed Term Challenge Option */}
                <div className="pt-4 border-t border-lavender-400/15 w-full flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-lavender-300">Want all Term {selectedWheelTerm} subjects combined?</span>
                  <button
                    onClick={() => handleStart50QuestionChallenge(`Term ${selectedWheelTerm} Comprehensive MBA Exam`)}
                    className="px-4 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-xs text-stargold-300 hover:text-white hover:border-stargold-400 transition-all whitespace-nowrap"
                  >
                    Take Mixed 50-Question Exam →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active 50-Question Runner */
            <div className="space-y-6">
              {!isChallengeComplete ? (
                <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-lavender-400/25 bg-midnight-950/70 space-y-6">
                  {/* Runner Header: Progress & Countdown Timer */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-lavender-400/15">
                    <div>
                      <div className="text-xs font-mono text-stargold-300 font-bold uppercase tracking-wider flex items-center gap-2">
                        <span>{selectedSubjectName || 'Term 2 MBA Challenge'}</span>
                        <span>•</span>
                        <span>50 SCENARIO-BASED QUESTIONS</span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-white mt-0.5">
                        Question {currentQIndex + 1} of {challengeQuestions.length}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Live Countdown Timer */}
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono font-bold ${
                        challengeTimerSeconds < 300 
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse' 
                          : 'bg-midnight-900 border-lavender-400/20 text-stargold-300'
                      }`}>
                        <Timer size={16} />
                        <span>{formatTimer(challengeTimerSeconds)}</span>
                        <span className="text-[10px] text-lavender-400 font-normal">remaining</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('Submit current challenge early? Your score and analysis will be calculated based on answered questions.')) {
                            handleCompleteChallenge();
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs hover:bg-rose-500/30"
                      >
                        End & Submit
                      </button>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-midnight-900 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-stargold-400 to-amber-500 transition-all duration-300"
                      style={{ width: `${((currentQIndex + 1) / challengeQuestions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Scenario Box */}
                  {challengeQuestions[currentQIndex] && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-3 py-1 rounded-lg bg-lavender-500/20 text-lavender-200 border border-lavender-400/30 font-medium">
                          {challengeQuestions[currentQIndex].topic}
                        </span>
                        <span className="text-[11px] font-mono text-stargold-300 uppercase tracking-wider">
                          {challengeQuestions[currentQIndex].difficulty} Case Difficulty
                        </span>
                      </div>

                      <h4 className="text-base sm:text-lg font-serif text-white font-medium leading-relaxed bg-midnight-900/40 p-4 rounded-2xl border border-lavender-400/10">
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
                            btnStyle = 'border-stargold-400 bg-lavender-500/20 text-white font-semibold shadow-md';
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasSubmittedAnswer}
                              onClick={() => handleAnswerOptionSelect(optIdx)}
                              className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                            >
                              <span className="w-6 h-6 rounded-lg bg-midnight-950 text-stargold-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {['A', 'B', 'C', 'D'][optIdx]}
                              </span>
                              <span className="flex-1 leading-relaxed">{opt}</span>
                              {hasSubmittedAnswer && isCorrect && <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />}
                              {hasSubmittedAnswer && isPicked && !isCorrect && <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Immediate Feedback with Conceptual Explanation */}
                      {hasSubmittedAnswer && (
                        <div className="p-4 rounded-2xl bg-midnight-900/90 border border-lavender-400/25 space-y-2 animate-fadeIn">
                          <div className="flex items-center gap-2 text-xs font-bold font-serif">
                            {userAnswers[currentQIndex]?.isCorrect ? (
                              <span className="text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle2 size={16} /> Correct Decision! (+10 XP)
                              </span>
                            ) : (
                              <span className="text-rose-400 flex items-center gap-1.5">
                                <XCircle size={16} /> Incorrect Decision
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-lavender-200/90 leading-relaxed">
                            <strong className="text-stargold-300">MBA Rationale & Case Explanation:</strong> {challengeQuestions[currentQIndex].explanation}
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
                            Confirm Answer
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs hover:scale-105 transition-all shadow-md flex items-center gap-1.5"
                          >
                            {currentQIndex < challengeQuestions.length - 1 ? 'Next Scenario Question →' : 'View Final Scoreboard & Analysis 🏆'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ========================================================= */
                /* CHALLENGE COMPLETE: METRICS, WEAK TOPICS & RECOMMENDATIONS */
                /* ========================================================= */
                <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-stargold-400/40 bg-midnight-950/80 space-y-8 animate-fadeIn">
                  <div className="text-center space-y-2">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-stargold-400 to-amber-500 text-midnight-950 flex items-center justify-center shadow-xl shadow-stargold-400/25">
                      <Trophy size={40} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                      50-Question Scenario Challenge Completed!
                    </h3>
                    <p className="text-xs text-lavender-300">
                      Subject: {selectedSubjectName || 'Term 2 MBA Challenge'}
                    </p>
                  </div>

                  {/* Summary Metric Boxes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20 text-center">
                      <div className="text-[10px] text-lavender-400 uppercase font-mono">Score</div>
                      <div className="text-2xl font-serif font-bold text-stargold-300">
                        {challengeAnalytics.correctCount} / 50
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20 text-center">
                      <div className="text-[10px] text-lavender-400 uppercase font-mono">Accuracy</div>
                      <div className={`text-2xl font-serif font-bold ${
                        challengeAnalytics.accuracy >= 75 ? 'text-emerald-300' : 'text-amber-300'
                      }`}>
                        {challengeAnalytics.accuracy}%
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20 text-center">
                      <div className="text-[10px] text-lavender-400 uppercase font-mono">Time Taken</div>
                      <div className="text-2xl font-serif font-bold text-white font-mono">
                        {formatTimer(challengeTimeTaken)}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20 text-center">
                      <div className="text-[10px] text-lavender-400 uppercase font-mono">XP Earned</div>
                      <div className="text-2xl font-serif font-bold text-purple-300">
                        +{challengeAnalytics.correctCount * 10 + 100} XP
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* WEAK TOPICS IDENTIFICATION & ERROR ANALYSIS */}
                  {/* ========================================================= */}
                  <div className="glass-panel p-6 rounded-2xl bg-midnight-900/70 border border-rose-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-serif font-bold text-rose-300 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-rose-400" />
                        Weak Topics & Competency Analysis ({challengeAnalytics.weakTopics.length} Areas Needing Review)
                      </h4>
                      <span className="text-[11px] text-lavender-400">
                        {50 - challengeAnalytics.correctCount} Incorrect Out of 50
                      </span>
                    </div>

                    {challengeAnalytics.weakTopics.length === 0 ? (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs">
                        🎉 Flawless performance! You achieved 100% accuracy with zero weak topics identified.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {challengeAnalytics.weakTopics.map((wt, i) => (
                          <div 
                            key={i}
                            className="p-3.5 rounded-xl bg-midnight-950/80 border border-rose-500/20 space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white font-serif">{wt.topic}</span>
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">
                                {wt.incorrect} / {wt.total} Missed
                              </span>
                            </div>
                            <div className="text-[11px] text-lavender-400">
                              Subject: <strong>{wt.subject}</strong>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-midnight-900 overflow-hidden mt-1">
                              <div 
                                className="h-full bg-rose-500" 
                                style={{ width: `${Math.round((wt.incorrect / wt.total) * 100)}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ========================================================= */}
                  {/* PERSONALIZED MBA IMPROVEMENT RECOMMENDATIONS */}
                  {/* ========================================================= */}
                  <div className="glass-panel p-6 rounded-2xl bg-midnight-900/70 border border-stargold-400/30 space-y-4">
                    <h4 className="text-sm font-serif font-bold text-stargold-300 flex items-center gap-2">
                      <Lightbulb size={16} className="text-amber-400" />
                      Personalized Improvement Recommendations
                    </h4>

                    <div className="space-y-3">
                      {challengeAnalytics.recommendations.map((rec, i) => (
                        <div 
                          key={i} 
                          className="p-4 rounded-xl bg-midnight-950/70 border border-lavender-400/15 space-y-1.5 text-xs"
                        >
                          <div className="font-serif font-bold text-white text-sm">
                            {rec.title}
                          </div>
                          <p className="text-lavender-300 leading-relaxed">
                            {rec.detail}
                          </p>
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-stargold-300 font-mono pt-1">
                            <span>Recommended Action:</span>
                            <span className="text-white font-medium">{rec.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Return / Audit Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-lavender-400/20">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAuditFilter('missed')}
                        className={`px-4 py-2 rounded-xl text-xs font-serif transition-all ${
                          auditFilter === 'missed'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                            : 'bg-midnight-900 text-lavender-400 hover:text-white border border-lavender-400/20'
                        }`}
                      >
                        Show Missed Questions ({50 - challengeAnalytics.correctCount})
                      </button>
                      <button
                        onClick={() => setAuditFilter('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-serif transition-all ${
                          auditFilter === 'all'
                            ? 'bg-stargold-400/20 text-stargold-300 border border-stargold-400/40 font-bold'
                            : 'bg-midnight-900 text-lavender-400 hover:text-white border border-lavender-400/20'
                        }`}
                      >
                        Show All 50 Questions
                      </button>
                    </div>

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

                  {/* Audit Review Section */}
                  <div className="pt-2 text-left space-y-4 max-w-4xl mx-auto">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-stargold-300">
                      {auditFilter === 'missed' ? 'Auditing Missed Scenarios:' : 'Auditing All 50 Scenarios:'}
                    </h5>

                    {challengeQuestions.map((q, idx) => {
                      const userAns = userAnswers[idx];
                      if (auditFilter === 'missed' && userAns?.isCorrect) return null;

                      return (
                        <div 
                          key={idx} 
                          className={`p-5 rounded-2xl bg-midnight-900/90 border space-y-3 text-xs ${
                            userAns?.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-stargold-300 font-bold">
                              Q{idx + 1} • {q.topic}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              userAns?.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {userAns?.isCorrect ? 'Correct Decision ✓' : 'Incorrect Decision ✗'}
                            </span>
                          </div>

                          <div className="text-white font-serif text-sm leading-relaxed">
                            {q.question}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isUserChoice = userAns?.selected === optIdx;
                              const isCorrectOpt = optIdx === q.correctOptionIndex;

                              let optBg = 'bg-midnight-950/60 border-lavender-400/10 text-lavender-300';
                              if (isCorrectOpt) {
                                optBg = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold';
                              } else if (isUserChoice && !isCorrectOpt) {
                                optBg = 'bg-rose-500/20 border-rose-500/60 text-rose-200 line-through';
                              }

                              return (
                                <div key={optIdx} className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${optBg}`}>
                                  <span className="font-mono font-bold shrink-0">{['A', 'B', 'C', 'D'][optIdx]}:</span>
                                  <span>{opt}</span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="p-3 rounded-xl bg-midnight-950/90 border border-lavender-400/15 text-[11px] text-lavender-300 leading-relaxed">
                            <strong className="text-stargold-300">Explanation:</strong> {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
      {/* 5. EDITABLE QUESTION BANK & APPROVAL WORKFLOW */}
      {/* ========================================================= */}
      {activeTab === 'bank' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header controls: Search, Filter, Approval Filter, Add, Export */}
          <div className="glass-panel p-6 rounded-3xl border border-lavender-400/20 bg-midnight-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
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
                  <option key={s.id} value={s.name}>{s.name} (Term {s.termNumber})</option>
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

              <select
                value={bankApprovalFilter}
                onChange={(e) => setBankApprovalFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-lavender-200 text-xs"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved Only ✅</option>
                <option value="pending">Pending Approval ⏳</option>
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
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus size={16} /> Add Question
              </button>
            </div>
          </div>

          {/* Question List with Approval Badges */}
          <div className="space-y-4">
            {filteredBankQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="glass-panel p-5 rounded-2xl border border-lavender-400/20 bg-midnight-950/60 space-y-3 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono text-stargold-300 font-bold">Q{idx + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-lavender-500/10 text-lavender-300 text-[10px]">
                        {q.subject} • {q.topic}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-midnight-900 text-[10px] text-lavender-400">
                        {q.difficulty}
                      </span>
                      <button
                        onClick={() => handleToggleApproveQuestion(q)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                          q.isApproved !== false
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                        title="Click to toggle approved status"
                      >
                        {q.isApproved !== false ? 'Approved ✓' : 'Pending Approval ⏳'}
                      </button>
                    </div>
                    <h4 className="text-sm font-medium text-white">{q.question}</h4>
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleApproveQuestion(q)}
                      className={`p-1.5 rounded-lg text-xs ${
                        q.isApproved !== false ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-amber-400 hover:bg-amber-500/20'
                      }`}
                      title={q.isApproved !== false ? 'Mark as Pending' : 'Approve Question'}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenEditQuestion(q)}
                      className="p-1.5 rounded-lg text-lavender-300 hover:text-white hover:bg-lavender-500/20"
                      title="Edit Question"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete this question from question bank?')) {
                          await onDeleteQuestion(q.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-lavender-300 hover:text-rose-400 hover:bg-rose-500/20"
                      title="Delete Question"
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
                <div className="flex items-center justify-between pb-2 border-b border-lavender-400/20">
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-stargold-300" />
                    {editingQ ? 'Edit Scenario Question' : 'Add New Question to Bank'}
                  </h3>
                  <button onClick={() => setIsAddQModalOpen(false)} className="text-lavender-400 hover:text-white">
                    <X size={16} />
                  </button>
                </div>

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
                          <option key={s.id} value={s.name}>{s.name} (Term {s.termNumber})</option>
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
                    <label className="block text-xs text-lavender-200 mb-1">Topic / Conceptual Framework</label>
                    <input
                      type="text"
                      placeholder="e.g. Price Elasticity of Demand, RICE Scoring"
                      value={qTopic}
                      onChange={(e) => setQTopic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-lavender-200 mb-1">Scenario / Question Prompt *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="State the real-life business situation, MBA case, or trade-off dilemma..."
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs text-lavender-200">
                      Options & Correct Answer (Select the radio button for the correct option):
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
                    <label className="block text-xs text-lavender-200 mb-1">Explanation & MBA Rationale</label>
                    <textarea
                      rows={2}
                      placeholder="Explain why this decision is optimal and why alternatives are flawed..."
                      value={qExplanation}
                      onChange={(e) => setQExplanation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="qIsApprovedCheck"
                      checked={qIsApproved}
                      onChange={(e) => setQIsApproved(e.target.checked)}
                      className="accent-stargold-400 rounded"
                    />
                    <label htmlFor="qIsApprovedCheck" className="text-xs text-lavender-200 cursor-pointer">
                      Mark as Approved for active arcade play
                    </label>
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
