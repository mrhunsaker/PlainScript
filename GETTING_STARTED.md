# Getting Started with Custom IDE

Welcome! This guide will have you up and running in minutes.

## Installation (5 minutes)

### 1. Prerequisites

Ensure you have installed:
- **Node.js**: [Download v20+](https://nodejs.org/)
- **npm**: Comes with Node.js
- **Git**: [Download](https://git-scm.com/) (for cloning the repo)

Verify installation:
```bash
node --version    # Should be 20.0 or higher
npm --version     # Should be 10.0 or higher
```

### 2. Clone or Download

```bash
# Clone the repository
git clone https://github.com/your-username/customIDE.git
cd customIDE

# Or download and extract ZIP, then navigate to directory
cd customIDE
```

### 3. Install Dependencies

```bash
npm install
```

This downloads all required packages for both browser and Electron versions.

### 4. Download Plugins

```bash
npm run download:plugins
```

This fetches the minimal theme and extension set (Alabaster themes, icons, Indent Rainbow).

## Launching the IDE (3 ways)

### Option 1: Quick Launch Scripts (Recommended)

**Linux/macOS**:
```bash
./customide-browser    # Launch browser version
```

```bash
./customide-electron   # Launch Electron (desktop) version
```

**Windows (PowerShell)**:
```powershell
.\customide-browser.ps1
```

```powershell
.\customide-electron.ps1
```

### Option 2: Direct npm Commands

**Browser version** (opens at http://localhost:3000):
```bash
npm run start --workspace=browser-app
```

**Electron version** (launches desktop app):
```bash
npm run start --workspace=electron-app
```

**Both simultaneously**:
```bash
npm run start
```

### Option 3: Full Build + Launch

If you want a clean build:
```bash
npm run build         # Production build
npm run start         # Launch both versions
```

## What You Get

### Browser Version
- Web-based IDE
- Access at `http://localhost:3000`
- No installation needed on other computers (just send them the URL)
- Lightweight and fast

### Electron Version
- Native desktop application
- Works offline
- Better system integration
- Desktop shortcuts and native menus

## First Steps

1. **Open a folder**:
   - Menu → File → Open Folder
   - Select any directory to explore

2. **Create/edit files**:
   - Right-click in file explorer → New File
   - Double-click to edit
   - Changes auto-save

3. **Try the terminal**:
   - View → Terminal (or Ctrl+`)
   - Run commands directly in the IDE

4. **Change theme** (optional):
   - View → Command Palette (F1)
   - Type "Color Theme"
   - Choose Alabaster or Alabaster Dark

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Command Palette | F1 or Ctrl+Shift+P |
| Open File | Ctrl+P |
| Open Folder | Ctrl+K Ctrl+O |
| Toggle Terminal | Ctrl+` |
| New File | Ctrl+N |
| Save | Ctrl+S |
| Search | Ctrl+F |
| Replace | Ctrl+H |
| Full Screen | F11 |
| Split Editor | Ctrl+\ |

## Troubleshooting

### It won't start

**Port 3000 in use**:
```bash
# Kill the process
lsof -i :3000
kill -9 <PID>

# Then try again
npm run start --workspace=browser-app
```

**Dependencies missing**:
```bash
npm install
npm run download:plugins
npm run build
```

### Theme not applying

1. Select theme: F1 → "Color Theme"
2. Restart the app
3. Check console for errors (F12 in browser)

### Plugins not loading

1. Verify plugins downloaded: `npm run download:plugins`
2. Restart the app
3. Check that `plugins/` folder exists and contains folders

## Next Steps

- **Explore**: Open your projects and files
- **Customize**: See README.md for advanced configuration
- **Extend**: Add plugins from [Open VSX](https://open-vsx.org)
- **Contribute**: See CONTRIBUTING.md to help improve Custom IDE

## Documentation

- **README.md**: Full documentation and features
- **CONTRIBUTING.md**: How to contribute to the project
- **LICENSE**: Apache 2.0 license details

## Getting Help

- Check [README.md](./README.md) Troubleshooting section
- Review [Theia IDE documentation](https://theia-ide.org/docs/)
- Check [VSCode extension docs](https://code.visualstudio.com/api) (same API)
- Open an issue on GitHub with details

## Quick Tips

**Did you know?**

- Both browser and Electron versions use identical settings and plugins
- The output panel is locked by default (prevents accidental closure)
- Indent Rainbow shows visual indentation guides
- Git is fully integrated (View → Git)
- You can customize keyboard shortcuts (Preferences → Keyboard Shortcuts)

---

Enjoy using Custom IDE! 

Questions? See [README.md](./README.md) or check [GitHub Issues](https://github.com/your-username/customIDE/issues)
