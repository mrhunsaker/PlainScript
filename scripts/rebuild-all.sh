#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

"$ROOT_DIR/scripts/clean-all.sh"

echo "📦 Installing dependencies..."
npm config set fetch-retry-maxtimeout 120000
npm config set fetch-retries 5
npm install --no-audit

echo "🔌 Downloading Theia plugins..."
npm run download:plugins

echo "🧱 Building custom-ui..."
npm run build --workspace=custom-ui

echo "🌐 Building browser-app..."
npm run build --workspace=browser-app

echo "🖥️  Building electron-app (production)..."
export NODE_OPTIONS=--max_old_space_size=4096
npm run build --workspace=electron-app

echo "📁 Preparing plugins for electron runtime..."
npm run prepare:plugins --workspace=electron-app

echo "🗜️  Packaging electron-app..."
npm run package --workspace=electron-app

echo "✅ Rebuild complete. Artifacts in electron-app/dist"
