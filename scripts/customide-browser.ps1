@echo off
REM Custom IDE - Browser Launcher (Windows)
REM Launches the Theia-based IDE in browser mode on http://localhost:3000

cd /d "%~dp0"

set URL=http://127.0.0.1:3000

echo.
echo.
echo 🌐 Starting Custom IDE (Browser)...
echo    Access at: %URL%
echo    Press Ctrl+C to stop
echo.

REM Try to open default browser (start uses file/protocol association)
start "" %URL%

npm run start --workspace=browser-app
pause
