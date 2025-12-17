#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Push-Location (Split-Path -Parent $PSCommandPath)\..

& .\scripts\clean-all.ps1

Write-Host "📦 Installing dependencies..."
npm config set fetch-retry-maxtimeout 120000 | Out-Null
npm config set fetch-retries 5 | Out-Null
npm install --no-audit

Write-Host "🔌 Downloading Theia plugins..."
npm run download:plugins

Write-Host "🧱 Building custom-ui..."
npm run build --workspace=custom-ui

Write-Host "🌐 Building browser-app..."
npm run build --workspace=browser-app

Write-Host "🖥️  Building electron-app (production)..."
$env:NODE_OPTIONS = "--max_old_space_size=4096"
npm run build --workspace=electron-app

Write-Host "📁 Preparing plugins for electron runtime..."
npm run prepare:plugins --workspace=electron-app

Write-Host "🗜️  Packaging electron-app..."
npm run package --workspace=electron-app

Pop-Location
Write-Host "✅ Rebuild complete. Artifacts in electron-app/dist"
