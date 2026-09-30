# 001 — Plain CSS with custom properties, no Sass, no framework

**Date:** 2026-09-30. **Status:** accepted.

## Decision

The published artefact is plain CSS. Tokens are CSS custom properties generated from JSON. No Sass, no PostCSS plugins at runtime, no React or Vue wrappers in the core.

## Why

- The people building African government sites are often small contractors and in-house teams using WordPress, Joomla, Django templates or static HTML. A link tag works for all of them. A Sass pipeline does not.
- A pack is a runtime override of custom properties, so one page can serve two countries and a pack can be swapped without a rebuild. Sass variables compile away and cannot do that.
- No build step means the CDN path is the primary path, not an afterthought.
- Cascade layers give predictable overrides without specificity games, and every browser we support has them.

## Consequences

- No mixins or functions in the source. Repetition is accepted; the size budget catches abuse.
- No CSS nesting in the source either, to keep 2019-era browsers. The build test checks for it.
- Framework wrappers, if ever wanted, are separate packages built by people who want them.
