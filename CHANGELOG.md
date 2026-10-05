# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and versions follow
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Docs: the Square / Rounded switch is out of the banner, which it made crowded. The Corners page shows both side by side.

## [0.15.0] - 2026-10-04

### Added

- **Rounded corners, for the whole site.** `data-ag-corners="rounded"` on `html` rounds buttons, fields and the search box by 8px, and cards, panels, alerts, empty states and the error summary by 12px. Square stays the default. Two new tokens, `--ag-size-radius-field` and `--ag-size-radius-surface`, sit beside `--ag-size-radius`, so a site can also set its own sizes. Flag-edge cards round their stripe to match. A Corners page under Styles, and a Square / Rounded switch in the docs banner.
- **Pill button.** `ag-button--pill` gives a call to action fully round ends, with either setting.

### Changed

- **The search box and its button have a gap**, each with its own border. Joined, the box's focus ring ran into the button and the two read as one block.

## [0.14.1] - 2026-10-04

### Changed

- **Form fields are capped at 36rem**, so a form reads as one column instead of a stack of page-wide boxes. On a phone they still fill the width. The `ag-input--width-*` modifiers set narrower caps as before.
- **A calmer focus on text fields.** A field shows focus every time it is clicked, so it now gets a thick dark edge and a ring in the pack's primary colour instead of the yellow ring. Links and buttons keep the yellow, where keyboard users rely on it. The contrast check now also holds the primary colour to 3:1 on the alt background, where the header search box sits.

## [0.14.0] - 2026-10-04

### Added

- **Search.** `ag-search` is a labelled search box and Search button on one line, as a plain GET form, so it works with no script. `ag-search--lg` is the large box for the top of a results page. In the header, `ag-header__search` is a square button with a magnifier that opens the box under the header; it is a details element, so it needs no script, and with `afrigov.js` the cursor goes straight into the box and Escape closes it. The button is square, so the header stays on one row.
- **Site search results pattern**: the box with the words in it, a count with `role="status"`, results with `ag-result__title`, `__where` and `__text`, the searched words in `mark`, pagination, and a no-results page that helps.
- The Search component page says where results come from: WordPress's own search, Pagefind for a static site, or another system's results page.

## [0.13.2] - 2026-10-04

### Fixed

- **A line under a hero's buttons** sat right against them. Whatever follows `ag-hero__actions`, such as "Moving house? Transfer your connection", now has 1.5rem of space above it.

### Changed

- **Install with the exact version.** The docs, the README and the page templates now link to `afrigov@<version>` in full, such as `afrigov@0.13.1`, instead of a range such as `afrigov@0.13`. Browsers keep a range for up to seven days, so a fix could take a week to reach a returning visitor; an exact version changes address with each release. The build writes the current version into the README and the templates, and a test fails if one is left behind. Get started explains why.

## [0.13.1] - 2026-10-04

### Fixed

- **Links in a primary hero and in a cover panel** kept the page's link colour, so a green link on a green hero could not be seen. They now take the hero's text colour, underlined, as on a coloured band. Plain paragraphs and list items in the panel do too.
- **A visited button on a coloured band** took the band's text colour, the same as its own background. Buttons are now left out of the band's link rule and keep their colours.

## [0.13.0] - 2026-10-03

### Added

- **Tall hero.** `ag-hero--tall` is at least 28rem high from tablet width, with the text centred, for a hero with a longer lead or a line under the actions. It works with every variant. Phones keep the natural height.
- Docs: an Images page under Styles, with a weight limit for each kind of image, the formats to use, `srcset` and `sizes` to send each screen the size it needs, and how to check a page with afrigov-audit.

### Changed

- **More room in every hero.** 3rem above and below the text from tablet width, 2rem on a phone, up from 1.25rem. The title, lead and actions no longer crowd each other.
- **A smaller hero lead.** The lead in a hero is 1.25rem at every width, a step below a lead elsewhere, so it reads as text under the title.

## [0.12.0] - 2026-10-03

### Added

