# PlainScript IDE - Minimal, Accessible Theia-Based Development Environment

A fully customized, lightweight IDE built on Theia with support for both browser-based and Electron desktop versions. Designed with **simplicity and screenreader accessibility** as core principles.

## Vision

PlainScript is a community project to demonstrate how to build a **minimal, focused IDE** from Theia with:
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
  - High-contrast Alabaster theme (WCAG AA compliant)
- **Simple Launch Scripts**: `customide-browser` and `customide-electron` commands (Bash & PowerShell)
- **Streamlined UI Layout**: 
  - Top-oriented tabs for better navigation structure
  - Files panel only (explorer with clear labeling)
  - Locked output panel (always available, not hidden)
  - No sidebar clutter; single focused work area
- **Minimal, Intentional Plugin Ecosystem**: Only 5 VSCode-compatible extensions from Open VSX
- **Focused Theme Selection**: Alabaster (light), Alabaster Dark, Catppuccin icons
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

- **Node.js**: >= 20.0
- **npm**: >= 10.0
- **Git**: For cloning and version control
- **Electron** (for desktop app): Automatically managed by dependencies

## Quick Start

### 1. Install Dependencies

```bash
cd /path/to/customIDE
npm install
npm run download:plugins
```

### 2. Launch the IDE

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

PlainScript intentionally excludes many features to prioritize **accessibility and simplicity**. This section documents exactly what's loaded and what's not, and why.

### Included: Plugins (5 carefully selected)

Configured in root `package.json` under `theiaPlugins`:

1. **Eclipse Theia Builtin Extension Pack** (eclipse-theia.builtin-extension-pack v1.95.3)
   - Language servers for JavaScript, Python, Go, Rust, and other core languages
   - Essential for code intelligence, completion, and debugging
   - **Why included**: Developers expect syntax support; essential for productivity

2. **Alabaster Theme** (tonsky.theme-alabaster v0.2.9) — Light mode
   - High-contrast, minimal-distraction light theme
   - WCAG AA compliant color contrasts
   - **Why included**: Default theme; supports accessibility-first design

3. **Alabaster Dark Theme** (lao-liang.vscode-theme-alabaster-dark v0.0.2)
   - High-contrast dark alternative
   - For users who prefer dark mode or low-light environments
   - **Why included**: Accessibility requirement; not all users can use light themes

4. **Catppuccin VSC Icons** (Catppuccin.catppuccin-vsc-icons v1.26.0)
   - Colorful, semantic file type icons
   - Helps quick visual file identification without relying on text alone
   - **Why included**: Visual accessibility for file exploration

5. **Indent Rainbow** (oderwat.indent-rainbow v8.3.1)
   - Adds rainbow-colored indentation guides
   - Helps structure visualization in nested code
   - **Why included**: Assistive visualization for code structure; activated on startup

### Excluded: Views & Features

The following Theia UI views are **intentionally hidden** via contribution filters in `custom-ui`:

| View | Why Excluded |
|------|-------------|
| **Debug** | Debugging UI adds visual complexity; developers who need it can enable manually |
| **Test** | Testing UI not essential for core editing; adds UI clutter |
| **SCM (Source Control)** | Git functionality available via command palette and status bar; dedicated panel unnecessary |
| **Outline** | Structure outline duplicates breadcrumb navigation; reduces cognitive load |
| **Call Hierarchy** | Advanced feature; not needed for most developers |
| **Problems Panel** | Errors shown inline; dedicated panel adds clutter |
| **Plugins View** | Extension management UI hidden; users learn the IDE first before managing plugins |
| **Tasks** | Task runner UI hidden; use terminal instead (more accessible) |
| **Notebook** | Jupyter notebook support excluded; focus on traditional code editors |
| **Breadcrumb** | Navigation via Files panel instead; breadcrumb adds extra UI layer |
| **Minimap** | Code overview adds visual elements; rely on search and scrolling |
| **Activity Bar (right side)** | Hidden; top tabs used instead |

**Accessibility rationale**: Fewer UI elements = less cognitive load, clearer screen reader navigation, fewer visual distractions, easier keyboard-only workflow.

### Excluded: Commands & Menu Items

Removed via `custom-ui` command filtering:

