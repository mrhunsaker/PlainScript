#!/usr/bin/env pwsh
# Custom IDE - Browser Launcher (Windows)
# Launches the Theia-based IDE in browser mode on http://localhost:3000

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Push-Location (Split-Path -Parent $PSCommandPath)\..

$Url = 'http://127.0.0.1:3000'

Write-Host ""
Write-Host "🌐 Starting Custom IDE (Browser)..."
Write-Host "   Access at: $Url"
Write-Host "   Press Ctrl+C to stop"
Write-Host ""

# Fire-and-forget open of the default browser; won't fail the launch if missing.
try {
    Start-Process $Url | Out-Null
} catch {
    Write-Host "   (Tip: open $Url manually; could not launch a browser automatically)"
}

try {
    npm run start --workspace=browser-app
} finally {
    Pop-Location
}
