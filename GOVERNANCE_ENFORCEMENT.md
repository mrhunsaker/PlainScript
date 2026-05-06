# Code Quality & Governance Implementation

This document explains how PlainScript enforces code quality, accessibility standards, and
governance through multiple layers of automation.

## Three-Layer Enforcement Strategy

### Layer 1: Local Development (Pre-Commit Hooks)

**When**: Automatically on `git commit` before code is pushed  
**Tools**: Husky + lint-staged  
**Enforcement Level**: 🟢 Blocks commit if issues found

#### How it works:

1. **Pre-commit hook** (`.husky/pre-commit`):
   - Runs lint-staged on all staged files
   - ESLint fixes formatting and catches errors
   - Prettier reformats code
   - If any issues remain, commit is blocked

2. **Commit-msg hook** (`.husky/commit-msg`):
   - Validates commit message format (conventional commits)
   - Enforces: `type(scope): subject` format
   - Blocks commit with helpful error message if invalid

#### Setup:

```bash
npm install          # Husky hooks auto-installed via "prepare" script
# First commit may require: npx husky install
```

#### Expected workflow:

```bash
# User makes changes
git add .

# User attempts commit
git commit -m "feat(custom-ui): add feature"

# Pre-commit hooks run automatically:
# 1. ESLint checks syntax and style
# 2. Prettier auto-formats files
# 3. Commit-msg validates message format
# 4. If all pass → commit succeeds
# 5. If any fail → commit blocked with guidance

# User fixes issues and tries again
git add .
git commit -m "feat(custom-ui): add feature"
# ✅ Commit succeeds
```

---

### Layer 2: CI/CD on Every Push/PR (GitHub Actions)

**When**: Automatically when code is pushed or PR is created  
**Workflow**: `.github/workflows/ci.yml`  
**Enforcement Level**: 🟡 Blocks merge if required checks fail

#### Workflow jobs:

| Job                     | Purpose                            | Triggers Failure              | Runs On                               |
| ----------------------- | ---------------------------------- | ----------------------------- | ------------------------------------- |
| **lint**                | ESLint + Prettier formatting check | Code style violations         | All pushes + PRs                      |
| **build**               | Compile TypeScript, bundle apps    | Build errors                  | All pushes + PRs (needs lint to pass) |
| **security-audit**      | Check for high/critical CVEs       | High/critical vulnerabilities | All pushes + PRs (non-blocking)       |
| **accessibility-check** | Verify governance files + tooling  | Missing required files/config | All pushes + PRs (non-blocking)       |
| **summary**             | Final status report                | Lint or build failed          | All pushes + PRs                      |

#### Workflow triggers:

```yaml
on:
  push:
    branches: [main, develop] # Runs on push to main/develop
  pull_request:
    branches: [main, develop] # Runs on PR to main/develop
```

**Note**: The older `build-appimage.yml` workflow still runs only on tag push (`v*`) for releases.

#### Expected PR/Push experience:

```
Push code → GitHub detects push → CI workflow starts

Jobs run in parallel:
├─ Lint (2 min) → Pass/Fail
│  ├─ format:check (1 min)
│  └─ eslint (1 min)
├─ Build (5 min) → Pass/Fail (waits for Lint)
│  ├─ custom-ui build
│  ├─ browser-app build
│  └─ electron-app build
├─ Security Audit (2 min) → Warn/Pass (non-blocking)
└─ Accessibility Check (1 min) → Pass/Fail (non-blocking)

Final Summary:
✅ All required checks passed → PR can be merged
❌ Required check failed → PR blocked, requires fixes
```

#### Required vs Non-blocking checks:

**Required** (block merge):

- ✅ Lint & Format Check
- ✅ Build & Test

