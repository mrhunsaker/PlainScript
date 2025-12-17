#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  version-update.sh [patch|minor|major] [--no-git]

Description:
  Bumps the top-level "version" field in all repo JSON manifests.
  Only updates JSON files that have a top-level string version and are
  inside the repo (excluding node_modules, dist, plugins, electron-app/plugins).

  By default, creates a git commit, tags as v<version> (from electron-app/package.json),
  and pushes the branch and tag to origin. Use --no-git to skip commit/tag/push.

Examples:
  ./scripts/version-update.sh            # default: patch
  ./scripts/version-update.sh minor
  ./scripts/version-update.sh major
  ./scripts/version-update.sh patch --no-git
USAGE
}

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required (https://stedolan.github.io/jq/)." >&2
  exit 1
fi

RAW_BUMP=${1:-patch}
RAW_BUMP=$(printf '%s' "$RAW_BUMP" | tr '[:upper:]' '[:lower:]')
case "$RAW_BUMP" in
  patch|path) BUMP=patch ;;
  minor)      BUMP=minor ;;
  major)      BUMP=major ;;
  -h|--help|help) usage; exit 0 ;;
  *) echo "Error: unknown bump type '$RAW_BUMP' (expected patch|minor|major)" >&2; exit 2 ;;
esac

DO_GIT=1
for arg in "$@"; do
  case "$arg" in
    --no-git) DO_GIT=0 ;;
  esac
done

repo_root() {
  git rev-parse --show-toplevel 2>/dev/null || pwd
}

cd "$(repo_root)"

shopt -s nullglob

# Build file list: all JSON files except ignored locations.
mapfile -t files < <(\
  find . -type d \( -name .git -o -name node_modules -o -name dist -o -name .browser_modules -o -path './plugins' -o -path './electron-app/plugins' \) -prune -false -o \
  -type f -name '*.json' \
  ! -name 'package-lock.json' \
  -print | sort)

updated_count=0
declare -a updated_files
declare -a changes

bump_semver() {
  local ver="$1"
  # Strip any pre-release/build suffix for arithmetic bump
  local core suffix
  core=${ver%%[-+]*}
  suffix=${ver#${core}}
  local major minor patch
  IFS='.' read -r major minor patch <<<"$core"
  # Fallback zeros if parsing fails
  major=${major:-0}
  minor=${minor:-0}
  patch=${patch:-0}
  # Ensure integers only
  minor=${minor%%[^0-9]*}
  patch=${patch%%[^0-9]*}
  case "$BUMP" in
    major) major=$((major + 1)); minor=0; patch=0 ;;
    minor) minor=$((minor + 1)); patch=0 ;;
    patch) patch=$((patch + 1)) ;;
  esac
  printf '%d.%d.%d' "$major" "$minor" "$patch"
}

for f in "${files[@]}"; do
  # Only consider files with a top-level string version
  if ! jq -e 'has("version") and (.version|type=="string")' "$f" >/dev/null 2>&1; then
    continue
  fi
  current=$(jq -r '.version' "$f") || current=""
  # Ensure current looks like semver-ish (x.y.z...)
  if [[ ! "$current" =~ ^[0-9]+\.[0-9]+\.[0-9]+(.*)?$ ]]; then
    # Skip non-semver versions to avoid corruption
    continue
  fi
  next=$(bump_semver "$current")
  if [[ "$next" == "$current" ]]; then
    continue
  fi
  tmp=$(mktemp)
  if jq --arg v "$next" '(.version) = $v' "$f" > "$tmp" && mv "$tmp" "$f"; then
    updated_count=$((updated_count + 1))
    rel=${f#./}
    changes+=("$rel: $current -> $next")
    updated_files+=("$rel")
  else
    rm -f "$tmp"
    echo "Failed to update $f" >&2
    exit 1
  fi
done

if (( updated_count == 0 )); then
  echo "No JSON files with updatable top-level version were changed."
  exit 0
fi

echo "Updated $updated_count file(s):"
for c in "${changes[@]}"; do
  echo " - $c"
done

# If git actions are requested, commit, tag, and push.
if (( DO_GIT == 1 )); then
  if ! command -v git >/dev/null 2>&1; then
    echo "git not found; skipping commit and tag" >&2
    exit 0
  fi

  # Determine canonical version for tagging from electron-app/package.json
  tag_version=""
  if [[ -f electron-app/package.json ]]; then
    tag_version=$(jq -r '.version // empty' electron-app/package.json || true)
  fi
  if [[ -z "$tag_version" ]] || [[ ! "$tag_version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(.*)?$ ]]; then
    echo "Warning: could not determine a canonical version from electron-app/package.json; skipping tag/push." >&2
    exit 0
  fi

  # Stage only updated files
  for uf in "${updated_files[@]}"; do
    git add -- "$uf"
  done

  # Create commit if there is anything staged
  if ! git diff --cached --quiet; then
    git commit -m "chore: bump version to ${tag_version} (${BUMP})"
  else
    echo "No staged changes to commit."
  fi

  # Create annotated tag if it does not already exist
  if git rev-parse -q --verify "refs/tags/v${tag_version}" >/dev/null; then
    echo "Tag v${tag_version} already exists; skipping tag creation."
  else
    git tag -a "v${tag_version}" -m "PlainScript ${tag_version}"
  fi

  # Push current branch and tag (origin)
  current_branch=$(git rev-parse --abbrev-ref HEAD)
  if git rev-parse --git-dir >/dev/null 2>&1; then
    git push origin "$current_branch" || true
    git push origin "v${tag_version}" || true
  fi
fi

exit 0
