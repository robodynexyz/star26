// Anon ID + pick submission. No auth, one UUID per browser, persisted in localStorage.

export type AnonId = string;

const STORAGE_KEY = "star26:anonId";
const PICKS_KEY = "star26:picks";

/**
 * Get or create the per-browser anon ID.
 * UUID v4, never leaves the device unless attached to a pick.
 */
export function getAnonId(): AnonId {
  if (typeof window === "undefined") return ""; // SSR — no id yet
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = generateUuidV4();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

/** Force a new anon ID. Wipes local pick history. Use only for "reset" UX. */
export function rotateAnonId(): AnonId {
  if (typeof window === "undefined") return "";
  window.localStorage.removeItem(PICKS_KEY);
  const id = generateUuidV4();
  window.localStorage.setItem(STORAGE_KEY, id);
  return id;
}

export interface Pick {
  matchId: string;
  teamId: string;
  confidence: number; // 0..1
  submittedAt: number; // epoch ms
}

export interface PickSubmission {
  anonId: AnonId;
  pick: Pick;
}

/**
 * Submit a pick. Optimistic — writes to localStorage immediately,
 * then POSTs to /api/picks. Returns the server-acknowledged pick.
 */
export async function submitPick(
  matchId: string,
  teamId: string,
  confidence: number,
): Promise<Pick> {
  if (confidence < 0 || confidence > 1) {
    throw new Error(`confidence must be in [0,1], got ${confidence}`);
  }
  const anonId = getAnonId();
  const pick: Pick = {
    matchId,
    teamId,
    confidence,
    submittedAt: Date.now(),
  };
  // Optimistic local store
  appendLocalPick(pick);

  const res = await fetch("/api/picks", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ anonId, pick } satisfies PickSubmission),
  });
  if (!res.ok) {
    throw new Error(`pick submission failed: ${res.status}`);
  }
  const ack = (await res.json()) as { pick: Pick };
  return ack.pick;
}

export function getLocalPicks(): Pick[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(PICKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Pick[];
  } catch {
    return [];
  }
}

function appendLocalPick(pick: Pick): void {
  const existing = getLocalPicks();
  // Replace if same match already picked
  const filtered = existing.filter((p) => p.matchId !== pick.matchId);
  filtered.push(pick);
  window.localStorage.setItem(PICKS_KEY, JSON.stringify(filtered));
}

// --- UUID v4 (no external dep) ---

function generateUuidV4(): string {
  // Prefer crypto.randomUUID where available (modern browsers + Node 19+)
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // Fallback: build v4 from random bytes
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
// feat(lib): add submitPick + local optimistic store @ 2026-05-08T22:02:22
// chore(ci): run CI on main + develop @ 2026-05-05T17:08:16