**Non-blocking** (warn but don't block):

- ⚠️ Security Audit
- ⚠️ Accessibility & Documentation

---

### Layer 3: Best Practices & Documentation

**When**: Developer reads before contributing  
**Files**: Governance and style guides  
**Enforcement Level**: 🔵 Documented expectations

#### Key files:

| File                                        | Purpose                   | Audience               |
| ------------------------------------------- | ------------------------- | ---------------------- |
| [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | Community standards       | All contributors       |
| [CONTRIBUTING.md](../CONTRIBUTING.md)       | How to contribute         | Developers             |
| [STYLE_GUIDE.md](../STYLE_GUIDE.md)         | Code conventions          | Developers             |
| [SECURITY.md](../SECURITY.md)               | Security practices        | Security-aware users   |
| [.eslintrc.json](../.eslintrc.json)         | ESLint configuration      | Automated enforcement  |
| [.prettierrc.json](../.prettierrc.json)     | Prettier configuration    | Automated enforcement  |
| [.lintstagedrc.json](../.lintstagedrc.json) | Staged file configuration | Pre-commit enforcement |

---

## Configuration Files Overview

### ESLint (`.eslintrc.json`)

Catches errors and enforces coding standards:

```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/explicit-function-return-types": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

**Enforces**:

- No `console.log()` in production code (warn only on error/warn)
- TypeScript strict mode
- Explicit function return types
- No `any` type usage
- Accessibility-focused naming (camelCase, PascalCase, UPPER_SNAKE_CASE)

### Prettier (`.prettierrc.json`)

Formats code automatically:

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

**Enforces**:

- 2-space indentation
- 100-character line length
- Semicolons required
- Single quotes (not double)
- Trailing commas in ES5-compatible syntax

### Lint-staged (`.lintstagedrc.json`)

Runs tools only on staged files for speed:

```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,less}": ["prettier --write"]
}
```

**Speed benefit**: Instead of checking 10,000+ files, only checks the 5-10 files you changed.

---

## Enforcement Summary Table

| Layer     | Tool                    | Timing     | Strictness      | Bypass Possible?                           |
| --------- | ----------------------- | ---------- | --------------- | ------------------------------------------ |
| **Local** | Husky + lint-staged     | On commit  | 🔴 Blocks       | `git commit --no-verify` (not recommended) |
| **Local** | Husky commit-msg        | On commit  | 🔴 Blocks       | `git commit --no-verify` (not recommended) |
| **CI/CD** | GitHub Actions lint     | On push/PR | 🟡 Blocks merge | PR approval override (requires maintainer) |
| **CI/CD** | GitHub Actions build    | On push/PR | 🟡 Blocks merge | PR approval override (requires maintainer) |
| **CI/CD** | GitHub Actions security | On push/PR | 🟢 Warning only | No (informational)                         |

---

## Getting Started as a Contributor

### First Time Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/PlainScript.git
cd PlainScript

# Install dependencies (automatically sets up Husky)
npm install

# Verify setup
npm run lint --help    # Should show ESLint help
npm run format --help  # Should show Prettier help
```

### Normal Contribution Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ... edit files ...

# Staged files for commit
git add .

# Commit (pre-commit hooks run automatically)
git commit -m "feat(custom-ui): add keyboard shortcuts"
# Pre-commit hooks:
# 1. ✓ ESLint runs (fixes issues)
# 2. ✓ Prettier runs (formats code)
# 3. ✓ Commit-msg validates message format
# → Commit succeeds or shows errors to fix

# Push to GitHub
git push origin feature/my-feature

# Create Pull Request on GitHub
# CI/CD workflow (ci.yml) runs automatically:
# 1. ✓ Lint check
# 2. ✓ Build check
# 3. ⚠️ Security audit (informational)
# 4. ⚠️ Accessibility check (informational)
# → If all pass, ready for review and merge
```

### If Pre-commit Fails

Common scenario: You commit, ESLint catches an issue.

```bash
# Your commit was blocked. Fix the errors shown:
# 1. Edit the files to fix issues
# 2. Stage changes again
git add .

# Try committing again
git commit -m "feat(custom-ui): add keyboard shortcuts"
# ✅ This time it should pass
```

### If PR Checks Fail on GitHub

Common scenario: Your PR is open but GitHub Actions reports a failing check.

```
❌ Lint & Format Check failed
   └─ Code formatting issues found

Fix:
1. Pull latest from upstream
   git fetch origin main
   git rebase origin/main
2. Format code locally
   npm run format
3. Add and commit
   git add .
   git commit --amend --no-edit
4. Push (overwrites existing PR)
   git push origin feature/my-feature --force-with-lease
→ CI/CD checks run again automatically
```

---

## Disable Hooks (Not Recommended)

If you need to bypass pre-commit hooks for a specific commit:

```bash
# Skip pre-commit hooks only
git commit --no-verify

# ⚠️ NOT RECOMMENDED - Use only for:
# - Emergency hotfixes
# - Temporary commits
# - Initial project setup
```

**Why it's not recommended**:

- CI/CD will still catch issues (just delays feedback)
- Code quality standards apply to everyone
- Difficult to review code with violations

---

## Verification

To verify enforcement is working:

### Test pre-commit hook (local)

```bash
# Try to commit with a console.log (should be caught)
echo "console.log('test');" >> custom-ui/src/frontend/test.ts
git add custom-ui/src/frontend/test.ts
git commit -m "test: debug"
# → Pre-commit hook should block this and warn about console.log
```

### Test commit-msg hook (local)

```bash
# Try invalid commit message (should be caught)
git commit --allow-empty -m "this message is invalid"
# → Commit-msg hook should reject this
```

### Test CI/CD checks (on GitHub)

```bash
# Make a PR with invalid code
# → ci.yml workflow runs automatically
# → Check Actions tab to see results
```

---

## References

- [CONTRIBUTING.md](../CONTRIBUTING.md) — How to contribute
- [STYLE_GUIDE.md](../STYLE_GUIDE.md) — Code conventions
- [SECURITY.md](../SECURITY.md) — Security practices
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)

---

**Last Updated**: May 2026  
**Version**: 1.0  
**Status**: Active & Enforced
