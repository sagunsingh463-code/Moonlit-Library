export type ViewMode = 
  | 'home'
  | 'terms'
  | 'subject'
  | 'calendar'
  | 'arcade'
  | 'youtube'
  | 'diary'
  | 'achievements'
  | 'files'
  | 'reader'
  | 'notes'
  | 'assignments'
  | 'lectures'
  | 'quiz'
  | 'question-bank'
  | 'planner'
  | 'progress'
  | 'constellation'
  | 'garden';

export type MoonPhaseType = 
  | 'new-moon'
  | 'waxing-crescent'
  | 'first-quarter'
  | 'waxing-gibbous'
  | 'full-moon'
  | 'waning-gibbous'
  | 'last-quarter'
  | 'waning-crescent';

export type MascotMood = 'sleepy' | 'studying' | 'cheering' | 'celebrating' | 'curious' | 'meditating';

export interface FileItem {
  id: string;
  userId?: string;
  name: string;
  size: number;
  type: string;
  category: 'PDF' | 'Notes' | 'Slides' | 'Assignment' | 'Audio' | 'Image' | 'Other';
  folder?: string;
  tags: string[];
  uploadedAt: string;
  blob?: Blob;
  dataUrl?: string; // For previews/downloads if stored as dataURL or objectURL
  serverUrl?: string; // Real filesystem path served via backend /uploads/...
  serverFilename?: string;
  description?: string;
  isFavorite?: boolean;
  // Moonlit Reader Reading Experience
  lastReadPage?: number;
  totalPages?: number;
  lastReadAt?: string;
  readingProgress?: number; // 0 - 100 percentage
  bookmarks?: number[]; // Bookmarked page numbers
  zoomLevel?: number;
}


export interface NoteItem {
  id: string;
  title: string;
  content: string;
  subject: string; // e.g. "Corporate Finance", "Marketing Strategy", "Organizational Behavior"
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isBookmarked: boolean;
  bookmarkColor?: string;
  bookmarkNote?: string;
  needsRevision: boolean;
  wordCount: number;
}

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'submitted' | 'graded';
  weightage?: string;
  grade?: string;
  gradeFeedback?: string;
  submissionNotes?: string;
  submittedFileId?: string;
  submittedFileName?: string;
  submittedFileUrl?: string;
  submittedAt?: string;
}

export interface LectureItem {
  id: string;
  title: string;
  subject: string;
  professor?: string;
  date: string;
  durationMinutes: number;
  videoUrl?: string; // YouTube, MP4 URL, or uploaded video
  attachedFileId?: string;
  attachedFileName?: string;
  attachedFileUrl?: string;
  keyTakeaways: string[];
  notesMarkdown: string;
  isWatched: boolean;
  rating?: number;
}

export interface QuestionItem {
  id: string;
  subject: string; // e.g. "Corporate Finance", "Marketing Strategy", "Operations & Supply Chain", "Organizational Behavior"
  topic: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isBookmarked: boolean;
  isApproved?: boolean;
  lastPracticed?: string;
  timesPracticed?: number;
  timesCorrect?: number;
  timesIncorrect?: number;
  lastAnsweredCorrectly?: boolean;
}

export interface QuizDefinition {
  id: string;
  title: string;
  subject: string;
  description: string;
  timeLimitMinutes: number;
  passingScorePercent: number;
  questionIds: string[];
  createdAt: string;
  totalAttempts?: number;
  highestScore?: number;
  isCustom?: boolean;
}

export interface QuizSession {
  id: string;
  title: string;
  subject: string;
  quizDefinitionId?: string;
  questionIds: string[];
  durationMinutes: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  passed: boolean;
  answersGiven?: {
    questionId: string;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
  }[];
}

export interface ConstellationStar {
  id: string;
  title: string;
  category: 'quiz' | 'assignment' | 'note' | 'focus' | 'file';
  x: number; // 0 to 100%
  y: number; // 0 to 100%
  size: number; // radius
  glowColor: string;
  unlockedAt: string;
  magnitude: number;
  notes?: string;
}

export interface StudyPlanTask {
  id: string;
  title: string;
  subject: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  timeSlot: string;
  durationMinutes: number;
  completed: boolean;
  isExamPrep?: boolean;
}

export interface GardenItem {
  id: string;
  name: string;
  type: 'plant' | 'sticker' | 'crystal' | 'decor' | 'cat-charm';
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'celestial' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
  unlockCondition: string;
  position?: { x: number; y: number };
}

