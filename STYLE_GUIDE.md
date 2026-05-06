# PlainScript Style Guide

This document outlines coding style, formatting conventions, and best practices for PlainScript.

## Quick Reference

- **Language**: TypeScript (strict mode)
- **Formatter**: Prettier (2-space indent, 100-char line length)
- **Linter**: ESLint (based on TypeScript recommended rules + custom accessibility rules)
- **File naming**: kebab-case for files/folders, PascalCase for classes, camelCase for functions/variables
- **Browser support**: Latest Chromium/Firefox (via Theia/Electron)

## Running Style Tools

```bash
# Format all code
npm run format

# Check linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format specific workspace
npm run format --workspace=custom-ui
```

## TypeScript

### General Rules

1. **Strict mode**: All code compiles with `strict: true`

   ```typescript
   // ✅ Good
   const value: string | null = maybeString();
   if (value !== null) {
     console.log(value.length);
   }

   // ❌ Bad
   const value = maybeString();  // Type is 'any'
   console.log(value.length);     // Unsafe
   ```

2. **Explicit types**: Don't rely on type inference for complex types

   ```typescript
   // ✅ Good
   interface UserConfig {
     name: string;
     theme: 'light' | 'dark';
   }

   const config: UserConfig = { name: 'test', theme: 'light' };

   // ❌ Bad
   const config = { name: 'test', theme: 'light' };  // Type not clear
   ```

3. **Avoid `any`**: Use `unknown` or generics instead

   ```typescript
   // ✅ Good
   function process<T>(item: T): T {
     return item;
   }

   // ❌ Bad
   function process(item: any): any {
     return item;
   }
   ```

### Naming Conventions

| Target | Convention | Example |
|--------|-----------|---------|
| Classes | PascalCase | `KeyboardShortcutsContribution` |
| Functions | camelCase | `initApplicationShell()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT = 3` |
| Variables | camelCase | `isInitialized` |
| Interfaces | PascalCase, prefix `I` optional | `ContributionFilters` |
| Types | PascalCase | `ShellOptions` |
| Enums | PascalCase | `PanelState` |

### File Organization

```typescript
// 1. Imports (grouped: theia, @theia, local)
import { injectable } from '@theia/core/shared/inversify';
import { Command, CommandContribution } from '@theia/core/lib/common';

import { myUtility } from './my-utility';

// 2. Type definitions
interface MyOptions {
  name: string;
}

// 3. Constants
const DEFAULT_TIMEOUT = 5000;

// 4. Class/function implementation
@injectable()
export class MyClass implements CommandContribution {
  // ...
}

// 5. Exports
export { MyClass };
export type { MyOptions };
```

### Comments

- **Why, not what**: Comment explains intent, not obvious code
- **JSDoc for public APIs**: Document parameters, return type, exceptions
- **TODO/FIXME for known issues**: Include context

```typescript
// ✅ Good
/**
 * Initializes the keyboard shortcuts panel.
 * 
 * @param bind - Inversify container binding method
 * @throws Error if dependencies not injected
 */
export function initKeyboardShortcuts({ bind }: { bind: interfaces.Bind }): void {
  // Lazy-load shortcuts to reduce startup time
  bind(KeyboardShortcutsContribution).toSelf().inSingletonScope();
}

// ❌ Bad
/**
 * Init kb shortcuts
 */
export function initKeyboardShortcuts({ bind }) {
  bind(KeyboardShortcutsContribution).toSelf().inSingletonScope();  // What does this do?
}
```

## JavaScript / Style Sheets

### LESS Stylesheets

- **Nesting depth**: Max 3 levels (readability)
- **Variables**: Use Theia's CSS variables for theme colors
- **Mixins**: Create for repeated patterns

```less
// ✅ Good
@import (reference) '~@theia/core/lib/browser/style/colors';

.theia-header {
  background-color: var(--theia-panel-background);
  padding: @default-padding;

  .theia-header-title {
    color: var(--theia-foreground);
    font-weight: 600;
  }
}

// ❌ Bad
.theia-header {
  background-color: #1e1e1e;           // Hardcoded color
  .item {
    .inner {
      .deep { ... }                    // Too deep nesting
    }
  }
}
```

### React (if used)

- **Functional components**: Preferred over class components
- **Hooks**: Use for state and side effects
- **Props**: Explicit type definitions

```typescript
// ✅ Good
interface FileItemProps {
  name: string;
  icon?: string;
  selected?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({ name, icon, selected = false }) => {
  return (
    <div className={selected ? 'selected' : ''}>
      {icon && <span className="icon">{icon}</span>}
      <span>{name}</span>
    </div>
  );
};

// ❌ Bad
class FileItem extends React.Component {
  render() {
    return (
      <div>
        <span>{this.props.name}</span>
      </div>
    );
  }
}
```

## Accessibility

### ARIA & Semantic HTML

- **Always use semantic HTML**: `<button>`, `<input>`, `<nav>`, not `<div>` + CSS
- **ARIA labels for visual-only content**: Buttons with icons must have labels
- **Keyboard support**: All interactive elements must be keyboard-accessible

```typescript
// ✅ Good
<button
  aria-label="Open keyboard shortcuts"
  onClick={() => handleShortcuts()}
  onKeyDown={handleKeyDown}
>
  Open Shortcuts
</button>

// ❌ Bad
<div
  onClick={() => handleShortcuts()}
  className="button"
>
  Open Shortcuts
</div>
```

### Focus Management

