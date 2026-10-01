# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Versioning and deprecation policy page under Community, and the manual screen-reader test log in `internal/at-testing.md`.

## [0.4.0] - 2026-10-02

The right-to-left release: logical properties throughout, the first Arabic pack, and six complete page templates.

### Added

- Right-to-left support. Every component uses logical properties, with explicit mirroring for the chevrons, the start arrow and the select caret, so `dir="rtl"` on `html` flips the layout. A build test keeps physical layout properties out of the core.
- Page templates: service home, start page, question page, check your answers, confirmation and service problem, as complete HTML files in `site/templates/`, previewable on the docs site under any pack and tested with axe as whole pages.
- Morocco pack (`ma.css`): the first right-to-left pack. Arabic default strings with French and English, dirhams as a suffix currency, the CNIE number, regions and provinces, and a pentagram flag. Packs can declare `direction`, and the docs render a right-to-left pack's examples mirrored.

## [0.3.0] - 2026-10-02

The audit release. The command-line checker lives in its own package, [afrigov-audit](https://github.com/omoyolab/afrigov-audit); this repository gains the scoreboard that uses it.

### Added

- Accessibility check scoreboard: `scoreboard/sites.json` lists thirty public services across the six pack countries, `scripts/scoreboard.mjs` audits them with afrigov-audit, and the docs render a page grouped by country with each site's biggest problem and the component that fixes it. The page appears once results are committed; the monthly workflow is enabled at first publication after courtesy notices to each site.
- A re-check issue template for sites that have fixed problems or dispute a result.
- Logo: the focus-ring mark in the header, footer, favicon and README, drawn in the pack's primary colour.

### Fixed

- Header: hovering the brand link underlines only the organisation name, not the mark beside it.
- Documentation asset URLs carry a content hash, so a deploy never pairs new HTML with a cached script or stylesheet.

## [0.2.0] - 2026-10-02

The African patterns release: the inputs USWDS and GOV.UK do not have, a pack schema, SVG flags, two more countries, and a proper documentation site.

### Added

- Pack JSON Schema at `tokens/packs/pack.schema.json`, published in the package and enforced in the tests. Every pack now references it with `$schema` for editor validation.
- Phone number component (`.ag-phone`): dialling-code select and national number field. Packs carry a `phone` block (code, example, hint, length).
- National ID input (`.ag-id-input`): label, hint, maxlength, pattern and keyboard from the pack's `id` block, which gains `pattern`.
- Region selector: a first select with `data-ag-region-for` and a second grouped by `optgroup`; `afrigov.js` narrows the second to the chosen region. Packs gain `regions.sub` with sample second-level divisions.
- Rwanda pack (`rw.css`) and South Africa pack (`za.css`), both with SVG flags. Rwanda's blue is derived for AA; South Africa lists all eleven official languages with English and an Afrikaans draft filled in.
- SVG flags: a pack can set `flagSvg` to an accurate 3:2 SVG in `tokens/packs/flags/`; the build publishes it as `dist/flags/<code>.svg` and the flag component paints it over the stripes. Ghana, Kenya, Rwanda and South Africa ship one. Kenya's shield is a geometric approximation pending accurate artwork.
- Currency display (`.ag-money`), character count (`data-ag-char-count`, script-enhanced with a polite live region), service card (`.ag-cards`, `.ag-card`), details (`.ag-details`), language switcher (`.ag-lang`).

### Changed

- Documentation is now a multi-page site generated from `site/`: Get started, Styles, Components (a page per component), Patterns, Country packs (a page per pack, generated from the pack JSON), Community. The country choice is remembered across pages. axe runs on every page with every pack.

## [0.1.2] - 2026-10-01

### Added

- Senegal country pack (`sn.css`), the first francophone pack. Packs can now set a default `language` for their strings and a `currency.position` of `suffix` with a number `locale`; the docs examples honour both. Green is derived for AA like Nigeria's.

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

[Unreleased]: https://github.com/omoyolab/afrigov/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/omoyolab/afrigov/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/omoyolab/afrigov/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/omoyolab/afrigov/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/omoyolab/afrigov/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/omoyolab/afrigov/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/omoyolab/afrigov/releases/tag/v0.1.0
