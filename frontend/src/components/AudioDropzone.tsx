import React, { useState, useRef } from 'react';
import { UploadCloud, FileAudio, Sparkles, AlertCircle } from 'lucide-react';
import type { AudioFile } from '../types';
import { SAMPLE_AUDIOS, uploadAudio } from '../services/transcriptionService';

interface AudioDropzoneProps {
  onAudioSelected: (file: AudioFile) => void;
  disabled?: boolean;
}

export const AudioDropzone: React.FC<AudioDropzoneProps> = ({ onAudioSelected, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['mp3', 'wav', 'm4a', 'aac', 'webm', 'ogg', 'flac'];

  const validateAndProcessFile = async (file: File) => {
    setErrorMessage(null);
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!supportedFormats.includes(ext)) {
      setErrorMessage(`Unsupported format .${ext}. Supported formats: ${supportedFormats.join(', ').toUpperCase()}`);
      return;
    }

    try {
      const audioFile = await uploadAudio(file);
      onAudioSelected(audioFile);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to read audio file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed border-slate-300 dark:border-slate-800' : ''
        } ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,.wav,.m4a,.aac,.webm,.ogg,.flac"
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25 group-hover:scale-110 transition-transform duration-300">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 text-center">
          Drag & drop your call audio file here
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
          Supports <span className="font-semibold text-slate-700 dark:text-slate-300">MP3, WAV, M4A, AAC, WebM</span> up to 500 MB.
        </p>

        <button
          type="button"
          disabled={disabled}
          className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm shadow-md shadow-indigo-600/25 transition-all duration-200"
        >
          Browse Files
        </button>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Or Try Sample Business Calls
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Pre-loaded 1.aac, 2.aac, 3.aac</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_AUDIOS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onAudioSelected(sample)}
              disabled={disabled}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all duration-200 group text-left"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <FileAudio className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {sample.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {sample.duration}s • {sample.format.toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
