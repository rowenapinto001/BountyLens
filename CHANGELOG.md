# Changelog

All notable changes to BountyLens will be documented in this file.

The format is based on Keep a Changelog, and this project follows semantic versioning for tagged releases.

## [Unreleased]

### Added

- GitHub repository documentation, contribution guide, security policy, issue templates and CI workflow.

## [0.1.0] - 2026-07-29

### Added

- Chrome Manifest V3 side-panel extension.
- GitHub public REST API search for open issues with the exact `bounty` label.
- Local difficulty estimation and experience-based ranking for Student, Junior Developer, Software Engineer and Senior Engineer levels.
- Compact 10-issue pagination with direct page-number navigation.
- Low-comment-first issue ordering to surface less-crowded opportunities.
- Saved bounty list stored in `chrome.storage.local`.
- Light and dark themes.
- Refresh, loading, empty, warning and error states.
- Extension icon and README demo thumbnail.

### Notes

- BountyLens detects the exact GitHub label `bounty`; availability and payment are not independently verified.

[Unreleased]: https://github.com/rowenapinto001/BountyLens/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/rowenapinto001/BountyLens/releases/tag/v0.1.0
