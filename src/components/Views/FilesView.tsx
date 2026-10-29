import React, { useState, useRef } from 'react';
import { FileItem } from '../../types';
import { 
  FolderGit2, 
  UploadCloud, 
  FileText, 
  Download, 
  Trash2, 
  Star, 
  Search, 
  Eye, 
  File, 
  Image as ImageIcon, 
  Music, 
  BookOpen, 
  Check, 
  X,
  HardDrive,
  Edit2,
  FolderInput,
  Folder,
  Sparkles,
  Play,
  Clock,
  ChevronRight
} from 'lucide-react';
import { sound } from '../../services/audio';
import { db } from '../../services/db';

interface FilesViewProps {
  files: FileItem[];
  onUploadFile: (file: File, category: FileItem['category'], tags: string[], description: string, folder?: string) => Promise<void>;
  onDeleteFile: (id: string) => Promise<void>;
  onToggleFavorite: (id: string) => Promise<void>;
  onOpenFile: (file: FileItem) => void;
  onRenameFile: (id: string, newName: string) => Promise<void>;
  onMoveFolder: (id: string, folder: string) => Promise<void>;
}

export const FilesView: React.FC<FilesViewProps> = ({
  files,
  onUploadFile,
  onDeleteFile,
  onToggleFavorite,
  onOpenFile,
  onRenameFile,
  onMoveFolder
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [category, setCategory] = useState<FileItem['category']>('PDF');
  const [folderInput, setFolderInput] = useState('General');
  const [tagsInput, setTagsInput] = useState('MBA, Finance');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Rename modal state
  const [renameTarget, setRenameTarget] = useState<FileItem | null>(null);
  const [newNameInput, setNewNameInput] = useState('');

  // Move Folder modal state
  const [moveTarget, setMoveTarget] = useState<FileItem | null>(null);
  const [targetFolderInput, setTargetFolderInput] = useState('');

  // Delete Confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);

  const categories = ['All', 'PDF', 'Notes', 'Slides', 'Assignment', 'Audio', 'Image', 'Other'];

  // Extract all distinct folders
  const allFolders = ['All', ...Array.from(new Set(files.map(f => f.folder || 'General').filter(Boolean)))];

  // Recently read documents for the Continue Reading shelf
  const continueReadingFiles = files
    .filter(f => f.lastReadAt || (f.readingProgress || 0) > 0)
    .sort((a, b) => new Date(b.lastReadAt || 0).getTime() - new Date(a.lastReadAt || 0).getTime())
    .slice(0, 4);

  const filteredFiles = files.filter(f => {
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesFolder = selectedFolder === 'All' || (f.folder || 'General') === selectedFolder;
    const matchesQuery = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.folder && f.folder.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesFolder && matchesQuery;
  });

  const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPendingFile(file);
      
      // Auto-detect category
      if (file.type.includes('pdf')) setCategory('PDF');
      else if (file.type.startsWith('image/')) setCategory('Image');
      else if (file.type.startsWith('audio/')) setCategory('Audio');
      else if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) setCategory('Slides');
      else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) setCategory('Assignment');
      else setCategory('Notes');

      setShowUploadModal(true);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFile) return;

    setIsUploading(true);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    await onUploadFile(pendingFile, category, tags, description, folderInput);
    sound.playSparkle();
    setIsUploading(false);
    setShowUploadModal(false);
    setPendingFile(null);
    setDescription('');
  };

  const handleDownload = (fileItem: FileItem) => {
    sound.playPageTurn();
    db.downloadFile(fileItem);
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !newNameInput.trim()) return;
    await onRenameFile(renameTarget.id, newNameInput.trim());
    sound.playSparkle();
    setRenameTarget(null);
  };

  const handleMoveFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveTarget || !targetFolderInput.trim()) return;
    await onMoveFolder(moveTarget.id, targetFolderInput.trim());
    sound.playSparkle();
    setMoveTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await onDeleteFile(deleteTarget.id);
    sound.playPageTurn();
    setDeleteTarget(null);
  };

  const getFileIcon = (cat: FileItem['category'], name?: string) => {
    const ext = name ? name.toLowerCase() : '';
    if (ext.endsWith('.xlsx') || ext.endsWith('.xls') || ext.endsWith('.csv')) {
      return <span className="text-emerald-400 font-bold text-xs">📊</span>;
    }
    if (ext.endsWith('.docx') || ext.endsWith('.doc')) {
      return <FileText className="w-5 h-5 text-blue-300" />;
    }
    switch (cat) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-300" />;
      case 'Image':
        return <ImageIcon className="w-5 h-5 text-moon-gold" />;
      case 'Audio':
        return <Music className="w-5 h-5 text-indigo-300" />;
      case 'Slides':
        return <BookOpen className="w-5 h-5 text-lavender-300" />;
      default:
        return <File className="w-5 h-5 text-lavender-200" />;
    }
  };

  return (
    <div className="p-3.5 sm:p-6 space-y-6 max-w-full overflow-x-hidden">
      
      {/* ---------------- 1. HEADER & STORAGE STATUS ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-lavender-300" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              My Files & Tomes
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            Private, persistent study vault with built-in Moonlit Reader for PDFs, slides, documents, and spreadsheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Storage Meter */}
          <div className="px-3.5 py-2 rounded-xl bg-navy-900/80 border border-lavender-500/20 flex items-center gap-2 text-xs text-lavender-300">
            <HardDrive className="w-3.5 h-3.5 text-moon-gold" />
            <span>Vault: <strong className="text-white">{formatBytes(totalBytes)}</strong></span>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-lavender-600 to-indigo-600 hover:from-lavender-500 hover:to-indigo-500 text-white font-serif font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* ---------------- 2. CONTINUE READING SECTION ---------------- */}
      {continueReadingFiles.length > 0 && (
        <div className="p-4 sm:p-5 rounded-3xl bg-navy-900/60 border border-lavender-500/25 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">📖</span>
              <h3 className="font-serif font-bold text-sm sm:text-base text-cream-100">
                Continue Reading
              </h3>
            </div>
            <span className="text-xs text-lavender-300 font-mono">Recently Studied</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {continueReadingFiles.map(doc => (
              <div
                key={doc.id}
                onClick={() => onOpenFile(doc)}
                className="p-3.5 rounded-2xl bg-navy-950/70 border border-lavender-500/20 hover:border-moon-gold/50 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-navy-900 border border-lavender-500/20">
                      {getFileIcon(doc.category, doc.name)}
                    </div>
                    <span className="text-[10px] font-mono text-moon-gold">
                      {doc.readingProgress || 0}% read
                    </span>
                  </div>

                  <h4 className="font-serif font-medium text-xs text-cream-100 truncate group-hover:text-moon-gold transition-colors mb-1" title={doc.name}>
                    {doc.name}
                  </h4>
                  <p className="text-[10px] text-lavender-300/80 truncate">
                    Folder: {doc.folder || 'General'}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-lavender-500/10 flex items-center justify-between text-[10px] text-lavender-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-lavender-400" />
                    Page {doc.lastReadPage || 1} of {doc.totalPages || 1}
                  </span>
                  <span className="text-moon-gold font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Resume →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 3. FOLDERS & CATEGORIES & SEARCH ---------------- */}
      <div className="space-y-3">
        {/* Folder Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-semibold text-lavender-300 mr-1 flex items-center gap-1 shrink-0">
            <Folder className="w-3.5 h-3.5 text-moon-gold" />
            Folders:
          </span>
          {allFolders.map(fld => (
            <button
              key={fld}
              onClick={() => {
                sound.playPageTurn();
                setSelectedFolder(fld);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedFolder === fld
                  ? 'bg-lavender-600 text-white border border-lavender-400/40 shadow-sm'
                  : 'bg-navy-900/60 text-lavender-300 hover:text-white border border-lavender-500/15'
              }`}
            >
              {fld}
            </button>
          ))}
        </div>

        {/* Categories & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-lavender-500/30 text-white border border-lavender-400/40'
                    : 'bg-white/5 text-lavender-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-lavender-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag, or folder..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-navy-900/80 border border-lavender-500/25 text-white placeholder-lavender-400/60 text-xs focus:outline-none focus:border-moon-gold"
            />
          </div>
        </div>
      </div>

      {/* ---------------- 4. FILE LIST GRID WITH ALL 5 ACTIONS ---------------- */}
      {filteredFiles.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-navy-900/40 border border-lavender-500/20">
          <UploadCloud className="w-12 h-12 text-lavender-400/40 mx-auto mb-3 animate-bounce" />
          <h3 className="font-serif text-base text-white">No files found in this shelf</h3>
          <p className="text-xs text-lavender-300/70 mt-1 max-w-sm mx-auto">
            Upload PDFs, lecture slides, DOCX cases, spreadsheets, or images to begin studying in Moonlit Reader.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className="p-4 rounded-3xl bg-navy-900/70 border border-lavender-500/20 hover:border-lavender-400/40 transition-all group flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Header Row: Icon, Folder Badge, Favorite */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-2.5 rounded-2xl bg-navy-950/80 border border-lavender-500/20 shrink-0">
                      {getFileIcon(file.category, file.name)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-lavender-600/20 text-lavender-300 border border-lavender-500/20 truncate block">
                        📁 {file.folder || 'General'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(file.id)}
                    className="p-1.5 text-lavender-400 hover:text-moon-gold transition-colors shrink-0"
                    title={file.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
                  >
                    <Star className={`w-4 h-4 ${file.isFavorite ? 'text-moon-gold fill-moon-gold' : ''}`} />
                  </button>
                </div>

                {/* File Title */}
                <h4 
                  onClick={() => onOpenFile(file)}
                  className="font-serif font-medium text-sm text-white truncate cursor-pointer hover:text-moon-gold transition-colors mb-1" 
                  title={file.name}
                >
                  {file.name}
                </h4>

                {file.description && (
                  <p className="text-xs text-lavender-300/80 line-clamp-2 mb-2 font-sans">
                    {file.description}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {file.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-navy-950/60 text-lavender-300 border border-lavender-500/15">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* ---------------- 5 REQUIRED FILE ACTIONS ---------------- */}
              <div className="pt-3 border-t border-lavender-500/15">
                <div className="flex items-center justify-between text-[11px] text-lavender-400 font-mono mb-2">
                  <span>{formatBytes(file.size)}</span>
                  <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  {/* Action 1: Open / Read in Moonlit Reader */}
                  <button
                    onClick={() => onOpenFile(file)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-lavender-600 to-indigo-600 hover:from-lavender-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
                    title="Open inside Moonlit Reader"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open / Read</span>
                  </button>

                  {/* Action 2: Download Original File */}
                  <button
                    onClick={() => handleDownload(file)}
                    className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-lavender-400/20 text-cream-100 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                    title="Download original file"
                  >
                    <Download className="w-3.5 h-3.5 text-lavender-300" />
                    <span>Download</span>
                  </button>
                </div>

                {/* Actions 3, 4, 5: Rename, Move to Folder, Delete */}
                <div className="flex items-center justify-between gap-1 pt-1">
                  {/* Action 3: Rename */}
                  <button
                    onClick={() => {
                      setRenameTarget(file);
                      setNewNameInput(file.name);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-lavender-300 hover:text-white text-xs flex items-center gap-1"
                    title="Rename file"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-lavender-400" />
                    <span className="text-[11px]">Rename</span>
                  </button>

                  {/* Action 4: Move to Folder */}
                  <button
                    onClick={() => {
                      setMoveTarget(file);
                      setTargetFolderInput(file.folder || 'General');
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-lavender-300 hover:text-white text-xs flex items-center gap-1"
                    title="Move to Folder"
                  >
                    <FolderInput className="w-3.5 h-3.5 text-lavender-400" />
                    <span className="text-[11px]">Folder</span>
                  </button>

                  {/* Action 5: Delete */}
                  <button
                    onClick={() => setDeleteTarget(file)}
                    className="p-1.5 rounded-lg hover:bg-red-950/40 text-lavender-400 hover:text-red-300 text-xs flex items-center gap-1"
                    title="Delete file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- MODAL 1: UPLOAD REAL FILE ---------------- */}
      {showUploadModal && pendingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl bg-navy-900 border border-lavender-500/30 shadow-2xl text-cream-50 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-white">Save File to Moonlit Vault</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-lavender-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">File Name</label>
                <input
                  type="text"
                  disabled
                  value={pendingFile.name}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950/60 border border-lavender-500/20 text-xs text-lavender-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-200 mb-1">Format Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FileItem['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-lavender-500/30 text-xs text-white focus:outline-none focus:border-lavender-400"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Notes">Study Notes</option>
                    <option value="Slides">Slides Deck</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Audio">Audio Lecture</option>
                    <option value="Image">Diagram / Image</option>
                    <option value="Other">Other Format</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-lavender-200 mb-1">Folder</label>
                  <input
                    type="text"
                    value={folderInput}
                    onChange={(e) => setFolderInput(e.target.value)}
                    placeholder="e.g. Corporate Finance"
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-lavender-500/30 text-xs text-white focus:outline-none focus:border-lavender-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Finance, Midterm, DCF"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-lavender-500/30 text-xs text-white focus:outline-none focus:border-lavender-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">Description / Study Context</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key concepts, syllabus notes, or formulas covered..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-lavender-500/30 text-xs text-white focus:outline-none focus:border-lavender-400 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-lavender-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-lavender-600 to-indigo-600 hover:from-lavender-500 hover:to-indigo-500 text-xs font-medium text-white shadow-md disabled:opacity-50"
                >
                  {isUploading ? 'Encrypting & Storing...' : 'Save File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: RENAME FILE ---------------- */}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-navy-900 border border-lavender-500/30 shadow-2xl text-cream-50 animate-scaleUp">
            <h3 className="font-serif font-bold text-base text-white mb-2">Rename File</h3>
            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-lavender-300 mb-1">New Name</label>
                <input
                  type="text"
                  required
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-lavender-500/30 text-xs text-white focus:outline-none focus:border-moon-gold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRenameTarget(null)}
                  className="flex-1 py-2 rounded-xl bg-white/10 text-xs text-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-lavender-600 hover:bg-lavender-500 text-xs text-white font-medium shadow-md"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 3: MOVE TO FOLDER ---------------- */}
      {moveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-navy-900 border border-lavender-500/30 shadow-2xl text-cream-50 animate-scaleUp">
            <h3 className="font-serif font-bold text-base text-white mb-2">Move to Folder</h3>
            <form onSubmit={handleMoveFolderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-lavender-300 mb-1">Select or Type Folder Name</label>
                <input
                  type="text"
                  required
                  value={targetFolderInput}
                  onChange={(e) => setTargetFolderInput(e.target.value)}
                  placeholder="e.g. Corporate Finance"
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-lavender-500/30 text-xs text-white focus:outline-none focus:border-moon-gold mb-2"
                />
                
                {/* Existing folder suggestions */}
                <div className="flex flex-wrap gap-1">
                  {allFolders.filter(f => f !== 'All').map(fld => (
                    <button
                      key={fld}
                      type="button"
                      onClick={() => setTargetFolderInput(fld)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-lavender-300 border border-lavender-500/20"
                    >
                      {fld}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMoveTarget(null)}
                  className="flex-1 py-2 rounded-xl bg-white/10 text-xs text-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-lavender-600 hover:bg-lavender-500 text-xs text-white font-medium shadow-md"
                >
                  Move File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 4: DELETE CONFIRMATION ---------------- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-navy-900 border border-red-500/30 shadow-2xl text-center text-cream-50 animate-scaleUp">
            <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <h3 className="font-serif font-bold text-base text-white mb-1">Delete File?</h3>
            <p className="text-xs text-lavender-300 mb-4 truncate" title={deleteTarget.name}>
              "{deleteTarget.name}" will be permanently removed from your vault and disk.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-xl bg-white/10 text-xs text-cream-100"
              >
                Keep File
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs text-white font-medium shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
