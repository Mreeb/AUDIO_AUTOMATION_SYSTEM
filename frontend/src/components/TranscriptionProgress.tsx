import React from 'react';
import { XCircle, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import type { ProcessingStage } from '../types';
import { ProcessingStageIndicator } from './ProcessingStageIndicator';

interface TranscriptionProgressProps {
  fileName: string;
  stage: ProcessingStage;
  progress: number;
  stageMessage: string;
  estimatedTimeRemaining: number;
  onCancel: () => void;
}

export const TranscriptionProgress: React.FC<TranscriptionProgressProps> = ({
  fileName,
  stage,
  progress,
  stageMessage,
  estimatedTimeRemaining,
  onCancel
}) => {
  return (
    <div className="w-full p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-indigo-500/10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Processing "{fileName}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI4Bharat IndicConformer INT8 Quantized ASR Engine
            </p>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors self-start sm:self-auto"
        >
          <XCircle className="w-4 h-4" />
          <span>Cancel Process</span>
        </button>
      </div>

      <ProcessingStageIndicator currentStage={stage} />

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            {stageMessage || 'Processing audio...'}
          </span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-base">
            {progress}%
          </span>
        </div>

        <div className="relative w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full transition-all duration-300 relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-500" />
          <span>Estimated time remaining: <strong className="text-slate-800 dark:text-slate-200">{estimatedTimeRemaining}s</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Devanagari Script & Code-Switching Detection</span>
        </div>
      </div>
    </div>
  );
};
