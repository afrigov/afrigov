# project/

Planning and decisions, in the open. Committed so contributors can see where the project is going and why. Not published to npm (see `files` in `package.json`). Nothing private belongs here: outreach drafts, contact logs and checklists stay out of the repository.

| File                             | What it holds                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------- |
| [`components.md`](components.md) | The component registry: every component, which version it ships in, its status. |
| [`roadmap/`](roadmap)            | One file per version. Scope, exit criteria, and what was cut.                   |
| [`decisions/`](decisions)        | Short records of the choices that are expensive to reverse, and why.            |
| [`at-testing.md`](at-testing.md) | The manual screen-reader test log, per component and template.                  |

Rules:

- A component is not "shipped" until it is on the docs page and covered by the axe run.
- Anything that grows `core.min.css` past 20 KB gzipped needs a decision record first.
- Versions are scoped small. If a version drifts past six weeks, cut scope, do not extend.
