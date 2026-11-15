import React, { useState } from 'react';
import { YouTubeResource, YouTubeTimestampNote, SubjectItem } from '../../types';
import { 
  Video, 
  Play, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Sparkles, 
  Search, 
  Filter, 
  Bookmark,
  Share2,
  ExternalLink
} from 'lucide-react';
import { sound } from '../../services/sound';

interface YouTubeCentreViewProps {
  resources: YouTubeResource[];
  subjects: SubjectItem[];
  onSaveResource: (res: YouTubeResource) => Promise<void>;
  onDeleteResource: (id: string) => Promise<void>;
}

export const YouTubeCentreView: React.FC<YouTubeCentreViewProps> = ({
  resources,
  subjects,
  onSaveResource,
  onDeleteResource
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<YouTubeResource | null>(resources[0] || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(subjects[0]?.name || 'Product Management');
  const [newPlaylist, setNewPlaylist] = useState('');

  // Note authoring states
  const [noteTimestamp, setNoteTimestamp] = useState('00:00');
  const [noteContent, setNoteContent] = useState('');

  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vidId = extractYouTubeId(newUrl);
    if (!vidId) {
      alert('Please enter a valid YouTube video URL');
      return;
    }

    sound.playCelestialChime();
    const matchedSubj = subjects.find(s => s.name.toLowerCase() === newSubject.toLowerCase());

    const newRes: YouTubeResource = {
      id: `yt-${Date.now()}`,
      subjectId: matchedSubj?.id,
      subjectName: newSubject,
      title: newTitle.trim() || `Lecture: ${newSubject}`,
      youtubeUrl: newUrl.trim(),
      videoId: vidId,
      playlistName: newPlaylist.trim() || 'Core MBA Lectures',
      durationMinutes: 45,
      isWatched: false,
      notes: [],
      createdAt: new Date().toISOString()
    };

    await onSaveResource(newRes);
    setActiveVideo(newRes);
    setNewUrl('');
    setNewTitle('');
    setNewPlaylist('');
    setIsAddModalOpen(false);
  };

  const handleToggleWatched = async (res: YouTubeResource, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCardClick();
    const updated: YouTubeResource = {
      ...res,
      isWatched: !res.isWatched,
      watchedAt: !res.isWatched ? new Date().toISOString() : undefined
    };
    await onSaveResource(updated);
    if (activeVideo?.id === res.id) setActiveVideo(updated);
  };

  const handleAddNoteToActive = async () => {
    if (!activeVideo || !noteContent.trim()) return;
    sound.playCelestialChime();

    const parts = noteTimestamp.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
    else if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];

    const noteItem: YouTubeTimestampNote = {
      id: `note-${Date.now()}`,
      timestampSeconds: seconds,
      timestampDisplay: noteTimestamp,
      note: noteContent.trim(),
      createdAt: new Date().toISOString()
    };

    const updated: YouTubeResource = {
      ...activeVideo,
      notes: [...(activeVideo.notes || []), noteItem]
    };

    await onSaveResource(updated);
    setActiveVideo(updated);
    setNoteContent('');
  };

  const filteredResources = resources.filter(r => {
    if (selectedSubjectFilter !== 'all' && r.subjectName.toLowerCase() !== selectedSubjectFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const match = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (r.playlistName && r.playlistName.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-lavender-400/20 bg-gradient-to-r from-space-900/90 via-midnight-800/80 to-space-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-500/10 border border-lavender-400/30 text-stargold-300 text-xs font-serif uppercase tracking-wider mb-2">
              <Video size={14} className="text-pink-400" />
              MBA Video Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              YouTube Learning Centre
            </h1>
            <p className="text-xs sm:text-sm text-lavender-300/80 mt-1 max-w-2xl font-sans">
              Watch university lectures, Harvard/Stanford business case discussions, and record synchronized study notes.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playCardClick();
              setIsAddModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-stargold-400/20"
          >
            <Plus size={16} />
            Add YouTube URL
          </button>
        </div>

        {/* Search & Subject filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-lavender-400/15">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-2.5 text-lavender-400" />
            <input
              type="text"
              placeholder="Search lectures, topics, or playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-midnight-950/80 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-lavender-400" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-midnight-950/80 border border-lavender-400/30 text-lavender-200 text-xs focus:outline-none focus:border-stargold-400"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Video Player & Timestamp Workspace */}
      {activeVideo && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-lavender-400/25 bg-midnight-950/75 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-stargold-300 font-bold uppercase">
                {activeVideo.subjectName} • {activeVideo.playlistName || 'Course Lecture'}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                {activeVideo.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => handleToggleWatched(activeVideo, e)}
                className={`px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  activeVideo.isWatched
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-midnight-900 text-lavender-300 border-lavender-400/20 hover:text-white'
                }`}
              >
                <CheckCircle2 size={16} />
                {activeVideo.isWatched ? 'Watched ✓' : 'Mark as Watched'}
              </button>
            </div>
          </div>

          {/* 16:9 Video Embed */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-lavender-400/30 bg-black shadow-2xl">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${activeVideo.videoId}?enablejsapi=1`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Timestamp Notes authoring */}
          <div className="pt-4 border-t border-lavender-400/20 space-y-4">
            <h3 className="text-sm font-serif font-bold text-stargold-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} /> Personal Timestamp Notes
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="mm:ss (e.g. 14:20)"
                value={noteTimestamp}
                onChange={(e) => setNoteTimestamp(e.target.value)}
                className="w-full sm:w-28 px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Key concept, formula, or case study point at this timestamp..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs"
              />
              <button
                onClick={handleAddNoteToActive}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs"
              >
                Save Note
              </button>
            </div>

            {/* Recorded Notes */}
            {activeVideo.notes && activeVideo.notes.length > 0 ? (
              <div className="space-y-2 pt-2">
                {activeVideo.notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-2xl bg-midnight-900/60 border border-lavender-400/15 flex items-start justify-between text-xs group"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-stargold-300 bg-lavender-500/15 px-2 py-0.5 rounded-lg text-xs font-bold">
                        {n.timestampDisplay}
                      </span>
                      <span className="text-lavender-200 leading-relaxed">{n.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-lavender-400/70 italic">
                No timestamp notes yet for this lecture. Type a timestamp and key takeaway above to capture your notes!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Playlist Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-white">
          All Curated Video Lectures ({filteredResources.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => {
            const isPlaying = activeVideo?.id === res.id;

            return (
              <div
                key={res.id}
                onClick={() => {
                  sound.playCardClick();
                  setActiveVideo(res);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className={`glass-panel rounded-3xl overflow-hidden border transition-all cursor-pointer group hover:scale-[1.02] flex flex-col justify-between ${
                  isPlaying
                    ? 'border-stargold-400/80 bg-midnight-900/90 shadow-xl'
                    : 'border-lavender-400/20 bg-midnight-950/60 hover:border-lavender-400/50'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-midnight-950 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${res.videoId}/hqdefault.jpg`}
                    alt={res.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="translate-x-0.5" />
                    </div>
                  </div>
                  {res.isWatched && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-midnight-950 font-bold text-[10px]">
                      Watched ✓
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-stargold-300">
                    <span className="truncate">{res.subjectName}</span>
                    <span className="text-lavender-400">{res.playlistName}</span>
                  </div>

                  <h4 className="text-sm font-serif font-bold text-white line-clamp-2 group-hover:text-pink-300 transition-colors">
                    {res.title}
                  </h4>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-lavender-400/15 text-xs">
                    <span className="text-lavender-300">
                      {res.notes?.length || 0} Notes Recorded
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this video?')) {
                          onDeleteResource(res.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-lavender-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Video Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-lavender-400/30 bg-midnight-900/95 space-y-4">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Video size={18} className="text-pink-400" />
              Add Curated YouTube Video
            </h3>

            <form onSubmit={handleAddVideoSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-lavender-200 mb-1">YouTube URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-lavender-200 mb-1">Lecture Title</label>
                <input
                  type="text"
                  placeholder="e.g. Stanford Masterclass: Cohort Analytics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-lavender-200 mb-1">MBA Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-lavender-200 mb-1">Playlist Name</label>
                <input
                  type="text"
                  placeholder="e.g. Week 4 Lectures"
                  value={newPlaylist}
                  onChange={(e) => setNewPlaylist(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight-950 border border-lavender-400/30 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-lavender-400/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-lavender-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs"
                >
                  Save to Learning Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
