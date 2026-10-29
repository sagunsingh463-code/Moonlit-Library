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
  UserProfile
} from './types';
import { db } from './services/db';
import { sound } from './services/audio';
import { authService } from './services/auth';

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

import { HomeView } from './components/Views/HomeView';
import { FilesView } from './components/Views/FilesView';
import { NotesView } from './components/Views/NotesView';
import { AssignmentsView } from './components/Views/AssignmentsView';
import { LecturesView } from './components/Views/LecturesView';
import { QuizRoomView } from './components/Views/QuizRoomView';
import { QuestionBankView } from './components/Views/QuestionBankView';
import { StudyPlannerView } from './components/Views/StudyPlannerView';
import { ProgressView } from './components/Views/ProgressView';

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

  // App Data State
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [lectures, setLectures] = useState<LectureItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [customQuizzes, setCustomQuizzes] = useState<QuizDefinition[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizSession[]>([]);
  const [constellations, setConstellations] = useState<ConstellationStar[]>([]);
  const [plannerTasks, setPlannerTasks] = useState<StudyPlanTask[]>([]);
  const [gardenItems, setGardenItems] = useState<GardenItem[]>([]);
  const [stats, setStats] = useState<UserStudyStats | null>(null);

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
        loadedStats
      ] = await Promise.all([
        db.getSettings(),
        db.getAllFiles(),
        db.getAllNotes(),
        db.getAllAssignments(),
        db.getAllLectures(),
        db.getAllQuestions(),
        db.getCustomQuizzes(),
        db.getQuizHistory(),
        db.getConstellationStars(),
        db.getPlannerTasks(),
        db.getGardenItems(),
        db.getStats()
      ]);

      setSettings(loadedSettings);
      setFiles(loadedFiles);
      setNotes(loadedNotes);
      setAssignments(loadedAssignments);
      setLectures(loadedLectures);
      setQuestions(loadedQuestions);
      setCustomQuizzes(loadedCustomQuizzes);
      setQuizHistory(loadedQuizHistory);
      setConstellations(loadedConstellations);
      setPlannerTasks(loadedPlanner);
      setGardenItems(loadedGarden);
      setStats(loadedStats);

      sound.setMuted(!loadedSettings.soundEnabled);
      sound.setVolume(loadedSettings.volume || 0.35);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  useEffect(() => {
    // If not authenticated, set default demo user session for instant seamless preview
    if (!authService.isAuthenticated()) {
      authService.loginDemo().then(({ user }) => {
        setCurrentUser(user);
        loadData();
      }).catch(() => {
        loadData();
      });
    } else {
      authService.refreshUser().then(user => {
        if (user) setCurrentUser(user);
        loadData();
      });
    }

    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
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

  if (!settings || !stats) {
    return (
      <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center text-stargold-200 font-serif text-lg gap-3">
        <div className="text-4xl animate-pulse">🌙</div>
        <div>Awakening Moonlit Library...</div>
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
                  onNavigate={handleNavigate}
                  onOpenFocusMode={() => setIsFocusModeOpen(true)}
                  onToggleTask={handleTogglePlannerTask}
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
    </div>
  );
}

export default App;
