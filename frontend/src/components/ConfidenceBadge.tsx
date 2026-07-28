import React from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: 'high' | 'medium' | 'low';
  score?: number;
  showScore?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  score,
  showScore = true
}) => {
  if (confidence === 'high') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>High {showScore && score ? `(${Math.round(score * 100)}%)` : ''}</span>
      </span>
    );
  }

  if (confidence === 'medium') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
        <span>Medium {showScore && score ? `(${Math.round(score * 100)}%)` : ''}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
      <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
      <span>Low {showScore && score ? `(${Math.round(score * 100)}%)` : ''}</span>
    </span>
  );
};
