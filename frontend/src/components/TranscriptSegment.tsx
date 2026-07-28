import React, { useState } from 'react';
import { Clock, Edit3, Check, X } from 'lucide-react';
import type { TranscriptSegment as SegmentType } from '../types';

interface TranscriptSegmentProps {
  segment: SegmentType;
  showTimestamps: boolean;
  searchQuery?: string;
  onSegmentUpdate?: (updatedSeg: SegmentType) => void;
}

export const TranscriptSegment: React.FC<TranscriptSegmentProps> = ({
  segment,
  showTimestamps,
  searchQuery = '',
  onSegmentUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(segment.text);

  const formatSec = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSave = () => {
    if (onSegmentUpdate) {
      onSegmentUpdate({ ...segment, text: editedText });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedText(segment.text);
    setIsEditing(false);
  };

  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 dark:bg-amber-900/80 text-slate-900 dark:text-amber-100 rounded px-1 font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/80 transition-all duration-200">
      {showTimestamps && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700 shrink-0 self-start">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>{formatSec(segment.start)} - {formatSec(segment.end)}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full p-3 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-indigo-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              rows={2}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans">
            {renderHighlightedText(segment.text, searchQuery)}
          </p>
        )}
      </div>

      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-900 transition-all shrink-0 self-start"
          title="Edit segment text"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