export interface UserStudyStats {
  totalStudyMinutes: number;
  tasksCompleted: number;
  quizzesTaken: number;
  quizAverageScore: number;
  starsCollected: number;
  currentStreakDays: number;
  weeklyLogs: {
    date: string;
    dayName: string;
    minutes: number;
    tasksCount: number;
    phase: MoonPhaseType;
  }[];
}

export interface AppSettings {
  reduceMotion: boolean;
  soundEnabled: boolean;
  ambientSound: 'none' | 'night-breeze' | 'library-rain' | 'lofi-sparkles' | 'clock-chime';
  volume: number;
  openingSkipped: boolean;
  studentName: string;
  targetDegree: string; // e.g. "MBA candidate"
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string; // avatar identifier, e.g. 'cat-luna', 'starlight', 'celestial-fox', 'moon-witch', 'cosmic-scholar'
  phone?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ============================================
// ACADEMIC TERMS & SUBJECTS
// ============================================

export type TermStatus = 'completed' | 'in-progress' | 'upcoming';

export interface AcademicTerm {
  id: string;
  termNumber: number; // 1 to 6
  title: string;      // e.g. "Term 1", "Term 2"
  status: TermStatus;
  startDate?: string;
  endDate?: string;
  description?: string;
  creditsTotal?: number;
}

export interface SubjectItem {
  id: string;
  termId: string;
  termNumber: number; // 1 to 6
  name: string;       // e.g. "Design Thinking", "Product Management"
  code: string;       // e.g. "DT101", "PM205"
  description: string;
  credits: number;
  professor?: string;
  color: string;      // Tailwind / hex color gradient
  icon?: string;      // Icon identifier or emoji
  syllabus?: string[];
  completionPercentage?: number; // 0 to 100
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// ACADEMIC CALENDAR & TIMETABLE
// ============================================

export type CalendarEventType = 'class' | 'lecture' | 'exam' | 'assignment' | 'reminder';

export interface CalendarEvent {
  id: string;
  subjectId?: string;
  subjectName: string;
  title: string;
  type: CalendarEventType;
  dayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  date?: string;      // "YYYY-MM-DD" for specific date events
  room?: string;      // e.g. "Auditorium B", "Online Zoom"
  professor?: string;
  isRecurring: boolean;
  notes?: string;
  createdAt?: string;
}

export interface TimetableExtractionRow {
  day: string;
  timeSlot: string;
  subject: string;
  room?: string;
  professor?: string;
  type?: string;
}

// ============================================
// YOUTUBE LEARNING CENTRE
// ============================================

export interface YouTubeTimestampNote {
  id: string;
  timestampSeconds: number;
  timestampDisplay: string; // "05:24"
  note: string;
  createdAt: string;
}

export interface YouTubeResource {
  id: string;
  subjectId?: string;
  subjectName: string;
  title: string;
  description?: string;
  youtubeUrl: string;
  videoId: string; // Extracted 11-char ID
  playlistName?: string;
  durationMinutes?: number;
  isWatched: boolean;
  watchedAt?: string;
  notes: YouTubeTimestampNote[];
  createdAt: string;
}

// ============================================
// MOONLIGHT ARCADE & GAMIFICATION
// ============================================

export type ArcadeGameType = 'wheel' | 'memory' | 'flashcard' | 'speed' | 'concept' | 'true-false' | 'streak';

export interface GameScoreRecord {
  id: string;
  gameType: ArcadeGameType;
  subjectId?: string;
  subjectName: string;
  score: number;
  maxScore?: number;
  accuracy: number;
  timeTakenSeconds: number;
  xpEarned: number;
  completedAt: string;
}

export interface FlashcardItem {
  id: string;
  subject: string;
  frontPrompt: string;
  backAnswer: string;
  category?: string;
  masteryLevel?: 'novice' | 'learning' | 'mastered';
}

export interface ConceptPairItem {
  id: string;
  subject: string;
  concept: string;
  definition: string;
  example?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'quizzes' | 'study' | 'arcade' | 'reading' | 'consistency';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

// ============================================
// LEARNING DIARY & SPECIAL FEATURES
// ============================================

export type DiaryMood = 'calm' | 'focused' | 'inspired' | 'tired' | 'victorious';

export interface LearningDiaryEntry {
  id: string;
  date: string; // "YYYY-MM-DD"
  mood: DiaryMood;
  title: string;
  content: string;
  subjectsCovered: string[];
  hoursStudied: number;
  keyTakeaway: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ExamCountdownItem {
  id: string;
  subject: string;
  title: string;
  examDate: string; // ISO string
  location?: string;
  weightage?: string;
}


