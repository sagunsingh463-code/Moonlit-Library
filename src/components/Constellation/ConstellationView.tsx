import React, { useState, useRef, useEffect } from 'react';
import { ConstellationStar } from '../../types';
import { Sparkles, Star, Plus, Filter, Calendar, Award, X } from 'lucide-react';
import { sound } from '../../services/audio';

interface ConstellationViewProps {
  stars: ConstellationStar[];
  onAddStar: (title: string, category: ConstellationStar['category'], notes?: string) => Promise<void>;
  reduceMotion?: boolean;
}

export const ConstellationView: React.FC<ConstellationViewProps> = ({
  stars,
  onAddStar,
  reduceMotion = false
}) => {
  const [selectedStar, setSelectedStar] = useState<ConstellationStar | null>(null);
  const [filter, setFilter] = useState<'all' | ConstellationStar['category']>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ConstellationStar['category']>('focus');
  const [newNotes, setNewNotes] = useState('');

  const filteredStars = filter === 'all' ? stars : stars.filter(s => s.category === filter);

  const handleCreateStar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await onAddStar(newTitle, newCategory, newNotes);
    sound.playStarAdd();
    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-6 flex flex-col justify-between">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 z-10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-stargold-300" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              My Constellation
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            Every study milestone, completed assignment, and aced quiz ignites a permanent glowing star in your personal sky.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Category filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl glass-panel-subtle text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'bg-lavender-600 text-white font-medium' : 'text-lavender-200/70 hover:text-white'}`}
            >
              All ({stars.length})
            </button>
            <button
              onClick={() => setFilter('quiz')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${filter === 'quiz' ? 'bg-stargold-400/20 text-stargold-200 border border-stargold-400/30' : 'text-lavender-200/70 hover:text-white'}`}
            >
              Quizzes
            </button>
            <button
              onClick={() => setFilter('assignment')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${filter === 'assignment' ? 'bg-lavender-500/20 text-lavender-200 border border-lavender-400/30' : 'text-lavender-200/70 hover:text-white'}`}
            >
              Assignments
            </button>
            <button
              onClick={() => setFilter('focus')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${filter === 'focus' ? 'bg-moonlight-shimmer/20 text-moonlight-shimmer border border-moonlight-shimmer/30' : 'text-lavender-200/70 hover:text-white'}`}
            >
              Deep Focus
            </button>
          </div>

          {/* Add star milestone button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ignite Star</span>
          </button>
        </div>
      </div>

      {/* Interactive Constellation Map Canvas Area */}
      <div className="relative flex-1 min-h-[520px] rounded-3xl glass-panel-glow border border-lavender-400/25 overflow-hidden shadow-2xl p-6 flex items-center justify-center">
        {/* Background Celestial Grid / Radial Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[300px] h-[300px] rounded-full border border-lavender-400 dashed" />
          <div className="w-[500px] h-[500px] rounded-full border border-lavender-400 dashed absolute" />
          <div className="w-[700px] h-[700px] rounded-full border border-lavender-400 dashed absolute" />
          <div className="w-full h-px bg-lavender-400 absolute" />
          <div className="h-full w-px bg-lavender-400 absolute" />
        </div>

        {/* SVG Constellation lines connecting stars sequentially */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="constellationLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE8A3" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#B8A7EA" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F4ABC4" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          {filteredStars.map((star, idx) => {
            if (idx === 0) return null;
            const prev = filteredStars[idx - 1];
            return (
              <line
                key={`line-${prev.id}-${star.id}`}
                x1={`${prev.x}%`}
                y1={`${prev.y}%`}
                x2={`${star.x}%`}
                y2={`${star.y}%`}
                stroke="url(#constellationLine)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className={reduceMotion ? '' : 'animate-pulse'}
              />
            );
          })}
        </svg>

        {/* Stars Rendered on Canvas */}
        {filteredStars.map((star) => {
          const isSelected = selectedStar?.id === star.id;
          return (
            <div
              key={star.id}
              onClick={() => {
                sound.playSparkle();
                setSelectedStar(star);
              }}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-transform duration-300 hover:scale-150"
            >
              {/* Star Core Orb */}
              <div
                style={{
                  width: `${star.size * 2.5}px`,
                  height: `${star.size * 2.5}px`,
                  backgroundColor: star.glowColor,
                  boxShadow: `0 0 20px 4px ${star.glowColor}`,
                }}
                className={`rounded-full transition-all ${
                  isSelected ? 'ring-4 ring-white scale-125' : ''
                } ${reduceMotion ? '' : 'animate-twinkle'}`}
              />

              {/* Star Label Tooltip on hover */}
              <div className="absolute left-1/2 -top-8 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-midnight-950/90 border border-lavender-400/40 px-2 py-0.5 rounded text-[11px] text-white whitespace-nowrap pointer-events-none shadow-md">
                {star.title}
              </div>
            </div>
          );
        })}

        {/* Selected Star Details Card Drawer */}
        {selectedStar && (
          <div className="absolute bottom-6 right-6 max-w-sm w-full p-5 rounded-2xl glass-panel-glow border border-lavender-400/40 shadow-2xl z-20 animate-book-open">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedStar.glowColor, boxShadow: `0 0 10px ${selectedStar.glowColor}` }}
                />
                <span className="text-xs uppercase tracking-wider font-semibold text-lavender-300">
                  {selectedStar.category} Milestone
                </span>
              </div>
              <button 
                onClick={() => setSelectedStar(null)}
                className="text-lavender-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-serif font-bold text-lg text-white mt-2 mb-1">
              {selectedStar.title}
            </h3>

            {selectedStar.notes && (
              <p className="text-xs text-lavender-200/90 italic font-sans mb-3">
                "{selectedStar.notes}"
              </p>
            )}

            <div className="flex items-center justify-between text-[11px] text-lavender-400/80 pt-2 border-t border-lavender-400/20 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(selectedStar.unlockedAt).toLocaleDateString()}
              </span>
              <span className="text-stargold-300">
                Magnitude {selectedStar.magnitude} ★
              </span>
            </div>
          </div>
        )}

        {filteredStars.length === 0 && (
          <div className="text-center text-lavender-300/70 p-6">
            <Star className="w-12 h-12 text-stargold-400/40 mx-auto mb-2 animate-bounce" />
            <p className="font-serif text-base">No stars found in this sector yet.</p>
            <p className="text-xs text-lavender-400">Complete tasks or practice quizzes to ignite new stars!</p>
          </div>
        )}
      </div>

      {/* Add Star Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel-glow border border-lavender-400/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-stargold-300" />
                <h3 className="font-serif font-bold text-lg text-white">Ignite a Constellation Star</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-lavender-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStar} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Star Title / Milestone</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mastered DCF Valuation Models"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-sm focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ConstellationStar['category'])}
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-sm focus:outline-none focus:border-stargold-400"
                >
                  <option value="focus">Deep Focus Session</option>
                  <option value="quiz">Quiz Victory</option>
                  <option value="assignment">Assignment Complete</option>
                  <option value="note">Key Note Synthesis</option>
                  <option value="file">Study Resource Upload</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Personal Note / Reflection</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="What was the key insight or achievement?"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-sm focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-lavender-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110"
                >
                  Place in Sky ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
