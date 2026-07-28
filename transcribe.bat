@echo off
echo ========================================================
echo   Running Audio Automation Transcription System
echo ========================================================

IF NOT EXIST ".venv" (
    echo .venv not found. Running setup first...
    call setup.bat
)

call .venv\Scripts\activate.bat
python main.py %*
