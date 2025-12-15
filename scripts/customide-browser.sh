#!/bin/bash

# Custom IDE - Browser Launcher
# Launches the Theia-based IDE in browser mode on http://localhost:3000

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

URL="http://127.0.0.1:3000"

echo "🌐 Starting Custom IDE (Browser)..."
echo "   Access at: $URL"
echo "   Press Ctrl+C to stop"
echo ""

# Fire-and-forget open of the default browser; won't fail the launch if missing.
if command -v xdg-open >/dev/null 2>&1; then
	(xdg-open "$URL" >/dev/null 2>&1 &)
elif command -v open >/dev/null 2>&1; then
	(open "$URL" >/dev/null 2>&1 &)
else
	echo "   (Tip: open $URL manually; no known opener found)"
fi

npm run start --workspace=browser-app
