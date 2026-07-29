# Contributing to BountyLens

BountyLens is a Chrome MV3 side-panel extension built with React, TypeScript and Vite.

## Local Setup

```bash
npm install
npm run dev
```

For a production extension build:

```bash
npm run build
```

Then open `chrome://extensions`, enable Developer mode, choose Load unpacked and select the `dist/` folder.

## Development Checks

Run these before opening a pull request.

```bash
npm run typecheck
npm test
npm run build
```

## Project Guidelines

- Keep GitHub API behavior real. Do not add fake issue data to production code.
- Preserve the exact `bounty` label check. BountyLens does not verify payment.
- Keep ranking logic deterministic and covered by focused tests.
- Keep the side-panel UI usable between 320px and 600px wide.
- Do not commit `node_modules/`, `dist/`, logs, local environment files or coverage output.
- Keep changes small.

## Commit Messages

Use Conventional Commits:

```text
type(scope): short summary
```

Examples:

```text
fix(ui): improve dark mode icon contrast
feat(ranking): sort issues by comment count
docs(readme): add demo thumbnail
chore(deps): move vite packages to dev dependencies
```

Common types:

- `feat`: new user-facing behavior
- `fix`: bug fix
- `docs`: documentation only
- `test`: tests only
- `chore`: tooling, metadata or maintenance

## Pull Requests

1. Describe what changed and why.
2. Include screenshots or a short screen recording for UI changes.
3. Mention the checks you ran.
4. Call out any GitHub API, storage or ranking behavior changes.

## Reporting Issues

When filing a bug, include:

- Browser and Chrome version.
- Steps to reproduce.
- Expected behavior.
- Actual behavior.
- Console errors or screenshots, if available.

Do not include private tokens, private repository details or personal data in issues.
