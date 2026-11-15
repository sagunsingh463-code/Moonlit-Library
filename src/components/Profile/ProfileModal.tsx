import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Lock, 
  LogOut, 
  Trash2, 
  CheckCircle2, 
  Check, 
  AlertTriangle,
  Calendar,
  Sparkles,
  Save,
  Sun,
  Moon,
  Clock,
  BookOpen
} from 'lucide-react';
import { authService } from '../../services/auth';
import { db } from '../../services/db';
import { themeService, ThemePreference, ThemeSchedule } from '../../services/theme';
import { UserProfile } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onProfileUpdated: (updatedUser: UserProfile) => void;
  onLogout: () => void;
}

const AVATAR_OPTIONS = [
  { id: 'shagun-anime', label: 'Shagun (Permanent Mascot)', emoji: '🌙', image: '/shagun/shagun_speaking_portrait.jpg', bg: 'from-stargold-400/40 to-lavender-500/30' },
  { id: 'cat-luna', label: 'Luna the Moon Cat', emoji: '🐱', bg: 'from-lavender-500/30 to-moon-gold/20' },
  { id: 'starlight', label: 'Starlight Scholar', emoji: '✨', bg: 'from-blue-500/30 to-lavender-500/20' },
  { id: 'bunny-star', label: 'Celestial Bunny', emoji: '🐰', bg: 'from-rose-500/30 to-lavender-400/20' },
  { id: 'fox-midnight', label: 'Midnight Fox', emoji: '🦊', bg: 'from-amber-500/30 to-purple-500/20' },
  { id: 'witch-lavender', label: 'Lavender Witch', emoji: '🧙‍♀️', bg: 'from-purple-500/30 to-pink-500/20' },
  { id: 'owl-cosmic', label: 'Cosmic Owl', emoji: '🦉', bg: 'from-indigo-500/30 to-cyan-500/20' }
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
  onLogout
}) => {
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar || 'cat-luna');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  // Status feedback
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Confirmation modals
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [introEnabled, setIntroEnabled] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('moonlit_skip_intro') !== 'true' : true);
  const [themePref, setThemePref] = useState<ThemePreference>(() => themeService.getPreference());
  const [themeSchedule, setThemeSchedule] = useState<ThemeSchedule>(() => themeService.getSchedule());

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setLoading(true);

    try {
      const updated = await authService.updateProfile({
        name,
        phone,
        avatar: selectedAvatar
      });
      onProfileUpdated(updated);
      setFeedback({ type: 'success', message: 'Profile updated successfully! ✨' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword !== confirmNewPassword) {
      setFeedback({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      const msg = await authService.changePassword(currentPassword, newPassword);
      setFeedback({ type: 'success', message: msg });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordSection(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLogout = () => {
    authService.logout();
    db.clearLocalCache();
    setShowLogoutConfirm(false);
    onLogout();
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmationText !== 'DELETE') {
      setFeedback({ type: 'error', message: 'Please type DELETE exactly to confirm account removal' });
      return;
    }

    setLoading(true);
    try {
      await authService.deleteAccount();
      await db.clearLocalCache();
      setShowDeleteConfirm(false);
      onLogout();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete account' });
      setLoading(false);
    }
  };

  const currentAvatarObj = AVATAR_OPTIONS.find(a => a.id === selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-[#1E1528]/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-lg my-6 sm:my-8 bg-gradient-to-b from-[#241A30] via-[#241A30] to-[#1E1528] rounded-3xl border border-[#C7B6E8]/30 shadow-2xl p-6 sm:p-8 backdrop-blur-xl text-cream-50 animate-fadeIn">
        
        {/* Prominent Header Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#30243D] border border-[#C7B6E8]/40 text-[#FFF7ED] hover:bg-[#C7B6E8] hover:text-[#30243D] transition-all shadow-md text-xs font-serif font-bold group"
          title="Close profile and return to library (Esc)"
        >
          <span>Close</span>
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-lavender-500/20 border border-lavender-400/30 text-lavender-300">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-cream-100">
              Account & Profile
            </h2>
            <p className="text-xs text-lavender-300/80">
              Manage your personal student identity and security credentials.
            </p>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className={`mb-4 p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2 ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
              : 'bg-red-950/60 border-red-500/40 text-red-200'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Avatar Showcase & Selection */}
        <div className="mb-6 p-4 rounded-2xl bg-navy-950/60 border border-lavender-500/20">
          <div className="text-xs font-medium text-lavender-200 mb-3 flex items-center justify-between">
            <span>Choose Your Astral Avatar</span>
            <span className="text-[11px] text-moon-gold font-mono">{currentAvatarObj.label}</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {AVATAR_OPTIONS.map((av: any) => (
              <button
                key={av.id}
                type="button"
                onClick={() => setSelectedAvatar(av.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                  selectedAvatar === av.id
                    ? 'border-moon-gold bg-moon-gold/15 shadow-lg shadow-moon-gold/10 scale-105'
                    : 'border-lavender-500/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                {av.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-stargold-400/60 mb-1">
                    <img src={av.image} alt={av.label} className="w-full h-full object-cover object-[center_20%]" />
                  </div>
                ) : (
                  <span className="text-2xl mb-1">{av.emoji}</span>
                )}
                <span className="text-[9px] text-lavender-200 truncate w-full text-center">
                  {av.id === 'shagun-anime' ? 'Shagun ✨' : av.label.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-lavender-200 mb-1">Scholar Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-sm text-cream-50 focus:outline-none focus:border-lavender-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-lavender-200">Email Address</label>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full pl-10 pr-3 py-2 bg-navy-950/40 border border-lavender-500/10 rounded-xl text-xs text-lavender-300 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-lavender-200">Mobile Phone</label>
                <span className="text-[10px] text-lavender-400 font-mono">
                  {currentUser.phoneVerified ? 'Verified' : 'Optional'}
                </span>
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-3 py-2 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-xs text-cream-50 focus:outline-none focus:border-lavender-400"
                />
              </div>
            </div>
          </div>

          {/* Account Meta */}
          <div className="p-3 rounded-xl bg-navy-950/40 border border-lavender-500/10 flex items-center justify-between text-xs text-lavender-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-lavender-400" />
              Member Since
            </span>
            <span className="font-mono text-cream-200">
              {new Date(currentUser.createdAt || Date.now()).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Save Profile Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-lavender-600/40 hover:bg-lavender-600/60 border border-lavender-400/40 text-white font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile Updates</span>
          </button>
        </form>

        {/* Change Password Collapsible Section */}
        <div className="mt-6 pt-5 border-t border-lavender-500/20">
          <button
            type="button"
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="w-full flex items-center justify-between text-xs font-medium text-lavender-200 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-lavender-400" />
              Change Account Password
            </span>
            <span className="text-moon-gold text-[11px]">
              {showPasswordSection ? 'Hide' : 'Update'}
            </span>
          </button>

          {showPasswordSection && (
            <form onSubmit={handleChangePassword} className="mt-3 space-y-3 p-3 rounded-2xl bg-navy-950/60 border border-lavender-500/20">
              <div>
                <label className="block text-[11px] text-lavender-300 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-1.5 bg-navy-900 border border-lavender-500/30 rounded-xl text-xs text-cream-50 focus:outline-none focus:border-lavender-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-lavender-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 py-1.5 bg-navy-900 border border-lavender-500/30 rounded-xl text-xs text-cream-50 focus:outline-none focus:border-lavender-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-lavender-300 mb-1">Confirm New</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat"
                    className="w-full px-3 py-1.5 bg-navy-900 border border-lavender-500/30 rounded-xl text-xs text-cream-50 focus:outline-none focus:border-lavender-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-lavender-600 hover:bg-lavender-500 text-white text-xs font-medium rounded-xl transition-colors"
              >
                Change Password
              </button>
            </form>
          )}
        </div>

        {/* Welcome Screen Preference */}
        <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-lavender-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌙</span>
            <div>
              <p className="text-xs font-medium text-cream-100">Welcome Screen</p>
              <p className="text-[10px] text-lavender-300">Play Shagun's personal greeting when opening the library</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const current = localStorage.getItem('moonlit_skip_intro') === 'true';
              if (current) {
                localStorage.removeItem('moonlit_skip_intro');
                setIntroEnabled(true);
              } else {
                localStorage.setItem('moonlit_skip_intro', 'true');
                setIntroEnabled(false);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              introEnabled 
                ? 'bg-lavender-600 text-white shadow-sm' 
                : 'bg-navy-950/80 border border-lavender-500/30 text-lavender-300 hover:text-white'
            }`}
          >
            {introEnabled ? 'Enabled' : 'Skipped'}
          </button>
        </div>

        {/* Day / Night Theme Schedule & Override Settings */}
        <div className="mt-4 p-4 rounded-3xl bg-[#30243D]/60 border border-[#C7B6E8]/25 space-y-3.5 shadow-md">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#241A30] text-[#C7B6E8] border border-[#C7B6E8]/25">
                <Sparkles className="w-4 h-4 text-[#F3D8E5]" />
              </span>
              <div>
                <p className="text-xs font-serif font-bold text-[#FFF7ED]">Aesthetic Theme Sanctuary & Lighting</p>
                <p className="text-[10px] text-[#E8DDF8]/70 font-sans">Pinterest dreamy palette, celestial ambiance & circadian schedule</p>
              </div>
            </div>
          </div>

          {/* Theme Mode Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* 1. Dreamy Sanctuary (Dark Plum & Dusty Lavender) */}
            <button
              type="button"
              onClick={() => {
                setThemePref('dark-academia');
                themeService.setPreference('dark-academia');
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                themePref === 'dark-academia' || themePref === 'dark'
                  ? 'bg-[#30243D] border-[#C7B6E8] text-[#FFF7ED] shadow-[0_0_20px_rgba(199,182,232,0.25)] ring-1 ring-[#C7B6E8]/40'
                  : 'bg-[#241A30]/80 border-[#C7B6E8]/20 text-[#E8DDF8]/80 hover:border-[#C7B6E8]/40 hover:bg-[#30243D]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#30243D] border border-[#C7B6E8]" />
                  <span className="w-3 h-3 rounded-full bg-[#C7B6E8]" />
                  <span className="w-3 h-3 rounded-full bg-[#F3D8E5]" />
                  <span className="w-3 h-3 rounded-full bg-[#C99B9B]" />
                </div>
                {(themePref === 'dark-academia' || themePref === 'dark') && (
                  <Check className="w-3.5 h-3.5 text-[#C7B6E8]" />
                )}
              </div>
              <h4 className="text-xs font-serif font-bold text-[#FFF7ED]">Dreamy Sanctuary</h4>
              <p className="text-[10px] text-[#C7B6E8]/80 mt-0.5">Deep plum, dusty lavender & rose gold</p>
            </button>

            {/* 2. Celestial Midnight */}
            <button
              type="button"
              onClick={() => {
                setThemePref('celestial-midnight');
                themeService.setPreference('celestial-midnight');
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                themePref === 'celestial-midnight'
                  ? 'bg-[#1C203E] border-[#A5C9FF] text-[#FFF7ED] shadow-[0_0_20px_rgba(165,201,255,0.25)] ring-1 ring-[#A5C9FF]/40'
                  : 'bg-[#241A30]/80 border-[#C7B6E8]/20 text-[#E8DDF8]/80 hover:border-[#C7B6E8]/40 hover:bg-[#30243D]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#0B0E1E] border border-[#A5C9FF]" />
                  <span className="w-3 h-3 rounded-full bg-[#1B234B]" />
                  <span className="w-3 h-3 rounded-full bg-[#A5C9FF]" />
                  <span className="w-3 h-3 rounded-full bg-[#FDE047]" />
                </div>
                {themePref === 'celestial-midnight' && (
                  <Check className="w-3.5 h-3.5 text-[#A5C9FF]" />
                )}
              </div>
              <h4 className="text-xs font-serif font-bold text-[#FFF7ED]">Celestial Midnight</h4>
              <p className="text-[10px] text-[#A5C9FF]/80 mt-0.5">Navy midnight, starlight & cosmic moon</p>
            </button>

            {/* 3. Pastel Daydream Light */}
            <button
              type="button"
              onClick={() => {
                setThemePref('light');
                themeService.setPreference('light');
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                themePref === 'light'
                  ? 'bg-[#FAF5F8] border-[#C99B9B] text-[#30243D] shadow-[0_0_20px_rgba(201,155,155,0.25)] ring-1 ring-[#C99B9B]/40'
                  : 'bg-[#241A30]/80 border-[#C7B6E8]/20 text-[#E8DDF8]/80 hover:border-[#C7B6E8]/40 hover:bg-[#30243D]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FFF7ED] border border-[#C99B9B]" />
                  <span className="w-3 h-3 rounded-full bg-[#F3D8E5]" />
                  <span className="w-3 h-3 rounded-full bg-[#E8DDF8]" />
                  <span className="w-3 h-3 rounded-full bg-[#C99B9B]" />
                </div>
                {themePref === 'light' && (
                  <Check className="w-3.5 h-3.5 text-[#C99B9B]" />
                )}
              </div>
              <h4 className={`text-xs font-serif font-bold ${themePref === 'light' ? 'text-[#30243D]' : 'text-[#FFF7ED]'}`}>
                Daydream Pastel Light
              </h4>
              <p className={`text-[10px] mt-0.5 ${themePref === 'light' ? 'text-[#6A567D]' : 'text-[#E8DDF8]/70'}`}>
                Soft cream, blush pink & lavender daylight
              </p>
            </button>

            {/* 4. Auto Schedule */}
            <button
              type="button"
              onClick={() => {
                setThemePref('auto');
                themeService.setPreference('auto');
              }}
              className={`p-3 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                themePref === 'auto'
                  ? 'bg-[#30243D] border-[#F3D8E5] text-[#FFF7ED] shadow-[0_0_20px_rgba(243,216,229,0.25)] ring-1 ring-[#F3D8E5]/40'
                  : 'bg-[#241A30]/80 border-[#C7B6E8]/20 text-[#E8DDF8]/80 hover:border-[#C7B6E8]/40 hover:bg-[#30243D]/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#C99B9B]" />
                  <span className="text-[10px] text-[#C7B6E8]">⇄</span>
                  <Moon className="w-3.5 h-3.5 text-[#C7B6E8]" />
                </div>
                {themePref === 'auto' && (
                  <Check className="w-3.5 h-3.5 text-[#F3D8E5]" />
                )}
              </div>
              <h4 className="text-xs font-serif font-bold text-[#FFF7ED]">Circadian Auto Sync</h4>
              <p className="text-[10px] text-[#F3D8E5]/80 mt-0.5">Daytime pastel light, night plum sanctuary</p>
            </button>
          </div>

          {/* Configurable Daytime Hours when Auto is selected */}
          {themePref === 'auto' && (
            <div className="pt-2 border-t border-lavender-500/15 flex items-center justify-between text-xs text-lavender-300">
              <span className="text-[11px]">Daytime Light Hours:</span>
              <div className="flex items-center gap-2">
                <select
                  value={themeSchedule.dayStartHour}
                  onChange={(e) => {
                    const start = Number(e.target.value);
                    const updated = { ...themeSchedule, dayStartHour: start };
                    setThemeSchedule(updated);
                    themeService.setSchedule(updated);
                  }}
                  className="px-2 py-1 rounded-lg bg-navy-950 border border-lavender-500/30 text-[11px] text-white focus:outline-none"
                >
                  <option value={6}>6:00 AM</option>
                  <option value={7}>7:00 AM (Default)</option>
                  <option value={8}>8:00 AM</option>
                  <option value={9}>9:00 AM</option>
                </select>
                <span className="text-[11px]">to</span>
                <select
                  value={themeSchedule.dayEndHour}
                  onChange={(e) => {
                    const end = Number(e.target.value);
                    const updated = { ...themeSchedule, dayEndHour: end };
                    setThemeSchedule(updated);
                    themeService.setSchedule(updated);
                  }}
                  className="px-2 py-1 rounded-lg bg-navy-950 border border-lavender-500/30 text-[11px] text-white focus:outline-none"
                >
                  <option value={17}>5:00 PM</option>
                  <option value={18}>6:00 PM (Default)</option>
                  <option value={19}>7:00 PM</option>
                  <option value={20}>8:00 PM</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Return to Library, Sign Out & Delete Zone */}
        <div className="mt-6 pt-5 border-t border-[#C7B6E8]/20 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 py-2.5 px-4 bg-[#30243D] hover:bg-[#3D2C4E] border border-[#C7B6E8]/40 text-[#FFF7ED] text-xs font-serif font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <X className="w-4 h-4 text-[#C7B6E8]" />
            <span>Return to Library</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full sm:flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-[#C7B6E8]/20 text-[#C7B6E8] hover:text-white text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5 text-[#F3D8E5]" />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full sm:w-auto py-2.5 px-4 bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md">
          <div className="w-full max-w-sm bg-navy-900 border border-lavender-500/40 rounded-3xl p-6 shadow-2xl text-center text-cream-50 animate-scaleUp">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-lavender-500/20 flex items-center justify-center text-3xl">
              🌙
            </div>
            <h3 className="font-serif font-bold text-lg mb-1">Leaving the Library?</h3>
            <p className="text-xs text-lavender-300/90 mb-5">
              Luna the moon cat will keep your books safe until you return under starlight. 🐾
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-xs text-cream-100 font-medium rounded-xl"
              >
                Stay Here
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 bg-gradient-to-r from-lavender-600 to-lavender-500 text-xs text-white font-medium rounded-xl shadow-md"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-navy-900 border border-red-500/40 rounded-3xl p-6 shadow-2xl text-cream-50 animate-scaleUp">
            <div className="flex items-center gap-3 mb-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif font-bold text-base">Permanently Delete Account?</h3>
            </div>
            <p className="text-xs text-lavender-200 leading-relaxed mb-4">
              This action is <strong className="text-red-300">irreversible</strong>. All your private uploaded files on disk, study notes, assignments, custom quizzes, and unlocked constellation stars will be permanently erased.
            </p>
            <div className="mb-4">
              <label className="block text-[11px] text-lavender-300 mb-1">
                Type <strong className="text-cream-100 font-mono">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 bg-navy-950 border border-red-500/40 rounded-xl text-xs font-mono text-cream-50 focus:outline-none focus:border-red-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmationText('');
                }}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 text-xs text-cream-100 font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteConfirmationText !== 'DELETE' || loading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-xs text-white font-medium rounded-xl shadow-md disabled:opacity-40"
              >
                Permanently Erase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
