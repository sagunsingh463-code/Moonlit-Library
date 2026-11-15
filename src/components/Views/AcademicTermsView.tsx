import React, { useState } from 'react';
import { AcademicTerm, SubjectItem, TermStatus } from '../../types';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRightLeft, 
  Layers, 
  FileText, 
  Video,
  Award,
  AlertCircle
} from 'lucide-react';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';

interface AcademicTermsViewProps {
  terms: AcademicTerm[];
  subjects: SubjectItem[];
  onSelectSubject: (subject: SubjectItem) => void;
  onSaveTerm: (term: AcademicTerm) => Promise<void>;
  onSaveSubject: (subject: SubjectItem) => Promise<void>;
  onDeleteSubject: (subjectId: string) => Promise<void>;
}

export const AcademicTermsView: React.FC<AcademicTermsViewProps> = ({
  terms,
  subjects,
  onSelectSubject,
  onSaveTerm,
  onSaveSubject,
  onDeleteSubject
}) => {
  const [activeTermNumber, setActiveTermNumber] = useState<number>(2); // Default to Term 2 (In Progress)
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [movingSubject, setMovingSubject] = useState<SubjectItem | null>(null);
  const [editingTerm, setEditingTerm] = useState<AcademicTerm | null>(null);

  // Form states for subject
  const [subName, setSubName] = useState('');
  const [subCode, setSubCode] = useState('');
  const [subCredits, setSubCredits] = useState(3);
  const [subProfessor, setSubProfessor] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subColor, setSubColor] = useState('from-purple-500 to-pink-600');
  const [subSyllabus, setSubSyllabus] = useState('');

  const currentTerm = terms.find(t => t.termNumber === activeTermNumber) || terms[0];
  const termSubjects = subjects.filter(s => s.termNumber === activeTermNumber);

  const colorOptions = [
    { label: 'Lavender Rose', val: 'from-purple-500 to-pink-600' },
    { label: 'Emerald Mint', val: 'from-emerald-500 to-teal-600' },
    { label: 'Ocean Blue', val: 'from-blue-500 to-cyan-600' },
    { label: 'Starlight Gold', val: 'from-amber-500 to-yellow-600' },
    { label: 'Crimson Sunset', val: 'from-rose-500 to-orange-600' },
    { label: 'Cosmic Violet', val: 'from-violet-500 to-fuchsia-600' }
  ];

  const handleOpenAddSubject = () => {
    sound.playCardClick();
    setEditingSubject(null);
    setSubName('');
    setSubCode('');
    setSubCredits(3);
    setSubProfessor('');
    setSubDesc('');
    setSubColor('from-purple-500 to-pink-600');
    setSubSyllabus('');
    setIsAddSubjectModalOpen(true);
  };

  const handleOpenEditSubject = (subj: SubjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCardClick();
    setEditingSubject(subj);
    setSubName(subj.name);
    setSubCode(subj.code);
    setSubCredits(subj.credits);
    setSubProfessor(subj.professor || '');
    setSubDesc(subj.description);
    setSubColor(subj.color);
    setSubSyllabus((subj.syllabus || []).join('\n'));
    setIsAddSubjectModalOpen(true);
  };

  const handleSaveSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    sound.playCelestialChime();
    const syllabusList = subSyllabus
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const subjectData: SubjectItem = {
      id: editingSubject ? editingSubject.id : `subj-${Date.now()}`,
      termId: currentTerm.id,
      termNumber: activeTermNumber,
      name: subName.trim(),
      code: subCode.trim() || `SUB${activeTermNumber}0${termSubjects.length + 1}`,
      description: subDesc.trim() || 'Comprehensive MBA course module.',
      credits: Number(subCredits) || 3,
      professor: subProfessor.trim(),
      color: subColor,
      syllabus: syllabusList.length > 0 ? syllabusList : ['Overview', 'Core Concepts', 'Case Studies', 'Evaluation'],
      completionPercentage: editingSubject?.completionPercentage ?? (currentTerm.status === 'completed' ? 100 : 0),
      createdAt: editingSubject?.createdAt || new Date().toISOString()
    };

    await onSaveSubject(subjectData);
    setIsAddSubjectModalOpen(false);
  };

  const handleDeleteSubjectConfirm = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this subject?')) {
      sound.playPageTurn();
      await onDeleteSubject(id);
    }
  };

  const handleTermStatusChange = async (newStatus: TermStatus) => {
    sound.playCelestialChime();
    const updatedTerm: AcademicTerm = {
      ...currentTerm,
      status: newStatus
    };
    await onSaveTerm(updatedTerm);
    if (newStatus === 'completed') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleMoveSubjectTerm = async (targetTermNumber: number) => {
    if (!movingSubject) return;
    sound.playCelestialChime();
    const targetTerm = terms.find(t => t.termNumber === targetTermNumber);
    const updatedSubject: SubjectItem = {
      ...movingSubject,
      termNumber: targetTermNumber,
      termId: targetTerm?.id || `term-${targetTermNumber}`
    };
    await onSaveSubject(updatedSubject);
    setMovingSubject(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-lavender-400/20 bg-gradient-to-r from-space-900/90 via-midnight-800/80 to-space-900/90">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lavender-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-500/10 border border-lavender-400/30 text-lavender-200 text-xs font-serif tracking-wider uppercase mb-3">
              <GraduationCap size={14} className="text-stargold-300" />
              MBA Curriculum Structure
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              Six-Term Academic Universe
            </h1>
            <p className="text-sm sm:text-base text-lavender-200/80 mt-1 max-w-2xl font-sans">
              Track subjects, lecture materials, assignments, and exam mastery across your 2-year MBA journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddSubject}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-stargold-400/20 transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={18} />
              Add Subject
            </button>
          </div>
        </div>

        {/* 6 Terms Tabs Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-8 pt-6 border-t border-lavender-400/15">
          {terms.map((term) => {
            const isSelected = term.termNumber === activeTermNumber;
            const subCount = subjects.filter(s => s.termNumber === term.termNumber).length;
            
            return (
              <button
                key={term.id}
                onClick={() => {
                  sound.playCardClick();
                  setActiveTermNumber(term.termNumber);
                }}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 border relative group ${
                  isSelected
                    ? 'bg-lavender-500/25 border-stargold-400/60 shadow-lg shadow-lavender-500/10'
                    : 'bg-midnight-900/40 border-lavender-400/10 hover:border-lavender-400/30 hover:bg-midnight-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-stargold-300' : 'text-lavender-400'}`}>
                    TERM {term.termNumber}
                  </span>
                  {term.status === 'completed' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" title="Completed" />
                  )}
                  {term.status === 'in-progress' && (
                    <span className="w-2 h-2 rounded-full bg-stargold-400 animate-pulse shadow-[0_0_8px_#fbbf24]" title="In Progress" />
                  )}
                  {term.status === 'upcoming' && (
                    <span className="w-2 h-2 rounded-full bg-slate-500" title="Upcoming" />
                  )}
                </div>
                <div className="text-sm font-serif font-bold text-white truncate">
                  {term.termNumber === 1 ? 'Foundations' : 
                   term.termNumber === 2 ? 'Core Strategy' : 
                   term.termNumber === 3 ? 'Specialization' : 
                   term.termNumber === 4 ? 'Global Lead' : 
                   term.termNumber === 5 ? 'Venture Lab' : 'Capstone'}
                </div>
                <div className="text-[11px] text-lavender-300/70 mt-1 flex items-center justify-between">
                  <span>{subCount} {subCount === 1 ? 'Subject' : 'Subjects'}</span>
                  <span className="capitalize text-[10px] opacity-80">{term.status.replace('-', ' ')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Term Header & Status Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-lavender-400/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif font-bold text-white">
              {currentTerm.title}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              currentTerm.status === 'completed' 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : currentTerm.status === 'in-progress'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
            }`}>
              {currentTerm.status === 'completed' ? '✓ Completed' : 
               currentTerm.status === 'in-progress' ? '● In Progress' : '○ Upcoming'}
            </span>
          </div>
          <p className="text-xs text-lavender-300/80 mt-1">
            {currentTerm.description || 'Academic curriculum subjects, syllabus schedules and learning evaluations.'}
          </p>
        </div>

        {/* Change Status Dropdown / Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-lavender-300/70 mr-1">Term Status:</span>
          <button
            onClick={() => handleTermStatusChange('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentTerm.status === 'completed'
                ? 'bg-emerald-500 text-midnight-950 font-bold'
                : 'bg-midnight-900/60 text-lavender-300 border border-lavender-400/20 hover:border-emerald-400/50'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => handleTermStatusChange('in-progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentTerm.status === 'in-progress'
                ? 'bg-amber-400 text-midnight-950 font-bold'
                : 'bg-midnight-900/60 text-lavender-300 border border-lavender-400/20 hover:border-amber-400/50'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleTermStatusChange('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentTerm.status === 'upcoming'
                ? 'bg-slate-300 text-midnight-950 font-bold'
                : 'bg-midnight-900/60 text-lavender-300 border border-lavender-400/20 hover:border-slate-400/50'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      {termSubjects.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-dashed border-lavender-400/30 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-lavender-500/10 flex items-center justify-center text-lavender-300">
            <BookOpen size={32} />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-white">No Subjects Added Yet to Term {activeTermNumber}</h3>
            <p className="text-sm text-lavender-300/70 max-w-md mx-auto mt-1">
              This term is currently empty. Add your academic modules, syllabus outline, notes, and lecture links.
            </p>
          </div>
          <button
            onClick={handleOpenAddSubject}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-sm inline-flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-stargold-400/20"
          >
            <Plus size={18} />
            Add First Subject to Term {activeTermNumber}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {termSubjects.map((subj) => {
            const completion = subj.completionPercentage ?? (currentTerm.status === 'completed' ? 100 : 50);

            return (
              <div
                key={subj.id}
                onClick={() => {
                  sound.playCardClick();
                  onSelectSubject(subj);
                }}
                className="glass-panel rounded-3xl p-6 border border-lavender-400/20 hover:border-stargold-400/50 bg-gradient-to-b from-midnight-900/60 to-space-950/80 transition-all duration-300 hover:scale-[1.02] cursor-pointer group flex flex-col justify-between relative overflow-hidden"
              >
                {/* Accent top color gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${subj.color || 'from-purple-500 to-pink-600'}`} />

                <div>
                  {/* Subject Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${subj.color || 'from-purple-500 to-pink-600'} flex items-center justify-center text-white shadow-md font-bold text-sm shrink-0`}>
                        {subj.code.slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-stargold-300 tracking-wider">
                          {subj.code} • {subj.credits} Credits
                        </span>
                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-stargold-200 transition-colors line-clamp-1">
                          {subj.name}
                        </h3>
                      </div>
                    </div>

                    {/* Action buttons (Edit, Move, Delete) */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playCardClick();
                          setMovingSubject(subj);
                        }}
                        title="Move to another term"
                        className="p-1.5 rounded-lg text-lavender-300 hover:text-stargold-300 hover:bg-lavender-500/20 transition-colors"
                      >
                        <ArrowRightLeft size={14} />
                      </button>
                      <button
                        onClick={(e) => handleOpenEditSubject(subj, e)}
                        title="Edit Subject"
                        className="p-1.5 rounded-lg text-lavender-300 hover:text-white hover:bg-lavender-500/20 transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSubjectConfirm(subj.id, e)}
                        title="Delete Subject"
                        className="p-1.5 rounded-lg text-lavender-300 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Professor / Description */}
                  {subj.professor && (
                    <p className="text-xs text-lavender-300/90 font-medium mb-1.5">
                      Prof. {subj.professor}
                    </p>
                  )}
                  <p className="text-xs text-lavender-300/70 line-clamp-2 leading-relaxed mb-4">
                    {subj.description}
                  </p>

                  {/* Syllabus tags preview */}
                  {subj.syllabus && subj.syllabus.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {subj.syllabus.slice(0, 3).map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-lavender-500/10 border border-lavender-400/20 text-[10px] text-lavender-200 truncate max-w-[150px]"
                        >
                          {topic}
                        </span>
                      ))}
                      {subj.syllabus.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-lavender-500/10 text-[10px] text-lavender-300">
                          +{subj.syllabus.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Progress bar & Enter Subject CTA */}
                <div className="pt-3 border-t border-lavender-400/15">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-lavender-300/70">Mastery Progress</span>
                    <span className="font-mono font-bold text-stargold-300">{completion}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-midnight-950 overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-stargold-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-lavender-300 group-hover:text-stargold-200 transition-colors font-medium">
                    <span>Open Subject Hub (9 Tabs)</span>
                    <ChevronRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-lavender-400/30 bg-midnight-900/95 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-lavender-400/20">
              <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                <Sparkles size={20} className="text-stargold-300" />
                {editingSubject ? 'Edit Subject' : `Add Subject to Term ${activeTermNumber}`}
              </h3>
              <button
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="text-lavender-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Management, Microeconomics"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-950/70 border border-lavender-400/30 text-white placeholder-lavender-400/50 focus:outline-none focus:border-stargold-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-200 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PM205"
                    value={subCode}
                    onChange={(e) => setSubCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-midnight-950/70 border border-lavender-400/30 text-white placeholder-lavender-400/50 focus:outline-none focus:border-stargold-400 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-lavender-200 mb-1">
                    Academic Credits
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={subCredits}
                    onChange={(e) => setSubCredits(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-midnight-950/70 border border-lavender-400/30 text-white placeholder-lavender-400/50 focus:outline-none focus:border-stargold-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">
                  Professor / Instructor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Alistair Ross"
                  value={subProfessor}
                  onChange={(e) => setSubProfessor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight-950/70 border border-lavender-400/30 text-white placeholder-lavender-400/50 focus:outline-none focus:border-stargold-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">
                  Subject Overview Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief synopsis of core topics and learning objectives..."
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-midnight-950/70 border border-lavender-400/30 text-white placeholder-lavender-400/50 focus:outline-none focus:border-stargold-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">
                  Syllabus Outline (One topic per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="RICE Prioritization&#10;MVP Types&#10;Cohort Retention"
                  value={subSyllabus}
                  onChange={(e) => setSubSyllabus(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-midnight-950/70 border border-lavender-400/30 text-white placeholder-lavender-400/50 focus:outline-none focus:border-stargold-400 text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-2">
                  Theme Card Color Accent
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setSubColor(opt.val)}
                      className={`p-2 rounded-xl border text-xs text-left flex items-center gap-2 transition-all ${
                        subColor === opt.val
                          ? 'border-stargold-400 bg-lavender-500/20 text-white font-bold'
                          : 'border-lavender-400/20 text-lavender-300 hover:bg-midnight-800'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${opt.val} shrink-0`} />
                      <span className="truncate text-[11px]">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-lavender-400/20">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-lavender-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-stargold-400 to-amber-500 text-midnight-950 font-bold text-xs hover:scale-105 transition-all shadow-md"
                >
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Move Subject Between Terms Modal */}
      {movingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-lavender-400/30 bg-midnight-900/95 shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <ArrowRightLeft size={18} className="text-stargold-300" />
              Move "{movingSubject.name}"
            </h3>
            <p className="text-xs text-lavender-300">
              Select which term this subject belongs to:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {terms.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleMoveSubjectTerm(t.termNumber)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    movingSubject.termNumber === t.termNumber
                      ? 'border-stargold-400 bg-lavender-500/20 text-white font-bold'
                      : 'border-lavender-400/20 hover:border-stargold-400/50 text-lavender-200'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-stargold-300">Term {t.termNumber}</div>
                  <div className="text-[11px] text-lavender-300/80 capitalize">{t.status.replace('-', ' ')}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setMovingSubject(null)}
                className="px-4 py-1.5 rounded-xl text-xs text-lavender-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
