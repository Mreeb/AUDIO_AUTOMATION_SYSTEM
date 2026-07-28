import { useState, useEffect } from 'react';
import {
  Mic,
  Settings,
  Volume2,
  CheckCircle2,
  Clock,
  Award,
  RefreshCcw,
  Globe,
  Sliders
} from 'lucide-react';

import type { NavTab } from './components/AppSidebar';
import { AppSidebar } from './components/AppSidebar';
import { TopNavbar } from './components/TopNavbar';
import { AudioDropzone } from './components/AudioDropzone';
import { AudioPreview } from './components/AudioPreview';
import { TranscriptionProgress } from './components/TranscriptionProgress';
import { TranscriptViewer } from './components/TranscriptViewer';
import { RecentTranscriptionsTable } from './components/RecentTranscriptionsTable';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';

import type {
  AudioFile,
  TranscriptionJob,
  TranscriptionHistoryItem,
  TranscriptResult
} from './types';

import {
  MOCK_HISTORY,
  startTranscription,
  cancelTranscription
} from './services/transcriptionService';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTab>('new_transcription');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const [selectedAudio, setSelectedAudio] = useState<AudioFile | null>(null);
  const [currentJob, setCurrentJob] = useState<TranscriptionJob | null>(null);

  const [historyItems, setHistoryItems] = useState<TranscriptionHistoryItem[]>(MOCK_HISTORY);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleStartTranscription = async () => {
    if (!selectedAudio) return;

    const initialJob: TranscriptionJob = {
      id: `job-${Date.now()}`,
      file: selectedAudio,
      stage: 'uploading',
      progress: 10,
      stageMessage: 'Uploading audio to IndicCall AI engine...',
      estimatedTimeRemaining: 18,
      createdAt: new Date().toISOString()
    };

    setCurrentJob(initialJob);

    try {
      const finalJob = await startTranscription(selectedAudio, (stage, msg, p, rem) => {
        setCurrentJob((prev) => (prev ? { ...prev, stage, stageMessage: msg, progress: p, estimatedTimeRemaining: rem } : prev));
      });

      setCurrentJob(finalJob);

      if (finalJob.result) {
        const newItem: TranscriptionHistoryItem = {
          id: finalJob.id,
          fileName: finalJob.file.name,
          date: new Date().toLocaleString(),
          duration: finalJob.file.duration,
          status: 'Completed',
          language: 'Hindi (hi)',
          confidence: 0.95,
          engine: 'AI4Bharat IndicConformer',
          fullText: finalJob.result.fullText,
          segmentCount: finalJob.result.segments.length,
          transcriptResult: finalJob.result
        };
        setHistoryItems((prev) => [newItem, ...prev]);
      }
    } catch (err: any) {
      setCurrentJob((prev) =>
        prev
          ? {
              ...prev,
              stage: 'error',
              error: err.message || 'Transcription failed.'
            }
          : null
      );
    }
  };

  const handleCancelTranscription = () => {
    if (currentJob) {
      cancelTranscription(currentJob.id);
      setCurrentJob(null);
    }
  };

  const handleResetNewTranscription = () => {
    setSelectedAudio(null);
    setCurrentJob(null);
  };

  const handleViewHistoryItem = (item: TranscriptionHistoryItem) => {
    const file: AudioFile = {
      id: item.id,
      name: item.fileName,
      size: 500000,
      duration: item.duration,
      format: item.fileName.split('.').pop() || 'aac'
    };

    const result: TranscriptResult = item.transcriptResult || {
      id: `res-${item.id}`,
      jobId: item.id,
      fileName: item.fileName,
      engine: item.engine,
      language: item.language,
      duration: item.duration,
      fullText: item.fullText,
      segments: [
        { id: 1, start: 0, end: item.duration, text: item.fullText }
      ],
      createdAt: item.date
    };

    setSelectedAudio(file);
    setCurrentJob({
      id: item.id,
      file,
      stage: 'completed',
      progress: 100,
      stageMessage: 'Completed',
      estimatedTimeRemaining: 0,
      createdAt: item.date,
      result
    });

    setActiveTab('new_transcription');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <div className="hidden md:block h-full">
        <AppSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNavbar
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode(!darkMode)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {activeTab === 'new_transcription' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Mic className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    New Audio Call Transcription
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Upload your Hindi-English business call audio to generate raw Devanagari transcripts and subtitle files.
                  </p>
                </div>
                {selectedAudio && (
                  <button
                    onClick={handleResetNewTranscription}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start sm:self-auto"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Start Fresh
                  </button>
                )}
              </div>

              {!selectedAudio && !currentJob && (
                <AudioDropzone onAudioSelected={(f) => setSelectedAudio(f)} />
              )}

              {selectedAudio && (!currentJob || currentJob.stage === 'idle') && (
                <AudioPreview
                  file={selectedAudio}
                  onRemove={handleResetNewTranscription}
                  onReplace={handleResetNewTranscription}
                  onStartTranscription={handleStartTranscription}
                />
              )}

              {currentJob && currentJob.stage !== 'completed' && currentJob.stage !== 'error' && (
                <TranscriptionProgress
                  fileName={currentJob.file.name}
                  stage={currentJob.stage}
                  progress={currentJob.progress}
                  stageMessage={currentJob.stageMessage}
                  estimatedTimeRemaining={currentJob.estimatedTimeRemaining}
                  onCancel={handleCancelTranscription}
                />
              )}

              {currentJob && currentJob.stage === 'error' && (
                <ErrorState
                  message={currentJob.error || 'An unexpected error occurred during transcription.'}
                  onRetry={handleStartTranscription}
                />
              )}

              {currentJob && currentJob.stage === 'completed' && currentJob.result && (
                <div className="space-y-6 animate-fadeIn">
                  <TranscriptViewer
                    result={currentJob.result}
                    onTranscribeAnother={handleResetNewTranscription}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Call Analytics Overview
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  High-level performance metrics across all call transcriptions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Audio Files Processed
                    </span>
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      <Volume2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">3 Calls</div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    100% processed via IndicConformer
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Total Call Minutes
                    </span>
                    <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">4.6 Mins</div>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
                    277.2 seconds total speech
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Success Rate
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">100%</div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    0 Errors / Failed jobs
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Avg ASR Confidence
                    </span>
                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                      <Award className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">94.3%</div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    Devanagari ASR Accuracy
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    Recent Transcriptions
                  </h3>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View All History
                  </button>
                </div>

                <RecentTranscriptionsTable
                  items={historyItems}
                  onViewItem={handleViewHistoryItem}
                />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                  Transcription History
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Access and search all previously processed call audio files and export subtitle formats.
                </p>
              </div>

              {historyItems.length > 0 ? (
                <RecentTranscriptionsTable
                  items={historyItems}
                  onViewItem={handleViewHistoryItem}
                />
              ) : (
                <EmptyState
                  title="No Transcription History"
                  description="You haven't transcribed any call audios yet. Upload an audio file to start!"
                  actionLabel="Start New Transcription"
                  onAction={() => setActiveTab('new_transcription')}
                />
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  Engine & Model Settings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure IndicCall AI transcription backends and export preferences.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    ASR Model Engine
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          AI4Bharat IndicConformer
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-600 text-white rounded">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        600M parameter INT8 quantized model for raw Devanagari Hindi ASR without English translation.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 opacity-60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          Faster-Whisper (CTranslate2)
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 rounded">
                          Fallback
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        General multilingual Whisper engine for global speech recognition.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-500" />
                    Audio Chunking & Quantization
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        Speech Chunk Duration (Seconds)
                      </label>
                      <input
                        type="number"
                        defaultValue={12}
                        className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        CPU Compute Type
                      </label>
                      <select className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-indigo-500 focus:outline-none">
                        <option value="int8">INT8 Quantization (Low-End PC friendly)</option>
                        <option value="float32">Float32 Standard</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition-colors">
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
export default App;
