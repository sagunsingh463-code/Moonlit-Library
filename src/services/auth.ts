import { UserProfile } from '../types';

const TOKEN_KEY = 'moonlit_auth_token';
const USER_KEY = 'moonlit_auth_user';
const API_BASE = 'http://localhost:3002/api';

type AuthListener = (user: UserProfile | null) => void;

class AuthService {
  private listeners: AuthListener[] = [];

  public getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  public getUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  public setSession(token: string, user: UserProfile) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.notify(user);
  }

  public clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.notify(null);
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    // Call immediately with current user
    listener(this.getUser());
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(user: UserProfile | null) {
    this.listeners.forEach(l => {
      try {
        l(user);
      } catch (e) {
        console.error('Auth listener error:', e);
      }
    });
  }

  // --- API CALLS ---

  public async register(name: string, email: string, password: string, phone?: string): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register account');
    }

    this.setSession(data.token, data.user);
    return data;
  }

  public async login(email: string, password: string): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }

    this.setSession(data.token, data.user);
    return data;
  }

  public async loginDemo(): Promise<{ user: UserProfile; token: string }> {
    return this.login('demo@moonlit.library', 'Moonlight123!');
  }

  public logout() {
    this.clearSession();
  }

  public async refreshUser(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          this.notify(data.user);
          return data.user;
        }
      } else if (res.status === 401) {
        this.clearSession();
      }
    } catch {
      // Backend offline or network error, retain cached user
    }
    return this.getUser();
  }

  public async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }

    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    this.notify(data.user);
    return data.user;
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<string> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to change password');
    }
    return data.message || 'Password changed successfully';
  }

  public async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; resetToken?: string; configured: boolean; instructions?: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to request password reset');
    }
    return data;
  }

  public async resetPasswordWithToken(token: string, newPassword: string): Promise<string> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }
    return data.message || 'Password reset successfully';
  }

  public async sendPhoneOtp(phone: string): Promise<{ configured: boolean; message?: string; error?: string; requiredSettings?: string[] }> {
    const res = await fetch(`${API_BASE}/auth/send-phone-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();
    return data;
  }

  public async getGoogleAuthStatus(): Promise<{ configured: boolean; message?: string; authUrl?: string; requiredSettings?: string[] }> {
    const res = await fetch(`${API_BASE}/auth/google/url`);
    return await res.json();
  }

  public async deleteAccount(): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_BASE}/auth/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete account');
    }

    this.clearSession();
  }
}

export const authService = new AuthService();
