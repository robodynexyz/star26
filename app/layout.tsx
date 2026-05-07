import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STAR26 — World Cup 2026 Prediction Market",
  description:
    "Anonymous picks, live Bayesian odds, knockout bracket. No wallet, no signup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
// feat(app): hero with motion fade-in @ 2026-05-07T15:42:56
