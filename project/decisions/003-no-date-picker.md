# 003: No date picker, no modal, no toast, no carousel

**Date:** 2026-09-30. **Status:** accepted.

## Decision

These four are cut, not deferred. The registry marks them "cut" with a reason.

## Why

- **Date picker.** Calendar widgets fail on low-end Android browsers, are slow with screen readers, and are useless for dates people already know, like a date of birth. Three fields with `inputmode="numeric"` work everywhere. GOV.UK's research reached the same conclusion.
- **Modal.** Focus trapping is fragile, body-scroll locking breaks on iOS, and a dialog on a 360px screen is just a worse page. If something needs its own context, give it a page. Native `<dialog>` may earn a reconsideration in a later version if a real service needs it.
- **Toast.** Timed messages that disappear violate WCAG 2.2.1 (Timing Adjustable) unless they can be paused, and people on slow devices miss them. Use an alert that stays.
- **Carousel.** Hides content, is rarely operable by keyboard, and government home pages do not need a hero slider. They need the three services people came for.

## Consequences

- Pull requests adding these are closed with a link here. That is fine; it is a design system, and saying no is the job.
- The size budget stays honest because the heaviest, script-dependent components are not in it.