| Command | Why Excluded |
|---------|-------------|
| Workspace-related commands | Monorepo/workspace features create UI complexity |
| Help menu items | Documentation available externally; menu items clutter |
| About dialog | Project info in README instead |
| Show Welcome page | Avoids startup splash; users learn by doing |
| Switch editor group | Horizontal-only layout; no complex split arrangements |

### UI Layout Choices

**What's visible**:
- **Files panel** (left): Labeled "Files", non-closable, non-draggable. Always present for file navigation.
- **Editor area** (center): Main code editing. Supports multiple tabs (top-oriented).
- **Output panel** (bottom): Locked, always accessible. Shows terminal output, build results, etc.
- **Top tabs**: Open files shown as tabs at top of editor. Standard list format (keyboard-navigable).

**What's hidden**:
- Right sidebar (removed)
- Activity bar (right-side icon bar)
- Debug/test UI panels
- Welcome/startup screens
- Context menus (use command palette instead)

**Why**: Screenreader users benefit from linear, predictable UI. Fewer panels = easier to navigate with Tab and arrow keys.

### Accessibility Features

1. **Semantic HTML**: Proper ARIA labels, roles, and landmarks in custom UI
2. **Keyboard Navigation**: Full IDE control via keyboard; no mouse required
3. **High-Contrast Colors**: Alabaster theme meets WCAG AA standards
4. **Clear Focus Indicators**: Visible focus rings on buttons, inputs, tree items
5. **Logical Tab Order**: Files → Editor → Output (top to bottom)
6. **Command Palette**: Accessible via `Ctrl/Cmd+Shift+P`; text-based, no visual-only buttons
7. **Status Bar**: Shows language, line/column, git branch, error count (screenreader readable)
8. **Terminal**: Integrated terminal for shell commands (accessible via keyboard)

## Configuration

### Plugins

Configured in root `package.json` under `theiaPlugins`. See [Transparency section](#transparency-whats-included-vs-excluded) for full rationale.

Current selection:

- **Eclipse Theia Builtin Extension Pack**: Language servers (JavaScript, Python, Go, Rust, etc.)
- **Alabaster Theme**: Light mode (WCAG AA compliant)
- **Alabaster Dark**: Dark mode alternative
- **Catppuccin VSC Icons**: Semantic file type icons
- **Indent Rainbow**: Code structure visualization (auto-enabled)

### Theme & Icon Settings

Both apps use identical settings (aligned to Theia 1.67.0):

```json
{
  "workbench.colorTheme": "Alabaster",
  "workbench.iconTheme": "Catppuccin VSC Icons - Latte",
  "security.workspace.trust.enabled": false,
  "security.workspace.trust.startupPrompt": "never",
  "extensions.ignoreRecommendations": true,
  "extensions.verifySignature": false
}
```

Edit in `browser-app/package.json` or `electron-app/package.json` under `theia.frontend.config.preferences`.

### Custom UI Features

The `custom-ui` plugin provides:

- **Contribution Filters**: Removes debug, test, SCM, outline, hierarchy, problems, plugins, tasks, notebook, window views
- **Command Cleanup**: Removes workspace commands, About/Help menus; adds Files, Search, Terminal, Output tabs
- **Explorer Widget**: Labeled "Files", non-closable, non-draggable
- **Output Panel**: Locked, no close button, toolbar buttons hidden
- **Shell Layout**: Top-oriented tabs, no right panel, horizontal-only splits
- **Island Styling**: Rounded corners, gaps, transparent backgrounds, modern aesthetics

### Customizing Splash/Preload Screen

The splash screen (loading screen shown before the IDE loads) can be customized for both browser and desktop versions.

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
       0% { transform: scale(1); }
       50% { transform: scale(1.1); }
       100% { transform: scale(1); }
   }
   ```

**Example - Custom Company Branding**:
```html
<div class="splash-content">
    <p class="splash-title">MyCompany IDE</p>
    <p class="splash-message">Initializing workspace...</p>
    <p style="font-size: 12px; color: #888; margin-top: 20px;">
        Version 1.0 • MyCompany © 2025
    </p>
