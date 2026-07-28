import React from 'react';
import { Check, Loader2, Circle } from 'lucide-react';
import type { ProcessingStage } from '../types';

interface ProcessingStageIndicatorProps {
  currentStage: ProcessingStage;
}

const STAGES: { id: ProcessingStage; label: string }[] = [
  { id: 'uploading', label: 'Uploading Audio' },
  { id: 'preparing', label: 'Preparing Audio' },
  { id: 'transcribing', label: 'Transcribing' },
  { id: 'formatting', label: 'Formatting Transcript' },
  { id: 'completed', label: 'Completed' }
];

export const ProcessingStageIndicator: React.FC<ProcessingStageIndicatorProps> = ({ currentStage }) => {
  const getStageStatus = (stageId: ProcessingStage) => {
    const order: ProcessingStage[] = ['idle', 'uploading', 'preparing', 'transcribing', 'formatting', 'completed'];
    const currentIndex = order.indexOf(currentStage);
    const stageIndex = order.indexOf(stageId);

    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-800 -z-0" />

        {STAGES.map((stage) => {
          const status = getStageStatus(stage.id);

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                  status === 'completed'
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : status === 'current'
                    ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-md shadow-indigo-600/30'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : status === 'current' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Circle className="w-3 h-3 fill-current" />
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold text-center transition-colors ${
                  status === 'current'
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : status === 'completed'
                    ? 'text-slate-800 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
