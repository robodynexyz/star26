import { Hero } from "@/components/Hero";
import { Bracket } from "@/components/Bracket";
import { Leaderboard } from "@/components/Leaderboard";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <Hero />
      <Bracket />
      <Leaderboard />
    </main>
  );
}
// feat(app): bootstrap app router layout @ 2026-05-09T11:49:03
