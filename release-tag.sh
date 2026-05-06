#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-v$(date +%Y.%m.%d)}"

if ! [[ "$TAG" =~ ^v[0-9]{4}\.[0-9]{2}\.[0-9]{2}$ ]]; then
  echo "Error: tag must match format vYYYY.MM.DD (example: v2026.05.06)" >&2
  exit 1
fi

DATE_PART="${TAG#v}"
DATE_DASHED="${DATE_PART//./-}"

if ! NORMALIZED_DATE="$(date -d "$DATE_DASHED" +%Y.%m.%d 2>/dev/null)"; then
  echo "Error: invalid date in tag '$TAG'" >&2
  exit 1
fi

if [[ "$NORMALIZED_DATE" != "$DATE_PART" ]]; then
  echo "Error: invalid date in tag '$TAG'" >&2
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: this script must be run inside a git repository" >&2
  exit 1
fi

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Error: local tag '$TAG' already exists" >&2
  exit 1
fi

if git ls-remote --exit-code --tags origin "refs/tags/$TAG" >/dev/null 2>&1; then
  echo "Error: remote tag '$TAG' already exists on origin" >&2
  exit 1
fi

git tag -a "$TAG" -m "Release $TAG"
git push origin "$TAG"

echo "Created and pushed tag: $TAG"
echo "This triggers .github/workflows/build-appimage.yml to build artifacts and attach them to the GitHub Release."