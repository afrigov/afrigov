# Launch checklist for 0.1

## Before the first push

- [x] `pnpm check` and `pnpm test:a11y` green locally.
- [x] README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG, LICENSE.
- [x] CI, release, docs workflows. Dependabot.
- [x] Issue templates: bug, accessibility, country pack. PR template with a11y checklist.
- [ ] Review the docs page in a browser at 375px and 1280px. Fix anything that looks off.
- [ ] Review the generated `dist/ng.css` comment wording. It will be quoted.

## GitHub (owner)

- [ ] Push `main`.
- [ ] Settings → Pages → Source: GitHub Actions. Wait for the Docs workflow. Check https://omoyolab.github.io/afrigov.
- [ ] Settings → General → Features: enable Discussions.
- [ ] Add topics: `design-system`, `accessibility`, `wcag`, `government`, `govtech`, `africa`, `nigeria`, `kenya`, `css`, `design-tokens`.
- [ ] Description: "Open-source components for building accessible African public-service websites. Country-neutral core, per-country packs, plain CSS, 5 KB."
- [ ] Three `good first issue` tickets: Ghana pack, Hausa banner translation, Yoruba banner translation.

## npm (owner)

- [ ] Claim the `afrigov` username or org on npmjs.com so nobody squats the scope.
- [ ] First publish is manual: `pnpm check && npm publish --access public` (2FA prompt).
- [ ] Package Settings → Trusted publisher → GitHub Actions: `omoyolab` / `afrigov` / `release.yml`.
- [ ] Tag `v0.1.0` and push. Confirm the release workflow skips the already-published version and creates the GitHub release.
- [ ] Check https://cdn.jsdelivr.net/npm/afrigov@0.1/dist/core.min.css resolves.

## Announce

- [ ] Show HN: "afrigov – accessibility-first design system for African government sites (5 KB CSS)". Lead with the derived-colour rule and the audit finding that no Nigerian government site passes.
- [ ] Dev.to / Hashnode post: "Why Nigeria's flag green fails WCAG on grey, and what a build step can do about it."
- [ ] X thread with the pack JSON screenshot and the before/after of a real gov form.
- [ ] Post in: r/webdev, r/accessibility, r/Nigeria (tech-friendly), Kenyan and Ghanaian dev communities, the a11y Slack, GovStack community.
- [ ] Email the TechCabal and Techpoint reporters who covered government site accessibility in 2026 with a link and an offer to run the audit for them when 0.3 lands.
- [ ] Add to: awesome-design-systems, awesome-a11y, the Government Design Systems list on GitHub.

## First week

- [ ] Answer every issue within 24 hours.
- [ ] Merge the first outside pack, whatever it is, quickly and with thanks.
- [ ] Record what people asked for. That is the 0.2 scope, not the roadmap file.
