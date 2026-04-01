'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="bg-glass-bg border border-glass-border backdrop-blur-md p-2 rounded-full cursor-pointer flex items-center justify-center text-foreground transition-all duration-200 w-10 h-10 hover:bg-card-border hover:scale-105 active:scale-95"
      onClick={toggleTheme}
      aria-label="Alternar tema"
      type="button"
    >
      {theme === 'light' ? (
        <Moon size={20} className="animate-in fade-in" />
      ) : (
        <Sun size={20} className="animate-in fade-in" />
      )}
    </button>
  );
}
