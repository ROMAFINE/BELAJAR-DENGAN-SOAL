@echo off
title AI Quiz Starter
echo 🚀 Starting Web Ujian AI Quiz...

cd /d "%~dp0"

echo [1/3] Starting AI Backend (Flask)...
start "AI Backend" /min cmd /k "python ai_quiz_generator.py & pause"

echo [2/3] Starting Web Server (port 8000)...
start "Web Server" cmd /k "python -m http.server 8000 & pause"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser...
start http://localhost:8000/index.html

echo ✅ Ready! Backend:5000 Frontend:8000
pause

