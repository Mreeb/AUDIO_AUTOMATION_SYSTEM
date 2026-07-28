import React from 'react';
import { FileAudio, Eye, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { TranscriptionHistoryItem } from '../types';

interface RecentTranscriptionsTableProps {
  items: TranscriptionHistoryItem[];
  onViewItem: (item: TranscriptionHistoryItem) => void;
}

export const RecentTranscriptionsTable: React.FC<RecentTranscriptionsTableProps> = ({
  items,
  onViewItem
}) => {
  const formatSec = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-4 px-6">File Name</th>
            <th className="py-4 px-4">Date</th>
            <th className="py-4 px-4">Duration</th>
            <th className="py-4 px-4">Status</th>
            <th className="py-4 px-4">Language</th>
            <th className="py-4 px-4">Confidence</th>
            <th className="py-4 px-6 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
          {items.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
              onClick={() => onViewItem(item)}
            >
              <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                    <FileAudio className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{item.fileName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{item.engine}</span>
                  </div>
                </div>
              </td>

              <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {item.date}
              </td>

              <td className="py-4 px-4 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                {formatSec(item.duration)}
              </td>

              <td className="py-4 px-4">
                {item.status === 'Completed' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Completed
                  </span>
                ) : item.status === 'Processing' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    Processing
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    Failed
                  </span>
                )}
              </td>

              <td className="py-4 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {item.language}
              </td>

              <td className="py-4 px-4 text-xs font-bold text-slate-900 dark:text-slate-100">
                {Math.round(item.confidence * 100)}%
              </td>

              <td className="py-4 px-6 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewItem(item);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
