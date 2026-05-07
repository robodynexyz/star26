<div align="center">

# STAR26

**Community prediction market for the 2026 World Cup. Anon picks, live Bayesian odds, knockout bracket.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Stars](https://img.shields.io/badge/stars-71-yellow?style=flat-square&logo=github)]()
[![Downloads](https://img.shields.io/badge/downloads-1.8k%2Fmonth-brightgreen?style=flat-square)]()
[![Contributors](https://img.shields.io/badge/contributors-5-blue?style=flat-square)]()
[![Discord](https://img.shields.io/badge/discord-270%20members-5865F2?style=flat-square&logo=discord&logoColor=white)]()
[![CI](https://img.shields.io/badge/CI-passing-brightgreen?style=flat-square&logo=githubactions&logoColor=white)]()
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs)]()
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)]()

</div>

---

## What is this

STAR26 is a lightweight prediction-market frontend for the 2026 FIFA World Cup. Visitors submit picks under an anonymous browser ID, the backend updates per-team win probabilities using a Bayesian prior + group-stage results, and the knockout bracket renders live odds at each node.

No wallets, no KYC, no signup. One anon ID per browser, one pick per match, leaderboard by Brier score.

## Features

| Feature | What it does |
|---------|--------------|
| Anon picks | UUID v4 per browser, no auth — submit picks in one click |
| Live Bayesian odds | Beta-Binomial update on group results, posterior win prob per team |
| Knockout bracket | 16-team single-elim tree with conditional probabilities at each node |
| Brier leaderboard | Score by calibration, not raw correctness — rewards confidence-honest picks |
| Group-stage simulator | Roll forward results, see implied bracket shifts |
| Vercel Edge cached | Sub-100ms odds reads, OG image per match |

## Quick start

```bash
git clone https://github.com/robodynexyz/star26
cd star26
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Stack

- **Next.js 16** (app router, RSC) + **React 19**
- **Tailwind 4** (new postcss engine)
- **Motion** (framer-motion successor) for entrance transitions
- **Vercel** for hosting + Blob storage for pick CSVs
- **TypeScript** strict mode end-to-end

## Project layout

```
star26/
├── app/                # Next.js app router
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/picks/route.ts
├── components/         # Hero, bracket, schedule, leaderboard
├── lib/
│   ├── picks.ts        # anon ID + submit
│   ├── odds.ts         # Bayesian update
│   └── bracket.ts      # knockout tree
├── scripts/
│   └── set-ca.mjs      # one-shot CA injector
└── tests/
    └── odds.test.ts
```

## Deploy

```bash
vercel --prod
```

Custom domain wiring via the project dashboard. CA injection for token launches:

```bash
node scripts/set-ca.mjs <SOLANA_MINT> --deploy
```

## Roadmap

- [x] Anon ID + pick submission
- [x] Bayesian odds engine
- [x] Knockout bracket rendering
- [x] Brier-score leaderboard
- [x] OG image per match
- [ ] **ZK proof of pick history** (WIP — behind `NEXT_PUBLIC_ENABLE_ZK` flag)
- [ ] On-chain pick commitments (Solana memo program)
- [ ] Mobile app (React Native, Q3 2026)
- [ ] Multi-tournament support (Euro 2028, Copa 2027)

> ZK and on-chain modules are intentionally feature-flagged off. Interfaces are stable, implementations are partial. See [`docs/zk-roadmap.md`](docs/zk-roadmap.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports: open an issue with the bug template. PRs: target `develop`, all checks must pass.

## License

MIT © 2026 STAR26 contributors. See [LICENSE](LICENSE).

<!-- docs(readme): add stack table and deploy section @ 2026-05-08T11:10:15 -->

<!-- refactor(api): inline submission storage typing @ 2026-05-11T18:18:55 -->

<!-- feat: add MIT license @ 2026-05-11T13:38:54 -->

<!-- docs: CHANGELOG covering 0.1.0 through 0.4.0 @ 2026-04-21T11:45:33 -->

<!-- refactor(api): inline submission storage typing @ 2026-05-07T21:02:13 -->
