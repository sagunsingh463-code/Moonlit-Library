import React, { useState, useEffect } from 'react';
import { 
  ViewMode, 
  FileItem, 
  NoteItem, 
  AssignmentItem, 
  LectureItem, 
  QuestionItem, 
  QuizDefinition,
  QuizSession,
  ConstellationStar, 
  StudyPlanTask, 
  GardenItem, 
  UserStudyStats, 
  AppSettings,
  UserProfile,
  AcademicTerm,
  SubjectItem,
  CalendarEvent,
  YouTubeResource,
  LearningDiaryEntry,
  AchievementItem,
  GameScoreRecord,
  ExamCountdownItem
} from './types';
import { db } from './services/db';
import { sound } from './services/audio';
import { authService } from './services/auth';
import { themeService } from './services/theme';
import { 
  initialSettings, 
  initialStats,
  initialNotes,
  initialAssignments,
  initialLectures,
  initialQuestions,
  initialCustomQuizzes,
  initialConstellations,
  initialPlannerTasks,
  initialGardenItems,
  initialTerms,
  initialSubjects,
  initialCalendarEvents,
  initialYouTubeResources,
  initialAchievements,
  initialDiaryEntries,
  initialExamCountdowns
} from './services/seedData';

import { OpeningExperience } from './components/OpeningExperience';
import { SkyBackground } from './components/SkyBackground';
import { Sidebar } from './components/Navigation/Sidebar';
import { TopHeader } from './components/Navigation/TopHeader';
import { MobileNav } from './components/Navigation/MobileNav';
import { AuthModal } from './components/Auth/AuthModal';
import { ProfileModal } from './components/Profile/ProfileModal';
import { MoonlitReader } from './components/Reader/MoonlitReader';
import { ConstellationView } from './components/Constellation/ConstellationView';
import { MagicalBookmarksDrawer } from './components/Bookmarks/MagicalBookmarksDrawer';
import { SecretStudyGarden } from './components/Garden/SecretStudyGarden';
import { MidnightFocusMode } from './components/Focus/MidnightFocusMode';
import { MagicalSearchModal } from './components/Search/MagicalSearchModal';
import { AiStudyAssistantModal } from './components/AI/AiStudyAssistantModal';
import { QuickAddModal } from './components/Navigation/QuickAddModal';
import { Sparkles } from 'lucide-react';

import { HomeView } from './components/Views/HomeView';
import { FilesView } from './components/Views/FilesView';
import { NotesView } from './components/Views/NotesView';
import { AssignmentsView } from './components/Views/AssignmentsView';
import { LecturesView } from './components/Views/LecturesView';
import { QuizRoomView } from './components/Views/QuizRoomView';
import { QuestionBankView } from './components/Views/QuestionBankView';
import { StudyPlannerView } from './components/Views/StudyPlannerView';
import { ProgressView } from './components/Views/ProgressView';
import { AcademicTermsView } from './components/Views/AcademicTermsView';
import { SubjectDashboardView } from './components/Views/SubjectDashboardView';
import { CalendarTimetableView } from './components/Views/CalendarTimetableView';
import { MoonlightArcadeView } from './components/Views/MoonlightArcadeView';
import { YouTubeCentreView } from './components/Views/YouTubeCentreView';
import { LearningDiaryView } from './components/Views/LearningDiaryView';
import { AchievementsView } from './components/Views/AchievementsView';

