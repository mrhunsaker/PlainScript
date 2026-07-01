#!/usr/bin/env pwsh
# Custom IDE - Electron Launcher (Windows)
# Launches the Theia-based IDE as a native desktop application

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Push-Location (Split-Path -Parent $PSCommandPath)\..

Write-Host ""
Write-Host "🖥️  Starting Custom IDE (Electron)..."
Write-Host "   Desktop application launching..."
Write-Host "   Press Ctrl+C to stop"
Write-Host ""

try {
    npm run start --workspace=electron-app
} finally {
    Pop-Location
}