</div>
```

**Tips**:
- Keep file size small (the splash shows before anything loads)
- Avoid external dependencies (use inline SVG or base64 images)
- Test both browser and Electron versions after changes
- The splash appears momentarily, so optimize for quick visibility
- Colors should contrast well with the background (default dark grey: `#1e1e1e`)

## Building & Distribution

### Quick Build (for Fedora Silverblue/Kinoite or Linux with 7zip)

A clean build script removes all caches and rebuilds from scratch (ensures preload and config changes propagate):

```bash
chmod +x scripts/build-appimage-clean.sh
scripts/build-appimage-clean.sh
```

This:
1. Removes all `node_modules` and build caches
2. Installs fresh dependencies
3. Rebuilds all workspaces
4. Packages the Electron app as a Linux AppImage

Output: `electron-app/dist/PlainScript-*-x86_64.AppImage`

### Manual Multi-Step Build

```bash
cd /path/to/customIDE

# 1) Clean install
npm ci

# 2) Build workspaces (order matters)
npm run build --workspace=custom-ui
npm run build --workspace=browser-app
npm run build --workspace=electron-app

# 3) Package
npm run package --workspace=electron-app
```

### Packaging for macOS, Windows, and Linux

See [PACKAGING.md](./PACKAGING.md) for detailed platform-specific instructions including:
- Icon requirements (.icns, .ico, .png)
- Code signing setup
- Cross-platform builds
- Troubleshooting

### Automated CI/CD with GitHub Actions

Once you push to GitHub, automated builds trigger on:
- **Tag push** (`v*`): Creates GitHub Release with all binaries
- **Manual trigger**: Anytime via Actions tab

**Workflow** (`.github/workflows/build-appimage.yml`):
- Builds AppImage on Linux (ubuntu-latest)
- Builds DMG + ZIP on macOS (macos-latest)
- Builds NSIS + Portable EXE on Windows (windows-latest)
- All builds run in parallel
- Artifacts uploaded and released automatically

**To use**:
```bash
# Tag and push
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions builds all three platforms automatically
# Artifacts appear in Release and as downloadable artifacts
```

No manual packaging needed once CI/CD is set up.

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

## Browser vs Electron Parity

Both versions are **completely aligned**:

| Aspect | Browser | Electron |
|--------|---------|----------|
| Theia Version | 1.67.0 | 1.67.0 |
| Dependencies | Identical | Identical |
| Plugins | Same set | Same set |
| Color Theme | Alabaster | Alabaster |
| Icon Theme | Catppuccin | Catppuccin |
| UI Layout | Custom | Custom |
| Preferences | Identical | Identical |
| Security Settings | Disabled trust | Disabled trust |

This ensures **perfect feature parity** between the two platforms.

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find and kill process
lsof -i :3000
kill -9 <PID>

