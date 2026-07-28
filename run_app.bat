@echo off
title IndicCall AI - Launcher
echo ===================================================
echo           Starting IndicCall AI System
echo ===================================================
echo.

echo Starting FastAPI Backend Server on http://127.0.0.1:8000...
start "IndicCall AI Backend API" /min .venv\Scripts\python.exe app.py

echo Starting React Frontend Dashboard on http://127.0.0.1:5173...
cd frontend
start "IndicCall AI Web Dashboard" /min cmd /k "npm run dev -- --host 127.0.0.1 --port 5173"
cd ..

echo.
echo Application successfully launched!
echo - Web Dashboard: http://127.0.0.1:5173/
echo - Backend API   : http://127.0.0.1:8000/
echo.
pause
