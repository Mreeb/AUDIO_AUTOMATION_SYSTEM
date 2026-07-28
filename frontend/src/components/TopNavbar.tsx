import React from 'react';
import { Search, Bell, Menu, Sparkles, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopNavbarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onToggleMobileMenu?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  darkMode,
  onToggleTheme,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange
}) => {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Left side: Mobile Menu toggle & Title */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <div className="hidden sm:flex flex-col">
          <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            IndicCall AI
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3 h-3" />
              v1.0 Ready
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transcribe and analyze Hindi-English business calls.
          </p>
        </div>
      </div>

      {/* Middle: Search input */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transcripts, leads, audio files..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800/70 text-slate-900 dark:text-slate-100 rounded-xl border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right side: Actions & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Theme Toggle */}
        <ThemeToggle darkMode={darkMode} onToggle={onToggleTheme} />

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs ring-2 ring-indigo-500/20">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Mreeb Admin
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Enterprise Plan
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
