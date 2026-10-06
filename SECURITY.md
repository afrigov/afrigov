# Security Policy

## Reporting a vulnerability

If you find a security issue in afrigov, please do not open a public issue.

Use GitHub's private reporting form:
https://github.com/afrigov/afrigov/security/advisories/new

Or email **xanderabim@gmail.com** with "afrigov security" in the subject.

You will get an acknowledgement within 72 hours and a fix or a plan within 14 days for
confirmed issues. Credit is given in the release notes unless you prefer otherwise.

## Scope

afrigov is CSS, a small script, and JSON. It makes no network requests and stores nothing.
Things that count as vulnerabilities:

- Anything in `afrigov.js` that could execute content from the page or the URL.
- A CSS or token value that could be used for content injection when a pack is rendered.
- A build script that could execute code from a pack file.

Out of scope: the security of the site you build with afrigov, and third-party CDNs.

## Supported versions

Only the latest minor release receives security fixes.
