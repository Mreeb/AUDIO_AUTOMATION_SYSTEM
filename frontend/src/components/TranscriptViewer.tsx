import React, { useState } from 'react';
import {
  Copy,
  Check,
  Search,
  Clock,
  Edit3,
  PlusCircle
} from 'lucide-react';
import type { TranscriptResult, TranscriptSegment as SegmentType } from '../types';
import { TranscriptSegment } from './TranscriptSegment';
import { downloadTranscript } from '../services/transcriptionService';

interface TranscriptViewerProps {
  result: TranscriptResult;
  onTranscribeAnother: () => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  result,
  onTranscribeAnother
}) => {
  const [segments, setSegments] = useState<SegmentType[]>(result.segments);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'segments' | 'fulltext'>('segments');
  const [isEditingFullText, setIsEditingFullText] = useState(false);
  const [fullText, setFullText] = useState(result.fullText);

  const handleCopy = () => {
    const textToCopy = activeTab === 'fulltext' ? fullText : segments.map(s => `[${s.start}s-${s.end}s] ${s.text}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSegmentUpdate = (updatedSeg: SegmentType) => {
    const newSegs = segments.map(s => (s.id === updatedSeg.id ? updatedSeg : s));
    setSegments(newSegs);
    setFullText(newSegs.map(s => s.text).join(' '));
  };

  const filteredSegments = segments.filter(seg =>
    seg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-6">
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Completed
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Engine: <strong>{result.engine}</strong>
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Transcription for "{result.fileName}"
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-indigo-500" />}
              <span>{copied ? 'Copied!' : 'Copy Transcript'}</span>
            </button>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => downloadTranscript({ ...result, fullText, segments }, 'txt')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 transition-all"
                title="Download Plain TXT"
              >
                TXT
              </button>
              <button
                onClick={() => downloadTranscript({ ...result, fullText, segments }, 'srt')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 transition-all"
                title="Download SRT Subtitles"
              >
                SRT
              </button>
              <button
                onClick={() => downloadTranscript({ ...result, fullText, segments }, 'vtt')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-white dark:hover:bg-slate-900 transition-all"
                title="Download VTT Subtitles"
              >
                VTT
              </button>
              <button
                onClick={() => downloadTranscript({ ...result, fullText, segments }, 'json')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-white dark:hover:bg-slate-900 transition-all"
                title="Download Full JSON Metadata"
              >
                JSON
              </button>
            </div>

            <button
              onClick={onTranscribeAnother}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Transcribe Another</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('segments')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'segments'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Timestamped Segments ({segments.length})
            </button>
            <button
              onClick={() => setActiveTab('fulltext')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fulltext'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Full Text View
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transcript..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-transparent focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {activeTab === 'segments' && (
              <button
                onClick={() => setShowTimestamps(!showTimestamps)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  showTimestamps
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timestamps</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[300px]">
        {activeTab === 'segments' ? (
          <div className="space-y-3">
            {filteredSegments.length > 0 ? (
              filteredSegments.map((seg) => (
                <TranscriptSegment
                  key={seg.id}
                  segment={seg}
                  showTimestamps={showTimestamps}
                  searchQuery={searchQuery}
                  onSegmentUpdate={handleSegmentUpdate}
                />
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                No transcript segments matched your search query "{searchQuery}".
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Full Continuous Devanagari Script
              </span>
              <button
                onClick={() => setIsEditingFullText(!isEditingFullText)}
                className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditingFullText ? 'Done Editing' : 'Edit Full Text'}
              </button>
            </div>

            {isEditingFullText ? (
              <textarea
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
                className="w-full p-4 text-base leading-relaxed bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-indigo-500 rounded-2xl focus:outline-none font-sans"
                rows={8}
              />
            ) : (
              <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-base leading-relaxed font-sans font-medium whitespace-pre-wrap">
                {fullText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
