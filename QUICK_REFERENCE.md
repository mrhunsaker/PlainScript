# Quick Reference

## Launch Commands

### Browser (Web)
```bash
./customide-browser    # Linux/macOS
.\customide-browser.ps1 # Windows (PowerShell)
npm run start --workspace=browser-app
```
Access at: **http://localhost:3000**

### Electron (Desktop)
```bash
./customide-electron    # Linux/macOS
.\customide-electron.ps1 # Windows (PowerShell)
npm run start --workspace=electron-app
```

### Both Simultaneously
```bash
npm run start
```

## Installation

```bash
npm install
npm run download:plugins
npm run build
```

## Development

```bash
npm run build          # Production build
npm run bundle         # Development build (watch)
npm run watch          # Watch mode (all workspaces)
npm run clean          # Remove artifacts
npm run download:plugins # Fetch VSCode extensions
```

## File Locations

| Item | Location |
|------|----------|
| UI Customizations | `custom-ui/src/frontend/` |
| Plugins Config | `package.json` (`theiaPlugins`) |
| Theme Settings | `browser-app/package.json` & `electron-app/package.json` |
| Installed Plugins | `plugins/` |
| Documentation | `README.md`, `GETTING_STARTED.md`, `CONTRIBUTING.md` |

## Default Settings

| Setting | Value |
|---------|-------|
| Color Theme | Alabaster |
| Icon Theme | Catppuccin VSC Icons - Latte |
| Workspace Trust | Disabled |
| Extensions Verification | Disabled |
| Plugins Directory | `local-dir:../plugins` |

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Command Palette | `F1` or `Ctrl+Shift+P` |
| Quick Open File | `Ctrl+P` |
| Find | `Ctrl+F` |
| Replace | `Ctrl+H` |
| Terminal | `Ctrl+` ` |
| Split Editor | `Ctrl+\` |
| Save | `Ctrl+S` |
| Undo | `Ctrl+Z` |
| Redo | `Ctrl+Y` |

## Common Tasks

### Add a Plugin
1. Find on [Open VSX](https://open-vsx.org)
2. Copy VSIX URL
3. Add to `package.json` > `theiaPlugins`
4. Run `npm run download:plugins`
5. Restart app

### Remove a Plugin
1. Delete from `package.json` > `theiaPlugins`
2. Delete folder from `plugins/`
3. Restart app

### Change Default Theme
Edit `browser-app/package.json` and `electron-app/package.json`:
```json
"workbench.colorTheme": "Alabaster Dark"
```
Then restart.

### Modify UI Layout
1. Edit files in `custom-ui/src/frontend/`
2. Run `npm run build --workspace=custom-ui`
3. Run `npm run bundle --workspace=browser-app`
4. Run `npm run bundle --workspace=electron-app`
5. Restart app

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `lsof -i :3000` → `kill -9 <PID>` |
| Plugins won't load | `npm run download:plugins` then restart |
| Theme not applying | F1 → "Color Theme" → select theme → restart |
| Build fails | `npm run clean` → `npm install` → `npm run build` |

## Documentation

- **README.md** - Complete guide and features
- **GETTING_STARTED.md** - New user quick start
- **CONTRIBUTING.md** - Developer contribution guide
- **LICENSE** - Apache 2.0 legal framework
- **QUICK_REFERENCE.md** - This file

## Useful Links

- [Theia IDE Docs](https://theia-ide.org/docs/)
- [VSCode Extension API](https://code.visualstudio.com/api)
- [Open VSX Registry](https://open-vsx.org)
- [Electron Documentation](https://www.electronjs.org/docs)

## Version Info

- **Theia**: 1.67.0 (browser & electron)
- **Node.js**: >= 20.0
- **npm**: >= 10.0
- **Electron**: 38.4.0
- **License**: Apache 2.0

---

Need help? See README.md or GETTING_STARTED.md
