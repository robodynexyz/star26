export function Leaderboard() {
  return (
    <section className="py-12">
      <h2 className="mb-6 text-2xl font-semibold">Leaderboard</h2>
      <p className="text-zinc-500">
        Ranked by mean Brier score. Lower is better — calibration matters more
        than guessing right.
      </p>
    </section>
  );
}

// TODO: wire SortDropdown, Paginator
