@echo off
title PlantCare AI - Development Mode
echo ========================================================
echo   PlantCare AI - Development Servers (Backend + Frontend)
echo ========================================================
echo.
echo Launching FastAPI backend on http://127.0.0.1:8000 ...
start "PlantCare AI Backend" cmd /k "py -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

echo Launching Vite frontend on http://localhost:5173 ...
start "PlantCare AI Frontend" cmd /k "cd frontend && npm.cmd run dev"

echo Both servers launched!
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
pause
