import {
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
  AppSettings
} from '../types';
import {
  initialNotes,
  initialAssignments,
  initialLectures,
  initialQuestions,
  initialCustomQuizzes,
  initialConstellations,
  initialPlannerTasks,
  initialGardenItems,
  initialStats,
  initialSettings
} from './seedData';
import { authService, getApiBase } from './auth';

const DB_NAME = 'MoonlitLibraryDB';
const DB_VERSION = 2;

class MoonlitDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;
  public backendAvailable: boolean = true;

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    try {
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...((options?.headers as Record<string, string>) || {})
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${getApiBase()}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const text = await res.text();
          if (text && !text.trim().startsWith('<')) {
            this.backendAvailable = true;
            return JSON.parse(text) as T;
          }
        }
      }
    } catch {
      this.backendAvailable = false;
    }
    return null;
  }

  private openDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        const stores = [
          'files', 'notes', 'assignments', 'lectures', 
          'questions', 'quizzes', 'customQuizzes', 'constellations', 
          'planner', 'garden', 'stats', 'settings'
        ];

        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = async () => {
        const db = request.result;
        // Don't auto-seed default MBA records into local store if user is logged into their private account
        if (!authService.isAuthenticated()) {
          await this.initializeDefaults(db);
        }
        resolve(db);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  public async clearLocalCache(): Promise<void> {
    try {
      const db = await this.openDB();
      const stores = [
        'files', 'notes', 'assignments', 'lectures', 
        'questions', 'quizzes', 'customQuizzes', 'constellations', 
        'planner', 'garden', 'stats', 'settings'
      ];
      const tx = db.transaction(stores, 'readwrite');
      stores.forEach(s => tx.objectStore(s).clear());
      await new Promise<void>((resolve) => {
        tx.oncomplete = () => resolve();
      });
    } catch (e) {
      console.warn('Cache clear warning:', e);
    }
  }

  private async initializeDefaults(db: IDBDatabase) {
    const tx = db.transaction([
      'notes', 'assignments', 'lectures', 'questions', 
      'customQuizzes', 'constellations', 'planner', 
      'garden', 'stats', 'settings'
    ], 'readwrite');
    
    const countCheck = (storeName: string): Promise<number> => {
      return new Promise((res) => {
        const req = tx.objectStore(storeName).count();
        req.onsuccess = () => res(req.result);
        req.onerror = () => res(0);
      });
    };

    const notesCount = await countCheck('notes');
    if (notesCount === 0) {
      initialNotes.forEach(n => tx.objectStore('notes').put(n));
      initialAssignments.forEach(a => tx.objectStore('assignments').put(a));
      initialLectures.forEach(l => tx.objectStore('lectures').put(l));
      initialQuestions.forEach(q => tx.objectStore('questions').put(q));
      initialCustomQuizzes.forEach(cq => tx.objectStore('customQuizzes').put(cq));
      initialConstellations.forEach(c => tx.objectStore('constellations').put(c));
      initialPlannerTasks.forEach(p => tx.objectStore('planner').put(p));
      initialGardenItems.forEach(g => tx.objectStore('garden').put(g));
      tx.objectStore('stats').put({ id: 'current', ...initialStats });
      tx.objectStore('settings').put({ id: 'current', ...initialSettings });
    }
  }

  private async getAllFromStore<T>(storeName: string): Promise<T[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as T[]);
      req.onerror = () => reject(req.error);
    });
  }

  private async putInStore<T>(storeName: string, item: T): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private async deleteFromStore(storeName: string, id: string): Promise<void> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- 1. FILES (REAL FILESYSTEM & PRIVATE ISOLATION) ---
  public async getAllFiles(): Promise<FileItem[]> {
    const serverFiles = await this.fetchApi<FileItem[]>('/files');
    if (serverFiles !== null) {
      return serverFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    }
    const files = await this.getAllFromStore<FileItem>('files');
    if (files.length === 0) {
      const defaultPpt: FileItem = {
        id: 'file-pptx-amazon-design-1',
        name: 'Amazon_Design_Thinking_Assignment1_5slides.pptx',
        size: 31522,
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        category: 'Slides',
        folder: 'MBA Presentations',
        tags: ['Amazon', 'Design Thinking', 'MBA', 'Slides'],
        uploadedAt: new Date().toISOString(),
        serverUrl: '/demo_presentation.pptx',
        dataUrl: '/demo_presentation.pptx',
        description: '5-Slide MBA Design Thinking Presentation on Amazon Customer Obsession',
        isFavorite: true,
        lastReadPage: 1,
        totalPages: 5,
        readingProgress: 20
      };
      await this.putInStore('files', defaultPpt);
      return [defaultPpt];
    }
    return files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  public async saveRealFile(
    file: File, 
    category: FileItem['category'] = 'Other', 
    tags: string[] = [], 
    description: string = '',
    folder: string = 'General'
  ): Promise<FileItem> {
    try {
      const token = authService.getToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('tags', JSON.stringify(tags));
      formData.append('description', description);
      formData.append('folder', folder);

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${getApiBase()}/files/upload`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const text = await res.text();
          if (text && !text.trim().startsWith('<')) {
            const uploadedItem = JSON.parse(text) as FileItem;
            uploadedItem.blob = file;
            await this.putInStore('files', uploadedItem);
            return uploadedItem;
          }
        }
      }
    } catch {}

    // Fallback: Store locally with Blob & DataURL
    const buffer = await file.arrayBuffer();
    const blob = new Blob([buffer], { type: file.type });
    let dataUrl: string | undefined = undefined;

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    }

    const localItem: FileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      category,
      folder: folder || 'General',
      tags: tags.length ? tags : ['Study Materials'],
      uploadedAt: new Date().toISOString(),
      blob,
      dataUrl,
      description,
      isFavorite: false
    };

    await this.putInStore('files', localItem);
    return localItem;
  }

  public async deleteFile(id: string): Promise<void> {
    await this.fetchApi(`/files/${id}`, { method: 'DELETE' });
    await this.deleteFromStore('files', id);
  }

  public async toggleFavoriteFile(id: string): Promise<void> {
    await this.fetchApi(`/files/${id}/favorite`, { method: 'PATCH' });
    const files = await this.getAllFromStore<FileItem>('files');
    const target = files.find(f => f.id === id);
    if (target) {
      target.isFavorite = !target.isFavorite;
      await this.putInStore('files', target);
    }
  }

  public async getFileBlob(fileItem: FileItem): Promise<Blob> {
    if (fileItem.blob) return fileItem.blob;
    if (fileItem.dataUrl) {
      try {
        const res = await fetch(fileItem.dataUrl);
        if (res.ok) return await res.blob();
      } catch {}
    }

    // Try backend download if available
    try {
      const token = authService.getToken();
      const url = `${getApiBase()}/files/download/${fileItem.id}?inline=true`;
      const res = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        return await res.blob();
      }
    } catch {}

    // Static bundle fallback for PPTX slides (e.g. on Vercel or offline)
    if (fileItem.name.toLowerCase().endsWith('.pptx')) {
      try {
        const res = await fetch('/demo_presentation.pptx');
        if (res.ok) return await res.blob();
      } catch {}
    }

    // Static bundle fallback for images
    if (fileItem.name.toLowerCase().endsWith('.png') || fileItem.name.toLowerCase().endsWith('.jpg')) {
      try {
        const res = await fetch('/shagun/shagun_reading.jpg');
        if (res.ok) return await res.blob();
      } catch {}
    }

    throw new Error(`Could not load document contents. Please check your connection or download directly.`);
  }

  public async downloadFile(fileItem: FileItem): Promise<void> {
    try {
      const token = authService.getToken();
      const url = `${getApiBase()}/files/download/${fileItem.id}`;
      const res = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileItem.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
        return;
      }
    } catch {}

    if (fileItem.blob) {
      const blobUrl = URL.createObjectURL(fileItem.blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileItem.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      return;
    } 
    
    if (fileItem.dataUrl) {
      const a = document.createElement('a');
      a.href = fileItem.dataUrl;
      a.download = fileItem.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    if (fileItem.name.toLowerCase().endsWith('.pptx')) {
      const a = document.createElement('a');
      a.href = '/demo_presentation.pptx';
      a.download = fileItem.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
  }


  public async renameFile(id: string, newName: string): Promise<void> {
    await this.fetchApi(`/files/${id}/rename`, {
      method: 'PATCH',
      body: JSON.stringify({ newName })
    });
    const files = await this.getAllFromStore<FileItem>('files');
    const target = files.find(f => f.id === id);
    if (target) {
      target.name = newName;
      await this.putInStore('files', target);
    }
  }

  public async moveFileFolder(id: string, folder: string): Promise<void> {
    await this.fetchApi(`/files/${id}/folder`, {
      method: 'PATCH',
      body: JSON.stringify({ folder })
    });
    const files = await this.getAllFromStore<FileItem>('files');
    const target = files.find(f => f.id === id);
    if (target) {
      target.folder = folder;
      await this.putInStore('files', target);
    }
  }

  public async updateReadingProgress(
    id: string, 
    progress: { lastReadPage?: number; totalPages?: number; readingProgress?: number; bookmarks?: number[]; zoomLevel?: number }
  ): Promise<void> {
    await this.fetchApi(`/files/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify(progress)
    });
    const files = await this.getAllFromStore<FileItem>('files');
    const target = files.find(f => f.id === id);
    if (target) {
      if (typeof progress.lastReadPage === 'number') target.lastReadPage = progress.lastReadPage;
      if (typeof progress.totalPages === 'number') target.totalPages = progress.totalPages;
      if (typeof progress.readingProgress === 'number') target.readingProgress = progress.readingProgress;
      if (progress.bookmarks) target.bookmarks = progress.bookmarks;
      if (typeof progress.zoomLevel === 'number') target.zoomLevel = progress.zoomLevel;
      target.lastReadAt = new Date().toISOString();
      await this.putInStore('files', target);
    }
  }


  // --- 2. NOTES ---
  public async getAllNotes(): Promise<NoteItem[]> {
    const serverNotes = await this.fetchApi<NoteItem[]>('/notes');
    if (serverNotes !== null) {
      return serverNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }
    const notes = await this.getAllFromStore<NoteItem>('notes');
    return notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public async saveNote(note: NoteItem): Promise<void> {
    await this.fetchApi('/notes', {
      method: 'POST',
      body: JSON.stringify(note)
    });
    await this.putInStore('notes', note);
  }

  public async updateNote(note: NoteItem): Promise<void> {
    await this.fetchApi(`/notes/${note.id}`, {
      method: 'PUT',
      body: JSON.stringify(note)
    });
    await this.putInStore('notes', note);
  }

  public async deleteNote(id: string): Promise<void> {
    await this.fetchApi(`/notes/${id}`, { method: 'DELETE' });
    await this.deleteFromStore('notes', id);
  }

  // --- 3. ASSIGNMENTS ---
  public async getAllAssignments(): Promise<AssignmentItem[]> {
    const serverAsg = await this.fetchApi<AssignmentItem[]>('/assignments');
    if (serverAsg !== null) {
      return serverAsg.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }
    const assignments = await this.getAllFromStore<AssignmentItem>('assignments');
    return assignments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  public async saveAssignment(assignment: AssignmentItem): Promise<void> {
    await this.fetchApi('/assignments', {
      method: 'POST',
      body: JSON.stringify(assignment)
    });
    await this.putInStore('assignments', assignment);
  }

  public async updateAssignment(assignment: AssignmentItem): Promise<void> {
    await this.fetchApi(`/assignments/${assignment.id}`, {
      method: 'PUT',
      body: JSON.stringify(assignment)
    });
    await this.putInStore('assignments', assignment);
  }

  public async submitAssignment(
    id: string, 
    notes: string, 
    fileName?: string,
    fileUrl?: string
  ): Promise<void> {
    await this.fetchApi(`/assignments/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ submissionNotes: notes, submittedFileName: fileName, submittedFileUrl: fileUrl })
    });
    const assignments = await this.getAllFromStore<AssignmentItem>('assignments');
    const target = assignments.find(a => a.id === id);
    if (target) {
      target.status = 'submitted';
      target.submissionNotes = notes;
      target.submittedFileName = fileName || 'Deliverable.pdf';
      target.submittedFileUrl = fileUrl;
      target.submittedAt = new Date().toISOString();
      await this.putInStore('assignments', target);
    }
  }

  public async gradeAssignment(id: string, grade: string, feedback?: string): Promise<void> {
    await this.fetchApi(`/assignments/${id}/grade`, {
      method: 'POST',
      body: JSON.stringify({ grade, gradeFeedback: feedback })
    });
    const assignments = await this.getAllFromStore<AssignmentItem>('assignments');
    const target = assignments.find(a => a.id === id);
    if (target) {
      target.status = 'graded';
      target.grade = grade;
      target.gradeFeedback = feedback;
      await this.putInStore('assignments', target);
    }
  }

  public async deleteAssignment(id: string): Promise<void> {
    await this.fetchApi(`/assignments/${id}`, { method: 'DELETE' });
    await this.deleteFromStore('assignments', id);
  }


  // --- 4. LECTURES ---
  public async getAllLectures(): Promise<LectureItem[]> {
    const serverLec = await this.fetchApi<LectureItem[]>('/lectures');
    if (serverLec !== null) {
      return serverLec.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    const lectures = await this.getAllFromStore<LectureItem>('lectures');
    return lectures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async saveLecture(lecture: LectureItem): Promise<void> {
    await this.fetchApi('/lectures', {
      method: 'POST',
      body: JSON.stringify(lecture)
    });
    await this.putInStore('lectures', lecture);
  }

  public async updateLecture(lecture: LectureItem): Promise<void> {
    await this.fetchApi(`/lectures/${lecture.id}`, {
      method: 'PUT',
      body: JSON.stringify(lecture)
    });
    await this.putInStore('lectures', lecture);
  }

  public async toggleLectureWatched(id: string): Promise<void> {
    await this.fetchApi(`/lectures/${id}/watched`, { method: 'PATCH' });
    const lectures = await this.getAllFromStore<LectureItem>('lectures');
    const target = lectures.find(l => l.id === id);
    if (target) {
      target.isWatched = !target.isWatched;
      await this.putInStore('lectures', target);
    }
  }

  public async deleteLecture(id: string): Promise<void> {
    await this.fetchApi(`/lectures/${id}`, { method: 'DELETE' });
    await this.deleteFromStore('lectures', id);
  }

  // --- 5. QUESTIONS & INCORRECT ANSWERS ---
  public async getAllQuestions(): Promise<QuestionItem[]> {
    const serverQ = await this.fetchApi<QuestionItem[]>('/questions');
    if (serverQ !== null) {
      return serverQ;
    }
    return this.getAllFromStore<QuestionItem>('questions');
  }

  public async saveQuestion(question: QuestionItem): Promise<void> {
    await this.fetchApi('/questions', {
      method: 'POST',
      body: JSON.stringify(question)
    });
    await this.putInStore('questions', question);
  }

  public async updateQuestion(question: QuestionItem): Promise<void> {
    await this.fetchApi(`/questions/${question.id}`, {
      method: 'PUT',
      body: JSON.stringify(question)
    });
    await this.putInStore('questions', question);
  }

  public async deleteQuestion(id: string): Promise<void> {
    await this.fetchApi(`/questions/${id}`, { method: 'DELETE' });
    await this.deleteFromStore('questions', id);
  }

  public async recordQuestionAttempt(id: string, isCorrect: boolean): Promise<void> {
    await this.fetchApi(`/questions/${id}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ isCorrect })
    });
    const questions = await this.getAllFromStore<QuestionItem>('questions');
    const q = questions.find(item => item.id === id);
    if (q) {
      q.timesPracticed = (q.timesPracticed || 0) + 1;
      if (isCorrect) {
        q.timesCorrect = (q.timesCorrect || 0) + 1;
        q.lastAnsweredCorrectly = true;
      } else {
        q.timesIncorrect = (q.timesIncorrect || 0) + 1;
        q.lastAnsweredCorrectly = false;
      }
      q.lastPracticed = new Date().toISOString();
      await this.putInStore('questions', q);
    }
  }


  public async getIncorrectQuestions(): Promise<QuestionItem[]> {
    const questions = await this.getAllQuestions();
    return questions.filter(q => q.lastAnsweredCorrectly === false || (q.timesIncorrect || 0) > 0);
  }

  // --- 6. CUSTOM QUIZZES & TESTS BUILDER ---
  public async getCustomQuizzes(): Promise<QuizDefinition[]> {
    const serverDef = await this.fetchApi<QuizDefinition[]>('/quizzes');
    if (serverDef !== null) {
      return serverDef;
    }
    return this.getAllFromStore<QuizDefinition>('customQuizzes');
  }

  public async saveCustomQuiz(quiz: QuizDefinition): Promise<void> {
    await this.fetchApi('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quiz)
    });
    await this.putInStore('customQuizzes', quiz);
  }

  public async deleteCustomQuiz(id: string): Promise<void> {
    await this.fetchApi(`/quizzes/${id}`, { method: 'DELETE' });
    await this.deleteFromStore('customQuizzes', id);
  }

  // --- 7. QUIZ ATTEMPTS & SESSIONS ---
  public async getQuizAttempts(): Promise<QuizSession[]> {
    const serverAttempts = await this.fetchApi<QuizSession[]>('/quiz-attempts');
    if (serverAttempts !== null) {
      return serverAttempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    }
    const attempts = await this.getAllFromStore<QuizSession>('quizzes');
    return attempts.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  public async getQuizHistory(): Promise<QuizSession[]> {
    return this.getQuizAttempts();
  }


  public async saveQuizAttempt(session: QuizSession): Promise<void> {
    await this.fetchApi('/quiz-attempts', {
      method: 'POST',
      body: JSON.stringify(session)
    });
    await this.putInStore('quizzes', session);
  }

  // --- 8. CONSTELLATIONS ---
  public async getConstellationStars(): Promise<ConstellationStar[]> {
    const serverStars = await this.fetchApi<ConstellationStar[]>('/constellations');
    if (serverStars !== null) {
      return serverStars;
    }
    return this.getAllFromStore<ConstellationStar>('constellations');
  }

  public async addConstellationStar(
    title: string, 
    category: ConstellationStar['category'], 
    notes?: string
  ): Promise<ConstellationStar> {
    const existing = await this.getConstellationStars();
    const margin = 12;
    const x = Math.round(margin + Math.random() * (100 - 2 * margin));
    const y = Math.round(margin + Math.random() * (100 - 2 * margin));
    
    const palette = {
      quiz: '#FFE8A3',
      assignment: '#B8A7EA',
      note: '#F4ABC4',
      focus: '#A5C9FF',
      file: '#99F6E4'
    };

    const newStar: ConstellationStar = {
      id: `star-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title,
      category,
      x,
      y,
      size: 5 + Math.floor(Math.random() * 4),
      glowColor: palette[category] || '#FFE8A3',
      unlockedAt: new Date().toISOString(),
      magnitude: Math.min(3, 1 + Math.floor(existing.length / 3)),
      notes
    };

    await this.fetchApi('/constellations', {
      method: 'POST',
      body: JSON.stringify(newStar)
    });
    await this.putInStore('constellations', newStar);
    return newStar;
  }

  // --- 9. STUDY PLANNER ---
  public async getPlannerTasks(): Promise<StudyPlanTask[]> {
    const serverTasks = await this.fetchApi<StudyPlanTask[]>('/planner');
    if (serverTasks !== null) {
      return serverTasks;
    }
    return this.getAllFromStore<StudyPlanTask>('planner');
  }

  public async savePlannerTask(task: StudyPlanTask): Promise<void> {
    await this.fetchApi('/planner', {
      method: 'POST',
      body: JSON.stringify(task)
    });
    await this.putInStore('planner', task);
  }

  public async updatePlannerTask(task: StudyPlanTask): Promise<void> {
    await this.fetchApi(`/planner/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify(task)
    });
    await this.putInStore('planner', task);
  }

  public async deletePlannerTask(id: string): Promise<void> {
    await this.fetchApi(`/planner/${id}`, { method: 'DELETE' });
    await this.deleteFromStore('planner', id);
  }

  // --- 10. GARDEN ---
  public async getGardenItems(): Promise<GardenItem[]> {
    const serverGarden = await this.fetchApi<GardenItem[]>('/garden');
    if (serverGarden !== null) {
      return serverGarden;
    }
    return this.getAllFromStore<GardenItem>('garden');
  }

  public async unlockGardenItem(id: string): Promise<void> {
    await this.fetchApi(`/garden/${id}/unlock`, { method: 'PATCH' });
    const items = await this.getAllFromStore<GardenItem>('garden');
    const item = items.find(i => i.id === id);
    if (item && !item.unlocked) {
      item.unlocked = true;
      item.unlockedAt = new Date().toISOString();
      await this.putInStore('garden', item);
    }
  }

  // --- 11. STATS ---
  public async getStats(): Promise<UserStudyStats> {
    const serverStats = await this.fetchApi<UserStudyStats>('/stats');
    if (serverStats) {
      await this.putInStore('stats', { id: 'current', ...serverStats });
      return serverStats;
    }
    const records = await this.getAllFromStore<{ id: string } & UserStudyStats>('stats');
    if (records.length > 0) {
      const { id, ...data } = records[0];
      return data as UserStudyStats;
    }
    return initialStats;
  }

  public async updateStats(updater: (prev: UserStudyStats) => UserStudyStats): Promise<UserStudyStats> {
    const prev = await this.getStats();
    const updated = updater(prev);
    await this.fetchApi('/stats', {
      method: 'PUT',
      body: JSON.stringify(updated)
    });
    await this.putInStore('stats', { id: 'current', ...updated });
    return updated;
  }

  // --- 12. SETTINGS ---
  public async getSettings(): Promise<AppSettings> {
    const serverSettings = await this.fetchApi<AppSettings>('/settings');
    if (serverSettings) {
      await this.putInStore('settings', { id: 'current', ...serverSettings });
      return serverSettings;
    }
    const records = await this.getAllFromStore<{ id: string } & AppSettings>('settings');
    if (records.length > 0) {
      const { id, ...data } = records[0];
      return data as AppSettings;
    }
    return initialSettings;
  }

  public async saveSettings(settings: AppSettings): Promise<void> {
    await this.fetchApi('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    await this.putInStore('settings', { id: 'current', ...settings });
  }
}

export const db = new MoonlitDatabase();
