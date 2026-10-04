# 004: No autoplaying video, and video only loads when someone presses play

**Date:** 2026-10-03. **Status:** accepted.

## Decision

- afrigov has no background video and no autoplaying video, in a hero or anywhere else.
- Video is shown as a still image with a play button. The video player loads only when someone presses it.
- Every video has captions and a written transcript on the page.

## Why

- **Data.** A background video costs 3 to 10 MB on every visit, before anyone chooses to watch. An embedded YouTube player downloads close to 1 MB of its own code just to appear. In the countries afrigov serves, many visitors pay for every megabyte on a phone. A government page should not spend their data on decoration.
- **Speed.** A video in the first screen delays the moment the page can be read and used. That is the measure search engines and people both judge a page by.
- **Motion.** Moving content that plays for more than five seconds must have a pause control (WCAG 2.2.2, Pause, Stop, Hide). Motion also makes some people dizzy or ill. A still image needs neither.
- **Contrast.** Text over moving video changes contrast with every frame. There is no colour that is guaranteed to be readable on it.
- **Meaning.** A background video says nothing to a screen reader or a search engine. If it carries a message, the message belongs in text.

## What to use instead

- The image hero, or the cover hero, with a still photograph.
- A hero with a click-to-play video beside the text, the same layout as the image hero.
- A "Watch the video, 2 minutes" button that goes to the video's own page.

## Consequences

- Pull requests that add autoplaying or background video are closed with a link here.
- The video component is a link to the video when the script is missing, so a page never shows an empty box.
- Embeds use the privacy-enhanced YouTube domain, `youtube-nocookie.com`, so no tracking cookie is set until someone presses play.
