# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.1] - 2026-10-01

### Added

- Ghana country pack (`gh.css`): red, gold and green flag, Ghana Card, cedis, regions. Green is the primary; gold is accent only because it fails contrast as text. (#5)

## [0.1.0] - 2026-09-30

First release.

### Added

- Country-neutral core: reset, element defaults, layout helpers and a focus ring that is visible on any background.
- Components: official-website banner with flag, header and navigation, footer, skip link, button (primary, secondary, warning, start), breadcrumb, pagination, text input, textarea, select, radio, checkbox, input group, error summary, date input, alert, accordion, table, badge, confirmation panel, summary list, inset text.
- Country packs for Nigeria (`ng.css`) and Kenya (`ke.css`), each generated from one JSON token file with official colours, flag stripes and banner strings.
- Token pipeline in the W3C Design Tokens format. Packs declare official colours; the build derives text-safe primaries, hover states, tints and link colours, and fails if any colour pair misses WCAG AA.
- Optional `afrigov.js` (1.5 KB): collapsible navigation on small screens, focus on the error summary.
- Tests: 90 unit tests for tokens, contrast maths and build output; Playwright with axe-core on the docs page with every pack; 48px touch-target check; 20 KB gzip budget for the core.
- Docs site with every component, a pack switcher, and a diacritics test for Yoruba, Hausa, Igbo, Swahili, French, Portuguese and Arabic.

[Unreleased]: https://github.com/omoyolab/afrigov/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/omoyolab/afrigov/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/omoyolab/afrigov/releases/tag/v0.1.0
