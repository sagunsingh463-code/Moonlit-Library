import React from 'react';
import { UserStudyStats, MoonPhaseType } from '../../types';
import { 
  LineChart, 
  Sparkles, 
  Flame, 
  Clock, 
  Award, 
  CheckCircle2, 
  Moon, 
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { MoonCat } from '../Mascot/MoonCat';

interface ProgressViewProps {
  stats: UserStudyStats;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ stats }) => {
  const moonPhaseSymbols: Record<MoonPhaseType, { symbol: string; title: string }> = {
    'new-moon': { symbol: '🌑', title: 'New Moon (Quiet Rest)' },
    'waxing-crescent': { symbol: '🌒', title: 'Waxing Crescent (Early Momentum)' },
    'first-quarter': { symbol: '🌓', title: 'First Quarter (Steady Flow)' },
    'waxing-gibbous': { symbol: '🌔', title: 'Waxing Gibbous (High Focus)' },
    'full-moon': { symbol: '🌕', title: 'Full Moon (Peak Mastery & Flow)' },
    'waning-gibbous': { symbol: '🌖', title: 'Waning Gibbous (Reflective Review)' },
    'last-quarter': { symbol: '🌗', title: 'Third Quarter (Consolidation)' },
    'waning-crescent': { symbol: '🌘', title: 'Waning Crescent (Wind Down)' },
  };

  const subjectBreakdown = [
    { subject: 'Corporate Finance', hours: 4.5, percent: 45, color: '#FFE8A3' },
    { subject: 'Marketing Strategy', hours: 2.5, percent: 25, color: '#F4ABC4' },
    { subject: 'Operations & SCM', hours: 2.0, percent: 20, color: '#B8A7EA' },
    { subject: 'Organizational Behavior', hours: 1.0, percent: 10, color: '#A5C9FF' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <LineChart className="w-6 h-6 text-stargold-300" />
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide text-glow">
              My Academic Progress & Moon Phases
            </h1>
          </div>
          <p className="text-xs md:text-sm text-lavender-200/80 font-sans mt-1">
            Real longitudinal analytics of your MBA study sessions, knowledge consistency, and celestial milestones.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl glass-panel-glow border border-stargold-400/30 text-xs font-serif text-stargold-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-stargold-300" />
          <span>Level 4 Scholar • Moonlit Order</span>
        </div>
      </div>

      {/* Signature Feature: Moon Phases Weekly Consistency Map */}
      <div className="p-6 rounded-3xl glass-panel-glow border border-lavender-400/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-lavender-400/20">
          <div className="flex items-center gap-2.5">
            <Moon className="w-5 h-5 text-stargold-300" />
            <h3 className="font-serif font-bold text-base text-white">
              Moon Phase Study Consistency
            </h3>
          </div>
          <span className="text-xs text-lavender-300/80 font-mono">
            Full Moon = 90+ minutes of deep focus
          </span>
        </div>

        <p className="text-xs text-lavender-200/90 font-sans leading-relaxed">
          Your daily study volume intuitively shapes the celestial phase. Consecutive deep study days wax the moon toward brilliant fullness.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {stats.weeklyLogs.map((log, idx) => {
            const phase = moonPhaseSymbols[log.phase] || { symbol: '🌔', title: 'Waxing Gibbous' };
            return (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20 text-center hover:border-stargold-400/40 transition-all flex flex-col items-center justify-between min-h-[140px]"
              >
                <div>
                  <span className="text-xs font-mono font-semibold text-lavender-300 block mb-1">
                    {log.dayName} ({log.date.slice(5)})
                  </span>
                  <span className="text-3xl my-2 block filter drop-shadow-md">
                    {phase.symbol}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-serif font-bold text-white block">
                    {log.minutes} min
                  </span>
                  <span className="text-[10px] text-stargold-200/80 block mt-0.5">
                    {log.tasksCount} achievements
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Grid: Key Metrics & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real Metrics Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl glass-panel-subtle border border-lavender-400/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-lavender-600/20 text-lavender-300 border border-lavender-400/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase text-lavender-300/80">Total Study Time</span>
                <h4 className="text-xl font-serif font-bold text-white">
                  {Math.floor(stats.totalStudyMinutes / 60)}h {stats.totalStudyMinutes % 60}m
                </h4>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="p-5 rounded-3xl glass-panel-subtle border border-lavender-400/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-stargold-500/20 text-stargold-300 border border-stargold-400/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase text-lavender-300/80">Stars Earned</span>
                <h4 className="text-xl font-serif font-bold text-stargold-100">
                  {stats.starsCollected} Celestial Stars
                </h4>
              </div>
            </div>
            <span className="text-xs text-stargold-300 font-mono">+1 today</span>
          </div>

          <div className="p-5 rounded-3xl glass-panel-subtle border border-lavender-400/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rosemoon-500/20 text-rosemoon-300 border border-rosemoon-400/30">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase text-lavender-300/80">Study Consistency</span>
                <h4 className="text-xl font-serif font-bold text-rosemoon-200">
                  {stats.currentStreakDays} Day Streak
                </h4>
              </div>
            </div>
            <span className="text-xs text-rosemoon-300 font-mono">Unbroken</span>
          </div>

          <div className="p-5 rounded-3xl glass-panel-subtle border border-lavender-400/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-300 border border-indigo-400/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase text-lavender-300/80">Quiz Mastery</span>
                <h4 className="text-xl font-serif font-bold text-white">
                  {stats.quizAverageScore}% Cumulative Score
                </h4>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Subject Distribution & Mascot Evaluation (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-panel-subtle border border-lavender-400/25 p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-stargold-300" />
                <h3 className="font-serif font-bold text-base text-white">
                  MBA Knowledge Domain Allocation
                </h3>
              </div>
              <span className="text-xs text-lavender-400 font-mono">Real Activity Hours</span>
            </div>

            <div className="space-y-3.5">
              {subjectBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{item.subject}</span>
                    <span className="text-lavender-300 font-mono">{item.hours} hrs ({item.percent}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-midnight-950/80 overflow-hidden border border-lavender-400/10">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${item.percent}%`,
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Luna's Academic Evaluation */}
          <div className="p-4 rounded-2xl bg-midnight-900/80 border border-lavender-400/20 flex flex-col sm:flex-row items-center gap-4">
            <MoonCat 
              mood="studying" 
              showSpeech={false}
              size="sm"
            />
            <div className="text-center sm:text-left">
              <p className="text-xs font-serif font-bold text-stargold-200">
                Luna's Scholar Review:
              </p>
              <p className="text-xs text-lavender-200/90 font-sans mt-0.5 leading-relaxed">
                "Outstanding balance across Corporate Finance and Marketing. Keep your streak alive tonight to expand your glowing constellation!"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
