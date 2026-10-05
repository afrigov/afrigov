<p><img src="site/logo.svg" alt="afrigov" width="200" height="48"></p>

**Open-source components for building accessible African public-service websites.**
One country-neutral core. A token pack per country. Plain CSS, 9 KB gzipped, no build step.

[![npm](https://img.shields.io/npm/v/afrigov?color=1f4e79)](https://www.npmjs.com/package/afrigov)
[![CI](https://github.com/omoyolab/afrigov/actions/workflows/ci.yml/badge.svg)](https://github.com/omoyolab/afrigov/actions/workflows/ci.yml)
[![WCAG 2.1 AA, tested in CI](https://img.shields.io/badge/WCAG%202.1-AA%20tested%20in%20CI-00703c)](test/docs.a11y.js)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Docs and live components:** https://omoyolab.github.io/afrigov

---

Most government websites in Africa fail basic accessibility checks. The people building them care; the problem is that every ministry, agency and contractor starts from zero. afrigov is the starting point they do not have: accessible components, national colours that pass contrast, official-website banners in local languages, and a size budget that respects a 2G connection.

Light pages matter because the reader pays for them. Every megabyte comes out of someone's phone data, usually a prepaid bundle. afrigov is 9 KB of CSS. One ministry home page rebuilt on it went from 8.9 MB to 29 KB, and from 14 seconds to 3 seconds on a phone.

It is not a government project. It is open source, MIT licensed, and built so a country pack is one JSON file that anyone can contribute.

## Quick start

Two link tags. The core, then a country pack.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/afrigov@0.15.0/dist/core.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/afrigov@0.15.0/dist/ng.min.css" />
```

```html
<a class="ag-skip-link" href="#main">Skip to main content</a>

<section class="ag-banner" aria-label="Official website notice">
  <div class="ag-container ag-banner__inner">
    <span class="ag-flag" aria-hidden="true"><span></span><span></span><span></span></span>
    <p class="ag-banner__text">An official website of the Federal Republic of Nigeria</p>
  </div>
</section>

<main class="ag-main ag-container" id="main" tabindex="-1">
  <h1>Renew a passport</h1>
  <a class="ag-button ag-button--start" href="/apply">Start now</a>
</main>
```

Or from npm:

```sh
npm install afrigov
```

```js
import "afrigov/core.css";
import "afrigov/ng.css";
import { init } from "afrigov"; // optional, 3 KB
init();
```

## What is in the box

| Part                  | What it does                                                                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `core.css`            | Reset, element defaults, 46 components, layout utilities. Country-neutral. 9 KB gzipped.                                                                                     |
| `ng.css` and six more | Country packs for Ghana, Kenya, Morocco, Nigeria, Rwanda, Senegal and South Africa. National colours, derived text-safe variants, the flag, banner strings. Under 1 KB each. |
| `afrigov.js`          | Optional. Collapsible navigation on small screens and focus on the error summary. Every component works without it.                                                          |
| `tokens/`             | The source of truth, in the [W3C Design Tokens](https://tr.designtokens.org/format/) format. Published in the package for Figma and other tools.                             |

**Components:** skip link, official website banner, header and navigation, footer, hero, band, flag stripe, feature, breadcrumb, back link, social links, pagination, language switcher, button, text input, textarea, character count, select, radios, checkboxes, input group, phone number, national ID number, region selector, date input, error summary, alert, badge, dated list, download link, empty state, image and figure, statement, accordion, details, currency display, steps, key figures, people, table, confirmation panel, summary list, service card, inset text.

## Around afrigov

- **[Use cases](https://omoyolab.github.io/afrigov-usecases/)**: real government websites rebuilt on afrigov, with the real site's accessibility score beside the rebuild. Nigeria's digital economy ministry, Ghana's National Identification Authority and Ghana's Ministry of Health so far, 103 pages, every one scoring 100.
- **[afrigov-audit](https://github.com/omoyolab/afrigov-audit)**: an accessibility check for any web page from the command line, with a badge of the grade and score, and the page's weight on a phone.
- **[afrigov-images](https://github.com/omoyolab/afrigov-images)**: makes a folder of photos light enough for a government page. Sizes for each screen, WebP, location data removed, afrigov's weight limits, and the HTML to paste.

## How accessibility is enforced

- **Contrast is a build step.** Every foreground and background pair in [`scripts/tokens.mjs`](scripts/tokens.mjs) must meet its ratio, for the core and for every pack. If a pack's official colour is too light for text, the build derives a deeper one and says so in the generated CSS. The flag stripe always keeps the exact official colour.
- **axe-core runs on every pull request.** The docs page renders every component and is tested with each pack against WCAG 2.1 A and AA rules.
- **Touch targets are tested too.** Every link, button, control and summary on the docs page must be at least 48px tall at phone width.
- **A size budget fails the build.** `core.min.css` must gzip to 20 KB or less. It is currently 9 KB.

## Design rules

- **Body text is 16px, line height 1.55**, so diacritics never collide. `data-ag-density="large"` raises it to 18px for public-facing pages; `data-ag-density="compact"` tightens spacing and targets for dashboards.
- **System fonts only.** Zero font requests. Noto Sans is named early in the stack because it covers the Latin Extended ranges that Yoruba, Hausa, Igbo, Wolof and Fula need.
- **Links are always underlined.** Colour alone is not a signal.
- **Focus is a double ring**, yellow inside and ink outside, so it is visible on any background.
- **One column of text, 65 characters wide**, on any screen.
- **No date pickers.** Three plain fields work on every phone and every screen reader.
- **Alerts have titles.** Meaning never depends on colour.

## Country packs

A pack is one JSON file in [`tokens/packs/`](tokens/packs). It declares the official colours, which one is the primary, the flag stripes, and the banner strings.

```json
{
  "$extensions": {
    "afrigov": {
      "code": "ke",
      "country": "Kenya",
      "government": "Republic of Kenya",
      "domain": ".go.ke",
      "flag": ["{official.black}", "{official.red}", "{official.green}"],
      "flagDirection": "column",
      "strings": {
        "en": { "banner": "An official website of the Government of Kenya" },
        "sw": { "banner": "Tovuti rasmi ya Serikali ya Kenya" }
      }
    }
  },
  "official": {
    "$type": "color",
    "black": { "$value": "#000000" },
    "red": { "$value": "#bb0000" },
    "green": { "$value": "#006600" }
  },
  "color": { "$type": "color", "primary": { "$value": "{official.green}" }, "accent": { "$value": "{official.red}" } }
}
```

The build derives `primary-hover`, `on-primary`, `primary-tint`, `link` and `link-hover`, checks every pair, and writes `dist/ke.css`. To add a country, copy a pack, change the values, run `pnpm test`, open a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md#adding-a-country-pack).

Packs and translations wanted are listed as [open issues](https://github.com/omoyolab/afrigov/issues?q=is%3Aissue+is%3Aopen+label%3Acountry-pack%2Ctranslation).

## Theming

Every value is a CSS custom property prefixed `--ag-`. Override after the pack.

```css
:root {
  --ag-size-container: 60rem;
  --ag-font-family-sans: "Public Sans", system-ui, sans-serif;
}
```

Scope a pack to part of a page with `data-ag-pack="ke"` on any element, when one page serves more than one country.

## Browser support

Everything from 2019 onwards: Chrome 88, Edge 88, Firefox 78, Safari 14, Samsung Internet 15 and later. Custom properties and cascade layers are required for styling. Older proxy browsers such as Opera Mini in extreme mode receive readable, unstyled semantic HTML, which is the point of keeping every component meaningful without CSS.

## Development

```sh
pnpm install
pnpm build          # tokens → build/, then dist/, then the docs site in docs/
pnpm dev            # rebuild on change and serve the docs at http://localhost:4321
pnpm test           # unit tests: tokens, contrast, build output
pnpm test:a11y      # Playwright + axe on every docs page with every pack (pnpm exec playwright install chromium once)
pnpm check          # everything CI runs
```

Node 20 or newer and pnpm 10.

## Where it stands

Version 0.9. Everything is on the [docs site](https://omoyolab.github.io/afrigov) and in the [changelog](CHANGELOG.md). Three things stand between here and 1.0: a manual screen-reader pass on every component, the publication of the accessibility scoreboard of public services in the pack countries, and one real service built on afrigov by someone other than us. Class names, tokens and the pack schema are stable from 1.0.

## Acknowledgements

The patterns here stand on the [GOV.UK Design System](https://design-system.service.gov.uk) and the [U.S. Web Design System](https://designsystem.digital.gov), both of which published their research so others could reuse it. afrigov is not affiliated with any government.

## Licence

[MIT](LICENSE) © Abimbola Omoyola and contributors.
