# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 0.5.x   | :white_check_mark: |
| 0.4.x   | :white_check_mark: |
| < 0.4   | :x:                |

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

Email: security@star2026.xyz

We will acknowledge within 48 hours and provide a fix timeline within 5 business days.

## Scope

- Pick submission API (rate limiting, anti-spam)
- Anon ID generation (entropy, collision resistance)
- Odds engine integrity (no client-side override of posteriors)
- Storage layer (no PII leakage)

## Out of Scope

- Denial of service (unless amplified)
- Vulnerabilities in dependencies (please report upstream first)
- Social engineering
