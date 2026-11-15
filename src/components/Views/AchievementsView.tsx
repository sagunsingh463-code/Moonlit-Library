import React from 'react';
import { AchievementItem } from '../../types';
import { 
  Award, 
  Sparkles, 
  Star, 
  Flame, 
  CheckCircle2, 
  Lock, 
  GraduationCap, 
  Moon, 
  Video, 
  Gamepad2,
  BookOpen
} from 'lucide-react';
import { sound } from '../../services/sound';
import { ShagunAnimeGirl } from '../Mascot/ShagunAnimeGirl';

interface AchievementsViewProps {
  achievements: AchievementItem[];
  userStars: number;
  userStreak: number;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  userStars,
  userStreak
}) => {
  const totalXp = achievements.reduce((acc, a) => acc + (a.unlocked ? a.xpReward : 0), 0);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'sparkles': return <Sparkles size={24} className="text-stargold-300" />;
      case 'award': return <Award size={24} className="text-amber-400" />;
      case 'moon': return <Moon size={24} className="text-lavender-300" />;
      case 'graduation-cap': return <GraduationCap size={24} className="text-purple-400" />;
      case 'video': return <Video size={24} className="text-pink-400" />;
      case 'flame': return <Flame size={24} className="text-amber-400" />;
      default: return <Star size={24} className="text-stargold-300" />;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-lavender-400/20 bg-gradient-to-r from-space-900/90 via-midnight-800/80 to-space-900/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lavender-500/10 border border-lavender-400/30 text-stargold-300 text-xs font-serif uppercase tracking-wider mb-2">
              <Award size={14} />
              Celestial Milestones & Badges
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
              MBA Achievements & Badges
            </h1>
            <p className="text-xs sm:text-sm text-lavender-300/80 mt-1 max-w-2xl font-sans">
              Unlock prestigious academic titles and badges as you master MBA modules and Moonlight Arcade games.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <ShagunAnimeGirl 
              mood="celebrating" 
              size="md" 
              showSpeech={true}
              customMessage="Every badge honors your dedication! Look how brightly your constellation glows 🌟"
            />
            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-midnight-950/70 border border-stargold-400/30 text-center">
                <div className="text-[10px] text-lavender-400 uppercase font-mono">Total XP</div>
                <div className="text-2xl font-serif font-bold text-stargold-300">+{totalXp} XP</div>
              </div>
              <div className="p-4 rounded-2xl bg-midnight-950/70 border border-lavender-400/30 text-center">
                <div className="text-[10px] text-lavender-400 uppercase font-mono">Unlocked</div>
                <div className="text-2xl font-serif font-bold text-white">
                  {unlockedCount} / {achievements.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((item) => {
          const percent = Math.min(100, Math.round((item.progress / item.maxProgress) * 100));

          return (
            <div
              key={item.id}
              onClick={() => sound.playCardClick()}
              className={`glass-panel p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group hover:scale-[1.02] ${
                item.unlocked
                  ? 'border-stargold-400/50 bg-gradient-to-b from-midnight-900/80 to-space-950/90 shadow-lg shadow-stargold-400/10'
                  : 'border-lavender-400/15 bg-midnight-950/40 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                    item.unlocked ? 'bg-lavender-500/20 border border-stargold-400/40' : 'bg-midnight-900 border border-lavender-400/20 text-slate-500'
                  }`}>
                    {item.unlocked ? getBadgeIcon(item.icon) : <Lock size={20} className="text-slate-500" />}
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    item.unlocked ? 'bg-stargold-400/20 text-stargold-300 border border-stargold-400/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    +{item.xpReward} XP
                  </span>
                </div>

                <h3 className={`text-lg font-serif font-bold ${item.unlocked ? 'text-white group-hover:text-stargold-200' : 'text-slate-400'}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-lavender-300/80 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="pt-4 mt-4 border-t border-lavender-400/15">
                <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
                  <span className="text-lavender-400">Progress</span>
                  <span className={item.unlocked ? 'text-stargold-300 font-bold' : 'text-slate-400'}>
                    {item.progress} / {item.maxProgress} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-midnight-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.unlocked
                        ? 'bg-gradient-to-r from-stargold-400 to-amber-500'
                        : 'bg-slate-700'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
