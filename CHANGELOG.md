# Changelog

All notable changes documented per [Keep a Changelog](https://keepachangelog.com/).

## [0.5.0] — 2026-05-13

### Added
- ZK proof interfaces (`lib/zk/`) behind `NEXT_PUBLIC_ENABLE_ZK` feature flag
- On-chain pick commitment scaffolding (Solana memo program, also flagged)
- OG image generator per match

### Changed
- Bracket node probability computation now respects conditional joint distributions

## [0.4.0] — 2026-05-05

### Added
- Brier-score leaderboard
- Group-stage simulator
- Vercel Blob storage for pick CSVs

### Fixed
- Anon ID rotation now clears local pick history (was leaking across resets)

## [0.3.0] — 2026-04-22

### Added
- Knockout bracket rendering with live conditional odds
- Head-to-head probability via Bradley-Terry approximation

## [0.2.0] — 2026-04-10

### Added
- Bayesian odds engine (`lib/odds.ts`) — Beta-Binomial conjugate update
- Match result ingestion API

## [0.1.0] — 2026-04-01

### Added
- Initial release
- Next.js 16 + React 19 + Tailwind 4 scaffold
- Anon ID generation, local-first pick submission
- Pick submission API

<!-- docs(readme): add stack table and deploy section @ 2026-04-29T20:59:58 -->

<!-- docs(readme): roadmap checkboxes for shipped milestones @ 2026-04-23T15:46:03 -->
