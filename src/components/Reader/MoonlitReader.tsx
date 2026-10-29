import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Search, 
  Star, 
  RotateCw, 
  FileText, 
  Table, 
  Image as ImageIcon, 
  Video, 
  FileCode, 
  AlertCircle, 
  Sparkles, 
  Moon, 
  Eye, 
  BookOpen, 
  Check, 
  Share2,
  Sliders,
  Layers
} from 'lucide-react';
import { FileItem } from '../../types';
import { db } from '../../services/db';
import { sound } from '../../services/audio';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// Set up PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (e) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  }
}

export interface SlideData {
  slideNumber: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  images: string[];
}

interface MoonlitReaderProps {
  file: FileItem;
  onBack: () => void;
  onUpdateFile: (updatedFile: FileItem) => void;
}

export const MoonlitReader: React.FC<MoonlitReaderProps> = ({
  file,
  onBack,
  onUpdateFile
}) => {
  // Reading state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);

  // Pagination & Progress
  const [currentPage, setCurrentPage] = useState<number>(file.lastReadPage || 1);
  const [totalPages, setTotalPages] = useState<number>(file.totalPages || 1);
  const [bookmarks, setBookmarks] = useState<number[]>(file.bookmarks || []);
  const [isFavorite, setIsFavorite] = useState<boolean>(!!file.isFavorite);
  const [zoomLevel, setZoomLevel] = useState<number>(file.zoomLevel || 100);

  // View modes
  const [fitMode, setFitMode] = useState<'width' | 'page' | 'free'>('width');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookmarksDrawer, setShowBookmarksDrawer] = useState(false);
  const [rotation, setRotation] = useState<number>(0);

  // PDF.js instance
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // DOCX HTML content
  const [docxHtml, setDocxHtml] = useState<string>('');

  // Spreadsheet / CSV state
  const [sheets, setSheets] = useState<{ [sheetName: string]: any[][] }>({});
  const [activeSheetName, setActiveSheetName] = useState<string>('');

  // Plain Text content
  const [textContent, setTextContent] = useState<string>('');

  // Image source URL
  const [mediaUrl, setMediaUrl] = useState<string>('');

  // Presentation Slides (PPTX / PPT) state
  const [slides, setSlides] = useState<SlideData[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Determine file format
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();
  const isPdf = fileName.endsWith('.pdf') || fileType.includes('pdf');
  const isDocx = fileName.endsWith('.docx') || fileName.endsWith('.doc');
  const isSpreadsheet = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv');
  const isCsv = fileName.endsWith('.csv');
  const isImage = fileType.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(fileName);
  const isVideo = fileType.startsWith('video/') || /\.(mp4|webm|ogg)$/i.test(fileName);
  const isText = fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.json') || fileName.endsWith('.js') || fileName.endsWith('.ts');
  const isPpt = fileName.endsWith('.pptx') || fileName.endsWith('.ppt');

  // Load actual file contents
  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const fileBlob = await db.getFileBlob(file);
        if (!active) return;
        setBlob(fileBlob);

        const buffer = await fileBlob.arrayBuffer();
        if (!active) return;
        setArrayBuffer(buffer);

        // Object URL for media
        const url = URL.createObjectURL(fileBlob);
        setMediaUrl(url);

        // Format-specific parsing
        if (isPdf) {
          try {
            const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
            const doc = await loadingTask.promise;
            if (!active) return;
            setPdfDoc(doc);
            setTotalPages(doc.numPages);
            const initialPage = Math.min(Math.max(1, file.lastReadPage || 1), doc.numPages);
            setCurrentPage(initialPage);
          } catch (pdfErr: any) {
            console.warn('PDF.js canvas parse notice, using fallback preview:', pdfErr);
            // Fallback: Total pages 1
            setTotalPages(file.totalPages || 1);
          }
        } else if (isDocx) {
          try {
            const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
            if (!active) return;
            setDocxHtml(result.value);
            // Estimate pages (~350 words per page)
            const text = result.value.replace(/<[^>]*>/g, '');
            const wordCount = text.trim().split(/\s+/).length;
            const estimatedPages = Math.max(1, Math.ceil(wordCount / 350));
            setTotalPages(estimatedPages);
          } catch (docxErr: any) {
            setError('Could not render DOCX document: ' + (docxErr.message || 'Formatting error'));
          }
        } else if (isSpreadsheet) {
          try {
            const workbook = XLSX.read(buffer, { type: 'array' });
            if (!active) return;
            const parsedSheets: { [name: string]: any[][] } = {};
            workbook.SheetNames.forEach(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              parsedSheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
            });
            setSheets(parsedSheets);
            setActiveSheetName(workbook.SheetNames[0] || '');
            setTotalPages(workbook.SheetNames.length);
          } catch (sheetErr: any) {
            setError('Could not parse spreadsheet: ' + (sheetErr.message || 'Error'));
          }
        } else if (isText) {
          const text = new TextDecoder().decode(buffer);
          setTextContent(text);
          const lines = text.split('\n').length;
          setTotalPages(Math.max(1, Math.ceil(lines / 45)));
        } else if (isPpt) {
          try {
            const zip = await JSZip.loadAsync(buffer);
            const slideKeys = Object.keys(zip.files).filter(k => k.match(/^ppt\/slides\/slide\d+\.xml$/i));
            
            // Sort slides numerically: slide1, slide2, slide3, ...
            slideKeys.sort((a, b) => {
              const numA = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
              const numB = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || '0', 10);
              return numA - numB;
            });

            // Extract embedded images from ppt/media/
            const mediaKeys = Object.keys(zip.files).filter(k => k.match(/^ppt\/media\//i));
            const mediaUrls: Record<string, string> = {};
            for (const mk of mediaKeys) {
              try {
                const mediaBlob = await zip.file(mk)!.async('blob');
                const filename = mk.split('/').pop() || '';
                mediaUrls[filename] = URL.createObjectURL(mediaBlob);
              } catch {}
            }

            const parsedSlides: SlideData[] = [];

            for (let i = 0; i < slideKeys.length; i++) {
              const slideXml = await zip.file(slideKeys[i])!.async('text');
              
              // Extract paragraphs & text runs
              const pMatches = slideXml.match(/<a:p[\s>][\s\S]*?<\/a:p>/g) || [];
              const rawLines: string[] = [];

              pMatches.forEach(pXml => {
                const tMatches = pXml.match(/<a:t>([\s\S]*?)<\/a:t>/g);
                if (tMatches) {
                  let line = tMatches.map(t => t.replace(/<\/?a:t>/g, '')).join('').trim();
                  // Clean up HTML/XML entities
                  line = line
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&apos;/g, "'");
                  if (line) rawLines.push(line);
                }
              });

              // Slide structuring
              const title = rawLines[0] || `Slide ${i + 1}`;
              const subtitle = rawLines.length > 2 && rawLines[1].length < 60 ? rawLines[1] : undefined;
              const bullets = subtitle ? rawLines.slice(2) : rawLines.slice(1);

              // Extract linked images for this slide
              const relsKey = slideKeys[i].replace('ppt/slides/', 'ppt/slides/_rels/') + '.rels';
              const slideImages: string[] = [];
              if (zip.files[relsKey]) {
                try {
                  const relsXml = await zip.file(relsKey)!.async('text');
                  const imgMatches = relsXml.match(/Target="\.\.\/media\/([^"]+)"/g) || [];
                  imgMatches.forEach(im => {
                    const m = im.match(/Target="\.\.\/media\/([^"]+)"/);
                    if (m && m[1] && mediaUrls[m[1]]) {
                      slideImages.push(mediaUrls[m[1]]);
                    }
                  });
                } catch {}
              }

              parsedSlides.push({
                slideNumber: i + 1,
                title,
                subtitle,
                bullets,
                images: slideImages
              });
            }

            if (parsedSlides.length > 0) {
              setSlides(parsedSlides);
              setTotalPages(parsedSlides.length);
              const initialPage = Math.min(Math.max(1, file.lastReadPage || 1), parsedSlides.length);
              setCurrentPage(initialPage);
            } else {
              setSlides([{
                slideNumber: 1,
                title: file.name.replace(/\.[^/.]+$/, ''),
                bullets: ['Presentation loaded into Moonlit Reader.', 'Use the controls below to navigate or download the original deck.'],
                images: []
              }]);
              setTotalPages(1);
            }
          } catch (pptErr: any) {
            console.warn('PPTX parsing notice:', pptErr);
            setSlides([{
              slideNumber: 1,
              title: file.name.replace(/\.[^/.]+$/, ''),
              bullets: ['Presentation ready for viewing and download.'],
              images: []
            }]);
            setTotalPages(1);
          }
        }

        setLoading(false);
      } catch (err: any) {
        if (!active) return;
        setError(err.message || 'Failed to read file from storage');
        setLoading(false);
      }
    };

    loadContent();

    return () => {
      active = false;
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
  }, [file.id]);

  // Render PDF page onto Canvas whenever page, zoom, or rotation changes
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !isPdf) return;

    let renderTask: any = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Calculate scale
        let scale = (zoomLevel / 100) * 1.5;
        if (fitMode === 'width' && containerRef.current) {
          const containerWidth = containerRef.current.clientWidth - 48;
          const unscaledViewport = page.getViewport({ scale: 1.0, rotation });
          scale = (containerWidth / unscaledViewport.width) * (zoomLevel / 100);
        }

        const viewport = page.getViewport({ scale, rotation });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (e: any) {
        if (e?.name !== 'RenderingCancelledException') {
          console.error('PDF render error:', e);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, currentPage, zoomLevel, rotation, fitMode]);

  // Save progress helper
  const saveProgress = async (page: number, total: number, bookmarkedList: number[], zoom: number) => {
    const progressPercent = total > 0 ? Math.min(100, Math.round((page / total) * 100)) : 0;
    try {
      await db.updateReadingProgress(file.id, {
        lastReadPage: page,
        totalPages: total,
        readingProgress: progressPercent,
        bookmarks: bookmarkedList,
        zoomLevel: zoom
      });
      onUpdateFile({
        ...file,
        lastReadPage: page,
        totalPages: total,
        readingProgress: progressPercent,
        bookmarks: bookmarkedList,
        zoomLevel: zoom,
        lastReadAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Progress save warning:', e);
    }
  };

  // Page Navigation Handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      sound.playPageTurn();
      const next = currentPage - 1;
      setCurrentPage(next);
      saveProgress(next, totalPages, bookmarks, zoomLevel);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      sound.playPageTurn();
      const next = currentPage + 1;
      setCurrentPage(next);
      saveProgress(next, totalPages, bookmarks, zoomLevel);
    }
  };

  // Keyboard navigation for presentation slides & pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (isPpt && e.key === ' ')) {
        if (currentPage < totalPages) {
          handleNextPage();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) {
          handlePrevPage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPpt, currentPage, totalPages]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setCurrentPage(val);
      saveProgress(val, totalPages, bookmarks, zoomLevel);
    }
  };

  // Zoom Handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => {
      const next = Math.min(prev + 25, 250);
      saveProgress(currentPage, totalPages, bookmarks, next);
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 25, 50);
      saveProgress(currentPage, totalPages, bookmarks, next);
      return next;
    });
  };

  const handleToggleFit = () => {
    setFitMode(prev => (prev === 'width' ? 'page' : 'width'));
    setZoomLevel(100);
  };

  // Bookmark Toggle on Current Page
  const handleToggleBookmark = () => {
    sound.playSparkle();
    const isBookmarked = bookmarks.includes(currentPage);
    const updated = isBookmarked
      ? bookmarks.filter(p => p !== currentPage)
      : [...bookmarks, currentPage].sort((a, b) => a - b);
    setBookmarks(updated);
    saveProgress(currentPage, totalPages, updated, zoomLevel);
  };

  // Favorite Toggle
  const handleToggleFavorite = async () => {
    await db.toggleFavoriteFile(file.id);
    setIsFavorite(!isFavorite);
    onUpdateFile({ ...file, isFavorite: !isFavorite });
  };

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Download File Handler
  const handleDownload = () => {
    sound.playPageTurn();
    db.downloadFile(file);
  };

  // Reading progress percentage
  const progressPercent = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  // Moon phase icon representing reading progress (New Moon -> Full Moon)
  const getProgressMoonIcon = () => {
    if (progressPercent <= 12) return '🌑';
    if (progressPercent <= 25) return '🌒';
    if (progressPercent <= 37) return '🌓';
    if (progressPercent <= 50) return '🌔';
    if (progressPercent <= 75) return '🌕';
    if (progressPercent <= 90) return '🌖';
    return '🌕';
  };

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-navy-950 text-cream-50 flex flex-col select-none relative overflow-x-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
    >
      {/* ---------------- 1. TOP HEADER TOOLBAR ---------------- */}
      <header className="h-16 px-3 sm:px-6 bg-navy-900/90 border-b border-lavender-500/25 backdrop-blur-md flex items-center justify-between gap-3 sticky top-0 z-30 shadow-md">
        
        {/* Left: Back & Document Meta */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              sound.playPageTurn();
              onBack();
            }}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-lavender-400/30 text-lavender-200 hover:text-white flex items-center justify-center gap-1.5 transition-all text-xs font-medium"
            title="Back to My Files"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">My Files</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-sm sm:text-base text-cream-100 truncate" title={file.name}>
                {file.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lavender-600/30 text-lavender-200 border border-lavender-400/30 shrink-0">
                {file.category || 'Document'}
              </span>
            </div>
            <p className="text-[11px] text-lavender-300/80 truncate font-mono">
              Folder: {file.folder || 'General'} • {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

        {/* Center / Right Toolbar Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          
          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 50}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-lavender-400/20 text-lavender-300 hover:text-white disabled:opacity-30 transition-colors flex items-center justify-center"
            title="Zoom Out (Ctrl -)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Zoom Readout & Fit toggle */}
          <button
            onClick={handleToggleFit}
            className="min-h-[44px] px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-lavender-400/20 text-xs font-mono text-lavender-200 hover:text-white transition-colors hidden sm:flex items-center gap-1"
            title="Click to toggle Fit to Width / Free Zoom"
          >
            <span>{zoomLevel}%</span>
            <span className="text-[10px] text-moon-gold">({fitMode === 'width' ? 'Fit' : 'Page'})</span>
          </button>

          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 250}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-lavender-400/20 text-lavender-300 hover:text-white disabled:opacity-30 transition-colors flex items-center justify-center"
            title="Zoom In (Ctrl +)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Rotate (for PDFs and Images) */}
          {(isPdf || isImage) && (
            <button
              onClick={() => setRotation(r => (r + 90) % 360)}
              className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-lavender-400/20 text-lavender-300 hover:text-white transition-colors hidden md:flex items-center justify-center"
              title="Rotate 90 degrees"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {/* Moon Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 text-xs font-medium ${
              bookmarks.includes(currentPage)
                ? 'bg-moon-gold/20 border-moon-gold text-moon-gold shadow-sm'
                : 'bg-white/5 hover:bg-white/10 border-lavender-400/20 text-lavender-300 hover:text-white'
            }`}
            title={bookmarks.includes(currentPage) ? 'Bookmarked!' : 'Bookmark this page'}
          >
            <span className="text-sm">🌙</span>
            <span className="hidden lg:inline">{bookmarks.includes(currentPage) ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          {/* Bookmarks Drawer Trigger */}
          {bookmarks.length > 0 && (
            <button
              onClick={() => setShowBookmarksDrawer(!showBookmarksDrawer)}
              className="min-h-[44px] px-2.5 py-1.5 rounded-xl bg-lavender-600/20 border border-lavender-400/30 text-lavender-200 text-xs font-medium hidden sm:flex items-center gap-1"
              title="View all saved bookmarks in this document"
            >
              <Bookmark className="w-3.5 h-3.5 text-moon-gold" />
              <span>{bookmarks.length}</span>
            </button>
          )}

          {/* Favorite Toggle */}
          <button
            onClick={handleToggleFavorite}
            className={`min-h-[44px] min-w-[44px] p-2 rounded-xl border transition-colors flex items-center justify-center ${
              isFavorite
                ? 'bg-moon-gold/20 border-moon-gold text-moon-gold'
                : 'bg-white/5 hover:bg-white/10 border-lavender-400/20 text-lavender-300 hover:text-white'
            }`}
            title={isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-lavender-400/20 text-lavender-300 hover:text-white transition-colors hidden sm:flex items-center justify-center"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Reading'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Download Original File */}
          <button
            onClick={handleDownload}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-gradient-to-r from-lavender-600 to-indigo-600 hover:from-lavender-500 hover:to-indigo-500 text-white font-medium text-xs shadow-md transition-all flex items-center gap-1.5"
            title="Download original uploaded file"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Download</span>
          </button>
        </div>
      </header>

      {/* ---------------- 2. READING PROGRESS & PAGINATION BAR ---------------- */}
      <div className="h-10 px-4 bg-navy-950/90 border-b border-lavender-500/15 flex items-center justify-between text-xs text-lavender-300 select-none">
        
        {/* Page navigation controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 font-mono">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={handlePageInputChange}
              className="w-12 px-1.5 py-0.5 rounded bg-navy-900 border border-lavender-500/30 text-center text-xs text-cream-100 focus:outline-none focus:border-moon-gold"
            />
            <span>of {totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Celestial Reading Progress Pill */}
        <div className="flex items-center gap-2">
          <span className="text-base" title={`Reading Progress: ${progressPercent}%`}>
            {getProgressMoonIcon()}
          </span>
          <span className="font-mono text-[11px] text-cream-200 font-medium">
            {progressPercent}% Complete
          </span>

          {/* Mini progress bar */}
          <div className="w-20 sm:w-32 h-1.5 rounded-full bg-navy-900 border border-lavender-500/20 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-lavender-500 to-moon-gold transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Search in document where supported */}
        <div className="hidden md:flex items-center gap-1.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-lavender-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find in document..."
              className="pl-7 pr-3 py-1 bg-navy-900 border border-lavender-500/25 rounded-lg text-xs text-cream-100 placeholder-lavender-400/50 focus:outline-none focus:border-lavender-400 w-44"
            />
          </div>
        </div>
      </div>

      {/* ---------------- 3. MAIN DOCUMENT VIEWING CANVAS ---------------- */}
      <main className="flex-1 flex overflow-auto p-4 sm:p-8 items-center justify-center relative bg-gradient-to-b from-navy-950 via-[#0a0f26] to-navy-950">
        
        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-center text-lavender-200">
            <div className="text-4xl animate-pulse">🌙</div>
            <p className="font-serif text-sm">Opening document under moonlight...</p>
          </div>
        )}

        {/* Error Fallback with Download */}
        {!loading && error && (
          <div className="max-w-md p-6 rounded-3xl bg-navy-900/90 border border-rose-500/40 text-center shadow-2xl">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-base text-cream-100 mb-1">Preview Unavailable</h3>
            <p className="text-xs text-lavender-200 mb-4">{error}</p>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-lavender-600 hover:bg-lavender-500 text-white text-xs font-medium rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download Original File</span>
            </button>
          </div>
        )}

        {/* --- FORMAT A: PDF DOCUMENT (High-DPI Canvas Rendering) --- */}
        {!loading && !error && isPdf && (
          <div className="flex flex-col items-center justify-center shadow-2xl rounded-2xl overflow-hidden border border-lavender-500/30 bg-white">
            <canvas ref={canvasRef} className="max-w-full h-auto block" />
          </div>
        )}

        {/* --- FORMAT B: DOCX DOCUMENT (Clean HTML Typography) --- */}
        {!loading && !error && isDocx && (
          <div 
            className="w-full max-w-3xl my-4 p-8 sm:p-12 rounded-3xl bg-navy-900/90 border border-lavender-500/30 shadow-2xl text-cream-100 font-sans prose prose-invert prose-lavender leading-relaxed"
            style={{ fontSize: `${zoomLevel}%` }}
            dangerouslySetInnerHTML={{ __html: docxHtml }}
          />
        )}

        {/* --- FORMAT C: SPREADSHEETS (XLSX, XLS, CSV) --- */}
        {!loading && !error && isSpreadsheet && (
          <div className="w-full max-w-5xl my-4 flex flex-col rounded-3xl bg-navy-900/90 border border-lavender-500/30 shadow-2xl overflow-hidden">
            {/* Sheet Tabs */}
            <div className="flex items-center gap-1 p-2 bg-navy-950/80 border-b border-lavender-500/20 overflow-x-auto">
              {Object.keys(sheets).map(sheetName => (
                <button
                  key={sheetName}
                  onClick={() => {
                    sound.playPageTurn();
                    setActiveSheetName(sheetName);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors ${
                    activeSheetName === sheetName
                      ? 'bg-lavender-600 text-white shadow-sm'
                      : 'text-lavender-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-moon-gold" />
                    <span>{sheetName}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Table Content */}
            <div className="overflow-auto max-h-[70vh] p-4 font-mono text-xs">
              <table className="w-full border-collapse border border-lavender-500/20">
                <thead>
                  {sheets[activeSheetName]?.[0] && (
                    <tr className="bg-navy-950 text-lavender-200">
                      <th className="p-2 border border-lavender-500/20 text-center w-10 text-[10px] text-lavender-400">#</th>
                      {sheets[activeSheetName][0].map((headerCell: any, colIdx: number) => (
                        <th key={colIdx} className="p-2 border border-lavender-500/20 text-left font-bold truncate">
                          {String(headerCell || `Col ${colIdx + 1}`)}
                        </th>
                      ))}
                    </tr>
                  )}
                </thead>
                <tbody>
                  {sheets[activeSheetName]?.slice(1).map((row: any[], rowIdx: number) => (
                    <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                      <td className="p-2 border border-lavender-500/10 text-center text-[10px] text-lavender-400 font-mono">
                        {rowIdx + 1}
                      </td>
                      {row.map((cell: any, cellIdx: number) => (
                        <td key={cellIdx} className="p-2 border border-lavender-500/10 text-cream-100 truncate max-w-xs">
                          {String(cell ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- FORMAT D: PLAIN TEXT & MARKDOWN --- */}
        {!loading && !error && isText && (
          <div 
            className="w-full max-w-3xl my-4 p-8 rounded-3xl bg-navy-900/90 border border-lavender-500/30 shadow-2xl font-mono text-xs sm:text-sm text-cream-100 whitespace-pre-wrap leading-relaxed overflow-x-auto"
            style={{ fontSize: `${zoomLevel}%` }}
          >
            {textContent}
          </div>
        )}

        {/* --- FORMAT E: IMAGES (PNG, JPG, JPEG, WEBP, SVG) --- */}
        {!loading && !error && isImage && (
          <div className="flex items-center justify-center p-4">
            <img
              src={mediaUrl}
              alt={file.name}
              className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl border border-lavender-500/30 object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`
              }}
            />
          </div>
        )}

        {/* --- FORMAT F: VIDEO FILES --- */}
        {!loading && !error && isVideo && (
          <div className="w-full max-w-4xl p-2 rounded-3xl bg-navy-900 border border-lavender-500/30 shadow-2xl overflow-hidden">
            <video
              src={mediaUrl}
              controls
              className="w-full max-h-[75vh] rounded-2xl bg-black"
            />
          </div>
        )}

        {/* --- FORMAT G: PRESENTATION (PPTX / PPT) SLIDES VIEWER --- */}
        {!loading && !error && isPpt && (
          <div className="w-full max-w-5xl my-4 flex flex-col items-center gap-4">
            {/* 16:9 Presentation Slide Canvas */}
            <div 
              className="w-full aspect-[16/9] min-h-[380px] sm:min-h-[460px] md:min-h-[520px] rounded-3xl bg-gradient-to-br from-navy-900 via-[#0d1333] to-navy-950 border border-lavender-400/30 shadow-[0_0_50px_rgba(117,78,208,0.35)] p-6 sm:p-10 md:p-12 flex flex-col justify-between relative overflow-hidden text-cream-50 transition-all select-text"
              style={{
                fontSize: `${zoomLevel}%`
              }}
            >
              {/* Decorative Slide Background Accents */}
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-lavender-500/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-moon-gold/10 blur-3xl pointer-events-none" />
              <div className="absolute top-6 right-8 text-moon-gold/40 text-xl pointer-events-none select-none">
                ✦
              </div>

              {/* Slide Top Metadata Header */}
              <div className="flex items-center justify-between pb-3 border-b border-lavender-500/20 text-xs text-lavender-300 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-base">📊</span>
                  <span className="font-semibold text-lavender-200 truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-lavender-600/30 border border-lavender-400/30 text-lavender-200">
                    Slide {currentPage} of {totalPages}
                  </span>
                </div>
              </div>

              {/* Main Slide Content Area */}
              <div className="flex-1 my-4 sm:my-6 flex flex-col justify-center">
                {/* Slide Section / Subtitle if available */}
                {slides[currentPage - 1]?.subtitle && (
                  <p className="text-xs uppercase tracking-widest text-moon-gold font-mono mb-2">
                    {slides[currentPage - 1].subtitle}
                  </p>
                )}

                {/* Slide Title */}
                <h2 className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-cream-100 mb-4 sm:mb-6 tracking-wide text-glow">
                  {slides[currentPage - 1]?.title || file.name}
                </h2>

                {/* Slide Bullets / Body Content */}
                {slides[currentPage - 1]?.bullets && slides[currentPage - 1].bullets.length > 0 && (
                  <ul className="space-y-3 sm:space-y-4 font-sans text-xs sm:text-sm md:text-base text-lavender-100/90 leading-relaxed">
                    {slides[currentPage - 1].bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-moon-gold text-xs sm:text-sm mt-1 shrink-0">✦</span>
                        <span className="leading-snug">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Embedded Slide Images */}
                {slides[currentPage - 1]?.images && slides[currentPage - 1].images.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {slides[currentPage - 1].images.map((imgSrc, imgIdx) => (
                      <img 
                        key={imgIdx} 
                        src={imgSrc} 
                        alt="Slide graphic" 
                        className="max-h-48 rounded-xl border border-lavender-500/30 shadow-lg object-contain bg-black/30"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Slide Bottom Bar with Direct Download */}
              <div className="pt-3 border-t border-lavender-500/15 flex items-center justify-between text-[11px] text-lavender-400 font-mono">
                <span>Moonlit Library • Executive Slide Room</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="hover:text-moon-gold transition-colors flex items-center gap-1.5 text-xs text-lavender-200"
                    title="Download this original presentation file"
                  >
                    <Download className="w-3.5 h-3.5 text-moon-gold" />
                    <span>Download .pptx</span>
                  </button>
                  <span>Slide {currentPage}</span>
                </div>
              </div>
            </div>

            {/* Bottom Slide Navigation Bar & Thumbnail Strip */}
            <div className="w-full max-w-5xl glass-panel-glow rounded-2xl border border-lavender-500/30 p-3 sm:p-4 flex flex-col gap-3">
              {/* Controls row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-lavender-500/20 text-xs font-medium text-lavender-200 transition-colors flex items-center gap-1.5"
                    title="Previous Slide (← Arrow key)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Slide</span>
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-lavender-500/20 text-xs font-medium text-lavender-200 transition-colors flex items-center gap-1.5"
                    title="Next Slide (→ Arrow key)"
                  >
                    <span>Next Slide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Moon Bookmark for Slides */}
                  <button
                    onClick={handleToggleBookmark}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                      bookmarks.includes(currentPage)
                        ? 'bg-moon-gold/20 border-moon-gold text-moon-gold'
                        : 'bg-white/5 border-lavender-500/20 text-lavender-300 hover:text-white'
                    }`}
                    title="Bookmark this slide"
                  >
                    <span>🌙</span>
                    <span>{bookmarks.includes(currentPage) ? 'Bookmarked' : 'Bookmark Slide'}</span>
                  </button>

                  {/* Explicit Download Presentation Button */}
                  <button
                    onClick={handleDownload}
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-lavender-600 via-indigo-600 to-rosemoon-500 hover:from-lavender-500 hover:to-indigo-500 text-white font-serif font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    title="Download original presentation file"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Presentation ({file.name})</span>
                  </button>
                </div>
              </div>

              {/* Slide Jump Strip */}
              {slides.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-lavender-500/15 pb-1">
                  {slides.map((s) => (
                    <button
                      key={s.slideNumber}
                      onClick={() => {
                        sound.playPageTurn();
                        setCurrentPage(s.slideNumber);
                        saveProgress(s.slideNumber, totalPages, bookmarks, zoomLevel);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        currentPage === s.slideNumber
                          ? 'bg-lavender-600 text-white shadow-sm font-bold border border-lavender-400'
                          : 'bg-white/5 text-lavender-300 hover:bg-white/10 border border-lavender-500/20'
                      }`}
                    >
                      <span className="text-[10px] text-moon-gold">#{s.slideNumber}</span>
                      <span className="truncate max-w-[140px]">{s.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ---------------- 4. BOOKMARKS DRAWER SIDE SHEET ---------------- */}
      {showBookmarksDrawer && (
        <div className="fixed inset-y-0 right-0 z-40 w-72 bg-navy-900/95 border-l border-lavender-500/30 p-5 shadow-2xl backdrop-blur-xl animate-slideLeft flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-lavender-500/20">
            <div className="flex items-center gap-2">
              <span className="text-base">🌙</span>
              <h4 className="font-serif font-bold text-sm text-cream-100">Saved Bookmarks</h4>
            </div>
            <button
              onClick={() => setShowBookmarksDrawer(false)}
              className="p-1 rounded-lg text-lavender-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-lavender-300 mb-3">
            Click any bookmark to return directly to that page:
          </p>

          <div className="flex-1 overflow-y-auto space-y-2">
            {bookmarks.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => {
                  sound.playSparkle();
                  setCurrentPage(pageNumber);
                  saveProgress(pageNumber, totalPages, bookmarks, zoomLevel);
                  setShowBookmarksDrawer(false);
                }}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                  currentPage === pageNumber
                    ? 'bg-moon-gold/20 border-moon-gold text-moon-gold font-bold'
                    : 'bg-white/5 border-lavender-500/20 text-lavender-200 hover:bg-white/10'
                }`}
              >
                <span>Page {pageNumber}</span>
                <span className="text-[10px] text-lavender-400 font-mono">Jump →</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
