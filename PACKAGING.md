# PlainScript IDE Packaging Guide

This guide covers building distributable packages for PlainScript IDE on macOS, Windows, and Linux.

## Prerequisites

### All Platforms
- Node.js >= 20
- npm >= 10
- Clean workspace: `npm ci` to install dependencies
- Built application: `npm run build` (runs across all workspaces)

### Platform-Specific Requirements

#### macOS
- macOS 10.13+ (for building)
- Xcode Command Line Tools: `xcode-select --install`
- Optional: Apple Developer ID for code signing

#### Windows
- Windows 10+ or Windows Server 2016+
- Optional: Code signing certificate

#### Linux (AppImage)
- Any modern Linux distribution
- For Fedora Silverblue/Kinoite (immutable OS):
  ```bash
  toolbox create plainscript-build
  toolbox enter plainscript-build
  sudo dnf install -y p7zip p7zip-plugins
  ```
- For Debian/Ubuntu:
  ```bash
  sudo apt-get install -y p7zip-full
  ```

## Configuration

The Electron app packaging configuration is located in `electron-app/package.json` under the `build` section:

```json
{
  "build": {
    "appId": "com.plainscript.app",
    "productName": "PlainScript",
    "directories": {
      "output": "dist",
      "buildResources": "build"
    },
    "asar": true,
    "asarUnpack": ["**/*.node"],
    "npmRebuild": false,
    "buildDependenciesFromSource": false,
    "files": [
      "lib/**",
      "src-gen/**",
      "resources/**",
      "plugins/**",
      "product.json",
      "package.json",
      "!**/*.map",
      "!node_modules/@msgpackr-extract/msgpackr-extract-darwin-*",
      "!node_modules/@msgpackr-extract/**/msgpackr-extract-darwin-*",
      "!node_modules/@parcel/watcher/build/darwin*",
      "!node_modules/drivelist/build/darwin*",
      "!node_modules/keytar/build/darwin*",
      "!node_modules/native-keymap/build/darwin*",
      "!node_modules/node-pty/build/darwin*"
    ],
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "resources/icons/plainscript.icns",
      "category": "public.app-category.developer-tools"
    },
    "dmg": {
      "artifactName": "PlainScript-${version}-${arch}.dmg"
    },
    "win": {
      "target": ["nsis", "portable"],
      "icon": "resources/icons/plainscript.ico"
    },
    "nsis": {
      "artifactName": "PlainScript-Setup-${version}.exe",
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    },
    "portable": {
      "artifactName": "PlainScript-${version}-portable.exe"
    },
    "linux": {
      "target": ["AppImage"],
      "icon": "resources/icons/plainscript.png",
      "category": "Development"
    },
    "appImage": {
      "artifactName": "PlainScript-${version}-x86_64.AppImage"
    }
  }
}
```

## Icon Resources

Ensure you have the appropriate icon formats for each platform:

- **macOS**: `electron-app/resources/icons/plainscript.icns` (ICNS format, 512x512 recommended)
- **Windows**: `electron-app/resources/icons/plainscript.ico` (ICO format, multiple sizes: 16, 32, 48, 256)
- **Linux**: `electron-app/resources/icons/plainscript.png` (PNG format, 512x512 recommended)

