#!/bin/bash

# Custom IDE - Electron Launcher
# Launches the Theia-based IDE as a native desktop application

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🖥️  Starting Custom IDE (Electron)..."
echo "   Desktop application launching..."
echo "   Press Ctrl+C to stop"
echo ""

npm run start --workspace=electron-app