# Or use different port
cd browser-app && npm start -- -p 4000
```

### Plugins Not Loading

- Verify download: `npm run download:plugins`
- Check `plugins/` directory exists and contains folders
- Review browser/Electron console for errors
- Restart the app

### Theme Not Applying

- Ensure theme plugin is downloaded
- Check console for color parsing errors
- Manually select theme: Preferences > Color Theme
- Restart app

### Build Fails

```bash
# Clean and rebuild
npm run clean
npm install
npm run download:plugins
npm run build
```

## Contributing & Forking

PlainScript is designed to be a **reference implementation and starting point** for building your own accessible IDE.

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
   - Update preload splash screens in `browser-app/resources/preload.html` and `electron-app/resources/preload.html`

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

If you'd like to contribute back to PlainScript:

**Code Quality**:
- Follow existing code style (TypeScript, LESS)
- Test both browser and Electron versions
- Ensure changes maintain accessibility
- Test with a screenreader (NVDA on Windows, JAWS, VoiceOver on macOS)

**Accessibility Standards**:
- Follow WCAG 2.1 Level AA guidelines
- Use semantic HTML and ARIA roles
- Test keyboard navigation
- Test with screenreaders
- Avoid visual-only affordances

**Documentation**:
- Update README for user-facing changes
- Document UI layout changes
- Explain why features are included/excluded
- Provide rationale for plugin choices

**Contributions Welcome**:
- UI/UX improvements maintaining accessibility
- Additional language support (via language server extensions)
- Performance optimizations
- Cross-platform testing and fixes
- Documentation and translation
- Accessibility improvements

### Contributions

Contributions are welcome! Areas for enhancement:

- Custom UI improvements (accessible layouts, keyboard shortcuts)
- Additional useful plugins (with accessibility verification)
- Performance optimizations
- Testing on Windows/macOS/Linux
- Documentation and guides
- Accessibility audits and fixes

**How to contribute**:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and test in both browser and Electron: `npm run build && npm run start`
4. Run a clean build: `scripts/build-appimage-clean.sh`
5. Commit with clear messages: `git commit -m "feat: add accessible feature X"`
6. Push and open a pull request
7. Provide testing notes (browser, Electron, screenreader, keyboard)

**Pull Request Checklist**:
- [ ] Tested on browser and Electron
- [ ] No accessibility regressions (keyboard nav, screenreader, colors)
- [ ] README/PACKAGING.md updated if needed
- [ ] Clear commit messages
- [ ] Changes follow code style

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
- ✅ Dual platform support (browser + Electron)
- ✅ Launch scripts (Bash + PowerShell)
- ✅ Perfect browser/Electron parity
- ✅ Custom accessible UI layout

**Accessibility**:
- ✅ Screenreader-friendly structure
- ✅ Full keyboard navigation
- ✅ WCAG AA compliant color themes
- ✅ Semantic HTML with ARIA labels

**Plugins & Theming**:
- ✅ 5 carefully selected plugins (language support, themes, icons)
- ✅ Alabaster light/dark themes (high contrast)
- ✅ Catppuccin semantic icons
- ✅ Indent Rainbow visualization

**UI Customization**:
- ✅ Transparent inclusion/exclusion documentation
- ✅ Streamlined layout (Files + Editor + Output only)
- ✅ Top-oriented tabs
- ✅ Locked output panel

**Distribution**:
- ✅ Clean build script (`scripts/build-appimage-clean.sh`)
- ✅ GitHub Actions CI/CD workflow (Linux, macOS, Windows)
- ✅ Automated AppImage, DMG, NSIS packaging
- ✅ Comprehensive PACKAGING.md guide

**Developer Experience**:
- ✅ Monorepo structure (browser-app, electron-app, custom-ui)
- ✅ Apache 2.0 license
- ✅ Clear contribution guidelines
- ✅ Documentation for forking and customization

---

## FAQ

**Q: Is this a production-ready IDE?**  
A: Yes, but it's designed as a **starting point** for building accessible IDEs. It includes all essential features for coding. You can use it as-is or customize it for your needs.

**Q: Can I add more plugins?**  
A: Yes! Edit root `package.json` > `theiaPlugins` and run `npm run download:plugins`. Verify accessibility for new plugins.

**Q: Can I change the UI layout?**  
A: Yes! Edit files in `custom-ui/src/frontend/` and rebuild with `npm run build --workspace=custom-ui`.

**Q: How do I change the theme or colors?**  
A: Themes are plugins (Alabaster, Alabaster Dark). Switch via Preferences > Color Theme. To create a custom theme, write a new VS Code extension.

**Q: Will my custom IDE work on Windows/macOS?**  
A: Yes! Use GitHub Actions CI/CD to build for all platforms. See [PACKAGING.md](./PACKAGING.md).

**Q: Is this accessible to screenreader users?**  
A: Yes, it's designed with screenreader accessibility as a priority. Test with NVDA (Windows), JAWS, or VoiceOver (macOS). Report accessibility issues!

**Q: Can I use this commercially?**  
A: Yes, under Apache 2.0 license. You're free to fork, customize, and distribute. Include the license and document changes.

**Q: How do I debug the Electron app?**  
A: Run `npm run start --workspace=electron-app` and use Chrome DevTools (Ctrl+Shift+I). Or attach VS Code debugger to the main process.

**Q: Where do I get help?**  
A: Check [Theia docs](https://theia-ide.org/docs/), [VS Code API reference](https://code.visualstudio.com/api), or open an issue.

---

**Last Updated**: December 14, 2025  
**License**: Apache 2.0  
**Maintained by**: PlainScript Community
