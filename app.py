import os
import sys
import io
import shutil
import tempfile
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from core.transcriber import AudioTranscriber

# Force UTF-8 encoding for console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

app = FastAPI(
    title="IndicCall AI API",
    description="Backend API for AI4Bharat IndicConformer Call Transcription & Analytics"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AUDIO_DIR = Path("AUDIOS")
OUTPUT_DIR = Path("OUTPUTS")
AUDIO_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

transcriber = None

def get_transcriber():
    global transcriber
    if transcriber is None:
        transcriber = AudioTranscriber(engine="indic-conformer")
    return transcriber

@app.get("/api/health")
def health():
    return {"status": "online", "product": "IndicCall AI", "version": "1.0"}

@app.get("/api/audios")
def list_audios():
    valid_exts = {".aac", ".mp3", ".wav", ".m4a", ".ogg", ".flac"}
    files = [f.name for f in AUDIO_DIR.iterdir() if f.is_file() and f.suffix.lower() in valid_exts]
    return {"audios": files}

@app.post("/api/transcribe")
async def transcribe_audio(
    file: UploadFile = File(None),
    existing_file_name: str = Form(None),
    language: str = Form("hi")
):
    try:
        if file:
            temp_path = AUDIO_DIR / file.filename
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            target_file = str(temp_path)
        elif existing_file_name:
            target_file = str(AUDIO_DIR / existing_file_name)
        else:
            raise HTTPException(status_code=400, detail="No audio file or existing_file_name provided.")

        engine = get_transcriber()
        result = engine.transcribe(target_file, language=language)
        exported = AudioTranscriber.export_all(result, str(OUTPUT_DIR))

        return {
            "success": True,
            "result": result,
            "exported": exported
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
