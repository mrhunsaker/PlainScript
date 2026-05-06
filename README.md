# PlainScript IDE - Minimal, Accessible Theia-Based Development Environment

A fully customized, lightweight IDE built on Theia with support for both browser-based and Electron
desktop versions. Designed with **simplicity and screenreader accessibility** as core principles.

## Vision

PlainScript is a community project to demonstrate how to build a **minimal, focused IDE** from Theia
with:

- **Accessibility First**: Screenreader-compatible, keyboard-navigable, no visual-only controls
- **Simplicity**: Only essential features; no clutter, no distraction
- **Transparency**: Clear documentation of what's included and what's excluded, and why
- **Reproducibility**: Easy to fork and customize as a starting point for your own IDE

## Features

- **Dual Platform Support**: Browser-based (any OS) + native Electron desktop application
- **Accessible by Design**:
  - Semantic HTML with proper ARIA labels
  - Full keyboard navigation (no mouse required)
  - Screenreader-friendly UI structure
  - Catppuccin theme family with accessible contrast options
- **Simple Launch Scripts**: `customide-browser` and `customide-electron` commands (Bash &
  PowerShell)
- **Streamlined UI Layout**:
  - Top-oriented tabs for better navigation structure
  - Files panel only (explorer with clear labeling)
  - Locked output panel (always available, not hidden)
  - No sidebar clutter; single focused work area
- **Minimal, Intentional Plugin Ecosystem**: Only 4 VSCode-compatible extensions from Open VSX
- **Focused Theme Selection**: Catppuccin color palettes with matching Catppuccin icons
- **Smart Features**:
  - Indent Rainbow visualization for code structure
  - Search-in-workspace functionality
  - Integrated terminal
  - Git support with GitHub authentication
  - Full debugging capabilities
- **Fast Performance**: Lightweight footprint, quick startup, responsive UI
- **Open Source & Extensible**: Apache 2.0 license; easy to fork and customize

## Project Structure

```
customIDE/
├── customide-browser        # Quick launch script (Bash)
├── customide-browser.ps1    # Quick launch script (PowerShell)
├── customide-electron       # Quick launch script (Bash)
├── customide-electron.ps1   # Quick launch script (PowerShell)
├── browser-app/             # Browser-based Theia application
├── electron-app/            # Electron desktop application
├── custom-ui/               # Custom UI plugin with layout & command customizations
├── plugins/                 # VSCode extensions (minimal selection)
├── package.json             # Root monorepo configuration
├── README.md                # This file
└── LICENSE                  # Apache 2.0 license
```

## Prerequisites

### Runtime Requirements

- **Node.js**: >= 20.0
- **npm**: >= 10.0
- **Git**: For cloning and version control
- **Python**: >= 3.8 (required by some native modules during build)
- **C/C++ Compiler**: For compiling native modules

### System Packages by Distribution

#### Fedora / RHEL / CentOS (RPM-based)

```bash
sudo dnf install -y \
  nodejs npm git \
  gcc g++ make python3 \
  libxkbfile-devel libxkbcommon-devel \
  libX11-devel \
  mesa-libGL-devel \
  pango-devel \
  cairo-devel
```

For RHEL 10 with additional repos:

```bash
sudo subscription-manager repos --enable=rhel-appstream --enable=codeready-builder
sudo dnf install -y \
  nodejs npm git \
  gcc g++ make python3 \
  libxkbfile-devel libxkbcommon-devel \
  libX11-devel \
  mesa-libGL-devel \
  pango-devel \
  cairo-devel
```

#### Ubuntu / Debian (APT-based)

```bash
sudo apt update
sudo apt install -y \
  nodejs npm git \
  build-essential python3 python3-dev \
  libx11-dev libxkbfile-dev libxkbcommon-dev \
  libgl1-mesa-dev \
  libpango-1.0-0 libpango1.0-dev \
  libcairo2-dev
```

#### Arch Linux / Manjaro (Pacman-based)

```bash
sudo pacman -S \
  nodejs npm git \
  gcc make python3 \
  libx11 libxkbfile libxkbcommon \
  mesa \
  pango cairo
```

#### openSUSE (Zypper-based)

```bash
sudo zypper install -y \
  nodejs npm git \
  gcc gcc-c++ make python3 \
  libX11-devel libxkbfile-devel libxkbcommon-devel \
  mesa-libGL-devel \
  pango-devel cairo-devel
```

#### Alpine Linux (APK-based)

```bash
apk add \
  nodejs npm git \
  gcc g++ make python3 \
  musl-dev linux-headers \
  libx11-dev libxkbfile-dev libxkbcommon-dev \
  mesa-dev \
  pango-dev cairo-dev
```

#### NixOS (Nix-based)

Add to `flake.nix` or use a development shell:

