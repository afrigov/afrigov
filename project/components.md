# Component registry

Status: **shipped** (on docs page, axe-tested), **building**, **planned**, **cut** (with reason).

## Core layout and text

| Component              | Class                                  | Version | Status  | Notes                                        |
| ---------------------- | -------------------------------------- | ------- | ------- | -------------------------------------------- |
| Container              | `.ag-container`                        | 0.1     | shipped |                                              |
| Main                   | `.ag-main`                             | 0.1     | shipped | Skip-link target, `tabindex="-1"`            |
| Prose measure          | `.ag-prose`, `.ag-lead`, `.ag-caption` | 0.1     | shipped | 65ch max line length                         |
| Stack / cluster / grid | `.ag-stack`, `.ag-cluster`, `.ag-grid` | 0.1     | shipped | The only layout utilities. Keep it that way. |
| Visually hidden        | `.ag-visually-hidden`                  | 0.1     | shipped |                                              |

## Page furniture

| Component               | Class                            | Version | Status  | Notes                                                                                  |
| ----------------------- | -------------------------------- | ------- | ------- | -------------------------------------------------------------------------------------- |
| Skip link               | `.ag-skip-link`                  | 0.1     | shipped |                                                                                        |
| Official banner         | `.ag-banner`, `.ag-flag`         | 0.1     | shipped | Flag stripes and direction from the pack                                               |
| Header + nav            | `.ag-header`, `.ag-nav`          | 0.1     | shipped | Collapsible with JS only; always visible without                                       |
| Footer                  | `.ag-footer`                     | 0.1     | shipped | ; 0.8 variants: light                                                                  |
| Breadcrumb              | `.ag-breadcrumb`                 | 0.1     | shipped |                                                                                        |
| Pagination              | `.ag-pagination`                 | 0.1     | shipped | ; 0.8 variants: simple                                                                 |
| Language switcher       | `.ag-lang`                       | 0.2     | shipped | Links with hreflang and lang, current marked, endonyms                                 |
| Back link               | `.ag-back-link`                  | 0.5     | shipped | Real link to the previous step; chevron mirrors in RTL                                 |
| Social links            | `.ag-social`                     | 0.6     | shipped | Network name is the text, icon decorative; footer only                                 |
| Footer address          | `.ag-footer__address`            | 0.6     | shipped | `address` element, italic reset in core                                                |
| Hero                    | `.ag-hero` + image, primary      | 0.5     | shipped | Image beside the text, never behind it; one action; 0.8 variants: centred, image-first |
| Band                    | `.ag-band` + tint, primary, dark | 0.8     | shipped | Full-width section background; hero inside takes its colour                            |
| Cookie / consent banner | `.ag-consent`                    | none    | cut     | Government sites should not need tracking cookies. Revisit if asked.                   |

## Actions

| Component    | Class                                           | Version | Status  | Notes             |
| ------------ | ----------------------------------------------- | ------- | ------- | ----------------- |
| Button       | `.ag-button` + secondary, warning, start, block | 0.1     | shipped |                   |
| Button group | `.ag-button-group`                              | 0.1     | shipped |                   |
| Link styles  | element defaults                                | 0.1     | shipped | Always underlined |

## Forms

| Component               | Class                                      | Version | Status  | Notes                                                                        |
| ----------------------- | ------------------------------------------ | ------- | ------- | ---------------------------------------------------------------------------- |
| Field wrapper           | `.ag-field`, `.ag-field--error`            | 0.1     | shipped |                                                                              |
| Label / legend          | `.ag-label`, `.ag-legend` + lg, xl         | 0.1     | shipped |                                                                              |
| Hint / error            | `.ag-hint`, `.ag-error-message`            | 0.1     | shipped |                                                                              |
| Text input              | `.ag-input` + width-4/10/20/30             | 0.1     | shipped |                                                                              |
| Textarea                | `.ag-textarea`                             | 0.1     | shipped |                                                                              |
| Select                  | `.ag-select`                               | 0.1     | shipped |                                                                              |
| Radio / checkbox        | `.ag-radio`, `.ag-checkbox`, `.ag-choices` | 0.1     | shipped | Native input restyled, never hidden                                          |
| Input group             | `.ag-input-group` (prefix/suffix)          | 0.1     | shipped | Currency and units                                                           |
| Error summary           | `.ag-error-summary`                        | 0.1     | shipped | JS focuses it on load                                                        |
| Date input              | `.ag-date-input`                           | 0.1     | shipped | Three fields, no picker                                                      |
| Phone number            | `.ag-phone`                                | 0.2     | shipped | Dialling code from the pack, national number, `autocomplete="tel-national"`  |
| National ID             | `.ag-id-input`                             | 0.2     | shipped | Label, hint, maxlength, pattern and inputmode from the pack                  |
| Region selector         | `[data-ag-region-for]` + optgroups         | 0.2     | shipped | No-script state is grouped options; script narrows the second select         |
| Currency display        | `.ag-money`                                | 0.2     | shipped | Tabular figures, no break between symbol and number                          |
| Character count         | `.ag-char-count`                           | 0.2     | shipped | Script updates the message; live region after a pause                        |
| File upload             | `.ag-file`                                 | 0.3     | planned | Native input restyled                                                        |
| Password with show/hide | `.ag-password`                             | 0.3     | planned | Needs JS                                                                     |
| Autocomplete / combobox | none                                       | none    | cut     | Too heavy for the budget and fragile with AT. Recommend native `<datalist>`. |
| Date picker             | none                                       | none    | cut     | Deliberate. See decisions/003-no-date-picker.md                              |

