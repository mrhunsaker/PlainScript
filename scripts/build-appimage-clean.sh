#!/usr/bin/env bash
set -euo pipefail

# Clean, rebuild, and package the PlainScript AppImage from scratch.
# Run this inside your toolbox (or a Linux shell with 7zip installed).

ROOT_DIR="/var/home/ryhunsaker/customIDE"
cd "$ROOT_DIR"

# 1) Remove build outputs and caches
rm -rf \
  "$ROOT_DIR/node_modules" \
  "$ROOT_DIR/.turbo" \
  "$ROOT_DIR/browser-app/node_modules" \
  "$ROOT_DIR/electron-app/node_modules" \
  "$ROOT_DIR/custom-ui/node_modules" \
  "$ROOT_DIR/browser-app/lib" \
  "$ROOT_DIR/browser-app/src-gen" \
  "$ROOT_DIR/electron-app/lib" \
  "$ROOT_DIR/electron-app/src-gen" \
  "$ROOT_DIR/electron-app/dist" \
  "$ROOT_DIR/browser-app/dist" \
  "$HOME/.npm" \
  "$HOME/.npm/_cacache" \
  "$HOME/.npm/_logs" \
  "$HOME/.turbo" \
  "$HOME/.cache/electron" \
  "$HOME/.cache/electron-builder"

# 2) Fresh install (skip Theia version check during CI/install)
SKIP_THEIA_CHECK=1 npm ci

# 3) Build each workspace (order matters: ui -> browser -> electron)
npm run build --workspace=custom-ui
npm run build --workspace=browser-app
npm run build --workspace=electron-app

# 4) Package the Electron app (AppImage lands in electron-app/dist)
npm run package --workspace=electron-app

echo "Done. AppImage should be in electron-app/dist/PlainScript-*-x86_64.AppImage"
