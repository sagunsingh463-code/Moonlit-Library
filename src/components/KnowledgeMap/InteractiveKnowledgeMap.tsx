import React, { useState, useEffect, useRef } from 'react';
import { 
  GitBranch, 
  Sparkles, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookOpen, 
  Edit3, 
  Trash2, 
  X,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { KnowledgeNode, SubjectKnowledgeMap } from '../../types';
import { sound } from '../../services/audio';

interface InteractiveKnowledgeMapProps {
  onOpenAiMentor?: (topic: string) => void;
  onNavigate?: (view: any, itemId?: string) => void;
  initialSubjectId?: string;
  compact?: boolean;
}

const STORAGE_MAPS_KEY = 'moonlit_knowledge_maps_v2';

// Authentic MBA Knowledge Maps for Term 2 Subjects
const DEFAULT_MAPS: Record<string, SubjectKnowledgeMap> = {
  'microeconomics': {
    subjectId: 'microeconomics',
    subjectName: 'Microeconomics',
    lastUpdated: new Date().toISOString(),
    nodes: [
      { id: 'm-1', subjectId: 'microeconomics', label: 'Supply & Demand Dynamics', category: 'core', status: 'completed', x: 220, y: 150, connections: ['m-2', 'm-3', 'm-4'], notesSummary: 'Market equilibrium, shift factors, and price determination.' },
      { id: 'm-2', subjectId: 'microeconomics', label: 'Price Elasticity of Demand', category: 'subtopic', status: 'completed', x: 420, y: 80, connections: ['m-5'], notesSummary: 'Inelastic vs Elastic demand, point formula, and total revenue test.' },
      { id: 'm-3', subjectId: 'microeconomics', label: 'Consumer & Producer Surplus', category: 'subtopic', status: 'completed', x: 420, y: 160, connections: ['m-6'], notesSummary: 'Welfare economics, deadweight loss from price ceilings & floors.' },
      { id: 'm-4', subjectId: 'microeconomics', label: 'Cost Curves & Production', category: 'subtopic', status: 'needs_revision', weakScore: 48, x: 420, y: 240, connections: ['m-7'], notesSummary: 'Marginal cost, average total cost, economies of scale.' },
      { id: 'm-5', subjectId: 'microeconomics', label: 'Cross-Price & Income Elasticity', category: 'framework', status: 'completed', x: 640, y: 70, connections: [], notesSummary: 'Substitutes, complements, normal goods, and luxury goods.' },
      { id: 'm-6', subjectId: 'microeconomics', label: 'Tax Incidence & Deadweight Loss', category: 'case_study', status: 'in_progress', x: 640, y: 160, connections: [], notesSummary: 'Per-unit taxation burden between buyers and sellers.' },
      { id: 'm-7', subjectId: 'microeconomics', label: 'Game Theory: Nash Equilibrium', category: 'framework', status: 'needs_revision', weakScore: 42, x: 640, y: 250, connections: [], notesSummary: 'Prisoner’s Dilemma and oligopolistic strategic decision making.' }
    ]
  },
  'product-management': {
    subjectId: 'product-management',
    subjectName: 'Product Management',
    lastUpdated: new Date().toISOString(),
    nodes: [
      { id: 'pm-1', subjectId: 'product-management', label: 'Product Discovery & Strategy', category: 'core', status: 'completed', x: 200, y: 150, connections: ['pm-2', 'pm-3', 'pm-4'], notesSummary: 'Identifying customer pain points and defining value proposition.' },
      { id: 'pm-2', subjectId: 'product-management', label: 'Jobs-To-Be-Done (JTBD)', category: 'framework', status: 'completed', x: 420, y: 80, connections: ['pm-5'], notesSummary: 'Understanding underlying motivations rather than superficial demographic traits.' },
      { id: 'pm-3', subjectId: 'product-management', label: 'Prioritization Frameworks', category: 'subtopic', status: 'completed', x: 420, y: 160, connections: ['pm-6'], notesSummary: 'RICE (Reach, Impact, Confidence, Effort) and MoSCoW matrices.' },
      { id: 'pm-4', subjectId: 'product-management', label: 'Product Requirement Doc (PRD)', category: 'framework', status: 'completed', x: 420, y: 240, connections: ['pm-7'], notesSummary: 'User stories, acceptance criteria, technical constraints, release milestones.' },
      { id: 'pm-5', subjectId: 'product-management', label: 'MVP Scoping & Hypothesis Testing', category: 'subtopic', status: 'in_progress', x: 650, y: 80, connections: [], notesSummary: 'Smoke tests, concierge MVPs, landing page validation.' },
      { id: 'pm-6', subjectId: 'product-management', label: 'North Star Metric & KPIs', category: 'framework', status: 'needs_revision', weakScore: 50, x: 650, y: 160, connections: [], notesSummary: 'Leading vs lagging indicators, retention cohorts, AARRR funnel.' },
      { id: 'pm-7', subjectId: 'product-management', label: 'Go-To-Market (GTM) Strategy', category: 'case_study', status: 'needs_revision', weakScore: 45, x: 650, y: 240, connections: [], notesSummary: 'Product-led growth (PLG) vs sales-led growth, launch playbook.' }
    ]
  },
  'ui-ux': {
    subjectId: 'ui-ux',
    subjectName: 'Introduction to UI/UX',
    lastUpdated: new Date().toISOString(),
    nodes: [
      { id: 'ux-1', subjectId: 'ui-ux', label: 'Design Thinking Process', category: 'core', status: 'completed', x: 220, y: 150, connections: ['ux-2', 'ux-3', 'ux-4'], notesSummary: '5 stages: Empathize, Define, Ideate, Prototype, Test.' },
      { id: 'ux-2', subjectId: 'ui-ux', label: 'Nielsen’s 10 Usability Heuristics', category: 'framework', status: 'completed', x: 430, y: 80, connections: ['ux-5'], notesSummary: 'Visibility of system status, match with real world, error prevention.' },
      { id: 'ux-3', subjectId: 'ui-ux', label: 'Information Architecture (IA)', category: 'subtopic', status: 'completed', x: 430, y: 160, connections: ['ux-6'], notesSummary: 'Site maps, hierarchy, card sorting, navigation flows.' },
      { id: 'ux-4', subjectId: 'ui-ux', label: 'Wireframing & Prototyping', category: 'subtopic', status: 'in_progress', x: 430, y: 240, connections: ['ux-7'], notesSummary: 'Low-fidelity paper prototypes to interactive high-fidelity Figma components.' },
      { id: 'ux-5', subjectId: 'ui-ux', label: 'Cognitive Load & Hick’s Law', category: 'framework', status: 'needs_revision', weakScore: 40, x: 650, y: 80, connections: [], notesSummary: 'Minimizing choice overload and progressive disclosure.' },
      { id: 'ux-6', subjectId: 'ui-ux', label: 'Usability Testing & Moderation', category: 'case_study', status: 'completed', x: 650, y: 160, connections: [], notesSummary: 'Think-aloud protocol, task completion rates, System Usability Scale (SUS).' },
      { id: 'ux-7', subjectId: 'ui-ux', label: 'Accessibility (WCAG 2.1 AA)', category: 'framework', status: 'needs_revision', weakScore: 44, x: 650, y: 240, connections: [], notesSummary: 'Color contrast ratio 4.5:1, keyboard navigation, screen reader ARIA.' }
    ]
  },
  'leadership': {
    subjectId: 'leadership',
    subjectName: 'Leadership Accelerator',
    lastUpdated: new Date().toISOString(),
    nodes: [
      { id: 'ld-1', subjectId: 'leadership', label: 'Situational Leadership Model', category: 'core', status: 'completed', x: 220, y: 150, connections: ['ld-2', 'ld-3'], notesSummary: 'Directing, Coaching, Supporting, and Delegating (Hersey-Blanchard).' },
      { id: 'ld-2', subjectId: 'leadership', label: 'Transformational Leadership', category: 'framework', status: 'completed', x: 440, y: 100, connections: ['ld-4'], notesSummary: 'Inspirational motivation, intellectual stimulation, idealized influence.' },
      { id: 'ld-3', subjectId: 'leadership', label: 'Psychological Safety & Trust', category: 'subtopic', status: 'in_progress', x: 440, y: 200, connections: ['ld-5'], notesSummary: 'Amy Edmondson’s research on team error-reporting and vulnerability.' },
      { id: 'ld-4', subjectId: 'leadership', label: 'Executive Stakeholder Management', category: 'case_study', status: 'completed', x: 660, y: 100, connections: [], notesSummary: 'Power-interest matrix, alignment meetings, handling resistance.' },
      { id: 'ld-5', subjectId: 'leadership', label: 'Crucial Conversations & Conflict', category: 'framework', status: 'needs_revision', weakScore: 46, x: 660, y: 200, connections: [], notesSummary: 'State facts, share story, ask for others paths, talk tentatively.' }
    ]
  }
};

export const InteractiveKnowledgeMap: React.FC<InteractiveKnowledgeMapProps> = ({
  onOpenAiMentor,
  onNavigate,
  initialSubjectId = 'microeconomics',
  compact = false
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubjectId);
  const [maps, setMaps] = useState<Record<string, SubjectKnowledgeMap>>(() => {
    if (typeof window === 'undefined') return DEFAULT_MAPS;
    try {
      const saved = localStorage.getItem(STORAGE_MAPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MAPS;
  });

  const [activeNode, setActiveNode] = useState<KnowledgeNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState<boolean>(false);
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeNode['category']>('subtopic');
  const [newSummary, setNewSummary] = useState('');
  const [parentConnection, setParentConnection] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MAPS_KEY, JSON.stringify(maps));
    } catch {}
  }, [maps]);

  const currentMap = maps[selectedSubject] || maps['microeconomics'];
  const nodes = currentMap?.nodes || [];

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(0.6, Math.min(1.6, prev + delta)));
  };

  const handleResetZoom = () => setZoomLevel(1);

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    sound.playSparkle();
    const newNodeId = `node-${Date.now()}`;
    const parentNode = nodes.find(n => n.id === parentConnection);

    const newNode: KnowledgeNode = {
      id: newNodeId,
      subjectId: selectedSubject,
      label: newLabel.trim(),
      category: newCategory,
      status: 'in_progress',
      x: parentNode ? parentNode.x + 180 : 350,
      y: parentNode ? parentNode.y + (Math.random() * 80 - 40) : 150,
      notesSummary: newSummary.trim() || 'Custom MBA knowledge concept added by student.',
      connections: []
    };

    setMaps(prev => {
      const mapCopy = { ...prev[selectedSubject] };
      let updatedNodes = [...mapCopy.nodes, newNode];

      if (parentNode) {
        updatedNodes = updatedNodes.map(n => {
          if (n.id === parentNode.id) {
            return { ...n, connections: [...n.connections, newNodeId] };
          }
          return n;
        });
      }

      mapCopy.nodes = updatedNodes;
      mapCopy.lastUpdated = new Date().toISOString();

      return { ...prev, [selectedSubject]: mapCopy };
    });

    setNewLabel('');
    setNewSummary('');
    setIsAddNodeOpen(false);
  };

  const handleToggleStatus = (nodeId: string) => {
    sound.playSparkle();
    setMaps(prev => {
      const mapCopy = { ...prev[selectedSubject] };
      mapCopy.nodes = mapCopy.nodes.map(n => {
        if (n.id === nodeId) {
          const nextStatus = n.status === 'completed' ? 'needs_revision' : n.status === 'needs_revision' ? 'in_progress' : 'completed';
          return { ...n, status: nextStatus };
        }
        return n;
      });
      return { ...prev, [selectedSubject]: mapCopy };
    });

    if (activeNode && activeNode.id === nodeId) {
      setActiveNode(prev => prev ? {
        ...prev,
        status: prev.status === 'completed' ? 'needs_revision' : prev.status === 'needs_revision' ? 'in_progress' : 'completed'
      } : null);
    }
  };

  const getNodeColor = (status: KnowledgeNode['status']) => {
    switch (status) {
      case 'completed': return { fill: '#14281E', stroke: '#10B981', text: '#34D399', badge: 'Completed' };
      case 'needs_revision': return { fill: '#2E1911', stroke: '#F59E0B', text: '#FBBF24', badge: 'Needs Revision' };
      default: return { fill: '#1B1C2A', stroke: '#818CF8', text: '#A5B4FC', badge: 'In Progress' };
    }
  };

  if (compact) {
    return (
      <div className="glass-panel p-5 rounded-2xl border border-amber-600/30 bg-[#161412]/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-bold text-sm text-[#f4ebe1]">
              Knowledge Map • {currentMap.subjectName}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-300">
            {nodes.filter(n => n.status === 'completed').length}/{nodes.length} Concepts
          </span>
        </div>

        {/* Mini Node Graph Preview */}
        <div className="relative h-28 rounded-xl bg-[#12100e] border border-amber-800/20 overflow-hidden flex items-center justify-center p-2">
          <svg viewBox="0 0 400 120" className="w-full h-full">
            {/* Draw links */}
            <line x1="80" y1="60" x2="180" y2="35" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <line x1="80" y1="60" x2="180" y2="85" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <line x1="180" y1="35" x2="300" y2="35" stroke="#10B981" strokeWidth="1.5" opacity="0.7" />
            <line x1="180" y1="85" x2="300" y2="85" stroke="#F59E0B" strokeWidth="1.5" opacity="0.7" />

            {/* Nodes */}
            <circle cx="80" cy="60" r="18" fill="#2E1C12" stroke="#D4AF37" strokeWidth="2" />
            <text x="80" y="64" fill="#D4AF37" fontSize="9" textAnchor="middle" fontWeight="bold">CORE</text>

            <circle cx="180" cy="35" r="14" fill="#14281E" stroke="#10B981" strokeWidth="1.5" />
            <text x="180" y="38" fill="#34D399" fontSize="8" textAnchor="middle">TOPIC</text>

            <circle cx="180" cy="85" r="14" fill="#2E1911" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="180" y="88" fill="#FBBF24" fontSize="8" textAnchor="middle">REVISE</text>

            <circle cx="300" cy="35" r="12" fill="#14281E" stroke="#10B981" strokeWidth="1.5" />
            <circle cx="300" cy="85" r="12" fill="#2E1911" stroke="#F59E0B" strokeWidth="1.5" />
          </svg>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('knowledge-map')}
          className="w-full text-center py-2 text-xs font-serif text-amber-300 hover:text-amber-100 flex items-center justify-center gap-1 transition-colors border-t border-amber-800/20 pt-2.5"
        >
          <span>Explore Interactive Knowledge Tree</span>
          <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-600/30 bg-gradient-to-r from-[#1c1713] via-[#261f19] to-[#1c1713] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-200 text-xs font-serif">
              <GitBranch size={14} />
              <span>Visual Academic Concept Tree</span>
              <span>•</span>
              <span>Concept Linkage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#f4ebe1] text-glow">
              Interactive Knowledge Map ˚୨୧⋆｡˚
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-sans leading-relaxed">
              Explore structural relationships between core MBA frameworks, subtopics, and case studies. Click any concept to practice with Luna AI Exam Mentor!
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddNodeOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 text-xs font-serif font-bold shadow-lg shadow-amber-900/30 hover:brightness-110 flex items-center gap-2 transition-all"
            >
              <Plus size={15} />
              <span>Add Concept Node</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {Object.keys(maps).map(key => (
          <button
            key={key}
            onClick={() => {
              sound.playSparkle();
              setSelectedSubject(key);
              setActiveNode(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-all ${
              selectedSubject === key
                ? 'bg-amber-600 text-stone-950 shadow-md'
                : 'bg-[#221e1a] text-stone-400 hover:text-white border border-amber-800/25'
            }`}
          >
            {maps[key].subjectName}
          </button>
        ))}
      </div>

      {/* Main Canvas + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Graph Canvas (2 Columns) */}
        <div className="lg:col-span-2 glass-panel p-4 rounded-3xl border border-amber-700/30 bg-[#12100e] relative min-h-[460px] flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Zoom Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#1b1714]/80 p-1.5 rounded-xl border border-amber-700/30">
            <button
              onClick={() => handleZoom(0.1)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw size={16} />
            </button>
            <span className="text-[10px] font-mono text-amber-300 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          {/* SVG Graph View */}
          <div className="w-full h-full min-h-[420px] flex items-center justify-center overflow-auto cursor-grab active:cursor-grabbing">
            <svg 
              viewBox="0 0 850 350" 
              className="w-full h-full min-h-[380px] transition-transform duration-300"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Render Connection Lines */}
              {nodes.map(node => (
                <React.Fragment key={`lines-${node.id}`}>
                  {node.connections.map(targetId => {
                    const targetNode = nodes.find(n => n.id === targetId);
                    if (!targetNode) return null;
                    const isTargetWeak = targetNode.status === 'needs_revision';
                    return (
                      <g key={`${node.id}->${targetId}`}>
                        <line
                          x1={node.x}
                          y1={node.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={isTargetWeak ? '#F59E0B' : '#D4AF37'}
                          strokeWidth={isTargetWeak ? '2.5' : '1.5'}
                          strokeDasharray={isTargetWeak ? '4 3' : 'none'}
                          opacity={isTargetWeak ? 0.9 : 0.45}
                        />
                      </g>
                    );
                  })}
                </React.Fragment>
              ))}

              {/* Render Node Circles & Labels */}
              {nodes.map(node => {
                const colors = getNodeColor(node.status);
                const isSelected = activeNode?.id === node.id;
                const isCore = node.category === 'core';
                const r = isCore ? 28 : 22;

                return (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => {
                      sound.playSparkle();
                      setActiveNode(node);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Node Glow Halo */}
                    <circle
                      r={r + (isSelected ? 8 : 4)}
                      fill={colors.stroke}
                      opacity={isSelected ? 0.35 : 0.1}
                      className={node.status === 'needs_revision' ? 'animate-pulse' : ''}
                    />

                    {/* Main Node Body */}
                    <circle
                      r={r}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all group-hover:scale-105"
                    />

                    {/* Node Icon / Initial */}
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill={colors.text}
                      fontSize={isCore ? '12' : '10'}
                      fontWeight="bold"
                      fontFamily="serif"
                    >
                      {node.category === 'core' ? 'CORE' : 
                       node.category === 'framework' ? 'FRM' :
                       node.category === 'case_study' ? 'CASE' : 'TOPIC'}
                    </text>

                    {/* Node Label Text */}
                    <text
                      textAnchor="middle"
                      dy={r + 14}
                      fill="#F4EBE1"
                      fontSize="10"
                      fontFamily="sans-serif"
                      fontWeight="500"
                      className="pointer-events-none drop-shadow-md"
                    >
                      {node.label.length > 20 ? `${node.label.slice(0, 18)}...` : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Canvas Bottom Legend */}
          <div className="flex items-center gap-4 text-[11px] font-sans text-stone-400 pt-2 border-t border-amber-900/20">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Mastered</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>In Progress</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Needs Revision (Weak)</span>
            </span>
          </div>
        </div>

        {/* Concept Inspector Panel (1 Column) */}
        <div className="glass-panel p-5 rounded-3xl border border-amber-700/30 bg-[#161412]/80 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
              <h3 className="font-serif font-bold text-sm text-[#f4ebe1]">
                Concept Inspector
              </h3>
              {activeNode && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  activeNode.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/40' :
                  activeNode.status === 'needs_revision' ? 'bg-amber-950 text-amber-300 border border-amber-600/40' :
                  'bg-indigo-950 text-indigo-300 border border-indigo-700/40'
                }`}>
                  {getNodeColor(activeNode.status).badge}
                </span>
              )}
            </div>

            {activeNode ? (
              <div className="space-y-4 pt-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">
                    {activeNode.category.replace('_', ' ')}
                  </span>
                  <h4 className="text-base font-serif font-bold text-white mt-0.5">
                    {activeNode.label}
                  </h4>
                </div>

                <div className="p-3 rounded-2xl bg-[#1c1815] border border-amber-800/20 text-stone-300 leading-relaxed font-sans">
                  {activeNode.notesSummary}
                </div>

                {activeNode.weakScore && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold block">ARCADE WEAK RETENTION</span>
                      <span className="text-xs text-amber-200">Score: {activeNode.weakScore}% retention</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300 px-2 py-1 rounded bg-amber-900/50">
                      High Priority
                    </span>
                  </div>
                )}

                {/* Status Toggle Button */}
                <button
                  onClick={() => handleToggleStatus(activeNode.id)}
                  className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
                >
                  Cycle Status: {getNodeColor(activeNode.status).badge} → Next
                </button>
              </div>
            ) : (
              <div className="py-12 text-center text-stone-400 space-y-2 text-xs">
                <BookOpen size={24} className="mx-auto text-amber-400/40" />
                <p>Click any node in the knowledge map to inspect its MBA concept summary, formula notes, and review status.</p>
              </div>
            )}
          </div>

          {/* AI Mentor Action Button */}
          {activeNode && (
            <div className="pt-4 border-t border-amber-900/20 space-y-2">
              <button
                onClick={() => {
                  sound.playCelestialChime();
                  if (onOpenAiMentor) {
                    onOpenAiMentor(activeNode.label);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-serif font-bold text-xs shadow-lg shadow-amber-900/30 hover:brightness-110 flex items-center justify-center gap-2 transition-all"
              >
                <Bot size={15} />
                <span>Practice with AI Exam Mentor</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Concept Node Modal */}
      {isAddNodeOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-amber-600/40 bg-[#1c1815] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-800/30">
              <h3 className="font-serif font-bold text-base text-[#f4ebe1]">
                Add Concept Node to {currentMap.subjectName}
              </h3>
              <button
                onClick={() => setIsAddNodeOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNode} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Concept Title
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Price Discrimination & Consumer Tiers"
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Category Type
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="core">Core Pillar</option>
                  <option value="subtopic">Subtopic / Principle</option>
                  <option value="framework">Framework / Model</option>
                  <option value="case_study">Case Study / Application</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Connect to Parent Concept
                </label>
                <select
                  value={parentConnection}
                  onChange={(e) => setParentConnection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="">No Direct Parent (Root Concept)</option>
                  {nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label} ({n.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Brief Summary / Key Formula
                </label>
                <textarea
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  rows={3}
                  placeholder="Summarize the core mechanism or formula..."
                  className="w-full px-3 py-2 rounded-xl bg-[#12100e] border border-amber-700/30 text-stone-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddNodeOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold hover:brightness-110"
                >
                  Save Concept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
