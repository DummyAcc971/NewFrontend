import { Injectable, signal, effect, WritableSignal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  currentTheme: WritableSignal<Theme> = signal(this.loadThemeFromLocalStorage());

  constructor() {
    effect(() => {
      const theme = this.currentTheme();
      localStorage.setItem(this.THEME_KEY, theme);
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(`${theme}-theme`);
    });
  }

  private loadThemeFromLocalStorage(): Theme {
    const storedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    return storedTheme || 'light'; // Default to light theme
  }

  toggleTheme(): void {
    this.currentTheme.update(current => (current === 'light' ? 'dark' : 'light'));
  }

  isDarkMode(): boolean {
    return this.currentTheme() === 'dark';
  }
}