You can generate icons from a single PNG using tools like:
- [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
- [electron-builder icon conversion](https://www.electron.build/icons)

## Building for macOS

### DMG and ZIP

**Prerequisites**: Must be run on macOS.

1. Ensure dependencies are installed and built:
   ```bash
   npm ci
   npm run build
   ```

2. Package the application:
   ```bash
   npm run package --workspace=electron-app
   ```

3. Outputs will be in `electron-app/dist/`:
   - `PlainScript-{version}-{arch}.dmg` - Installer disk image
   - `PlainScript-{version}-mac.zip` - Portable archive

### Code Signing (Optional)

To sign the macOS build:

1. Set environment variables:
   ```bash
   export CSC_LINK=/path/to/certificate.p12
   export CSC_KEY_PASSWORD=your-certificate-password
   export APPLE_ID=your@apple.id
   export APPLE_APP_SPECIFIC_PASSWORD=app-specific-password
   ```

2. Run packaging (signing will happen automatically):
   ```bash
   npm run package --workspace=electron-app
   ```

## Building for Windows

### NSIS Installer and Portable

**Prerequisites**: Can be built on Windows, macOS, or Linux (cross-platform build).

1. Ensure dependencies are installed and built:
   ```bash
   npm ci
   npm run build
   ```

2. Package the application:
   ```bash
   npm run package --workspace=electron-app
   ```

3. Outputs will be in `electron-app/dist/`:
   - `PlainScript-Setup-{version}.exe` - NSIS installer
   - `PlainScript-{version}-portable.exe` - Portable executable

### Cross-Platform Build from Linux/macOS

electron-builder supports building Windows packages on non-Windows systems:

```bash
# Install wine (for Linux)
sudo apt-get install -y wine64  # Debian/Ubuntu
sudo dnf install -y wine        # Fedora

# Build Windows packages
npm run package --workspace=electron-app
```

### Code Signing (Optional)

To sign the Windows build:

1. Set environment variables:
   ```bash
   export CSC_LINK=/path/to/certificate.pfx
   export CSC_KEY_PASSWORD=your-certificate-password
   ```

2. Run packaging:
   ```bash
   npm run package --workspace=electron-app
   ```

## Building for Linux

### AppImage

**Prerequisites**: Linux system with 7zip tools installed.

#### Standard Linux (Ubuntu, Debian, Fedora Workstation, etc.)

1. Install 7zip:
   ```bash
   # Debian/Ubuntu
   sudo apt-get install -y p7zip-full

   # Fedora/RHEL
   sudo dnf install -y p7zip p7zip-plugins

   # Arch
   sudo pacman -S p7zip
   ```

2. Ensure dependencies are installed and built:
   ```bash
   npm ci
   npm run build
   ```

3. Package the application:
   ```bash
   npm run package --workspace=electron-app
   ```

4. Output will be in `electron-app/dist/`:
   - `PlainScript-{version}-x86_64.AppImage`

#### Fedora Silverblue/Kinoite (Immutable OS)

Due to the immutable nature of these systems, use a toolbox container:

1. Create and enter a toolbox:
   ```bash
   toolbox create plainscript-build
   toolbox enter plainscript-build
   ```

2. Install build tools inside the toolbox:
   ```bash
   sudo dnf install -y p7zip p7zip-plugins
   ```

3. Navigate to your project (accessible from toolbox):
   ```bash
   cd /var/home/$USER/customIDE
   ```

4. Build the application:
   ```bash
   npm ci
   npm run build
   npm run package --workspace=electron-app
   ```

5. The AppImage will be in `electron-app/dist/` and can be run from the host system.

### Making AppImage Executable

After building, you may need to make the AppImage executable:

```bash
chmod +x electron-app/dist/PlainScript-*.AppImage
```

### Running the AppImage

```bash
./electron-app/dist/PlainScript-*.AppImage
```

## Building for Multiple Platforms

### Add Additional Targets

To build for multiple platforms simultaneously, update `electron-app/package.json`:

```json
{
  "build": {
    "mac": {
      "target": ["dmg", "zip"]
    },
    "win": {
      "target": ["nsis", "portable", "zip"]
    },
    "linux": {
      "target": ["AppImage", "tar.gz", "deb", "rpm"]
    }
  }
}
```

### Build All Targets

```bash
npm run package --workspace=electron-app
```

Note: Cross-platform builds require the appropriate tools (e.g., wine for Windows on Linux).

## Troubleshooting

### Common Issues

#### "theia: command not found" during packaging

**Solution**: The build config includes `npmRebuild: false` to prevent this. If you still encounter it, ensure your root `package.json` postinstall script uses `npx`:

```json
"postinstall": "npx --yes @theia/cli check:theia-version"
```

#### "pattern is too long" with asar

**Solution**: Simplified `asarUnpack` patterns. Current config only unpacks `**/*.node` files.

#### Missing 7zip on Linux

**Solution**: Install platform-specific 7zip package:
- Debian/Ubuntu: `sudo apt-get install -y p7zip-full`
- Fedora: `sudo dnf install -y p7zip p7zip-plugins`
- Arch: `sudo pacman -S p7zip`

#### ENOENT errors for darwin binaries on Linux

**Solution**: The config excludes darwin-specific native modules in the `files` array.

#### Code signing errors

**Solution**: Ensure your certificates are valid and environment variables are set correctly. For testing, you can skip code signing by not setting `CSC_*` variables.

## Clean Build

If you encounter persistent issues, perform a clean build:

```bash
# Clean all build artifacts
npm run clean

# Reinstall dependencies
npm ci

# Rebuild everything
npm run build

# Package
npm run package --workspace=electron-app
```

## Distribution

After successful packaging:

1. **Test the package** on a clean system to ensure all dependencies are bundled
2. **Verify file sizes** are reasonable (AppImage ~200-500MB typical for Theia)
3. **Check executable permissions** (especially for AppImage on Linux)
4. **Upload to distribution channels**:
   - GitHub Releases
   - Custom download server
   - Package managers (brew, chocolatey, snap, flatpak - requires additional config)

## Automated CI/CD

For automated builds across all platforms, consider using:

- **GitHub Actions** with matrix builds (macOS, Windows, Linux runners)
- **Electron Forge** or **Electron Builder** CI integrations
- **Release automation** with tools like semantic-release

Example GitHub Actions workflow structure:

```yaml
name: Build and Release
on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    strategy:
      matrix:
        os: [macos-latest, windows-latest, ubuntu-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm run package --workspace=electron-app
      - uses: actions/upload-artifact@v4
        with:
          name: ${{ matrix.os }}-build
          path: electron-app/dist/*
```

## Additional Resources

- [electron-builder documentation](https://www.electron.build/)
- [Theia packaging guide](https://theia-ide.org/docs/composing_applications/)
- [AppImage documentation](https://docs.appimage.org/)
- [macOS code signing guide](https://www.electron.build/code-signing)
- [Windows code signing guide](https://www.electron.build/code-signing#windows)
