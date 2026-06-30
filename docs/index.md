# PlainScript IDE

**PlainScript** is a minimal, accessible IDE built on top of
[Eclipse Theia](https://theia-ide.org/). It ships as both a browser-based application and a native
Electron desktop application, and is designed with **simplicity and screen-reader accessibility** as
its primary goals.

---

## Vision

PlainScript demonstrates how to build a focused, opinionated IDE from Theia by:

- **Accessibility first** — semantic HTML, ARIA labels, full keyboard navigation, screen-reader
  friendly structure.
- **Simplicity** — only essential features; no clutter, no distraction.
- **Transparency** — every included and excluded feature is documented with a rationale.
- **Reproducibility** — designed to be forked and used as a starting point for custom Theia IDEs.

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/mrhunsaker/PlainScript.git
cd PlainScript

# 2. Install dependencies
npm install

# 3. Build all workspaces
npm run build

# 4a. Start browser app
./scripts/customide-browser.sh      # Linux/macOS
.\scripts\customide-browser.ps1     # Windows

# 4b. Start Electron app
./scripts/customide-electron.sh     # Linux/macOS
.\scripts\customide-electron.ps1    # Windows
```

---

## Documentation Sections

| Section                                   | Description                                     |
| ----------------------------------------- | ----------------------------------------------- |
| [Getting Started](getting-started.md)     | Prerequisites, build steps, first launch        |
| [Installation](installation.md)           | Platform-specific install instructions          |
| [Quick Reference](quick-reference.md)     | Launch commands and common tasks at a glance    |
| [Architecture](architecture.md)           | Monorepo structure and design decisions         |
| [API Reference](api/index.md)             | All exported classes, functions, and constants  |
| [Packaging & Distribution](packaging.md)  | Building installers for macOS, Windows, Linux   |
| [Contributing](contributing.md)           | How to contribute code and report issues        |
| [Style Guide](style-guide.md)             | Coding style and conventions                    |
| [Governance & Enforcement](governance.md) | How code quality and accessibility are enforced |
| [Code of Conduct](code-of-conduct.md)     | Community standards and expectations            |
| [Security Policy](security.md)            | How to report vulnerabilities                   |
| [Changelog](changelog.md)                 | Release history                                 |

---

## License

PlainScript is released under the
[Apache 2.0 License](https://github.com/mrhunsaker/PlainScript/blob/main/LICENSE).
