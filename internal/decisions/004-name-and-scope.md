# 004: Named afrigov, published unscoped, not a Nigerian project

**Date:** 2026-09-30. **Status:** accepted.

## Decision

- Package name `afrigov` on npm, unscoped. Repository `omoyolab/afrigov`.
- The core is country-neutral. Countries live only in packs.
- The project is explicitly not affiliated with any government and says so in the footer and README.

## Why

- The original prototype was the "Nigeria Web Design System (NWDS)". That acronym belongs to the Nigerian federal government's own Nigeria Web Design Standards project, announced with the Aig-Imoukhuede Foundation in July 2025. Shipping under it would read as impersonation or as riding their announcement. As of August 2026 that project has published nothing, which is the gap this fills, but the name is theirs.
- Unscoped, because a personal scope reads as one person's side project, and the pack model only works if people in other countries feel they can own their pack.
- Country-neutral core, because the second pack (Kenya) took an hour once the core did not care about Nigeria. That is the whole proposition.

## Consequences

- No Nigerian defaults anywhere in `core.css`. The neutral primary is a government blue that no pack uses.
- Banner strings are data in the pack, never hard-coded in a component.
- If a government ever wants to adopt and rename it, MIT lets them, and the pack model means they can do it without forking the core.
