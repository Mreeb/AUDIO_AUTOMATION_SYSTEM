export type ProcessingStage = 
  | 'idle'
  | 'uploading'
  | 'preparing'
  | 'transcribing'
  | 'formatting'
  | 'completed'
  | 'error';

export interface AudioFile {
  id: string;
  name: string;
  size: number;
  duration: number;
  format: string;
  fileObject?: File;
  samplePath?: string;
  blobUrl?: string;
}

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  words?: {
    word: string;
    start: number;
    end: number;
    probability: number;
  }[];
}

export interface TranscriptResult {
  id: string;
  jobId: string;
  fileName: string;
  engine: string;
  language: string;
  duration: number;
  fullText: string;
  segments: TranscriptSegment[];
  createdAt: string;
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
  confidenceScore: number;
  timestamp: string;
  evidence: string;
  isDetected: boolean;
  category: 'contact' | 'product' | 'qualification' | 'objection' | 'next_steps';
}

export interface TranscriptionJob {
  id: string;
  file: AudioFile;
  stage: ProcessingStage;
  progress: number;
  stageMessage: string;
  estimatedTimeRemaining: number;
  error?: string;
  createdAt: string;
  result?: TranscriptResult;
  extractedFields?: ExtractedField[];
}

export interface TranscriptionHistoryItem {
  id: string;
  fileName: string;
  date: string;
  duration: number;
  status: 'Completed' | 'Failed' | 'Processing';
  language: string;
  confidence: number;
  engine: string;
  fullText: string;
  segmentCount: number;
  extractedLeadCount: number;
  audioUrl?: string;
  transcriptResult?: TranscriptResult;
  extractedFields?: ExtractedField[];
}
