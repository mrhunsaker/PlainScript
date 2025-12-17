#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Cleaning repo build outputs and caches..."

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

remove_if_exists() {
  for p in "$@"; do
    if [ -e "$p" ]; then
      rm -rf "$p" || true
      echo "Removed: $p"
    fi
  done
}

# Node modules and locks
remove_if_exists node_modules package-lock.json

# Workspace outputs
remove_if_exists browser-app/lib browser-app/src-gen browser-app/dist
remove_if_exists electron-app/lib electron-app/src-gen electron-app/dist electron-app/plugins
remove_if_exists custom-ui/lib

# Downloaded plugins cache at repo root
remove_if_exists plugins

# Electron caches
remove_if_exists "$HOME/.cache/electron" "$HOME/.cache/electron-builder" "$HOME/Library/Caches/electron" "$HOME/Library/Caches/electron-builder"

echo "✅ Clean complete."