- **Visible focus ring**: Never remove with `outline: none` without replacement
- **Focus order**: Use tab order that matches visual/logical flow
- **Skip links**: Provide shortcuts in complex layouts

```typescript
// ✅ Good
.my-button {
  &:focus-visible {
    outline: 2px solid var(--theia-focusBorder);
    outline-offset: 2px;
  }
}

// ❌ Bad
.my-button {
  &:focus {
    outline: none;  // Removes focus indicator
  }
}
```

### Testing Accessibility

1. **Keyboard navigation**: Tab through all interactive elements
2. **Screen reader**: Test with NVDA (Windows) or VoiceOver (macOS)
3. **High contrast**: Enable Windows High Contrast or use browser dev tools
4. **Reduced motion**: Check with `prefers-reduced-motion: reduce`

## Code Patterns

### Dependency Injection (Inversify)

```typescript
// ✅ Good
@injectable()
export class MyService {
  constructor(
    @inject(Logger) protected readonly logger: Logger,
    @inject(FileService) protected readonly files: FileService,
  ) {}

  doSomething(): void {
    this.logger.info('Doing something');
  }
}

// ❌ Bad
const logger = new Logger();  // Hard-coded dependency
export class MyService {
  doSomething(): void {
    logger.info('Doing something');
  }
}
```

### Error Handling

```typescript
// ✅ Good
async function saveFile(path: string, content: string): Promise<void> {
  try {
    await fs.writeFile(path, content);
  } catch (error) {
    if (error instanceof FilePermissionError) {
      logger.warn(`Permission denied: ${path}`);
      throw new UserFacingError(`Cannot write to ${path}`);
    }
    throw error;  // Re-throw unexpected errors
  }
}

// ❌ Bad
async function saveFile(path: string, content: string): Promise<void> {
  await fs.writeFile(path, content);  // No error handling
}
```

### Logging

- **Use Theia's Logger**: Don't use `console.log()` in production code
- **Levels**: `debug`, `info`, `warn`, `error`
- **Avoid sensitive data**: Never log passwords, tokens, API keys

```typescript
// ✅ Good
@inject(Logger)
protected readonly logger: Logger;

this.logger.info(`Loaded ${count} files`);
this.logger.warn(`Slow operation took ${ms}ms`);

// ❌ Bad
console.log(`API key: ${apiKey}`);  // Exposes secret
console.log('Done');                 // Not descriptive
```

## Formatting Rules

### Line Length

- **Target**: 100 characters (hard limit: 120)
- **Reason**: Readability, side-by-side diffs

```typescript
// ✅ Good (under 100 chars)
const message = 'This is a reasonable length line';

// ✅ Good (wrapped at appropriate break points)
const config: ContributionFilters = initFilters({
  include: ['View'],
  exclude: ['Debug', 'Test'],
});

// ❌ Bad (over 120 chars)
const veryLongMessageThatExceedsTheLineLimit = 'This line is way too long and should be split into multiple lines for readability';
```

### Indentation

- **Spaces**: 2 (not tabs)
- **Consistency**: Match indentation of surrounding code

```typescript
// ✅ Good
if (condition) {
  doSomething();
  if (nested) {
    doMore();
  }
}

// ❌ Bad
if (condition) {
    doSomething();  // 4 spaces
  if (nested) {
    doMore();
  }
}
```

### Imports/Exports

- **Sort**: Group by source (theia, @theia, local)
- **Unused**: Remove unused imports
- **Named vs default**: Prefer named exports

```typescript
// ✅ Good
import { injectable } from '@theia/core/shared/inversify';
import { Command } from '@theia/core/lib/common';

import { MyUtility } from './my-utility';

export class MyClass {}
export { MyClass };

// ❌ Bad
import * as inversify from '@theia/core/shared/inversify';
import { Command, unused, alsoUnused } from '@theia/core/lib/common';
import MyUtility from './my-utility';  // Default export

export default MyClass;
```

## Documentation

### README & Guides

- **Clear structure**: H1 → H2 → H3 hierarchy
- **Code examples**: Include for key concepts
- **Links**: Cross-reference related docs
- **Update**: Keep docs in sync with code

### Inline Comments

- **When**: Complex logic, non-obvious decisions, hacks/workarounds
- **Format**: `// [Context] - [Explanation]`

```typescript
// ✅ Good
// Lazy-load keyboard shortcuts on first use to reduce startup time
export function initKeyboardShortcuts({ bind }: Params): void {
  bind(KeyboardShortcutsContribution).toSelf().inSingletonScope();
}

// ❌ Bad
// TODO: fix this
const x = y;  // Assigns y to x
```

## Pre-commit Checklist

Before committing, verify:

- [ ] Code compiles: `npm run build --workspace=custom-ui`
- [ ] Linting passes: `npm run lint`
- [ ] Formatting applied: `npm run format`
- [ ] No debug code: Remove `console.log()`, `debugger`, etc.
- [ ] Tests pass: `npm test` (if applicable)
- [ ] Accessibility checked: Tab through, screen reader tested
- [ ] No security issues: `npm audit`
- [ ] Commit message follows conventions (see CONTRIBUTING.md)

## Questions?

- Check existing code for patterns
- Ask in GitHub Discussions
- Review similar files for examples
- Read referenced style guides (Prettier, ESLint)

---

**Last updated**: May 2026  
**Version**: 1.0  
**Aligned with**: TypeScript 5.8, Theia 1.67.0, ESLint 9
