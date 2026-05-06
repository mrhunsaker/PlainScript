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

$iconRoot = Join-Path $PSScriptRoot '..\electron-app\resources\icons'
$requiredIcons = @('plainscript.png', 'plainscript.ico')
foreach ($icon in $requiredIcons) {
	$iconPath = Join-Path $iconRoot $icon
	if (-not (Test-Path -Path $iconPath -PathType Leaf)) {
		Write-Error "ERROR: Required icon file missing: electron-app/resources/icons/$icon"
		Write-Host 'Run: cd electron-app/resources/icons && magick plainscript.png -define icon:auto-resize=256,48,32,16 plainscript.ico'
		exit 1
	}
}
Write-Host 'Icon files verified.'

$pluginItems = Get-ChildItem -Path (Join-Path $PSScriptRoot '..\plugins') -Exclude '.gitkeep','README.md' -ErrorAction SilentlyContinue
if (-not $pluginItems) {
	Write-Error 'ERROR: plugins/ directory appears empty. Run: npm run download:plugins'
	exit 1
}
Write-Host 'Plugins directory verified.'

Write-Host "🗜️  Packaging electron-app..."
npm run package --workspace=electron-app

Pop-Location
Write-Host "✅ Rebuild complete. Artifacts in electron-app/dist"