- **Video.** `ag-video` shows a still with a play button, the title and the length. The player loads only when someone presses it; without the script the poster is a link to the video. Embeds use `youtube-nocookie.com`. A transcript goes under the player in a details element.
- **Video cards.** `ag-card--video` puts a play mark on a card's picture and the length in its corner, with `ag-card__duration`.
- **Filters.** `ag-filters` is a row of links that narrow a list by topic, each a real link that works with no script.
- **Video library pattern**, and a **video page template**: the player, the transcript, what it covers and more videos.
- **A flyer on the event page.** `ag-event-detail` puts the details beside an `ag-flyer`, which links to the full-size image. The guidance: everything on a flyer is also written on the page.
- The hero page shows a video beside the text.
- Decision 004: no autoplaying or background video, and video loads only when pressed.

## [0.11.3] - 2026-10-03

### Changed

- Cover hero on a phone: the panel rests on the bottom of the photograph, pulled in from the sides, like a card on the picture. It used to start exactly where the photograph ended, so the two looked jammed together.

## [0.11.2] - 2026-10-03

### Changed

- The organisation's name in the header is no longer underlined on hover. It is the link home, which people expect, and the underline met every arrival on the home page under the pointer that had just clicked it. Keyboard focus is unchanged. Links elsewhere stay underlined.
- Docs: the hero page shows a hero inside a primary band with an image beside the text, with two actions and a link.

## [0.11.1] - 2026-10-03

### Fixed

- `ag-card--flag`: the flag edge sits at the very top of the card and covers the card's side borders. It sat inside the padding, with grey showing above it at each corner.

## [0.11.0] - 2026-10-03

### Added

- **Events.** `ag-events` lists what is coming up: a date block with the day and month as a `time` element, the title, where and when, and a line about it. `ag-event__date--tbc` for a date not yet fixed, `ag-event--past` for one that has passed, `ag-event__date--lg` for the top of an event's page. Works on coloured bands.
- **Event page template**, `templates/event.html`: the date block, when and where as a summary list, what happens, what to bring, a calendar file, who to ask.
- `ag-card--flag` draws a card's top edge in the country's flag colours, and `ag-footer--striped` does the same for the footer's top edge, matching the striped header.
- `ag-hero--cover-end` puts the cover hero's panel on the right, and `ag-hero--cover-top` at the top. The docs show a list inside the panel.

## [0.10.1] - 2026-10-03

### Fixed

- A dated list on a primary, dark or accent band: the meta line and the hairlines take the band's colour. The meta line kept its grey and failed contrast.

## [0.10.0] - 2026-10-03

### Added

- **Section menus in the header.** A navigation item can open a short list of links on click, never on hover. It is a native `details` element, so it works with no script; the script adds one menu open at a time, Escape to close, and closing on a click elsewhere. Markup: `ag-nav__section`, `ag-nav__details` with `data-ag-menu`, `ag-nav__summary`, `ag-nav__menu`, `ag-nav__menu-link`.
- **Hero with the text in a panel over a photograph.** `ag-hero--cover` lays the title, lead and action in a solid panel over a full-width photograph, so the contrast is between the text and the panel. On a phone the photograph sits above the panel. `ag-hero--cover-light` is the same with a light panel.

### Changed

- The script-tag build may be up to 4 KB. It is 3.1 KB.

## [0.9.5] - 2026-10-03

### Changed

- README brought up to date: seven packs, the full component list, both use cases, the current size, and a short note on where the project stands in place of a version history. The roadmap files and the naming decision are no longer in the repository; the changelog is the history.

## [0.9.4] - 2026-10-03

### Changed

- People: `ag-people--2` and `ag-people--3` are the size a person has in four columns, in the middle of the page, so the people at the top of a page match the members under them. `ag-people--6` added.

## [0.9.3] - 2026-10-03

### Fixed

- In `ag-people--2` each person is 18rem wide, a little wider than one of four columns, so the people at the top of a page are never smaller than the members under them.

## [0.9.2] - 2026-10-03

### Fixed

- `ag-people--2` puts the two people side by side in the middle of the page, with the usual gap between them. They used to sit at the start of two half-page columns, far apart.

## [0.9.1] - 2026-10-03

### Added

- `ag-people--2`, `ag-people--3` and `ag-people--4` fix the number of columns, so a chair and a chief executive can sit in two columns above the members in four.

## [0.9.0] - 2026-10-02

Everything here came from the second use case, a rebuild of Ghana's National Identification Authority website, and from looking at it beside the first: two countries, and both sites green and white.

### Added

