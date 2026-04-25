// Knockout bracket tree. 16-team single elimination — R16, QF, SF, F.

import { headToHeadProb, type PosteriorOdds } from "./odds";

export interface BracketTeam {
  teamId: string;
  seed: number; // 1..16 from group-stage standings
}

export type Round = "R16" | "QF" | "SF" | "F";

export interface BracketNode {
  id: string;
  round: Round;
  left: BracketNode | BracketTeam;
  right: BracketNode | BracketTeam;
}

export interface NodeProb {
  nodeId: string;
  leftTeamId: string;
  rightTeamId: string;
  leftWinProb: number;
  rightWinProb: number;
}

/**
 * Build a balanced 16-team bracket using standard seeding:
 *   R16 pairings: (1,16), (8,9), (5,12), (4,13), (3,14), (6,11), (7,10), (2,15)
 */
export function buildBracket(teams: BracketTeam[]): BracketNode {
  if (teams.length !== 16) {
    throw new Error(`buildBracket expects 16 teams, got ${teams.length}`);
  }
  const bySeed = new Map(teams.map((t) => [t.seed, t]));
  const order = [1, 16, 8, 9, 5, 12, 4, 13, 3, 14, 6, 11, 7, 10, 2, 15];
  const r16Teams = order.map((s) => {
    const t = bySeed.get(s);
    if (!t) throw new Error(`missing seed ${s}`);
    return t;
  });

  const r16: BracketNode[] = [];
  for (let i = 0; i < 16; i += 2) {
    r16.push({
      id: `r16-${i / 2}`,
      round: "R16",
      left: r16Teams[i],
      right: r16Teams[i + 1],
    });
  }
  const qf: BracketNode[] = [];
  for (let i = 0; i < 8; i += 2) {
    qf.push({
      id: `qf-${i / 2}`,
      round: "QF",
      left: r16[i],
      right: r16[i + 1],
    });
  }
  const sf: BracketNode[] = [
    { id: "sf-0", round: "SF", left: qf[0], right: qf[1] },
    { id: "sf-1", round: "SF", left: qf[2], right: qf[3] },
  ];
  return { id: "final", round: "F", left: sf[0], right: sf[1] };
}

/**
 * Walk the bracket, compute conditional win probability at each node
 * using posterior team odds. Returns the per-node breakdown.
 */
export function nodeProbabilities(
  root: BracketNode,
  odds: Map<string, PosteriorOdds>,
): NodeProb[] {
  const out: NodeProb[] = [];
  computeNode(root, odds, out);
  return out;
}

interface NodeOutcome {
  teamProbs: Map<string, number>; // P(team reaches this node's "winner" slot)
}

function computeNode(
  node: BracketNode,
  odds: Map<string, PosteriorOdds>,
  out: NodeProb[],
): NodeOutcome {
  const left = isTeam(node.left)
    ? leafOutcome(node.left.teamId)
    : computeNode(node.left, odds, out);
  const right = isTeam(node.right)
    ? leafOutcome(node.right.teamId)
    : computeNode(node.right, odds, out);

  const merged = new Map<string, number>();
  let leftAggregate = 0;
  let rightAggregate = 0;

  for (const [leftTeam, leftP] of left.teamProbs) {
    for (const [rightTeam, rightP] of right.teamProbs) {
      const lOdds = odds.get(leftTeam);
      const rOdds = odds.get(rightTeam);
      if (!lOdds || !rOdds) continue;
      const pLeftWins = headToHeadProb(lOdds, rOdds);
      const joint = leftP * rightP;
      addProb(merged, leftTeam, joint * pLeftWins);
      addProb(merged, rightTeam, joint * (1 - pLeftWins));
      leftAggregate += joint * pLeftWins;
      rightAggregate += joint * (1 - pLeftWins);
    }
  }

  const leftTopTeam = topTeam(left.teamProbs);
  const rightTopTeam = topTeam(right.teamProbs);
  out.push({
    nodeId: node.id,
    leftTeamId: leftTopTeam,
    rightTeamId: rightTopTeam,
    leftWinProb: leftAggregate,
    rightWinProb: rightAggregate,
  });

  return { teamProbs: merged };
}

function leafOutcome(teamId: string): NodeOutcome {
  return { teamProbs: new Map([[teamId, 1]]) };
}

function addProb(m: Map<string, number>, key: string, val: number): void {
  m.set(key, (m.get(key) ?? 0) + val);
}

function topTeam(m: Map<string, number>): string {
  let best = "";
  let bestP = -Infinity;
  for (const [team, p] of m) {
    if (p > bestP) {
      best = team;
      bestP = p;
    }
  }
  return best;
}

function isTeam(x: BracketNode | BracketTeam): x is BracketTeam {
  return (x as BracketTeam).seed !== undefined;
}
// fix(lib): UUID fallback for environments without crypto.randomUUID @ 2026-04-25T10:24:19
