import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  ArrowRight, 
  KeyRound, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle,
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../../services/auth';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: (user: UserProfile) => void;
  allowClose?: boolean;
}

type TabType = 'login' | 'register' | 'mobile' | 'forgot' | 'reset';

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  allowClose = false 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Mobile OTP Fields
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Password Reset Token
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Info modal for unconfigured services (SMS / Google OAuth)
  const [serviceInfo, setServiceInfo] = useState<{
    title: string;
    message: string;
    requirements: string[];
  } | null>(null);

  if (!isOpen) return null;

  const resetMessages = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const handleTabChange = (tab: TabType) => {
    resetMessages();
    setActiveTab(tab);
  };

  // 1. Email Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const { user } = await authService.login(email, password);
      setSuccessMsg(`Welcome back, ${user.name}! 🌙`);
      setTimeout(() => onSuccess(user), 400);
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password');
    } finally {
      setLoading(false);
    }
  };

  // 2. Email Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!agreeTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to join');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { user } = await authService.register(name, email, password);
      setSuccessMsg(`Welcome to your library, ${user.name}! ✨`);
      setTimeout(() => onSuccess(user), 500);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // 3. Demo One-Click Login
  const handleDemoLogin = async () => {
    resetMessages();
    setLoading(true);
    try {
      const { user } = await authService.loginDemo();
      setSuccessMsg(`Entering Seraphina's MBA Universe... 🌙`);
      setTimeout(() => onSuccess(user), 400);
    } catch (err: any) {
      setError(err.message || 'Could not log into demo account');
    } finally {
      setLoading(false);
    }
  };

  // Sagun 1-Click Login (Primary Account)
  const handleSagunLogin = async () => {
    resetMessages();
    setLoading(true);
    try {
      const { user } = await authService.login('Sagun@463gmail.com', '4june2013');
      setSuccessMsg(`Welcome to your library, Sagun! 🌙`);
      setTimeout(() => onSuccess(user), 400);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // 4. Mobile OTP Request & Verify
  const handleSendOtp = async () => {
    resetMessages();
    const fullPhone = `${countryCode} ${phone}`.trim();
    if (!phone || phone.length < 7) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendPhoneOtp(fullPhone);
      setOtpSent(true);
      if (res.otpCode) {
        setOtp(res.otpCode);
      }
      setSuccessMsg(res.message || `Verification code sent! (Use 123456)`);
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    resetMessages();
    const fullPhone = `${countryCode} ${phone}`.trim();
    if (!otp || otp.trim().length < 4) {
      setError('Please enter the 6-digit code (e.g. 123456)');
      return;
    }

    setLoading(true);
    try {
      const { user } = await authService.verifyPhoneOtp(fullPhone, otp);
      setSuccessMsg(`Welcome, ${user.name}! 🌙 Verified via ${fullPhone}`);
      setTimeout(() => onSuccess(user), 400);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // 5. Google Sign-In Check
  const handleGoogleSignIn = async () => {
    resetMessages();
    setLoading(true);
    try {
      const res = await authService.getGoogleAuthStatus();
      if (!res.configured) {
        setServiceInfo({
          title: 'Google OAuth 2.0 Setup Required',
          message: res.message || 'Real Google authentication requires an active Client ID registered in Google Cloud Console.',
          requirements: res.requiredSettings || [
            'GOOGLE_CLIENT_ID in server/.env',
            'GOOGLE_CLIENT_SECRET in server/.env',
            'Authorized Redirect URI: http://localhost:5174/auth/google/callback'
          ]
        });
      } else if (res.authUrl) {
        window.location.href = res.authUrl;
      }
    } catch (err: any) {
      setError('Google Sign-In service unavailable');
    } finally {
      setLoading(false);
    }
  };

  // 6. Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!email) {
      setError('Please enter your account email address');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.requestPasswordReset(email);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setSuccessMsg(res.message);
        setActiveTab('reset');
      } else {
        setSuccessMsg(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  // 7. Reset Password with Token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!resetToken || !newPassword) {
      setError('Please enter both the reset token and new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const msg = await authService.resetPasswordWithToken(resetToken, newPassword);
      setSuccessMsg(msg);
      setTimeout(() => {
        setActiveTab('login');
        setPassword('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      {/* Outer Glow & Card Container */}
      <div className="relative w-full max-w-md my-8 bg-gradient-to-b from-navy-900/95 via-navy-900/98 to-navy-950/98 rounded-3xl border border-lavender-500/30 shadow-2xl shadow-lavender-500/10 p-6 sm:p-8 backdrop-blur-xl text-cream-50 animate-fadeIn">
        
        {/* Optional Close button */}
        {allowClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-lavender-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Mascot & Header */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3 rounded-full bg-gradient-to-tr from-lavender-600/30 via-moon-gold/20 to-lavender-300/30 border border-lavender-400/40 shadow-inner">
            {/* Glowing Crescent Moon */}
            <div className="text-4xl animate-pulse">🌙</div>
            {/* Floating Sparkle */}
            <Sparkles className="w-4 h-4 text-moon-gold absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <h2 className="text-2xl font-serif font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cream-100 via-lavender-200 to-rose-200">
            Welcome to Moonlit Library 🌙
          </h2>
          <p className="text-xs sm:text-sm text-lavender-300/80 mt-1 font-sans">
            Your little universe of learning awaits.
          </p>
        </div>

        {/* Navigation Tabs (Login / Register / Mobile) */}
        {activeTab !== 'forgot' && activeTab !== 'reset' && (
          <div className="flex p-1 mb-6 rounded-2xl bg-navy-950/60 border border-lavender-500/20">
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'login'
                  ? 'bg-lavender-600/30 text-white shadow-sm border border-lavender-400/40'
                  : 'text-lavender-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange('register')}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-lavender-600/30 text-white shadow-sm border border-lavender-400/40'
                  : 'text-lavender-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => handleTabChange('mobile')}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === 'mobile'
                  ? 'bg-lavender-600/30 text-white shadow-sm border border-lavender-400/40'
                  : 'text-lavender-300 hover:text-white'
              }`}
            >
              Mobile OTP
            </button>
          </div>
        )}

        {/* Feedback Messages */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ----------------- TAB A: LOGIN WITH EMAIL ----------------- */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-lavender-200 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@moonlit.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-sm text-cream-50 placeholder-lavender-400/50 focus:outline-none focus:border-lavender-400 focus:ring-1 focus:ring-lavender-400 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-lavender-200">Password</label>
                <button
                  type="button"
                  onClick={() => handleTabChange('forgot')}
                  className="text-xs text-lavender-300 hover:text-moon-gold transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-sm text-cream-50 placeholder-lavender-400/50 focus:outline-none focus:border-lavender-400 focus:ring-1 focus:ring-lavender-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lavender-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-lavender-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-lavender-500/40 bg-navy-950 text-lavender-500 focus:ring-0"
                />
                Remember my session
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-lavender-600 to-lavender-500 hover:from-lavender-500 hover:to-lavender-400 text-white font-medium rounded-xl shadow-lg shadow-lavender-600/30 transition-all transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enter My Library</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Access Buttons */}
            <div className="pt-2 space-y-2 border-t border-lavender-500/20 text-center">
              <button
                type="button"
                onClick={handleSagunLogin}
                className="w-full py-2 px-3 bg-gradient-to-r from-lavender-600/30 to-rose-500/20 hover:from-lavender-600/40 hover:to-rose-500/30 border border-lavender-400/40 text-lavender-100 text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 font-medium shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-moon-gold" />
                <span>Enter as Sagun Singh (Sagun@463gmail.com)</span>
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-1.5 px-3 bg-moon-gold/10 hover:bg-moon-gold/20 border border-moon-gold/30 text-moon-gold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Try Seraphina's Demo Account (1-Click MBA Universe)</span>
              </button>
            </div>
          </form>
        )}

        {/* ----------------- TAB B: CREATE ACCOUNT ----------------- */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-lavender-200 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seraphina Moon"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-sm text-cream-50 placeholder-lavender-400/50 focus:outline-none focus:border-lavender-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-lavender-200 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@moonlit.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-sm text-cream-50 placeholder-lavender-400/50 focus:outline-none focus:border-lavender-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-lavender-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-9 pr-3 py-2 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-xs text-cream-50 placeholder-lavender-400/50 focus:outline-none focus:border-lavender-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-lavender-200 mb-1">Confirm</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-lavender-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat"
                    className="w-full pl-9 pr-3 py-2 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-xs text-cream-50 placeholder-lavender-400/50 focus:outline-none focus:border-lavender-400 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 text-xs text-lavender-300">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-lavender-500/40 bg-navy-950 text-lavender-500 focus:ring-0"
              />
              <span>
                I agree to the <span className="text-moon-gold underline cursor-pointer">Terms of Service</span> and acknowledge my notes and files remain strictly private.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 via-lavender-600 to-lavender-500 hover:from-rose-400 hover:to-lavender-400 text-white font-medium rounded-xl shadow-lg shadow-lavender-600/30 transition-all transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Enter</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* ----------------- TAB C: LOGIN WITH MOBILE OTP ----------------- */}
        {activeTab === 'mobile' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-lavender-200 mb-1">Mobile Phone Number</label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 px-2 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-xs text-cream-50 focus:outline-none focus:border-lavender-400"
                >
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+86">🇨🇳 +86</option>
                </select>

                <div className="relative flex-1">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-lavender-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="555-839-2026"
                    className="w-full pl-9 pr-3 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-sm text-cream-50 placeholder-lavender-400/50 focus:outline-none focus:border-lavender-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || resendCooldown > 0}
              className="w-full py-2.5 px-4 bg-lavender-600/30 hover:bg-lavender-600/40 border border-lavender-400/40 text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {resendCooldown > 0 ? (
                <span>Resend OTP in {resendCooldown}s</span>
              ) : (
                <span>Send One-Time Code</span>
              )}
            </button>

            {otpSent && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-lavender-200 mb-1">Enter 6-Digit OTP</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-center tracking-widest font-mono text-base text-cream-50 focus:outline-none focus:border-lavender-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading || !otp}
                  className="w-full py-3 px-4 bg-gradient-to-r from-lavender-600 to-lavender-500 hover:from-lavender-500 hover:to-lavender-400 text-white font-medium rounded-xl shadow-lg shadow-lavender-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Enter (Connect to Sagun's Library)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB D: FORGOT PASSWORD ----------------- */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-base font-serif font-bold text-cream-100">Reset Password</h3>
              <p className="text-xs text-lavender-300">
                Enter your registered email address to receive password reset instructions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-lavender-200 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="scholar@moonlit.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-sm text-cream-50 focus:outline-none focus:border-lavender-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-lavender-600 to-lavender-500 text-white text-xs font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {successMsg && successMsg.includes('4june2013') && (
              <button
                type="button"
                onClick={() => {
                  setEmail('Sagun@463gmail.com');
                  setPassword('4june2013');
                  handleTabChange('login');
                }}
                className="w-full py-2 px-3 bg-moon-gold/20 hover:bg-moon-gold/30 border border-moon-gold/40 text-moon-gold text-xs rounded-xl font-medium transition-all flex items-center justify-center gap-1.5 animate-bounce"
              >
                <span>🌙 Click Here to Sign In Now with 4june2013</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleTabChange('login')}
              className="w-full text-center text-xs text-lavender-400 hover:text-white transition-colors"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* ----------------- TAB E: RESET WITH TOKEN ----------------- */}
        {activeTab === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="text-center mb-2">
              <h3 className="text-base font-serif font-bold text-cream-100">Set New Password</h3>
              <p className="text-xs text-lavender-300">
                Enter your reset token and your desired new password.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-lavender-200 mb-1">Reset Token</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="rst_..."
                  className="w-full pl-10 pr-4 py-2 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-xs font-mono text-cream-50 focus:outline-none focus:border-lavender-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-lavender-200 mb-1">New Password (min 6 chars)</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lavender-400" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 bg-navy-950/60 border border-lavender-500/30 rounded-xl text-xs text-cream-50 focus:outline-none focus:border-lavender-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-lavender-600 to-lavender-500 text-white text-xs font-medium rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Update Password</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ----------------- GOOGLE SIGN IN BUTTON ----------------- */}
        {activeTab !== 'forgot' && activeTab !== 'reset' && (
          <div className="mt-5 pt-4 border-t border-lavender-500/20">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-lavender-400/20 rounded-xl text-xs font-medium text-cream-100 flex items-center justify-center gap-3 transition-colors"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Configuration Guide Modal for External Services */}
      {serviceInfo && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md">
          <div className="w-full max-w-md bg-navy-900 border border-lavender-500/40 rounded-2xl p-6 shadow-2xl text-cream-50 animate-scaleUp">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-lavender-500/20 text-moon-gold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-cream-100">{serviceInfo.title}</h3>
            </div>

            <p className="text-xs text-lavender-200 leading-relaxed mb-4">
              {serviceInfo.message}
            </p>

            <div className="p-3 rounded-xl bg-navy-950/80 border border-lavender-500/20 mb-4 font-mono text-[11px] text-lavender-300 space-y-1.5">
              <div className="text-xs font-sans font-semibold text-moon-gold mb-1">Required Environment Variables:</div>
              {serviceInfo.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-lavender-400">•</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-lavender-400/80 mb-4">
              * Per security design, credentials must be saved directly in the server <code className="text-cream-200">.env</code> file, never exposed to client-side code.
            </div>

            <button
              onClick={() => setServiceInfo(null)}
              className="w-full py-2.5 bg-lavender-600 hover:bg-lavender-500 text-white text-xs font-medium rounded-xl transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
