# Contributing

PlainScript welcomes improvements that preserve the project's core values:

- Accessibility first
- Simplicity over feature bloat
- Clear and maintainable architecture

For full contribution guidelines, see the repository document:

- [CONTRIBUTING.md](https://github.com/mrhunsaker/PlainScript/blob/main/CONTRIBUTING.md)

---

## Local Validation Checklist

Run these commands before opening a PR:

```bash
npm run lint
npm run format:check
npm run build
```

If you changed documentation:

```bash
pip install -r docs/requirements.txt
mkdocs build --strict
```
