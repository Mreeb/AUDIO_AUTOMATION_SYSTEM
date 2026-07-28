# Audio Automation System (Phase 1 - AI4Bharat IndicConformer Raw ASR)

A high-accuracy, lightweight, production-ready Audio Transcription System optimized for **Hindi & Indic Speech** using **AI4Bharat IndicConformer ONNX ASR**.

## 🌟 Key Features
- **AI4Bharat IndicConformer Engine**: Uses AI4Bharat's 600M INT8 Quantized Hybrid Conformer model for raw, native Hindi/Indic transcription without forced English translation or transliteration.
- **100% Full Un-truncated Audio Transcription**: Built-in 10-12s audio chunking ensures long audio files (2+ minutes) are transcribed completely from start to end.
- **Low-End PC CPU Quantization**: Consumes **< 300 MB RAM** and runs with high CPU efficiency using ONNX Runtime.
- **Multi-Format Export**: Automatically outputs `.txt`, `.srt` (subtitles), `.vtt` (web subtitles), and detailed `.json` metadata into the `OUTPUTS/` folder.
- **One-Click Launchers**: Includes `setup.bat` and `transcribe.bat` for easy Windows execution.

---

## 📁 Repository Structure
```
AUDIO_AUTOMATION_SYSTEM/
├── AUDIOS/              # Input directory for audio files (.aac, .mp3, .wav, .m4a)
├── OUTPUTS/             # Generated transcripts (.txt, .srt, .vtt, .json)
├── core/
│   └── transcriber.py   # Core AudioTranscriber engine with chunking
├── main.py              # CLI batch runner
├── requirements.txt     # Python dependencies
├── setup.bat            # Automated venv & dependency setup
└── transcribe.bat       # One-click batch runner
```

---

## 🚀 Quick Start

### 1. Setup Environment
Double-click `setup.bat` or run in terminal:
```cmd
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run Batch Transcription
Place your audio files into the `AUDIOS/` folder and double-click `transcribe.bat` or run:
```cmd
.venv\Scripts\python.exe main.py
```

### Options:
- `--engine`: `indic-conformer` (default) or `whisper`
- `--lang`: Language code (`hi` for Hindi, `ta` for Tamil, etc.)
- `--input`: Input folder path (default: `AUDIOS`)
- `--output`: Output folder path (default: `OUTPUTS`)

```cmd
.venv\Scripts\python.exe main.py --engine indic-conformer --lang hi
```
