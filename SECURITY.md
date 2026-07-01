# Security Policy

## Reporting a Vulnerability

Please do **NOT** open a public issue for security vulnerabilities. Instead, report security issues
privately.

### How to Report

1. **Email**: Send a detailed report to the maintainers
   - Include: vulnerability description, affected versions, proof of concept (if safe to share)
   - Subject line: `[SECURITY] Vulnerability Report - [Brief Description]`

2. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting
   - Navigate to the repository's Security tab
   - Click "Report a vulnerability"
   - Fill in details and submit privately

### What to Include

- **Vulnerability type**: XSS, CSRF, RCE, information disclosure, etc.
- **Affected versions**: Which releases/commit hashes are affected
- **Description**: Clear explanation of the vulnerability
- **Impact**: Severity, attack requirements, potential damage
- **Proof of concept**: Minimal reproduction (if safe to share)
- **Suggested fix**: If you have a patch (optional)

## Security Guidelines for Contributors

### Code Review

All code changes are reviewed before merging, including security analysis:

- No hardcoded credentials or secrets
- No unvalidated user input usage
- Proper error handling without leaking stack traces
- No use of unsafe functions (eval, innerHTML, etc.)
- Dependency vulnerabilities checked via `npm audit`

### Dependency Management

We actively manage dependencies for security:

- **Weekly audits**: `npm audit` runs on all dependencies
- **Prompt updates**: Security patches applied quickly
- **Vulnerability tracking**: Monitoring CVE databases
- **Policy**: No known vulnerabilities in production releases

### Secure Coding Practices

Contributors should follow:

1. **Input validation**: Validate and sanitize all user input
2. **Output encoding**: Properly encode data for context (HTML, URL, JS, etc.)
3. **Error handling**: Don't expose sensitive details in error messages
4. **Authentication**: Use Theia's built-in auth mechanisms
5. **Authorization**: Respect file permissions and workspace boundaries
6. **Secrets**: Never commit credentials, keys, or tokens

### Examples

**❌ Bad**:

```typescript
// Don't use innerHTML with user input
const userContent = getUserInput();
element.innerHTML = userContent; // XSS vulnerability

// Don't hardcode secrets
const apiKey = 'sk-1234567890abcdef';
```

**✅ Good**:

```typescript
// Use textContent for user input
const userContent = getUserInput();
element.textContent = userContent; // Safe

// Use environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) throw new Error('API_KEY not set');
```

## Known Security Considerations

### Theia IDE Security

PlainScript inherits security model from Theia:

- **Workspace isolation**: File access restricted to workspace root
- **Extension sandboxing**: Plugins run in browser context (browser app) or Node.js with access
  restrictions (Electron)
- **Authentication**: Integrated through Theia's GitHub auth
- **No telemetry**: No data collection by default

### PlainScript Additions

PlainScript-specific considerations:

- **Simplified UI**: Fewer attack vectors (removed debug panels, etc.)
- **Accessibility focus**: ARIA and keyboard navigation don't add security risks
- **Open source**: Code transparency allows security auditing

## Security Best Practices for Users

### Installation

1. **Verify source**: Download from official GitHub releases only
2. **Check signatures**: Verify file integrity if provided
3. **Update regularly**: Apply security patches promptly

### Usage

1. **Workspace trust**: Only open folders/workspaces you trust
2. **Extensions**: Only install extensions from reputable sources (Open VSX)
3. **Credentials**: Never commit `.env` files with secrets
4. **Git**: Verify commit signatures from trusted developers

### Deployment

1. **Network security**: Run behind firewall if exposing browser version
2. **Access control**: Use authentication (SSH keys, etc.) for shared systems
3. **Updates**: Keep Node.js, npm, and plugins updated
4. **Monitoring**: Check logs for suspicious activity

## Supported Versions

Security updates are provided for:

- **Latest release**: All security patches
- **Previous minor**: Critical patches only
- **Older versions**: Not supported; upgrade recommended

Example: If the latest release is 1.2.0, security updates are provided for 1.2.x and 1.1.x.

## Disclosure Timeline

After receiving a security report:

1. **Acknowledgment** (within 48 hours): Confirm receipt and initial assessment
2. **Investigation** (up to 7 days): Reproduce and analyze vulnerability
3. **Fix** (up to 14 days): Develop and test patch
4. **Patch release**: Security release published
5. **Disclosure** (after release): Public notification if appropriate

## Security Headers & Configuration

### Browser Version

- **Content-Security-Policy**: Restricted by Theia framework
- **X-Frame-Options**: `DENY` (not embedded by default)
- **X-Content-Type-Options**: `nosniff`

### Electron Version

- **Preload scripts**: Isolated context
- **IPC validation**: Messages validated between processes
- **Scheme restrictions**: Custom schemes disabled

## Third-Party Vulnerabilities

We monitor and report vulnerabilities in:

- **Theia IDE**: Security updates propagated promptly
- **Plugins** (Eclipse builtin, Catppuccin, Indent Rainbow): Updates checked regularly
- **Dependencies**: `npm audit` integrated into build process

## Contribution Guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines. Security
considerations:

- Don't introduce dependencies without security review
- Follow [STYLE_GUIDE.md](./STYLE_GUIDE.md) secure coding practices
- Run `npm audit` before submitting PR
- Document any security-sensitive changes

## Questions?

For security-related questions (not vulnerability reports):

- Open a GitHub Discussion
- Email maintainers privately
- Check existing documentation first

---

Thank you for helping keep PlainScript secure! 🔒
