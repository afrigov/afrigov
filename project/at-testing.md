# Manual assistive technology testing

Automated checks find about a third of real accessibility problems. This log is the other two thirds. Every component is tested by a person with a screen reader before 1.0, and again whenever its markup changes.

## Who should do this

Someone who uses the screen reader every day, ideally. A sighted tester who has learned the basics will catch structure problems but miss how it feels. If you can recruit a daily user, their hour is worth ten of anyone else's. Pay them.

## Setup

| Combination        | Where   | Notes                                                                                      |
| ------------------ | ------- | ------------------------------------------------------------------------------------------ |
| NVDA + Firefox     | Windows | Free. The most common desktop combination outside Apple.                                   |
| VoiceOver + Safari | iPhone  | On by default in Settings, Accessibility. The most common phone screen reader on iOS.      |
| TalkBack + Chrome  | Android | Free, on most Android phones. The combination most people in the pack countries will have. |

Test on the documentation site with a country pack previewed, so examples carry real strings, and on the six page templates as whole pages. Test at phone width on phones, obviously, and with the browser zoomed to 200% on desktop at least once.

## What to check for each component

1. **Announcement.** Is the role, name and state read out? A button says "button"; a checked box says "checked"; an expanded accordion says "expanded".
2. **Order.** Does Tab or swipe move through it in the order a sighted person reads it?
3. **Instructions.** Are hints and errors read when the control gets focus, not only when found by exploring?
4. **Change.** When something changes (a region narrows, a count updates, an error appears), is it announced, and only once?
5. **Escape.** Can you get out of it and back to the page without a mouse?
6. **Language.** Under a French or Arabic pack, does the voice switch for the translated strings?

## Log

Status: **pass**, **issue** (link the GitHub issue), **blocked** (say why), blank (not yet tested).

| Component             | NVDA + Firefox | VoiceOver + Safari | TalkBack + Chrome | Notes                                                   |
| --------------------- | -------------- | ------------------ | ----------------- | ------------------------------------------------------- |
| Skip link             |                |                    |                   |                                                         |
| Official banner       |                |                    |                   |                                                         |
| Header and navigation |                |                    |                   | Menu button at phone width, Escape to close             |
| Footer                |                |                    |                   |                                                         |
| Breadcrumb            |                |                    |                   |                                                         |
| Pagination            |                |                    |                   |                                                         |
| Language switcher     |                |                    |                   | Names should be read in their own language              |
| Button                |                |                    |                   | Start button is a link; is that clear?                  |
| Text input            |                |                    |                   | Hint then error read on focus?                          |
| Textarea              |                |                    |                   |                                                         |
| Character count       |                |                    |                   | Announced after a pause, not every keystroke            |
| Select                |                |                    |                   |                                                         |
| Radios                |                |                    |                   | Legend read with the first option                       |
| Checkboxes            |                |                    |                   |                                                         |
| Input group           |                |                    |                   | Is the currency symbol read? It should not be           |
| Phone number          |                |                    |                   | Two fields, both labelled                               |
| National ID number    |                |                    |                   |                                                         |
| Region selector       |                |                    |                   | Second list narrows after the first changes             |
| Date input            |                |                    |                   | Three fields, legend once                               |
| Error summary         |                |                    |                   | Focus lands on it on load; links go to the fields       |
| Alert                 |                |                    |                   | role=alert interrupts; role=status waits                |
| Badge                 |                |                    |                   |                                                         |
| Details               |                |                    |                   |                                                         |
| Accordion             |                |                    |                   |                                                         |
| Table                 |                |                    |                   | Headers read with cells; wrapper scrollable by keyboard |
| Currency display      |                |                    |                   |                                                         |
| Confirmation panel    |                |                    |                   | Reference number read digit by digit?                   |
| Summary list          |                |                    |                   | Change links say what they change                       |
| Service card          |                |                    |                   | One stop per card                                       |
| Inset text            |                |                    |                   |                                                         |

### Page templates

| Template           | NVDA + Firefox | VoiceOver + Safari | TalkBack + Chrome | Notes                                           |
| ------------------ | -------------- | ------------------ | ----------------- | ----------------------------------------------- |
| Service home       |                |                    |                   |                                                 |
| Start page         |                |                    |                   |                                                 |
| Question page      |                |                    |                   | Legend as the heading: read once, as a heading? |
| Check your answers |                |                    |                   |                                                 |
| Confirmation       |                |                    |                   |                                                 |
| Service problem    |                |                    |                   |                                                 |

## Reporting

An issue per problem, with the accessibility template, naming the combination and the component. Quote what was announced. Fixes land with a note here and in the changelog.
