import { describe, test, expect } from "vitest";
import {
  updateOdds,
  headToHeadProb,
  brierScore,
  meanBrier,
  type TeamPrior,
  type MatchResult,
} from "../lib/odds";

describe("odds — Beta-Binomial update", () => {
  const priors: TeamPrior[] = [
    { teamId: "BRA", alpha: 8, beta: 2 }, // strong
    { teamId: "USA", alpha: 4, beta: 4 }, // average
    { teamId: "GHA", alpha: 2, beta: 6 }, // weak
  ];

  test("no matches → posterior equals prior mean", () => {
    const out = updateOdds(priors, []);
    expect(out.get("BRA")!.winProb).toBeCloseTo(0.8, 5);
    expect(out.get("USA")!.winProb).toBeCloseTo(0.5, 5);
    expect(out.get("GHA")!.winProb).toBeCloseTo(0.25, 5);
  });

  test("a win shifts posterior toward 1", () => {
    const results: MatchResult[] = [
      { matchId: "m1", winnerId: "USA", loserId: "GHA" },
    ];
    const out = updateOdds(priors, results);
    // USA was 4/8 → now 5/9
    expect(out.get("USA")!.winProb).toBeCloseTo(5 / 9, 5);
    // GHA was 2/8 → now 2/9
    expect(out.get("GHA")!.winProb).toBeCloseTo(2 / 9, 5);
  });

  test("draws are ignored for win-count updates", () => {
    const results: MatchResult[] = [
      { matchId: "m1", winnerId: "BRA", loserId: "USA", draw: true },
    ];
    const out = updateOdds(priors, results);
    expect(out.get("BRA")!.winProb).toBeCloseTo(0.8, 5);
    expect(out.get("USA")!.winProb).toBeCloseTo(0.5, 5);
  });

  test("matchesPlayed counts only decisive games", () => {
    const results: MatchResult[] = [
      { matchId: "m1", winnerId: "BRA", loserId: "USA" },
      { matchId: "m2", winnerId: "USA", loserId: "GHA" },
      { matchId: "m3", winnerId: "BRA", loserId: "GHA", draw: true },
    ];
    const out = updateOdds(priors, results);
    expect(out.get("BRA")!.matchesPlayed).toBe(1);
    expect(out.get("USA")!.matchesPlayed).toBe(2);
    expect(out.get("GHA")!.matchesPlayed).toBe(1);
  });

  test("variance shrinks as more data arrives", () => {
    const noData = updateOdds(priors, []);
    const results: MatchResult[] = Array.from({ length: 20 }, (_, i) => ({
      matchId: `m${i}`,
      winnerId: i % 2 === 0 ? "USA" : "GHA",
      loserId: i % 2 === 0 ? "GHA" : "USA",
    }));
    const lots = updateOdds(priors, results);
    expect(lots.get("USA")!.variance).toBeLessThan(noData.get("USA")!.variance);
  });
});

describe("head-to-head probability", () => {
  test("equal teams → 0.5", () => {
    const a = { teamId: "A", winProb: 0.5, variance: 0.01, matchesPlayed: 5 };
    const b = { teamId: "B", winProb: 0.5, variance: 0.01, matchesPlayed: 5 };
    expect(headToHeadProb(a, b)).toBeCloseTo(0.5, 5);
  });

  test("stronger team favored", () => {
    const a = { teamId: "A", winProb: 0.8, variance: 0.01, matchesPlayed: 5 };
    const b = { teamId: "B", winProb: 0.2, variance: 0.01, matchesPlayed: 5 };
    expect(headToHeadProb(a, b)).toBeCloseTo(0.8, 5);
  });

  test("both at zero → falls back to 0.5", () => {
    const a = { teamId: "A", winProb: 0, variance: 0, matchesPlayed: 0 };
    const b = { teamId: "B", winProb: 0, variance: 0, matchesPlayed: 0 };
    expect(headToHeadProb(a, b)).toBe(0.5);
  });
});

describe("Brier score", () => {
  test("perfect pick scores 0", () => {
    expect(brierScore(1, 1)).toBe(0);
    expect(brierScore(0, 0)).toBe(0);
  });

  test("totally wrong pick scores 1", () => {
    expect(brierScore(1, 0)).toBe(1);
    expect(brierScore(0, 1)).toBe(1);
  });

  test("hedge at 0.5 scores 0.25 either way", () => {
    expect(brierScore(0.5, 0)).toBeCloseTo(0.25, 5);
    expect(brierScore(0.5, 1)).toBeCloseTo(0.25, 5);
  });

  test("meanBrier averages over picks", () => {
    expect(meanBrier([0, 0.25, 1])).toBeCloseTo(1.25 / 3, 5);
  });

  test("meanBrier on empty array returns 0", () => {
    expect(meanBrier([])).toBe(0);
  });
});
// test(odds): draws ignored in win-count update @ 2026-04-13T20:01:22
// test(odds): variance approaches 0 with overwhelming data @ 2026-04-02T10:32:12
