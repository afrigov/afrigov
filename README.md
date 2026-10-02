<p><img src="site/logo.svg" alt="afrigov" width="200" height="48"></p>

# afrigov

**Open-source components for building accessible African public-service websites.**
One country-neutral core. A token pack per country. Plain CSS, 5 KB gzipped, no build step.

[![npm](https://img.shields.io/npm/v/afrigov?color=1f4e79)](https://www.npmjs.com/package/afrigov)
[![CI](https://github.com/omoyolab/afrigov/actions/workflows/ci.yml/badge.svg)](https://github.com/omoyolab/afrigov/actions/workflows/ci.yml)
[![WCAG 2.1 AA, tested in CI](https://img.shields.io/badge/WCAG%202.1-AA%20tested%20in%20CI-00703c)](test/docs.a11y.js)
[![MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Docs and live components:** https://omoyolab.github.io/afrigov

---

Most government websites in Africa fail basic accessibility checks. Not because the people building them do not care, but because every ministry, agency and contractor starts from zero. afrigov is the starting point they do not have: accessible components, national colours that pass contrast, official-website banners in local languages, and a size budget that respects a 2G connection.

It is not a government project. It is open source, MIT licensed, and built so a country pack is one JSON file that anyone can contribute.

## Quick start

Two link tags. The core, then a country pack.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/afrigov@0.8/dist/core.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/afrigov@0.8/dist/ng.min.css" />
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
import { init } from "afrigov"; // optional, 1.5 KB
init();
```

## What is in the box

| Part               | What it does                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `core.css`         | Reset, element defaults, 15 components, layout utilities. Country-neutral. 5 KB gzipped.                                                         |
| `ng.css`, `ke.css` | Country packs. National colours, derived text-safe variants, flag stripe, banner strings. About 400 bytes each.                                  |
| `afrigov.js`       | Optional. Collapsible navigation on small screens and focus on the error summary. Every component works without it.                              |
| `tokens/`          | The source of truth, in the [W3C Design Tokens](https://tr.designtokens.org/format/) format. Published in the package for Figma and other tools. |

**Components:** official-website banner, header and navigation, footer, skip link, button, breadcrumb, pagination, text input, textarea, select, radio, checkbox, input group, phone number, national ID, region selector, character count, error summary, date input, alert, badge, details, accordion, table, currency display, confirmation panel, summary list, service card, inset text, language switcher.

## Around afrigov

- **[Use cases](https://omoyolab.github.io/afrigov-usecases/)**: real government websites rebuilt on afrigov, with the real site's accessibility score beside the rebuild. The first is Nigeria's digital economy ministry, 29 pages, every one 100, A.
- **[afrigov-audit](https://github.com/omoyolab/afrigov-audit)**: an accessibility check for any web page from the command line, with a badge of the grade and score.

## How accessibility is enforced

- **Contrast is a build step.** Every foreground and background pair in [`scripts/tokens.mjs`](scripts/tokens.mjs) must meet its ratio, for the core and for every pack. If a pack's official colour is too light for text, the build derives a deeper one and says so in the generated CSS. The flag stripe always keeps the exact official colour.
- **axe-core runs on every pull request.** The docs page renders every component and is tested with each pack against WCAG 2.1 A and AA rules.
- **Touch targets are tested too.** Every link, button, control and summary on the docs page must be at least 48px tall at phone width.
- **A size budget fails the build.** `core.min.css` must gzip to 20 KB or less. It is currently 5 KB.

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

Packs wanted: Egypt, Uganda, Tanzania, Ethiopia, Côte d'Ivoire, Egypt, Morocco. Translations wanted for the Nigerian banner in Hausa, Yoruba and Igbo.

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

## Roadmap

- **0.2**: the African patterns: phone number, national ID, region selector, currency display, character count, service card, details and language switcher. Rwanda and South Africa packs, SVG flags, a published pack JSON schema. All shipped.
- **0.3**: [afrigov-audit](https://github.com/omoyolab/afrigov-audit), run axe against any site from the command line, and a monthly scoreboard of public services in the pack countries. Shipped; the scoreboard goes public after each site has been notified.
- **0.4**: Figma library generated from the tokens.
- **0.4**: right-to-left support with a Morocco pack, and six page templates. Shipped.
- **1.0**: stable class names, tokens and pack schema. Requires a manual screen-reader pass on every component, and at least one real service built on it. The full definition is in [`project/roadmap/v1.0.md`](project/roadmap/v1.0.md).

The detailed component plan per version is in [`project/`](project/).

## Acknowledgements

The patterns here stand on the [GOV.UK Design System](https://design-system.service.gov.uk) and the [U.S. Web Design System](https://designsystem.digital.gov), both of which published their research so others could reuse it. afrigov is not affiliated with any government.

## Licence

[MIT](LICENSE) © Abimbola Omoyola and contributors.
