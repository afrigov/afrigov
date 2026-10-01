# 002: Official colours are decorative; usable colours are derived

**Date:** 2026-09-30. **Status:** accepted.

## Decision

A pack declares the exact official national colours under `official.*`. It names one of them as `color.primary`. The build then:

1. Darkens the primary in 1% lightness steps, preserving hue, until it meets 4.5:1 against both `paper` and `paper-alt`.
2. Derives hover, tint, on-primary and link colours from the result.
3. Writes a comment into the generated CSS saying what it changed and why.

The flag stripe, and anything using `--ag-official-*` directly, keeps the exact value.

## Why

- Nigeria's green `#008751` is 4.58:1 on white, which passes, and 4.13:1 on the light grey panel, which fails. Ghana's gold fails everywhere. Kenya's green passes everywhere. A rule that only works for some flags is not a rule.
- Pack authors should not have to know colour theory. They should paste the constitutional value and get an accessible site.
- Doing this in the build, with a test, means no pack can ever regress contrast, whoever contributes it.

## Consequences

- The primary on a Nigerian site is `#007d4b`, not `#008751`. It is visibly the same green. The docs say so plainly and show both.
- Links inside tinted boxes (alerts) use ink, not primary, because a primary is only guaranteed on paper and paper-alt. This is a contrast pair in the gate.
- `accent` is passed through untouched and is documented as decorative only.
