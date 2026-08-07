# BountyLens

[![CI](https://github.com/rowenapinto001/BountyLens/actions/workflows/ci.yml/badge.svg)](https://github.com/rowenapinto001/BountyLens/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome MV3](https://img.shields.io/badge/Chrome-MV3-5746e8.svg)](public/manifest.json)
[![Tech Stack](https://img.shields.io/badge/Tech-React%20%2B%20TypeScript-3178c6.svg)](#tech-stack)
[![Status](https://img.shields.io/badge/Status-v0.1.0-43a047.svg)](https://github.com/rowenapinto001/BountyLens/releases/tag/v0.1.0)


<!-- media:start -->

<p align="center">
  <img src="docs/media/logo.png" width="96" alt="BountyLens logo">
</p>

<h3 align="center">Find GitHub bounties worth your time.</h3>

<p align="center">
  <a href="docs/media/demo.mp4">
    <img src="docs/media/demo-thumbnail.webp" width="640" alt="Watch the BountyLens demo">
  </a>
  <br>
  <a href="docs/media/demo.mp4"><b>Watch the 30 second demo</b></a>
</p>

## Screenshots

![Bounties matched to your level.](docs/media/1-experience.webp)

<sub>Bounties matched to your level.</sub>

<details>
<summary><b>See 4 more</b></summary>

### Results

![Real issues, ranked and filtered.](docs/media/2-results.webp)

<sub>Real issues, ranked and filtered.</sub>

### Saved

![Keep the ones worth a look.](docs/media/3-saved.webp)

<sub>Keep the ones worth a look.</sub>

### Dark

![Dark mode, because of course.](docs/media/4-dark.webp)

<sub>Dark mode, because of course.</sub>

### Levels

![Change level, change the list.](docs/media/5-levels.webp)

<sub>Change level, change the list.</sub>

</details>

<sub>Every screenshot is captured from the real extension running in Chrome, not
mocked up, so they cannot drift from what the product actually does. Regenerate
them with the tooling in the store-publishing workspace.</sub>

<!-- media:end -->

Find GitHub bounties that match your experience.


## What it does

BountyLens searches public GitHub issues with the exact `bounty` label, filters out pull requests, estimates difficulty locally, and highlights lower-comment opportunities that may be easier to review quickly.

## Why I built this

I wanted a practical developer tool that reduces the noise around finding open-source bounty opportunities. Instead of scrolling broad GitHub searches, BountyLens gives a focused side-panel workflow with ranking, saving, and direct issue links.

## Status

- Version: `0.1.0`
- Release tag: `v0.1.0`
- License: MIT
- Bounty verification: exact GitHub label detection only. Availability and payment are not independently verified.

## Features

- First-run onboarding with one experience question.
- Public GitHub REST API search for `is:issue is:open label:bounty`.
- Exact case-insensitive `bounty` label validation.
- Pull request exclusion and malformed-result filtering.
- Local rule-based difficulty estimation without AI.
- Experience-based ranking for Student, Junior Developer, Software Engineer and Senior Engineer.
- Chrome side panel UI with refresh, experience tabs, saved bounties, theme toggle, pagination, loading, empty and error states.
- Local cache using `chrome.storage.local` with a 15-minute freshness window.
- Rate-limit, offline and GitHub failure handling.
- Issue buttons that open the original GitHub issue.
- Light and dark modes stored locally.
- Direct page-number pagination for faster navigation.

## Tech Stack

- Chrome Extension Manifest V3
- TypeScript
- React
- Vite
- Plain CSS
- Chrome Side Panel API
- GitHub REST API
- `chrome.storage.local`
- Lucide React icons
- Vitest

## Project Structure

```text
public/                 Extension manifest and icons
sidepanel/              Vite HTML entry for the side panel build
src/background/         Chrome service worker
src/sidepanel/          Side panel React entry and styles
src/components/         Reusable UI components
src/github/             GitHub API query, client and validation
src/ranking/            Difficulty and recommendation scoring
src/storage/            Chrome local storage helpers
src/hooks/              React data and storage hooks
src/utils/              Dates, labels, repository and pagination utilities
tests/                  Vitest utility tests
```

## Setup

```bash
npm install
```

## Development Commands

```bash
npm run dev
npm run typecheck
npm test
```

## Production Build

```bash
npm run build
```

The production extension is written to `dist/`.

## Load the Extension in Chrome

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose Load unpacked.
5. Select the `dist/` folder.
6. Click the BountyLens toolbar icon to open the side panel.

## GitHub API Rate Limits

BountyLens uses GitHub's free public unauthenticated REST API. This keeps setup simple and avoids tokens, but GitHub may limit repeated requests. When the limit is reached, BountyLens reads the public rate-limit headers and shows the reset time when available.

## Cache

Fetched issues are cached locally for 15 minutes. If the cache is fresh, BountyLens uses it without making another GitHub request. If cached results are older than 15 minutes, the extension shows them immediately while fetching fresh data. The Refresh button bypasses the cache.

## Privacy

BountyLens does not collect personal data. BountyLens does not use analytics. BountyLens does not sell user data. The selected experience, theme, saved bounties and cached public issues are stored locally in `chrome.storage.local`. GitHub issues are retrieved directly from GitHub's public API. No browsing history is read. No GitHub login is required.

## Current Limitations

- The MVP ranks the first 100 recently updated matching GitHub search results.
- It does not detect bounty amounts or currencies.
- It does not search external bounty platforms.
- It does not claim issues because GitHub has no universal issue-claiming mechanism.
- It does not authenticate with GitHub or access private repositories.
- Saved bounties are local to the browser profile.

## Repository Notes

- `node_modules/`, `dist/`, logs, coverage output and local environment files are ignored.
- Run `npm run build` before loading or refreshing the unpacked extension from `dist/`.
- Commit source files, tests, manifests, package files, README updates and icons; do not commit generated dependency or build folders.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

For security reports, read [SECURITY.md](SECURITY.md). Project changes are tracked in [CHANGELOG.md](CHANGELOG.md).

## License

BountyLens is available under the [MIT License](LICENSE).

## Future Ideas

- Optional additional GitHub search pages.
- Optional repository allowlist stored locally.
- More transparent scoring breakdown controls.
- Exportable shortlist stored locally.
