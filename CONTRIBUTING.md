# Contributing to Custom IDE

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js >= 20.0
- npm >= 10.0
- Git
- Basic understanding of TypeScript and React (for UI modifications)

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/your-username/customIDE.git
cd customIDE

# Install dependencies
npm install

# Download plugins
npm run download:plugins

# Verify both versions build
npm run build
```

## Development Workflow

### Running the IDE

Start both versions simultaneously:
```bash
npm run start
```

Or individually:
```bash
npm run start --workspace=browser-app    # http://localhost:3000
npm run start --workspace=electron-app   # Desktop app
```

### Watch Mode

For development with hot reload:
```bash
npm run watch
```

For specific workspace:
```bash
npm run watch --workspace=custom-ui
```

## Areas for Contribution

### 1. UI/UX Improvements

- Custom color schemes
- Keyboard shortcut customization
- Layout variations
- Accessibility enhancements

**Files to modify**: `custom-ui/src/frontend/`

### 2. Plugin Integration

- Add useful VSCode extensions
- Create custom keybindings
- Develop Theia-specific plugins

**Files to modify**: Root `package.json` (`theiaPlugins` section)

### 3. Feature Additions

- Custom commands and contributions
- Workspace management improvements
- Custom editor views

**Files to modify**: Depends on feature (custom-ui, browser-app, electron-app)

### 4. Documentation

- Tutorials and guides
- API documentation
- Troubleshooting improvements
- Examples

**Files to modify**: `README.md`, create new `.md` files as needed

### 5. Testing & Bug Fixes

- Cross-platform testing (Windows, macOS, Linux)
- Bug fixes and compatibility improvements
- Performance optimization

**Files to modify**: Varies by issue

## Making Changes

### 1. Create a Feature Branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/my-bugfix
```

### 2. Make Your Changes

Edit relevant files for your contribution type:

**Modifying UI layout**:
```
custom-ui/
├── src/frontend/
│   ├── application-shell.ts
│   ├── navigator-widget-factory.ts
│   ├── commands-contributions.ts
│   └── style/
```

**Modifying plugins**:
```
Root package.json → theiaPlugins section
```

**Modifying preferences**:
```
browser-app/package.json → theia.frontend.config.preferences
electron-app/package.json → theia.frontend.config.preferences
```

### 3. Test Your Changes

**For custom-ui changes**:
```bash
npm run build --workspace=custom-ui
npm run bundle --workspace=browser-app
npm run bundle --workspace=electron-app
```

**Test in both platforms**:
```bash
npm run start
```

Access browser at `http://localhost:3000` and verify Electron app launches.

**Run tests** (if applicable):
```bash
npm test
```

### 4. Keep Dependencies Updated

Before submitting, ensure no security vulnerabilities:
```bash
npm audit
npm audit fix
```

### 5. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -am 'Add feature: descriptive title

- Change 1
- Change 2
- Fixes #123'
```

**Commit message format**:
- First line: Short summary (50 chars max)
- Blank line
- Detailed explanation if needed
- Reference issues: `Fixes #123`, `Closes #456`

### 6. Push and Create Pull Request

```bash
git push origin feature/my-feature
```

Then create a PR on GitHub with:
- Clear title describing the change
- Description of what and why
- Screenshots if UI-related
- Testing steps
- Any breaking changes noted

## Development Guidelines

### Code Style

- Follow existing code patterns in the project
- Use TypeScript for new code
- Format with prettier (if configured)
- Keep functions small and focused

### Testing

- Test changes in both browser and Electron versions
- Verify plugin loading if plugin-related
- Check console for errors and warnings
- Test on different platforms if possible

### Documentation

- Update README.md for user-facing changes
- Add comments to complex logic
- Document new configuration options
- Update this file if process changes

### Performance

- Minimize bundle size impact
- Avoid unnecessary re-renders (React)
- Profile before/after changes
- Consider plugin loading time

### Security

- Don't add credentials or secrets
- Run `npm audit` regularly
- Keep dependencies updated
- Report security issues privately

## Pull Request Guidelines

**Before submitting PR**:
- [ ] Changes tested in both browser and Electron
- [ ] No breaking changes (or clearly documented)
- [ ] Code follows project style
- [ ] Dependencies updated if needed
- [ ] No security issues (`npm audit`)
- [ ] Documentation updated

**PR Template**:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] UI improvement
- [ ] Documentation
- [ ] Other

## Testing
Steps to verify the change:
1. 
2. 
3. 

## Screenshots (if applicable)
Before/after or relevant UI changes

## Checklist
- [ ] Tested in browser version
- [ ] Tested in Electron version
- [ ] Updated documentation
- [ ] No security issues
- [ ] Build successful
```

## Common Development Tasks

### Adding a Plugin

1. Find extension on [Open VSX](https://open-vsx.org)
2. Get VSIX URL
3. Add to `package.json`:
   ```json
   "publisher.extension-name": "https://open-vsx.org/api/.../file/...vsix"
   ```
4. Run `npm run download:plugins`
5. Test: `npm run start`

### Modifying UI Layout

1. Edit files in `custom-ui/src/frontend/`
2. Rebuild: `npm run build --workspace=custom-ui`
3. Bundle: `npm run bundle --workspace=browser-app && npm run bundle --workspace=electron-app`
4. Test: `npm run start`

### Changing Default Theme

Edit both:
- `browser-app/package.json` → `theia.frontend.config.preferences`
- `electron-app/package.json` → `theia.frontend.config.preferences`

Then restart app.

### Creating a New Custom Module

1. Create directory in `custom-ui/src/frontend/`
2. Add TypeScript files with exports
3. Import in `index.ts`
4. Register contribution if needed
5. Build and test

## Reporting Issues

When reporting bugs, include:

**Required**:
- OS and Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error message or screenshot

**Optional**:
- Browser/Electron console output
- Custom configuration if relevant
- Related plugins or extensions
- Attempted solutions

**Good bug report example**:
```
**Environment**:
- OS: Ubuntu 22.04
- Node: 20.11.0
- npm: 10.5.0

**Steps to reproduce**:
1. Launch customide-browser
2. Open a file
3. Try to close the file

**Expected**: File closes
**Actual**: File doesn't close, console shows error

**Error**:
```
Error: Cannot read property 'close' of undefined
at FileWidget.closeFile (application-shell.ts:123)
```

**Workaround**: Restart the app
```

## Getting Help

- Check [README.md](./README.md) for common issues
- Review existing GitHub issues
- Read [Theia documentation](https://theia-ide.org/docs/)
- Check [VSCode extension API docs](https://code.visualstudio.com/api)
- Ask in GitHub discussions

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Constructive feedback only
- Report violations to maintainers

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

Thank you for contributing to Custom IDE! 🎉
