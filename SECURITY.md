# Security Policy

## Reporting a vulnerability

If you find a security issue in this project, please **do not open a public issue.** Instead, email the maintainer directly. We will acknowledge within 48 hours and aim to resolve critical issues within 7 days.

## Scope

- The assessment tool at humanaios-ui.github.io/lasting-light-ai
- The scoring, data collection, and display mechanisms
- The GitHub Pages deployment and repository

## Known limitations (by design)

- Assessment scores are self-reported via URL parameters and are not validated server-side. This is by design for the current phase and is documented in [METHODS.md](METHODS.md), not treated as a security vulnerability.
- The tool runs entirely client-side with no authentication. There is no user account system to compromise.

## Supported versions

| Version | Supported |
|---------|-----------|
| Current (main branch) | Yes |
| Older commits | No |
