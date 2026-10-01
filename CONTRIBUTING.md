# Contributing to afrigov

Thanks for helping. This file covers setup, the kinds of changes we are looking for, and what a pull request needs to be merged.

## Setup

```sh
git clone https://github.com/omoyolab/afrigov
cd afrigov
pnpm install
pnpm exec playwright install chromium   # once, for the accessibility tests
pnpm check                              # lint, format, build, unit tests
pnpm test:a11y                          # axe and touch-target tests on the docs page
```

Node 20 or newer and pnpm 10.

| Script           | What it does                                                    |
| ---------------- | --------------------------------------------------------------- |
| `pnpm dev`       | Rebuild on change and serve the docs at http://localhost:4321   |
| `pnpm build`     | tokens → `build/`, then `dist/`, then the docs site in `docs/`  |
| `pnpm test`      | Unit tests for tokens, contrast maths and build output          |
| `pnpm test:a11y` | Playwright + axe-core against every docs page with every pack   |
| `pnpm check`     | Everything CI runs, except `test:a11y` which CI runs separately |

## What we are looking for

### Adding a country pack

The most useful contribution, and it needs no CSS.

1. Copy `tokens/packs/ke.tokens.json` to `tokens/packs/<code>.tokens.json`, using the two-letter [ISO 3166-1 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) in lower case.
2. Fill in `$extensions.afrigov`: `code`, `country`, `government` (the formal name used on official sites), `domain` (the official second-level domain, like `.gov.ng` or `.go.ke`), `flag` (stripe colours in order), `flagDirection` (`row` for vertical stripes, `column` for horizontal), and `strings` for each official language.
3. Fill in `currency` (code, symbol, name, hint), `id` (what the national ID is called, its document, a hint, its length, the issuing authority), `regions` (what the first-level division is called and a handful of examples), `phone` (dialling code, an example number as people write it, a hint, digit count) and `examples` (timezone name, reference prefix). If the default language is written right to left, set `direction` to `rtl`. The file starts with `"$schema": "./pack.schema.json"`, so your editor validates it as you type, and `pnpm test` validates it again. The docs examples read these, and the 0.2 phone, ID and region inputs will too.
4. If the flag is not plain bands (a star, a shield, a diagonal), add an accurate 3:2 SVG at `tokens/packs/flags/<code>.svg` with `aria-label="Flag of …"`, and set `flagSvg`. Keep `flag` as the stripe fallback.
5. Put the exact national colours under `official`. Use the values from the constitution, the national standards body, or the government's own brand guidelines, and cite the source in `$description`.
6. Set `color.primary` to the official colour that should carry buttons and links. If it is too light for text, the build derives a deeper one automatically and records that in the generated CSS. You do not need to pick a "web safe" version yourself.
7. Run `pnpm test`. The contrast tests run for your pack. Then `pnpm build` and open `docs/index.html?pack=<code>` to see it.
8. Add a row to the packs table in `docs/index.html` and the switcher in the hero, and a line in `CHANGELOG.md`.

For banner strings, only add a translation you can vouch for or that a native speaker has reviewed. A missing language is better than a wrong one. Mark machine-assisted drafts with `"$note": "Machine-assisted draft. Native review wanted."` as the Swahili strings do.

### Translations

Packs with `"$todo"` entries in their `strings` need translations. Replace the `null` with the translation, remove the `$todo`, and say in the pull request whether you are a native speaker.

### Accessibility bugs

Treated as the highest priority. Open a bug report with the component, the assistive technology and browser, and what happened. A pull request with a failing test in `test/docs.a11y.js` is the fastest route to a fix.

### Components

Open an issue first for anything not on the roadmap in `internal/roadmap/`, so we can agree on the shape before you spend a weekend on it. A component needs:

- One CSS file in `src/css/components/`, added to the list in `scripts/build-css.mjs`.
- Single-class selectors only, `ag-block__element--modifier`. No nesting, no IDs, no element selectors except inside a component class.
- Every colour from a `--ag-` token. The build test rejects literal hex values outside the tokens layer.
- A 48px minimum touch target on anything interactive.
- Working with JavaScript disabled. If it needs a script, the no-script state must still be usable.
- A page in `site/pages/components/` (copy an existing one) with a `<docs-example>` block, so the axe tests cover it. `docs/` is generated; never edit it.
- A line in `internal/components.md` and `CHANGELOG.md`.

### Bugs and docs

Always welcome. Small PRs merge fastest.

## Pull request checklist

- `pnpm check` and `pnpm test:a11y` pass.
- New behaviour has a test. Bug fixes have a test that fails without the fix.
- `CHANGELOG.md` has a line under **Unreleased**.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org): `feat:`, `fix:`, `docs:`, `test:`, `chore:`. Scope is optional, e.g. `feat(pack): add Ghana`.

## Code style

Prettier, ESLint and stylelint are configured, so formatting is not a review topic. Beyond that:

- No runtime dependencies. The published package is CSS, one small script, and JSON.
- Keep `core.min.css` under the 20 KB gzip budget. The build fails if it grows past it.
- Comments explain why, not what.

## Releasing (maintainers)

1. Update `CHANGELOG.md`: move **Unreleased** into a new version heading with today's date.
2. `pnpm version <patch|minor|major>` to bump `package.json` and create the tag.
3. `git push --follow-tags`.
4. The release workflow runs the checks, publishes to npm with provenance, and creates the GitHub release from the tag. The docs workflow deploys `docs/` to GitHub Pages on every push to `main`.

Publishing uses npm Trusted Publishing, so there is no token to rotate. If it ever needs re-linking: package Settings → Trusted publisher → GitHub Actions, organisation `omoyolab`, repository `afrigov`, workflow `release.yml`.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be kind.
