# ZK Roadmap

> **Status: experimental.** Opt in via `NEXT_PUBLIC_ENABLE_ZK=true`. Interfaces are stable, implementations are partial.

## Why ZK at all

Long-term goal: prove "this anon ID had pick X for match Y at timestamp T" without revealing the full pick history. Useful for:

- Leaderboard integrity — prove the Brier score without revealing which matches contributed
- Selective disclosure — share calibration on group stage without leaking knockout picks
- Tournament archival — prove participation without dumping per-user CSVs

## Phases

| Phase | What | Status | ETA |
|-------|------|--------|-----|
| 1 | Interface design (Proof, VerificationKey, ProverBackend) | done | shipped 0.5.0 |
| 2 | Groth16 prover stub via snarkjs | partial | — |
| 3 | Real circuits for pick-membership proofs | not started | Q3 2026 |
| 4 | PLONK backend (faster proving) | not started | Q4 2026 |
| 5 | On-chain verification (Solana program) | not started | 2027 |

## Non-goals

- Replacing the leaderboard with ZK-only state (overkill for a prediction game)
- Anonymity from the host (we still see incoming connections; this is about *post-tournament* selective disclosure)

## How to help

If you have ZK circuit experience: open an issue tagged `zk` and propose a pick-membership circuit. Constraints: must run in browser via snarkjs WASM, prove time < 5s on M-class laptops.
