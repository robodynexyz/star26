import { NextResponse } from "next/server";
import type { PickSubmission } from "@/lib/picks";

// Edge-friendly. In-memory store is per-instance; production wires to Vercel Blob.
const submissions = new Map<string, PickSubmission["pick"][]>();

export async function POST(req: Request) {
  let body: PickSubmission;
  try {
    body = (await req.json()) as PickSubmission;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.anonId || !body.pick) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const existing = submissions.get(body.anonId) ?? [];
  const filtered = existing.filter((p) => p.matchId !== body.pick.matchId);
  filtered.push(body.pick);
  submissions.set(body.anonId, filtered);
  return NextResponse.json({ pick: body.pick });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const anonId = url.searchParams.get("anonId");
  if (!anonId) {
    return NextResponse.json({ error: "anonId required" }, { status: 400 });
  }
  return NextResponse.json({ picks: submissions.get(anonId) ?? [] });
}
