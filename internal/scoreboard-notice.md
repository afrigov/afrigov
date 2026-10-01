# Courtesy notice before the first scoreboard publication

## Publication checklist

1. Send the email below to every site, two weeks ahead. Log it in the contacts table.
2. Re-run any site that replies with fixes: `node scripts/scoreboard.mjs` writes a fresh `scoreboard/results/<date>.json`.
3. On publication day: remove the `scoreboard/results/` line from `.gitignore`, commit the results file, uncomment the `schedule` block in `.github/workflows/scoreboard.yml`, push. The page, its nav entry and the home card appear on that deploy.
4. Post the launch note; see `internal/launch.md` for the channels.

Send to each site's webmaster or ICT contact two weeks before the page goes live. Attach that site's `afrigov-audit --all` output. Keep a list of who was contacted and when in this file.

## Email

Subject: Accessibility check of [site] ahead of publication

Dear [team],

I maintain afrigov, an open-source set of components for accessible government websites in Africa (https://omoyolab.github.io/afrigov). Once a month it runs an automated accessibility check of the main public services in the countries it supports, and publishes the results with the fix for each problem.

[Site] is one of the sites checked. The attached report shows what the check found on [date]. The biggest problem is [top problem], which is fixed by [fix]. The full report lists every problem with the WCAG criterion and a link to the fix.

The page will be published on [date + 14 days]. If you fix anything before then, reply and I will re-run the check so the published result reflects it. If you believe any result is wrong, tell me what the page does and I will correct it or change the check.

The check is automated and finds roughly a third of real accessibility problems, so it is a floor. Anyone can reproduce it with `npx afrigov-audit [url]`. The method and scoring are public at https://github.com/omoyolab/afrigov-audit.

Nothing here is a complaint. Most government sites in every country score poorly on this check, and the aim is to make the fixes easy to find.

Kind regards,
Abimbola Omoyola
https://github.com/omoyolab/afrigov

## Contacts

| Site | Contact found | Sent | Reply |
| ---- | ------------- | ---- | ----- |
|      |               |      |       |
