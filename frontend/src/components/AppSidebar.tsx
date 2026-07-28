import React from 'react';

import {
  LayoutDashboard,
  Mic,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2
} from 'lucide-react';

export type NavTab = 'dashboard' | 'new_transcription' | 'history' | 'settings';

interface AppSidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'new_transcription', label: 'New Transcription', icon: <Mic className="w-5 h-5" />, badge: 'AI' },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'history', label: 'Transcription History', icon: <History className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`relative flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 shrink-0">
          <Volume2 className="w-6 h-6 animate-pulse" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:to-purple-300">
              IndicCall AI
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
              Indic ASR Speech System
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center w-full gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-slate-50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              AI4Bharat IndicConformer
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            CPU INT8 Quantized engine active for Hindi-English calls.
          </p>
        </div>
      )}

      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};
