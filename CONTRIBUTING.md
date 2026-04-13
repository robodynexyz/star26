# Contributing to STAR26

Thanks for considering a contribution. STAR26 is a small project — we keep the bar reasonable but the loop tight.

## Quick start

1. Fork
2. Branch from `develop`: `git checkout -b feat/your-feature`
3. Code + tests
4. `npm run typecheck && npm test`
5. Open PR against `develop`

## Code style

- TypeScript strict mode, no `any` without comment justifying it
- Conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`
- Format with Prettier defaults (no config file — defaults are fine)

## Branch strategy

- `main` — release-tagged commits only
- `develop` — integration branch, CI must be green
- `feat/*`, `fix/*` — short-lived feature branches

## PR requirements

- CI checks must pass (typecheck + test)
- At least 1 review from a CODEOWNER
- No direct pushes to `main`

## Roadmap items

ZK proofs and on-chain commitments are behind feature flags. They're WIP — interfaces stable, implementations partial. If you want to pick up one of these, open a discussion issue first so we can align on approach.

## Dependabot

Dependabot is configured but PRs are suppressed (`open-pull-requests-limit: 0`). The maintainers periodically run `npm audit` and bump deps manually in batches.

<!-- docs: SECURITY policy and disclosure email @ 2026-04-07T12:09:32 -->

<!-- docs(readme): add stack table and deploy section @ 2026-04-13T22:59:23 -->