## Feedback and content

| Component          | Class                                    | Version | Status  | Notes                                                                                                         |
| ------------------ | ---------------------------------------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------- |
| Alert              | `.ag-alert` + success/warning/error      | 0.1     | shipped | Always has a title                                                                                            |
| Badge              | `.ag-badge` + variants                   | 0.1     | shipped |                                                                                                               |
| Accordion          | `.ag-accordion` on `<details>`           | 0.1     | shipped | No JS                                                                                                         |
| Table              | `.ag-table`, `.ag-table-wrap`            | 0.1     | shipped |                                                                                                               |
| Confirmation panel | `.ag-panel`                              | 0.1     | shipped | ; 0.8 variants: neutral                                                                                       |
| Summary list       | `.ag-summary`                            | 0.1     | shipped | Check-your-answers pages                                                                                      |
| Inset text         | `.ag-inset`                              | 0.1     | shipped |                                                                                                               |
| Details            | `.ag-details`                            | 0.2     | shipped | Single disclosure on native details                                                                           |
| Tabs               | `.ag-tabs`                               | 0.3     | planned | Needs JS; no-JS state is stacked sections                                                                     |
| Notification count | `.ag-count`                              | 0.3     | planned |                                                                                                               |
| Step indicator     | `.ag-steps`                              | 0.3     | planned | Multi-page forms                                                                                              |
| Service card       | `.ag-card`                               | 0.2     | shipped | Stretched link, focus ring on the card; logo slot since 0.6.1; 0.8 variants: tinted, plain, image, horizontal |
| Dated list         | `.ag-list` + media                       | 0.5     | shipped | Link, meta line with `<time>`, optional summary                                                               |
| Download link      | `.ag-download`                           | 0.5     | shipped | Format and size inside the link text                                                                          |
| Empty state        | `.ag-empty`                              | 0.5     | shipped | Heading plus what to do; not an alert                                                                         |
| Image and figure   | `.ag-figure`, `.ag-image`, `.ag-gallery` | 0.5     | shipped | Caption or alt, never both; 150 KB budget; no text over photos                                                |
| Statement          | `.ag-statement` + full                   | 0.6     | shipped | Head of organisation's message with portrait; name and role after the text; 0.8 variants: primary             |
| Modal dialog       | none                                     | none    | cut     | Poor on low-end phones and with AT. Use a page. Revisit only with `<dialog>` and a real need.                 |
| Toast              | none                                     | none    | cut     | Timed messages fail WCAG 2.2.1. Use an alert.                                                                 |
| Carousel           | none                                     | none    | cut     | Never.                                                                                                        |

## Tooling and packs

| Item                  | Version | Status  | Notes                                                                           |
| --------------------- | ------- | ------- | ------------------------------------------------------------------------------- |
| Nigeria pack (ng)     | 0.1     | shipped | Hausa, Yoruba, Igbo strings wanted                                              |
| Kenya pack (ke)       | 0.1     | shipped | Swahili draft, native review wanted                                             |
| Ghana pack (gh)       | 0.2     | shipped | Green primary, gold accent; derivation path is unit-tested                      |
| Senegal pack (sn)     | 0.2     | shipped | First francophone pack: French default language, suffix currency, derived green |
| Rwanda pack (rw)      | 0.2     | shipped | Blue derived for AA; Kinyarwanda and Swahili strings wanted                     |
| South Africa (za)     | 0.2     | shipped | SVG Y flag, eleven languages listed, nine wanted                                |
| `afrigov audit <url>` | 0.3     | planned | axe against any URL from the CLI. See roadmap/v0.3.md                           |
| Figma tokens export   | 0.4     | planned | From `tokens/*.json`                                                            |
| React wrappers        | none    | cut     | Plain HTML classes work in every framework. Revisit only on demand.             |