- **Flag stripe.** `ag-header--striped` replaces the header's bottom border with a line in the country's flag colours, and `ag-stripe` is the same line on its own. Until now a pack changed one colour, and five of the seven packs have a green one.
- **Accent band.** `ag-band--accent` is a band in the pack's second colour: Ghana's gold, Kenya's red. A new token, `--ag-color-on-accent`, is ink or white, whichever is easier to read on the accent. The build checks the pair in every pack.
- `ag-card--accent`: the top edge of a card in the accent colour.
- **Feature.** `ag-feature` describes one thing: a picture of it beside its name, a few lines and its main points. `ag-feature--reverse` puts the picture after the text.
- **People.** `ag-people` lists the leadership of an organisation with a portrait, name and role each. `ag-people--rows` is a compact row per person.
- **Steps.** `ag-steps` is the numbered steps of a process, with or without a title on each (#23).
- **Key figures.** `ag-stats` shows a few headline numbers with labels, with the accent colour beside each (#24).
- `ag-main--flush` removes the space at the top and bottom of the page, so the first band meets the header and the last meets the footer (#22).

### Changed

- A secondary button on a primary, dark or accent band, or in a primary hero, is an outline in the band's text colour. It used to look the same as the main button (#25).
- Docs: a table with two columns goes inside `ag-prose` to hold it to the reading width (#26). The hero page says not to put a primary hero under a primary header.
- Docs: the Use cases page covers the rebuilds and the audit tool. The WordPress theme is not listed while its approach is being decided.

### Fixed

- The Ghana pack lists all sixteen regions. It had six (#28).

## [0.8.8] - 2026-10-02

### Fixed

- Official banner on phones: the notice keeps at least 12rem of width, so anything else placed in the banner wraps under it instead of squeezing the notice into a narrow column. On the docs site the country preview indicator now sits under the notice.
- A test fails the build if the notice in any banner is squeezed at phone width.

## [0.8.7] - 2026-10-02

### Added

- `ag-prose--centred` puts the text column in the middle of the page, with the lines still starting at the column's edge.

### Changed

- Docs site: the header tagline is "Accessible government design system", on one line, so the header is one line shorter.

## [0.8.6] - 2026-10-02

### Added

- Header: `ag-header--stacked` puts the navigation on its own row under the brand, for more than six links or a long name. The header docs say how to check for an accidental wrap and what to do about it.
- A test that fails the build if the header of the docs site or of any page template wraps onto a second row at 1024 or 1280 pixels.
- Docs: a Use cases page, with the first rebuild and its live scores, the WordPress theme afrigovPress, and afrigov-audit.

### Fixed

- Docs site: the navigation stays on one row beside the logo. Adding Use cases had pushed it onto a second row at every desktop width.

### Changed

- The planning folder is `project/` instead of `internal/`. It holds the component registry, the roadmap and the decision records, and it has always been public. Operational notes that are not for the public repository moved out of it.

## [0.8.5] - 2026-10-02

### Fixed

- Header: no layout shift on phones when the script arrives late. With the `ag-js` class set in the head, the menu is collapsed from the first paint. Measured on the first rebuild: cumulative layout shift from 0.32 to 0.
- Service card: the focus ring shows for the keyboard only, not as a flash on a click or a tap.

### Added

- Pattern: search and answer engines. The head of every page, structured data for organisations, services, breadcrumbs, news and questions, and how to write so search engines and assistants quote the page correctly.
- The page templates carry a description, the head lines for the menu, a preconnect to the CDN, and structured data on the home and start pages.

## [0.8.4] - 2026-10-02

### Changed

- Footer: columns are at least 10rem wide instead of 12rem, so four fit in one row on smaller laptops. The docs say how the columns wrap.

## [0.8.3] - 2026-10-02

### Fixed

- The footer sits at the bottom of the viewport on a short page instead of halfway up it. The body is a column and the main area grows to fill it.

### Added

- Pattern: photo gallery. Albums, an album's photos and one photo at full size, from the card, gallery and figure components. No lightbox, no carousel.

## [0.8.2] - 2026-10-02

### Changed

- Header on small screens: the Menu button sits beside the brand on the first row instead of under it, a chevron shows whether the menu is open, and the open menu has a hairline between items.
- Docs: the language switcher example keeps its two-language sample when the previewed pack has translated strings for only one language.

## [0.8.1] - 2026-10-02

### Fixed

- Service card: `ag-cards--wide` for a grid of horizontal cards, so titles are not squeezed into a standard column.

### Changed

- Header docs: how an agency uses the header, with the parent ministry in the sub line.

## [0.8.0] - 2026-10-02

Variants, so two sites built from the same components do not have to look the same.

### Added

- Band (`.ag-band`): a full-width section with a `tint`, `primary` or `dark` background. A hero inside a band takes its colour.
- Hero: `centred` and `image-first`.
- Service card: `tinted`, `plain`, `horizontal` with `ag-card__body`, and an `ag-card__image` slot for a photograph across the top.
- Footer: `light`.
- Statement: `primary`.
- Pagination: `simple`, previous and next only.
- Gallery: `2` and `4` fixed columns.
- Confirmation panel: `neutral`, for endings that are not a success.

## [0.7.0] - 2026-10-02

### Added

- Dated list: `ag-list__item--media` with an `ag-list__media` thumbnail before the text, for news and article listings.

## [0.6.4] - 2026-10-02

### Fixed

- Statement: the box ends where the text's measure ends instead of stretching across the page.

## [0.6.3] - 2026-10-02

### Added

- Statement: `ag-statement--full` for the whole message on its own page, with a larger portrait.

## [0.6.2] - 2026-10-02

### Changed

- Header: the brand can be 28rem wide on desktop instead of 24rem, so a ministry's full name fits on two lines beside a crest instead of three.

## [0.6.1] - 2026-10-02

### Added

- Service card: `ag-card__logo`, a fixed-height slot above the title for an agency's or partner's mark. The name stays the link text, so the image is decorative.

## [0.6.0] - 2026-10-02

Three more gaps from the fmcide.gov.ng rebuild.

### Added

- Statement (`.ag-statement`): a message from the head of an organisation, portrait beside the text, name and role after it, link to the full message. The hero docs now say the portrait belongs here, not in the hero.
- Social links (`.ag-social`): the network's name as the link text, a decorative inline SVG icon, footer only.
- Footer address (`.ag-footer__address`), and `address` is no longer italic anywhere.

### Changed

- Hero docs use a neutral example instead of a ministry's text.

## [0.5.1] - 2026-10-02

### Changed

- Official banner: "How you know this is official" sits on the same line as the notice when closed, and takes the full width only when open. The banner is one line tall again.
- Header: `ag-header__logo--lg` for a crest beside a three-line organisation name.

## [0.5.0] - 2026-10-02

Six components that the fmcide.gov.ng rebuild showed were missing. Each closes an issue filed from `afrigov-usecase-fmcide/FINDINGS.md`.

### Added

- Back link (`.ag-back-link`) for question pages; the page templates no longer carry it as page-local CSS (#17).
- Dated list (`.ag-list`) for news, events, articles and documents: a link with a date line and an optional summary (#18).
- Image and figure (`.ag-figure`, `.ag-image`, `.ag-gallery`) with the rules that matter: caption or alt text, never both; width and height always; lazy-load below the fold; 150 KB per image; no text over photographs; no carousels (#19).
- Download link (`.ag-download`) with the format and size inside the link text (#20).
- Empty state (`.ag-empty`) for a listing with nothing to list (#21).
- Hero (`.ag-hero`, with `--image` and `--primary` variants): title, lead, one action, and an optional photograph beside the text. The service home template uses it.

### Changed

- The service home template has a hero and uses the dated list for news.

## [0.4.1] - 2026-10-02

### Fixed

- Header: a long organisation name ("Federal Ministry of …") now wraps inside the brand on desktop instead of pushing the navigation onto a second row.

### Added

- Versioning and deprecation policy page under Community, and the manual screen-reader test log in `internal/at-testing.md`.
- Header docs: where a crest or logo goes, and why packs ship flags but not coats of arms.

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

[Unreleased]: https://github.com/omoyolab/afrigov/compare/v0.4.1...HEAD
[0.9.0]: https://github.com/omoyolab/afrigov/compare/v0.8.8...v0.9.0
[0.4.1]: https://github.com/omoyolab/afrigov/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/omoyolab/afrigov/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/omoyolab/afrigov/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/omoyolab/afrigov/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/omoyolab/afrigov/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/omoyolab/afrigov/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/omoyolab/afrigov/releases/tag/v0.1.0
