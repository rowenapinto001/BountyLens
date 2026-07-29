# Security Policy

## Supported Versions

BountyLens is currently pre-1.0. Security fixes are handled on the latest `main` branch and latest tagged release.

## Reporting a Vulnerability

Please report security issues privately instead of opening a public issue.

Use GitHub's private vulnerability reporting if it is enabled for this repository. If it is not available, contact the repository owner through GitHub and include:

- A short description of the issue.
- Steps to reproduce.
- Potential impact.
- Any suggested fix, if known.

Please do not include working exploits in public issues.

## Scope

BountyLens:

- Uses the public GitHub REST API.
- Stores selected experience, theme, saved issues and cached public issue data in `chrome.storage.local`.
- Does not request GitHub tokens.
- Does not access private repositories.
- Does not collect analytics or sell user data.
