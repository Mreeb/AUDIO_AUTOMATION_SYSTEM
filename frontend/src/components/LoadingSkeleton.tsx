import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="h-20 w-full bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
  );
};
