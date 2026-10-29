import React, { useState, useRef } from 'react';
import { AssignmentItem, FileItem } from '../../types';
import { 
  FileCheck2, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Paperclip, 
  Trash2, 
  Sparkles, 
  Award,
  Upload,
  Edit3,
  FileText,
  Download,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../services/audio';

interface AssignmentsViewProps {
  assignments: AssignmentItem[];
  availableFiles?: FileItem[];
  onSaveAssignment: (assignment: AssignmentItem) => Promise<void>;
  onDeleteAssignment: (id: string) => Promise<void>;
  onSubmitAssignment: (id: string, notes: string, fileName?: string, fileUrl?: string) => Promise<void>;
  onGradeAssignment?: (id: string, grade: string, feedback?: string) => Promise<void>;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  assignments,
  availableFiles = [],
  onSaveAssignment,
  onDeleteAssignment,
  onSubmitAssignment,
  onGradeAssignment
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentItem | null>(null);
  const [submittingAssignment, setSubmittingAssignment] = useState<AssignmentItem | null>(null);
  const [gradingAssignment, setGradingAssignment] = useState<AssignmentItem | null>(null);
  
  // Assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Corporate Finance');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<AssignmentItem['priority']>('high');
  const [newWeightage, setNewWeightage] = useState('20% of Term Grade');

  // Submission form state
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [selectedVaultFileId, setSelectedVaultFileId] = useState<string>('');
  const submissionFileInputRef = useRef<HTMLInputElement | null>(null);

  // Grade form state
  const [gradeInput, setGradeInput] = useState('A (95/100)');
  const [gradeFeedback, setGradeFeedback] = useState('Comprehensive analysis and clear strategic rationale.');

  const filtered = assignments.filter(a => {
    if (selectedStatus === 'all') return true;
    return a.status === selectedStatus;
  });

  const handleOpenAddModal = () => {
    setEditingAssignment(null);
    setNewTitle('');
    setNewSubject('Corporate Finance');
    setNewDescription('');
    setNewDueDate('');
    setNewPriority('high');
    setNewWeightage('20% of Term Grade');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (asg: AssignmentItem) => {
    setEditingAssignment(asg);
    setNewTitle(asg.title);
    setNewSubject(asg.subject);
    setNewDescription(asg.description);
    setNewDueDate(asg.dueDate ? asg.dueDate.split('T')[0] : '');
    setNewPriority(asg.priority);
    setNewWeightage(asg.weightage || '20% of Term Grade');
    setShowAddModal(true);
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const asgItem: AssignmentItem = {
      id: editingAssignment ? editingAssignment.id : `asg-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      description: newDescription,
      dueDate: newDueDate ? new Date(newDueDate).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
      priority: newPriority,
      status: editingAssignment ? editingAssignment.status : 'pending',
      weightage: newWeightage,
      grade: editingAssignment ? editingAssignment.grade : undefined,
      submissionNotes: editingAssignment ? editingAssignment.submissionNotes : undefined,
      submittedFileName: editingAssignment ? editingAssignment.submittedFileName : undefined,
      submittedAt: editingAssignment ? editingAssignment.submittedAt : undefined
    };

    await onSaveAssignment(asgItem);
    sound.playSparkle();
    setShowAddModal(false);
    setEditingAssignment(null);
  };

  const handleFileUploadForSubmission = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFileName(file.name);
    }
  };

  const handleConfirmSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment) return;

    let finalFileName = attachedFileName;
    let finalFileUrl: string | undefined = undefined;

    if (selectedVaultFileId) {
      const vaultFile = availableFiles.find(f => f.id === selectedVaultFileId);
      if (vaultFile) {
        finalFileName = vaultFile.name;
        finalFileUrl = vaultFile.serverUrl;
      }
    }

    await onSubmitAssignment(
      submittingAssignment.id,
      submissionNotes,
      finalFileName || 'Final_MBA_Deliverable.pdf',
      finalFileUrl
    );

    sound.playCelestialChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFE8A3', '#B8A7EA', '#F4ABC4', '#A5C9FF']
    });

    setSubmittingAssignment(null);
    setSubmissionNotes('');
    setAttachedFileName('');
    setSelectedVaultFileId('');
  };

  const handleConfirmGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingAssignment || !onGradeAssignment) return;

    await onGradeAssignment(gradingAssignment.id, gradeInput, gradeFeedback);
    sound.playSparkle();
    setGradingAssignment(null);
  };

  const getPriorityBadge = (priority: AssignmentItem['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Medium Priority</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Normal</span>;
    }
  };

  const getStatusBadge = (status: AssignmentItem['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Submitted</span>;
      case 'graded':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Graded</span>;
      case 'in-progress':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stargold-500/20 text-stargold-300 border border-stargold-500/30">In Progress</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-lavender-500/20 text-lavender-300 border border-lavender-500/30">Pending</span>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-6 h-6 text-rosemoon-300" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              Assignments & Deliverables
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            Create case analyses, turn in deliverables with file attachments, and record academic evaluations.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rosemoon-500 to-indigo-600 text-white font-serif font-bold text-xs shadow-md hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-lavender-400/20 pb-3 overflow-x-auto text-xs">
        {['all', 'pending', 'in-progress', 'submitted', 'graded'].map(st => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl font-medium capitalize whitespace-nowrap transition-all ${
              selectedStatus === st
                ? 'bg-lavender-600 text-white shadow-sm'
                : 'glass-panel-subtle text-lavender-300 hover:text-white'
            }`}
          >
            {st} ({st === 'all' ? assignments.length : assignments.filter(a => a.status === st).length})
          </button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filtered.map(asg => {
          const isSubmitted = asg.status === 'submitted' || asg.status === 'graded';
          return (
            <div
              key={asg.id}
              className="p-5 rounded-3xl glass-panel-subtle border border-lavender-400/20 hover:border-lavender-400/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stargold-300">
                    {asg.subject}
                  </span>
                  {getPriorityBadge(asg.priority)}
                  {getStatusBadge(asg.status)}
                  {asg.weightage && (
                    <span className="text-[10px] text-lavender-300 font-mono">
                      • {asg.weightage}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-base text-white">
                  {asg.title}
                </h3>

                <p className="text-xs text-lavender-200/90 font-sans mt-1 line-clamp-2">
                  {asg.description}
                </p>

                {/* Submissions & Grade Info Card */}
                {asg.submittedFileName && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-midnight-950/60 border border-lavender-400/15 flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-lavender-200 font-mono">
                      <Paperclip className="w-3.5 h-3.5 text-stargold-300" />
                      <span>{asg.submittedFileName}</span>
                    </span>
                    {asg.submittedAt && (
                      <span className="text-[10px] text-lavender-400">
                        Turned in: {new Date(asg.submittedAt).toLocaleString()}
                      </span>
                    )}
                    {asg.submissionNotes && (
                      <span className="text-[11px] text-lavender-300/80 italic w-full">
                        "{asg.submissionNotes}"
                      </span>
                    )}
                  </div>
                )}

                {asg.grade && (
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-400/40 text-emerald-200 text-xs font-serif font-bold">
                    <Award className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Grade Received: {asg.grade}</span>
                    {asg.gradeFeedback && <span className="text-[11px] font-sans font-normal text-emerald-300">({asg.gradeFeedback})</span>}
                  </div>
                )}
              </div>

              {/* Action Column */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 flex-shrink-0">
                <div className="text-right text-[11px] font-mono text-lavender-300">
                  <span className="flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5 text-stargold-300" />
                    Due: {new Date(asg.dueDate).toLocaleDateString()}
                  </span>
                </div>

                {!isSubmitted ? (
                  <button
                    onClick={() => {
                      setSubmittingAssignment(asg);
                      setSubmissionNotes(asg.submissionNotes || '');
                      setAttachedFileName('');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110 flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Turn In / Submit</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setGradingAssignment(asg);
                        setGradeInput(asg.grade || 'A (95/100)');
                        setGradeFeedback(asg.gradeFeedback || '');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-midnight-900 border border-lavender-400/30 text-stargold-200 text-xs hover:bg-white/5"
                      title="Record Grade & Feedback"
                    >
                      {asg.grade ? 'Edit Grade' : 'Record Grade'}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleOpenEditModal(asg)}
                  className="p-2 text-lavender-400 hover:text-white transition-colors"
                  title="Edit assignment"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteAssignment(asg.id)}
                  className="p-2 text-lavender-400 hover:text-red-400 transition-colors"
                  title="Delete assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center glass-panel-subtle rounded-3xl border border-lavender-400/20 text-lavender-400 text-xs">
            No assignments match this filter.
          </div>
        )}
      </div>

      {/* Add / Edit Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-book-open">
          <div className="w-full max-w-lg p-6 rounded-3xl glass-panel-glow border border-lavender-400/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingAssignment ? 'Edit MBA Assignment' : 'Add MBA Assignment'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-lavender-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Valuation Analysis: Apple Capital Allocation"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as AssignmentItem['priority'])}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">Weightage</label>
                  <input
                    type="text"
                    value={newWeightage}
                    onChange={(e) => setNewWeightage(e.target.value)}
                    placeholder="25% of Term Grade"
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Outline case deliverables and requirements..."
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-lavender-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-rosemoon-500 to-indigo-600 text-white font-serif font-bold text-xs shadow-md hover:brightness-110"
                >
                  {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-book-open">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel-glow border border-stargold-400/40 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-stargold-300" />
                <h3 className="font-serif font-bold text-lg text-white">Turn In Assignment</h3>
              </div>
              <button onClick={() => setSubmittingAssignment(null)} className="text-lavender-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmission} className="space-y-4">
              <p className="text-xs text-lavender-200">
                Submitting <strong className="text-white">{submittingAssignment.title}</strong>
              </p>

              {/* Option 1: Attach file from My Files */}
              {availableFiles.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-lavender-300 mb-1">
                    Select File from Vault (Optional)
                  </label>
                  <select
                    value={selectedVaultFileId}
                    onChange={(e) => {
                      setSelectedVaultFileId(e.target.value);
                      const f = availableFiles.find(item => item.id === e.target.value);
                      if (f) setAttachedFileName(f.name);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none"
                  >
                    <option value="">-- Choose from uploaded files --</option>
                    {availableFiles.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.category})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Option 2: Upload new document directly */}
              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">
                  Or Upload New Submission File
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={attachedFileName}
                    onChange={(e) => setAttachedFileName(e.target.value)}
                    placeholder="e.g. Seraphina_Valuation_Model.xlsx"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                  />
                  <button
                    type="button"
                    onClick={() => submissionFileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl glass-panel text-xs text-lavender-200 hover:text-white"
                  >
                    Browse
                  </button>
                  <input
                    ref={submissionFileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileUploadForSubmission}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Submission Notes & Remarks</label>
                <textarea
                  rows={3}
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  placeholder="Summarize key assumptions, DCF findings, or methodology..."
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-stargold-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-lavender-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-stargold-500 to-amber-500 text-midnight-950 font-serif font-bold text-xs shadow-star-glow hover:brightness-110"
                >
                  Submit & Ignite Star ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Recording Modal */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-sm animate-book-open">
          <div className="w-full max-w-md p-6 rounded-3xl glass-panel-glow border border-emerald-400/40 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif font-bold text-lg text-white">Record Grade & Evaluation</h3>
              <button onClick={() => setGradingAssignment(null)} className="text-lavender-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Grade Earned</label>
                <input
                  type="text"
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  placeholder="e.g. A+ (98/100) or High Honors"
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-300 mb-1">Faculty Feedback</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Write evaluator remarks or key learnings..."
                  className="w-full px-3.5 py-2 rounded-xl bg-midnight-900 border border-lavender-400/30 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingAssignment(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-lavender-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-serif font-bold text-xs shadow-md hover:brightness-110"
                >
                  Save Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
