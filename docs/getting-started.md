# Getting Started

This page walks you through understanding the project structure and launching PlainScript for the
first time. For platform-specific install prerequisites see [Installation](installation.md).

---

## Prerequisites

| Requirement    | Minimum version | Notes                                                     |
| -------------- | --------------- | --------------------------------------------------------- |
| Node.js        | 20.0            | LTS recommended                                           |
| npm            | 10.0            | Bundled with Node 20                                      |
| Git            | any             | For cloning                                               |
| Python         | 3.8             | Required by native module builds                          |
| C/C++ compiler | —               | `gcc`/`g++` on Linux, Xcode CLT on macOS, MSVC on Windows |

---

## Clone and Install

```bash
git clone https://github.com/mrhunsaker/PlainScript.git
cd PlainScript
npm install
```

`npm install` will:

1. Install root devDependencies (TypeScript, ESLint, Prettier, Husky, Turbo).
2. Run `scripts/postinstall.js`, which performs a non-fatal Theia version compatibility check.
3. Install dependencies in each workspace (`custom-ui`, `browser-app`, `electron-app`).

Plugins are **not** downloaded automatically — run this explicitly afterwards:

```bash
npm run download:plugins
```

This fetches the VS Code–compatible extensions listed in root `package.json`'s `theiaPlugins` field
into `plugins/`.

---

## Build

```bash
npm run build
```

Turbo orchestrates the build across all three workspaces in dependency order:

```
custom-ui  →  browser-app
           →  electron-app
```

---

## Run

=== "Browser (Linux/macOS)"

    ```bash
    ./scripts/customide-browser.sh
    ```

=== "Browser (Windows)"

    ```powershell
    .\scripts\customide-browser.ps1
    ```

=== "Electron (Linux/macOS)"

    ```bash
    ./scripts/customide-electron.sh
    ```

=== "Electron (Windows)"

    ```powershell
    .\scripts\customide-electron.ps1
    ```

The browser app defaults to `http://localhost:3000`.

---

## Code Quality

Pre-commit hooks (Husky + lint-staged) run ESLint and Prettier automatically on staged files. Commit
messages are validated against the [Conventional Commits](https://www.conventionalcommits.org/)
format.

```bash
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check (used in CI)
```

---

## Release Tagging

```bash
npm run release:tag              # auto tag vYYYY.MM.DD
npm run release:tag -- v2026.05.06   # explicit date
```

This calls `release-tag.sh`, validates the date, and pushes an annotated tag to `origin`. GitHub
Actions then builds distributable artifacts automatically.
