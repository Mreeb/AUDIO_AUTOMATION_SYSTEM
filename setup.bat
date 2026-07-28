@echo off
echo ========================================================
echo   Setting up Virtual Environment (.venv) & Dependencies
echo ========================================================

IF NOT EXIST ".venv" (
    echo Creating Python Virtual Environment...
    python -m venv .venv
) ELSE (
    echo Virtual environment .venv already exists.
)

echo Activating .venv and installing requirements...
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt

echo.
echo ========================================================
echo   Setup Completed Successfully!
echo ========================================================
