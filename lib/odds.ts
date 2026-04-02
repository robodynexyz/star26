// Bayesian odds engine. Beta-Binomial conjugate update on team win counts.
//
// Prior: Beta(alpha0, beta0) per team, seeded from FIFA Elo + bookmaker odds blend.
// Likelihood: Binomial — each match is a Bernoulli trial.
// Posterior: Beta(alpha0 + wins, beta0 + losses).
// Posterior mean = (alpha0 + wins) / (alpha0 + beta0 + wins + losses).

export interface TeamPrior {
  teamId: string;
  alpha: number; // pseudo-wins
  beta: number; // pseudo-losses
}

export interface MatchResult {
  matchId: string;
  winnerId: string;
  loserId: string;
  // ignored if draw — group stage handles draws separately
  draw?: boolean;
}

export interface PosteriorOdds {
  teamId: string;
  winProb: number;
  variance: number;
  matchesPlayed: number;
}

/**
 * Update team posteriors with observed match results.
 * Pure function — returns a new map, does not mutate input.
 */
export function updateOdds(
  priors: TeamPrior[],
  results: MatchResult[],
): Map<string, PosteriorOdds> {
  const out = new Map<string, PosteriorOdds>();
  const counts = new Map<string, { wins: number; losses: number }>();

  for (const r of results) {
    if (r.draw) continue;
    incr(counts, r.winnerId, "wins");
    incr(counts, r.loserId, "losses");
  }

  for (const prior of priors) {
    const c = counts.get(prior.teamId) ?? { wins: 0, losses: 0 };
    const alpha = prior.alpha + c.wins;
    const beta = prior.beta + c.losses;
    const mean = alpha / (alpha + beta);
    const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1));
    out.set(prior.teamId, {
      teamId: prior.teamId,
      winProb: mean,
      variance,
      matchesPlayed: c.wins + c.losses,
    });
  }

  return out;
}

/**
 * Head-to-head win probability given two posteriors.
 * Approximation: P(A beats B) ≈ p_A / (p_A + p_B) — Bradley-Terry style.
 * Good enough for bracket conditional probs; exact form requires integration over Beta posteriors.
 */
export function headToHeadProb(a: PosteriorOdds, b: PosteriorOdds): number {
  const total = a.winProb + b.winProb;
  if (total <= 0) return 0.5;
  return a.winProb / total;
}

/**
 * Brier score for a single pick: (predicted - actual)^2.
 * Lower is better. Sum across picks for total Brier.
 */
export function brierScore(predicted: number, actual: 0 | 1): number {
  return (predicted - actual) ** 2;
}

/** Aggregate Brier over many picks. Returns mean Brier — comparable across users. */
export function meanBrier(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((s, x) => s + x, 0) / scores.length;
}

function incr(
  m: Map<string, { wins: number; losses: number }>,
  key: string,
  field: "wins" | "losses",
): void {
  const cur = m.get(key) ?? { wins: 0, losses: 0 };
  cur[field]++;
  m.set(key, cur);
}
// fix(lib): picks — guard SSR window access @ 2026-05-14T12:56:54
// fix(lib): odds — sentinel for total<=0 in head-to-head @ 2026-04-20T20:22:34
// refactor(lib): extract addProb helper in bracket @ 2026-04-11T10:33:52
// feat(lib): Brier score + meanBrier aggregator @ 2026-04-03T17:26:16
// feat(lib): Beta-Binomial odds engine @ 2026-05-14T13:54:04
// feat(lib): variance computation for posterior odds @ 2026-04-29T19:03:27
// refactor(lib): isTeam type guard for bracket nodes @ 2026-05-07T17:34:55
// feat(lib): nodeProbabilities walks bracket with conditional probs @ 2026-04-14T18:38:03
// feat(lib): variance computation for posterior odds @ 2026-04-17T19:50:44
// feat(lib): Beta-Binomial odds engine @ 2026-04-30T13:46:50
// fix(lib): odds — falls back to 0.5 when both teams at zero @ 2026-04-02T16:38:58
