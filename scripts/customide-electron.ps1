@echo off
REM Custom IDE - Electron Launcher (Windows)
REM Launches the Theia-based IDE as a native desktop application

cd /d "%~dp0"

echo.
echo.
echo 🖥️  Starting Custom IDE (Electron)...
echo    Desktop application launching...
echo    Press Ctrl+C to stop
echo.

npm run start --workspace=electron-app
pause
