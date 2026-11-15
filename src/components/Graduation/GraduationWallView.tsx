import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Download, 
  Calendar, 
  ChevronRight, 
  FileText, 
  Star,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import { AcademicTerm, SubjectItem, GraduationMilestone } from '../../types';
import { sound } from '../../services/audio';

interface GraduationWallViewProps {
  terms?: AcademicTerm[];
  subjects?: SubjectItem[];
  studentName?: string;
  onNavigate?: (view: any, itemId?: string) => void;
  compact?: boolean;
}

export const GraduationWallView: React.FC<GraduationWallViewProps> = ({
  terms = [],
  subjects = [],
  studentName = 'Sagun Singh',
  onNavigate,
  compact = false
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Term definitions with real MBA curriculum
  const termData = [
    {
      termNumber: 1,
      title: 'Term 1 — Foundations of Business Mastery',
      status: 'completed' as const,
      subjects: [
        'Design Thinking',
        'Vibe Coding',
        'Prompt Engineering',
        'Accounting Primer',
        'Marketing Analysis',
        'Organizational Behavior',
        'Managerial Communication',
        'Statistics',
        'Finance'
      ],
      completionPercentage: 100,
      badge: 'Term 1 Scholar Laureate'
    },
    {
      termNumber: 2,
      title: 'Term 2 — Strategy, Innovation & Product Leadership',
      status: 'in_progress' as const,
      subjects: [
        'Microeconomics',
        'Introduction to UI/UX',
        'Leadership Accelerator',
        'Market Research Methods',
        'Product Management',
        'CV Interview Workshop',
        'Entrepreneurial Mindset'
      ],
      completionPercentage: 68,
      badge: 'Product Leader Candidate'
    },
    {
      termNumber: 3,
      title: 'Term 3 — Advanced Analytics & Digital Operations',
      status: 'upcoming' as const,
      subjects: ['Operations Management', 'Business Analytics', 'Digital Marketing Strategy'],
      completionPercentage: 0,
      badge: 'Upcoming Term'
    },
    {
      termNumber: 4,
      title: 'Term 4 — Corporate Finance & Global Strategy',
      status: 'upcoming' as const,
      subjects: ['Corporate Valuation', 'Global Macroeconomics', 'Venture Capital'],
      completionPercentage: 0,
      badge: 'Upcoming Term'
    },
    {
      termNumber: 5,
      title: 'Term 5 — Executive Leadership & Transformation',
      status: 'upcoming' as const,
      subjects: ['Strategic Negotiation', 'Mergers & Acquisitions', 'AI in Enterprise'],
      completionPercentage: 0,
      badge: 'Upcoming Term'
    },
    {
      termNumber: 6,
      title: 'Term 6 — Capstone Venture & Master’s Thesis',
      status: 'upcoming' as const,
      subjects: ['MBA Capstone Venture', 'Executive Defense', 'Graduation Colloquium'],
      completionPercentage: 0,
      badge: 'Final Graduation Gate'
    }
  ];

  // Milestones list
  const milestones: GraduationMilestone[] = [
    {
      id: 'm-1',
      termNumber: 1,
      title: 'Foundational Laureate',
      description: 'Mastered all 9 Term 1 subjects across Design Thinking, Finance, and Coding.',
      requirement: '100% Term 1 subjects completed',
      unlocked: true,
      unlockedAt: '2026-10-15',
      badgeIcon: '🏛️'
    },
    {
      id: 'm-2',
      termNumber: 2,
      title: 'Arcade Champion',
      description: 'Successfully spun and answered 50-Question scenario challenges on the Term 2 wheel.',
      requirement: 'Complete Term 2 Moonlight Arcade Challenge',
      unlocked: true,
      unlockedAt: '2026-11-10',
      badgeIcon: '🎡'
    },
    {
      id: 'm-3',
      termNumber: 2,
      title: 'Product & UX Pioneer',
      description: 'Completed Product Management PRD framework and UI/UX Heuristics evaluations.',
      requirement: 'Pass PM and UI/UX mid-term reviews',
      unlocked: true,
      unlockedAt: '2026-11-14',
      badgeIcon: '💡'
    },
    {
      id: 'm-4',
      termNumber: 3,
      title: 'Analytics Vanguard',
      description: 'Solve advanced business analytics and digital optimization cases.',
      requirement: 'Complete Term 3 curriculum',
      unlocked: false,
      badgeIcon: '📊'
    },
    {
      id: 'm-5',
      termNumber: 6,
      title: 'Master of Business Administration (Honors)',
      description: 'Full completion of all 6 terms, capstone defense, and thesis symposium.',
      requirement: 'Complete all 6 terms and capstone defense',
      unlocked: false,
      badgeIcon: '🎓'
    }
  ];

  const totalTerms = 6;
  const completedTerms = termData.filter(t => t.status === 'completed').length;
  const isFullyGraduated = completedTerms === totalTerms;

  if (compact) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-amber-600/30 bg-[#161412]/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-bold text-sm text-[#f4ebe1]">
              MBA Graduation Wall
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-300 font-bold">
            Term 2 of 6 Ongoing
          </span>
        </div>

        {/* 6 Terms Mini Indicators */}
        <div className="grid grid-cols-6 gap-1.5">
          {termData.map(t => (
            <div
              key={t.termNumber}
              className={`p-2 rounded-xl text-center border text-[10px] font-mono ${
                t.status === 'completed'
                  ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 font-bold'
                  : t.status === 'in_progress'
                  ? 'bg-amber-600/30 border-amber-400 text-white font-bold ring-1 ring-amber-400/50'
                  : 'bg-[#1b1714] border-stone-800 text-stone-600'
              }`}
            >
              <span>T{t.termNumber}</span>
              <span className="block text-[8px] mt-0.5">
                {t.status === 'completed' ? '✓' : t.status === 'in_progress' ? `${t.completionPercentage}%` : '🔒'}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onNavigate && onNavigate('graduation-wall')}
          className="w-full text-center py-2 text-xs font-serif text-amber-300 hover:text-amber-100 flex items-center justify-center gap-1 transition-colors border-t border-amber-800/20 pt-2.5"
        >
          <span>View 6-Term Journey & Diploma Wall</span>
          <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-600/30 bg-gradient-to-r from-[#1c1713] via-[#261f19] to-[#1c1713] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-200 text-xs font-serif">
              <GraduationCap size={14} />
              <span>Six-Term MBA Academic Journey</span>
              <span>•</span>
              <span>Accreditation Wall</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#f4ebe1] text-glow">
              MBA Graduation & Achievement Wall ˚୨୧⋆｡˚
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
              Celebrate genuine academic milestones across all six terms. Full Graduation honors unlock exclusively upon verified completion of all terms and subjects!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playSparkle();
                setIsExportModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-xs font-serif font-bold shadow-lg shadow-amber-900/30 hover:brightness-110 flex items-center gap-2 transition-all"
            >
              <Download size={15} />
              <span>Export Achievement Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Graduation Status Hero Card */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-700/30 bg-[#161412]/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-900/30 flex-shrink-0">
            <GraduationCap size={32} />
          </div>
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase font-bold">
              Degree Candidate: {studentName}
            </div>
            <h3 className="text-lg font-serif font-bold text-[#f4ebe1]">
              Master of Business Administration (MBA)
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Status: <span className="text-amber-300 font-bold">{isFullyGraduated ? 'Graduated with Honors' : 'Term 2 Active Candidate (Term 1 Completed)'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-center">
          <div>
            <span className="text-[11px] text-stone-400 uppercase block font-sans">Terms Complete</span>
            <span className="text-xl font-serif font-bold text-amber-300">{completedTerms} / 6</span>
          </div>
          <div className="h-8 w-px bg-stone-800" />
          <div>
            <span className="text-[11px] text-stone-400 uppercase block font-sans">Active Term</span>
            <span className="text-xl font-serif font-bold text-white">Term 2</span>
          </div>
          <div className="h-8 w-px bg-stone-800" />
          <div>
            <span className="text-[11px] text-stone-400 uppercase block font-sans">Mastered Subjects</span>
            <span className="text-xl font-serif font-bold text-emerald-400">9 Subjects</span>
          </div>
        </div>
      </div>

      {/* Six Terms Learning Timeline Arc */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-serif font-bold text-[#f4ebe1]">
            Curriculum Terms & Mastery Roadmap
          </h2>
          <span className="text-xs font-mono text-stone-400">
            6 Academic Terms Total
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {termData.map(t => (
            <div
              key={t.termNumber}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                t.status === 'completed'
                  ? 'glass-panel bg-[#1a1714]/90 border-amber-600/40'
                  : t.status === 'in_progress'
                  ? 'glass-panel bg-[#221e1a]/90 border-amber-400/60 shadow-lg'
                  : 'bg-[#141210]/60 border-stone-800/80 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/70 border border-amber-600/30 text-amber-300">
                    TERM {t.termNumber}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold capitalize ${
                    t.status === 'completed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/40'
                      : t.status === 'in_progress'
                      ? 'bg-amber-950 text-amber-300 border border-amber-600/40 animate-pulse'
                      : 'bg-stone-900 text-stone-500 border border-stone-800'
                  }`}>
                    {t.status === 'completed' ? 'Mastered ✓' : t.status === 'in_progress' ? 'In Progress' : 'Locked 🔒'}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-serif font-bold text-white">
                    {t.title}
                  </h4>
                  <p className="text-[11px] text-amber-300/80 font-mono mt-0.5">
                    Badge: {t.badge}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                    <span>Term Completion</span>
                    <span>{t.completionPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#2a241f] overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        t.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-600 to-amber-400'
                      }`}
                      style={{ width: `${t.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Subjects list tags */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] text-stone-400 font-mono block uppercase">
                    Curriculum Subjects ({t.subjects.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {t.subjects.map(s => (
                      <span 
                        key={s} 
                        className={`text-[10px] px-2 py-0.5 rounded-lg border ${
                          t.status === 'completed'
                            ? 'bg-emerald-950/40 border-emerald-800/30 text-emerald-300'
                            : t.status === 'in_progress'
                            ? 'bg-[#1b1714] border-amber-800/30 text-stone-300'
                            : 'bg-stone-900/50 border-stone-800 text-stone-600'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {t.status === 'in_progress' && (
                <button
                  onClick={() => onNavigate && onNavigate('terms')}
                  className="w-full py-2 rounded-xl bg-amber-600 text-stone-950 font-serif font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Continue Term 2 Studies</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Academic Milestones Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-700/30 bg-[#161412]/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-amber-400" />
            <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
              Honorary Academic Milestones & Badges
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-mono">
            {milestones.filter(m => m.unlocked).length} / {milestones.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {milestones.map(m => (
            <div
              key={m.id}
              className={`p-4 rounded-2xl border transition-all ${
                m.unlocked
                  ? 'bg-[#221e1a]/80 border-amber-600/40 text-stone-200'
                  : 'bg-[#141210]/40 border-stone-800 text-stone-600'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{m.badgeIcon}</span>
                <div>
                  <h4 className="text-xs font-serif font-bold text-white">{m.title}</h4>
                  <span className="text-[10px] text-amber-300/80 font-mono block">Term {m.termNumber} Milestone</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-400 leading-snug">{m.description}</p>
              <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between text-[10px] font-mono">
                <span className="text-stone-400">{m.requirement}</span>
                <span className={m.unlocked ? 'text-amber-300 font-bold' : 'text-stone-600'}>
                  {m.unlocked ? 'Unlocked ✓' : 'Locked 🔒'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Achievement Summary Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel p-8 rounded-3xl border border-amber-600/40 bg-[#1c1815] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
              <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
                Academic Achievement Summary Certificate
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Certificate Card View */}
            <div className="p-6 rounded-2xl bg-[#12100e] border-2 border-amber-600/50 space-y-4 text-center">
              <div className="text-2xl">🏛️ 🎓 📜</div>
              <h4 className="font-serif font-bold text-lg text-amber-200">
                MOONLIT LIBRARY MBA CANDIDACY TRANSCRIPT
              </h4>
              <p className="text-xs text-stone-300 font-sans">
                This document certifies that <strong className="text-white">{studentName}</strong> is actively enrolled in the Master of Business Administration program at Moonlit Library.
              </p>

              <div className="grid grid-cols-2 gap-3 text-left py-2 text-xs font-mono bg-[#1b1714] p-3 rounded-xl border border-amber-700/20">
                <div>
                  <span className="text-stone-400 block text-[10px]">STUDENT:</span>
                  <span className="text-white font-bold">{studentName}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">PROGRAM:</span>
                  <span className="text-white font-bold">MBA (6 Terms)</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">COMPLETED TERMS:</span>
                  <span className="text-emerald-400 font-bold">Term 1 (9 Subjects)</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">ACTIVE TERM:</span>
                  <span className="text-amber-400 font-bold">Term 2 (In Progress)</span>
                </div>
              </div>

              <div className="text-[10px] text-stone-500 font-mono">
                Verified Cryptographic Signature • Moonlit Library Academic Registry
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  sound.playCelestialChime();
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-serif font-bold text-xs hover:brightness-110 flex items-center gap-1.5"
              >
                <Download size={14} />
                <span>Print / Download Transcript</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
