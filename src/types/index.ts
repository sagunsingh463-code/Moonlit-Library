export type ViewMode = 
  | 'home'
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
  lastPracticed?: string;
  timesPracticed: number;
  timesCorrect: number;
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