```nix
with import <nixpkgs> {};
mkShell {
  buildInputs = [
    nodejs npm git python3
    gcc gnumake pkg-config
    libX11 libxkbfile libxkbcommon
    libGL pango cairo
  ];
}
```

### Windows

1. **Node.js & npm**: Download from [nodejs.org](https://nodejs.org) (includes npm)
2. **Git**: Download from [git-scm.com](https://git-scm.com) (or use `winget install git`)
3. **Python**: Download from [python.org](https://www.python.org) or `winget install python`
4. **C++ Build Tools**: Install Visual Studio Build Tools or:

   ```powershell
   npm install --global windows-build-tools
   ```

5. **CMake** (optional, for some native modules):

   ```powershell
   choco install cmake
   # or
   winget install Kitware.CMake
   ```

### macOS

```bash
# Using Homebrew (install from https://brew.sh if needed)
brew install node git python3
xcode-select --install  # Installs C compiler and build tools
```

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/mrhunsaker/PlainScript.git
cd PlainScript

npm install
npm run download:plugins
```

### 2. Verify Installation

```bash
node --version   # Should be v20.0 or later
npm --version    # Should be 10.0 or later
npm run build --workspace=custom-ui
```

If build succeeds, the IDE is ready.

### 3. Launch the IDE

**Option A: Using launch scripts (recommended)**

Linux/macOS:

```bash
./customide-browser    # Launch browser version
# or
./customide-electron   # Launch Electron version
```

Windows (PowerShell):

```powershell
.\customide-browser.ps1
# or
.\customide-electron.ps1
```

**Option B: Direct npm commands**

Browser version:

```bash
npm run start --workspace=browser-app
# Access at http://localhost:3000
```

Electron version:

```bash
npm run start --workspace=electron-app
```

Both simultaneously:

```bash
npm run start
```

## Transparency: What's Included vs. Excluded

### Philosophy

PlainScript intentionally excludes many features to prioritize **accessibility and simplicity**.
This section documents exactly what's loaded and what's not, and why.

### Included: Plugins (4 carefully selected)

Configured in root `package.json` under `theiaPlugins`:

1. **Eclipse Theia Builtin Extension Pack** (eclipse-theia.builtin-extension-pack v1.95.3)
   - Language servers for JavaScript, Python, Go, Rust, and other core languages
   - Essential for code intelligence, completion, and debugging
   - **Why included**: Developers expect syntax support; essential for productivity

2. **Catppuccin Theme** (Catppuccin.catppuccin-vsc)
   - Four official Catppuccin palettes: Latte, Frappé, Macchiato, Mocha
   - Latte is the default (light)
   - **Why included**: cohesive, well-maintained color system; all four variants are WCAG-tested by
     the Catppuccin project

3. **Catppuccin VSC Icons** (Catppuccin.catppuccin-vsc-icons v1.26.0)
   - Colorful, semantic file type icons
   - Helps quick visual file identification without relying on text alone
   - **Why included**: Visual accessibility for file exploration

4. **Indent Rainbow** (oderwat.indent-rainbow v8.3.1)
   - Adds rainbow-colored indentation guides
   - Helps structure visualization in nested code
   - **Why included**: Assistive visualization for code structure; activated on startup

### Excluded: Views & Features

The following Theia UI views are **intentionally hidden** via contribution filters in `custom-ui`:

| View                          | Why Excluded                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| **Debug**                     | Debugging UI adds visual complexity; developers who need it can enable manually             |
| **Test**                      | Testing UI not essential for core editing; adds UI clutter                                  |
| **SCM (Source Control)**      | Git functionality available via command palette and status bar; dedicated panel unnecessary |
| **Outline**                   | Structure outline duplicates breadcrumb navigation; reduces cognitive load                  |
| **Call Hierarchy**            | Advanced feature; not needed for most developers                                            |
| **Problems Panel**            | Errors shown inline; dedicated panel adds clutter                                           |
| **Plugins View**              | Extension management UI hidden; users learn the IDE first before managing plugins           |
| **Tasks**                     | Task runner UI hidden; use terminal instead (more accessible)                               |
| **Notebook**                  | Jupyter notebook support excluded; focus on traditional code editors                        |
| **Breadcrumb**                | Navigation via Files panel instead; breadcrumb adds extra UI layer                          |
| **Minimap**                   | Code overview adds visual elements; rely on search and scrolling                            |
| **Activity Bar (right side)** | Hidden; top tabs used instead                                                               |

**Accessibility rationale**: Fewer UI elements = less cognitive load, clearer screen reader
navigation, fewer visual distractions, easier keyboard-only workflow.

### Excluded: Commands & Menu Items

Removed via `custom-ui` command filtering:

| Command                    | Why Excluded                                           |
| -------------------------- | ------------------------------------------------------ |
| Workspace-related commands | Monorepo/workspace features create UI complexity       |
| Help menu items            | Documentation available externally; menu items clutter |
| About dialog               | Project info in README instead                         |
| Show Welcome page          | Avoids startup splash; users learn by doing            |
| Switch editor group        | Horizontal-only layout; no complex split arrangements  |

### UI Layout Choices

**What's visible**:

- **Files panel** (left): Labeled "Files", non-closable, non-draggable. Always present for file
  navigation.
- **Editor area** (center): Main code editing. Supports multiple tabs (top-oriented).
- **Output panel** (bottom): Locked, always accessible. Shows terminal output, build results, etc.
- **Top tabs**: Open files shown as tabs at top of editor. Standard list format
  (keyboard-navigable).

**What's hidden**:

- Right sidebar (removed)
- Activity bar (right-side icon bar)
- Debug/test UI panels
- Welcome/startup screens
- Context menus (use command palette instead)

**Why**: Screenreader users benefit from linear, predictable UI. Fewer panels = easier to navigate
with Tab and arrow keys.

### Accessibility Features

1. **Semantic HTML**: Proper ARIA labels, roles, and landmarks in custom UI
2. **Keyboard Navigation**: Full IDE control via keyboard; no mouse required
3. **High-Contrast Colors**: Catppuccin Latte meets WCAG AA for most UI text; Macchiato and Mocha
   offer higher contrast ratios for body text on dark backgrounds
4. **Clear Focus Indicators**: Visible focus rings on buttons, inputs, tree items
5. **Logical Tab Order**: Files → Editor → Output (top to bottom)
6. **Command Palette**: Accessible via `Ctrl/Cmd+Shift+P`; text-based, no visual-only buttons
7. **Status Bar**: Shows language, line/column, git branch, error count (screenreader readable)
8. **Terminal**: Integrated terminal for shell commands (accessible via keyboard)
9. **Forced Colors**: Compatible with Windows High Contrast mode
10. **Reduced Motion**: Animations and transitions are suppressed when prefers-reduced-motion is set

## Configuration

### Plugins

Configured in root `package.json` under `theiaPlugins`. See
[Transparency section](#transparency-whats-included-vs-excluded) for full rationale.

Current selection:

- **Eclipse Theia Builtin Extension Pack**: Language servers (JavaScript, Python, Go, Rust, etc.)
- **Catppuccin Theme**: Four official palettes (Catppuccin Latte, Catppuccin Frappé, Catppuccin
  Macchiato, Catppuccin Mocha)
- **Catppuccin VSC Icons**: Semantic file type icons
- **Indent Rainbow**: Code structure visualization (auto-enabled)

### Theme & Icon Settings

Both apps use identical settings (aligned to Theia 1.67.0):

```json
{
   "workbench.colorTheme": "Catppuccin Latte",
  "workbench.iconTheme": "Catppuccin VSC Icons - Latte",
  "security.workspace.trust.enabled": false,
  "security.workspace.trust.startupPrompt": "never",
  "extensions.ignoreRecommendations": true,
  "extensions.verifySignature": false
}

Valid color theme names:
- `Catppuccin Latte`
- `Catppuccin Frappé`
- `Catppuccin Macchiato`
- `Catppuccin Mocha`

Recommended icon pairing:
- `Catppuccin VSC Icons - Latte` with `Catppuccin Latte`
- `Catppuccin VSC Icons - Frappé` with `Catppuccin Frappé`
- `Catppuccin VSC Icons - Macchiato` with `Catppuccin Macchiato`
- `Catppuccin VSC Icons - Mocha` with `Catppuccin Mocha`
```

Edit in `browser-app/package.json` or `electron-app/package.json` under
`theia.frontend.config.preferences`.

### Custom UI Features

The `custom-ui` plugin provides:

- **Contribution Filters**: Removes debug, test, SCM, outline, hierarchy, problems, plugins, tasks,
  notebook, window views
- **Command Cleanup**: Removes workspace commands, About/Help menus; adds Files, Search, Terminal,
  Output tabs
- **Explorer Widget**: Labeled "Files", non-closable, non-draggable
- **Output Panel**: Locked, no close button, toolbar buttons hidden
- **Shell Layout**: Top-oriented tabs, no right panel, horizontal-only splits
- **Island Styling**: Rounded corners, gaps, transparent backgrounds, modern aesthetics

### Customizing Splash/Preload Screen

The splash screen (loading screen shown before the IDE loads) can be customized for both browser and
desktop versions.

**Location**:

- Browser: `browser-app/resources/preload.html`
- Electron: `electron-app/resources/preload.html`

Both files are identical and can be customized independently if desired.

**How to Customize**:

1. **Edit the HTML content** between the `<div class="splash-content">` tags:

   ```html
   <div class="splash-content">
     <p class="splash-title">Your Custom Title</p>
     <p class="splash-message">Your custom message</p>
   </div>
   ```

2. **Modify the styles** in the `<style>` block:
   - `background-color`: Change `#1e1e1e` for different background
   - `.splash-title`: Adjust font size, color, weight
   - `.splash-message`: Modify text color and font size
   - `.splash-spinner`: Customize the loading spinner appearance

3. **Replace the spinner SVG** with your own logo or animation:

   ```html
   <div class="splash-spinner">
     <img src="your-logo.png" alt="Loading..." />
   </div>
   ```

4. **Add custom CSS animations** for branded loading effects:

   ```css
   @keyframes customAnimation {
     0% {
       transform: scale(1);
     }
     50% {
       transform: scale(1.1);
     }
     100% {
       transform: scale(1);
     }
   }
   ```

**Example - Custom Company Branding**:

```html
<div class="splash-content">
  <p class="splash-title">MyCompany IDE</p>
  <p class="splash-message">Initializing workspace...</p>
  <p style="font-size: 12px; color: #888; margin-top: 20px;">Version 1.0 • MyCompany © 2025</p>
</div>
```

**Tips**:

- Keep file size small (the splash shows before anything loads)
- Avoid external dependencies (use inline SVG or base64 images)
- Test both browser and Electron versions after changes
- The splash appears momentarily, so optimize for quick visibility
- Colors should contrast well with the background (default dark grey: `#1e1e1e`)

## Building & Distribution

### Full Build Process

The complete build pipeline compiles TypeScript, bundles workspaces, and optionally packages for
distribution.

#### 1. Verify Build Environment

```bash
# Confirm Node.js and npm versions
node --version   # Should be v20 or later
npm --version    # Should be 10.0 or later

# Confirm Python is available (required for native module compilation)
python3 --version
```

If any version is too old, upgrade via your package manager (see Prerequisites section above).

#### 2. Clean Install

```bash
cd /path/to/PlainScript

# Remove old node_modules and caches
rm -rf node_modules package-lock.json

# Fresh install
npm install
```

This ensures all dependencies are correctly installed and linked across the monorepo.

#### 3. Download Plugins

```bash
npm run download:plugins
```

This fetches VSCode extensions from Open VSX and stages them in `plugins/`.

**Verify**: The `plugins/` directory should contain at least these folders:

- `eclipse-theia.builtin-extension-pack/`
- `Catppuccin.catppuccin-vsc/`
- `Catppuccin.catppuccin-vsc-icons/`
- `oderwat.indent-rainbow/`

#### 4. Build All Workspaces

Build in order:

```bash
# 1. Build the custom UI plugin
npm run build --workspace=custom-ui

# 2. Bundle the browser app
npm run bundle --workspace=browser-app

# 3. Bundle the Electron app
npm run bundle --workspace=electron-app
```

Each step should exit with code 0 and show no TypeScript or bundling errors.

**What each build does**:

- `custom-ui`: Compiles TypeScript → `lib/`, emits CSS and type declarations
- `browser-app`: Generates Theia Webpack config, bundles with custom-ui plugin
- `electron-app`: Rebuilds native modules for Electron, bundles Theia + Electron runtime

#### 5. Verify Build Artifacts

```bash
# Check custom-ui output
ls -la custom-ui/lib/frontend/*.js

# Check browser app output
ls -la browser-app/lib/

# Check electron app output (contains Theia + Electron)
ls -la electron-app/lib/
```

All directories should contain `.js`, `.css`, and potentially `.map` files (sourcemaps).

#### 6. Test the Build (Optional but Recommended)

**Browser version** (any platform):

```bash
npm run start --workspace=browser-app
# Open http://localhost:3000 in a browser
```

**Electron version** (requires X11 on Linux, or WSL2 on Windows):

```bash
npm run start --workspace=electron-app
```

Both should launch and be fully functional (Files panel visible, commands accessible via
Ctrl/Cmd+Shift+P).

### Automated Clean Build

For a guaranteed clean build (especially on CI/CD or after major updates):

```bash
# Run the clean build script
bash scripts/rebuild-all.sh  # Linux/macOS
# or
powershell -ExecutionPolicy Bypass -File scripts\rebuild-all.ps1  # Windows
```

This script:

1. Removes all `node_modules`, caches, and build artifacts
2. Reinstalls dependencies
3. Downloads plugins
4. Runs the full build pipeline
5. Reports success/failure

### Troubleshooting Build Failures

#### Error: "Cannot find module 'copy-webpack-plugin'"

**Cause**: Missing dependency in `node_modules`.

**Fix**:

```bash
npm install
npm run bundle --workspace=browser-app
```

The `copy-webpack-plugin` is in root `devDependencies` (required by Theia's generated webpack
config).

#### Error: "gyp ERR! configure error" or "node-gyp rebuild failed"

**Cause**: Native module compilation failed. Missing system libraries or C++ compiler.

**Fix (by distribution)**:

**Fedora/RHEL/CentOS**:

```bash
sudo dnf install -y gcc g++ make python3 libxkbfile-devel libxkbcommon-devel libx11-devel
npm ci
```

**Ubuntu/Debian**:

```bash
sudo apt update
sudo apt install -y build-essential python3-dev libx11-dev libxkbfile-dev libxkbcommon-dev
npm ci
```

**Arch/Manjaro**:

```bash
sudo pacman -S gcc make python3 libx11 libxkbfile libxkbcommon
npm ci
```

**macOS**:

```bash
xcode-select --install
npm ci
```

**Windows**:

```powershell
npm install --global windows-build-tools
npm ci
```

After installing system packages, retry: `npm ci` then `npm run build`.

#### Error: "electron-rebuild: Permission denied"

**Cause**: Shim script in `node_modules/.bin/electron-rebuild` lacks execute permissions.

**Fix**:

```bash
chmod +x node_modules/.bin/electron-rebuild
npm run bundle --workspace=electron-app
```

#### Error: "Dependencies are out of sync, please run 'install' again"

**Cause**: Theia internal version check detected mismatched dependencies.

**Fix**:

```bash
npm install
npm run bundle --workspace=electron-app
```

If persists, check that `electron-app/package.json` specifies `electron: "38.4.0"` (not a newer
version). Theia 1.67.0 requires Electron 38.x.

#### Error: "ENOENT: no such file or directory" on scripts

**Cause**: Scripts (`customide-browser`, `customide-electron`) lack execute permissions.

**Fix**:

```bash
chmod +x customide-browser customide-electron
./customide-browser
```

#### Error: "Port 3000 already in use" (browser app)

**Fix**:

```bash
# Find and kill the process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
cd browser-app && npm start -- --port=4000
```

### Packaging for Distribution

#### Linux AppImage (Recommended for Linux users)

```bash
bash scripts/build-appimage-clean.sh
```

Output: `electron-app/dist/PlainScript-*-x86_64.AppImage`

**To run the AppImage**:

```bash
chmod +x dist/PlainScript-*.AppImage
./dist/PlainScript-*.AppImage
```

#### macOS DMG and Windows NSIS Installer

See [PACKAGING.md](./PACKAGING.md) for detailed cross-platform packaging instructions including:

- DMG creation on macOS
- NSIS installer on Windows
- Code signing and notarization
- Icon and resource requirements

#### Manual Package Step (Advanced)

If you've already completed the build (steps 1–6 above):

```bash
npm run package --workspace=electron-app
```

This runs `electron-builder`, which:

- Detects platform (Linux, macOS, or Windows)
- Creates platform-specific installer(s) in `electron-app/dist/`
- Can take several minutes

**Output locations**:

- **Linux**: `electron-app/dist/PlainScript-*-x86_64.AppImage` (and `.snap`, `.deb` if configured)
- **macOS**: `electron-app/dist/PlainScript-*.dmg` and `PlainScript-*.zip`
- **Windows**: `electron-app/dist/PlainScript-*-Setup.exe` (and `.exe` portable)

See [PACKAGING.md](./PACKAGING.md) for platform-specific configuration.

### Automated CI/CD with GitHub Actions

Once you push to GitHub, automated builds trigger on tag push:

**Workflow** (`.github/workflows/build-appimage.yml`):

- Builds AppImage on Linux
- Builds DMG + ZIP on macOS
- Builds NSIS + Portable EXE on Windows
- All platforms build in parallel
- Artifacts appear in GitHub Release

**To use**:

```bash
# Tag and push
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions builds all three platforms automatically
# Check Actions tab for progress
# Artifacts appear in Release when complete
```

No manual packaging needed once CI/CD is configured.

## Development

**Root** (`npm run <cmd>`):

```bash
build               # Build all workspaces (production)
start               # Start browser + Electron simultaneously
watch               # Watch mode for development (hot reload)
download:plugins    # Download configured VSCode extensions
clean               # Remove build artifacts
```

**Browser app** (`npm run <cmd> --workspace=browser-app`):

```bash
build               # Production build
bundle              # Dev build with watch
rebuild             # Rebuild Theia distribution
start               # Start server (port 3000)
watch               # Watch and rebuild
```

**Electron app** (`npm run <cmd> --workspace=electron-app`):

```bash
bundle              # Dev build with watch
rebuild             # Rebuild for Electron
start               # Launch desktop app
watch               # Watch and rebuild
```

**Custom UI** (`npm run <cmd> --workspace=custom-ui`):

```bash
build               # Build Vite bundle + TypeScript defs
dts                 # Generate type declarations
```

### Modifying Custom UI

Plugin source code in `custom-ui/src/frontend/`:

- `index.ts` - Plugin entry, registers all contributions
- `application-shell.ts` - Shell layout, panel sizing, drag restrictions
- `navigator-widget-factory.ts` - Custom Explorer/"Files" widget
- `commands-contributions.ts` - Command and menu customization
- `contribution-filters.ts` - View filtering (removes unwanted modules)
- `output-toolbar-contribution.ts` - Output panel lock state and controls
- `style/application-shell.less` - Island-style visual design
- `style/side-panel.less` - Top tabs styling

To modify:

```bash
# 1. Edit files in custom-ui/src/frontend/
# 2. Rebuild the plugin
npm run build --workspace=custom-ui

# 3. Rebuild browser and/or electron apps
npm run bundle --workspace=browser-app
npm run bundle --workspace=electron-app

# 4. Restart the application
```

### Adding Plugins

1. Find extension on [Open VSX Registry](https://open-vsx.org)
2. Get the VSIX download URL
3. Add to root `package.json` > `theiaPlugins`:

   ```json
   "publisher.extension-name": "https://open-vsx.org/api/publisher/extension-name/version/file/...vsix"
   ```

4. Run `npm run download:plugins`
5. Restart app

### Removing Plugins

1. Remove entry from root `package.json` > `theiaPlugins`
2. Delete the plugin folder from `plugins/`
3. Restart app

### Code Quality & Style

PlainScript enforces code quality through automated linting and formatting tools.

**Linting** (catch errors and style violations):

```bash
npm run lint              # Check all files
npm run lint:fix          # Auto-fix issues
```

**Formatting** (consistent code style):

```bash
npm run format            # Format all files
npm run format:check      # Check without modifying
```

**Before submitting a PR**:

```bash
npm run lint:fix
npm run format
npm run build --workspace=custom-ui
```

**Configuration files**:

- `.eslintrc.json` — ESLint rules (TypeScript strict mode, accessibility)
- `.prettierrc.json` — Prettier formatting (2-space indent, 100-char line length)
- `.prettierignore` — Prettier exclusions (node_modules, dist, etc.)

See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for detailed conventions and examples.

## Browser vs Electron Parity

Both versions are **completely aligned**:

| Aspect            | Browser          | Electron         |
| ----------------- | ---------------- | ---------------- |
| Theia Version     | 1.67.0           | 1.67.0           |
| Dependencies      | Identical        | Identical        |
| Plugins           | Same set         | Same set         |
| Color Theme       | Catppuccin Latte | Catppuccin Latte |
| Icon Theme        | Catppuccin       | Catppuccin       |
| UI Layout         | Custom           | Custom           |
| Preferences       | Identical        | Identical        |
| Security Settings | Disabled trust   | Disabled trust   |

This ensures **perfect feature parity** between the two platforms.

## Troubleshooting

### Build & Installation Issues

For errors during `npm install`, `npm run download:plugins`, or `npm run build`, see the
**[Building & Distribution](#troubleshooting-build-failures)** section above. Common issues:

- **Native module compilation errors** → System packages missing (see Prerequisites by distribution)
- **"Cannot find module 'copy-webpack-plugin'"** → Run `npm install`
- **"Dependencies are out of sync"** → Check Electron version in `electron-app/package.json`
- **"Permission denied" on scripts** → Run `chmod +x` on script files
- **"Port 3000 already in use"** → Kill process or use `--port=4000`

### Runtime Issues (After Build Succeeds)

#### Plugins Not Loading

- Verify download: `npm run download:plugins`
- Confirm `plugins/` directory contains plugin folders (not empty)
- Check browser/Electron developer console for errors (F12 or Ctrl/Cmd+Shift+I)
- Restart the app: `npm run start --workspace=browser-app` or `--workspace=electron-app`

#### Theme Not Applying

- Confirm Catppuccin theme is downloaded: `npm run download:plugins`
- Manually select theme: `Ctrl/Cmd+Shift+P` → "Color Theme" → choose from list
- Check Preferences > Workbench: Color Theme setting
- Restart the app

#### Files Panel or Editor Not Visible

- Ensure custom-ui plugin built successfully: `npm run build --workspace=custom-ui`
- Check browser console (F12) for JavaScript errors
- Refresh the page (browser) or restart (Electron): `npm run start --workspace=electron-app`

#### Keyboard Shortcuts Not Working

- Check that keyboard input focus is on the editor (click in the editor area first)
- Try `Ctrl/Cmd+Shift+P` (Command Palette) — this should always work if the IDE loaded
- Verify keyboard layout matches expected shortcuts (US English assumed in defaults)
- Check Preferences > Keyboard Shortcuts for custom bindings

#### Terminal Doesn't Appear (Electron on Linux)

If Electron fails to show terminal or crashes on startup:

1. Ensure all X11 libraries are installed:

   ```bash
   # Fedora/RHEL
   sudo dnf install -y libxkbcommon libX11
   # Ubuntu/Debian
   sudo apt install -y libxkbcommon0 libx11-6
   ```

2. Try running with diagnostics:

   ```bash
   DEBUG=* npm run start --workspace=electron-app 2>&1 | head -100
   ```

3. If still fails, use browser version instead:

   ```bash
   npm run start --workspace=browser-app
   ```

#### High Memory Usage or Slow Performance

- Close unnecessary tabs in the editor
- Restart the app: `npm run start --workspace=electron-app`
- Check that plugins are not continuously scanning large directories (exclude via `.theia.ignore` or
  Preferences > Files: Exclude)
- On Linux, ensure hardware acceleration is available (check GPU drivers)

### Getting Help

If issues persist:

1. Check that all system prerequisites are installed (see Prerequisites section)
2. Try a clean build: `bash scripts/rebuild-all.sh` (Linux/macOS) or
   `powershell -ExecutionPolicy Bypass -File scripts\rebuild-all.ps1` (Windows)
3. Report issues with full output: `npm run build 2>&1 | tee build.log` and share `build.log`
4. Open an issue at
   [github.com/mrhunsaker/PlainScript/issues](https://github.com/mrhunsaker/PlainScript/issues)

## Contributing & Forking

PlainScript is designed to be a **reference implementation and starting point** for building your
own accessible IDE.

### Community & Contributing

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — How to contribute, development workflow, PR guidelines
- **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** — Code style, TypeScript conventions, accessibility
  practices
- **[SECURITY.md](./SECURITY.md)** — Security policy, reporting vulnerabilities, secure coding
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** — Community standards and expectations
- **[GOVERNANCE_ENFORCEMENT.md](./GOVERNANCE_ENFORCEMENT.md)** — How code quality is enforced
  (CI/CD, pre-commit hooks)

### Quick Contribution Checklist

```bash
# 1. Setup dev environment (see CONTRIBUTING.md)
git clone https://github.com/YOUR_USERNAME/PlainScript.git
cd PlainScript
npm install && npm run download:plugins

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and test
npm run lint --fix
npm run format
npm run build --workspace=custom-ui
npm run start

# 4. Commit with conventional message and push
git commit -m "feat(custom-ui): add your feature"
git push origin feature/your-feature-name

# 5. Open Pull Request on GitHub
```

### How to Fork & Customize

1. **Clone or fork** this repository:

   ```bash
   git clone https://github.com/yourusername/plainscript-ide.git
   cd plainscript-ide
   ```

2. **Customize branding** (optional):
   - Edit `browser-app/package.json` > `applicationName` and `product.json`
   - Edit `electron-app/package.json` > `productName`, `appId`, `product.json`
   - Update icon files in `electron-app/resources/icons/`
   - Update preload splash screens in `browser-app/resources/preload.html` and
     `electron-app/resources/preload.html`

3. **Add or remove plugins**:
   - Edit root `package.json` > `theiaPlugins`
   - Run `npm run download:plugins`
   - Document why each plugin is included (accessibility, not bloat)

4. **Modify UI layout**:
   - Edit `custom-ui/src/frontend/` files
   - Update `contribution-filters.ts` to show/hide views
   - Rebuild: `npm run build --workspace=custom-ui`

5. **Build and test**:

   ```bash
   npm ci
   npm run build
   npm run start  # Test both browser and Electron
   ```

6. **Set up CI/CD** (optional):
   - Copy `.github/workflows/build-appimage.yml` to your repo
   - Push a tag to trigger automated builds

7. **Publish**:
   - GitHub Releases (automatic if you use the workflow)
   - Custom download server
   - Package managers (brew, snap, chocolatey—requires additional config)

### Guidelines for Contributors

Before contributing, please read:

1. **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** — Community standards
2. **[CONTRIBUTING.md](./CONTRIBUTING.md)** — Detailed contribution guidelines
3. **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** — Code style and conventions

**Key expectations**:

- **Code Quality**: Run `npm run lint:fix && npm run format` before committing
- **Testing**: Test changes in both browser and Electron versions
- **Accessibility**: All UI changes must be tested with keyboard navigation and screenreaders
- **Documentation**: Update README or create docs for significant changes
- **Commits**: Follow conventional commit format (see CONTRIBUTING.md)

**Contributions Welcome**:

- UI/UX improvements (maintaining accessibility)
- Additional plugins with accessibility verification
- Performance optimizations
- Cross-platform testing and fixes
- Documentation improvements and translations
- Accessibility audits and fixes
- Security improvements

**Pull Request Process**:

1. Fork and create a feature branch: `git checkout -b feature/short-name`
2. Make changes following [STYLE_GUIDE.md](./STYLE_GUIDE.md)
3. Run quality checks:
   ```bash
   npm run lint:fix
   npm run format
   npm run build --workspace=custom-ui
   ```
4. Test in both versions: `npm run start`
5. Commit with clear message (see [CONTRIBUTING.md](./CONTRIBUTING.md) for format)
6. Push and open a Pull Request with testing notes

For detailed guidance, see [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

Licensed under **Apache License 2.0**. See [LICENSE](./LICENSE) for details.

You are free to use, copy, and modify this software for any purpose, provided you:

- Include the license and copyright notice
- Document significant changes
- Include the license in derivative works

## Attribution

Built with:

- [Theia IDE](https://theia-ide.org/) - Open-source IDE platform
- [Electron](https://www.electronjs.org/) - Desktop app runtime
- [Open VSX Registry](https://open-vsx.org) - Extension registry
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Editor component

## Support

- Check [Theia documentation](https://theia-ide.org/docs/)
- Review [VSCode API docs](https://code.visualstudio.com/api)
- Open an issue on GitHub
- Check existing issues for solutions

## Roadmap

- [ ] Remote development (SSH)
- [ ] Workspace templates
- [ ] Extension marketplace UI
- [ ] Collaborative editing
- [ ] Docker integration
- [ ] Cloud storage support
- [ ] Performance profiling tools
- [ ] Advanced theming system

## Changelog

### Version 1.0.0-beta (Initial Public Release - December 14, 2025)

**Core Features**:

- Dual platform support (browser + Electron)
- Launch scripts (Bash + PowerShell)
- Perfect browser/Electron parity
- Custom accessible UI layout

**Accessibility**:

- Screenreader-friendly structure
- Full keyboard navigation
- WCAG AA compliant color themes
- Semantic HTML with ARIA labels

**Plugins & Theming**:

- 4 carefully selected plugins (language support, theme, icons)
- Catppuccin Latte (default), Frappé, Macchiato, and Mocha
- Catppuccin semantic icons
- Indent Rainbow visualization

**UI Customization**:

- Transparent inclusion/exclusion documentation
- Streamlined layout (Files + Editor + Output only)
- Top-oriented tabs
- Locked output panel

**Distribution**:

- Clean build script (`scripts/build-appimage-clean.sh`)
- GitHub Actions CI/CD workflow (Linux, macOS, Windows)
- Automated AppImage, DMG, NSIS packaging
- Comprehensive PACKAGING.md guide

**Developer Experience**:

- Monorepo structure (browser-app, electron-app, custom-ui)
- Apache 2.0 license
- Clear contribution guidelines
- Documentation for forking and customization

---

## FAQ

**Q: Is this a production-ready IDE?**  
A: Yes, but it's designed as a **starting point** for building accessible IDEs. It includes all
essential features for coding. You can use it as-is or customize it for your needs.

**Q: Can I add more plugins?**  
A: Yes! Edit root `package.json` > `theiaPlugins` and run `npm run download:plugins`. Verify
accessibility for new plugins.

**Q: Can I change the UI layout?**  
A: Yes! Edit files in `custom-ui/src/frontend/` and rebuild with
`npm run build --workspace=custom-ui`.

**Q: How do I change the theme or colors?**  
A: Themes are provided by the Catppuccin plugin. Switch via Preferences > Color Theme using
Catppuccin Latte, Frappé, Macchiato, or Mocha. To create a custom theme, write a new VS Code
extension.

**Q: Will my custom IDE work on Windows/macOS?**  
A: Yes! Use GitHub Actions CI/CD to build for all platforms. See [PACKAGING.md](./PACKAGING.md).

**Q: Is this accessible to screenreader users?**  
A: Yes, it's designed with screenreader accessibility as a priority. Test with NVDA (Windows), JAWS,
or VoiceOver (macOS). Report accessibility issues!

**Q: Can I use this commercially?**  
A: Yes, under Apache 2.0 license. You're free to fork, customize, and distribute. Include the
license and document changes.

**Q: How do I debug the Electron app?**  
A: Run `npm run start --workspace=electron-app` and use Chrome DevTools (Ctrl+Shift+I). Or attach VS
Code debugger to the main process.

**Q: Where do I get help?**  
A: Check [Theia docs](https://theia-ide.org/docs/),
[VS Code API reference](https://code.visualstudio.com/api), or open an issue.

---

**Last Updated**: December 14, 2025  
**License**: Apache 2.0  
**Maintained by**: PlainScript Community
