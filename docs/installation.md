# Installation

Platform-specific prerequisites for building and running PlainScript.

---

## Linux

=== "Fedora / RHEL / CentOS"

    ```bash
    sudo dnf install -y \
      nodejs npm git \
      gcc g++ make python3 \
      libxkbfile-devel libxkbcommon-devel \
      libX11-devel mesa-libGL-devel \
      pango-devel cairo-devel cups-devel \
      nss-devel atk-devel gtk3-devel \
      alsa-lib-devel
    ```

=== "Ubuntu / Debian"

    ```bash
    sudo apt-get update && sudo apt-get install -y \
      nodejs npm git \
      gcc g++ make python3 \
      libxkbfile-dev libxkbcommon-dev \
      libx11-dev libgl1-mesa-dev \
      libpango1.0-dev libcairo2-dev libcups2-dev \
      libnss3-dev libatk-bridge2.0-dev libgtk-3-dev \
      libasound2-dev
    ```

=== "Arch Linux"

    ```bash
    sudo pacman -S --needed \
      nodejs npm git gcc make python \
      libxkbfile libxkbcommon libx11 mesa \
      pango cairo cups nss atk gtk3 alsa-lib
    ```

---

## macOS

Install Xcode Command Line Tools, then use [Homebrew](https://brew.sh):

```bash
xcode-select --install
brew install node git python3
```

---

## Windows

1. Install [Node.js 20 LTS](https://nodejs.org/) (includes npm).
2. Install [Git for Windows](https://git-scm.com/download/win).
3. Install [Python 3.x](https://www.python.org/downloads/) — check **"Add to PATH"**.
4. Install Visual Studio Build Tools (C++ workload):
   ```powershell
   winget install Microsoft.VisualStudio.2022.BuildTools
   ```
5. (Optional) Install [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/)
   for a closer Linux-like experience.

---

## Packaging (distributable artifacts)

Electron distributable builds require `electron-builder`. These are produced automatically by GitHub
Actions on `v*` tag push. See
[PACKAGING.md](https://github.com/mrhunsaker/PlainScript/blob/main/PACKAGING.md) for manual build
instructions.
