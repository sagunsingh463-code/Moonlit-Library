// Theme management service for Moonlit Library LMS
// Supports Automatic Day/Night schedule with user manual override and persistence

export type ThemePreference = 'auto' | 'light' | 'dark';
export type EffectiveTheme = 'light' | 'dark';

export interface ThemeSchedule {
  dayStartHour: number; // e.g. 7 for 7 AM
  dayEndHour: number;   // e.g. 18 for 6 PM
}

const STORAGE_PREF_KEY = 'moonlit_theme_preference';
const STORAGE_SCHEDULE_KEY = 'moonlit_theme_schedule';

const DEFAULT_SCHEDULE: ThemeSchedule = {
  dayStartHour: 7,  // 7 AM
  dayEndHour: 18    // 6 PM
};

class ThemeService {
  private listeners: Array<(theme: EffectiveTheme, pref: ThemePreference) => void> = [];
  private checkInterval: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Periodic check for automatic day/night schedule transition
      this.checkInterval = window.setInterval(() => {
        if (this.getPreference() === 'auto') {
          this.applyTheme();
        }
      }, 60000); // Check every minute
    }
  }

  public getPreference(): ThemePreference {
    if (typeof window === 'undefined') return 'auto';
    const saved = localStorage.getItem(STORAGE_PREF_KEY) as ThemePreference;
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      return saved;
    }
    return 'auto';
  }

  public setPreference(pref: ThemePreference): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_PREF_KEY, pref);
    this.applyTheme();
  }

  public getSchedule(): ThemeSchedule {
    if (typeof window === 'undefined') return DEFAULT_SCHEDULE;
    try {
      const saved = localStorage.getItem(STORAGE_SCHEDULE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.dayStartHour === 'number' && typeof parsed.dayEndHour === 'number') {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_SCHEDULE;
  }

  public setSchedule(schedule: ThemeSchedule): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_SCHEDULE_KEY, JSON.stringify(schedule));
    if (this.getPreference() === 'auto') {
      this.applyTheme();
    }
  }

  public getEffectiveTheme(): EffectiveTheme {
    const pref = this.getPreference();
    if (pref === 'light') return 'light';
    if (pref === 'dark') return 'dark';

    // Auto mode: evaluate local time
    const now = new Date();
    const currentHour = now.getHours();
    const schedule = this.getSchedule();

    const isDaytime = currentHour >= schedule.dayStartHour && currentHour < schedule.dayEndHour;
    return isDaytime ? 'light' : 'dark';
  }

  // Toggles between Light and Dark (manually overriding auto mode)
  public toggleTheme(): EffectiveTheme {
    const current = this.getEffectiveTheme();
    const next: ThemePreference = current === 'dark' ? 'light' : 'dark';
    this.setPreference(next);
    return next;
  }

  // Applies the effective theme class to the HTML document root
  public applyTheme(): EffectiveTheme {
    if (typeof document === 'undefined') return 'dark';

    const effective = this.getEffectiveTheme();
    const pref = this.getPreference();

    if (effective === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
    }

    // Notify registered React component listeners
    this.listeners.forEach(fn => fn(effective, pref));
    return effective;
  }

  public subscribe(fn: (theme: EffectiveTheme, pref: ThemePreference) => void): () => void {
    this.listeners.push(fn);
    // Call immediately with current state
    fn(this.getEffectiveTheme(), this.getPreference());
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }
}

export const themeService = new ThemeService();
