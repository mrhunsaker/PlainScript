#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "🧹 Cleaning repo build outputs and caches..."

function Remove-IfExists([string] $path) {
  if (Test-Path $path) {
    Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
    Write-Host "Removed: $path"
  }
}

Push-Location (Split-Path -Parent $PSCommandPath)\..

# Node modules and lock
Remove-IfExists node_modules
if (Test-Path package-lock.json) { Remove-Item -Force package-lock.json }

# Workspace outputs
Remove-IfExists browser-app\lib
Remove-IfExists browser-app\src-gen
Remove-IfExists browser-app\dist
Remove-IfExists electron-app\lib
Remove-IfExists electron-app\src-gen
Remove-IfExists electron-app\dist
Remove-IfExists electron-app\plugins
Remove-IfExists custom-ui\lib

# Downloaded plugins at repo root
Remove-IfExists plugins

# Electron caches
Remove-IfExists "$env:LOCALAPPDATA\electron\Cache"
Remove-IfExists "$env:LOCALAPPDATA\electron-builder\Cache"

Pop-Location
Write-Host "✅ Clean complete."