export function App() {
  const [showOpening, setShowOpening] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('moonlit_skip_intro') !== 'true';
    }
    return true;
  });
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedItemId, setSelectedItemId] = useState<string | undefined>();

  // Moonlit Reader State
  const [activeReaderFile, setActiveReaderFile] = useState<FileItem | null>(null);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // App Data State (Defaults initialized to prevent loading screen freeze)
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [assignments, setAssignments] = useState<AssignmentItem[]>(initialAssignments);
  const [lectures, setLectures] = useState<LectureItem[]>(initialLectures);
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [customQuizzes, setCustomQuizzes] = useState<QuizDefinition[]>(initialCustomQuizzes);
  const [quizHistory, setQuizHistory] = useState<QuizSession[]>([]);
  const [constellations, setConstellations] = useState<ConstellationStar[]>(initialConstellations);
  const [plannerTasks, setPlannerTasks] = useState<StudyPlanTask[]>(initialPlannerTasks);
  const [gardenItems, setGardenItems] = useState<GardenItem[]>(initialGardenItems);
  const [stats, setStats] = useState<UserStudyStats>(initialStats);
  const [isAwakening, setIsAwakening] = useState<boolean>(true);

  // Six-Term Academic, Calendar, YouTube, Diary & Achievements State
  const [terms, setTerms] = useState<AcademicTerm[]>(initialTerms);
  const [subjects, setSubjects] = useState<SubjectItem[]>(initialSubjects);
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [youtubeResources, setYouTubeResources] = useState<YouTubeResource[]>(initialYouTubeResources);
  const [diaryEntries, setDiaryEntries] = useState<LearningDiaryEntry[]>(initialDiaryEntries);
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements);

  // Load all initial persistent data for the current authenticated user
  const loadData = async () => {
    try {
      const [
        loadedSettings,
        loadedFiles,
        loadedNotes,
        loadedAssignments,
        loadedLectures,
        loadedQuestions,
        loadedCustomQuizzes,
        loadedQuizHistory,
        loadedConstellations,
        loadedPlanner,
        loadedGarden,
        loadedStats,
        loadedTerms,
        loadedSubjects,
        loadedCalendar,
        loadedYouTube,
        loadedDiary,
        loadedAchievements
      ] = await Promise.all([
        db.getSettings().catch(() => initialSettings),
        db.getAllFiles().catch(() => []),
        db.getAllNotes().catch(() => initialNotes),
        db.getAllAssignments().catch(() => initialAssignments),
        db.getAllLectures().catch(() => initialLectures),
        db.getAllQuestions().catch(() => initialQuestions),
        db.getCustomQuizzes().catch(() => initialCustomQuizzes),
        db.getQuizHistory().catch(() => []),
        db.getConstellationStars().catch(() => initialConstellations),
        db.getPlannerTasks().catch(() => initialPlannerTasks),
        db.getGardenItems().catch(() => initialGardenItems),
        db.getStats().catch(() => initialStats),
        db.getTerms().catch(() => initialTerms),
        db.getSubjects().catch(() => initialSubjects),
        db.getCalendarEvents().catch(() => initialCalendarEvents),
        db.getYouTubeResources().catch(() => initialYouTubeResources),
        db.getDiaryEntries().catch(() => initialDiaryEntries),
        db.getAchievements().catch(() => initialAchievements)
      ]);

      if (loadedSettings) setSettings(loadedSettings);
      if (loadedFiles) setFiles(loadedFiles);
      if (loadedNotes) setNotes(loadedNotes);
      if (loadedAssignments) setAssignments(loadedAssignments);
      if (loadedLectures) setLectures(loadedLectures);
      if (loadedQuestions) setQuestions(loadedQuestions);
      if (loadedCustomQuizzes) setCustomQuizzes(loadedCustomQuizzes);
      if (loadedQuizHistory) setQuizHistory(loadedQuizHistory);
      if (loadedConstellations) setConstellations(loadedConstellations);
      if (loadedPlanner) setPlannerTasks(loadedPlanner);
      if (loadedGarden) setGardenItems(loadedGarden);
      if (loadedStats) setStats(loadedStats);
      if (loadedTerms) setTerms(loadedTerms);
      if (loadedSubjects) setSubjects(loadedSubjects);
      if (loadedCalendar) setCalendarEvents(loadedCalendar);
      if (loadedYouTube) setYouTubeResources(loadedYouTube);
      if (loadedDiary) setDiaryEntries(loadedDiary);
      if (loadedAchievements) setAchievements(loadedAchievements);

      sound.setMuted(!loadedSettings?.soundEnabled);
      sound.setVolume(loadedSettings?.volume || 0.35);
    } catch (err) {
      console.warn('Data sync notice:', err);
    } finally {
      setIsAwakening(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    themeService.applyTheme();

    // Safety watchdog: Guarantee awakening screen unlocks within 1200ms
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        setIsAwakening(false);
      }
    }, 1200);

    const initUserAndData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          try {
            const { user } = await authService.loginDemo();
            if (mounted) setCurrentUser(user);
          } catch {
            // Demo fallback
          }
        } else {
          try {
            const user = await authService.refreshUser();
            if (mounted && user) setCurrentUser(user);
          } catch {
            // Offline fallback
          }
        }
      } catch (e) {
        console.warn('Init auth notice:', e);
      } finally {
        if (mounted) {
          await loadData();
          setIsAwakening(false);
        }
      }
    };

    initUserAndData();

    const unsubscribe = authService.subscribe((user) => {
      if (mounted) setCurrentUser(user);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  // Update Settings
  const handleUpdateSettings = async (updater: (prev: AppSettings) => AppSettings) => {
    if (!settings) return;
    const next = updater(settings);
    setSettings(next);
    await db.saveSettings(next);
  };

  // Add Constellation Star Helper
  const handleAddStar = async (title: string, category: ConstellationStar['category'], notesText?: string) => {
    const star = await db.addConstellationStar(title, category, notesText);
    setConstellations(prev => [...prev, star]);
    
    // Update stats
    const updatedStats = await db.updateStats(prev => ({
      ...prev,
      starsCollected: prev.starsCollected + 1
    }));
    setStats(updatedStats);
  };

  // Files handlers
  const handleUploadFile = async (
    file: File, 
    category: FileItem['category'], 
    tags: string[], 
    description: string,
    folder?: string
  ) => {
    const item = await db.saveRealFile(file, category, tags, description, folder || 'General');
    setFiles(prev => [item, ...prev]);
    await handleAddStar(`Uploaded Tome: ${file.name}`, 'file', `Stored in ${category} library`);
  };

  const handleDeleteFile = async (id: string) => {
    await db.deleteFile(id);
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeReaderFile && activeReaderFile.id === id) {
      setActiveReaderFile(null);
      setCurrentView('files');
    }
  };

  const handleToggleFavoriteFile = async (id: string) => {
    await db.toggleFavoriteFile(id);
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  // Open file in Moonlit Reader
  const handleOpenFile = (file: FileItem) => {
    sound.playPageTurn();
    setActiveReaderFile(file);
    setCurrentView('reader');
  };

  // Rename file
  const handleRenameFile = async (id: string, newName: string) => {
    await db.renameFile(id, newName);
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    if (activeReaderFile && activeReaderFile.id === id) {
      setActiveReaderFile(prev => prev ? { ...prev, name: newName } : null);
    }
  };

  // Move file to folder
  const handleMoveFolder = async (id: string, folder: string) => {
    await db.moveFileFolder(id, folder);
    setFiles(prev => prev.map(f => f.id === id ? { ...f, folder } : f));
    if (activeReaderFile && activeReaderFile.id === id) {
      setActiveReaderFile(prev => prev ? { ...prev, folder } : null);
    }
  };

  // Update file reading progress
  const handleUpdateFile = (updatedFile: FileItem) => {
    setFiles(prev => prev.map(f => f.id === updatedFile.id ? updatedFile : f));
    if (activeReaderFile && activeReaderFile.id === updatedFile.id) {
      setActiveReaderFile(updatedFile);
    }
  };

  // Notes handlers
  const handleSaveNote = async (note: NoteItem) => {
    await db.saveNote(note);
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === note.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = note;
        return copy;
      }
      return [note, ...prev];
    });
  };

  const handleDeleteNote = async (id: string) => {
    await db.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Assignments handlers
  const handleSaveAssignment = async (asg: AssignmentItem) => {
    await db.saveAssignment(asg);
    setAssignments(prev => {
      const idx = prev.findIndex(a => a.id === asg.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = asg;
        return copy;
      }
      return [asg, ...prev];
    });
  };

  const handleDeleteAssignment = async (id: string) => {
    await db.deleteAssignment(id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmitAssignment = async (id: string, notesText: string, fileName?: string, fileUrl?: string) => {
    await db.submitAssignment(id, notesText, fileName, fileUrl);
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'submitted',
          submissionNotes: notesText,
          submittedFileName: fileName,
          submittedFileUrl: fileUrl,
          submittedAt: new Date().toISOString()
        };
      }
      return a;
    }));

    await handleAddStar(`Submitted Deliverable: ${id}`, 'assignment', `Turned in on ${new Date().toLocaleDateString()}`);

    const updatedStats = await db.updateStats(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1
    }));
    setStats(updatedStats);
  };

  const handleGradeAssignment = async (id: string, grade: string, feedback?: string) => {
    await db.gradeAssignment(id, grade, feedback);
    setAssignments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: 'graded',
          grade,
          gradeFeedback: feedback
        };
      }
      return a;
    }));
  };

  // Lectures handlers
  const handleSaveLecture = async (lec: LectureItem) => {
    await db.saveLecture(lec);
    setLectures(prev => {
      const idx = prev.findIndex(l => l.id === lec.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = lec;
        return copy;
      }
      return [lec, ...prev];
    });
  };

  const handleDeleteLecture = async (id: string) => {
    await db.deleteLecture(id);
    setLectures(prev => prev.filter(l => l.id !== id));
  };

  const handleToggleWatchedLecture = async (id: string) => {
    await db.toggleLectureWatched(id);
    setLectures(prev => prev.map(l => l.id === id ? { ...l, isWatched: !l.isWatched } : l));
  };

  // Questions handlers
  const handleSaveQuestion = async (q: QuestionItem) => {
    await db.saveQuestion(q);
    setQuestions(prev => {
      const idx = prev.findIndex(item => item.id === q.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = q;
        return copy;
      }
      return [q, ...prev];
    });
  };

  const handleDeleteQuestion = async (id: string) => {
    await db.deleteQuestion(id);
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleBookmarkQuestion = async (id: string) => {
    const target = questions.find(q => q.id === id);
    if (target) {
      const updated = { ...target, isBookmarked: !target.isBookmarked };
      await handleSaveQuestion(updated);
    }
  };

  const handleRecordQuestionAttempt = async (id: string, isCorrect: boolean) => {
    await db.recordQuestionAttempt(id, isCorrect);
    setQuestions(prev => prev.map(q => {
      if (q.id === id) {
        return {
          ...q,
          timesPracticed: (q.timesPracticed || 0) + 1,
          timesCorrect: isCorrect ? (q.timesCorrect || 0) + 1 : q.timesCorrect,
          timesIncorrect: !isCorrect ? ((q.timesIncorrect || 0) + 1) : q.timesIncorrect,
          lastAnsweredCorrectly: isCorrect,
          lastPracticed: new Date().toISOString()
        };
      }
      return q;
    }));
  };

  // Custom Quizzes handlers
  const handleSaveCustomQuiz = async (quiz: QuizDefinition) => {
    await db.saveCustomQuiz(quiz);
    setCustomQuizzes(prev => {
      const idx = prev.findIndex(q => q.id === quiz.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = quiz;
        return copy;
      }
      return [quiz, ...prev];
    });
  };

  const handleDeleteCustomQuiz = async (id: string) => {
    await db.deleteCustomQuiz(id);
    setCustomQuizzes(prev => prev.filter(q => q.id !== id));
  };

  const handleCompleteQuiz = async (session: QuizSession) => {
    await db.saveQuizAttempt(session);
    setQuizHistory(prev => [session, ...prev]);

    if (session.passed) {
      await handleAddStar(
        `Passed ${session.title} (${session.percentage}%)`,
        'quiz',
        `Scored ${session.score}/${session.totalQuestions} in ${session.durationMinutes}m`
      );
    }

    const updatedStats = await db.updateStats(prev => {
      const totalQuizzes = prev.quizzesTaken + 1;
      const newAverage = Math.round(((prev.quizAverageScore * prev.quizzesTaken) + session.percentage) / totalQuizzes);
      return {
        ...prev,
        quizzesTaken: totalQuizzes,
        quizAverageScore: newAverage
      };
    });
    setStats(updatedStats);
  };

  // Planner handlers
  const handleSavePlannerTask = async (task: StudyPlanTask) => {
    await db.savePlannerTask(task);
    setPlannerTasks(prev => {
      const idx = prev.findIndex(t => t.id === task.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = task;
        return copy;
      }
      return [task, ...prev];
    });
  };

  const handleTogglePlannerTask = async (id: string) => {
    const target = plannerTasks.find(t => t.id === id);
    if (target) {
      const updated = { ...target, completed: !target.completed };
      await db.updatePlannerTask(updated);
      setPlannerTasks(prev => prev.map(t => t.id === id ? updated : t));

      if (updated.completed) {
        await handleAddStar(
          `Completed Task: ${target.title}`,
          'note',
          `Finished on ${target.day} (${target.timeSlot})`
        );
        const updatedStats = await db.updateStats(prev => ({
          ...prev,
          tasksCompleted: prev.tasksCompleted + 1
        }));
        setStats(updatedStats);
      }
    }
  };

  const handleDeletePlannerTask = async (id: string) => {
    await db.deletePlannerTask(id);
    setPlannerTasks(prev => prev.filter(t => t.id !== id));
  };

  // Secret Garden item unlock
  const handleUnlockGardenItem = async (id: string) => {
    await db.unlockGardenItem(id);
    setGardenItems(prev => prev.map(item => item.id === id ? { ...item, unlocked: true } : item));
  };

  // Midnight Focus session completion
  const handleFocusSessionComplete = async (minutes: number, taskName: string) => {
    sound.playCelestialChime();
    await handleAddStar(
      `${minutes}m Focus: ${taskName}`,
      'focus',
      `Deep concentration in Midnight Focus Mode`
    );

    const updatedStats = await db.updateStats(prev => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + minutes,
      tasksCompleted: prev.tasksCompleted + 1
    }));
    setStats(updatedStats);
  };

  // Terms & Subjects handlers
  const handleSaveTerm = async (term: AcademicTerm) => {
    await db.saveTerm(term);
    setTerms(prev => prev.map(t => t.id === term.id ? term : t));
  };

  const handleSaveSubject = async (subj: SubjectItem) => {
    await db.saveSubject(subj);
    setSubjects(prev => {
      const idx = prev.findIndex(s => s.id === subj.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = subj;
        return copy;
      }
      return [...prev, subj];
    });
    if (selectedSubject?.id === subj.id) setSelectedSubject(subj);
  };

  const handleDeleteSubject = async (id: string) => {
    await db.deleteSubject(id);
    setSubjects(prev => prev.filter(s => s.id !== id));
    if (selectedSubject?.id === id) {
      setSelectedSubject(null);
      setCurrentView('terms');
    }
  };

  const handleSelectSubject = (subj: SubjectItem) => {
    setSelectedSubject(subj);
    setCurrentView('subject');
  };

  // Calendar Event handlers
  const handleSaveCalendarEvent = async (event: CalendarEvent) => {
    await db.saveCalendarEvent(event);
    setCalendarEvents(prev => {
      const idx = prev.findIndex(e => e.id === event.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = event;
        return copy;
      }
      return [...prev, event];
    });
  };

  const handleDeleteCalendarEvent = async (id: string) => {
    await db.deleteCalendarEvent(id);
    setCalendarEvents(prev => prev.filter(e => e.id !== id));
  };

  // YouTube Resource handlers
  const handleSaveYouTubeResource = async (res: YouTubeResource) => {
    await db.saveYouTubeResource(res);
    setYouTubeResources(prev => {
      const idx = prev.findIndex(y => y.id === res.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = res;
        return copy;
      }
      return [...prev, res];
    });
  };

  const handleDeleteYouTubeResource = async (id: string) => {
    await db.deleteYouTubeResource(id);
    setYouTubeResources(prev => prev.filter(y => y.id !== id));
  };

  // Learning Diary handlers
  const handleSaveDiaryEntry = async (entry: LearningDiaryEntry) => {
    await db.saveDiaryEntry(entry);
    setDiaryEntries(prev => {
      const idx = prev.findIndex(d => d.id === entry.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = entry;
        return copy;
      }
      return [entry, ...prev];
    });
  };

  const handleDeleteDiaryEntry = async (id: string) => {
    await db.deleteDiaryEntry(id);
    setDiaryEntries(prev => prev.filter(d => d.id !== id));
  };

  // Arcade Score handler
  const handleSaveGameScore = async (score: GameScoreRecord) => {
    await db.saveGameScore(score);
    if (score.accuracy >= 80) {
      await handleAddStar(
        `High Score in ${score.subjectName} (${score.accuracy}%)`,
        'quiz',
        `Earned +${score.xpEarned} XP in Moonlight Arcade`
      );
    }
  };

  // Direct subject file upload helper
  const handleUploadSubjectFile = async (file: File, subjectName: string) => {
    let cat: FileItem['category'] = 'PDF';
    if (file.name.endsWith('.pdf')) cat = 'PDF';
    else if (file.name.endsWith('.ppt') || file.name.endsWith('.pptx')) cat = 'Slides';
    else if (file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.txt')) cat = 'Notes';
    else if (file.type.startsWith('image/')) cat = 'Image';
    const uploaded = await db.saveRealFile(file, cat, [subjectName, 'Subject Material'], `Course material for ${subjectName}`, subjectName);
    setFiles(prev => [uploaded, ...prev]);
  };

  // Universal Navigation helper
  const handleNavigate = (view: ViewMode, itemId?: string) => {
    if (view === 'files' && itemId) {
      const targetFile = files.find(f => f.id === itemId);
      if (targetFile) {
        handleOpenFile(targetFile);
        return;
      }
    }
    setCurrentView(view);
    setSelectedItemId(itemId);
  };

  // Authentication Handlers
  const handleAuthSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    await db.clearLocalCache();
    await loadData();
  };

  const handleProfileUpdated = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
  };

  const handleLogout = async () => {
    authService.logout();
    await db.clearLocalCache();
    setCurrentUser(null);
    setIsProfileModalOpen(false);
    setIsAuthModalOpen(true);
  };

  if (isAwakening && (!settings || !stats)) {
    return (
      <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
        {/* Ambient celestial glow */}
        <div className="absolute w-96 h-96 rounded-full bg-lavender-600/15 blur-3xl pointer-events-none animate-pulse" />
        
        {/* Shagun Anime Girl Mascot Loading Vignette */}
        <div className="relative z-10 space-y-4 max-w-sm">
          <div className="relative w-28 h-28 mx-auto rounded-3xl p-1 bg-gradient-to-tr from-stargold-400 via-lavender-400 to-amber-500 shadow-2xl shadow-lavender-500/30">
            <div className="w-full h-full rounded-[22px] overflow-hidden bg-midnight-950">
              <img 
                src="/shagun/shagun_reading_portrait.jpg" 
                alt="Shagun reading under moonlight" 
                className="w-full h-full object-cover object-[center_20%]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/shagun/shagun_reading.jpg';
                }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-midnight-950 border border-stargold-400/60 text-[10px] font-serif font-bold text-stargold-300 whitespace-nowrap shadow-md">
              Shagun ✨
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <h2 className="text-xl font-serif font-bold text-white tracking-wide flex items-center justify-center gap-2">
              <span>Awakening Moonlit Library</span>
              <span className="text-stargold-300 animate-pulse">🌙</span>
            </h2>
            <p className="text-xs text-lavender-300 font-sans">
              Shagun is lighting the candles and opening the grimoires of wisdom...
            </p>
          </div>

          <div className="w-32 h-1 bg-midnight-900 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-stargold-400 via-lavender-400 to-amber-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-midnight-950 text-moonlight-silver selection:bg-lavender-500/40 relative ${settings.reduceMotion ? 'reduced-motion' : ''}`}>
      {/* Background Night Sky */}
      <SkyBackground reduceMotion={settings.reduceMotion} />

      {/* Opening Cinematic Experience */}
      {showOpening && (
        <OpeningExperience
          onEnter={() => {
            setShowOpening(false);
            if (!currentUser) {
              setIsAuthModalOpen(true);
            }
          }}
          reduceMotion={settings.reduceMotion}
        />
      )}

      {/* ----------------- RENDER MOONLIT READER IF ACTIVE ----------------- */}
      {currentView === 'reader' && activeReaderFile ? (
        <MoonlitReader
          file={activeReaderFile}
          onBack={() => setCurrentView('files')}
          onUpdateFile={handleUpdateFile}
        />
      ) : (
        /* ----------------- MAIN LMS DASHBOARD CONTAINER ----------------- */
        <div className="relative z-10 flex min-h-screen">
          {/* Persistent Sidebar (Collapsible Desktop) */}
          <Sidebar
            currentView={currentView}
            onSelectView={(v) => {
              sound.playPageTurn();
              setCurrentView(v);
            }}
            onOpenFocusMode={() => setIsFocusModeOpen(true)}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            currentUser={currentUser}
            starsCount={stats.starsCollected}
            streakDays={stats.currentStreakDays}
          />

          {/* Primary Content Stream */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Header */}
            <TopHeader
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenBookmarks={() => setIsBookmarksOpen(true)}
              onOpenFocusMode={() => setIsFocusModeOpen(true)}
              onReopenOpening={() => setShowOpening(true)}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              onOpenQuickAdd={() => setIsQuickAddOpen(true)}
              currentUser={currentUser}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              currentMoonPhase="waning-gibbous"
            />

            {/* Dynamic Content Views - With pb-24 md:pb-6 so Mobile Bottom Nav doesn't overlap */}
            <main className="flex-1 overflow-y-auto pb-24 md:pb-6">
              {currentView === 'home' && (
                <HomeView
                  studentName={currentUser?.name || settings.studentName}
                  stats={stats}
                  notes={notes}
                  questions={questions}
                  assignments={assignments}
                  plannerTasks={plannerTasks}
                  calendarEvents={calendarEvents}
                  youtubeResources={youtubeResources}
                  subjects={subjects}
                  onNavigate={handleNavigate}
                  onOpenFocusMode={() => setIsFocusModeOpen(true)}
                  onToggleTask={handleTogglePlannerTask}
                />
              )}

              {currentView === 'terms' && (
                <AcademicTermsView
                  terms={terms}
                  subjects={subjects}
                  onSelectSubject={handleSelectSubject}
                  onSaveTerm={handleSaveTerm}
                  onSaveSubject={handleSaveSubject}
                  onDeleteSubject={handleDeleteSubject}
                />
              )}

              {currentView === 'subject' && selectedSubject && (
                <SubjectDashboardView
                  subject={selectedSubject}
                  notes={notes}
                  files={files}
                  assignments={assignments}
                  lectures={lectures}
                  questions={questions}
                  calendarEvents={calendarEvents}
                  youtubeResources={youtubeResources}
                  onBack={() => setCurrentView('terms')}
                  onNavigateToView={(v) => setCurrentView(v)}
                  onUploadFile={handleUploadSubjectFile}
                  onOpenFileViewer={handleOpenFile}
                  onSaveYouTube={handleSaveYouTubeResource}
                  onDeleteYouTube={handleDeleteYouTubeResource}
                  onSaveSubject={handleSaveSubject}
                />
              )}

              {currentView === 'calendar' && (
                <CalendarTimetableView
                  events={calendarEvents}
                  subjects={subjects}
                  onSaveEvent={handleSaveCalendarEvent}
                  onDeleteEvent={handleDeleteCalendarEvent}
                  onSelectSubject={handleSelectSubject}
                />
              )}

              {currentView === 'arcade' && (
                <MoonlightArcadeView
                  subjects={subjects}
                  allQuestions={questions}
                  onSaveScore={handleSaveGameScore}
                  onSaveQuestion={handleSaveQuestion}
                  onDeleteQuestion={handleDeleteQuestion}
                  userStreak={stats.currentStreakDays}
                  userStars={stats.starsCollected}
                />
              )}

              {currentView === 'youtube' && (
                <YouTubeCentreView
                  resources={youtubeResources}
                  subjects={subjects}
                  onSaveResource={handleSaveYouTubeResource}
                  onDeleteResource={handleDeleteYouTubeResource}
                />
              )}

              {currentView === 'diary' && (
                <LearningDiaryView
                  entries={diaryEntries}
                  subjects={subjects}
                  onSaveEntry={handleSaveDiaryEntry}
                  onDeleteEntry={handleDeleteDiaryEntry}
                  userStreak={stats.currentStreakDays}
                />
              )}

              {currentView === 'achievements' && (
                <AchievementsView
                  achievements={achievements}
                  userStars={stats.starsCollected}
                  userStreak={stats.currentStreakDays}
                />
              )}

              {currentView === 'files' && (
                <FilesView
                  files={files}
                  onUploadFile={handleUploadFile}
                  onDeleteFile={handleDeleteFile}
                  onToggleFavorite={handleToggleFavoriteFile}
                  onOpenFile={handleOpenFile}
                  onRenameFile={handleRenameFile}
                  onMoveFolder={handleMoveFolder}
                />
              )}

              {currentView === 'notes' && (
                <NotesView
                  notes={notes}
                  selectedNoteId={selectedItemId}
                  onSaveNote={handleSaveNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}

              {currentView === 'assignments' && (
                <AssignmentsView
                  assignments={assignments}
                  availableFiles={files}
                  onSaveAssignment={handleSaveAssignment}
                  onDeleteAssignment={handleDeleteAssignment}
                  onSubmitAssignment={handleSubmitAssignment}
                  onGradeAssignment={handleGradeAssignment}
                />
              )}

              {currentView === 'lectures' && (
                <LecturesView
                  lectures={lectures}
                  availableFiles={files}
                  onSaveLecture={handleSaveLecture}
                  onDeleteLecture={handleDeleteLecture}
                  onToggleWatched={handleToggleWatchedLecture}
                />
              )}

              {currentView === 'quiz' && (
                <QuizRoomView
                  questions={questions}
                  customQuizzes={customQuizzes}
                  quizHistory={quizHistory}
                  onSaveCustomQuiz={handleSaveCustomQuiz}
                  onDeleteCustomQuiz={handleDeleteCustomQuiz}
                  onCompleteQuiz={handleCompleteQuiz}
                  onBookmarkQuestion={handleBookmarkQuestion}
                  onRecordAttempt={handleRecordQuestionAttempt}
                  onNavigateToIncorrectPractice={() => setCurrentView('question-bank')}
                />
              )}

              {currentView === 'question-bank' && (
                <QuestionBankView
                  questions={questions}
                  selectedQuestionId={selectedItemId}
                  onSaveQuestion={handleSaveQuestion}
                  onDeleteQuestion={handleDeleteQuestion}
                  onBookmarkQuestion={handleBookmarkQuestion}
                  onRecordAttempt={handleRecordQuestionAttempt}
                  onStartIncorrectDrill={() => setCurrentView('quiz')}
                />
              )}

              {currentView === 'planner' && (
                <StudyPlannerView
                  tasks={plannerTasks}
                  onSaveTask={handleSavePlannerTask}
                  onToggleTask={handleTogglePlannerTask}
                  onDeleteTask={handleDeletePlannerTask}
                />
              )}

              {currentView === 'progress' && (
                <ProgressView stats={stats} />
              )}

              {currentView === 'constellation' && (
                <ConstellationView
                  stars={constellations}
                  onAddStar={handleAddStar}
                  reduceMotion={settings.reduceMotion}
                />
              )}

              {currentView === 'garden' && (
                <SecretStudyGarden
                  items={gardenItems}
                  onUnlockItem={handleUnlockGardenItem}
                  reduceMotion={settings.reduceMotion}
                />
              )}
            </main>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (< 768px) - hidden when in full Reader view */}
      {currentView !== 'reader' && (
        <MobileNav
          currentView={currentView}
          onSelectView={(v) => {
            sound.playPageTurn();
            setCurrentView(v);
          }}
          onOpenFocusMode={() => setIsFocusModeOpen(true)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          currentUser={currentUser}
          starsCount={stats.starsCollected}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        allowClose={!!currentUser}
      />

      {/* Profile & Account Management Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onProfileUpdated={handleProfileUpdated}
          onLogout={handleLogout}
        />
      )}

      {/* Global Magical Search Modal */}
      <MagicalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        files={files}
        notes={notes}
        assignments={assignments}
        lectures={lectures}
        questions={questions}
        onNavigate={handleNavigate}
      />

      {/* Magical Moon-Shaped Bookmarks Drawer */}
      <MagicalBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        notes={notes}
        questions={questions}
        onNavigateToNote={(id) => handleNavigate('notes', id)}
        onNavigateToQuestion={(id) => handleNavigate('question-bank', id)}
      />

      {/* Midnight Focus Mode Full-Screen Overlay */}
      <MidnightFocusMode
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        onSessionComplete={handleFocusSessionComplete}
        reduceMotion={settings.reduceMotion}
      />

      {/* Floating Luna AI Study Assistant Button */}
      {!isAiAssistantOpen && !showOpening && (
        <button
          onClick={() => {
            sound.playSparkle();
            setIsAiAssistantOpen(true);
          }}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-lavender-600 via-indigo-600 to-lavender-700 text-white shadow-star-glow hover:brightness-110 flex items-center gap-2 border border-lavender-300/40 transition-all hover:scale-105 group"
          title="Open Luna AI Study Assistant (Bilingual Hindi & English)"
          aria-label="Open AI Study Assistant"
        >
          <div className="w-5 h-5 rounded-full bg-stargold-400/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-stargold-300 animate-pulse" />
          </div>
          <span className="text-xs font-serif font-bold tracking-wide">
            Ask Luna AI
          </span>
          <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono text-stargold-200">
            Hindi & English
          </span>
        </button>
      )}

      {/* Online AI Study Assistant Modal */}
      <AiStudyAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        activeSubject={undefined}
        libraryNotesCount={notes.length}
        libraryFilesCount={files.length}
      />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        subjects={subjects}
        onSaveNote={handleSaveNote}
        onSaveTask={handleSavePlannerTask}
        onSaveCalendarEvent={handleSaveCalendarEvent}
        onSaveYouTube={handleSaveYouTubeResource}
      />
    </div>
  );
}

export default App;
