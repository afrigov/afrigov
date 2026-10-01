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

| Component               | Class                    | Version | Status  | Notes                                                                |
| ----------------------- | ------------------------ | ------- | ------- | -------------------------------------------------------------------- |
| Skip link               | `.ag-skip-link`          | 0.1     | shipped |                                                                      |
| Official banner         | `.ag-banner`, `.ag-flag` | 0.1     | shipped | Flag stripes and direction from the pack                             |
| Header + nav            | `.ag-header`, `.ag-nav`  | 0.1     | shipped | Collapsible with JS only; always visible without                     |
| Footer                  | `.ag-footer`             | 0.1     | shipped |                                                                      |
| Breadcrumb              | `.ag-breadcrumb`         | 0.1     | shipped |                                                                      |
| Pagination              | `.ag-pagination`         | 0.1     | shipped |                                                                      |
| Language switcher       | `.ag-lang`               | 0.2     | planned | Links with `hreflang`, current language marked                       |
| Cookie / consent banner | `.ag-consent`            | —       | cut     | Government sites should not need tracking cookies. Revisit if asked. |

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
| Phone number            | `.ag-phone`                                | 0.2     | planned | Country code select + national number, `autocomplete="tel"`                  |
| National ID             | `.ag-id-input`                             | 0.2     | planned | Per-pack hint text and width (NIN 11 digits, Kenya ID 8, Ghana card 15)      |
| Region selector         | `.ag-region`                               | 0.2     | planned | State/county/region then LGA/sub-county, data from the pack                  |
| Currency display        | `.ag-money`                                | 0.2     | planned | Tabular figures, symbol from the pack                                        |
| Character count         | `.ag-char-count`                           | 0.2     | planned | Needs JS; no-JS state shows the limit in the hint                            |
| File upload             | `.ag-file`                                 | 0.3     | planned | Native input restyled                                                        |
| Password with show/hide | `.ag-password`                             | 0.3     | planned | Needs JS                                                                     |
| Autocomplete / combobox | —                                          | —       | cut     | Too heavy for the budget and fragile with AT. Recommend native `<datalist>`. |
| Date picker             | —                                          | —       | cut     | Deliberate. See decisions/003-no-date-picker.md                              |

## Feedback and content

| Component          | Class                               | Version | Status  | Notes                                                                                         |
| ------------------ | ----------------------------------- | ------- | ------- | --------------------------------------------------------------------------------------------- |
| Alert              | `.ag-alert` + success/warning/error | 0.1     | shipped | Always has a title                                                                            |
| Badge              | `.ag-badge` + variants              | 0.1     | shipped |                                                                                               |
| Accordion          | `.ag-accordion` on `<details>`      | 0.1     | shipped | No JS                                                                                         |
| Table              | `.ag-table`, `.ag-table-wrap`       | 0.1     | shipped |                                                                                               |
| Confirmation panel | `.ag-panel`                         | 0.1     | shipped |                                                                                               |
| Summary list       | `.ag-summary`                       | 0.1     | shipped | Check-your-answers pages                                                                      |
| Inset text         | `.ag-inset`                         | 0.1     | shipped |                                                                                               |
| Details            | `.ag-details`                       | 0.2     | planned | Single disclosure, same base as accordion                                                     |
| Tabs               | `.ag-tabs`                          | 0.3     | planned | Needs JS; no-JS state is stacked sections                                                     |
| Notification count | `.ag-count`                         | 0.3     | planned |                                                                                               |
| Step indicator     | `.ag-steps`                         | 0.3     | planned | Multi-page forms                                                                              |
| Service card       | `.ag-card`                          | 0.2     | planned | Link card for service listings on home pages                                                  |
| Modal dialog       | —                                   | —       | cut     | Poor on low-end phones and with AT. Use a page. Revisit only with `<dialog>` and a real need. |
| Toast              | —                                   | —       | cut     | Timed messages fail WCAG 2.2.1. Use an alert.                                                 |
| Carousel           | —                                   | —       | cut     | Never.                                                                                        |

## Tooling and packs

| Item                  | Version | Status  | Notes                                                               |
| --------------------- | ------- | ------- | ------------------------------------------------------------------- |
| Nigeria pack (ng)     | 0.1     | shipped | Hausa, Yoruba, Igbo strings wanted                                  |
| Kenya pack (ke)       | 0.1     | shipped | Swahili draft, native review wanted                                 |
| Ghana pack (gh)       | 0.2     | shipped | Green primary, gold accent; derivation path is unit-tested          |
| Rwanda pack (rw)      | 0.2     | planned | Kinyarwanda, French, English                                        |
| South Africa (za)     | 0.3     | planned | Six flag colours, eleven official languages                         |
| `afrigov audit <url>` | 0.3     | planned | axe against any URL from the CLI. See roadmap/v0.3.md               |
| Figma tokens export   | 0.4     | planned | From `tokens/*.json`                                                |
| React wrappers        | —       | cut     | Plain HTML classes work in every framework. Revisit only on demand. |
