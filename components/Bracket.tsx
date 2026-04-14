"use client";

import { useMemo } from "react";
import { buildBracket, nodeProbabilities, type BracketTeam } from "@/lib/bracket";
import type { PosteriorOdds } from "@/lib/odds";

interface Props {
  teams?: BracketTeam[];
  odds?: Map<string, PosteriorOdds>;
}

const PLACEHOLDER_TEAMS: BracketTeam[] = Array.from({ length: 16 }, (_, i) => ({
  teamId: `TEAM${i + 1}`,
  seed: i + 1,
}));

export function Bracket({ teams = PLACEHOLDER_TEAMS, odds }: Props) {
  const probs = useMemo(() => {
    if (!odds) return null;
    const root = buildBracket(teams);
    return nodeProbabilities(root, odds);
  }, [teams, odds]);

  return (
    <section className="py-12">
      <h2 className="mb-6 text-2xl font-semibold">Knockout bracket</h2>
      {probs ? (
        <ul className="space-y-2 text-sm text-zinc-300">
          {probs.map((p) => (
            <li key={p.nodeId} className="flex justify-between">
              <span>
                {p.leftTeamId} vs {p.rightTeamId}
              </span>
              <span className="font-mono">
                {(p.leftWinProb * 100).toFixed(1)}% /{" "}
                {(p.rightWinProb * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-zinc-500">Bracket activates after group stage.</p>
      )}
    </section>
  );
}
